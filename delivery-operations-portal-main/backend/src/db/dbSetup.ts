/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client } from 'pg';
import { newDb } from 'pg-mem';
import dotenv from 'dotenv';
import { setPool } from './db';

dotenv.config();

// Postgres connection configurations
const connectionConfig = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
};

async function createTables(client: any, isMem: boolean = false) {
  // Users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL,
      initials VARCHAR(10) NOT NULL,
      title VARCHAR(150) NOT NULL
    )
  `);

  // Organizations table (Connected integrations)
  await client.query(`
    CREATE TABLE IF NOT EXISTS organizations (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      industry VARCHAR(100),
      admin_name VARCHAR(100),
      admin_email VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      github_connected BOOLEAN DEFAULT FALSE,
      github_endpoint VARCHAR(255),
      github_token VARCHAR(255),
      github_sync_frequency VARCHAR(50) DEFAULT '1h',
      ado_connected BOOLEAN DEFAULT FALSE,
      ado_endpoint VARCHAR(255),
      ado_token VARCHAR(255),
      ado_project VARCHAR(255),
      ado_sync_frequency VARCHAR(50) DEFAULT '1h',
      jira_connected BOOLEAN DEFAULT FALSE,
      jira_endpoint VARCHAR(255),
      jira_token VARCHAR(255),
      jira_project VARCHAR(255),
      jira_sync_frequency VARCHAR(50) DEFAULT '1h',
      timesheet_connected BOOLEAN DEFAULT FALSE,
      timesheet_endpoint VARCHAR(255),
      timesheet_sync_frequency VARCHAR(50) DEFAULT '1h',
      health_warning_threshold INTEGER DEFAULT 80,
      health_critical_threshold INTEGER DEFAULT 60
    )
  `);

  if (!isMem) {
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS github_sync_frequency VARCHAR(50) DEFAULT \'1h\';').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS ado_project VARCHAR(255);').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS health_warning_threshold INTEGER DEFAULT 80;').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS health_critical_threshold INTEGER DEFAULT 60;').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS ado_sync_frequency VARCHAR(50) DEFAULT \'1h\';').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS jira_connected BOOLEAN DEFAULT FALSE;').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS jira_endpoint VARCHAR(255);').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS jira_token VARCHAR(255);').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS jira_project VARCHAR(255);').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS jira_sync_frequency VARCHAR(50) DEFAULT \'1h\';').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS timesheet_connected BOOLEAN DEFAULT FALSE;').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS timesheet_endpoint VARCHAR(255);').catch(() => {});
    await client.query('ALTER TABLE organizations ADD COLUMN IF NOT EXISTS timesheet_sync_frequency VARCHAR(50) DEFAULT \'1h\';').catch(() => {});
  }

  // Projects table
  await client.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(50) PRIMARY KEY,
      organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      client VARCHAR(100) NOT NULL,
      delivery_lead VARCHAR(100) NOT NULL,
      health_score INTEGER NOT NULL,
      status VARCHAR(50) NOT NULL,
      sprint_velocity INTEGER DEFAULT 0,
      target_velocity INTEGER DEFAULT 0,
      team_size INTEGER DEFAULT 0,
      last_updated DATE,
      budget_total NUMERIC(12, 2) DEFAULT 0,
      budget_spent NUMERIC(12, 2) DEFAULT 0,
      budget_currency VARCHAR(10) DEFAULT 'USD',
      duration_start DATE,
      duration_end DATE,
      duration_elapsed_percentage INTEGER DEFAULT 0,
      description TEXT,
      category VARCHAR(100),
      indicator_scope VARCHAR(50) DEFAULT 'On Track',
      indicator_schedule VARCHAR(50) DEFAULT 'On Track',
      indicator_budget VARCHAR(50) DEFAULT 'On Track',
      indicator_resources VARCHAR(50) DEFAULT 'On Track'
    )
  `);

  // Risks table
  await client.query(`
    CREATE TABLE IF NOT EXISTS risks (
      id SERIAL PRIMARY KEY,
      project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
      project_name VARCHAR(255) NOT NULL,
      risk_name VARCHAR(255) NOT NULL,
      severity VARCHAR(50) NOT NULL,
      impact_level VARCHAR(50) NOT NULL,
      root_cause TEXT,
      trigger_time VARCHAR(50),
      status VARCHAR(50) DEFAULT 'Open',
      mitigation_plan TEXT,
      recommended_actions TEXT,
      owner VARCHAR(100)
    )
  `);

  if (!isMem) {
    await client.query('ALTER TABLE risks ADD COLUMN IF NOT EXISTS recommended_actions TEXT;').catch(() => {});
  }

  // Resources table
  await client.query(`
    CREATE TABLE IF NOT EXISTS resources (
      resource_id VARCHAR(50) PRIMARY KEY,
      organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      allocation_percentage INTEGER,
      status VARCHAR(50) NOT NULL,
      projects TEXT[] DEFAULT '{}',
      skills TEXT[] DEFAULT '{}',
      billable BOOLEAN DEFAULT TRUE
    )
  `);

  // Weekly Status Reports table
  await client.query(`
    CREATE TABLE IF NOT EXISTS weekly_status_reports (
      id VARCHAR(50) PRIMARY KEY,
      project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
      project_name VARCHAR(255) NOT NULL,
      week_ending DATE NOT NULL,
      executive_summary TEXT,
      achievements TEXT[] DEFAULT '{}',
      risks TEXT[] DEFAULT '{}',
      blockers TEXT[] DEFAULT '{}',
      recommendations TEXT[] DEFAULT '{}',
      velocity INTEGER DEFAULT 0,
      quality_rate NUMERIC(5, 2) DEFAULT 0,
      burn_down_status VARCHAR(50) DEFAULT 'On Track',
      completion_percentage INTEGER DEFAULT 0,
      author VARCHAR(100)
    )
  `);

  // Employee Mappings table
  await client.query(`
    CREATE TABLE IF NOT EXISTS employee_mappings (
      employee_id VARCHAR(50) PRIMARY KEY,
      organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE CASCADE,
      employee_name VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      github_username VARCHAR(100),
      ado_user VARCHAR(100),
      timesheet_id VARCHAR(100),
      status VARCHAR(50) DEFAULT 'Matched',
      role VARCHAR(100),
      access_active BOOLEAN DEFAULT TRUE
    )
  `);

  // Portfolio Historical Trends table
  await client.query(`
    CREATE TABLE IF NOT EXISTS portfolio_trends (
      id SERIAL PRIMARY KEY,
      company VARCHAR(100) NOT NULL,
      month_name VARCHAR(20) NOT NULL,
      healthy INTEGER DEFAULT 0,
      at_risk INTEGER DEFAULT 0,
      critical INTEGER DEFAULT 0,
      velocity INTEGER DEFAULT 0
    )
  `);

  // Capacity Forecasts table
  await client.query(`
    CREATE TABLE IF NOT EXISTS capacity_forecasts (
      id SERIAL PRIMARY KEY,
      company VARCHAR(100) NOT NULL,
      month_name VARCHAR(20) NOT NULL,
      current_capacity INTEGER DEFAULT 0,
      projected_demand INTEGER DEFAULT 0
    )
  `);

  // Operational Confidence Metrics table
  await client.query(`
    CREATE TABLE IF NOT EXISTS operational_metrics (
      company VARCHAR(100) PRIMARY KEY,
      delivery_confidence NUMERIC(5, 2) DEFAULT 90.0,
      demand_variance INTEGER DEFAULT 0,
      sla_compliance NUMERIC(5, 2) DEFAULT 95.0
    )
  `);

  // SLA Metrics table
  await client.query(`
    CREATE TABLE IF NOT EXISTS sla_metrics (
      id SERIAL PRIMARY KEY,
      company VARCHAR(100) NOT NULL,
      metric_name VARCHAR(255) NOT NULL,
      current_value VARCHAR(50) NOT NULL,
      target_threshold VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      trend VARCHAR(20) NOT NULL
    )
  `);

  // Resource Demands table
  await client.query(`
    CREATE TABLE IF NOT EXISTS resource_demands (
      id VARCHAR(50) PRIMARY KEY,
      role VARCHAR(100) NOT NULL,
      qty INTEGER DEFAULT 1,
      project_name VARCHAR(255) NOT NULL,
      company VARCHAR(100) DEFAULT 'All Companies',
      priority VARCHAR(50) DEFAULT 'Medium',
      skills TEXT[] DEFAULT '{}',
      status VARCHAR(50) DEFAULT 'Sourcing',
      date_submitted DATE DEFAULT CURRENT_DATE
    )
  `);

  // Delivery Telemetry Events table
  await client.query(`
    CREATE TABLE IF NOT EXISTS delivery_telemetry_events (
      id SERIAL PRIMARY KEY,
      company VARCHAR(100) NOT NULL,
      timestamp VARCHAR(50) NOT NULL,
      project_name VARCHAR(255) NOT NULL,
      event_message TEXT NOT NULL,
      severity VARCHAR(50) NOT NULL
    )
  `);

  // RAG Knowledge Base / Context Documents table
  await client.query(`
    CREATE TABLE IF NOT EXISTS rag_documents (
      id SERIAL PRIMARY KEY,
      company VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed admin user
  const adminCheck = await client.query("SELECT 1 FROM users WHERE email = 'admin@codincity.io'");
  if (!adminCheck || adminCheck.rowCount === 0 || (adminCheck.rows && adminCheck.rows.length === 0)) {
    console.log("[PostgreSQL] Seeding system administrator account...");
    await client.query(`
      INSERT INTO users (id, email, password_hash, role, name, initials, title)
      VALUES (
        'usr_admin', 
        'admin@codincity.io', 
        'admin123', 
        'Codin City Admin', 
        'Admin Administrator', 
        'CC', 
        'Codin City • System Admin'
      )
    `);
    console.log("[PostgreSQL] System administrator account seeded.");
  }
}

async function seedDefaultData(client: any) {
  // Check if organizations exist
  const orgCheck = await client.query("SELECT count(*) FROM organizations");
  const count = parseInt(orgCheck.rows[0].count, 10);
  if (count === 0) {
    console.log("[Database] Seeding default organizations and initial telemetry data...");
    await client.query(`
      INSERT INTO organizations (
        id, name, industry, admin_name, admin_email, status, 
        github_connected, github_endpoint, github_sync_frequency,
        jira_connected, jira_endpoint, jira_project, jira_sync_frequency,
        timesheet_connected, timesheet_endpoint, timesheet_sync_frequency
      ) VALUES 
      ('ORG-001', 'Acme Corp', 'Fintech & Banking', 'Sarah Jenkins', 'sarah.jenkins@acmecorp.com', 'Active', TRUE, 'https://github.com/google', '1h', TRUE, 'https://acmecorp.atlassian.net', 'FIN', '1h', TRUE, 'https://timesheets.acmecorp.com/api', '1h'),
      ('ORG-002', 'TechNova Solutions', 'Cloud Software', 'David Miller', 'david@technova.io', 'Active', TRUE, 'https://github.com/facebook', '1h', TRUE, 'https://technova.atlassian.net', 'CLOUD', '1h', TRUE, 'https://timesheets.technova.io/api', '1h'),
      ('ORG-003', 'Global Logistics', 'Supply Chain', 'Catherine Vance', 'catherine@globallogistics.com', 'Active', FALSE, NULL, '1h', FALSE, NULL, NULL, '1h', FALSE, NULL, '1h')
    `);
  }
}

export const runMigrations = async (): Promise<void> => {
  console.log('[PostgreSQL] Initializing database migration...');

  // Attempt real PostgreSQL connection first
  const initialClient = new Client({
    ...connectionConfig,
    database: 'postgres',
  });

  let usePostgres = false;
  try {
    await initialClient.connect();
    usePostgres = true;

    // Check if delivery_portal exists
    const checkDbResult = await initialClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'delivery_portal'"
    );

    if (checkDbResult.rowCount === 0) {
      console.log("[PostgreSQL] Database 'delivery_portal' does not exist. Creating database...");
      await initialClient.query('CREATE DATABASE delivery_portal');
      console.log("[PostgreSQL] Database 'delivery_portal' created successfully.");
    } else {
      console.log("[PostgreSQL] Database 'delivery_portal' verified.");
    }
    await initialClient.end();

    const client = new Client({
      ...connectionConfig,
      database: 'delivery_portal',
    });
    await client.connect();
    console.log('[PostgreSQL] Running migrations in real PostgreSQL database: delivery_portal');
    await createTables(client, false);
    await seedDefaultData(client);
    await client.end();
  } catch (error) {
    console.warn('[PostgreSQL Warning] Could not connect to local PostgreSQL instance. Initializing pg-mem (In-Memory Database Engine)...');
    
    const memDb = newDb();
    const { Pool } = memDb.adapters.createPg();
    const memPool = new Pool();
    setPool(memPool);

    const memClient = await memPool.connect();
    try {
      await createTables(memClient, true);
      await seedDefaultData(memClient);
      console.log('[pg-mem] In-memory database setup complete with demo organizations.');
    } finally {
      memClient.release();
    }
  }
};
