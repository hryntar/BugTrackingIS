import { getPrismaClient } from '../../prisma/client';
import { NotFoundError, ForbiddenError } from '../../utils/httpErrors';
import { UserContext } from '../../middleware/auth.middleware';
import { CreateCommentDto, UpdateCommentDto, CommentResponse } from './comment.types';

export class CommentService {
   private prisma = getPrismaClient();

   async listComments(
      issueId: number,
      currentUser: UserContext
   ): Promise<CommentResponse[]> {
      const issue = await this.prisma.issue.findUnique({
         where: { id: issueId },
      });

      if (!issue) {
         throw new NotFoundError('Issue not found');
      }

      const comments = await this.prisma.comment.findMany({
         where: { issueId },
         include: {
            author: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
         orderBy: {
            createdAt: 'asc',
         },
      });

      return comments.map((comment) => this.mapToCommentResponse(comment));
   }

   async createComment(
      issueId: number,
      data: CreateCommentDto,
      currentUser: UserContext
   ): Promise<CommentResponse> {
      const issue = await this.prisma.issue.findUnique({
         where: { id: issueId },
      });

      if (!issue) {
         throw new NotFoundError('Issue not found');
      }

      const comment = await this.prisma.comment.create({
         data: {
            issueId,
            authorId: currentUser.userId,
            text: data.text,
            isSystem: false,
         },
         include: {
            author: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
      });

      return this.mapToCommentResponse(comment);
   }

   async updateComment(
      id: number,
      data: UpdateCommentDto,
      currentUser: UserContext
   ): Promise<CommentResponse> {
      const existingComment = await this.prisma.comment.findUnique({
         where: { id },
         include: {
            author: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
      });

      if (!existingComment) {
         throw new NotFoundError('Comment not found');
      }

      if (existingComment.isSystem) {
         throw new ForbiddenError('Cannot edit system comments');
      }

      if (existingComment.authorId !== currentUser.userId) {
         throw new ForbiddenError('You can only edit your own comments');
      }

      const comment = await this.prisma.comment.update({
         where: { id },
         data: {
            text: data.text,
         },
         include: {
            author: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
      });

      return this.mapToCommentResponse(comment);
   }

   private mapToCommentResponse(comment: any): CommentResponse {
      return {
         id: comment.id,
         author: comment.author,
         text: comment.text,
         isSystem: comment.isSystem,
         createdAt: comment.createdAt,
         updatedAt: comment.updatedAt,
      };
   }
}
