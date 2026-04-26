import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "node:crypto";

interface CorrelationContext {
  correlationId: string;
  userId?: string;
}

const storage = new AsyncLocalStorage<CorrelationContext>();

export const correlationStore = {
  run<T>(context: Partial<CorrelationContext>, fn: () => T): T {
    const ctx: CorrelationContext = {
      correlationId: context.correlationId ?? randomUUID(),
      userId: context.userId,
    };
    return storage.run(ctx, fn);
  },

  get(): CorrelationContext {
    return storage.getStore() ?? { correlationId: "no-context" };
  },

  getId(): string {
    return correlationStore.get().correlationId;
  },
};