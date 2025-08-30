import axios from 'axios';
import { User, JiraTicket, GitActivity, VSCodeActivity, QuestionnaireResponse, Report, Notification } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock data generators
const generateMockJiraTickets = (): JiraTicket[] => [
  {
    id: '1',
    key: 'PROJ-123',
    summary: 'Implement user authentication system',
    status: 'In Progress',
    priority: 'High',
    assignee: 'John Doe',
    created: '2024-12-09T09:00:00Z',
    updated: '2024-12-15T14:30:00Z',
  },
  {
    id: '2',
    key: 'PROJ-124',
    summary: 'Fix dashboard loading performance',
    status: 'Ready for Review',
    priority: 'Medium',
    assignee: 'John Doe',
    created: '2024-12-10T11:00:00Z',
    updated: '2024-12-15T16:45:00Z',
  },
];

const generateMockGitActivity = (): GitActivity[] => [
  {
    id: '1',
    repo: 'employee-portal',
    message: 'feat: add voice-to-text functionality',
    author: 'John Doe',
    timestamp: '2024-12-15T15:30:00Z',
    filesChanged: 3,
    additions: 45,
    deletions: 8,
  },
  {
    id: '2',
    repo: 'employee-portal',
    message: 'fix: resolve authentication bug',
    author: 'John Doe',
    timestamp: '2024-12-15T13:15:00Z',
    filesChanged: 2,
    additions: 12,
    deletions: 5,
  },
];

const generateMockVSCodeActivity = (): VSCodeActivity[] => [
  {
    id: '1',
    fileName: 'components/Dashboard.tsx',
    action: 'edited',
    timestamp: '2024-12-15T16:20:00Z',
    duration: 1800000, // 30 minutes
    linesChanged: 23,
  },
  {
    id: '2',
    fileName: 'services/api.ts',
    action: 'edited',
    timestamp: '2024-12-15T14:45:00Z',
    duration: 900000, // 15 minutes
    linesChanged: 8,
  },
];

export const authApi = {
  login: async (email: string, password: string) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { token: `mock-jwt-${Date.now()}`, user: { email, role: email.includes('admin') ? 'admin' : 'employee' } };
  },
  
  resetPassword: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },
};

export const employeeApi = {
  getActivity: async (): Promise<{
    jira: JiraTicket[];
    git: GitActivity[];
    vscode: VSCodeActivity[];
  }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      jira: generateMockJiraTickets(),
      git: generateMockGitActivity(),
      vscode: generateMockVSCodeActivity(),
    };
  },

  getQuestionnaire: async (weekOf: string): Promise<QuestionnaireResponse | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: '1',
      employeeId: '1',
      weekOf,
      responses: {},
      status: 'draft',
    };
  },

  saveQuestionnaire: async (data: Partial<QuestionnaireResponse>): Promise<QuestionnaireResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id: '1', employeeId: '1', status: 'draft' } as QuestionnaireResponse;
  },

  submitQuestionnaire: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};

export const adminApi = {
  getEmployees: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        email: 'john.doe@company.com',
        name: 'John Doe',
        role: 'employee',
        department: 'Engineering',
        joinDate: '2024-01-15',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
      },
      {
        id: '3',
        email: 'alice.johnson@company.com',
        name: 'Alice Johnson',
        role: 'employee',
        department: 'Design',
        joinDate: '2023-11-03',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
      },
    ];
  },

  getReports: async (): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        employeeId: '1',
        weekOf: '2024-12-09',
        content: 'This week I focused on implementing the authentication system...',
        type: 'detailed',
        status: 'pending',
        createdAt: '2024-12-15T10:00:00Z',
        updatedAt: '2024-12-15T10:00:00Z',
      },
    ];
  },

  approveReport: async (reportId: string, feedback?: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  rejectReport: async (reportId: string, feedback: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: '1',
        userId: '1',
        title: 'Weekly Report Due',
        message: 'Your weekly report is due in 2 days',
        type: 'warning',
        read: false,
        createdAt: '2024-12-15T09:00:00Z',
      },
      {
        id: '2',
        userId: '1',
        title: 'New Jira Ticket Assigned',
        message: 'PROJ-125 has been assigned to you',
        type: 'info',
        read: false,
        createdAt: '2024-12-15T11:30:00Z',
      },
    ];
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
  },
};