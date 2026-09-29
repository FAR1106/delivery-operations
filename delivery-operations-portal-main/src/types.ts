/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HealthStatus = 'On Track' | 'At Risk' | 'Critical';
export type RiskSeverity = 'High' | 'Medium' | 'Low';
export type RiskImpact = 'High' | 'Medium' | 'Low';
export type RiskStatus = 'Open' | 'Mitigated' | 'Escalated';

export interface Project {
  id: string;
  name: string;
  client: string;
  deliveryLead: string;
  healthScore: number; // 0-100
  status: HealthStatus;
  sprintVelocity: number; // e.g. points per sprint
  targetVelocity: number;
  teamSize: number;
  lastUpdated: string;
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  duration: {
    start: string;
    end: string;
    elapsedPercentage: number;
  };
  description: string;
  category: string;
  indicators: {
    scope: 'On Track' | 'At Risk' | 'Critical';
    schedule: 'On Track' | 'At Risk' | 'Critical';
    budget: 'On Track' | 'At Risk' | 'Critical';
    resources: 'On Track' | 'At Risk' | 'Critical';
  };
  mlHealthModel?: {
    confidence: number;
    probabilities: {
      green: number;
      amber: number;
      red: number;
    };
    featureImpacts: Array<{ feature: string; weight: number; impact: 'Positive' | 'Negative' | 'Neutral' }>;
  };
}

export interface Risk {
  id: string;
  projectId: string;
  projectName: string;
  riskName: string;
  severity: RiskSeverity;
  impactLevel: RiskImpact;
  rootCause: string;
  triggerTime: string;
  status: RiskStatus;
  recommendedActions: string;
  mitigationPlan: string;
  owner: string;
}

export interface ResourceAllocation {
  resourceId: string;
  name: string;
  role: string;
  department: string;
  allocationPercentage: number; // e.g. 100% is full allocation
  status: 'Optimal' | 'Overloaded' | 'Underutilized';
  projects: string[];
  skills: string[];
  billable: boolean;
}

export interface CapacityPlanMonth {
  month: string;
  currentCapacity: number; // in FTEs or Story Points
  projectedDemand: number;
  gap: number;
  recommendations: string[];
}

export interface WeeklyStatusReport {
  id: string;
  projectId: string;
  projectName: string;
  weekEnding: string;
  executiveSummary: string;
  achievements: string[];
  risks: string[];
  blockers: string[];
  recommendations: string[];
  metrics: {
    velocity: number;
    qualityRate: number; // e.g. 96%
    burnDownStatus: 'Ahead' | 'On Track' | 'Behind';
    completionPercentage: number;
  };
  author: string;
}

export interface PortfolioKPIs {
  totalProjects: number;
  healthyProjects: number;
  atRiskProjects: number;
  criticalProjects: number;
  resourceUtilizationRate: number; // e.g. 84%
  averageSprintVelocity: number;
}

// ─── Organization & Integration Types ────────────────────────────────────────

export interface IntegrationStatus {
  connected: boolean;
  authStatus: 'Authenticated' | 'Failed' | 'Pending' | 'Not Connected';
  lastSync: string | null;
  syncHealth: 'Healthy' | 'Warning' | 'Error' | 'N/A';
  importedRecords: number;
  failedImports: number;
  endpoint?: string;
  token?: string;
  syncFrequency?: string;
  projectKey?: string;
  user?: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  adminName: string;
  adminEmail: string;
  status: 'Active' | 'Pending' | 'Inactive';
  createdAt: string;
  projectIds: string[];
  healthWarningThreshold?: number;
  healthCriticalThreshold?: number;
  integrations: {
    github: IntegrationStatus;
    azureDevOps?: IntegrationStatus;
    jira?: IntegrationStatus;
    timesheet?: IntegrationStatus;
  };
}

export interface EmployeeMapping {
  employeeId: string;
  employeeName: string;
  department: string;
  githubUsername: string;
  adoUser?: string;
  timesheetId: string;
  orgId: string;
  status: 'Matched' | 'Unmatched' | 'Pending';
  role?: string;
  accessActive?: boolean;
}

export interface SyncRecord {
  id: string;
  orgId: string;
  platform: 'GitHub' | 'Jira' | 'Timesheet';
  lastSync: string;
  importedRecords: number;
  status: 'Success' | 'Failed' | 'In Progress' | 'Partial';
  failedImports: number;
  duration: string;
}

