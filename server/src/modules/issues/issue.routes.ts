import { Router } from 'express';
import {
   createIssue,
   getIssueById,
   listIssues,
   updateIssue,
   takeIssue,
   assignIssue,
   changeStatus,
   subscribeToIssue,
} from './issue.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createIssue);
router.get('/', authenticate, listIssues);
router.get('/:id', authenticate, getIssueById);
router.patch('/:id', authenticate, updateIssue);

router.post('/:id/take', authenticate, takeIssue);
router.post('/:id/assign', authenticate, assignIssue);
router.post('/:id/status', authenticate, changeStatus);
router.post('/:id/subscribe', authenticate, subscribeToIssue);

export default router;
