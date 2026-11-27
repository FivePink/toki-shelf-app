/**
 * 演示内容总开关。
 *
 * 默认关闭：外壳只保留底栏，内容槽留空（用户 2026-11-28 要求）。
 * 需要复现 P5 的列表/空/失败四态时改为 true，再把 App.tsx 重新跑一遍即可，
 * 内容管线本身不需要改动。
 */
export const ENABLE_DEMO_CONTENT = false;
