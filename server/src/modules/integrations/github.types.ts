export interface GithubCommit {
   id: string;
   message: string;
   timestamp: string;
   url: string;
   author: {
      name: string;
      email: string;
      username?: string;
   };
}

export interface GithubPushEvent {
   ref: string;
   repository: {
      name: string;
      full_name: string;
      html_url: string;
   };
   commits: GithubCommit[];
   pusher: {
      name: string;
      email: string;
   };
}

export interface GithubPullRequest {
   number: number;
   title: string;
   body: string | null;
   html_url: string;
   state: string;
   merged: boolean;
   user: {
      login: string;
   };
   created_at: string;
   updated_at: string;
   merged_at: string | null;
}

export interface GithubPullRequestEvent {
   action: string;
   number: number;
   pull_request: GithubPullRequest;
   repository: {
      name: string;
      full_name: string;
      html_url: string;
   };
}

export interface WebhookHeaders {
   'x-github-event'?: string;
   'x-hub-signature-256'?: string;
   'x-github-delivery'?: string;
}
