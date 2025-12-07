import { Router } from 'express';
import { listUsers, getUserById } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, listUsers);
router.get('/:id', authenticate, getUserById);

export default router;
