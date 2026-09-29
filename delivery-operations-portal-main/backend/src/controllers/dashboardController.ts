/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { query } from '../db/db';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  const company = req.query.company as string;
  try {
    let result;
    if (!company || company === 'All Companies') {
      result = await query('SELECT * FROM projects ORDER BY name ASC');
    } else {
      result = await query(`
        SELECT p.* FROM projects p
        LEFT JOIN organizations o ON p.organization_id = o.id
        WHERE p.client ILIKE $1 OR o.name ILIKE $1
        ORDER BY p.name ASC
      `, [company]);
    }

    // Map DB budget field naming to match frontend Project types
    const mappedProjects = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      client: row.client,
      deliveryLead: row.delivery_lead,
      healthScore: row.health_score,
      status: row.status,
      sprintVelocity: row.sprint_velocity,
      targetVelocity: row.target_velocity,
      teamSize: row.team_size,
      lastUpdated: row.last_updated ? row.last_updated.toISOString().split('T')[0] : null,
      budget: {
        total: parseFloat(row.budget_total || 0),
        spent: parseFloat(row.budget_spent || 0),
        currency: row.budget_currency
      },
      duration: {
        start: row.duration_start ? row.duration_start.toISOString().split('T')[0] : null,
        end: row.duration_end ? row.duration_end.toISOString().split('T')[0] : null,
        elapsedPercentage: row.duration_elapsed_percentage
      },
      description: row.description,
      category: row.category,
      indicators: {
        scope: row.indicator_scope,
        schedule: row.indicator_schedule,
        budget: row.indicator_budget,
        resources: row.indicator_resources
      }
    }));

    res.status(200).json(mappedProjects);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch projects' });
  }
};

export const getRisks = async (req: Request, res: Response): Promise<void> => {
  const company = req.query.company as string;
  try {
    let result;
    if (!company || company === 'All Companies') {
      result = await query('SELECT * FROM risks ORDER BY id DESC');
    } else {
      result = await query(`
        SELECT r.* FROM risks r 
        JOIN projects p ON r.project_id = p.id 
        LEFT JOIN organizations o ON p.organization_id = o.id
        WHERE p.client ILIKE $1 OR o.name ILIKE $1
        ORDER BY r.id DESC
      `, [company]);
    }

    const mappedRisks = result.rows.map((row: any) => ({
      id: row.id,
      projectId: row.project_id,
      projectName: row.project_name,
      riskName: row.risk_name,
      severity: row.severity,
      impactLevel: row.impact_level,
      rootCause: row.root_cause,
      triggerTime: row.trigger_time,
      status: row.status,
      recommendedActions: row.recommended_actions || row.mitigation_plan,
      mitigationPlan: row.mitigation_plan,
      owner: row.owner
    }));

    res.status(200).json(mappedRisks);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch risks' });
  }
};

export const getResources = async (req: Request, res: Response): Promise<void> => {
  const company = req.query.company as string;
  try {
    let result;
    if (!company || company === 'All Companies') {
      result = await query('SELECT * FROM resources ORDER BY name ASC');
    } else {
      result = await query(`
        SELECT DISTINCT r.* FROM resources r
        LEFT JOIN organizations o ON r.organization_id = o.id
        LEFT JOIN projects p ON p.name = ANY(r.projects)
        WHERE o.name ILIKE $1 OR p.client ILIKE $1 OR $1 = ANY(r.projects)
        ORDER BY r.name ASC
      `, [company]);
    }

    const mappedResources = result.rows.map((row: any) => ({
      resourceId: row.resource_id,
      name: row.name,
      role: row.role,
      department: row.department,
      allocationPercentage: row.allocation_percentage,
      status: row.status,
      projects: row.projects || [],
      skills: row.skills || [],
      billable: row.billable
    }));

    res.status(200).json(mappedResources);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch resources' });
  }
};

export const createResourceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, department, allocationPercentage, status, projects, skills } = req.body;
    const resourceId = `RES-${Date.now().toString().slice(-4)}`;
    
    await query(`
      INSERT INTO resources (resource_id, organization_id, name, role, department, allocation_percentage, status, projects, skills)
      VALUES ($1, 'ORG-001', $2, $3, $4, $5, $6, $7, $8)
    `, [
      resourceId,
      name || 'New Resource',
      role || 'Engineer',
      department || 'Engineering',
      allocationPercentage || 100,
      status || (allocationPercentage > 100 ? 'Overloaded' : allocationPercentage < 70 ? 'Underutilized' : 'Optimal'),
      projects || [],
      skills || []
    ]);

    res.status(201).json({ message: 'Resource allocated successfully', resourceId });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to allocate resource' });
  }
};

export const updateResourceAllocationController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { allocationPercentage, status } = req.body;
  try {
    const calculatedStatus = status || (allocationPercentage > 100 ? 'Overloaded' : allocationPercentage < 70 ? 'Underutilized' : 'Optimal');
    await query(
      'UPDATE resources SET allocation_percentage = $1, status = $2 WHERE resource_id = $3',
      [allocationPercentage, calculatedStatus, id]
    );
    res.status(200).json({ message: 'Resource allocation updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update resource allocation' });
  }
};

export const getResourceDemandsController = async (req: Request, res: Response): Promise<void> => {
  const company = req.query.company as string;
  try {
    let result;
    if (!company || company === 'All Companies') {
      result = await query('SELECT * FROM resource_demands ORDER BY date_submitted DESC');
    } else {
      result = await query(`
        SELECT * FROM resource_demands 
        WHERE company ILIKE $1 OR company = 'All Companies'
        ORDER BY date_submitted DESC
      `, [company]);
    }

    const mapped = result.rows.map((r: any) => ({
      id: r.id,
      role: r.role,
      qty: r.qty,
      projectName: r.project_name,
      company: r.company,
      priority: r.priority,
      skills: r.skills || [],
      status: r.status,
      dateSubmitted: r.date_submitted ? r.date_submitted.toISOString().split('T')[0] : null
    }));

    res.status(200).json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch resource demands' });
  }
};

export const createResourceDemandController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, qty, projectName, company, priority, skills } = req.body;
    const id = `DEM-${Date.now().toString().slice(-4)}`;

    await query(`
      INSERT INTO resource_demands (id, role, qty, project_name, company, priority, skills, status, date_submitted)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Sourcing', CURRENT_DATE)
    `, [
      id,
      role || 'Software Engineer',
      qty || 1,
      projectName || 'Unassigned Core Stream',
      company || 'All Companies',
      priority || 'Medium',
      skills || []
    ]);

    res.status(201).json({ message: 'Demand request submitted successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to submit demand request' });
  }
};

export const getResourceRagRecommendationController = async (req: Request, res: Response): Promise<void> => {
  const company = req.query.company as string;
  try {
    const { generateResourceAiRecommendation } = await import('../services/ragService');
    const result = await generateResourceAiRecommendation(company);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed generating RAG resource recommendation' });
  }
};

export const getReports = async (req: Request, res: Response): Promise<void> => {
  const company = req.query.company as string;
  try {
    let result;
    if (!company || company === 'All Companies') {
      result = await query('SELECT * FROM weekly_status_reports ORDER BY week_ending DESC');
    } else {
      result = await query(`
        SELECT w.* FROM weekly_status_reports w
        JOIN projects p ON w.project_id = p.id
        LEFT JOIN organizations o ON p.organization_id = o.id
        WHERE p.client ILIKE $1 OR o.name ILIKE $1
        ORDER BY w.week_ending DESC
      `, [company]);
    }

    const mappedReports = result.rows.map((row: any) => ({
      id: row.id,
      projectId: row.project_id,
      projectName: row.project_name,
      weekEnding: row.week_ending ? row.week_ending.toISOString().split('T')[0] : null,
      executiveSummary: row.executive_summary,
      achievements: row.achievements,
      risks: row.risks,
      blockers: row.blockers,
      recommendations: row.recommendations,
      metrics: {
        velocity: row.velocity,
        qualityRate: parseFloat(row.quality_rate || 0),
        burnDownStatus: row.burn_down_status,
        completionPercentage: row.completion_percentage
      },
      author: row.author
    }));

    res.status(200).json(mappedReports);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch reports' });
  }
};

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  const company = req.query.company as string;
  try {
    let result;
    if (!company || company === 'All Companies') {
      result = await query('SELECT * FROM employee_mappings ORDER BY employee_name ASC');
    } else {
      result = await query(`
        SELECT em.* FROM employee_mappings em
        JOIN organizations o ON em.organization_id = o.id
        WHERE o.name = $1
        ORDER BY em.employee_name ASC
      `, [company]);
    }

    const mappedEmployees = result.rows.map((row: any) => ({
      employeeId: row.employee_id,
      orgId: row.organization_id,
      employeeName: row.employee_name,
      department: row.department,
      githubUsername: row.github_username,
      adoUser: row.ado_user,
      timesheetId: row.timesheet_id,
      status: row.status,
      role: row.role,
      accessActive: row.access_active
    }));

    res.status(200).json(mappedEmployees);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch employee mappings' });
  }
};

export const updateEmployeeAccess = async (req: Request, res: Response): Promise<void> => {
  const mappings = req.body; // Array of employee mapping updates
  
  if (!Array.isArray(mappings)) {
    res.status(400).json({ error: 'Body must be an array of employee mappings' });
    return;
  }

  try {
    await query('BEGIN');
    for (const emp of mappings) {
      await query(`
        UPDATE employee_mappings
        SET access_active = $1
        WHERE employee_id = $2
      `, [emp.accessActive, emp.employeeId]);
    }
    await query('COMMIT');
    res.status(200).json({ success: true, message: 'Employee access rules updated successfully.' });
  } catch (error: any) {
    await query('ROLLBACK');
    res.status(500).json({ error: error.message || 'Failed to update employee access rules' });
  }
};

export const getPortfolioTrends = async (req: Request, res: Response): Promise<void> => {
  const company = (req.query.company as string) || 'All Companies';
  try {
    let projQuery = 'SELECT * FROM projects';
    let queryParams: any[] = [];
    if (company && company !== 'All Companies') {
      projQuery = `
        SELECT p.* FROM projects p
        LEFT JOIN organizations o ON p.organization_id = o.id
        WHERE p.client ILIKE $1 OR o.name ILIKE $1
      `;
      queryParams = [company];
    }

    const projResult = await query(projQuery, queryParams);
    const projects = projResult.rows;

    if (projects.length === 0) {
      res.status(200).json([]);
      return;
    }

    const healthy = projects.filter((p: any) => p.status === 'On Track').length;
    const atRisk = projects.filter((p: any) => p.status === 'At Risk').length;
    const critical = projects.filter((p: any) => p.status === 'Critical').length;
    const totalTeam = projects.reduce((sum: number, p: any) => sum + (parseInt(p.team_size || 0, 10)), 0);
    const baseVel = Math.max(45, totalTeam * 3);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trends = months.map((month, idx) => {
      const multiplier = 0.75 + (idx * 0.06);
      return {
        name: month,
        healthy: Math.max(1, Math.round(healthy * (0.8 + idx * 0.04))),
        atRisk: Math.max(0, Math.round(atRisk * (1 - idx * 0.05))),
        critical: Math.max(0, critical),
        velocity: Math.round(baseVel * multiplier)
      };
    });

    res.status(200).json(trends);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch portfolio trends' });
  }
};

export const getCapacityForecast = async (req: Request, res: Response): Promise<void> => {
  const company = (req.query.company as string) || 'All Companies';
  try {
    let projQuery = 'SELECT * FROM projects';
    let queryParams: any[] = [];
    if (company && company !== 'All Companies') {
      projQuery = `
        SELECT p.* FROM projects p
        LEFT JOIN organizations o ON p.organization_id = o.id
        WHERE p.client ILIKE $1 OR o.name ILIKE $1
      `;
      queryParams = [company];
    }

    const projResult = await query(projQuery, queryParams);
    const projects = projResult.rows;

    if (projects.length === 0) {
      res.status(200).json([]);
      return;
    }

    const totalTeam = projects.reduce((sum: number, p: any) => sum + (parseInt(p.team_size || 0, 10)), 0);
    const capBase = Math.max(50, totalTeam * 5);

    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const forecasts = months.map((month, idx) => {
      const cap = Math.round(capBase * (1 + idx * 0.03));
      const demand = Math.round(capBase * (0.92 + (idx % 3) * 0.08));
      return {
        month,
        currentCapacity: cap,
        projectedDemand: demand
      };
    });

    res.status(200).json(forecasts);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch capacity forecast' });
  }
};

export const getOperationalConfidence = async (req: Request, res: Response): Promise<void> => {
  const company = (req.query.company as string) || 'All Companies';
  try {
    let projQuery = 'SELECT * FROM projects';
    let queryParams: any[] = [];
    if (company && company !== 'All Companies') {
      projQuery = `
        SELECT p.* FROM projects p
        LEFT JOIN organizations o ON p.organization_id = o.id
        WHERE p.client ILIKE $1 OR o.name ILIKE $1
      `;
      queryParams = [company];
    }

    const projResult = await query(projQuery, queryParams);
    const projects = projResult.rows;

    if (projects.length === 0) {
      res.status(200).json({ deliveryConfidence: 0, demandVariance: 0, slaCompliance: 0 });
      return;
    }

    const healthyCount = projects.filter((p: any) => p.status === 'On Track').length;
    const avgHealth = Math.round(projects.reduce((sum: number, p: any) => sum + (parseInt(p.health_score || 85, 10)), 0) / projects.length);
    const confidence = parseFloat((avgHealth * 0.9 + 8).toFixed(1));
    const sla = parseFloat((healthyCount / projects.length * 100).toFixed(1));

    res.status(200).json({
      deliveryConfidence: confidence,
      demandVariance: -6,
      slaCompliance: Math.max(88, sla)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch operational metrics' });
  }
};

export const getAiBriefingController = async (req: Request, res: Response): Promise<void> => {
  const company = (req.query.company as string) || 'All Companies';
  try {
    const { generateAiBriefing } = await import('../services/ragService');
    const result = await generateAiBriefing(company);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate AI briefing' });
  }
};

export const getProjectAiReportController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { generateProjectWeeklyReport } = await import('../services/ragService');
    const report = await generateProjectWeeklyReport(id);
    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate project AI report' });
  }
};

export const getSlaMetrics = async (req: Request, res: Response): Promise<void> => {
  const company = req.query.company as string;
  try {
    let projQuery = 'SELECT * FROM projects';
    let queryParams: any[] = [];
    if (company && company !== 'All Companies') {
      projQuery = `
        SELECT p.* FROM projects p
        LEFT JOIN organizations o ON p.organization_id = o.id
        WHERE p.client ILIKE $1 OR o.name ILIKE $1
      `;
      queryParams = [company];
    }

    const projResult = await query(projQuery, queryParams);
    const projects = projResult.rows;

    if (projects.length === 0) {
      res.status(200).json([]);
      return;
    }

    const healthyCount = projects.filter((p: any) => p.status === 'On Track').length;
    const adherence = parseFloat(((healthyCount / projects.length) * 100).toFixed(1));

    const slas = [
      { name: 'Milestone Delivery Adherence', current: `${Math.max(90, adherence)}%`, target: '95.0%', status: adherence >= 95 ? 'On Track' : 'At Risk', trend: 'up' },
      { name: 'Defect Slippage Rate (QA)', current: '1.4%', target: '< 3.0%', status: 'On Track', trend: 'up' },
      { name: 'Sprint Commitment Burn-down Rate', current: '94.2%', target: '90.0%', status: 'On Track', trend: 'up' },
      { name: 'Team Deployment Block Overages', current: '0 hrs', target: '< 4 hrs', status: 'On Track', trend: 'up' }
    ];

    res.status(200).json(slas);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch SLA metrics' });
  }
};

export const getTelemetryEvents = async (req: Request, res: Response): Promise<void> => {
  const company = req.query.company as string;
  try {
    let projQuery = 'SELECT * FROM projects';
    let queryParams: any[] = [];
    if (company && company !== 'All Companies') {
      projQuery = `
        SELECT p.* FROM projects p
        LEFT JOIN organizations o ON p.organization_id = o.id
        WHERE p.client ILIKE $1 OR o.name ILIKE $1
      `;
      queryParams = [company];
    }

    const projResult = await query(projQuery, queryParams);
    const projects = projResult.rows;

    if (projects.length === 0) {
      res.status(200).json([]);
      return;
    }

    const mappedEvents = projects.slice(0, 5).map((p: any, idx: number) => {
      const isCritical = p.status === 'Critical';
      const isAtRisk = p.status === 'At Risk';
      const severity = isCritical ? 'rose' : isAtRisk ? 'amber' : 'green';
      const borderColor = isCritical ? 'border-rose-500' : isAtRisk ? 'border-amber-500' : 'border-emerald-500';
      const bgColor = isCritical ? 'bg-rose-50/30' : isAtRisk ? 'bg-amber-50/30' : 'bg-emerald-50/30';
      
      const timeLabels = ['Just now', '12m ago', '45m ago', '2h ago', 'Yesterday'];
      return {
        timestamp: timeLabels[idx] || 'Just now',
        projectName: p.name,
        message: isCritical ? `Critical delivery bottleneck detected on ${p.name}. Action required.` : isAtRisk ? `Schedule variance warning logged for ${p.name}.` : `Live telemetry synchronized cleanly for ${p.name}.`,
        borderColor,
        bgColor
      };
    });

    res.status(200).json(mappedEvents);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch telemetry events' });
  }
};

export const askCopilotController = async (req: Request, res: Response): Promise<void> => {
  const { query: userQuery, company } = req.body;
  try {
    const { generateCopilotResponse } = await import('../services/ragService');
    const response = await generateCopilotResponse(userQuery, company);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get Copilot response' });
  }
};

export const updateRiskStatusController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ error: 'Status is required' });
    return;
  }

  try {
    await query('UPDATE risks SET status = $1 WHERE id::text = $2', [status, id]);
    res.status(200).json({ success: true, message: `Risk ${id} status updated to ${status}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update risk status' });
  }
};

export const getRiskAiRecommendationController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { generateRiskAiRecommendation } = await import('../services/ragService');
    const result = await generateRiskAiRecommendation(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate risk AI recommendation' });
  }
};




