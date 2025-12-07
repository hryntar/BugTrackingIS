export class HttpError extends Error {
   constructor(
      public statusCode: number,
      public code: string,
      message: string,
      public details?: unknown,
   ) {
      super(message);
      this.name = 'HttpError';
      Error.captureStackTrace(this, this.constructor);
   }
}

export class BadRequestError extends HttpError {
   constructor(message: string, details?: unknown) {
      super(400, 'BAD_REQUEST', message, details);
      this.name = 'BadRequestError';
   }
}

export class UnauthorizedError extends HttpError {
   constructor(message = 'Unauthorized') {
      super(401, 'UNAUTHORIZED', message);
      this.name = 'UnauthorizedError';
   }
}

export class ForbiddenError extends HttpError {
   constructor(message = 'Forbidden') {
      super(403, 'FORBIDDEN', message);
      this.name = 'ForbiddenError';
   }
}

export class NotFoundError extends HttpError {
   constructor(message = 'Resource not found') {
      super(404, 'NOT_FOUND', message);
      this.name = 'NotFoundError';
   }
}

export class ConflictError extends HttpError {
   constructor(message: string, details?: unknown) {
      super(409, 'CONFLICT', message, details);
      this.name = 'ConflictError';
   }
}

export class ValidationError extends HttpError {
   constructor(message: string, details?: unknown) {
      super(422, 'VALIDATION_ERROR', message, details);
      this.name = 'ValidationError';
   }
}

export class InternalServerError extends HttpError {
   constructor(message = 'Internal server error') {
      super(500, 'INTERNAL_SERVER_ERROR', message);
      this.name = 'InternalServerError';
   }
}
