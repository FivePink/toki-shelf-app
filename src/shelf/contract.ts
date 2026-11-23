export const SHELF_CONTRACT_VERSION = 1 as const;

export type ShelfThemeMode = 'light' | 'dark';
export type ShelfTabId = string;
export type ShelfSlotId = string;

export type ShelfTabDefinition<T extends string = ShelfTabId> = {
  id: T;
  label: string;
  accessibilityLabel?: string;
};

export type ShelfAction = {
  id: string;
  label: string;
  payload?: unknown;
};

export type ShelfContentPackage<TPayload = unknown> = {
  id: string;
  kind: string;
  payload: TPayload;
  actions?: readonly ShelfAction[];
};

export type ShelfEvent =
  | {
      type: 'tab.select';
      tabId: ShelfTabId;
      previousTabId?: ShelfTabId;
    }
  | {
      type: 'chat.open';
      fromTabId: ShelfTabId;
    }
  | {
      type: 'chat.close';
      toTabId: ShelfTabId;
    }
  | {
      type: 'theme.change';
      mode: ShelfThemeMode;
    }
  | {
      type: 'slot.update';
      slot: ShelfSlotId;
      content: ShelfContentPackage | null;
    }
  | {
      type: 'action.invoke';
      slot: ShelfSlotId;
      actionId: string;
      contentId?: string;
    };

export type ShelfEventHandler = (event: ShelfEvent) => void;
export type ShelfUnsubscribe = () => void;

export type ShelfSlotBinding = {
  slot: ShelfSlotId;
  mount?: (content: ShelfContentPackage | null) => void;
  update?: (content: ShelfContentPackage | null) => void;
  unmount?: () => void;
};

export class ShelfRuntime {
  private readonly handlers = new Set<ShelfEventHandler>();
  private readonly bindings = new Map<ShelfSlotId, ShelfSlotBinding>();
  private readonly contents = new Map<ShelfSlotId, ShelfContentPackage | null>();

  subscribe(handler: ShelfEventHandler): ShelfUnsubscribe {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  emit(event: ShelfEvent): void {
    for (const handler of this.handlers) {
      handler(event);
    }
  }

  register(binding: ShelfSlotBinding): ShelfUnsubscribe {
    this.bindings.get(binding.slot)?.unmount?.();
    this.bindings.set(binding.slot, binding);
    binding.mount?.(this.getContent(binding.slot));

    return () => {
      if (this.bindings.get(binding.slot) !== binding) return;
      this.bindings.delete(binding.slot);
      binding.unmount?.();
    };
  }

  updateSlot(slot: ShelfSlotId, content: ShelfContentPackage | null): void {
    this.contents.set(slot, content);
    const binding = this.bindings.get(slot);
    if (binding?.update) {
      binding.update(content);
    } else {
      binding?.mount?.(content);
    }
    this.emit({ type: 'slot.update', slot, content });
  }

  getContent(slot: ShelfSlotId): ShelfContentPackage | null {
    return this.contents.get(slot) ?? null;
  }
}
