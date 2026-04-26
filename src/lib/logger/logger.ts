import pino from "pino";
import { correlationStore } from "./correlation";
import createConfig from "@/config/configuration";

const config = createConfig();

const isDev = config.MODE !== "production";

const logger = pino({
  level: config.LOG_LEVEL ?? "info",

  // Format timestamp for Kibana
  timestamp: pino.stdTimeFunctions.isoTime,

  // Base fields for every log
  base: {
    app: config.NAME,
    version: config.VERSION,
    env: config.MODE,
  },

  // Dev: pretty print / Prod: JSON for Kibana
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});

// Wrapper is inject correlationId automatically to every log
function createLogger(module: string) {
  const child = logger.child({ module });

  function withContext(extra?: Record<string, unknown>) {
    const { correlationId, userId } = correlationStore.get();
    return child.child({ correlationId, userId, ...extra });
  }

  return {
    debug: (msg: string, extra?: Record<string, unknown>) =>
      withContext(extra).debug(msg),

    info: (msg: string, extra?: Record<string, unknown>) =>
      withContext(extra).info(msg),

    warn: (msg: string, extra?: Record<string, unknown>) =>
      withContext(extra).warn(msg),

    error: (msg: string, error?: unknown, extra?: Record<string, unknown>) => {
      const err =
        error instanceof Error
          ? { message: error.message, stack: error.stack, name: error.name }
          : { message: String(error) };

      withContext({ err, ...extra }).error(msg);
    },

    // for HTTP request log
    http: (msg: string, extra?: Record<string, unknown>) =>
      withContext(extra).info({ kind: "http", ...extra }, msg),
  };
}

export { createLogger, logger };