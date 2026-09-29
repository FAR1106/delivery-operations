/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Risk, ResourceAllocation, CapacityPlanMonth, WeeklyStatusReport, PortfolioKPIs } from '../types';

export const mockProjects: Project[] = [];

export const mockRisks: Risk[] = [];

export const mockResources: ResourceAllocation[] = [];

export const mockCapacityForecast: CapacityPlanMonth[] = [];

export const mockStatusReports: WeeklyStatusReport[] = [];

export const portfolioHistoricalTrends: Array<{
  name: string;
  healthy: number;
  atRisk: number;
  critical: number;
  velocity: number;
}> = [];

export const getPortfolioKPIs = (projects: Project[]): PortfolioKPIs => {
  const total = projects.length;
  const healthy = projects.filter(p => p.status === 'On Track').length;
  const atRisk = projects.filter(p => p.status === 'At Risk').length;
  const critical = projects.filter(p => p.status === 'Critical').length;
  
  // Calculate average utilization
  const totalUtilization = mockResources.reduce((sum, r) => sum + r.allocationPercentage, 0);
  const avgUtilization = mockResources.length > 0 ? Math.round(totalUtilization / mockResources.length) : 0;
  
  // Calculate average velocity
  const totalVelocity = projects.reduce((sum, p) => sum + p.sprintVelocity, 0);
  const avgVelocity = total > 0 ? Math.round(totalVelocity / total) : 0;

  return {
    totalProjects: total,
    healthyProjects: healthy,
    atRiskProjects: atRisk,
    criticalProjects: critical,
    resourceUtilizationRate: avgUtilization,
    averageSprintVelocity: avgVelocity
  };
};
