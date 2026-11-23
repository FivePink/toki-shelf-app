import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import type { ShelfLayout } from '../shelf/layout';
import type { ShelfTheme } from '../shelf/theme';

export function ChatFab({
  theme,
  layout,
  onPress,
  icon,
}: {
  theme: ShelfTheme;
  layout: ShelfLayout;
  onPress: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Pressable
      testID="chatFab"
      accessibilityRole="button"
      accessibilityLabel="聊天"
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        {
          width: layout.control,
          height: layout.control,
          borderRadius: layout.radius,
          backgroundColor: theme.tabbar,
          shadowColor: theme.shadowColor,
        },
        pressed && styles.pressed,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
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
