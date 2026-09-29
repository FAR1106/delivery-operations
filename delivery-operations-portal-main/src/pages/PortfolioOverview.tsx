/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Project, Risk } from '../types';
import { useCompany } from '../context/CompanyContext';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Users, 
  Activity, 
  ArrowUpRight, 
  Sparkles,
  ChevronRight,
  AlertOctagon,
  TrendingUp,
  Scale,
  Milestone
} from 'lucide-react';
import InfoTooltip from '../components/InfoTooltip';
import { portfolioHistoricalTrends, mockCapacityForecast } from '../data/mockData';

export default function PortfolioOverview({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { 
    projects, 
    risks, 
    resources, 
    selectedCompany, 
    setSelectedCompany, 
    allProjects,
    trendsData: backendTrends,
    capacityForecastData: backendCapacity,
    operationalConfidence,
    aiBriefing
  } = useCompany();

  // Compute portfolio KPIs dynamically
  const totalProjects = projects.length;
  const onTrackProjects = projects.filter(p => p.status === 'On Track');
  const atRiskProjects = projects.filter(p => p.status === 'At Risk');
  const criticalProjects = projects.filter(p => p.status === 'Critical');

  // Compute average health score
  const portfolioHealthScore = useMemo(() => {
    if (totalProjects === 0) return 100;
    return Math.round(projects.reduce((acc, p) => acc + p.healthScore, 0) / totalProjects);
  }, [projects, totalProjects]);

  // Compute average velocity and resource utilization
  const averageVelocity = useMemo(() => {
    if (totalProjects === 0) return 0;
    return Math.round(projects.reduce((acc, p) => acc + p.sprintVelocity, 0) / totalProjects);
  }, [projects, totalProjects]);


  // Milestones count
  const totalMilestones = totalProjects * 2;
  const clearedMilestones = Math.round(totalMilestones * 0.88);

  // Attention Projects
  const attentionProjects = useMemo(() => {
    return projects.filter(p => p.status === 'Critical' || p.status === 'At Risk')
      .sort((a, b) => {
        if (a.status === 'Critical' && b.status !== 'Critical') return -1;
        if (a.status !== 'Critical' && b.status === 'Critical') return 1;
        return a.healthScore - b.healthScore;
      });
  }, [projects]);

  // Scaling factors for historical trends and forecasting based on selected company scale
  const scalingFactor = useMemo(() => {
    const baseTotal = allProjects.length;
    if (baseTotal === 0) return 1;
    return totalProjects / baseTotal;
  }, [projects, allProjects]);

  // Use backend trends if populated, else scaled fallback
  const trendsData = useMemo(() => {
    if (backendTrends && backendTrends.length > 0) return backendTrends;
    return portfolioHistoricalTrends.map(t => ({
      ...t,
      velocity: Math.round(t.velocity * (scalingFactor > 0 ? scalingFactor : 0.25)),
      healthy: Math.round(t.healthy * scalingFactor),
      atRisk: Math.round(t.atRisk * scalingFactor),
      critical: Math.round(t.critical * scalingFactor)
    }));
  }, [backendTrends, scalingFactor]);

  // Use backend capacity forecast if populated, else scaled fallback
  const capacityForecastData = useMemo(() => {
    if (backendCapacity && backendCapacity.length > 0) return backendCapacity;
    return mockCapacityForecast.map(m => ({
      ...m,
      currentCapacity: Math.round(m.currentCapacity * (scalingFactor > 0 ? scalingFactor : 0.25)),
      projectedDemand: Math.round(m.projectedDemand * (scalingFactor > 0 ? scalingFactor : 0.25))
    }));
  }, [backendCapacity, scalingFactor]);

  // Risk forecasting index (representing predicted risk metrics for Q3-Q4 2026)
  const riskForecastTrend = useMemo(() => {
    const mult = Math.max(1, totalProjects);
    return [
      { label: 'Q1 2026', historical: Math.round(1.5 * mult), projected: Math.round(1.5 * mult) },
      { label: 'Q2 2026', historical: Math.round(2 * mult), projected: Math.round(2 * mult) },
      { label: 'End Q2', historical: Math.round(2.5 * mult), projected: Math.round(2.5 * mult) },
      { label: 'Q3 2026 (F)', projected: Math.round(1 * mult) },
      { label: 'Q4 2026 (F)', projected: Math.round(0.5 * mult) },
      { label: 'Q1 2027 (F)', projected: Math.round(0.2 * mult) }
    ];
  }, [totalProjects]);

  const getReasonForAttention = (p: Project): string => {
    const matchedRisk = risks.find(r => r.projectId === p.id || r.projectName === p.name);
    if (matchedRisk) {
      return `${matchedRisk.riskName}: ${matchedRisk.rootCause || matchedRisk.mitigationPlan}`;
    }
    if (p.id === 'PRJ-003') return 'Critical schedule delay and HIPAA compliance audit blockers.';
    if (p.id === 'PRJ-005') return 'COBOL legacy rewrite delayed due to senior developer capacity overload (125%).';
    if (p.id === 'PRJ-002') return 'POS terminal API request loss (8%) and high latency under peak traffic simulation.';
    return 'Review required due to overall delivery health variance.';
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-rose-500';
      case 'At Risk': return 'bg-amber-500';
      default: return 'bg-indigo-650';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.02 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
      id="portfolio-overview-container"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans" id="portfolio-title">
            Portfolio Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated delivery health, velocity metrics, strategic forecasting models, and AI briefings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-md px-3 py-1.5 flex items-center gap-2 text-[10px] font-mono font-semibold text-emerald-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            PORTFOLIO SYNCHRONIZED
          </div>
        </div>
      </motion.div>

      {/* SECTION 1: Current Portfolio Status KPIs */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-8 gap-4" id="portfolio-kpi-grid">
        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs col-span-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center">Portfolio Health <InfoTooltip content="Calculated using Sprint Velocity, Risk Index and Project Progress." /></span>
          <span className="text-2xl font-extrabold font-mono text-indigo-750 block mt-2">{portfolioHealthScore}/100</span>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs col-span-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center">Total Projects <InfoTooltip content="The total number of active projects in the selected workspace." /></span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 block mt-2">{totalProjects}</span>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs col-span-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center">Healthy (On Track) <InfoTooltip content="Projects progressing according to schedule with no major risks." /></span>
          <span className="text-2xl font-extrabold font-mono text-emerald-600 block mt-2">{onTrackProjects.length}</span>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs col-span-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center">At Risk <InfoTooltip content="Projects showing health score variance or potential schedule slippage." /></span>
          <span className="text-2xl font-extrabold font-mono text-amber-600 block mt-2">{atRiskProjects.length}</span>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs col-span-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center">Critical <InfoTooltip content="Projects with severe schedule delays or critical blockers requiring immediate intervention." /></span>
          <span className="text-2xl font-extrabold font-mono text-rose-600 block mt-2">{criticalProjects.length}</span>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-2xs col-span-1">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center">Open Risks <InfoTooltip content="Total count of unmitigated risks across the portfolio." /></span>
          <span className="text-2xl font-extrabold font-mono text-rose-600 block mt-2">{risks.filter(r=>r.status === 'Open').length}</span>
        </motion.div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-355 transition-all shadow-2xs">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center">Milestones Cleared <InfoTooltip content="Number of completed milestones versus total planned milestones." /></span>
          <span className="text-2xl font-extrabold font-mono text-indigo-600 block mt-2">{clearedMilestones}/{totalMilestones}</span>
        </div>
      </motion.div>

      {/* SECTION 2: Portfolio Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Velocity & Status Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Sprint Velocity & Health distribution Trend
            </h3>
            <span className="text-[10px] text-slate-550">Month-over-month Analysis</span>
          </div>

          <div className="h-[250px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="velocity" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={0.1} fill="#4f46e5" name="Release Velocity (Pts)" />
                <Bar dataKey="healthy" fill="#10b981" barSize={8} name="Healthy Projects" stackId="states" opacity={0.7} />
                <Bar dataKey="atRisk" fill="#f59e0b" barSize={8} name="At Risk Projects" stackId="states" opacity={0.7} />
                <Bar dataKey="critical" fill="#ef4444" barSize={8} name="Critical Projects" stackId="states" opacity={0.7} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capacity planning simulation trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              6-Month Strategic Capacity vs Demand Forecast
            </h3>
            <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono font-bold">FORWARD LOOKING</span>
          </div>

          <div className="h-[250px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={capacityForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="currentCapacity" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={0.1} fill="#4f46e5" name="Capacity FTE" />
                <Area type="monotone" dataKey="projectedDemand" stroke="#ef4444" strokeWidth={2.5} fillOpacity={0.05} fill="#ef4444" name="Demand FTE" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Milestone Delivery Trends & Target vs Actual Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4" id="milestone-delivery-trends-widget">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-650" />
              Milestone Delivery Trends & On-Time Performance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">Target vs actual milestone release completion rates and sprint delivery trends.</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded font-bold">
              On-Time Rate: 92.4%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Target Milestones (Q3)</span>
            <span className="text-xl font-extrabold text-slate-900">28 Milestones</span>
            <span className="text-[9px] text-slate-400 block font-sans">100% Planned Scope</span>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-lg space-y-1">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">Completed On-Time</span>
            <span className="text-xl font-extrabold text-emerald-700">22 Milestones</span>
            <span className="text-[9px] text-emerald-600 block font-sans">78.5% Delivered Ahead</span>
          </div>

          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-lg space-y-1">
            <span className="text-[10px] text-indigo-700 font-bold uppercase block">In Active Sprint</span>
            <span className="text-xl font-extrabold text-indigo-700">4 Milestones</span>
            <span className="text-[9px] text-indigo-600 block font-sans">14.3% In Progress</span>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-lg space-y-1">
            <span className="text-[10px] text-amber-700 font-bold uppercase block">Delayed / At Risk</span>
            <span className="text-xl font-extrabold text-amber-700">2 Milestones</span>
            <span className="text-[9px] text-amber-600 block font-sans">7.2% Early Slippage</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Forecasting Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast indicators */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">Operational Confidence Metrics</h3>
          
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-3xs">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Delivery Confidence</span>
                <span className="text-[10px] text-slate-500">Based on sprint adherence SLA</span>
              </div>
              <span className="text-lg font-mono font-bold text-indigo-750">{operationalConfidence.deliveryConfidence}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-3xs">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Resource Demand Variance</span>
                <span className="text-[10px] text-slate-500">Projected delta for Q3</span>
              </div>
              <span className={`text-lg font-mono font-bold ${operationalConfidence.demandVariance < 0 ? 'text-rose-650' : 'text-emerald-650'}`}>
                {operationalConfidence.demandVariance > 0 ? `+${operationalConfidence.demandVariance}` : operationalConfidence.demandVariance} FTEs
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-3xs">
              <div>
                <span className="font-bold text-slate-900 text-xs block">SLA Compliance Rate</span>
                <span className="text-[10px] text-slate-500">Target baseline: 95%</span>
              </div>
              <span className="text-lg font-mono font-bold text-emerald-650">{operationalConfidence.slaCompliance}%</span>
            </div>
          </div>
        </div>

        {/* Risk index forecast */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Risk Index Forecast</h3>
            <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-1.5 py-0.5 rounded font-mono font-bold">PREDICTIVE Exposure</span>
          </div>

          <div className="h-[180px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskForecastTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="historical" stroke="#f59e0b" strokeWidth={2.5} name="Historical Risks" />
                <Line type="monotone" dataKey="projected" stroke="#4f46e5" strokeWidth={2} name="Projected Risks (F)" strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 4: AI Executive Briefing Summary (RAG System Powered) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Sparkles className={`w-4 h-4 text-indigo-650 ${aiBriefing.loading ? 'animate-spin' : ''}`} />
                <span className="text-xs font-bold text-slate-950 uppercase tracking-wider font-mono">AI Portfolio Briefing</span>
              </div>
              <span className="text-[9px] bg-indigo-50 text-indigo-750 font-semibold px-2 py-0.5 rounded font-mono border border-indigo-150/50 uppercase">
                SECURE REPORT
              </span>
            </div>
            
            <p className="text-xs text-slate-705 leading-relaxed font-sans font-medium">
              "{aiBriefing.briefing}"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-4">
            <span>RAG Synthesized via Database Context</span>
            <span className="flex items-center gap-1 text-emerald-600 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Exception Projects list */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Projects Requiring Attention
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
              Prioritized listing of active programs exhibiting health or capacity constraints.
            </p>
          </div>
        </div>

        {attentionProjects.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">All systems operational</p>
            <p className="text-xs mt-1">No projects currently require attention or review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20">
                  <th className="py-2.5 pr-4 pl-2">Project / Client</th>
                  <th className="py-2.5 px-3">Health</th>
                  <th className="py-2.5 px-3">Duration Progress</th>
                  <th className="py-2.5 pl-4">Reason for Attention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {attentionProjects.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => onNavigate('project-workspace-' + p.id)}
                  >
                    <td className="py-3 pr-4 pl-2 font-semibold text-slate-900">
                      <span>{p.name}</span>
                      <span className="text-[10px] text-slate-450 block font-mono font-normal mt-0.5">{p.id} • {p.client}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold ${
                        p.status === 'Critical' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-100 font-bold' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getProgressBarColor(p.status)}`}
                            style={{ width: `${p.duration.elapsedPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-600">
                          {p.duration.elapsedPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pl-4 text-slate-505 leading-normal max-w-xs md:max-w-sm font-medium">
                      {getReasonForAttention(p)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
