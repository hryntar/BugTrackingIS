import { Router } from 'express';
import { listByIssue, getById } from './codeChange.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/issues/:id/code-changes', authenticate, listByIssue);
router.get('/code-changes/:id', authenticate, getById);

export default router;
