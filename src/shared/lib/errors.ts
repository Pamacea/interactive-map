/**
 * Custom error types for server actions
 * Provides structured error handling with user-friendly messages
 */

/**
 * Base application error class
 * All custom errors extend from this
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isUserFacing: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400)
 * Thrown when input validation fails
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400, true);
  }
}

/**
 * Authentication error (401)
 * Thrown when user is not authenticated
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "You must be logged in to perform this action") {
    super(message, "AUTHENTICATION_ERROR", 401, true);
  }
}

/**
 * Authorization error (403)
 * Thrown when user lacks permission
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "You don't have permission to perform this action") {
    super(message, "AUTHORIZATION_ERROR", 403, true);
  }
}

/**
 * Not found error (404)
 * Thrown when resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND_ERROR", 404, true);
  }
}

/**
 * Database error (500)
 * Thrown when database operation fails
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, "DATABASE_ERROR", 500, false);
  }
}

/**
 * File upload error (400)
 * Thrown when file upload fails
 */
export class FileUploadError extends AppError {
  constructor(message: string) {
    super(message, "FILE_UPLOAD_ERROR", 400, true);
  }
}

/**
 * Result type for safe error handling
 * Use this instead of throwing errors directly
 */
export type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Helper function to create success result
 */
export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

/**
 * Helper function to create error result
 */
export function err<E extends AppError>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Wrap an async function in a try-catch and return a Result
 * Use this for safe error handling in server actions
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  context: string
): Promise<Result<T>> {
  try {
    const _data = await fn();
    return ok(_data);
  } catch (error) {
    console.error(`[${context}] Operation failed:`, error);

    // If it's already an AppError, return it
    if (error instanceof AppError) {
      return err(error);
    }

    // If it's a Zod validation error, extract details and convert to ValidationError
    if (error instanceof Error) {
      // Check for ZodError by checking for specific Zod properties
      if ("issues" in error && Array.isArray((error as any).issues)) {
        const zodError = error as any;
        const firstIssue = zodError.issues[0];
        const errorMessage = firstIssue?.message || "Invalid input data";
        const errorPath = firstIssue?.path?.join(".") || "unknown";
        console.error(`[${context}] Validation error:`, errorMessage, "at path:", errorPath);
        return err(new ValidationError(`${errorMessage} (field: ${errorPath})`));
      }

      // Log other error details
      console.error(`[${context}] Error details:`, {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    // Otherwise, wrap in a generic DatabaseError with more context
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return err(new DatabaseError(`An unexpected error occurred: ${errorMessage}`));
  }
}

/**
 * Log error with context for debugging
 */
export function logError(context: string, error: unknown, metadata?: Record<string, unknown>) {
  const errorLog = {
    context,
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
    metadata,
  };

  console.error(`[Error] ${context}:`, JSON.stringify(errorLog, null, 2));
}

/**
 * Get user-friendly error message from AppError
 */
export function getErrorMessage(error: AppError): string {
  if (!error.isUserFacing) {
    return "An unexpected error occurred. Please try again.";
  }
  return error.message;
}
