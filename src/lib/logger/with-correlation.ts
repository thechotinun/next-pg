import { type NextRequest, NextResponse } from "next/server";
import { correlationStore } from "./correlation";

type RouteContext = { params: Promise<Record<string, string>> };
type RouteHandler = (
  req: NextRequest,
  context?: RouteContext
) => Promise<NextResponse> | NextResponse;

export function withCorrelation(handler: RouteHandler): RouteHandler {
  return (req: NextRequest, context?: RouteContext) => {
    const correlationId = req.headers.get("x-correlation-id") ?? undefined;

    return correlationStore.run({ correlationId }, () =>
      handler(req, context)
    ) as Promise<NextResponse>;
  };
}
