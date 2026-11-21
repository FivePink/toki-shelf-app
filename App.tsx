import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
import {
  DIMS,
  darkTheme,
  lightTheme,
  type TabId,
  type ThemeTokens,
} from './src/tokens';

type Page = 0 | 1;

function Shelf() {
  const scheme = useColorScheme();
  const theme: ThemeTokens = scheme === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<TabId>('calendar');
  const [page, setPage] = useState<Page>(0);
  const wide = width >= DIMS.wideMin;

  if (wide) {
    return (
      <View style={[styles.wideRoot, { backgroundColor: theme.bg }]}>
        <View style={{ width: DIMS.wideChatPane }}>
          <ChatPane
            theme={theme}
            safeBottom={insets.bottom}
            selectedTab={tab}
            onBack={() => setPage(0)}
            showBack={false}
          />
        </View>
        <View style={{ width: DIMS.divider, backgroundColor: theme.line }} />
        <View style={[styles.page, { backgroundColor: theme.bg }]}>
          <View testID="contentSlot" style={styles.slot} />
          <BottomTabBar
            selected={tab}
            onSelect={setTab}
            onChatOpen={() => setPage(1)}
            theme={theme}
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
        onPageChange={setPage}
        home={
          <View style={[styles.page, { backgroundColor: theme.bg }]}>
            <View testID="contentSlot" style={styles.slot} />
            <BottomTabBar
              selected={tab}
              onSelect={setTab}
              onChatOpen={() => setPage(1)}
              theme={theme}
              safeBottom={insets.bottom}
              showChatFab
            />
          </View>
        }
        chat={
          <ChatPane
            theme={theme}
            safeBottom={insets.bottom}
            selectedTab={tab}
            onBack={() => setPage(0)}
            showBack
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
