export const PROJECT_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DELAYED: 'Delayed',
  CANCELLED: 'Cancelled',
}

export const RISK_LEVEL = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

export const VERIFICATION_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
}

export const USER_ROLES = {
  ADMIN: 'Admin',
  OFFICER: 'Officer',
  INSPECTOR: 'Inspector',
  VIEWER: 'Viewer',
}

export const API_ENDPOINTS = {
  PROJECTS: '/projects/',
  RISK: '/risk/',
  VERIFICATION: '/verification/',
  REPORTS: '/reports/',
  ANALYTICS_PROJECTS: '/analytics/projects',
  ANALYTICS_RISKS: '/analytics/risks',
  DASHBOARD: '/dashboard/summary',
  NOTIFICATIONS: '/notifications/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
}
