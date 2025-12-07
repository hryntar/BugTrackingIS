import { Request, Response, NextFunction } from 'express';
import { CodeChangeService } from './codeChange.service';
import { ValidationError, BadRequestError } from '../../utils/httpErrors';

const codeChangeService = new CodeChangeService();

export const listByIssue = async (
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

      const codeChanges = await codeChangeService.listByIssue(issueId, req.user);

      res.status(200).json(codeChanges);
   } catch (error) {
      next(error);
   }
};

export const getById = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   try {
      if (!req.user) {
         throw new BadRequestError('User context not found');
      }

      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
         throw new ValidationError('Invalid code change ID');
      }

      const codeChange = await codeChangeService.getById(id, req.user);

      res.status(200).json(codeChange);
   } catch (error) {
      next(error);
   }
};
