/**
 * Centralized logging utility
 *
 * Provides structured logging with environment-aware behavior.
 * In production, debug/info logs are suppressed to reduce noise.
 * Error logs are always shown and can be sent to error tracking services.
 */

interface LogContext {
  requestId?: string;
  userId?: string;
  worldId?: string;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV === 'development';

/**
 * Sanitize log data to remove sensitive information
 */
function sanitize(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = Array.isArray(data) ? [] : {};

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apiKey',
    'api_key',
    'authorization',
    'cookie',
    'session',
    'credentials',
  ];

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((k) => lowerKey.includes(k));

    if (isSensitive) {
      (sanitized as Record<string, unknown>)[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as Record<string, unknown>)[key] = sanitize(value);
    } else {
      (sanitized as Record<string, unknown>)[key] = value;
    }
  }

  return sanitized;
}

/**
 * Format log arguments for consistent output
 */
function formatArgs(args: unknown[], context?: LogContext): unknown[] {
  if (context && Object.keys(context).length > 0) {
    return [...args, { context: sanitize(context) }];
  }
  return args.map((arg) => sanitize(arg));
}

export const logger = {
  /**
   * Debug-level logging (development only)
   */
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Info-level logging (development only)
   */
  info: (...args: unknown[]) => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Warning logging (always shown)
   */
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Error logging (always shown)
   *
   * TODO: Integrate with Sentry or similar error tracking service
   */
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);

    // Example: Send to error tracking service
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(args[0]);
    // }
  },

  /**
   * Context-aware logging with request metadata
   */
  withContext: (context: LogContext) => ({
    debug: (...args: unknown[]) => logger.debug(...formatArgs(args, context)),
    info: (...args: unknown[]) => logger.info(...formatArgs(args, context)),
    warn: (...args: unknown[]) => logger.warn(...formatArgs(args, context)),
    error: (...args: unknown[]) => logger.error(...formatArgs(args, context)),
  }),
};

/**
 * Create a scoped logger for a specific module
 */
export function createLogger(module: string) {
  return {
    debug: (...args: unknown[]) => logger.debug(`[${module}]`, ...args),
    info: (...args: unknown[]) => logger.info(`[${module}]`, ...args),
    warn: (...args: unknown[]) => logger.warn(`[${module}]`, ...args),
    error: (...args: unknown[]) => logger.error(`[${module}]`, ...args),
    withContext: (context: LogContext) => ({
      debug: (...args: unknown[]) => logger.debug(`[${module}]`, ...formatArgs(args, context)),
      info: (...args: unknown[]) => logger.info(`[${module}]`, ...formatArgs(args, context)),
      warn: (...args: unknown[]) => logger.warn(`[${module}]`, ...formatArgs(args, context)),
      error: (...args: unknown[]) => logger.error(`[${module}]`, ...formatArgs(args, context)),
    }),
  };
}
