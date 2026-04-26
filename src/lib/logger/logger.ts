import pino from 'pino';
import pretty from 'pino-pretty';
import { correlationStore } from './correlation';
import createConfig from '@/config/configuration';

const config = createConfig();

const isDev = config.MODE !== 'production';

type LogKind = "http" | "action" | "db" | "external";

// Use pino-pretty as a synchronous stream in dev to avoid worker-thread issues in Next.js
const stream = isDev
  ? pretty({
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    })
  : undefined;

const logger = pino(
  {
    level: config.LOG_LEVEL ?? 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      app: config.NAME,
      version: config.VERSION,
      env: config.MODE,
    },
  },
  stream,
);

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

    event: (msg: string, kind: LogKind, extra?: Record<string, unknown>) =>
      withContext(extra).info({ kind, ...extra }, msg),
  };
}

export { createLogger, logger };
