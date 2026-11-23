import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { BottomTabBar } from './src/components/BottomTabBar';
import { ChatPane } from './src/components/ChatPane';
import { HomePager } from './src/components/HomePager';
import { ChatEntryIcon, TabIcon } from './src/icons';
import { ACTIVE_PRESET } from './src/config';
import { ShelfRuntime } from './src/shelf/contract';
import { ShelfSlot } from './src/shelf/ShelfSlot';
import type { TabId } from './src/toki/config';
import type { ShelfTheme } from './src/shelf/theme';

type Page = 0 | 1;

function Shelf() {
  const scheme = useColorScheme();
  const { layout, pager, light, dark, tabs } = ACTIVE_PRESET;
  const theme: ShelfTheme =
    scheme === 'dark' ? dark : light;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<TabId>('calendar');
  const [page, setPage] = useState<Page>(0);
  const wide = width >= layout.wideMin;
  const shelf = useMemo(() => new ShelfRuntime(), []);
  const tabRef = useRef(tab);
  const previousPage = useRef<Page>(page);

  useEffect(() => {
    tabRef.current = tab;
  }, [tab]);

  useEffect(() => {
    shelf.emit({
      type: 'theme.change',
      mode: scheme === 'dark' ? 'dark' : 'light',
    });
  }, [scheme, shelf]);

  useEffect(() => {
    if (previousPage.current === page) return;
    previousPage.current = page;
    if (page === 1) {
      shelf.emit({ type: 'chat.open', fromTabId: tabRef.current });
    } else {
      shelf.emit({ type: 'chat.close', toTabId: tabRef.current });
    }
  }, [page, shelf]);

  const selectTab = (next: TabId) => {
    if (next === tab) return;
    shelf.emit({ type: 'tab.select', tabId: next, previousTabId: tab });
    setTab(next);
  };

  const renderTabIcon = (id: TabId, selected: boolean) => (
    <TabIcon
      id={id}
      selected={selected}
      color={theme.ink}
      size={layout.iconBox}
    />
  );

  const chatIcon = <ChatEntryIcon color={theme.ink} size={layout.iconBox - 2} />;

  const backIcon = (
    <TabIcon
      id={tab}
      selected
      color={theme.chatButtonInk}
      size={layout.iconBox}
    />
  );

  if (wide) {
    return (
      <View style={[styles.wideRoot, { backgroundColor: theme.bg }]}>
        <View style={{ width: layout.wideChatPane }}>
          <ChatPane
            theme={theme}
            layout={layout}
            runtime={shelf}
            safeBottom={insets.bottom}
            onBack={() => setPage(0)}
            showBack={false}
            backIcon={backIcon}
          />
        </View>
        <View style={{ width: layout.divider, backgroundColor: theme.line }} />
        <View style={[styles.page, { backgroundColor: theme.bg }]}>
          <ShelfSlot
            runtime={shelf}
            slot="contentSlot"
            testID="contentSlot"
            style={styles.slot}
          />
          <BottomTabBar
            items={tabs}
            selected={tab}
            onSelect={selectTab}
            onChatOpen={() => setPage(1)}
            renderIcon={renderTabIcon}
            chatIcon={chatIcon}
            theme={theme}
            layout={layout}
            safeBottom={insets.bottom}
            showChatFab={false}
          />
        </View>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HomePager
        page={page}
        width={width}
        theme={theme}
        pager={pager}
        onPageChange={setPage}
        home={
          <View style={[styles.page, { backgroundColor: theme.bg }]}>
            <ShelfSlot
              runtime={shelf}
              slot="contentSlot"
              testID="contentSlot"
              style={styles.slot}
            />
            <BottomTabBar
              items={tabs}
              selected={tab}
              onSelect={selectTab}
              onChatOpen={() => setPage(1)}
              renderIcon={renderTabIcon}
              chatIcon={chatIcon}
              theme={theme}
              layout={layout}
              safeBottom={insets.bottom}
              showChatFab
            />
          </View>
        }
        chat={
          <ChatPane
            theme={theme}
            layout={layout}
            runtime={shelf}
            safeBottom={insets.bottom}
            onBack={() => setPage(0)}
            showBack
            backIcon={backIcon}
          />
        }
      />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Shelf />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  wideRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
});
