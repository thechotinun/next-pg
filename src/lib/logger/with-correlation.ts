import { type NextRequest, NextResponse } from "next/server";
import { correlationStore } from "./correlation";
import { resolveUserId } from "@/lib/auth/resolve-user-id";

type RouteContext = { params: Promise<Record<string, string>> };
type RouteHandler = (
  req: NextRequest,
  context?: RouteContext
) => Promise<NextResponse> | NextResponse;

export function withCorrelation(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: RouteContext) => {
    const correlationId = req.headers.get("x-correlation-id") ?? undefined;
    const userId = await resolveUserId();

    return correlationStore.run({ correlationId, userId }, () =>
      handler(req, context)
    );
  };
}
