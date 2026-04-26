import { headers } from "next/headers";
import { correlationStore } from "./correlation";

export async function withCorrelationAction<T>(fn: () => Promise<T>): Promise<T> {
  const headersList = await headers();
  const correlationId = headersList.get("x-correlation-id") ?? undefined;
  return correlationStore.run({ correlationId }, fn);
}
