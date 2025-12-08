import { Request, Response, NextFunction } from 'express';
import { IssueService } from './issue.service';
import { ValidationError, BadRequestError } from '../../utils/httpErrors';
import { IssueStatus, IssuePriority, IssueSeverity } from '../../generated/prisma/client';

const issueService = new IssueService();

export const createIssue = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   try {
      if (!req.user) {
         throw new BadRequestError('User context not found');
      }

      const { title, description, priority, severity, environment } = req.body;

      if (!title || !description || !priority || !severity) {
         throw new ValidationError('Missing required fields', {
            required: ['title', 'description', 'priority', 'severity'],
         });
      }

      if (!Object.values(IssuePriority).includes(priority)) {
         throw new ValidationError('Invalid priority', {
            validValues: Object.values(IssuePriority),
         });
      }

      if (!Object.values(IssueSeverity).includes(severity)) {
         throw new ValidationError('Invalid severity', {
            validValues: Object.values(IssueSeverity),
         });
      }

      const issue = await issueService.createIssue(
         {
            title,
            description,
            priority,
            severity,
            environment,
         },
         req.user
      );

      res.status(201).json(issue);
   } catch (error) {
      next(error);
   }
};

export const getIssueById = async (
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

      const issue = await issueService.getIssueById(issueId, req.user);

      res.status(200).json(issue);
   } catch (error) {
      next(error);
   }
};

export const listIssues = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   try {
      if (!req.user) {
         throw new BadRequestError('User context not found');
      }

      const { status, assigneeId, reporterId, search, page, pageSize } =
         req.query;

      const filters: any = {};

      if (status) {
         if (!Object.values(IssueStatus).includes(status as IssueStatus)) {
            throw new ValidationError('Invalid status filter', {
               validValues: Object.values(IssueStatus),
            });
         }
         filters.status = status as IssueStatus;
      }

      if (assigneeId) {
         const parsedAssigneeId = parseInt(assigneeId as string, 10);
         if (isNaN(parsedAssigneeId)) {
            throw new ValidationError('Invalid assigneeId');
         }
         filters.assigneeId = parsedAssigneeId;
      }

      if (reporterId) {
         const parsedReporterId = parseInt(reporterId as string, 10);
         if (isNaN(parsedReporterId)) {
            throw new ValidationError('Invalid reporterId');
         }
         filters.reporterId = parsedReporterId;
      }

      if (req.query.watcherId) {
         const parsedWatcherId = parseInt(req.query.watcherId as string, 10);
         if (isNaN(parsedWatcherId)) {
            throw new ValidationError('Invalid watcherId');
         }
         filters.watcherId = parsedWatcherId;
      }

      if (search) {
         filters.search = search as string;
      }

      if (page) {
         const parsedPage = parseInt(page as string, 10);
         if (isNaN(parsedPage) || parsedPage < 1) {
            throw new ValidationError('Invalid page number');
         }
         filters.page = parsedPage;
      }

      if (pageSize) {
         const parsedPageSize = parseInt(pageSize as string, 10);
         if (isNaN(parsedPageSize) || parsedPageSize < 1) {
            throw new ValidationError('Invalid pageSize');
         }
         filters.pageSize = parsedPageSize;
      }

      const result = await issueService.listIssues(filters, req.user);

      res.status(200).json(result);
   } catch (error) {
      next(error);
   }
};

export const updateIssue = async (
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

      const { title, description, priority, severity, environment } = req.body;

      if (priority && !Object.values(IssuePriority).includes(priority)) {
         throw new ValidationError('Invalid priority', {
            validValues: Object.values(IssuePriority),
         });
      }

      if (severity && !Object.values(IssueSeverity).includes(severity)) {
         throw new ValidationError('Invalid severity', {
            validValues: Object.values(IssueSeverity),
         });
      }

      const issue = await issueService.updateIssue(
         issueId,
         {
            title,
            description,
            priority,
            severity,
            environment,
         },
         req.user
      );

      res.status(200).json(issue);
   } catch (error) {
      next(error);
   }
};

export const takeIssue = async (
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

      const issue = await issueService.takeIssue(issueId, req.user);

      res.status(200).json(issue);
   } catch (error) {
      next(error);
   }
};

export const assignIssue = async (
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

      const { assigneeId } = req.body;

      if (!assigneeId) {
         throw new ValidationError('assigneeId is required');
      }

      if (typeof assigneeId !== 'number') {
         throw new ValidationError('assigneeId must be a number');
      }

      const issue = await issueService.assignIssue(issueId, assigneeId, req.user);

      res.status(200).json(issue);
   } catch (error) {
      next(error);
   }
};

export const changeStatus = async (
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

      const { status } = req.body;

      if (!status) {
         throw new ValidationError('status is required');
      }

      if (!Object.values(IssueStatus).includes(status)) {
         throw new ValidationError('Invalid status', {
            validValues: Object.values(IssueStatus),
         });
      }

      const issue = await issueService.changeStatus(issueId, status, req.user);

      res.status(200).json(issue);
   } catch (error) {
      next(error);
   }
};

export const subscribeToIssue = async (
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

      const result = await issueService.subscribe(issueId, req.user);

      res.status(200).json(result);
   } catch (error) {
      next(error);
   }
};
