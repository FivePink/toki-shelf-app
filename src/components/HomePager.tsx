import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

import { PAGER, type ThemeTokens } from '../tokens';

type Page = 0 | 1;

export function HomePager({
  page,
  width,
  theme,
  onPageChange,
  home,
  chat,
}: {
  page: Page;
  width: number;
  theme: ThemeTokens;
  onPageChange: (page: Page) => void;
  home: React.ReactNode;
  chat: React.ReactNode;
}) {
  const offset = useRef(new Animated.Value(page)).current;
  const offsetRef = useRef<number>(page);
  const pageRef = useRef<Page>(page);
  const widthRef = useRef(width);
  const startOffset = useRef(0);
  const touchStart = useRef({ x: 0, y: 0 });
  const lastX = useRef(0);
  const lastT = useRef(0);
  const velocity = useRef(0);
  const spring = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  useEffect(() => {
    const id = offset.addListener(({ value }) => {
      offsetRef.current = value;
    });
    return () => offset.removeListener(id);
  }, [offset]);

  const setOffset = (value: number) => {
    const clamped = Math.min(1, Math.max(0, value));
    offsetRef.current = clamped;
    offset.setValue(clamped);
  };

  const animateTo = (target: Page) => {
    spring.current?.stop();
    pageRef.current = target;
    const animation = Animated.spring(offset, {
      toValue: target,
      ...PAGER.spring,
      useNativeDriver: true,
    });
    spring.current = animation;
    animation.start(({ finished }) => {
      if (!finished) return;
      offsetRef.current = target;
      onPageChange(target);
    });
  };

  useEffect(() => {
    if (page !== pageRef.current) {
      animateTo(page);
    }
    // animateTo intentionally uses refs and the stable setter from App.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const pan = useMemo(() => {
    const settle = () => {
      const w = widthRef.current || 1;
      const projected = Math.min(
        1,
        Math.max(
          0,
          offsetRef.current -
            (velocity.current * PAGER.momentumSeconds * 1000) / w,
        ),
      );
      const target: Page = Math.abs(projected) < Math.abs(projected - 1) ? 0 : 1;
      animateTo(target);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: (event) => {
        touchStart.current = {
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        };
        return false;
      },
      onMoveShouldSetPanResponder: (_, gesture) => {
        const w = widthRef.current;
        if (w <= 0) return false;
        const fromPage: Page = offsetRef.current >= 0.5 ? 1 : 0;
        const start = touchStart.current;
        const dx = gesture.moveX - start.x;
        const dy = gesture.moveY - start.y;
        const onEdge =
          fromPage === 0
            ? start.x >= w - PAGER.edgeSwipeWidth
            : start.x <= PAGER.edgeSwipeWidth;
        if (!onEdge) return false;
        if (fromPage === 0 && dx > 0) return false;
        if (fromPage === 1 && dx < 0) return false;
        if (
          Math.abs(dy) >= PAGER.directionLockY &&
          Math.abs(dy) > Math.abs(dx)
        ) {
          return false;
        }
        return (
          Math.abs(dx) >= PAGER.activationX &&
          Math.abs(dx) > Math.abs(dy) * PAGER.directionRatio
        );
      },
      onPanResponderGrant: (_, gesture) => {
        spring.current?.stop();
        startOffset.current = offsetRef.current;
        lastX.current = gesture.moveX;
        lastT.current = Date.now();
        velocity.current = 0;
        const w = widthRef.current || 1;
        setOffset(
          startOffset.current -
            (gesture.moveX - touchStart.current.x) / w,
        );
      },
      onPanResponderMove: (_, gesture) => {
        const now = Date.now();
        const dt = Math.max(1, now - lastT.current);
        const sample = (gesture.moveX - lastX.current) / dt;
        velocity.current = velocity.current * 0.7 + sample * 0.3;
        lastX.current = gesture.moveX;
        lastT.current = now;
        const w = widthRef.current || 1;
        setOffset(
          startOffset.current -
            (gesture.moveX - touchStart.current.x) / w,
        );
      },
      onPanResponderRelease: settle,
      onPanResponderTerminate: settle,
      onPanResponderTerminationRequest: () => false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const w = Math.max(width, 1);
  const homeTranslate = offset.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -w],
  });
  const chatTranslate = offset.interpolate({
    inputRange: [0, 1],
    outputRange: [w, 0],
  });

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]} {...pan.panHandlers}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateX: homeTranslate }] }]}
        pointerEvents={page === 0 ? 'auto' : 'none'}
        accessibilityElementsHidden={page !== 0}
        importantForAccessibility={page === 0 ? 'auto' : 'no-hide-descendants'}
      >
        {home}
      </Animated.View>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateX: chatTranslate }] }]}
        pointerEvents={page === 1 ? 'auto' : 'none'}
        accessibilityElementsHidden={page !== 1}
        importantForAccessibility={page === 1 ? 'auto' : 'no-hide-descendants'}
      >
        {chat}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
});
