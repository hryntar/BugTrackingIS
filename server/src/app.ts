import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import issueRoutes from './modules/issues/issue.routes';
import commentRoutes from './modules/comments/comment.routes';
import codeChangeRoutes from './modules/codeChanges/codeChange.routes';
import integrationRoutes from './modules/integrations/integration.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
   res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api', commentRoutes);
app.use('/api', codeChangeRoutes);
app.use('/api/integrations', integrationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;