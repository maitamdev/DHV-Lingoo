/**
 * Error boundary utilities
 */
export class AppError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code: string = 'UNKNOWN', statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'Da co loi khong mong muon';
}

export function createNotFoundError(resource: string): AppError {
  return new AppError(resource + ' khong tim thay', 'NOT_FOUND', 404);
}

export function createUnauthorizedError(): AppError {
  return new AppError('Ban khong co quyen truy cap', 'UNAUTHORIZED', 401);
}