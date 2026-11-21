import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ChatEntryIcon } from '../icons';
import { DIMS, type ThemeTokens } from '../tokens';

export function ChatFab({
  theme,
  onPress,
}: {
  theme: ThemeTokens;
  onPress: () => void;
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
          backgroundColor: theme.tabbar,
          shadowColor: theme.shadowColor,
        },
        pressed && styles.pressed,
      ]}
    >
      <ChatEntryIcon color={theme.ink} size={26} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
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
