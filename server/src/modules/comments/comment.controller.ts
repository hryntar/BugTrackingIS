import { Request, Response, NextFunction } from 'express';
import { CommentService } from './comment.service';
import { ValidationError, BadRequestError } from '../../utils/httpErrors';

const commentService = new CommentService();

export const listComments = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   try {
      if (!req.user) {
         throw new BadRequestError('User context not found');
      }

      const issueId = parseInt(req.params.id, 10);

      if (isNaN(issueId)) {
         throw new ValidationError('Invalid issue ID');
      }

      const comments = await commentService.listComments(issueId, req.user);

      res.status(200).json(comments);
   } catch (error) {
      next(error);
   }
};

export const createComment = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   try {
      if (!req.user) {
         throw new BadRequestError('User context not found');
      }

      const issueId = parseInt(req.params.id, 10);

      if (isNaN(issueId)) {
         throw new ValidationError('Invalid issue ID');
      }

      const { text } = req.body;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
         throw new ValidationError('Comment text is required');
      }

      const comment = await commentService.createComment(
         issueId,
         { text },
         req.user
      );

      res.status(201).json(comment);
   } catch (error) {
      next(error);
   }
};

export const updateComment = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   try {
      if (!req.user) {
         throw new BadRequestError('User context not found');
      }

      const commentId = parseInt(req.params.id, 10);

      if (isNaN(commentId)) {
         throw new ValidationError('Invalid comment ID');
      }

      const { text } = req.body;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
         throw new ValidationError('Comment text is required');
      }

      const comment = await commentService.updateComment(
         commentId,
         { text },
         req.user
      );

      res.status(200).json(comment);
   } catch (error) {
      next(error);
   }
};
