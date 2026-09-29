/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { query } from '../db/db';
import { syncCompanyIntegrations } from '../services/ingestionService';

// Maps database flat organization records to nested frontend formats matching Organization interface
const mapDbOrgToFrontend = (row: any) => ({
  id: row.id,
  name: row.name,
  industry: row.industry,
  adminName: row.admin_name,
  adminEmail: row.admin_email,
  status: row.status,
  createdAt: row.created_at ? row.created_at.toISOString() : null,
  projectIds: [],
  healthWarningThreshold: row.health_warning_threshold ?? 80,
  healthCriticalThreshold: row.health_critical_threshold ?? 60,
  integrations: {
    github: {
      connected: row.github_connected || false,
      authStatus: row.github_connected ? 'Authenticated' : 'Not Connected',
      lastSync: row.github_connected ? (row.created_at ? row.created_at.toISOString() : null) : null,
      syncHealth: row.github_connected ? 'Healthy' : 'N/A',
      importedRecords: row.github_connected ? 120 : 0,
      failedImports: 0,
      endpoint: row.github_endpoint || undefined,
      syncFrequency: row.github_sync_frequency || '1h'
    },
    azureDevOps: {
      connected: row.ado_connected || false,
      authStatus: row.ado_connected ? 'Authenticated' : 'Not Connected',
      lastSync: row.ado_connected ? (row.created_at ? row.created_at.toISOString() : null) : null,
      syncHealth: row.ado_connected ? 'Healthy' : 'N/A',
      importedRecords: row.ado_connected ? 210 : 0,
      failedImports: 0,
      endpoint: row.ado_endpoint || undefined,
      projectKey: row.ado_project || undefined,
      syncFrequency: row.ado_sync_frequency || '1h'
    },
    jira: {
      connected: row.jira_connected || false,
      authStatus: row.jira_connected ? 'Authenticated' : 'Not Connected',
      lastSync: row.jira_connected ? (row.created_at ? row.created_at.toISOString() : null) : null,
      syncHealth: row.jira_connected ? 'Healthy' : 'N/A',
      importedRecords: row.jira_connected ? 145 : 0,
      failedImports: 0,
      endpoint: row.jira_endpoint || undefined,
      projectKey: row.jira_project || undefined,
      syncFrequency: row.jira_sync_frequency || '1h'
    },
    timesheet: {
      connected: row.timesheet_connected || false,
      authStatus: row.timesheet_connected ? 'Authenticated' : 'Not Connected',
      lastSync: row.timesheet_connected ? (row.created_at ? row.created_at.toISOString() : null) : null,
      syncHealth: row.timesheet_connected ? 'Healthy' : 'N/A',
      importedRecords: row.timesheet_connected ? 85 : 0,
      failedImports: 0,
      endpoint: row.timesheet_endpoint || undefined,
      syncFrequency: row.timesheet_sync_frequency || '1h'
    }
  }
});

export const addCompany = async (req: Request, res: Response): Promise<void> => {
  const { name, industry, adminName, adminEmail, integrations, healthWarningThreshold, healthCriticalThreshold } = req.body;

  if (!name || !industry || !adminName || !adminEmail) {
    res.status(400).json({ error: 'Missing required company profile fields' });
    return;
  }

  try {
    // 1. Calculate next organization ID — use MAX to avoid collisions on delete/restart
    const allIdsResult = await query("SELECT id FROM organizations WHERE id LIKE 'ORG-%'");
    const existingNums = allIdsResult.rows
      .map((r: any) => parseInt(r.id.replace('ORG-', ''), 10))
      .filter((n: number) => !isNaN(n));
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
    const nextNum = maxNum + 1;
    const orgId = `ORG-${String(nextNum).padStart(3, '0')}`;

    // 2. Extract integration credentials
    const gh = integrations?.github || {};
    const ad = integrations?.azureDevOps || {};
    const ji = integrations?.jira || {};
    const ts = integrations?.timesheet || {};

    // 3. Insert new organization
    await query(`
      INSERT INTO organizations (
        id, name, industry, admin_name, admin_email, status, 
        github_connected, github_endpoint, github_token, github_sync_frequency,
        ado_connected, ado_endpoint, ado_token, ado_project, ado_sync_frequency,
        jira_connected, jira_endpoint, jira_token, jira_project, jira_sync_frequency,
        timesheet_connected, timesheet_endpoint, timesheet_sync_frequency,
        health_warning_threshold, health_critical_threshold
      ) VALUES (
        $1, $2, $3, $4, $5, 'Active', 
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19,
        $20, $21, $22,
        $23, $24
      )
    `, [
      orgId, name, industry, adminName, adminEmail,
      gh.connected || false, gh.endpoint || null, gh.token || null, gh.syncFrequency || '1h',
      ad.connected || false, ad.endpoint || null, ad.token || null, ad.projectKey || null, ad.syncFrequency || '1h',
      ji.connected || false, ji.endpoint || null, ji.token || null, ji.projectKey || null, ji.syncFrequency || '1h',
      ts.connected || false, ts.endpoint || null, ts.syncFrequency || '1h',
      healthWarningThreshold ?? 80, healthCriticalThreshold ?? 60
    ]);

    // 4. Trigger API Ingestion Pipeline & Employees Sync
    console.log(`[CompanyController] Triggering active ingestion sync for ${orgId}...`);
    const syncResult = await syncCompanyIntegrations(orgId);

    res.status(201).json({
      success: true,
      orgId,
      name,
      message: 'Company workspace provisioned and integrations synchronized.',
      syncStatus: syncResult
    });
  } catch (error: any) {
    console.error('[CompanyController Error] Failed to add company:', error);
    res.status(500).json({ error: error.message || 'Failed to add company' });
  }
};

export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, industry, adminName, adminEmail, integrations, healthWarningThreshold, healthCriticalThreshold } = req.body;

  try {
    const check = await query('SELECT 1 FROM organizations WHERE id = $1', [id]);
    if (check.rowCount === 0) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    const gh = integrations?.github || {};
    const ad = integrations?.azureDevOps || {};
    const ji = integrations?.jira || {};
    const ts = integrations?.timesheet || {};

    await query(`
      UPDATE organizations SET
        name = COALESCE($1, name),
        industry = COALESCE($2, industry),
        admin_name = COALESCE($3, admin_name),
        admin_email = COALESCE($4, admin_email),
        github_connected = $5,
        github_endpoint = $6,
        github_token = $7,
        github_sync_frequency = $8,
        ado_connected = $9,
        ado_endpoint = $10,
        ado_token = $11,
        ado_project = $12,
        ado_sync_frequency = $13,
        jira_connected = $14,
        jira_endpoint = $15,
        jira_token = $16,
        jira_project = $17,
        jira_sync_frequency = $18,
        timesheet_connected = $19,
        timesheet_endpoint = $20,
        timesheet_sync_frequency = $21,
        health_warning_threshold = COALESCE($22, health_warning_threshold),
        health_critical_threshold = COALESCE($23, health_critical_threshold)
      WHERE id = $24
    `, [
      name || null, industry || null, adminName || null, adminEmail || null,
      gh.connected || false, gh.endpoint || null, gh.token || null, gh.syncFrequency || '1h',
      ad.connected || false, ad.endpoint || null, ad.token || null, ad.projectKey || null, ad.syncFrequency || '1h',
      ji.connected || false, ji.endpoint || null, ji.token || null, ji.projectKey || null, ji.syncFrequency || '1h',
      ts.connected || false, ts.endpoint || null, ts.syncFrequency || '1h',
      healthWarningThreshold ?? null, healthCriticalThreshold ?? null,
      id
    ]);

    // Re-run sync to reflect any credentials change
    console.log(`[CompanyController] Triggering active ingestion sync after settings update for ${id}...`);
    await syncCompanyIntegrations(id);

    res.status(200).json({ success: true, message: 'Company workspace and thresholds updated successfully' });
  } catch (error: any) {
    console.error(`[CompanyController Error] Failed to update company ${id}:`, error);
    res.status(500).json({ error: error.message || 'Failed to update company' });
  }
};

export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    // Select all organizations and return them mapped to frontend format
    const result = await query('SELECT * FROM organizations ORDER BY name ASC');
    const mapped = result.rows.map(mapDbOrgToFrontend);
    res.status(200).json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch companies' });
  }
};

export const syncCompany = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await syncCompanyIntegrations(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Sync failed' });
  }
};

export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const check = await query('SELECT name FROM organizations WHERE id = $1', [id]);
    if (check.rowCount === 0) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    const companyName = check.rows[0].name;
    console.log(`[CompanyController] Purging all workspace data for ${companyName} (${id})...`);

    // 1. Delete organization record (cascades to projects, risks, weekly_status_reports, resources, employee_mappings)
    await query('DELETE FROM organizations WHERE id = $1', [id]);

    // 2. Scrape and purge all datasets referencing this company name across database tables
    await query('DELETE FROM portfolio_trends WHERE company = $1', [companyName]);
    await query('DELETE FROM capacity_forecasts WHERE company = $1', [companyName]);
    await query('DELETE FROM operational_metrics WHERE company = $1', [companyName]);
    await query('DELETE FROM sla_metrics WHERE company = $1', [companyName]);
    await query('DELETE FROM resource_demands WHERE company = $1', [companyName]);
    await query('DELETE FROM delivery_telemetry_events WHERE company = $1', [companyName]);
    await query('DELETE FROM rag_documents WHERE company = $1', [companyName]);

    console.log(`[CompanyController] Successfully purged all datasets for company '${companyName}' (${id}).`);
    res.status(200).json({ 
      success: true, 
      message: `Company workspace '${companyName}' and all associated telemetry, resources, projects, and AI data have been scrapped and removed.` 
    });
  } catch (error: any) {
    console.error(`[CompanyController Error] Failed to delete company ${id}:`, error);
    res.status(500).json({ error: error.message || 'Failed to delete company' });
  }
};
