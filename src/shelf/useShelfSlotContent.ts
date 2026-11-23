import { useEffect, useState } from 'react';

import type {
  ShelfContentPackage,
  ShelfRuntime,
  ShelfSlotId,
} from './contract';

export function useShelfSlotContent(
  runtime: ShelfRuntime,
  slot: ShelfSlotId,
): ShelfContentPackage | null {
  const [content, setContent] = useState<ShelfContentPackage | null>(() =>
    runtime.getContent(slot),
  );

  useEffect(() => {
    setContent(runtime.getContent(slot));
    return runtime.subscribe((event) => {
      if (event.type === 'slot.update' && event.slot === slot) {
        setContent(event.content);
      }
    });
  }, [runtime, slot]);

  return content;
}
