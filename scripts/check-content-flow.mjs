import { ShelfRuntime } from '../src/shelf/contract.ts';
import {
  attachContentController,
  DEMO_SLOT,
} from '../src/shelf/demo/contentController.ts';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const shelf = new ShelfRuntime();
const seen = [];

shelf.subscribe((event) => {
  if (event.type === 'slot.update') {
    seen.push(event.content ? event.content.kind : 'null');
  }
});

const failures = [];
const check = (name, ok, detail) => {
  if (!ok) failures.push({ name, detail });
};

const emitAction = (actionId) =>
  shelf.emit({ type: 'action.invoke', slot: DEMO_SLOT, actionId });

const dispose = attachContentController(shelf, { delayMs: 10 });

await sleep(40);
let content = shelf.getContent(DEMO_SLOT);
check('C1 loading then list', seen.join(',') === 'loading,list', seen.join(','));
check('C1 list payload', content?.kind === 'list' && content.payload.items.length === 3, content?.kind);
const firstIds = content?.payload.items.map((item) => item.id).join(',');

emitAction('feed.refresh');
await sleep(40);
content = shelf.getContent(DEMO_SLOT);
const secondIds = content?.payload.items.map((item) => item.id).join(',');
check('C2 refresh changes batch', content?.payload.batch === 1 && firstIds !== secondIds, {
  firstIds,
  secondIds,
  batch: content?.payload.batch,
});

emitAction('feed.clear');
content = shelf.getContent(DEMO_SLOT);
check('C3 clear shows empty', content?.kind === 'empty', content?.kind);

emitAction('feed.reload');
await sleep(40);
check('C3 reload returns list', shelf.getContent(DEMO_SLOT)?.kind === 'list', shelf.getContent(DEMO_SLOT)?.kind);

emitAction('feed.fail');
content = shelf.getContent(DEMO_SLOT);
check(
  'C4 fail shows error',
  content?.kind === 'error' && typeof content.payload.message === 'string',
  content?.kind,
);

emitAction('feed.retry');
await sleep(40);
check('C4 retry returns list', shelf.getContent(DEMO_SLOT)?.kind === 'list', shelf.getContent(DEMO_SLOT)?.kind);

shelf.emit({ type: 'tab.select', tabId: 'todo', previousTabId: 'calendar' });
await sleep(40);
content = shelf.getContent(DEMO_SLOT);
check(
  'C5 tab switch loads that tab',
  content?.kind === 'list' && content.payload.title === 'To-do',
  content?.payload?.title,
);

const beforeDispose = seen.length;
dispose();
content = shelf.getContent(DEMO_SLOT);
check('C6 dispose clears slot', content === null, content?.kind ?? 'null');
const afterDispose = seen.length;

shelf.emit({ type: 'tab.select', tabId: 'trigger', previousTabId: 'todo' });
await sleep(40);
check(
  'C6 no writes after dispose',
  seen.length === afterDispose,
  `${afterDispose} -> ${seen.length}`,
);

const summary = {
  events: seen.join(','),
  eventsBeforeDispose: beforeDispose,
  finalContent: shelf.getContent(DEMO_SLOT),
  failures,
};

if (failures.length > 0) {
  console.error(JSON.stringify(summary, null, 2));
  throw new Error(`content flow check failed: ${failures.map((f) => f.name).join(', ')}`);
}

console.log('content flow OK');
console.log(JSON.stringify(summary));
