export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  department?: string;
  joinDate?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface JiraTicket {
  id: string;
  key: string;
  summary: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
  updated: string;
}

export interface GitActivity {
  id: string;
  repo: string;
  message: string;
  author: string;
  timestamp: string;
  filesChanged: number;
  additions: number;
  deletions: number;
}

export interface VSCodeActivity {
  id: string;
  fileName: string;
  action: 'opened' | 'edited' | 'closed';
  timestamp: string;
  duration: number;
  linesChanged?: number;
}

export interface QuestionnaireResponse {
  id: string;
  employeeId: string;
  weekOf: string;
  responses: Record<string, string>;
  status: 'draft' | 'submitted' | 'reviewed';
  submittedAt?: string;
  reviewedAt?: string;
  feedback?: string;
}

export interface Report {
  id: string;
  employeeId: string;
  weekOf: string;
  content: string;
  type: 'detailed' | 'summary';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  feedback?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ActivitySummary {
  jiraTickets: number;
  gitCommits: number;
  vscodeHours: number;
  completionRate: number;
}