/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Risk, RiskSeverity, RiskStatus } from '../types';
import { useCompany } from '../context/CompanyContext';
import { 
  AlertTriangle, 
  Search, 
  SlidersHorizontal, 
  X, 
  Clock, 
  User, 
  ShieldAlert, 
  Briefcase, 
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldQuestion,
  Wrench,
  Sparkles,
  Play
} from 'lucide-react';

interface RiskCenterProps {
  risks: Risk[];
  onRiskUpdate?: (updatedRisks: Risk[]) => void;
}

export default function RiskCenter({ risks, onRiskUpdate }: RiskCenterProps) {
  const { updateRiskStatus, fetchRiskAiRecommendation } = useCompany();

  // We keep a state of risks to make it interactive (e.g., mitgating or escalating risks)
  const [activeRisks, setActiveRisks] = useState<Risk[]>(risks);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering state
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Selected risk detail view state
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(risks[0] || null);

  // RAG advisory state
  const [ragRecommendation, setRagRecommendation] = useState<string>('');
  const [isRagLoading, setIsRagLoading] = useState<boolean>(false);

  // Fetch RAG advisory recommendation when selected risk changes
  React.useEffect(() => {
    if (selectedRisk) {
      setIsRagLoading(true);
      fetchRiskAiRecommendation(selectedRisk.id).then(res => {
        if (res && res.recommendation) {
          setRagRecommendation(res.recommendation);
        } else {
          setRagRecommendation(selectedRisk.recommendedActions || selectedRisk.mitigationPlan);
        }
        setIsRagLoading(false);
      });
    } else {
      setRagRecommendation('');
    }
  }, [selectedRisk?.id]);

  // Sync state on prop changes
  React.useEffect(() => {
    setActiveRisks(risks);
    if (risks.length > 0) {
      const stillExists = risks.find(r => r.id === selectedRisk?.id);
      setSelectedRisk(stillExists || risks[0]);
    } else {
      setSelectedRisk(null);
    }
  }, [risks]);

  // Stats computation
  const totalRisks = activeRisks.length;
  const criticalCount = activeRisks.filter(r => r.severity === 'High' && r.status !== 'Mitigated').length;
  const escalatedCount = activeRisks.filter(r => r.status === 'Escalated').length;
  const mitigatedCount = activeRisks.filter(r => r.status === 'Mitigated').length;

  // Handles updating the selected risk model status on the fly
  const handleTransitionStatus = async (riskId: string, newStatus: RiskStatus) => {
    const updated = activeRisks.map(r => {
      if (r.id === riskId) {
        const item = { ...r, status: newStatus };
        if (selectedRisk?.id === r.id) {
          setSelectedRisk(item);
        }
        return item;
      }
      return r;
    });
    setActiveRisks(updated);
    if (onRiskUpdate) {
      onRiskUpdate(updated);
    }
    await updateRiskStatus(riskId, newStatus);
  };

  // Filter core logic
  const filteredRisks = useMemo(() => {
    return activeRisks.filter(r => {
      const matchesSearch = r.riskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.rootCause.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = severityFilter === 'All' || r.severity === severityFilter;
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [activeRisks, searchTerm, severityFilter, statusFilter]);

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'High': return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200 font-bold';
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-200 font-semibold';
    }
  };

  const getStatusBadge = (status: RiskStatus) => {
    switch (status) {
      case 'Open': return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      case 'Escalated': return 'bg-purple-50 text-purple-700 border-purple-200 font-bold';
      case 'Mitigated': return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.02 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
      id="risk-center-page-container"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans" id="risk-center-title">Executive Risk Mitigation Command</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time identification of technology blockers, system compliance hazards, and operational bottlenecks.</p>
        </div>
      </motion.div>

      {/* Risks Stats Row */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4" id="risks-stats-row">
        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center shadow-xs">
          <div>
            <span className="text-xs text-slate-500 font-mono uppercase tracking-wider font-bold block">Total Tracked Risks</span>
            <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 inline-block">{totalRisks}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-md text-slate-700 border border-slate-100 shadow-3xs">
            <ShieldQuestion className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border-l-4 border-l-rose-500 border border-slate-200 rounded-lg p-4 flex justify-between items-center shadow-xs">
          <div>
            <span className="text-xs text-rose-600 font-mono uppercase tracking-wider font-bold block">Active Severe Threats</span>
            <span className="text-2xl font-extrabold font-mono text-rose-600 mt-1 inline-block">{criticalCount}</span>
          </div>
          <div className="p-2 bg-rose-50 rounded-md text-rose-700 border border-rose-100 shadow-3xs">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border-l-4 border-l-purple-500 border border-slate-200 rounded-lg p-4 flex justify-between items-center shadow-xs">
          <div>
            <span className="text-xs text-purple-600 font-mono uppercase tracking-wider font-bold block">Escalated to Board</span>
            <span className="text-2xl font-extrabold font-mono text-purple-600 mt-1 inline-block">{escalatedCount}</span>
          </div>
          <div className="p-2 bg-purple-50 rounded-md text-purple-700 border border-purple-100 shadow-3xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border-l-4 border-l-emerald-500 border border-slate-200 rounded-lg p-4 flex justify-between items-center shadow-xs">
          <div>
            <span className="text-xs text-emerald-600 font-mono uppercase tracking-wider font-bold block">Resolved & Mitigated</span>
            <span className="text-2xl font-extrabold font-mono text-emerald-600 mt-1 inline-block">{mitigatedCount}</span>
          </div>
          <div className="p-2 bg-emerald-50 rounded-md text-emerald-700 border border-emerald-100 shadow-3xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </motion.div>
      </motion.div>

      {/* Control Search bar and Filter selectors */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search risk profiles or root causes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-850 rounded-md pl-10 pr-4 py-2 text-xs font-sans outline-none placeholder-slate-400 font-medium transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Severity Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono font-bold">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer outline-none font-sans"
            >
              <option value="All">All Severities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer outline-none font-sans"
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="Escalated">Escalated</option>
              <option value="Mitigated">Mitigated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Splitscreen interactive workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Risk List */}
        <div className="lg:col-span-2 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredRisks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
              No hazard profiles located within the selected filters.
            </div>
          ) : (
            filteredRisks.map((risk, idx) => (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut', delay: idx * 0.04 }}
                onClick={() => setSelectedRisk(risk)}
                className={`border text-left p-4 rounded-xl cursor-pointer transition-colors ${
                  selectedRisk?.id === risk.id 
                    ? 'border-indigo-500 bg-indigo-50/40 shadow-xs' 
                    : 'card-hover-sm border-slate-200 bg-white shadow-3xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono font-semibold block">{risk.id} • {risk.projectName}</span>
                    <h3 className="text-xs font-bold text-slate-900 tracking-tight font-sans line-clamp-1 leading-snug">{risk.riskName}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold border rounded-full shrink-0 ${getSeverityBadge(risk.severity)}`}>
                    {risk.severity} Detail
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 font-semibold font-sans flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Owner: {risk.owner}
                  </span>

                  <span className={`px-2 py-0.5 text-[9px] font-mono border rounded ${getStatusBadge(risk.status)}`}>
                    {risk.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>        {/* Right Side: Detailed Risk Operations Desk */}
        <div className="lg:col-span-3">
          {selectedRisk ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm" id="risk-operations-desk">
              {/* Profile Header */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-indigo-650 font-mono font-bold block">{selectedRisk.id}</span>
                  <span className="text-slate-300 font-bold">|</span>
                  <span className="text-xs text-slate-500 font-semibold block flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    Project: <strong className="text-slate-700 ml-0.5 font-bold">{selectedRisk.projectName}</strong>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-2 leading-snug">{selectedRisk.riskName}</h2>

                <div className="flex items-center gap-3.5 mt-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Severity: 
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider ${getSeverityBadge(selectedRisk.severity)}`}>
                      {selectedRisk.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Impact: 
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-705 border border-slate-200 rounded-full text-[10px] font-bold font-mono tracking-wider animate-pulse-slow">
                      {selectedRisk.impactLevel} Impact
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-505"></span>
                    Current Risk Status: 
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-mono tracking-wider ${getStatusBadge(selectedRisk.status)}`}>
                      {selectedRisk.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-1 hover:bg-slate-100/50 transition-all">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-200/50 pb-2 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Identified Root Cause
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{selectedRisk.rootCause}</p>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-1 hover:bg-slate-100/50 transition-all">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-200/50 pb-2 mb-2">
                    <Wrench className="w-3.5 h-3.5 text-indigo-500" />
                    Tactical Mitigation Plan
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{selectedRisk.mitigationPlan}</p>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="bg-gradient-to-r from-indigo-50 to-slate-50 p-4 border border-indigo-100 rounded-lg shadow-2xs">
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-indigo-100/50 pb-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-650 animate-pulse" />
                  Prescribed Advisory Recommendations (RAG Engine)
                </h4>
                {isRagLoading ? (
                  <p className="text-xs text-slate-400 italic font-mono flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    Performing pgvector similarity search & synthesizing advisory recommendation...
                  </p>
                ) : (
                  <p className="text-xs text-slate-850 leading-relaxed font-sans font-medium">{ragRecommendation || selectedRisk.recommendedActions || selectedRisk.mitigationPlan}</p>
                )}
              </div>

              {/* Operational Metadata Row */}
              <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-650 shadow-3xs">
                <span className="font-sans flex items-center gap-1.5 font-medium">
                  <User className="w-4 h-4 text-slate-400" />
                  Escalation Owner: <strong className="text-slate-850 ml-0.5 font-bold">{selectedRisk.owner}</strong>
                </span>

                <span className="font-mono flex items-center gap-1.5 font-semibold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Detect trigger timestamp: {selectedRisk.triggerTime}
                </span>
              </div>

              {/* Escalation Control Row */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                <span className="text-xs text-slate-500 font-bold">Trigger standard board actions:</span>
                <div className="flex items-center gap-2.5">
                  {selectedRisk.status !== 'Mitigated' && (
                    <button 
                      onClick={() => handleTransitionStatus(selectedRisk.id, 'Mitigated')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition-all cursor-pointer shadow-xs"
                    >
                      Mark Resolved (Mitigated)
                    </button>
                  )}
                  
                  {selectedRisk.status !== 'Escalated' && (
                    <button 
                      onClick={() => handleTransitionStatus(selectedRisk.id, 'Escalated')}
                      className="border border-purple-200 hover:border-purple-350 bg-purple-50 hover:bg-purple-100/70 text-purple-700 text-xs font-semibold px-4 py-2 rounded-md transition-all cursor-pointer shadow-xs"
                    >
                      Escalate to Executive Board (C-Suite)
                    </button>
                  )}

                  {selectedRisk.status !== 'Open' && (
                    <button 
                      onClick={() => handleTransitionStatus(selectedRisk.id, 'Open')}
                      className="border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-mono px-3 py-2 rounded-md transition-all cursor-pointer shadow-3xs"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs shadow-3xs">
              Select an active threat from the list to invoke executive resolution dashboards.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
