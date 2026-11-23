import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ShelfSlot } from '../shelf/ShelfSlot';
import type { ShelfRuntime } from '../shelf/contract';
import type { ShelfLayout } from '../shelf/layout';
import type { ShelfTheme } from '../shelf/theme';

export function ChatPane({
  theme,
  layout,
  runtime,
  safeBottom,
  onBack,
  showBack,
  backIcon,
  style,
}: {
  theme: ShelfTheme;
  layout: ShelfLayout;
  runtime: ShelfRuntime;
  safeBottom: number;
  onBack: () => void;
  showBack: boolean;
  backIcon: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      testID="chatPane"
      style={[styles.pane, { backgroundColor: theme.chatBg }, style]}
    >
      <ShelfSlot
        runtime={runtime}
        slot="chatContentSlot"
        testID="chatContentSlot"
        style={styles.slot}
      />
      {showBack ? (
        <Pressable
          testID="chatBack"
          accessibilityRole="button"
          accessibilityLabel="返回"
          onPress={onBack}
          style={({ pressed }) => [
            styles.back,
            {
              left: layout.inset,
              bottom: layout.bottomGap + safeBottom,
              width: layout.control,
              height: layout.control,
              borderRadius: layout.radius,
              backgroundColor: theme.chatButtonBg,
              shadowColor: theme.shadowColor,
            },
            pressed && styles.pressed,
          ]}
        >
          {backIcon}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pane: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 1,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
