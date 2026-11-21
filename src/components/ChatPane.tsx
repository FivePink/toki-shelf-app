import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { TabIcon } from '../icons';
import { DIMS, type TabId, type ThemeTokens } from '../tokens';

export function ChatPane({
  theme,
  safeBottom,
  selectedTab,
  onBack,
  showBack,
  style,
}: {
  theme: ThemeTokens;
  safeBottom: number;
  selectedTab: TabId;
  onBack: () => void;
  showBack: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      testID="chatPane"
      style={[styles.pane, { backgroundColor: theme.chatBg }, style]}
    >
      <View testID="chatContentSlot" style={styles.slot} />
      {showBack ? (
        <Pressable
          testID="chatBack"
          accessibilityRole="button"
          accessibilityLabel="返回"
          onPress={onBack}
          style={({ pressed }) => [
            styles.back,
            {
              left: DIMS.inset,
              bottom: DIMS.bottomGap + safeBottom,
              backgroundColor: theme.chatButtonBg,
              shadowColor: theme.shadowColor,
            },
            pressed && styles.pressed,
          ]}
        >
          <TabIcon
            id={selectedTab}
            selected
            color={theme.chatButtonInk}
            size={DIMS.iconBox}
          />
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
    width: DIMS.control,
    height: DIMS.control,
    borderRadius: DIMS.radius,
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
