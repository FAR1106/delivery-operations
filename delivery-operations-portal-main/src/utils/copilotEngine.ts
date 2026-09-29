/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Risk, ResourceAllocation, WeeklyStatusReport } from '../types';
import { UserRole } from '../App';

export type WorkspaceName = 'Portfolio Overview' | 'Projects' | 'Risks' | 'Capacity Planning' | 'Executive Analytics' | 'Reports' | 'Assigned Tasks' | 'AI Intelligence Hub' | 'Access Management';

export const workspaceRoles: Record<WorkspaceName, UserRole[]> = {
  'Portfolio Overview': ['Executive', 'PMO Director'],
  'Projects': ['Executive', 'PMO Director', 'Project Manager', 'Delivery Lead', 'Team Member'],
  'Risks': ['Executive', 'PMO Director', 'Project Manager'],
  'Capacity Planning': ['PMO Director', 'Project Manager', 'Delivery Lead'],
  'Executive Analytics': ['Executive', 'PMO Director', 'Delivery Lead'],
  'Reports': ['Executive', 'PMO Director'],
  'Assigned Tasks': ['Executive', 'PMO Director', 'Project Manager', 'Delivery Lead', 'Team Member'],
  'AI Intelligence Hub': ['Executive', 'PMO Director', 'Project Manager', 'Delivery Lead', 'Team Member'],
  'Access Management': ['Executive', 'PMO Director']
};

export function classifyWorkspace(query: string): WorkspaceName {
  const cleanQuery = query.toLowerCase();

  // Access Management
  if (cleanQuery.match(/\b(access|role|rbac|permission|permissions|sso|security audit|security logs|admin)\b/)) {
    return 'Access Management';
  }

  // AI Intelligence Hub
  if (cleanQuery.match(/\b(lessons|lesson|retro|retrospective|knowledge|compliance|root cause|rca|traceability|contract|policy|document|summarize|change request|cross-project|ripple|slack|teams|meeting notes|recommendation|briefing generator|q&a|kb)\b/)) {
    return 'AI Intelligence Hub';
  }

  // Assigned Tasks
  if (cleanQuery.match(/\b(task|tasks|my tasks|assigned tasks|what am i working on)\b/)) {
    return 'Assigned Tasks';
  }

  // Reports
  if (cleanQuery.match(/\b(report|reports|briefing|brief|weekly status|status summary|ai briefing|executive summary|updates|recent reports|weekly summary)\b/)) {
    return 'Reports';
  }

  // Capacity Planning
  if (cleanQuery.match(/\b(capacity|gap|shortfall|fte shortfall|staffing|hiring|demand forecast|capacity planning|talent deficit|demand|shortages|utilization|busy|working too much|burnout|overloaded|overallocated|overload|workload|fte usage|allocation|resources|specialist|sarah|jenkins|roberto|alvarez|priyah|patel|john|macallan|emily|white|marcus|brody|tariq|hassan|sofia|kenin)\b/)) {
    return 'Capacity Planning';
  }

  // Risks
  if (cleanQuery.match(/\b(risk|risks|blocker|blockers|compliance issue|audit gridlock|mitigation|open risks|critical issues|danger|escalated)\b/)) {
    return 'Risks';
  }

  // Executive Analytics
  if (cleanQuery.match(/\b(budget|cost|spend|money|finance|financial|lowest health|lowest score|least healthy|worst project)\b/)) {
    return 'Executive Analytics';
  }

  // Portfolio Overview
  if (cleanQuery.match(/\b(portfolio|overview|dashboard|status|health summary|metrics|kpis|performance)\b/)) {
    return 'Portfolio Overview';
  }

  // Default to Projects
  return 'Projects';
}

export interface CopilotAction {
  target: string;
  label: string;
}

export interface CopilotResponse {
  text: string;
  intent: 
    | 'portfolio' 
    | 'projects' 
    | 'lowest-health' 
    | 'risks' 
    | 'utilization' 
    | 'capacity' 
    | 'weekly-brief' 
    | 'project-detail' 
    | 'resource-detail' 
    | 'client-detail' 
    | 'unsupported';
  data?: any;
  actions?: CopilotAction[];
  suggestions?: string[];
  restricted?: {
    workspace: string;
    currentRole: string;
    requiredRoles: string[];
  };
}

/**
 * A grounded Portfolio Intelligence Assistant.
 * Answers only questions related to platform data. All general knowledge or out-of-scope queries
 * are routed to a professional "General Knowledge Mode Not Available" response page.
 */
export function getCopilotResponse(
  query: string,
  projects: Project[],
  risks: Risk[],
  resources: ResourceAllocation[],
  reports: WeeklyStatusReport[],
  userRole: UserRole
): CopilotResponse {
  const cleanQuery = query.toLowerCase().trim();

  // Role-based security checks
  const workspace = classifyWorkspace(cleanQuery);
  const allowedRoles = workspaceRoles[workspace];
  if (!allowedRoles.includes(userRole)) {
    return {
      text: `Access to this workspace is restricted.`,
      intent: 'unsupported',
      restricted: {
        workspace,
        currentRole: userRole,
        requiredRoles: allowedRoles
      }
    };
  }

  // --- NEW AI COGNITIVE HUB RESPONDERS ---
  // 0. Access Control & RBAC
  if (cleanQuery.match(/(access|role|rbac|permission|permissions|sso|security audit|security logs|admin)/)) {
    return {
      text: `### ROLE-BASED ACCESS CONTROL & ACCESS MANAGEMENT\n\n` +
            `**Summary**\n` +
            `Access Management logs and active RBAC matrices indicate full operational security boundaries are enforced.\n\n` +
            `**Key Findings**\n` +
            `• **SSO Gateway:** SAML Single Sign-On is active and verified across domain hosts.\n` +
            `• **Matrix Status:** Permissions mapped for Executive, PMO Director, Project Manager, Delivery Lead, and Team Member roles.\n` +
            `• **Audit Flag:** 1 restricted access warning detected in logs today (user blocked from opening the Risk Center).\n\n` +
            `**Recommendations**\n` +
            `• Open the Access Management console to check and customize permissions checkmarks.\n` +
            `• Review user session lockout times in System Settings.`,
      intent: 'portfolio',
      actions: [
        { label: 'Open Access Management', target: 'access-management' }
      ],
      suggestions: [
        'Show lessons learned',
        'Generate executive briefing'
      ]
    };
  }

  // 1. Lessons Learned & Knowledge Hub Queries & Semantic search
  if (cleanQuery.match(/(lessons|lesson|knowledge|policy|context|kb|related projects|find related projects|similarities|semantic)/)) {
    const isSemantic = cleanQuery.includes('related') || cleanQuery.includes('similar') || cleanQuery.includes('semantic');
    return {
      text: isSemantic 
        ? `### SEMANTIC PROJECT SEARCH & RELATED PROGRAMS\n\n` +
          `**Summary**\n` +
          `Searching conceptually matching projects across the portfolio vector database space.\n\n` +
          `**Key Findings**\n` +
          `• **Concept Match 1:** *Synapse ML Recommender* exhibits a **94% similarity index** to *Sentinel Health* due to common Python ML model pipelines.\n` +
          `• **Concept Match 2:** *Aura IoT Smart Gateway* shares telemetry definitions and has an **89% similarity index**.\n\n` +
          `**Recommendations**\n` +
          `• Open the Semantic Project Search console to test additional search criteria.`
        : `### AI KNOWLEDGE HUB: LESSONS LEARNED & AUDITS\n\n` +
          `**Summary**\n` +
          `Retrieval from the corporate knowledge repository found **2 matching lessons** and policy items.\n\n` +
          `**Key Findings**\n` +
          `• **Database Locking (Q3 2025):** Aegis project lockups were resolved by changing transaction levels.\n` +
          `• **AWS KMS Compliance:** Provisioning scripts fail unless VPC templates incorporate automated resource tags.\n` +
          `• **Policy Match:** Section 4.2 HIPAA Health Data Sovereignty requires US-East region lock.\n\n` +
          `**Recommendations**\n` +
          `• Align active team members using the onboarding context wizard.\n` +
          `• Run federated search for specific database latency runbooks.`,
      intent: 'portfolio',
      actions: [
        { label: 'Open AI Knowledge Hub', target: 'ai-intelligence-hub-knowledge' }
      ],
      suggestions: [
        'Analyze contract risks',
        'Review change requests'
      ]
    };
  }

  // 2. Contract Intelligence & Document Analyzer
  if (cleanQuery.match(/(contract|document|summarize|regulatory|analyze contract)/)) {
    return {
      text: `### AI DOCUMENT & CONTRACT INTELLIGENCE\n\n` +
            `**Summary**\n` +
            `Ingested documents review results outline regulatory risks and SLA liabilities.\n\n` +
            `**Key Findings**\n` +
            `• **Liability Clause Flagged:** Clause 14.3 of Vanguard MSAs specifies unlimited liability on data breaches.\n` +
            `• **Payment Term Bottleneck:** Standard Net 90 payment cycle exceeds corporate safety bounds (Net 45).\n` +
            `• **Compliance Score:** Ingested SOW exhibits a **92% GDPR compliance alignment** score.\n\n` +
            `**Recommendations**\n` +
            `• Renegotiate indemnification caps prior to steering signature.\n` +
            `• Refactor subcontractor data sovereignty definitions in SOW Chapter V.`,
      intent: 'portfolio',
      actions: [
        { label: 'Open Document Analyzer', target: 'ai-intelligence-hub-document' }
      ],
      suggestions: [
        'Show lessons learned',
        'Review change requests'
      ]
    };
  }

  // 3. Compliance Advisor, Root Cause, Historical Risks
  if (cleanQuery.match(/(root cause|rca|compliance advisor|audit|traceability|mitigation|decision trace)/)) {
    return {
      text: `### AI RISK & COMPLIANCE TIMELINE AUDIT\n\n` +
            `**Summary**\n` +
            `Telemetry root cause tracer has parsed event cascades for Sentinel Health blocker.\n\n` +
            `**Key Findings**\n` +
            `• **Root Cause:** AWS VPC security check failed SOC2 audit checks due to missing VPC policy tag parameters.\n` +
            `• **Historical Risk Density:** Peak density registered in Week 14 (9 active compliance threats).\n` +
            `• **SLA Check status:** Bi-weekly steering governance audit is currently passing all check conditions.\n\n` +
            `**Recommendations**\n` +
            `• Deploy compliance tagging modules directly to root Terraform templates.\n` +
            `• Setup automatic compliance advisor hooks on pull requests.`,
      intent: 'portfolio',
      actions: [
        { label: 'Open Risk Control Hub', target: 'ai-intelligence-hub-risk' }
      ],
      suggestions: [
        'Find related projects',
        'Generate executive briefing'
      ]
    };
  }

  // 4. Change Requests, Cross-Project Ripple, Recommendation
  if (cleanQuery.match(/(change request|cross-project|ripple|recommendation|retro|retrospective|insights|review change)/)) {
    return {
      text: `### AI PROGRAM INSIGHTS & DELAY CASCADES\n\n` +
            `**Summary**\n` +
            `Cross-project ripple simulation indicates potential schedule drift downstream.\n\n` +
            `**Key Findings**\n` +
            `• **Downstream Delay:** Sentinel Health schedule delay of 2 weeks shifts Synapse ML timeline by **1.5 weeks**.\n` +
            `• **CR Impact:** CR-042 Checkout expansion requires +1.2 FTE resource load and +12 business days.\n` +
            `• **Morale Sentiments:** Retrospective mood index sits at 84% positive; database locks are the primary complaint.\n\n` +
            `**Recommendations**\n` +
            `• Delegate 1 Senior DevOps Lead from Aegis to cover database configuration.\n` +
            `• Re-baseline Synapse integration sprint milestone calendar.`,
      intent: 'portfolio',
      actions: [
        { label: 'Open Program Insights Hub', target: 'ai-intelligence-hub-insights' }
      ],
      suggestions: [
        'Analyze contract risks',
        'Generate executive briefing'
      ]
    };
  }

  // 5. Communications, Slack, Teams, Meetings, Executive Briefing
  if (cleanQuery.match(/(meeting|slack|teams|email|executive briefing|qa|briefing|generate executive)/)) {
    return {
      text: `### AI COMMUNICATIONS & EXECUTIVE INTELLIGENCE\n\n` +
            `**Summary**\n` +
            `Meeting transcripts and communication analytics compiled successfully.\n\n` +
            `**Key Findings**\n` +
            `• **Steering sync decisions:** Approved transaction replication design; rejected cloud migration alternative.\n` +
            `• **Chat Analytics warnings:** Sentiment dip on #pmo-sentinel regarding SOC2 check delays.\n` +
            `• **C-Level Briefing:** Slide deck output compiled successfully for steering board review.\n\n` +
            `**Recommendations**\n` +
            `• Download the synthesized executive brief PDF.\n` +
            `• Send automated briefing updates to steer committee list.`,
      intent: 'portfolio',
      actions: [
        { label: 'Open Communications Hub', target: 'ai-intelligence-hub-communications' }
      ],
      suggestions: [
        'Show lessons learned',
        'Review change requests'
      ]
    };
  }

  // 1. DYNAMIC RESOURCE ENTITY DETECTION
  const resourceKeywords = [
    { key: 'sarah', id: 'RES-001' },
    { key: 'jenkins', id: 'RES-001' },
    { key: 'roberto', id: 'RES-002' },
    { key: 'alvarez', id: 'RES-002' },
    { key: 'priyah', id: 'RES-003' },
    { key: 'patel', id: 'RES-003' },
    { key: 'john', id: 'RES-004' },
    { key: 'macallan', id: 'RES-004' },
    { key: 'emily', id: 'RES-005' },
    { key: 'white', id: 'RES-005' },
    { key: 'marcus', id: 'RES-006' },
    { key: 'brody', id: 'RES-006' },
    { key: 'tariq', id: 'RES-007' },
    { key: 'hassan', id: 'RES-007' },
    { key: 'sofia', id: 'RES-008' },
    { key: 'kenin', id: 'RES-008' }
  ];

  const matchedResInfo = resourceKeywords.find(r => cleanQuery.includes(r.key));
  if (matchedResInfo) {
    const resource = resources.find(r => r.resourceId === matchedResInfo.id);
    if (resource) {
      const isOverloaded = resource.allocationPercentage > 100;
      const allocationStatus = isOverloaded 
        ? `Overloaded at **${resource.allocationPercentage}%** FTE capacity`
        : `assigned within healthy parameters at **${resource.allocationPercentage}%** capacity`;

      return {
        text: `### ${resource.name.toUpperCase()} PROFILE & WORKLOAD\n\n` +
              `**Summary**\n` +
              `Workload analysis for specialist **${resource.name}** indicates the status is **${resource.status}**.\n\n` +
              `**Key Findings**\n` +
              `• **Allocation Load:** Currently ${allocationStatus}.\n` +
              `• **Department:** ${resource.department} • **Role:** ${resource.role}\n` +
              `• **Assigned Projects:** ${resource.projects.join(', ')}.\n` +
              `• **Specialist Skills:** ${resource.skills.slice(0, 4).join(', ')}.\n\n` +
              `**Recommendations**\n` +
              `• Review allocation limits to prevent developer fatigue or delivery delays.\n` +
              `• Cross-train junior teammates to delegate secondary tasks off key resources.`,
        intent: 'resource-detail',
        data: resource,
        actions: [],
        suggestions: [
          'Who else is overloaded?',
          'Show capacity planning forecast'
        ]
      };
    }
  }

  // 2. DYNAMIC PROJECT ENTITY DETECTION
  const projectKeywords = [
    { key: 'aegis', id: 'PRJ-001' },
    { key: 'omnichannel', id: 'PRJ-002' },
    { key: 'retail', id: 'PRJ-002' },
    { key: 'sentinel', id: 'PRJ-003' },
    { key: 'health cloud', id: 'PRJ-003' },
    { key: 'aura', id: 'PRJ-004' },
    { key: 'iot', id: 'PRJ-004' },
    { key: 'velo', id: 'PRJ-005' },
    { key: 'routing', id: 'PRJ-005' },
    { key: 'chronos', id: 'PRJ-006' },
    { key: 'ledger', id: 'PRJ-006' },
    { key: 'cobol', id: 'PRJ-006' },
    { key: 'synapse', id: 'PRJ-007' },
    { key: 'recommender', id: 'PRJ-007' },
    { key: 'titanium', id: 'PRJ-008' },
    { key: 'supply chain', id: 'PRJ-008' }
  ];

  const matchedProjInfo = projectKeywords.find(p => cleanQuery.includes(p.key));
  if (matchedProjInfo) {
    const project = projects.find(p => p.id === matchedProjInfo.id);
    if (project) {
      const projRisks = risks.filter(r => r.projectId === project.id);
      const spentPercent = Math.round((project.budget.spent / project.budget.total) * 100);
      const velocityVariance = project.sprintVelocity - project.targetVelocity;

      // Aspect: Budget query
      if (cleanQuery.match(/(budget|cost|spend|money|finance|financial)/)) {
        return {
          text: `### ${project.name.toUpperCase()} FINANCIAL ANALYSIS\n\n` +
                `**Summary**\n` +
                `Financial metrics for program **${project.name}** show the budget status is marked **${project.indicators.budget}**.\n\n` +
                `**Key Findings**\n` +
                `• **Total Budget:** ${project.budget.currency} ${project.budget.total.toLocaleString()}\n` +
                `• **Spent to Date:** ${project.budget.currency} ${project.budget.spent.toLocaleString()} (${spentPercent}% expended)\n` +
                `• **Remaining Funds:** ${project.budget.currency} ${(project.budget.total - project.budget.spent).toLocaleString()}\n\n` +
                `**Recommendations**\n` +
                `• Review burn rate pacing relative to delivery milestones.\n` +
                `• Ensure timesheets and third-party contractor expenses align with project cost accounts.`,
          intent: 'project-detail',
          data: { project, aspect: 'budget', spentPercent },
          actions: [
            { label: `Open ${project.name} Workspace`, target: `project-workspace-${project.id}` }
          ],
          suggestions: [
            `What blockers are on ${project.name}?`,
            `Show velocity for ${project.name}`
          ]
        };
      }

      // Aspect: Risks query
      if (cleanQuery.match(/(risk|blocker|issue|obstacle|mitigation|delay)/)) {
        const riskListText = projRisks.length > 0
          ? projRisks.map(r => `• **${r.riskName}:** Severity: ${r.severity} (Owner: ${r.owner})`).join('\n')
          : `• No critical registry blockers are currently flagged on active paths.`;

        return {
          text: `### ${project.name.toUpperCase()} RISK REGISTRY\n\n` +
                `**Summary**\n` +
                `There are **${projRisks.length} active risks** flagged for this program.\n\n` +
                `**Key Findings**\n` +
                `${riskListText}\n\n` +
                `**Recommendations**\n` +
                `• Initiate escalation sessions for High severity blocker points.\n` +
                `• Track the completion of mitigation blueprints during daily standups.`,
          intent: 'project-detail',
          data: { project, aspect: 'risks', risks: projRisks },
          actions: [
            { label: `Open ${project.name} Workspace`, target: `project-workspace-${project.id}` }
          ],
          suggestions: [
            `What is the budget for ${project.name}?`,
            `Show velocity for ${project.name}`
          ]
        };
      }

      // Aspect: Velocity query
      if (cleanQuery.match(/(velocity|sprint|points|burn|speed|productivity)/)) {
        return {
          text: `### ${project.name.toUpperCase()} VELOCITY SUMMARY\n\n` +
                `**Summary**\n` +
                `Sprint velocity performance for **${project.name}** is averaging **${project.sprintVelocity} points**.\n\n` +
                `**Key Findings**\n` +
                `• **Target Velocity:** ${project.targetVelocity} pts.\n` +
                `• **Output Variance:** ${velocityVariance >= 0 ? `+${velocityVariance}` : `${velocityVariance}`} points.\n` +
                `• **Velocity Health:** Marked as ${velocityVariance >= 0 ? 'Optimal' : 'Behind'}.\n\n` +
                `**Recommendations**\n` +
                `• Analyze sprint boards to remove bottlenecks on active developers.\n` +
                `• Adjust target velocity indices for future phases to align with actual team baselines.`,
          intent: 'project-detail',
          data: { project, aspect: 'velocity', velocityVariance },
          actions: [
            { label: `Open ${project.name} Workspace`, target: `project-workspace-${project.id}` }
          ],
          suggestions: [
            `What blockers are on ${project.name}?`,
            `What is the budget for ${project.name}?`
          ]
        };
      }

      // Default aspect: General project status
      return {
        text: `### ${project.name.toUpperCase()} STATUS OVERVIEW\n\n` +
              `**Summary**\n` +
              `Project **${project.name}** (${project.id}) is marked **${project.status}** with an overall health score of **${project.healthScore}/100**.\n\n` +
              `**Key Findings**\n` +
              `• **Client:** ${project.client} • **Lead:** ${project.deliveryLead}\n` +
              `• **Scope:** ${project.indicators.scope} • **Schedule:** ${project.indicators.schedule}\n` +
              `• **Resources:** ${project.indicators.resources} • **Budget:** ${project.indicators.budget}\n\n` +
              `**Recommendations**\n` +
              `• Direct immediate focus toward delivery elements flagged Critical or At Risk.\n` +
              `• Audit milestone dates to verify safety buffers.`,
        intent: 'project-detail',
        data: { project, aspect: 'general', risks: projRisks },
        actions: [
          { label: `Open ${project.name} Workspace`, target: `project-workspace-${project.id}` }
        ],
        suggestions: [
          `Show budget for ${project.name}`,
          `What blockers are on ${project.name}?`,
          `Show velocity for ${project.name}`
        ]
      };
    }
  }

  // 3. DYNAMIC CLIENT / COMPANY ENTITY DETECTION
  const clientKeywords = [
    { key: 'kubernetes', name: 'Kubernetes Project' },
    { key: 'octokit', name: 'Octokit Solutions' }
  ];

  const matchedClientInfo = clientKeywords.find(c => cleanQuery.includes(c.key));
  if (matchedClientInfo) {
    const clientProjects = projects.filter(p => p.client.toLowerCase().includes(matchedClientInfo.key));
    const avgHealth = clientProjects.length > 0
      ? Math.round(clientProjects.reduce((sum, p) => sum + p.healthScore, 0) / clientProjects.length)
      : 0;

    return {
      text: `### ${matchedClientInfo.name.toUpperCase()} PORTFOLIO SUMMARY\n\n` +
            `**Summary**\n` +
            `Operational summary of programs managed under account **${matchedClientInfo.name}**.\n\n` +
            `**Key Findings**\n` +
            `• **Managed Programs:** ${clientProjects.length} active projects.\n` +
            `• **Average Health Index:** ${avgHealth}/100 score.\n` +
            `• **Primary Leads:** ${clientProjects.map(p => p.deliveryLead).join(', ')}.\n\n` +
            `**Recommendations**\n` +
            `• Review projects with low health scores to balance resource coverage.\n` +
            `• Schedule review syncs with account delivery leads.`,
      intent: 'client-detail',
      data: { client: matchedClientInfo.name, projects: clientProjects, avgHealth },
      actions: [
        { label: 'Open Portfolio Overview', target: 'portfolio-overview' }
      ],
      suggestions: [
        'Which projects are at risk?',
        'Show critical risks'
      ]
    };
  }

  // 4. PLATFORM-SPECIFIC DOMAIN INTENTS (USING SYNONYMS GROUPS)

  // B. Capacity Planning
  const capacitySynonyms = [
    'capacity', 'gap', 'shortfall', 'fte shortfall', 'staffing', 
    'hiring', 'demand forecast', 'capacity planning', 'talent deficit', 'demand', 'shortages'
  ];
  if (capacitySynonyms.some(s => cleanQuery.includes(s))) {
    return {
      text: `### CAPACITY PLANNING FORECAST\n\n` +
            `**Summary**\n` +
            `An engineering resource shortfall is projected, peaking in **September 2026** with a **-20 FTE deficit**.\n\n` +
            `**Key Findings**\n` +
            `• Surge driven by event-sourced ledger rewrite schedules for Chronos Banking.\n` +
            `• Secondary resource gap of **-18 FTEs** projected in August 2026.\n` +
            `• Primary talent requirements: Mainframe COBOL-to-Java migration and integration specialist roles.\n\n` +
            `**Recommendations**\n` +
            `• Contract 2 Senior Backend Specialists for 3 months starting in August.\n` +
            `• Cross-train Core Systems personnel in MuleSoft connectors.`,
      intent: 'capacity',
      data: { gapFTE: 20, peakMonth: 'September 2026', recommendation: 'Contract 2 Senior Backend Specialists & cross-train core teams' },
      actions: [],
      suggestions: [
        'Show projects at risk'
      ]
    };
  }

  // C. Risks Command Center
  const riskSynonyms = [
    'risk', 'risks', 'blocker', 'blockers', 'compliance issue', 
    'audit gridlock', 'mitigation', 'open risks', 'critical issues', 'danger', 'escalated'
  ];
  if (riskSynonyms.some(s => cleanQuery.includes(s))) {
    const openRisks = risks.filter(r => r.status === 'Open' || r.status === 'Escalated');
    return {
      text: `### CRITICAL RISKS COMMAND CENTER\n\n` +
            `**Summary**\n` +
            `The risk registry currently reports **${openRisks.length} active blockers** across delivery tracks.\n\n` +
            `**Key Findings**\n` +
            `• **Compliance Bottlenecks:** HIPAA audit gridlock is stalling AWS environment configurations for Sentinel Health.\n` +
            `• **Legacy Logic Gaps:** Incomplete COBOL mainframe specifications are slowing Chronos Ledger rewrite velocity.\n` +
            `• **API Integration Delays:** POS firmware performance webhook lags are affecting OmniChannel Retail timelines.\n\n` +
            `**Recommendations**\n` +
            `• Authorize budget for third-party HIPAA auditing specialist.\n` +
            `• Coordinate mainframe logic decompilation sessions.`,
      intent: 'risks',
      data: openRisks,
      actions: [
        { label: 'Open Risk Command Center', target: 'risk-center' }
      ],
      suggestions: [
        'What blockers are on Sentinel Health Cloud Migration?',
        'Show status summary for Chronos Digital Ledger Rewrite'
      ]
    };
  }

  // D. Weekly Status Reports
  const reportsSynonyms = [
    'report', 'reports', 'briefing', 'brief', 'weekly status', 
    'status summary', 'ai briefing', 'executive summary', 'updates', 'recent reports', 'weekly summary'
  ];
  if (reportsSynonyms.some(s => cleanQuery.includes(s))) {
    return {
      text: `### EXECUTIVE WEEKLY STATUS BRIEFING\n\n` +
            `**Summary**\n` +
            `Highlights from AI status updates (Week Ending June 12, 2026):\n\n` +
            `**Key Findings**\n` +
            `• **Project Aegis:** Sub-millisecond benchmarks successfully passed (0.85ms median processing loop).\n` +
            `• **OmniChannel Retail:** Marked **At Risk** due to Apex Checkout spec delays.\n` +
            `• **Sentinel Health Cloud:** Marked **Critical** due to AWS HIPAA compliance audit blocks.\n\n` +
            `**Recommendations**\n` +
            `• Shift Sarah Jenkins to Sentinel HIPAA audit support for two weeks.\n` +
            `• Escalate retail edge webhooks specification directly to the Apex CIO.`,
      intent: 'weekly-brief',
      data: reports,
      actions: [
        { label: 'Open Weekly AI Reports', target: 'weekly-reports' }
      ],
      suggestions: [
        'Show project status for Sentinel Health',
        'What blockers are on Chronos Digital Ledger Rewrite?'
      ]
    };
  }

  // E. Projects Inventory
  const projectsSynonyms = [
    'list projects', 'all projects', 'what projects are active', 
    'projects inventory', 'catalog of programs', 'failing projects', 'projects status', 'projects at risk', 'delayed'
  ];
  if (projectsSynonyms.some(s => cleanQuery.includes(s))) {
    const attentionList = projects.filter(p => p.status === 'Critical' || p.status === 'At Risk');
    return {
      text: `### PROJECTS INVENTORY HEALTH\n\n` +
            `**Summary**\n` +
            `There are **${projects.length} active programs** inside the portfolio.\n\n` +
            `**Key Findings**\n` +
            `• **Failing Programs:** ${attentionList.length} programs exhibit variances and require direct PMO oversight.\n` +
            `• **Sentinel Health Cloud & Chronos Rewrite:** Marked **Critical** due to compliance and resource blockers.\n` +
            `• **OmniChannel Retail & Synapse ML Recommender:** Marked **At Risk** due to interface Spec delays.\n\n` +
            `**Recommendations**\n` +
            `• Focus developer staffing resource allocations toward critical programs.\n` +
            `• Audit project schedules to introduce safety buffers in delivery estimates.`,
      intent: 'projects',
      data: attentionList,
      actions: [
        { label: 'Open Projects Inventory', target: 'projects' }
      ],
      suggestions: [
        'Which project has the lowest health score?',
        'Show portfolio health summary'
      ]
    };
  }

  // F. Portfolio Overview
  const portfolioSynonyms = [
    'portfolio', 'pmo', 'summary', 'overview', 'dashboard', 'status', 'health summary', 'metrics', 'health', 'kpis', 'performance'
  ];
  if (portfolioSynonyms.some(s => cleanQuery.includes(s))) {
    const total = projects.length;
    const onTrack = projects.filter(p => p.status === 'On Track').length;
    const attention = projects.filter(p => p.status === 'Critical' || p.status === 'At Risk').length;
    const avgHealth = total > 0 ? Math.round(projects.reduce((acc, p) => acc + p.healthScore, 0) / total) : 100;
    const avgUtil = resources.length > 0 
      ? Math.round(resources.reduce((acc, r) => acc + r.allocationPercentage, 0) / resources.length) 
      : 86;

    return {
      text: `### PORTFOLIO EXECUTIVE SUMMARY\n\n` +
            `**Summary**\n` +
            `Portfolio metrics show an average health score of **${avgHealth}%** across **${total} active projects**.\n\n` +
            `**Key Findings**\n` +
            `• **Baseline Health:** ${onTrack} programs are executing On Track.\n` +
            `• **Delivery Variance:** ${attention} programs exhibit status deviations and require attention.\n` +
            `• **Resource Load:** Average utilization sits at **${avgUtil}%**.\n\n` +
            `**Recommendations**\n` +
            `• Rebalance workloads of overloaded principal architects.\n` +
            `• Review risk command center logs to mitigate regulatory blockers.`,
      intent: 'portfolio',
      data: { total, onTrack, attention, avgHealth, avgUtil },
      actions: [
        { label: 'Open Portfolio Overview', target: 'portfolio-overview' },
        { label: 'Open Risk Center', target: 'risk-center' }
      ],
      suggestions: [
        'Which projects are at risk?',
        'Who is overloaded?',
        'Show capacity planning forecast'
      ]
    };
  }

  // G. Lowest Health Score
  if (cleanQuery.includes('lowest health') || cleanQuery.includes('lowest score') || cleanQuery.includes('least healthy') || cleanQuery.includes('worst project')) {
    if (projects.length === 0) {
      return { text: 'No active projects found.', intent: 'lowest-health' };
    }
    const sorted = [...projects].sort((a, b) => a.healthScore - b.healthScore);
    const lowestProject = sorted[0];
    return {
      text: `### LOWEST HEALTH SCORE ANALYSIS\n\n` +
            `**Summary**\n` +
            `The program with the lowest health score in the portfolio is **${lowestProject.name}** (${lowestProject.id}).\n\n` +
            `**Key Findings**\n` +
            `• **Health Score:** Marked **Critical** at **${lowestProject.healthScore}/100**.\n` +
            `• **Key Bottlenecks:** Schedule, budget, and resource load are all flagged Critical.\n` +
            `• **Lead:** Managed by delivery manager **${lowestProject.deliveryLead}**.\n\n` +
            `**Recommendations**\n` +
            `• Authorize budget for specialized legacy systems architecture consulting.\n` +
            `• Establish shadow sessions to reconstruct missing COBOL logic.`,
      intent: 'lowest-health',
      data: lowestProject,
      actions: [
        { label: `Open ${lowestProject.name} Workspace`, target: `project-workspace-${lowestProject.id}` }
      ],
      suggestions: [
        `What blockers are on ${lowestProject.name}?`,
        `Show velocity for ${lowestProject.name}`
      ]
    };
  }

  // 5. UNSUPPORTED DOMAINS / GENERAL KNOWLEDGE FILTER
  // Intercept all general knowledge questions (Kubernetes, Agile, python, coding, tutorials, definitions)
  // or completely unmatched queries, returning a professional information screen.
  return {
    text: `### GENERAL KNOWLEDGE MODE NOT AVAILABLE\n\n` +
          `The current Delivery Copilot MVP is focused on portfolio intelligence and delivery operations data.\n\n` +
          `I can currently assist with:\n` +
          `• Portfolio performance\n` +
          `• Projects\n` +
          `• Delivery health\n` +
          `• Risks\n` +
          `• Capacity planning\n` +
          `• Weekly reports\n\n` +
          `General knowledge capabilities will become available once external LLM integration is enabled.`,
    intent: 'unsupported',
    actions: [
      { label: 'Portfolio Overview', target: 'portfolio-overview' },
      { label: 'Show At-Risk Projects', target: 'projects' },
      { label: 'Risk Summary', target: 'risk-center' }
    ],
    suggestions: [
      'Portfolio summary',
      'Which projects are at risk?'
    ]
  };
}
