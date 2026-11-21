import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { TabIcon } from '../icons';
import { DIMS, TABS, type TabId, type ThemeTokens } from '../tokens';
import { ChatFab } from './ChatFab';

export function BottomTabBar({
  selected,
  onSelect,
  onChatOpen,
  theme,
  safeBottom,
  showChatFab,
}: {
  selected: TabId;
  onSelect: (id: TabId) => void;
  onChatOpen: () => void;
  theme: ThemeTokens;
  safeBottom: number;
  showChatFab: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        {
          paddingHorizontal: DIMS.inset,
          paddingBottom: DIMS.bottomGap + safeBottom,
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
            maxWidth: showChatFab ? undefined : DIMS.segmentedMax,
          },
        ]}
      >
        {TABS.map((tab) => {
          const isSelected = tab.id === selected;
          return (
            <Pressable
              key={tab.id}
              testID={`tab-${tab.id}`}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(tab.id)}
              style={({ pressed }) => [
                styles.tab,
                isSelected && { backgroundColor: theme.tabSelected },
                pressed && styles.pressed,
              ]}
            >
              <TabIcon
                id={tab.id}
                selected={isSelected}
                color={theme.ink}
                size={DIMS.iconBox}
              />
            </Pressable>
          );
        })}
      </View>
      {showChatFab ? (
        <ChatFab theme={theme} onPress={onChatOpen} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DIMS.gap,
  },
  group: {
    flex: 1,
    height: DIMS.control,
    borderRadius: DIMS.radius,
    padding: DIMS.tabPadding,
    flexDirection: 'row',
    shadowOpacity: 1,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  tab: {
    flex: 1,
    borderRadius: DIMS.tabRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
