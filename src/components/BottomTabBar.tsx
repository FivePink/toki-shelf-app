import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { ShelfTabDefinition } from '../shelf/contract';
import type { ShelfLayout } from '../shelf/layout';
import type { ShelfTheme } from '../shelf/theme';
import { ChatFab } from './ChatFab';

export function BottomTabBar<T extends string>({
  items,
  selected,
  onSelect,
  onChatOpen,
  renderIcon,
  chatIcon,
  theme,
  layout,
  safeBottom,
  showChatFab,
}: {
  items: readonly ShelfTabDefinition<T>[];
  selected: T;
  onSelect: (id: T) => void;
  onChatOpen: () => void;
  renderIcon: (id: T, selected: boolean) => React.ReactNode;
  chatIcon: React.ReactNode;
  theme: ShelfTheme;
  layout: ShelfLayout;
  safeBottom: number;
  showChatFab: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        {
          gap: layout.gap,
          paddingHorizontal: layout.inset,
          paddingBottom: layout.bottomGap + safeBottom,
        },
      ]}
    >
      <View
        testID="tabGroup"
        style={[
          styles.group,
          {
            backgroundColor: theme.tabbar,
            shadowColor: theme.shadowColor,
            borderRadius: layout.radius,
            padding: layout.tabPadding,
            height: layout.control,
            maxWidth: showChatFab ? undefined : layout.segmentedMax,
          },
        ]}
      >
        {items.map((tab) => {
          const isSelected = tab.id === selected;
          return (
            <Pressable
              key={tab.id}
              testID={`tab-${tab.id}`}
              accessibilityRole="button"
              accessibilityLabel={tab.accessibilityLabel ?? tab.label}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(tab.id)}
              style={({ pressed }) => [
                styles.tab,
                { borderRadius: layout.tabRadius },
                isSelected && { backgroundColor: theme.tabSelected },
                pressed && styles.pressed,
              ]}
            >
              {renderIcon(tab.id, isSelected)}
            </Pressable>
          );
        })}
      </View>
      {showChatFab ? (
        <ChatFab
          theme={theme}
          layout={layout}
          onPress={onChatOpen}
          icon={chatIcon}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  group: {
    flex: 1,
    flexDirection: 'row',
    shadowOpacity: 1,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
