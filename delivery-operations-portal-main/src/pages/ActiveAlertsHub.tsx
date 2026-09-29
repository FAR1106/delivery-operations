/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useCompany } from '../context/CompanyContext';
import { 
  Bell, 
  AlertOctagon, 
  AlertTriangle, 
  Info as InfoIcon, 
  CheckCircle, 
  Clock, 
  Filter, 
  Check, 
  Trash2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface OperationalAlert {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Warning' | 'Info';
  type: 'Velocity Drop' | 'Capacity Shortage' | 'Resource Overallocation' | 'Milestone Delay Risk' | 'Stagnant High Priority Work';
  time: string;
  status: 'Active' | 'Resolved';
  acknowledged: boolean;
}

const initialAlerts: OperationalAlert[] = [
  {
    id: 'ALT-101',
    projectId: 'PRJ-003',
    projectName: 'Sentinel Health Cloud Migration',
    title: 'HIPAA Cloud Compliance Audit Blocked',
    description: 'AWS tenant environment provisioning is blocked pending third-party compliance review. Core templates cannot be run.',
    severity: 'Critical',
    type: 'Milestone Delay Risk',
    time: '10 mins ago',
    status: 'Active',
    acknowledged: false
  },
  {
    id: 'ALT-102',
    projectId: 'PRJ-006',
    projectName: 'Chronos Digital Ledger Rewrite',
    title: 'Severe Dev Capacity Shortage',
    description: 'COBOL logic decompilation is delayed due to mainframe engineer capacity overload (125%). Legacy documentation missing.',
    severity: 'Critical',
    type: 'Capacity Shortage',
    time: '2 hours ago',
    status: 'Active',
    acknowledged: false
  },
  {
    id: 'ALT-103',
    projectId: 'PRJ-002',
    projectName: 'OmniChannel Retail Consolidation',
    title: 'POS Terminal Ingestion Velocity Drop',
    description: 'Sprint velocity dropped by 24% on POS endpoint integrations. High latency simulator causing test failures.',
    severity: 'Critical',
    type: 'Velocity Drop',
    time: '4 hours ago',
    status: 'Active',
    acknowledged: false
  },
  {
    id: 'ALT-104',
    projectId: 'PRJ-006',
    projectName: 'Chronos Digital Ledger Rewrite',
    title: 'Stagnant High Priority Mainframe Security Tasks',
    description: 'Distributed encryption bridge setup tasks have remained in Backlog unassigned for 10 consecutive days.',
    severity: 'Critical',
    type: 'Stagnant High Priority Work',
    time: 'Yesterday',
    status: 'Active',
    acknowledged: false
  },
  {
    id: 'ALT-105',
    projectId: 'PRJ-001',
    projectName: 'Project Aegis Trading Platform',
    title: 'Resource Overallocation warning: Sarah Jenkins',
    description: 'Sarah Jenkins allocation percentage is at 110% across Aegis and Sentinel migrations. Skills bottleneck detected.',
    severity: 'Warning',
    type: 'Resource Overallocation',
    time: '1 day ago',
    status: 'Active',
    acknowledged: false
  },
  {
    id: 'ALT-106',
    projectId: 'PRJ-007',
    projectName: 'Synapse ML Video Recommender',
    title: 'AWS GPU Instance Quota Bottleneck',
    description: 'Quota limits on P5 ML instances in local zones are creating scheduling slippages in video training algorithms.',
    severity: 'Warning',
    type: 'Milestone Delay Risk',
    time: '2 days ago',
    status: 'Active',
    acknowledged: true
  },
  {
    id: 'ALT-107',
    projectId: 'PRJ-005',
    projectName: 'Velo Real-Time Logistics Routing',
    title: 'Logistics Optimization Verified',
    description: 'Velo Core Routing model verification passed. Travel duration computation latency optimized by 15%.',
    severity: 'Info',
    type: 'Velocity Drop',
    time: '3 days ago',
    status: 'Active',
    acknowledged: false
  }
];

export default function ActiveAlertsHub() {
  const { projects } = useCompany();
  const [alerts, setAlerts] = useState<OperationalAlert[]>(initialAlerts);
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');
  const [ackFilter, setAckFilter] = useState<'All' | 'Unacknowledged' | 'Acknowledged'>('All');

  // Filter alerts by the active company's projects
  const companyProjectIds = useMemo(() => new Set(projects.map(p => p.id)), [projects]);
  
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const belongsToCompany = companyProjectIds.has(alert.projectId);
      if (!belongsToCompany) return false;

      const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
      const matchesAck = ackFilter === 'All' || 
                         (ackFilter === 'Acknowledged' && alert.acknowledged) ||
                         (ackFilter === 'Unacknowledged' && !alert.acknowledged);

      return matchesSeverity && matchesAck;
    });
  }, [alerts, companyProjectIds, severityFilter, ackFilter]);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: !alert.acknowledged } : alert
    ));
  };

  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(alert => 
      companyProjectIds.has(alert.projectId) ? { ...alert, acknowledged: true } : alert
    ));
  };

  // Metrics
  const criticalCount = filteredAlerts.filter(a => a.severity === 'Critical').length;
  const warningCount = filteredAlerts.filter(a => a.severity === 'Warning').length;
  const infoCount = filteredAlerts.filter(a => a.severity === 'Info').length;
  const unacknowledgedCount = filteredAlerts.filter(a => !a.acknowledged).length;

  const getSeverityStyle = (severity: OperationalAlert['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Warning':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Info':
        return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  const getSeverityIcon = (severity: OperationalAlert['severity']) => {
    switch (severity) {
      case 'Critical':
        return <AlertOctagon className="w-4.5 h-4.5 text-rose-650" />;
      case 'Warning':
        return <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />;
      case 'Info':
        return <InfoIcon className="w-4.5 h-4.5 text-blue-600" />;
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
      id="alerts-hub-container"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-2" id="alerts-title">
            <Bell className="w-6 h-6 text-indigo-650" />
            Active Alerts Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">Real-time operational alerts indicating velocity variance, allocation overload, and milestone slippages.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAcknowledgeAll}
            disabled={unacknowledgedCount === 0}
            className="bg-white border border-slate-250 hover:bg-slate-5 transition-colors text-slate-700 text-xs font-bold px-3.5 py-2 rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-3xs"
          >
            Acknowledge All
          </button>
        </div>
      </motion.div>

      {/* Mini Alert Cards Deck */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="alerts-stats-grid">
        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider font-mono block">Active Alerts</span>
            <span className="text-2xl font-extrabold font-mono text-slate-900 inline-block mt-1">{filteredAlerts.length}</span>
            <span className="text-[10px] text-slate-400 block mt-1 font-semibold">{unacknowledgedCount} unacknowledged</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-150 rounded-md text-slate-500">
            <Bell className="w-4.5 h-4.5" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 border-l-4 border-l-rose-500 rounded-lg p-4 flex justify-between items-center shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider font-mono block">Critical Warnings</span>
            <span className="text-2xl font-extrabold font-mono text-rose-600 mt-1 inline-block">{criticalCount} Alerts</span>
            <span className="text-[10px] text-slate-450 block mt-1 font-semibold">Immediate escalation</span>
          </div>
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-md text-rose-600">
            <AlertOctagon className="w-4.5 h-4.5" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-lg p-4 flex justify-between items-center shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider font-mono block">Slippage Risks</span>
            <span className="text-2xl font-extrabold font-mono text-amber-600 mt-1 inline-block">{warningCount} Alerts</span>
            <span className="text-[10px] text-slate-450 block mt-1 font-semibold">Moderate risk level</span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-amber-605">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-lg p-4 flex justify-between items-center shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-mono block">System Information</span>
            <span className="text-2xl font-extrabold font-mono text-blue-600 mt-1 inline-block">{infoCount} Verified</span>
            <span className="text-[10px] text-slate-455 block mt-1 font-semibold">Verification logs</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-105 rounded-md text-blue-600">
            <InfoIcon className="w-4.5 h-4.5" />
          </div>
        </motion.div>
      </motion.div>

      {/* Early Risk Flagging Engine & Rules Configurator */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4" id="early-risk-engine-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Early Risk Flagging & Rules Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated signal watcher that flags early delivery slippages, capacity bottlenecks, and SLA risks before client escalation.</p>
          </div>
          <button
            onClick={() => {
              const scanToast = document.getElementById('scan-status-msg');
              if (scanToast) scanToast.innerText = 'Scan Complete: 6 active risks flagged across project repositories.';
            }}
            className="bg-indigo-650 hover:bg-indigo-700 text-white font-mono text-xs font-bold px-3.5 py-2 rounded-md transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Run Early Risk Scan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs font-mono">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Velocity Drop Threshold</span>
            <span className="text-sm font-extrabold text-slate-900">&gt; 15% Sprint Variance</span>
            <span className="text-[9px] text-amber-600 block">Auto-flags Amber Warning</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Defect Density Limit</span>
            <span className="text-sm font-extrabold text-slate-900">&gt; 12 Open Bugs / Sprint</span>
            <span className="text-[9px] text-rose-600 block">Auto-flags Critical Red Alert</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Resource Overload Limit</span>
            <span className="text-sm font-extrabold text-slate-900">&gt; 110% Total Allocation</span>
            <span className="text-[9px] text-indigo-600 block">Auto-triggers Capacity Rebalance</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">SLA Breach Window</span>
            <span className="text-sm font-extrabold text-slate-900">&lt; 5 Days to Milestone</span>
            <span className="text-[9px] text-purple-600 block">Triggers Steering Audit</span>
          </div>
        </div>

        <div id="scan-status-msg" className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 p-2 rounded border border-emerald-100">
          Rule Engine Active: Continuous telemetry monitoring connected to GitHub, ADO, Jira & Timesheets.
        </div>
      </div>

      {/* Main Alert List Filters */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        {/* Filters Controls Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-550 font-mono uppercase font-bold">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-semibold cursor-pointer outline-none font-sans"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
                <option value="Info">Info</option>
              </select>
            </div>

            {/* Acknowledgment Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-550 font-mono uppercase font-bold">State:</span>
              <select
                value={ackFilter}
                onChange={(e) => setAckFilter(e.target.value as any)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-semibold cursor-pointer outline-none font-sans"
              >
                <option value="All">All States</option>
                <option value="Unacknowledged">Unacknowledged Only</option>
                <option value="Acknowledged">Acknowledged Only</option>
              </select>
            </div>
          </div>
          
          <span className="text-xs text-slate-500 font-mono font-bold">
            Showing {filteredAlerts.length} operational alerts
          </span>
        </div>

        {/* Alerts List */}
        <div className="divide-y divide-slate-100">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-sans font-semibold">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All operational indicators are healthy. No active alerts.
            </div>
          ) : (
            filteredAlerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut', delay: idx * 0.05 }}
                className={`alert-row p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  alert.acknowledged ? 'opacity-65' : ''
                }`}
              >
                {/* Alert Details */}
                <div className="flex items-start gap-3.5 max-w-3xl">
                  <div className="mt-1 shrink-0">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-bold uppercase ${getSeverityStyle(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">#{alert.id}</span>
                      <span className="text-[10px] text-indigo-650 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 font-bold font-mono">
                        {alert.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed font-sans">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5 font-medium">
                      <span>Project: <strong className="text-slate-700">{alert.projectName}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer border flex items-center gap-1.5 transition-colors shadow-3xs ${
                      alert.acknowledged 
                        ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800' 
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-405 hover:bg-slate-5'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
