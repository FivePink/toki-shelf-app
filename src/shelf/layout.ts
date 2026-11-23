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
