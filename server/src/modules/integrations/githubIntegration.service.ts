import { IssueService } from '../issues/issue.service';
import { CodeChangeService } from '../codeChanges/codeChange.service';
import { CommentService } from '../comments/comment.service';
import { getPrismaClient } from '../../prisma/client';
import { extractIssueKeysFromText } from '../../utils/parsing';
import { CodeChangeType } from '../../generated/prisma/client';
import {
   GithubPushEvent,
   GithubPullRequestEvent,
   GithubCommit,
   GithubPullRequest,
} from './github.types';

export class GithubIntegrationService {
   private prisma = getPrismaClient();
   private issueService = new IssueService();
   private codeChangeService = new CodeChangeService();
   private commentService = new CommentService();

   async processPushEvent(event: GithubPushEvent): Promise<void> {
      for (const commit of event.commits) {
         await this.processCommit(commit, event.repository.full_name);
      }
   }

   async processPullRequestEvent(event: GithubPullRequestEvent): Promise<void> {
      const { pull_request, action, repository } = event;

      const text = `${pull_request.title} ${pull_request.body || ''}`;
      const issueKeys = extractIssueKeysFromText(text);

      if (issueKeys.length === 0) {
         return;
      }

      const codeChange = await this.codeChangeService.upsertCodeChange({
         type: CodeChangeType.PULL_REQUEST,
         externalId: `pr-${pull_request.number}`,
         title: pull_request.title,
         url: pull_request.html_url,
         author: pull_request.user.login,
         occurredAt: new Date(pull_request.created_at),
      });

      for (const key of issueKeys) {
         const issue = await this.prisma.issue.findUnique({
            where: { key },
         });

         if (issue) {
            await this.attachCodeChangeToIssue(
               issue.id,
               codeChange.id,
               pull_request.html_url
            );

            if (action === 'closed' && pull_request.merged) {
               await this.handleMergedPullRequest(issue.id, pull_request);
            }
         }
      }
   }

   private async processCommit(
      commit: GithubCommit,
      repoFullName: string
   ): Promise<void> {
      const issueKeys = extractIssueKeysFromText(commit.message);

      if (issueKeys.length === 0) {
         return;
      }

      const codeChange = await this.codeChangeService.upsertCodeChange({
         type: CodeChangeType.COMMIT,
         externalId: commit.id,
         title: commit.message.split('\n')[0], // First line of commit message
         url: commit.url,
         author: commit.author.username || commit.author.name,
         occurredAt: new Date(commit.timestamp),
      });

      for (const key of issueKeys) {
         const issue = await this.prisma.issue.findUnique({
            where: { key },
         });

         if (issue) {
            await this.attachCodeChangeToIssue(issue.id, codeChange.id, commit.url);
         }
      }
   }

   private async attachCodeChangeToIssue(
      issueId: number,
      codeChangeId: number,
      url: string
   ): Promise<void> {
      const existing = await this.prisma.issueCodeChange.findUnique({
         where: {
            issueId_codeChangeId: {
               issueId,
               codeChangeId,
            },
         },
      });

      if (existing) {
         return;
      }

      await this.prisma.issueCodeChange.create({
         data: {
            issueId,
            codeChangeId,
         },
      });

      await this.prisma.comment.create({
         data: {
            issueId,
            authorId: null,
            text: `Автоматично прив'язано зміну коду: ${url}`,
            isSystem: true,
         },
      });
   }

   private async handleMergedPullRequest(
      issueId: number,
      pullRequest: GithubPullRequest
   ): Promise<void> {
      const issue = await this.prisma.issue.findUnique({
         where: { id: issueId },
      });

      if (!issue) {
         return;
      }

      if (issue.status === 'READY_FOR_QA') {
         await this.prisma.issue.update({
            where: { id: issueId },
            data: { status: 'CLOSED' },
         });

         await this.prisma.comment.create({
            data: {
               issueId,
               authorId: null,
               text: `Автоматично закрито через злиття PR: ${pullRequest.html_url}`,
               isSystem: true,
            },
         });
      }
   }
}
