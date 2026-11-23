import type { ShelfTabDefinition } from './contract';
import type { ShelfLayout, ShelfPagerConfig } from './layout';
import type { ShelfTheme } from './theme';

export type ShelfPreset<T extends string = string> = {
  layout: ShelfLayout;
  pager: ShelfPagerConfig;
  light: ShelfTheme;
  dark: ShelfTheme;
  tabs: readonly ShelfTabDefinition<T>[];
};
