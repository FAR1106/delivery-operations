/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useCompany } from '../context/CompanyContext';
import { Project, Risk, ResourceAllocation, WeeklyStatusReport } from '../types';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Activity, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ChevronLeft, 
  CreditCard, 
  Clock, 
  Code2, 
  ShieldCheck, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Flame, 
  ShieldAlert, 
  Calendar, 
  Sparkles,
  GitPullRequest,
  Check,
  UserCheck
} from 'lucide-react';

interface ProjectWorkspaceProps {
  projectId: string;
  onNavigate: (page: string) => void;
}

export default function ProjectWorkspace({ projectId, onNavigate }: ProjectWorkspaceProps) {
  const { allProjects, allRisks, allResources, allReports, fetchProjectAiReport } = useCompany();
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'risks' | 'delivery' | 'financial' | 'reports'>('overview');
  const [ragReport, setRagReport] = useState<any>(null);
  const [loadingRagReport, setLoadingRagReport] = useState(false);

  // Find active project
  const project = useMemo(() => {
    return allProjects.find(p => p.id === projectId);
  }, [allProjects, projectId]);

  useEffect(() => {
    if (project?.id) {
      setLoadingRagReport(true);
      fetchProjectAiReport(project.id).then(rep => {
        if (rep) setRagReport(rep);
        setLoadingRagReport(false);
      });
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-4">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Project Not Found</h2>
        <p className="text-xs text-slate-500">The project ID {projectId} does not exist in the active catalog.</p>
        <button 
          onClick={() => onNavigate('projects')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
        >
          Return to Projects Inventory
        </button>
      </div>
    );
  }

  // Filter project-specific records
  const projectRisks = useMemo(() => {
    return allRisks.filter(r => r.projectId === project.id);
  }, [allRisks, project.id]);

  const projectResources = useMemo(() => {
    return allResources.filter(res => 
      res.projects.some(pn => {
        const lowerPN = pn.toLowerCase();
        const lowerName = project.name.toLowerCase();
        return lowerName.includes(lowerPN) || lowerPN.includes(lowerName) ||
               lowerName.split(' ')[0] === lowerPN.split(' ')[0];
      })
    );
  }, [allResources, project.name]);

  const projectReports = useMemo(() => {
    const existing = allReports.filter(rep => rep.projectId === project.id);
    if (existing.length > 0) return existing;
    if (ragReport) return [ragReport];
    return [];
  }, [allReports, project.id, ragReport]);

  // Derived metrics
  const avgUtilization = useMemo(() => {
    if (projectResources.length === 0) return 0;
    return Math.round(projectResources.reduce((sum, r) => sum + r.allocationPercentage, 0) / projectResources.length);
  }, [projectResources]);

  const uniqueSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    projectResources.forEach(r => r.skills.forEach(s => skillsSet.add(s)));
    return Array.from(skillsSet);
  }, [projectResources]);

  // Mocked historical data for this project
  const healthTrendData = [
    { sprint: 'Sprint 8', health: project.healthScore - 4 },
    { sprint: 'Sprint 9', health: project.healthScore - 2 },
    { sprint: 'Sprint 10', health: project.healthScore - 3 },
    { sprint: 'Sprint 11', health: project.healthScore }
  ];

  const velocityTrendData = [
    { sprint: 'Sprint 8', 'Velocity': project.sprintVelocity - 4, 'Target': project.targetVelocity },
    { sprint: 'Sprint 9', 'Velocity': project.sprintVelocity - 1, 'Target': project.targetVelocity },
    { sprint: 'Sprint 10', 'Velocity': project.sprintVelocity + 2, 'Target': project.targetVelocity },
    { sprint: 'Sprint 11', 'Velocity': project.sprintVelocity, 'Target': project.targetVelocity }
  ];

  const budgetTrendData = [
    { month: 'Mar', 'Budget Consumed': project.budget.spent * 0.4, 'Total Allocated': project.budget.total },
    { month: 'Apr', 'Budget Consumed': project.budget.spent * 0.65, 'Total Allocated': project.budget.total },
    { month: 'May', 'Budget Consumed': project.budget.spent * 0.85, 'Total Allocated': project.budget.total },
    { month: 'Jun', 'Budget Consumed': project.budget.spent, 'Total Allocated': project.budget.total }
  ];

  // Specific AI briefings per project
  const getAiSummaryText = () => {
    if (project.id === 'PRJ-001') {
      return 'Project Aegis is demonstrating stellar engineering efficiency. Disaster Recovery hot-standby nodes have completed latency stress testing, verifying transaction loopbacks average 0.82ms. Next milestone focuses on final Vanguard security compliance audits.';
    }
    if (project.id === 'PRJ-003') {
      return 'Sentinel is critically constrained by HIPAA Cloud security audit approval loops. Missing a DevSecOps specialist has led to AWS tenant provisioning delays, placing the mid-July database replication sprint at high schedule risk.';
    }
    if (project.id === 'PRJ-006') {
      return 'Chronos Digital Ledger is severely impacted by mainframe COBOL legacy knowledge loss. Staff allocations are at critical capacity limit (125%). Recommend immediate contract hiring of mainframe bridging expertise.';
    }
    return `The project ${project.name} is executing current backlog items within acceptable schedule thresholds. Velocity remains aligned with the target bounds, and resource allocations are at optimal target capacity.`;
  };

  const getStatusBadgeColor = (status: Project['status']) => {
    switch (status) {
      case 'On Track': return 'bg-emerald-50 text-emerald-700 border border-emerald-150';
      case 'At Risk': return 'bg-amber-50 text-amber-700 border border-amber-150';
      case 'Critical': return 'bg-rose-50 text-rose-700 border border-rose-150 font-bold';
    }
  };

  const getIndicatorDot = (status: 'On Track' | 'At Risk' | 'Critical') => {
    switch (status) {
      case 'On Track': return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>;
      case 'At Risk': return <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>;
      case 'Critical': return <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="project-workspace-container">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <button 
            onClick={() => onNavigate('projects')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer mb-2.5 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Inventory
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans" id="project-workspace-title">
              {project.name}
            </h1>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono font-medium">Project ID: {project.id} • Client: {project.client}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded font-mono">
            SECURE WORKSPACE
          </span>
        </div>
      </div>

      {/* Tabs Selector Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1 py-1" id="workspace-tabs">
        {[
          { id: 'overview', label: 'Executive Overview', icon: Activity },
          { id: 'team', label: 'Team & Resources', icon: Users },
          { id: 'risks', label: 'Risks & Blockers', icon: AlertTriangle },
          { id: 'delivery', label: 'Delivery Metrics', icon: Code2 },
          { id: 'financial', label: 'Financial & Capacity', icon: CreditCard },
          { id: 'reports', label: 'AI Weekly Reports', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                isActive 
                  ? 'border-indigo-650 text-indigo-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Screen Content */}
      <div className="min-h-[400px]">
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Health Score</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">{project.healthScore}/100</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Velocity</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">{project.sprintVelocity} pts</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Budget Spent</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">
                  {Math.round((project.budget.spent / project.budget.total) * 100)}%
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Team Size</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">{project.teamSize} FTEs</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Open Risks</span>
                <span className="text-xl font-extrabold font-mono text-rose-600 block mt-1">{projectRisks.filter(r=>r.status === 'Open').length}</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Elapsed Time</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">{project.duration.elapsedPercentage}%</span>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Trend */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-mono">Algorithmic Health Score Trend</h3>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthTrendData} margin={{ left: -20, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="sprint" stroke="#94a3b8" fontSize={11} />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Line type="monotone" dataKey="health" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Velocity Trend */}
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-mono">Sprint Velocity vs Commitment Target</h3>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={velocityTrendData} margin={{ left: -20, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="sprint" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Legend fontSize={10} />
                      <Bar dataKey="Velocity" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Description & AI Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs lg:col-span-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono">Project Scope & Abstract</h3>
                <p className="text-xs text-slate-650 leading-relaxed font-sans">{project.description}</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-650" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">AI Workspace Summary</h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{getAiSummaryText()}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEAM & RESOURCES */}
        {activeTab === 'team' && (
          <div className="space-y-6 animate-fade-in">
            {/* Highlights cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center justify-between shadow-3xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Average Team Allocation</span>
                  <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">{avgUtilization}%</span>
                </div>
                <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                  <Users className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center justify-between shadow-3xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Skills Matrix Coverage</span>
                  <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">{uniqueSkills.length} Core Skills</span>
                </div>
                <div className="p-2 bg-indigo-50 rounded text-indigo-600">
                  <Code2 className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-lg flex items-center justify-between shadow-3xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Capacity Risk Alert</span>
                  <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">
                    {projectResources.filter(r=>r.status === 'Overloaded').length} Overloaded
                  </span>
                </div>
                <div className="p-2 bg-rose-50 text-rose-600 rounded">
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
              </div>
            </div>

            {/* Resources Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">FTE Allocation Matrix</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Department</th>
                      <th className="py-3 px-3 text-center">Allocation %</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-sans">
                    {projectResources.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">No team members assigned directly in simulation logs.</td>
                      </tr>
                    ) : (
                      projectResources.map(res => (
                        <tr key={res.resourceId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">{res.name}</td>
                          <td className="py-3 px-3 text-slate-650">{res.role}</td>
                          <td className="py-3 px-3 text-slate-600">{res.department}</td>
                          <td className="py-3 px-3 text-center font-mono font-bold">{res.allocationPercentage}%</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                              res.status === 'Optimal' ? 'bg-emerald-50 text-emerald-700' :
                              res.status === 'Overloaded' ? 'bg-rose-50 text-rose-700 font-bold' :
                              'bg-amber-50 text-amber-700'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Skills Distribution badges */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 font-mono">Assigned Team Skills Map</h3>
              <div className="flex flex-wrap gap-1.5">
                {uniqueSkills.map((skill, index) => (
                  <span key={index} className="bg-slate-50 border border-slate-200 text-slate-650 px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RISKS & BLOCKERS */}
        {activeTab === 'risks' && (
          <div className="space-y-6 animate-fade-in">
            {/* Risks List */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Risk registry</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {projectRisks.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 font-semibold text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    No active risks registered. All delivery parameters nominal.
                  </div>
                ) : (
                  projectRisks.map(risk => (
                    <div key={risk.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                              risk.severity === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-100 font-bold' : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {risk.severity} Severity
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold">#{risk.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              risk.status === 'Open' ? 'bg-red-50 text-red-650' : 
                              risk.status === 'Escalated' ? 'bg-amber-50 text-amber-705' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {risk.status}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">{risk.riskName}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Owner: <strong className="text-slate-700">{risk.owner}</strong></span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono block mb-1">Root Cause Analysis</span>
                          <p className="text-slate-600 leading-relaxed">{risk.rootCause}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono block mb-1">Steering Board Mitigation Plan</span>
                          <p className="text-slate-650 leading-relaxed font-semibold text-indigo-750">{risk.mitigationPlan}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Escalation Timeline Mock */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-mono">Governance Escalation Timeline</h3>
              <div className="relative border-l border-slate-200 pl-4 space-y-4 text-xs font-sans">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <span className="text-[10px] font-mono text-slate-450 block font-semibold">June 10, 2026</span>
                  <span className="font-bold text-slate-900 block mt-0.5">PMO Escalation Active</span>
                  <span className="text-slate-500 mt-1 block">Assigned compliance audit issues to PMO legal directors.</span>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span className="text-[10px] font-mono text-slate-450 block font-semibold">June 08, 2026</span>
                  <span className="font-bold text-slate-800 block mt-0.5">Risk Trigger Verified</span>
                  <span className="text-slate-500 mt-1 block">AWS tenant approval locks confirmed by engineering leads.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DELIVERY METRICS */}
        {activeTab === 'delivery' && (
          <div className="space-y-6 animate-fade-in">
            {/* Metrics cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block font-bold">Schedule Adherence</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">94.2%</span>
                <span className="text-[9px] text-amber-600 block mt-0.5 font-semibold">Target: 95%</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block font-bold">Sprint Completion Rate</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">91.5%</span>
                <span className="text-[9px] text-emerald-600 block mt-0.5 font-semibold">Target: 90%</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block font-bold">PR Merge Speed</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">1.8 hrs</span>
                <span className="text-[9px] text-emerald-600 block mt-0.5 font-semibold">Exceeding goal</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono block font-bold">Test Pass Rate</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">98.4%</span>
                <span className="text-[9px] text-slate-400 block mt-0.5 font-semibold">CI Green</span>
              </div>
            </div>

            {/* Interactive Git telemetry cards */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">GitHub Enterprise Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="border border-slate-200 p-3.5 rounded-lg bg-slate-50 flex items-center justify-between shadow-3xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">Commit Frequency</span>
                    <span className="text-slate-500 font-mono">148 commits / week</span>
                  </div>
                  <GitPullRequest className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="border border-slate-200 p-3.5 rounded-lg bg-slate-50 flex items-center justify-between shadow-3xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">Pull Requests Open</span>
                    <span className="text-slate-500 font-mono">3 open PRs</span>
                  </div>
                  <GitPullRequest className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="border border-slate-200 p-3.5 rounded-lg bg-slate-50 flex items-center justify-between shadow-3xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">Review Cycle Time</span>
                    <span className="text-slate-500 font-mono">Median: 125 mins</span>
                  </div>
                  <Clock className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIAL & CAPACITY */}
        {activeTab === 'financial' && (
          <div className="space-y-6 animate-fade-in">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Budget Allocated</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">
                  ${project.budget.total.toLocaleString()} {project.budget.currency}
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Budget Spent</span>
                <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">
                  ${project.budget.spent.toLocaleString()} {project.budget.currency}
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-3xs">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Remaining Balance</span>
                <span className="text-xl font-extrabold font-mono text-emerald-600 block mt-1">
                  ${(project.budget.total - project.budget.spent).toLocaleString()} {project.budget.currency}
                </span>
              </div>
            </div>

            {/* Consumption trend chart */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 font-mono">Cumulative Financial Spend Forecast</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={budgetTrendData} margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Budget Consumed" stroke="#4f46e5" fillOpacity={0.1} fill="#4f46e5" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Capacity Gap warnings */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-3xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Strategic Capacity & Staffing requirements</h3>
              <div className="text-xs font-sans space-y-2 leading-relaxed">
                <div className="flex items-start gap-2.5 p-3 rounded bg-amber-50/50 border border-amber-100/30 text-amber-800">
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Capacity gap warning: Skills concentration</span>
                    <p className="mt-0.5 text-slate-650">The team is highly exposed on architecture tasks. A single resource holds all cloud compliance skills. Recommend cross-training at least 2 database backend developers on Terraform scripts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AI WEEKLY REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            {projectReports.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 font-semibold text-xs">
                No reports compiled. AI agent status reports synchronize every Friday ending hours.
              </div>
            ) : (
              projectReports.map(rep => (
                <div key={rep.id} className="bg-white border border-slate-200 rounded-xl shadow-3xs overflow-hidden" id={`report-card-${rep.id}`}>
                  {/* Branding Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] bg-indigo-50 text-indigo-750 border border-indigo-150 px-2 py-0.5 rounded font-mono font-bold">
                          AI REPORT ACTIVE
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">#{rep.id}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{rep.projectName}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-455 pt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          Week ending: {rep.weekEnding}
                        </span>
                        <span>|</span>
                        <span>Author Lead: {rep.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-5 space-y-5">
                    <div className="space-y-1">
                      <h5 className="text-[10px] text-slate-455 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        Executive System Briefing Summary
                      </h5>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">{rep.executiveSummary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
                      <div>
                        <h5 className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono mb-2">Sprint Key Accomplishments</h5>
                        <ul className="space-y-1.5 text-xs text-slate-650 font-sans">
                          {rep.achievements.map((ach, i) => (
                            <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-100 shadow-3xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-[10px] text-rose-700 font-bold uppercase tracking-wider font-mono mb-2">Blockers & Hurdles</h5>
                        <ul className="space-y-1.5 text-xs text-slate-650 font-sans">
                          {rep.blockers.map((blk, i) => (
                            <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-100 shadow-3xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                              {blk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
                      <div>
                        <h5 className="text-[10px] text-amber-700 font-bold uppercase tracking-wider font-mono mb-2">Identified Active Risks</h5>
                        <ul className="space-y-1.5 text-xs text-slate-650 font-sans">
                          {rep.risks.map((rsk, i) => (
                            <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-100 shadow-3xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                              {rsk}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-[10px] text-indigo-750 font-bold uppercase tracking-wider font-mono mb-2">PMO Advisory Recommendations</h5>
                        <ul className="space-y-1.5 text-xs text-slate-650 font-sans">
                          {rep.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-100 shadow-3xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
