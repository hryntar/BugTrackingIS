import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/httpErrors';

export const errorHandler = (
   err: Error,
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   if (res.headersSent) {
      return next(err);
   }

   console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
   });

   if (err instanceof HttpError) {
      const errorResponse: any = {
         error: {
            code: err.code,
            message: err.message,
         },
      };

      if (err.details) {
         errorResponse.error.details = err.details;
      }

      res.status(err.statusCode).json(errorResponse);
      return;
   }

   res.status(500).json({
      error: {
         code: 'INTERNAL_SERVER_ERROR',
         message:
            process.env.NODE_ENV === 'development'
               ? err.message
               : 'Internal server error',
         ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
   });
};

export const notFoundHandler = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   res.status(404).json({
      error: {
         code: 'NOT_FOUND',
         message: `Route ${req.method} ${req.path} not found`,
      },
   });
};
