export type TabId = 'calendar' | 'todo' | 'trigger';

export type ThemeTokens = {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  tabbar: string;
  tabSelected: string;
  chatBg: string;
  chatButtonBg: string;
  chatButtonInk: string;
  shadowColor: string;
};

export const lightTheme: ThemeTokens = {
  bg: '#F6F7F8',
  surface: '#FFFFFF',
  ink: '#1B1C1E',
  muted: '#8A8B8D',
  line: '#E9EAEB',
  tabbar: '#FFFFFF',
  tabSelected: '#F6F7F8',
  chatBg: '#F6F7F8',
  chatButtonBg: '#FFFFFF',
  chatButtonInk: '#1B1C1E',
  shadowColor: 'rgba(31,34,37,0.12)',
};

export const darkTheme: ThemeTokens = {
  bg: '#1C1C1E',
  surface: '#2C2C2E',
  ink: '#F2F2F7',
  muted: '#9A9AA0',
  line: '#3A3A3C',
  tabbar: '#2C2C2E',
  tabSelected: '#3A3A3C',
  chatBg: '#262626',
  chatButtonBg: '#545454',
  chatButtonInk: '#F6F7F8',
  shadowColor: 'rgba(0,0,0,0.4)',
};

export const DIMS = {
  inset: 20,
  control: 64,
  gap: 12,
  bottomGap: 8,
  radius: 32,
  tabRadius: 28,
  tabPadding: 4,
  iconBox: 28,
  segmentedMax: 298,
  wideMin: 850,
  wideChatPane: 390,
  divider: 1,
} as const;

export const PAGER = {
  edgeSwipeWidth: 56,
  directionLockY: 12,
  activationX: 15,
  directionRatio: 1.08,
  momentumSeconds: 0.2,
  spring: {
    damping: 34,
    mass: 1,
    stiffness: 340,
    overshootClamping: true,
  },
} as const;

export const TABS: readonly { id: TabId; label: string }[] = [
  { id: 'calendar', label: '日历' },
  { id: 'todo', label: 'To-do' },
  { id: 'trigger', label: 'Trigger' },
];
