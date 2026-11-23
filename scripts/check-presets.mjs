import { ALT_PRESET } from '../src/presets/alt/config.ts';
import {
  TOKI_LAYOUT,
  TOKI_LIGHT_THEME,
  TOKI_PAGER,
} from '../src/toki/config.ts';

const checks = {
  layout: TOKI_LAYOUT.control !== ALT_PRESET.layout.control,
  theme: TOKI_LIGHT_THEME.bg !== ALT_PRESET.light.bg,
  pager: TOKI_PAGER.directionRatio !== ALT_PRESET.pager.directionRatio,
  tabs: TOKI_LAYOUT.segmentedMax !== ALT_PRESET.layout.segmentedMax,
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failed.length > 0) {
  throw new Error(`preset check failed: ${failed.join(', ')}`);
}

console.log('presets OK');
console.log(JSON.stringify(checks));
