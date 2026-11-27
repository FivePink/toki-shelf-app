import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import type { ShelfContentPackage } from '../contract';
import type { ShelfLayout } from '../layout';
import type { ShelfTheme } from '../theme';
import type { ErrorPayload, ListPayload } from './contentController';

type Props = {
  content: ShelfContentPackage | null;
  theme: ShelfTheme;
  layout: ShelfLayout;
  onAction: (actionId: string, contentId?: string) => void;
};

function Actions({
  content,
  theme,
  layout,
  onAction,
}: Props & { content: ShelfContentPackage }) {
  if (!content.actions?.length) return null;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.gap / 2 }}>
      {content.actions.map((action) => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={() => onAction(action.id, content.id)}
          style={{
            paddingHorizontal: layout.gap,
            paddingVertical: layout.gap / 1.5,
            borderRadius: layout.radius / 2,
            borderWidth: 1,
            borderColor: theme.line,
            backgroundColor: theme.surface,
          }}
        >
          <Text style={{ color: theme.ink, fontSize: 13 }}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function ContentSlotView({ content, theme, layout, onAction }: Props) {
  if (!content) return null;

  const padding = layout.inset;

  if (content.kind === 'loading') {
    return (
      <View
        testID="contentLoading"
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: layout.gap }}
      >
        <ActivityIndicator color={theme.muted} />
        <Text style={{ color: theme.muted, fontSize: 13 }}>正在载入…</Text>
      </View>
    );
  }

  if (content.kind === 'empty') {
    const { title } = content.payload as { title?: string };
    return (
      <View
        testID="contentEmpty"
        style={{ flex: 1, padding, gap: layout.gap, justifyContent: 'center' }}
      >
        <Text style={{ color: theme.ink, fontSize: 17, fontWeight: '600' }}>
          {title ?? '内容'} · 空
        </Text>
        <Text style={{ color: theme.muted, fontSize: 13 }}>还没有内容。</Text>
        <Actions content={content} theme={theme} layout={layout} onAction={onAction} />
      </View>
    );
  }

  if (content.kind === 'error') {
    const { message } = content.payload as ErrorPayload;
    return (
      <View
        testID="contentError"
        style={{ flex: 1, padding, gap: layout.gap, justifyContent: 'center' }}
      >
        <Text style={{ color: theme.ink, fontSize: 17, fontWeight: '600' }}>载入失败</Text>
        <Text style={{ color: theme.muted, fontSize: 13 }}>{message}</Text>
        <Actions content={content} theme={theme} layout={layout} onAction={onAction} />
      </View>
    );
  }

  if (content.kind === 'list') {
    const { title, batch, items } = content.payload as ListPayload;
    return (
      <ScrollView
        testID="contentList"
        contentContainerStyle={{ padding, gap: layout.gap }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 2 }}>
          <Text style={{ color: theme.ink, fontSize: 20, fontWeight: '700' }}>{title}</Text>
          <Text style={{ color: theme.muted, fontSize: 12 }}>
            演示内容 · 第 {batch + 1} 批 · {items.length} 条
          </Text>
        </View>

        {items.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: theme.surface,
              borderRadius: layout.radius / 1.5,
              paddingHorizontal: layout.gap,
              paddingVertical: layout.gap,
              borderWidth: 1,
              borderColor: theme.line,
              gap: 2,
            }}
          >
            <Text style={{ color: theme.ink, fontSize: 15, fontWeight: '600' }}>
              {item.title}
            </Text>
            <Text style={{ color: theme.muted, fontSize: 12 }}>{item.meta}</Text>
          </View>
        ))}

        <Actions content={content} theme={theme} layout={layout} onAction={onAction} />
      </ScrollView>
    );
  }

  return (
    <View testID="contentUnknown" style={{ flex: 1, padding, justifyContent: 'center' }}>
      <Text style={{ color: theme.muted, fontSize: 13 }}>
        未识别的内容类型：{content.kind}
      </Text>
    </View>
  );
}
