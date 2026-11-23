# TOKI Shelf

TOKI 底部外壳的 Expo Go 版本。只包含已经证明过的界面与手势，不包含日历、To-do、Trigger 的业务内容，也不包含真实聊天协议。

可复用层的说明：

- `docs/SHELF_CONTRACT.md`：货架与管线的 v1 契约
- `docs/CASE_TEMPLATE.md`：新 App 的解剖与证据模板
- `docs/REUSE_MAP.md`：哪些东西值得复用、哪些只是 TOKI 专用

TOKI 的布局、主题、翻页参数和 Tab 配置集中在 `src/toki/config.ts`；
货架组件本身只接收 `layout`、`theme`、`pager`。

## 运行

```powershell
cd D:\iK3\TOKI\toki-shelf-app
npm run start:localhost
```

另开一个终端：

```powershell
D:\SoftInstall\platform-tools\adb.exe reverse tcp:8081 tcp:8081
D:\SoftInstall\platform-tools\adb.exe shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"
```

手机上用 Expo Go 打开。改代码后 Metro 会热更新。

用第二套 `Paper Compact` 预设启动：

```powershell
$env:EXPO_PUBLIC_SHELF_PRESET = "alt"
npx expo start --localhost --port 8082
```

不设置这个变量时，默认使用 TOKI 预设。

验证契约层：

```powershell
npm run check:contract
npm run check:presets
npm run typecheck
```

## 组件

| 中文名 | 代码名 | 文件 |
|---|---|---|
| 首页翻页器 | `HomePager` | `src/components/HomePager.tsx` |
| 底部 Tab 组 | `BottomTabBar` / `tabGroup` | `src/components/BottomTabBar.tsx` |
| 日历 / To-do / Trigger Tab | `tab-calendar` / `tab-todo` / `tab-trigger` | 同上 |
| 聊天圆钮 | `chatFab` | `src/components/ChatFab.tsx` |
| 聊天页 | `chatPane` | `src/components/ChatPane.tsx` |
| 聊天页返回圆钮 | `chatBack` | 同上 |
| 货架运行时 | `ShelfRuntime` | `src/shelf/contract.ts` |
| 首页内容槽 | `contentSlot` / `ShelfSlot` | `App.tsx` |
| 聊天内容槽 | `chatContentSlot` / `ShelfSlot` | `ChatPane.tsx` |
| Tab 图标 | `TabIcon` | `src/icons.tsx` |

聊天圆钮使用 `assets/icons/chat-entry.png`（用户提供的 icons8 inbox 96×96 PNG），运行时按主题染色。

## 已证明的常量

- 底栏：左右 `20dp`、控件 `64dp`、间距 `12dp`、底部 `8dp`、圆角 `32dp`、图标盒 `28dp`。
- 响应式：无聊天钮时 Tab 组最大 `298dp`；`>=850dp` 宽屏时左聊天 pane `390dp`、divider `1dp`、右侧 Tab 组 `298dp`。
- 翻页：边缘 `56dp` 起手、纵向锁 `12dp`、横向激活 `15dp`、方向比 `1.08`、动量 `0.2s`、弹簧 `damping 34 / mass 1 / stiffness 340 / overshootClamping`。

## 证据边界

- **已证明**：底栏几何、选中态 solid/regular、聊天入口、翻页手势常量、宽屏阈值与 pane 宽度、divider 宽度。
- **推断**：阴影强度、圆角与字体在实际 RN 渲染下的观感。
- **未知**：TOKI 的日历/To-do/Trigger 内容、真实聊天消息协议、原生 GlassView。

## 平台限制

从屏幕最边缘（约几像素）起手时，Android 系统返回手势可能优先，浏览器/Expo Go 收不到这次触摸。已验证从 `x=60px` 起手可以触发翻页；`x=5px` 会交给系统返回。这是容器/系统手势冲突，不是翻页逻辑错误。
