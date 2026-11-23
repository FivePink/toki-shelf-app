# Shelf Contract v1

货架负责“在哪里陈列、怎么陈列、被操作时发出什么信号”。
管线负责“放什么、什么时候换、失败了怎么办”。

这份契约只约束货架与管线之间的边界，不定义日历、To-do、Trigger 或聊天业务。

## 代码入口

- 类型与运行时：`src/shelf/contract.ts`
- 内容槽：`src/shelf/ShelfSlot.tsx`
- TOKI 适配层：`App.tsx`、`src/toki/config.ts`、`src/icons.tsx`
- 通用布局与主题接口：`src/shelf/layout.ts`、`src/shelf/theme.ts`

`SHELF_CONTRACT_VERSION` 当前为 `1`。

## 内容包

管线交给货架的不是原始接口响应，而是已经处理好的内容包：

```ts
type ShelfContentPackage = {
  id: string;
  kind: string;
  payload: unknown;
  actions?: { id: string; label: string; payload?: unknown }[];
};
```

规则：

- `id` 必须稳定，用来更新同一条内容。
- `kind` 表达内容类型，例如 `calendar-day`、`todo-list`、`message`。
- `payload` 由具体管线解释，货架不直接读取业务字段。
- `actions` 只声明可执行动作，不包含页面位置。

## 槽位

当前货架暴露两个槽位：

| 槽位 | 位置 | 当前状态 |
|---|---|---|
| `contentSlot` | 首页主内容区 | 空槽 |
| `chatContentSlot` | 聊天页主内容区 | 空槽 |

槽位名称是字符串，后续可以增加，不需要改货架基础类型。

## 事件

货架只发信号，不决定业务结果：

| 事件 | 发出时机 | 主要字段 |
|---|---|---|
| `tab.select` | 用户切换底部 Tab | `tabId`、`previousTabId` |
| `chat.open` | 进入聊天页 | `fromTabId` |
| `chat.close` | 离开聊天页 | `toTabId` |
| `theme.change` | 系统明暗主题变化 | `mode` |
| `slot.update` | 管线更新某个槽位 | `slot`、`content` |
| `action.invoke` | 内容里的动作被触发 | `slot`、`actionId`、`contentId` |

当前 `App.tsx` 已发出 `tab.select`、`chat.open`、`chat.close`、`theme.change`。
`slot.update` 已由 `ShelfRuntime.updateSlot()` 实现，但还没有接真实数据。
`action.invoke` 已定义，尚未接具体内容。

## 槽位绑定

管线通过绑定器接管一个槽位：

```ts
const unbind = shelf.register({
  slot: 'contentSlot',
  mount(content) {
    // 创建原生视图、订阅或缓存
  },
  update(content) {
    // 内容更新，不重建货架
  },
  unmount() {
    // 清理订阅和缓存
  },
});
```

绑定器只处理内容生命周期，不修改 Tab 位置、底栏尺寸或页面切换规则。

React 货架用 `ShelfSlot` 订阅同一个槽位：

```tsx
<ShelfSlot
  runtime={shelf}
  slot="contentSlot"
  renderContent={(content) => content ? <MyCard content={content} /> : null}
/>
```

管线写入：

```ts
shelf.updateSlot('contentSlot', {
  id: 'todo-2026-11-22',
  kind: 'todo-list',
  payload: { items: [] },
});
```

`ShelfSlot` 会收到 `slot.update` 并重新渲染；货架本身不解析 `payload`。

## 货架不做的事

- 不请求网络。
- 不保存业务数据。
- 不解析 API 响应。
- 不假设 `contentSlot` 里一定是消息、卡片或日历。
- 不因为换数据源而重画底栏。

## 已知边界

- 当前只实现 TOKI 的窄屏首页/聊天翻页和宽屏分栏。
- `HomePager` 是 TOKI 专用两页适配器，不是通用导航器。
- `ChatPane` 的返回圆钮和图标由 TOKI 适配层传入，不属于通用货架。
- 真实管线、异步 pending/error、重试和持久化尚未接入。
