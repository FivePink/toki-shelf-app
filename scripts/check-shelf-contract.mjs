import { ShelfRuntime } from '../src/shelf/contract.ts';

const shelf = new ShelfRuntime();
const events = [];
const calls = [];

const unsubscribe = shelf.subscribe((event) => {
  events.push(event.type);
});

shelf.updateSlot('contentSlot', {
  id: 'demo',
  kind: 'card',
  payload: { text: 'hello' },
});

const unbind = shelf.register({
  slot: 'contentSlot',
  mount(content) {
    calls.push(`mount:${content?.id ?? 'null'}`);
  },
  update(content) {
    calls.push(`update:${content?.id ?? 'null'}`);
  },
  unmount() {
    calls.push('unmount');
  },
});

shelf.updateSlot('contentSlot', {
  id: 'demo-2',
  kind: 'card',
  payload: { text: 'next' },
});

unbind();
unsubscribe();

const expectedEvents = 'slot.update,slot.update';
const expectedCalls = 'mount:demo,update:demo-2,unmount';

if (
  events.join(',') !== expectedEvents ||
  calls.join(',') !== expectedCalls ||
  shelf.getContent('contentSlot')?.id !== 'demo-2'
) {
  throw new Error(
    `contract check failed: ${JSON.stringify({ events, calls })}`,
  );
}

console.log('contract runtime OK');
console.log(
  JSON.stringify({
    events,
    calls,
    storedContent: shelf.getContent('contentSlot')?.id,
  }),
);
