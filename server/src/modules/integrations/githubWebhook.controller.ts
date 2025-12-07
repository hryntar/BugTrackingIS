import { Request, Response, NextFunction } from 'express';
import { GithubIntegrationService } from './githubIntegration.service';
import { verifyGithubSignature } from '../../utils/githubSignature';
import { env } from '../../config/env';
import { UnauthorizedError, BadRequestError } from '../../utils/httpErrors';
import { WebhookHeaders } from './github.types';

const githubService = new GithubIntegrationService();

export const handleGithubWebhook = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const event = req.headers['x-github-event'] as string;

      if (!signature || !event) {
         throw new BadRequestError('Missing required GitHub headers');
      }

      const rawBody = JSON.stringify(req.body);
      const isValid = verifyGithubSignature(
         rawBody,
         signature,
         env.githubWebhookSecret || ''
      );

      if (!isValid) {
         throw new UnauthorizedError('Invalid webhook signature');
      }

      switch (event) {
         case 'push':
            await githubService.processPushEvent(req.body);
            break;

         case 'pull_request':
            await githubService.processPullRequestEvent(req.body);
            break;

         default:
            break;
      }

      res.status(200).json({ message: 'Webhook processed successfully' });
   } catch (error) {
      next(error);
   }
};
