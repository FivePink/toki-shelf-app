import type { ShelfContentPackage, ShelfRuntime } from '../contract';

/**
 * 演示内容管线：只负责"放什么、什么时候换、失败了怎么办"。
 * 货架不认识这里的任何字段；把本文件整体替换即可接真实数据源。
 */

export const DEMO_SLOT = 'contentSlot';

export type FeedItem = {
  id: string;
  title: string;
  meta: string;
};

export type ListPayload = {
  title: string;
  batch: number;
  items: FeedItem[];
};

export type ErrorPayload = {
  message: string;
};

const TAB_TITLES: Record<string, string> = {
  calendar: '日历',
  todo: 'To-do',
  trigger: 'Trigger',
};

const FEED: Record<string, FeedItem[][]> = {
  calendar: [
    [
      { id: 'cal-1', title: '09:30 站会', meta: '15 分钟 · 线上' },
      { id: 'cal-2', title: '14:00 对齐槽位边界', meta: '与设计 · 会议室 B' },
      { id: 'cal-3', title: '20:00 复盘 P5', meta: '写结论 · 不排期' },
    ],
    [
      { id: 'cal-4', title: '10:00 复查真机截图', meta: '四态各一张' },
      { id: 'cal-5', title: '16:30 整理契约差异', meta: '外壳 vs 管线' },
      { id: 'cal-6', title: '21:00 写交接', meta: '留证据路径' },
    ],
  ],
  todo: [
    [
      { id: 'todo-1', title: '补 P5 验收卡', meta: '未开始' },
      { id: 'todo-2', title: '跑真机四态', meta: '列表 / 换批 / 空 / 失败' },
      { id: 'todo-3', title: '登记未覆盖项', meta: '不写通过' },
    ],
    [
      { id: 'todo-4', title: '复核槽位生命周期', meta: 'mount / update / unmount' },
      { id: 'todo-5', title: '清理临时日志', meta: '只留证据' },
      { id: 'todo-6', title: '更新执行计划', meta: '下一工作单' },
    ],
  ],
  trigger: [
    [
      { id: 'trg-1', title: '09:00 自动拉取日程', meta: '每日 · 一次' },
      { id: 'trg-2', title: '12:00 汇总待办', meta: '工作日' },
      { id: 'trg-3', title: '18:00 生成日报', meta: '草稿，不发送' },
    ],
    [
      { id: 'trg-4', title: '08:30 同步日历', meta: '只读' },
      { id: 'trg-5', title: '13:00 提醒喝水', meta: '演示用' },
      { id: 'trg-6', title: '19:00 归档完成项', meta: '本地' },
    ],
  ],
};

function titleFor(tabId: string): string {
  return TAB_TITLES[tabId] ?? tabId;
}

function itemsFor(tabId: string, batch: number): FeedItem[] {
  const batches = FEED[tabId] ?? FEED.calendar;
  return batches[batch % batches.length];
}

export function loadingPackage(tabId: string, batch: number): ShelfContentPackage {
  return {
    id: `feed:${tabId}:loading:${batch}`,
    kind: 'loading',
    payload: { title: titleFor(tabId), batch },
  };
}

export function listPackage(
  tabId: string,
  batch: number,
  items: FeedItem[],
): ShelfContentPackage {
  return {
    id: `feed:${tabId}:list:${batch}`,
    kind: 'list',
    payload: { title: titleFor(tabId), batch, items } satisfies ListPayload,
    actions: [
      { id: 'feed.refresh', label: '换一批' },
      { id: 'feed.clear', label: '清空' },
      { id: 'feed.fail', label: '模拟失败' },
    ],
  };
}

export function emptyPackage(tabId: string): ShelfContentPackage {
  return {
    id: `feed:${tabId}:empty`,
    kind: 'empty',
    payload: { title: titleFor(tabId) },
    actions: [{ id: 'feed.reload', label: '载入示例内容' }],
  };
}

export function errorPackage(tabId: string, message: string): ShelfContentPackage {
  return {
    id: `feed:${tabId}:error`,
    kind: 'error',
    payload: { message } satisfies ErrorPayload,
    actions: [{ id: 'feed.retry', label: '重试' }],
  };
}

/**
 * 接管 contentSlot：订阅 tab.select 与 action.invoke，把内容包写回槽位。
 * 返回的 dispose 会取消订阅、清掉计时器，并把槽位置为 null。
 */
export function attachContentController(
  runtime: ShelfRuntime,
  options?: { delayMs?: number },
): () => void {
  const delay = options?.delayMs ?? 180;
  let tabId = 'calendar';
  let batch = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  const clearTimer = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const write = (content: ShelfContentPackage | null) => {
    if (disposed) return;
    runtime.updateSlot(DEMO_SLOT, content);
  };

  const load = () => {
    clearTimer();
    const targetTab = tabId;
    const targetBatch = batch;
    write(loadingPackage(targetTab, targetBatch));
    timer = setTimeout(() => {
      timer = null;
      if (disposed) return;
      write(listPackage(targetTab, targetBatch, itemsFor(targetTab, targetBatch)));
    }, delay);
  };

  const unsubscribe = runtime.subscribe((event) => {
    if (disposed) return;

    if (event.type === 'tab.select') {
      tabId = event.tabId;
      batch = 0;
      load();
      return;
    }

    if (event.type !== 'action.invoke' || event.slot !== DEMO_SLOT) return;

    switch (event.actionId) {
      case 'feed.refresh':
        batch += 1;
        load();
        break;
      case 'feed.reload':
      case 'feed.retry':
        load();
        break;
      case 'feed.clear':
        clearTimer();
        write(emptyPackage(tabId));
        break;
      case 'feed.fail':
        clearTimer();
        write(errorPackage(tabId, '演示失败：内容管线返回错误'));
        break;
      default:
        break;
    }
  });

  load();

  return () => {
    disposed = true;
    clearTimer();
    unsubscribe();
    runtime.updateSlot(DEMO_SLOT, null);
  };
}
