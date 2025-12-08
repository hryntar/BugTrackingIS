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

function randomDateInPast(days: number): Date {
   const now = new Date();
   const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
   const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
   return new Date(randomTime);
}

function randomPick<T>(arr: T[]): T {
   return arr[Math.floor(Math.random() * arr.length)];
}

function randomPickMultiple<T>(arr: T[], count: number): T[] {
   const shuffled = [...arr].sort(() => 0.5 - Math.random());
   return shuffled.slice(0, Math.min(count, arr.length));
}

async function main() {
   console.log('🌱 Seeding database with realistic data...');

   await prisma.issueWatcher.deleteMany();
   await prisma.issueCodeChange.deleteMany();
   await prisma.comment.deleteMany();
   await prisma.codeChange.deleteMany();
   await prisma.issue.deleteMany();
   await prisma.user.deleteMany();

   console.log('✨ Cleared existing data');

   const hashedPassword = await bcrypt.hash('password123', 10);

   const users = await Promise.all([
      prisma.user.create({
         data: {
            name: 'Alice Johnson',
            email: 'alice.johnson@bugtracker.com',
            role: UserRole.QA,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Michael Chen',
            email: 'michael.chen@bugtracker.com',
            role: UserRole.QA,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Sarah Martinez',
            email: 'sarah.martinez@bugtracker.com',
            role: UserRole.QA,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'James Wilson',
            email: 'james.wilson@bugtracker.com',
            role: UserRole.QA,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Laura Thompson',
            email: 'laura.thompson@bugtracker.com',
            role: UserRole.QA,
            passwordHash: hashedPassword,
            active: true,
         },
      }),

      prisma.user.create({
         data: {
            name: 'Bob Smith',
            email: 'bob.smith@bugtracker.com',
            role: UserRole.DEV,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Carol Williams',
            email: 'carol.williams@bugtracker.com',
            role: UserRole.DEV,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'David Lee',
            email: 'david.lee@bugtracker.com',
            role: UserRole.DEV,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@bugtracker.com',
            role: UserRole.DEV,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Frank Anderson',
            email: 'frank.anderson@bugtracker.com',
            role: UserRole.DEV,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Grace Taylor',
            email: 'grace.taylor@bugtracker.com',
            role: UserRole.DEV,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Henry Kumar',
            email: 'henry.kumar@bugtracker.com',
            role: UserRole.DEV,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Iris Patel',
            email: 'iris.patel@bugtracker.com',
            role: UserRole.DEV,
            passwordHash: hashedPassword,
            active: true,
         },
      }),

      prisma.user.create({
         data: {
            name: 'John Davis',
            email: 'john.davis@bugtracker.com',
            role: UserRole.PM,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Karen White',
            email: 'karen.white@bugtracker.com',
            role: UserRole.PM,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Oliver Brown',
            email: 'oliver.brown@bugtracker.com',
            role: UserRole.PM,
            passwordHash: hashedPassword,
            active: true,
         },
      }),

      prisma.user.create({
         data: {
            name: 'Emma Thompson',
            email: 'emma.thompson@techcorp.com',
            role: UserRole.CLIENT,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Nathan Green',
            email: 'nathan.green@innovate.io',
            role: UserRole.CLIENT,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Olivia Harris',
            email: 'olivia.harris@startupx.com',
            role: UserRole.CLIENT,
            passwordHash: hashedPassword,
            active: true,
         },
      }),
      prisma.user.create({
         data: {
            name: 'Peter Jackson',
            email: 'peter.jackson@enterprise.com',
            role: UserRole.CLIENT,
            passwordHash: hashedPassword,
            active: true,
         },
      }),

      prisma.user.create({
         data: {
            name: 'Former Employee',
            email: 'former@bugtracker.com',
            role: UserRole.DEV,
            passwordHash: hashedPassword,
            active: false,
         },
      }),
   ]);

   const qaUsers = users.filter(u => u.role === UserRole.QA);
   const devUsers = users.filter(u => u.role === UserRole.DEV && u.active);
   const pmUsers = users.filter(u => u.role === UserRole.PM);
   const clientUsers = users.filter(u => u.role === UserRole.CLIENT);

   console.log(`👥 Created ${users.length} users (${qaUsers.length} QA, ${devUsers.length} DEV, ${pmUsers.length} PM, ${clientUsers.length} CLIENT)`);

   const issueTemplates = [
      {
         title: 'Payment processing fails for international cards',
         description: 'Users with international credit cards are unable to complete checkout. Error: "Payment gateway timeout". This is blocking revenue from 30% of our user base.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.CRITICAL,
         severity: IssueSeverity.CRITICAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Database connection pool exhausted during peak hours',
         description: 'Between 2-4 PM EST, users experience 500 errors. Monitoring shows connection pool maxed at 100. Need to optimize queries and increase pool size.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.CRITICAL,
         severity: IssueSeverity.CRITICAL,
         environment: 'Production v2.1.3',
      },
      {
         title: 'User data leak in API response',
         description: 'GET /api/users endpoint returns passwordHash field in response. CRITICAL SECURITY ISSUE. Need immediate hotfix.',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.CRITICAL,
         severity: IssueSeverity.CRITICAL,
         environment: 'Production v2.0.8',
      },

      {
         title: 'Login button not responding on mobile Safari',
         description: 'iOS users on Safari 17+ cannot tap the login button. Event listeners not firing. Affects ~40% of mobile users.',
         status: IssueStatus.READY_FOR_QA,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Email notifications not being sent',
         description: 'SendGrid integration broken since last deployment. Queue shows 15K pending emails. Users missing critical alerts.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Session timeout too aggressive on mobile',
         description: 'Users logged out after 5 minutes of inactivity on mobile apps. Should be 30 minutes like desktop. Poor UX.',
         status: IssueStatus.REOPENED,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v2.1.2',
      },
      {
         title: 'Dashboard widgets showing stale data',
         description: 'Real-time dashboard not updating. WebSocket connection drops after 10 minutes. Users see outdated metrics.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v2.1.3',
      },
      {
         title: 'File upload fails for files >10MB',
         description: 'Large file uploads timeout. Nginx proxy_timeout needs adjustment. Users cannot upload presentation videos.',
         status: IssueStatus.NEW,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v2.1.4',
      },

      {
         title: 'Dashboard loads slowly with many widgets',
         description: 'Initial page load takes 8-10 seconds when user has 15+ widgets. Multiple sequential API calls. Need to implement parallel loading and caching.',
         status: IssueStatus.READY_FOR_QA,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Staging v2.2.0',
      },
      {
         title: 'Dark mode toggle causes page flicker',
         description: 'Switching between light/dark mode causes brief white flash. CSS transition not smooth. Need to optimize theme loading.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Staging v2.2.0',
      },
      {
         title: 'Search autocomplete shows irrelevant results',
         description: 'Search suggestions prioritize old content over recent. Elasticsearch scoring needs tuning. Users complain about poor search experience.',
         status: IssueStatus.NEW,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Export to PDF generates malformed documents',
         description: 'PDF exports missing images and charts. Puppeteer rendering issues with dynamic content. Charts appear as blank boxes.',
         status: IssueStatus.NEW,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.3',
      },
      {
         title: 'Timezone conversion incorrect for UTC-12',
         description: 'Date pickers showing wrong dates for users in Baker Island timezone. Edge case in moment-timezone config.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.1',
      },
      {
         title: 'Notification badge counter incorrect',
         description: 'Unread count shows 5 but only 3 notifications visible. WebSocket events not properly debounced.',
         status: IssueStatus.NEW,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Keyboard navigation broken in dropdown menus',
         description: 'Arrow keys and Enter key not working in custom dropdown components. Accessibility issue for keyboard-only users.',
         status: IssueStatus.READY_FOR_QA,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Staging v2.2.0',
      },
      {
         title: 'Mobile app crashes on Android 14',
         description: 'React Native app crashes on startup for Android 14 users. Incompatibility with new security policies.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v1.8.2 (Mobile)',
      },

      // Low priority issues
      {
         title: 'Tooltip position incorrect near screen edges',
         description: 'Tooltips get cut off at viewport boundaries. Need smart positioning logic to flip tooltip direction.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Console warnings in development mode',
         description: 'React dev tools showing "findDOMNode is deprecated" warnings. Need to refactor legacy class components.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Development',
      },
      {
         title: 'Typo in success message: "Successfull"',
         description: 'Success toast shows "Successfull updated" instead of "Successfully updated". Simple string fix needed.',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.2',
      },
      {
         title: 'Profile avatar upload preview misaligned',
         description: 'Image preview shows slightly off-center during upload. CSS flexbox centering issue.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Missing favicon on error pages',
         description: '404 and 500 error pages don\'t load favicon. Static asset path incorrect.',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.3',
      },
      {
         title: 'Footer copyright year hardcoded to 2024',
         description: 'Footer shows © 2024 instead of current year. Should use dynamic date.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },

      // More diverse scenarios
      {
         title: 'Rate limiting too strict on API endpoints',
         description: 'Users hitting rate limit with normal usage. Current limit: 100 req/min. Need to increase to 500 req/min or implement smarter throttling.',
         status: IssueStatus.NEW,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'CSV export exceeds memory limit for large datasets',
         description: 'Exporting >50K rows causes Node.js heap out of memory. Need streaming CSV generation.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v2.1.3',
      },
      {
         title: 'GraphQL queries missing dataloader optimization',
         description: 'N+1 query problem in nested resolvers. Need to implement DataLoader for batching.',
         status: IssueStatus.NEW,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Staging v2.2.0',
      },
      {
         title: 'Redis cache invalidation not working',
         description: 'Cached data persists after updates. Cache keys not being purged on mutations. Users see old data.',
         status: IssueStatus.READY_FOR_QA,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Staging v2.2.0',
      },
      {
         title: 'WebSocket reconnection logic missing',
         description: 'When connection drops, app doesn\'t auto-reconnect. Users have to refresh page. Need exponential backoff retry.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Infinite scroll triggers too early',
         description: 'Next page loads when user is still 3 screens away from bottom. Should trigger at 1 screen distance.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Image compression too aggressive on avatars',
         description: 'User avatars look pixelated after upload. JPEG quality set to 60%, should be 85%.',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.1',
      },
      {
         title: 'Markdown renderer doesn\'t support code syntax highlighting',
         description: 'Code blocks in markdown show as plain text. Need to integrate Prism.js or highlight.js.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'OAuth callback redirect to wrong domain in staging',
         description: 'Google OAuth redirects to production domain even when initiated from staging. Environment variable issue.',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Staging v2.1.5',
      },
      {
         title: 'Drag and drop file upload not working on Firefox',
         description: 'File drop zone works on Chrome/Safari but not Firefox. Event handler compatibility issue.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Table sorting case-sensitive',
         description: 'Column sorting treats lowercase and uppercase differently. "apple" appears after "Zebra". Need case-insensitive sort.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Date picker doesn\'t respect locale',
         description: 'Calendar shows Sunday as first day of week for all users. Should use locale-based configuration.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'API rate limit headers missing in response',
         description: 'X-RateLimit-Remaining and X-RateLimit-Reset headers not included. Clients cannot anticipate rate limits.',
         status: IssueStatus.READY_FOR_QA,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Staging v2.2.0',
      },
      {
         title: 'Memory leak in chart component',
         description: 'Chart.js instances not being destroyed on unmount. Memory usage grows from 100MB to 2GB after 30 minutes.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Missing error boundary in React app',
         description: 'Uncaught errors crash entire app. Need to implement error boundaries to show fallback UI.',
         status: IssueStatus.NEW,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'CORS headers blocking third-party integrations',
         description: 'Zapier webhooks failing due to CORS. Need to whitelist specific origins in API gateway.',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.0',
      },
      {
         title: 'Pagination broken on search results',
         description: 'Page 2+ shows same results as page 1. Elasticsearch from/size parameters not being passed correctly.',
         status: IssueStatus.READY_FOR_QA,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Staging v2.2.0',
      },
      {
         title: 'Video player controls disappear on fullscreen',
         description: 'HTML5 video player controls not visible in fullscreen mode. z-index issue with custom controls.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'SSO login redirect loop with Azure AD',
         description: 'Users stuck in infinite redirect between app and Azure AD. Session cookie not persisting.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.CRITICAL,
         severity: IssueSeverity.CRITICAL,
         environment: 'Production v2.1.3',
      },
      {
         title: 'Form validation messages in English only',
         description: 'Error messages not internationalized. Need to integrate with i18n library.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Auto-save conflicts with manual save',
         description: 'Draft auto-save overwrites manual saves. Race condition in save logic. Users losing work.',
         status: IssueStatus.IN_PROGRESS,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Chart tooltips render behind other elements',
         description: 'Tooltip z-index too low. Gets hidden behind modals and dropdowns.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
      {
         title: 'API versioning not enforced',
         description: 'Breaking changes deployed without version bump. Need to implement proper API versioning strategy.',
         status: IssueStatus.NEW,
         priority: IssuePriority.MEDIUM,
         severity: IssueSeverity.MINOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Database indexes missing on frequently queried columns',
         description: 'Queries on user_email and created_at columns taking 5+ seconds. Need composite indexes.',
         status: IssueStatus.READY_FOR_QA,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Staging v2.2.0',
      },
      {
         title: 'Password reset link expires too quickly',
         description: 'Reset tokens expire after 15 minutes. Users complain it\'s too short. Should be 1 hour.',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.2',
      },
      {
         title: 'Analytics tracking not GDPR compliant',
         description: 'Google Analytics loaded without user consent. Need cookie consent banner implementation.',
         status: IssueStatus.NEW,
         priority: IssuePriority.HIGH,
         severity: IssueSeverity.MAJOR,
         environment: 'Production v2.1.4',
      },
      {
         title: 'Mobile menu doesn\'t close after navigation',
         description: 'Hamburger menu stays open after clicking link. Need to add onClick handler to close menu.',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.3',
      },
      {
         title: 'SQL injection vulnerability in search endpoint',
         description: 'Search query not using parameterized statements. CRITICAL SECURITY ISSUE. Need immediate patch.',
         status: IssueStatus.CLOSED,
         priority: IssuePriority.CRITICAL,
         severity: IssueSeverity.CRITICAL,
         environment: 'Production v1.9.8',
      },
      {
         title: 'Loading spinner position jumps on mobile',
         description: 'Spinner not centered on small screens. Flexbox centering needs viewport-relative adjustments.',
         status: IssueStatus.NEW,
         priority: IssuePriority.LOW,
         severity: IssueSeverity.TRIVIAL,
         environment: 'Production v2.1.4',
      },
   ];

   const issues = [];
   for (let i = 0; i < issueTemplates.length; i++) {
      const template = issueTemplates[i];
      const reporter = randomPick([...qaUsers, ...clientUsers, ...pmUsers]);

      let assignee = null;
      if (template.status !== IssueStatus.NEW && template.status !== IssueStatus.CLOSED) {
         assignee = randomPick(devUsers);
      } else if (template.status === IssueStatus.CLOSED) {
         assignee = randomPick(devUsers);
      }

      const createdAt = randomDateInPast(60); // Issues created within last 60 days

      const issue = await prisma.issue.create({
         data: {
            key: `BUG-${i + 1}`,
            title: template.title,
            description: template.description,
            status: template.status,
            priority: template.priority,
            severity: template.severity,
            environment: template.environment,
            reporterId: reporter.id,
            assigneeId: assignee?.id || null,
            createdAt,
            updatedAt: new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Updated within 30 days of creation
         },
      });
      issues.push(issue);
   }

   console.log(`🐛 Created ${issues.length} realistic issues`);

   // Create realistic comments with conversations
   const commentTemplates = [
      { text: 'I can reproduce this on my local environment. Starting investigation.', isSystem: false },
      { text: 'This seems related to the recent deployment. Checking rollback options.', isSystem: false },
      { text: 'Found the root cause - race condition in async handler. Working on fix.', isSystem: false },
      { text: 'PR ready for review: https://github.com/company/repo/pull/1234', isSystem: false },
      { text: 'Deployed to staging for QA verification.', isSystem: false },
      { text: 'Verified fixed in staging. Approved for production deploy.', isSystem: false },
      { text: 'This is blocking our release. Can we prioritize?', isSystem: false },
      { text: 'Added workaround documentation while we work on permanent fix.', isSystem: false },
      { text: 'Cannot reproduce on my machine. Need more details about environment.', isSystem: false },
      { text: 'Tested on Chrome, Firefox, and Safari - all working now.', isSystem: false },
      { text: 'This affects all users in EU region due to GDPR cookie settings.', isSystem: false },
      { text: 'Fixed by reverting commit abc123. Need better solution long-term.', isSystem: false },
      { text: 'Code review comments addressed. Ready for merge.', isSystem: false },
      { text: 'Added regression tests to prevent this from happening again.', isSystem: false },
      { text: 'Performance improved by 80% with new caching strategy.', isSystem: false },
      { text: 'Need input from product team on expected behavior here.', isSystem: false },
      { text: 'This is a known limitation of the library we\'re using. Filed upstream issue.', isSystem: false },
      { text: 'Monitoring shows error rate dropped to 0% after deploy.', isSystem: false },
      { text: 'Client confirms this is no longer an issue in production.', isSystem: false },
      { text: 'Reopening - issue reappeared after latest deployment.', isSystem: false },
      { text: 'Root cause analysis completed. Documented in Confluence.', isSystem: false },
      { text: 'This requires database migration. Scheduling for maintenance window.', isSystem: false },
      { text: 'Quick fix deployed. Full refactor tracked in separate ticket.', isSystem: false },
      { text: 'Updated documentation to reflect new behavior.', isSystem: false },
      { text: 'False alarm - user error, not a bug. Closing ticket.', isSystem: false },
   ];

   const systemComments = [
      'Status changed from NEW to IN_PROGRESS',
      'Status changed from IN_PROGRESS to READY_FOR_QA',
      'Status changed from READY_FOR_QA to CLOSED',
      'Status changed from CLOSED to REOPENED',
      'Status changed from REOPENED to IN_PROGRESS',
      'Priority changed from MEDIUM to HIGH',
      'Priority changed from HIGH to CRITICAL',
      'Assignee changed',
      'Pull request #123 merged',
      'Commit abc123 linked to this issue',
   ];

   let commentCount = 0;

   // Add comments to issues with activity
   for (const issue of issues) {
      const shouldHaveComments = Math.random() > 0.2; // 80% of issues have comments
      if (!shouldHaveComments) continue;

      const numComments = Math.floor(Math.random() * 8) + 1; // 1-8 comments per issue

      for (let i = 0; i < numComments; i++) {
         const isSystemComment = Math.random() < 0.3; // 30% system comments

         if (isSystemComment) {
            await prisma.comment.create({
               data: {
                  issueId: issue.id,
                  authorId: null,
                  text: randomPick(systemComments),
                  isSystem: true,
                  createdAt: new Date(issue.createdAt.getTime() + i * 24 * 60 * 60 * 1000),
               },
            });
         } else {
            const author = randomPick([...devUsers, ...qaUsers, ...pmUsers]);
            await prisma.comment.create({
               data: {
                  issueId: issue.id,
                  authorId: author.id,
                  text: randomPick(commentTemplates).text,
                  isSystem: false,
                  createdAt: new Date(issue.createdAt.getTime() + i * 24 * 60 * 60 * 1000),
               },
            });
         }
         commentCount++;
      }
   }

   console.log(`💬 Created ${commentCount} realistic comments`);

   // Create realistic code changes (commits and PRs)
   const codeChangeData = [
      { type: CodeChangeType.COMMIT, id: 'a1b2c3d4', title: 'Fix payment gateway timeout handling', author: 'bob.smith@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'e5f6g7h8', title: 'Increase database connection pool size', author: 'david.lee@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'i9j0k1l2', title: 'Remove passwordHash from API response', author: 'emily.rodriguez@bugtracker.com' },
      { type: CodeChangeType.PULL_REQUEST, id: '101', title: 'Security: Fix user data exposure in API', author: 'emily.rodriguez@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'm3n4o5p6', title: 'Fix iOS Safari touch event handlers', author: 'frank.anderson@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'q7r8s9t0', title: 'Reconnect SendGrid client on connection loss', author: 'grace.taylor@bugtracker.com' },
      { type: CodeChangeType.PULL_REQUEST, id: '102', title: 'Email notification system improvements', author: 'grace.taylor@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'u1v2w3x4', title: 'Update mobile session timeout to 30 minutes', author: 'henry.kumar@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'y5z6a7b8', title: 'Fix WebSocket reconnection logic', author: 'iris.patel@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'c9d0e1f2', title: 'Increase nginx proxy timeout to 60s', author: 'bob.smith@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'g3h4i5j6', title: 'Implement parallel widget loading', author: 'carol.williams@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'k7l8m9n0', title: 'Add Redis caching for dashboard API', author: 'carol.williams@bugtracker.com' },
      { type: CodeChangeType.PULL_REQUEST, id: '103', title: 'Dashboard performance optimization', author: 'carol.williams@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'o1p2q3r4', title: 'Fix dark mode CSS transition', author: 'frank.anderson@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 's5t6u7v8', title: 'Improve Elasticsearch scoring algorithm', author: 'david.lee@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'w9x0y1z2', title: 'Fix Puppeteer viewport settings for PDF', author: 'emily.rodriguez@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'a3b4c5d6', title: 'Add UTC-12 timezone to moment config', author: 'henry.kumar@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'e7f8g9h0', title: 'Debounce notification badge updates', author: 'iris.patel@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'i1j2k3l4', title: 'Implement keyboard navigation in dropdowns', author: 'grace.taylor@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'm5n6o7p8', title: 'Fix Android 14 compatibility issue', author: 'frank.anderson@bugtracker.com' },
      { type: CodeChangeType.PULL_REQUEST, id: '104', title: 'Android 14 security policy updates', author: 'frank.anderson@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'q9r0s1t2', title: 'Add smart tooltip positioning', author: 'bob.smith@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'u3v4w5x6', title: 'Refactor class components to hooks', author: 'carol.williams@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'y7z8a9b0', title: 'Fix typo: Successfull → Successfully', author: 'david.lee@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'c1d2e3f4', title: 'Center avatar preview with flexbox', author: 'emily.rodriguez@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'g5h6i7j8', title: 'Add favicon to error page templates', author: 'henry.kumar@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'k9l0m1n2', title: 'Use dynamic year in footer copyright', author: 'iris.patel@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'o3p4q5r6', title: 'Increase API rate limit to 500 req/min', author: 'grace.taylor@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 's7t8u9v0', title: 'Implement streaming CSV generation', author: 'frank.anderson@bugtracker.com' },
      { type: CodeChangeType.PULL_REQUEST, id: '105', title: 'Large dataset export optimization', author: 'frank.anderson@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'w1x2y3z4', title: 'Add DataLoader to GraphQL resolvers', author: 'bob.smith@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'a5b6c7d8', title: 'Fix Redis cache invalidation on mutations', author: 'carol.williams@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'e9f0g1h2', title: 'Implement exponential backoff for WebSocket', author: 'david.lee@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'i3j4k5l6', title: 'Adjust infinite scroll trigger threshold', author: 'emily.rodriguez@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'm7n8o9p0', title: 'Increase JPEG quality to 85%', author: 'henry.kumar@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'q1r2s3t4', title: 'Integrate Prism.js for code highlighting', author: 'iris.patel@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'u5v6w7x8', title: 'Fix OAuth redirect environment variable', author: 'grace.taylor@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'y9z0a1b2', title: 'Add Firefox drag-and-drop compatibility', author: 'frank.anderson@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'c3d4e5f6', title: 'Implement case-insensitive table sorting', author: 'bob.smith@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'g7h8i9j0', title: 'Add locale-based calendar configuration', author: 'carol.williams@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'k1l2m3n4', title: 'Add X-RateLimit headers to API responses', author: 'david.lee@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'o5p6q7r8', title: 'Fix Chart.js instance cleanup on unmount', author: 'emily.rodriguez@bugtracker.com' },
      { type: CodeChangeType.PULL_REQUEST, id: '106', title: 'Memory leak fixes in chart components', author: 'emily.rodriguez@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 's9t0u1v2', title: 'Add React error boundaries', author: 'henry.kumar@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'w3x4y5z6', title: 'Update CORS whitelist for Zapier', author: 'iris.patel@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'a7b8c9d0', title: 'Fix Elasticsearch pagination parameters', author: 'grace.taylor@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'e1f2g3h4', title: 'Fix video player fullscreen z-index', author: 'frank.anderson@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'i5j6k7l8', title: 'Fix Azure AD session cookie persistence', author: 'bob.smith@bugtracker.com' },
      { type: CodeChangeType.PULL_REQUEST, id: '107', title: 'SSO authentication improvements', author: 'bob.smith@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'm9n0o1p2', title: 'Add i18n to form validation messages', author: 'carol.williams@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'q3r4s5t6', title: 'Fix auto-save race condition with mutex', author: 'david.lee@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'u7v8w9x0', title: 'Increase chart tooltip z-index to 9999', author: 'emily.rodriguez@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'y1z2a3b4', title: 'Implement API versioning middleware', author: 'henry.kumar@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'c5d6e7f8', title: 'Add composite indexes on user queries', author: 'iris.patel@bugtracker.com' },
      { type: CodeChangeType.PULL_REQUEST, id: '108', title: 'Database performance optimization', author: 'iris.patel@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'g9h0i1j2', title: 'Extend password reset token TTL to 1 hour', author: 'grace.taylor@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'k3l4m5n6', title: 'Implement GDPR cookie consent banner', author: 'frank.anderson@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'o7p8q9r0', title: 'Close mobile menu after navigation', author: 'bob.smith@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 's1t2u3v4', title: 'Fix SQL injection with parameterized queries', author: 'carol.williams@bugtracker.com' },
      { type: CodeChangeType.PULL_REQUEST, id: '109', title: 'CRITICAL: Security patch for SQL injection', author: 'carol.williams@bugtracker.com' },
      { type: CodeChangeType.COMMIT, id: 'w5x6y7z8', title: 'Fix loading spinner mobile positioning', author: 'david.lee@bugtracker.com' },
   ];

   const codeChanges = [];
   for (const data of codeChangeData) {
      const change = await prisma.codeChange.create({
         data: {
            type: data.type,
            externalId: data.id,
            title: data.title,
            url: data.type === CodeChangeType.COMMIT
               ? `https://github.com/company/bugtracker/commit/${data.id}`
               : `https://github.com/company/bugtracker/pull/${data.id}`,
            author: data.author,
            occurredAt: randomDateInPast(45),
         },
      });
      codeChanges.push(change);
   }

   console.log(`📝 Created ${codeChanges.length} code changes (commits and PRs)`);

   // Link code changes to issues (realistic linkage based on issue content)
   let linkCount = 0;
   const statusesWithCode = [IssueStatus.IN_PROGRESS, IssueStatus.READY_FOR_QA, IssueStatus.CLOSED, IssueStatus.REOPENED];
   for (let i = 0; i < Math.min(issues.length, codeChanges.length); i++) {
      const issue = issues[i];

      // Only link code changes to issues that are in progress, ready for QA, or closed
      if (statusesWithCode.includes(issue.status as any)) {
         const numLinks = Math.floor(Math.random() * 3) + 1; // 1-3 code changes per issue
         const selectedChanges = randomPickMultiple(codeChanges, numLinks);

         for (const change of selectedChanges) {
            try {
               await prisma.issueCodeChange.create({
                  data: {
                     issueId: issue.id,
                     codeChangeId: change.id,
                  },
               });
               linkCount++;
            } catch (e) {
               // Skip if already linked
            }
         }
      }
   }

   console.log(`🔗 Linked ${linkCount} code changes to issues`);

   // Create realistic issue watchers
   let watcherCount = 0;
   for (const issue of issues) {
      // Critical/High priority issues get more watchers
      const watcherMultiplier = issue.priority === IssuePriority.CRITICAL ? 5 :
         issue.priority === IssuePriority.HIGH ? 3 : 2;

      const numWatchers = Math.floor(Math.random() * watcherMultiplier) + 1;

      // Always include reporter and assignee
      const potentialWatchers = [...users.filter(u => u.active)];
      const selectedWatchers = new Set<number>();

      if (issue.reporterId) selectedWatchers.add(issue.reporterId);
      if (issue.assigneeId) selectedWatchers.add(issue.assigneeId);

      // Add random watchers
      for (let i = 0; i < numWatchers; i++) {
         const watcher = randomPick(potentialWatchers);
         selectedWatchers.add(watcher.id);
      }

      // PMs watch critical issues
      if (issue.priority === IssuePriority.CRITICAL) {
         pmUsers.forEach(pm => selectedWatchers.add(pm.id));
      }

      // Create watcher records
      for (const userId of selectedWatchers) {
         try {
            await prisma.issueWatcher.create({
               data: {
                  issueId: issue.id,
                  userId,
               },
            });
            watcherCount++;
         } catch (e) {
            // Skip if already exists
         }
      }
   }

   console.log(`👀 Created ${watcherCount} issue watchers`);

   console.log('\n✅ Database seeding completed successfully!\n');
   console.log('📊 Summary:');
   console.log(`   - ${users.length} Users (${qaUsers.length} QA, ${devUsers.length} DEV, ${pmUsers.length} PM, ${clientUsers.length} CLIENT)`);
   console.log(`   - ${issues.length} Issues (realistic bug scenarios)`);
   console.log(`   - ${commentCount} Comments (user and system generated)`);
   console.log(`   - ${codeChanges.length} Code Changes (commits and PRs)`);
   console.log(`   - ${linkCount} Issue-Code Change links`);
   console.log(`   - ${watcherCount} Issue Watchers`);
   console.log('\n🔐 All users have password: password123');
   console.log('\n📧 Sample user emails:');
   console.log('   - alice.johnson@bugtracker.com (QA)');
   console.log('   - bob.smith@bugtracker.com (DEV)');
   console.log('   - john.davis@bugtracker.com (PM)');
   console.log('   - emma.thompson@techcorp.com (CLIENT)');
   console.log('\n💡 Tip: Use any email above with password "password123" to login');
}

main()
   .catch((e) => {
      console.error('❌ Error seeding database:', e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
