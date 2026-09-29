/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Risk, ResourceAllocation } from '../types';

// ─── Raw Input Schemas (Platform Specific) ──────────────────────────────────

export interface RawGithubRepoStats {
  repoName: string;
  commitsCount: number;
  pullRequestsOpen: number;
  pullRequestsClosed: number;
  contributors: string[];
  lastCommitDate: string;
}

export interface RawJiraSprintData {
  sprintName: string;
  completedPoints: number;
  plannedPoints: number;
  issues: Array<{
    key: string;
    summary: string;
    status: 'To Do' | 'In Progress' | 'Done' | 'Blocked';
    points: number;
    assignee: string;
    type: 'Story' | 'Bug' | 'Risk';
    priority: 'Low' | 'Medium' | 'High' | 'Highest';
    description?: string;
  }>;
}

export interface RawTimesheetEntry {
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  projectName: string;
  hoursWorked: number; // For a weekly period (e.g. 40 hrs is normal capacity)
  billable: boolean;
  skills: string[];
}

// ─── Adapter Implementations ──────────────────────────────────────────────────

/**
 * GitHub Adapter: Standardizes source code repository metrics.
 */
export class GitHubAdapter {
  /**
   * Transforms raw GitHub data into standardized project velocity and status indicators.
   */
  static transform(
    orgId: string,
    existingProject: Project,
    rawStats: RawGithubRepoStats
  ): Partial<Project> {
    // 1 commit represents some sprint effort. Convert commits to velocity trends.
    // Calculate a simulated sprint velocity based on commit volumes
    const calculatedVelocity = Math.min(
      Math.round(rawStats.commitsCount / 5),
      existingProject.targetVelocity * 1.2
    );

    // Determine status indicators based on pull requests and commits
    let scopeStatus: Project['indicators']['scope'] = 'On Track';
    let scheduleStatus: Project['indicators']['schedule'] = 'On Track';

    if (rawStats.pullRequestsOpen > 8) {
      scopeStatus = 'At Risk';
    }
    if (rawStats.commitsCount < 10) {
      scheduleStatus = 'Critical';
    } else if (rawStats.commitsCount < 25) {
      scheduleStatus = 'At Risk';
    }

    return {
      sprintVelocity: calculatedVelocity > 0 ? calculatedVelocity : existingProject.sprintVelocity,
      lastUpdated: rawStats.lastCommitDate.split('T')[0],
      indicators: {
        ...existingProject.indicators,
        scope: scopeStatus,
        schedule: scheduleStatus,
      }
    };
  }
}

/**
 * Jira Adapter: Standardizes task tracker sprint state and issues.
 */
export class JiraAdapter {
  /**
   * Transforms Jira sprint boards and tickets into project indicators and risk logs.
   */
  static transformProject(
    existingProject: Project,
    rawSprint: RawJiraSprintData
  ): { projectUpdates: Partial<Project>; newRisks: Partial<Risk>[] } {
    // Sprint Velocity = completed story points
    const sprintVelocity = rawSprint.completedPoints;
    const targetVelocity = rawSprint.plannedPoints;

    // Evaluate health score and indicators
    const velocityRatio = targetVelocity > 0 ? sprintVelocity / targetVelocity : 1;
    let status: Project['status'] = 'On Track';
    let scheduleIndicator: Project['indicators']['schedule'] = 'On Track';

    if (velocityRatio < 0.6) {
      status = 'Critical';
      scheduleIndicator = 'Critical';
    } else if (velocityRatio < 0.85) {
      status = 'At Risk';
      scheduleIndicator = 'At Risk';
    }

    // Identify risk-related tasks and map them to Project Risk objects
    const newRisks: Partial<Risk>[] = rawSprint.issues
      .filter(issue => issue.type === 'Risk' || issue.status === 'Blocked')
      .map(issue => {
        const severity: Risk['severity'] = 
          issue.priority === 'Highest' || issue.priority === 'High' ? 'High' : 
          issue.priority === 'Medium' ? 'Medium' : 'Low';
        
        return {
          projectId: existingProject.id,
          projectName: existingProject.name,
          riskName: issue.summary,
          severity,
          impactLevel: severity,
          rootCause: issue.description || `Jira Issue ${issue.key} marked Blocked/Risk.`,
          triggerTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
          status: 'Open',
          mitigationPlan: 'Assign to sprint scrum team to debug blocker dependencies.',
          owner: issue.assignee || existingProject.deliveryLead,
        };
      });

    return {
      projectUpdates: {
        sprintVelocity,
        targetVelocity,
        status,
        indicators: {
          ...existingProject.indicators,
          schedule: scheduleIndicator,
          scope: rawSprint.issues.filter(i => i.status === 'Blocked').length > 2 ? 'At Risk' : 'On Track'
        }
      },
      newRisks
    };
  }
}

/**
 * Timesheet Adapter: Standardizes employee logged hours and capacity.
 */
export class TimesheetAdapter {
  /**
   * Transforms timesheet raw entries into internal ResourceAllocation formats.
   */
  static transform(
    rawEntries: RawTimesheetEntry[],
    activeProjects: Project[]
  ): ResourceAllocation[] {
    const projectNames = activeProjects.map(p => p.name);

    return rawEntries.map(entry => {
      // Map hours to allocation percentage: 40 hrs = 100% allocation
      const allocationPercentage = Math.round((entry.hoursWorked / 40) * 100);
      
      let status: ResourceAllocation['status'] = 'Optimal';
      if (allocationPercentage > 110) {
        status = 'Overloaded';
      } else if (allocationPercentage < 60) {
        status = 'Underutilized';
      }

      // Ensure projects linked to resource are matched to active platform project names
      const matchedProjects = projectNames.filter(pName => 
        pName.toLowerCase().includes(entry.projectName.toLowerCase()) ||
        entry.projectName.toLowerCase().includes(pName.toLowerCase())
      );

      return {
        resourceId: entry.employeeId,
        name: entry.employeeName,
        role: entry.role,
        department: entry.department,
        allocationPercentage,
        status,
        projects: matchedProjects.length > 0 ? matchedProjects : [entry.projectName],
        skills: entry.skills,
        billable: entry.billable
      };
    });
  }
}
