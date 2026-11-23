# 复用清单

## 优先复用

| 资产 | 路径 | 复用方式 | 状态 |
|---|---|---|---|
| 货架契约 | `src/shelf/contract.ts` | 事件、内容包、槽位绑定 | 已实现 |
| 内容槽 | `src/shelf/ShelfSlot.tsx` | 管线向槽位渲染内容 | 已实现，空数据 |
| 底栏与聊天外壳 | `src/components/` | 换 Tab、图标和内容 | 可用，TOKI 适配 |
| 几何与主题配置 | `src/toki/config.ts` | 通过 `layout` / `theme` 注入货架 | 已实现 |
| 通用布局类型 | `src/shelf/layout.ts`、`src/shelf/theme.ts` | 第二套 App 换配置即可 | 已实现 |
| 第二套预设 | `src/presets/alt/config.ts` | `Paper Compact`：56dp 控件、不同主题与翻页参数 | 真机已验证 |
| 案例模板 | `docs/CASE_TEMPLATE.md` | 新 App 按同一格式解剖 | 可用 |
| 本清单 | `docs/REUSE_MAP.md` | 判断什么该抽、什么不该抽 | 可用 |

## 暂不抽成通用包

| 资产 | 原因 |
|---|---|
| `HomePager` | 写死首页/聊天两页和边缘手势，是 TOKI 专用适配器 |
| `ChatPane` 左下返回圆钮 | TOKI Composer 的位置和行为约定 |
| TOKI 图标与截图 | 只能做案例证据，不能默认作为公开资产分发 |
| 固定三个 Tab | 现有 App 的配置，不是货架协议 |

## 下一阶段

1. 让一个真实管线订阅 `ShelfRuntime`，把内容包写入 `contentSlot`。
2. 用 `register()` 验证 mount / update / unmount 生命周期。
3. 用第二套预设继续验证内容槽和管线接入。
4. 第二个 App 真正复用后，再决定是否拆成独立 package。
