export type ShelfLayout = {
  inset: number;
  control: number;
  gap: number;
  bottomGap: number;
  radius: number;
  tabRadius: number;
  tabPadding: number;
  iconBox: number;
  segmentedMax: number;
  wideMin: number;
  wideChatPane: number;
  divider: number;
  // 底栏（Tab 组 + 聊天入口）整行的最大宽度，dp。窗口更宽时整行居中、不再拉伸；
  // 只在窗口宽于该值时才生效，参考机 392.7dp 不触发。
  rowMax: number;
};

export type ShelfPagerConfig = {
  edgeSwipeWidth: number;
  directionLockY: number;
  activationX: number;
  directionRatio: number;
  momentumSeconds: number;
  spring: {
    damping: number;
    mass: number;
    stiffness: number;
    overshootClamping: boolean;
  };
};
