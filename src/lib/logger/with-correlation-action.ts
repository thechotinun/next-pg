import { headers } from "next/headers";
import { correlationStore } from "./correlation";
import { resolveUserId } from "@/lib/auth/resolve-user-id";

export async function withCorrelationAction<T>(fn: () => Promise<T>): Promise<T> {
  const headersList = await headers();
  const correlationId = headersList.get("x-correlation-id") ?? undefined;
  const userId = await resolveUserId();
  return correlationStore.run({ correlationId, userId }, fn);
}
