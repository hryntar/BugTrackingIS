import { Router } from 'express';
import { handleGithubWebhook } from './githubWebhook.controller';

const router = Router();

router.post('/github/webhook', handleGithubWebhook);

export default router;
