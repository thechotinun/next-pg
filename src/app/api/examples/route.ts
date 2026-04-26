import { NextResponse } from "next/server";
import { exampleService } from "@/services/example/index";
import { createLogger, withCorrelation } from "@/lib/logger";

const log = createLogger("api:examples");

export const GET = withCorrelation(async () => {
  log.http("GET /api/examples");

  try {
    const result = await exampleService.getAllExamples();

    if (!result.success) {
      log.warn("getAllExamples failed", { error: result.error });
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    log.info("getAllExamples success", { count: result.data?.length });
    return NextResponse.json(
      { message: "Success", data: result.data },
      { status: 200 }
    );
  } catch (error: unknown) {
    log.error("Unhandled error in GET /api/examples", error);
    return NextResponse.json(
      {
        message: "Error get data",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
});
