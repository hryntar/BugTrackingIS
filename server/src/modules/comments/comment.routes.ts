import { Router } from 'express';
import { listComments, createComment, updateComment } from './comment.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/issues/:id/comments', authenticate, listComments);
router.post('/issues/:id/comments', authenticate, createComment);
router.patch('/comments/:id', authenticate, updateComment);

export default router;
