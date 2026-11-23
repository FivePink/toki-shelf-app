import { ALT_PRESET } from './presets/alt/config';
import type { ShelfPreset } from './shelf/preset';
import {
  TOKI_DARK_THEME,
  TOKI_LIGHT_THEME,
  TOKI_LAYOUT,
  TOKI_PAGER,
  TOKI_TABS,
  type TabId,
} from './toki/config';

const TOKI_PRESET: ShelfPreset<TabId> = {
  layout: TOKI_LAYOUT,
  pager: TOKI_PAGER,
  light: TOKI_LIGHT_THEME,
  dark: TOKI_DARK_THEME,
  tabs: TOKI_TABS,
};

const requested = process.env.EXPO_PUBLIC_SHELF_PRESET;

export const ACTIVE_PRESET: ShelfPreset<TabId> =
  requested === 'alt' ? ALT_PRESET : TOKI_PRESET;
