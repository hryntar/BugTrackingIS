import 'dotenv/config';
import { PrismaClient, UserRole, IssueStatus, IssuePriority, IssueSeverity, CodeChangeType } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
   adapter,
   log: ['error', 'warn'],
});

async function main() {
   console.log('🌱 Seeding database...');

   // Clear existing data (in reverse order of dependencies)
   await prisma.issueWatcher.deleteMany();
   await prisma.issueCodeChange.deleteMany();
   await prisma.comment.deleteMany();
   await prisma.codeChange.deleteMany();
   await prisma.issue.deleteMany();
   await prisma.user.deleteMany();

   console.log('✨ Cleared existing data');

   // Create users
   const hashedPassword = await bcrypt.hash('password123', 10);

   const qaUser = await prisma.user.create({
      data: {
         name: 'Alice Johnson',
         email: 'alice@bugtracker.com',
         role: UserRole.QA,
         passwordHash: hashedPassword,
         active: true,
      },
   });

   const dev1 = await prisma.user.create({
      data: {
         name: 'Bob Smith',
         email: 'bob@bugtracker.com',
         role: UserRole.DEV,
         passwordHash: hashedPassword,
         active: true,
      },
   });

   const dev2 = await prisma.user.create({
      data: {
         name: 'Carol Williams',
         email: 'carol@bugtracker.com',
         role: UserRole.DEV,
         passwordHash: hashedPassword,
         active: true,
      },
   });

   const pmUser = await prisma.user.create({
      data: {
         name: 'David Brown',
         email: 'david@bugtracker.com',
         role: UserRole.PM,
         passwordHash: hashedPassword,
         active: true,
      },
   });

   const clientUser = await prisma.user.create({
      data: {
         name: 'Emma Davis',
         email: 'emma@client.com',
         role: UserRole.CLIENT,
         passwordHash: hashedPassword,
         active: true,
      },
   });

   console.log('👥 Created 5 users');

   // Create issues
   const issue1 = await prisma.issue.create({
      data: {
         key: 'BUG-1',
         title: 'Login button not responding on mobile',
         description: 'When users try to login on mobile devices (iOS/Android), the login button does not respond to touch events. This affects the authentication flow.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v1.2.3',
         reporterId: qaUser.id,
         assigneeId: dev1.id,
      },
   });

   const issue2 = await prisma.issue.create({
      data: {
         key: 'BUG-2',
         title: 'Dashboard loads slowly',
         description: 'The dashboard page takes 8-10 seconds to load with multiple API calls. Performance needs optimization.',
         status: IssueStatus.READY_FOR_QA,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Staging v1.3.0',
         reporterId: dev2.id,
         assigneeId: dev1.id,
      },
   });

   const issue3 = await prisma.issue.create({
      data: {
         key: 'BUG-3',
         title: 'Data export feature returns incomplete CSV',
         description: 'When exporting user data to CSV, only the first 100 rows are included instead of all data.',
         status: IssueStatus.NEW,
         priority: IssuePriority.CRITICAL,
         severity: IssueSeverity.CRITICAL,
         environment: 'Production v1.2.3',
         reporterId: clientUser.id,
         assigneeId: null,
      },
   });

   const issue4 = await prisma.issue.create({
      data: {
         key: 'BUG-4',
         title: 'Typo in error message',
         description: 'Error message says "Successfull" instead of "Successful".',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v1.2.2',
         reporterId: qaUser.id,
         assigneeId: dev2.id,
      },
   });

   const issue5 = await prisma.issue.create({
      data: {
         key: 'BUG-5',
         title: 'Session timeout not working correctly',
         description: 'Users remain logged in even after the configured 30-minute timeout period.',
         status: IssueStatus.REOPENED,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v1.2.3',
         reporterId: pmUser.id,
         assigneeId: dev1.id,
      },
   });

   const issue6 = await prisma.issue.create({
      data: {
         key: 'BUG-6',
         title: 'Search results not paginated',
         description: 'Search functionality returns all results at once causing browser slowdown with large datasets.',
         status: IssueStatus.NEW,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Staging v1.3.0',
         reporterId: qaUser.id,
         assigneeId: null,
      },
   });

   console.log('🐛 Created 6 issues');

   // Create comments
   await prisma.comment.create({
      data: {
         issueId: issue1.id,
         authorId: dev1.id,
         text: 'I can reproduce this issue on iOS 17. Investigating the event handlers.',
         isSystem: false,
      },
   });

   await prisma.comment.create({
      data: {
         issueId: issue1.id,
         authorId: null,
         text: 'Status changed from NEW to IN_PROGRESS',
         isSystem: true,
      },
   });

   await prisma.comment.create({
      data: {
         issueId: issue1.id,
         authorId: dev1.id,
         text: 'Found the issue - CSS z-index conflict with modal overlay. Working on fix.',
         isSystem: false,
      },
   });

   await prisma.comment.create({
      data: {
         issueId: issue2.id,
         authorId: dev1.id,
         text: 'Optimized API calls by implementing caching. Ready for QA testing.',
         isSystem: false,
      },
   });

   await prisma.comment.create({
      data: {
         issueId: issue2.id,
         authorId: qaUser.id,
         text: 'Verified in staging - load time reduced to 2 seconds. Looks good!',
         isSystem: false,
      },
   });

   await prisma.comment.create({
      data: {
         issueId: issue3.id,
         authorId: clientUser.id,
         text: 'This is blocking our monthly reporting. High priority!',
         isSystem: false,
      },
   });

   await prisma.comment.create({
      data: {
         issueId: issue4.id,
         authorId: dev2.id,
         text: 'Fixed the typo.',
         isSystem: false,
      },
   });

   await prisma.comment.create({
      data: {
         issueId: issue4.id,
         authorId: null,
         text: 'Status changed from IN_PROGRESS to CLOSED',
         isSystem: true,
      },
   });

   await prisma.comment.create({
      data: {
         issueId: issue5.id,
         authorId: qaUser.id,
         text: 'Reopening - issue still occurs after the initial fix.',
         isSystem: false,
      },
   });

   await prisma.comment.create({
      data: {
         issueId: issue5.id,
         authorId: null,
         text: 'Status changed from CLOSED to REOPENED',
         isSystem: true,
      },
   });

   console.log('💬 Created 10 comments');

   // Create code changes
   const commit1 = await prisma.codeChange.create({
      data: {
         type: CodeChangeType.COMMIT,
         externalId: 'abc123def456',
         title: 'Fix mobile login button z-index issue',
         url: 'https://github.com/company/bugtracker/commit/abc123def456',
         author: 'bob@bugtracker.com',
         occurredAt: new Date('2025-12-06T15:30:00Z'),
      },
   });

   const commit2 = await prisma.codeChange.create({
      data: {
         type: CodeChangeType.COMMIT,
         externalId: 'def456ghi789',
         title: 'Implement dashboard caching',
         url: 'https://github.com/company/bugtracker/commit/def456ghi789',
         author: 'bob@bugtracker.com',
         occurredAt: new Date('2025-12-05T10:20:00Z'),
      },
   });

   const pr1 = await prisma.codeChange.create({
      data: {
         type: CodeChangeType.PULL_REQUEST,
         externalId: '42',
         title: 'Performance improvements for dashboard',
         url: 'https://github.com/company/bugtracker/pull/42',
         author: 'bob@bugtracker.com',
         occurredAt: new Date('2025-12-05T14:00:00Z'),
      },
   });

   const commit3 = await prisma.codeChange.create({
      data: {
         type: CodeChangeType.COMMIT,
         externalId: 'ghi789jkl012',
         title: 'Fix typo in error message',
         url: 'https://github.com/company/bugtracker/commit/ghi789jkl012',
         author: 'carol@bugtracker.com',
         occurredAt: new Date('2025-12-03T09:15:00Z'),
      },
   });

   console.log('📝 Created 4 code changes');

   // Link code changes to issues
   await prisma.issueCodeChange.create({
      data: {
         issueId: issue1.id,
         codeChangeId: commit1.id,
      },
   });

   await prisma.issueCodeChange.create({
      data: {
         issueId: issue2.id,
         codeChangeId: commit2.id,
      },
   });

   await prisma.issueCodeChange.create({
      data: {
         issueId: issue2.id,
         codeChangeId: pr1.id,
      },
   });

   await prisma.issueCodeChange.create({
      data: {
         issueId: issue4.id,
         codeChangeId: commit3.id,
      },
   });

   console.log('🔗 Linked code changes to issues');

   // Create watchers
   await prisma.issueWatcher.create({
      data: {
         issueId: issue1.id,
         userId: dev1.id,
      },
   });

   await prisma.issueWatcher.create({
      data: {
         issueId: issue1.id,
         userId: qaUser.id,
      },
   });

   await prisma.issueWatcher.create({
      data: {
         issueId: issue3.id,
         userId: pmUser.id,
      },
   });

   await prisma.issueWatcher.create({
      data: {
         issueId: issue3.id,
         userId: clientUser.id,
      },
   });

   await prisma.issueWatcher.create({
      data: {
         issueId: issue5.id,
         userId: dev1.id,
      },
   });

   await prisma.issueWatcher.create({
      data: {
         issueId: issue5.id,
         userId: qaUser.id,
      },
   });

   await prisma.issueWatcher.create({
      data: {
         issueId: issue5.id,
         userId: pmUser.id,
      },
   });

   console.log('👀 Created 7 issue watchers');

   console.log('\n✅ Database seeding completed successfully!\n');
   console.log('📊 Summary:');
   console.log('   - 5 Users (QA, DEV x2, PM, CLIENT)');
   console.log('   - 6 Issues (various statuses and priorities)');
   console.log('   - 10 Comments (user and system)');
   console.log('   - 4 Code Changes (commits and PRs)');
   console.log('   - 7 Issue Watchers');
   console.log('\n🔐 All users have password: password123');
   console.log('\n📧 User emails:');
   console.log('   - alice@bugtracker.com (QA)');
   console.log('   - bob@bugtracker.com (DEV)');
   console.log('   - carol@bugtracker.com (DEV)');
   console.log('   - david@bugtracker.com (PM)');
   console.log('   - emma@client.com (CLIENT)');
}

main()
   .catch((e) => {
      console.error('❌ Error seeding database:', e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
