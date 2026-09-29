/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useCompany } from '../context/CompanyContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Layers, 
  AlertTriangle, 
  Scale, 
  FileText, 
  Sparkles,
  Search,
  Command,
  HelpCircle,
  CornerDownLeft,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Clock
} from 'lucide-react';

interface CommandCenterProps {
  onNavigate: (page: string) => void;
  onLaunchCopilot: (query?: string) => void;
}

// 1. KPI Count-Up Animation Component
function CountUp({ end, duration = 800 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return <>{count}</>;
}

// 2. Compact AI Status Card (right panel — robot removed)
interface AICopilotAssistantProps {
  onNavigate: (page: string) => void;
  onLaunchCopilot: (query?: string) => void;
}

function AICopilotAssistant({ onNavigate, onLaunchCopilot }: AICopilotAssistantProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="relative w-full border border-slate-200 bg-white shadow-2xs rounded-2xl p-5 font-sans overflow-hidden flex flex-col gap-4"
      id="ai-copilot-assistant-panel"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/3 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-[11px] font-extrabold tracking-tight text-slate-900 uppercase">
            Delivery Copilot
          </h3>
          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Portfolio Intelligence Assistant</p>
        </div>
        <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 text-[8px] font-bold text-indigo-700">
          <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="font-mono">COPILOT ACTIVE</span>
        </div>
      </div>

      {/* AI Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
          <span className="text-[10.5px] font-bold text-slate-800">AI Portfolio Intelligence Active</span>
        </div>

        <div>
          <div className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">Monitoring</div>
          <ul className="space-y-1">
            {['Portfolio Health', 'Capacity Constraints', 'Delivery Risks'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[10px] font-semibold text-slate-600">
                <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100">
        <motion.button
          onClick={() => onLaunchCopilot()}
          whileHover={{ x: 2, borderColor: 'rgba(99,102,241,0.3)', backgroundColor: '#f5f3ff' }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-between border border-indigo-100 bg-indigo-50/20 p-2 px-3 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-bold text-indigo-700">Launch Delivery Copilot</span>
          </div>
          <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
        </motion.button>

        <motion.button
          onClick={() => onNavigate('weekly-reports')}
          whileHover={{ x: 2, borderColor: 'rgba(99,102,241,0.15)', backgroundColor: '#f8fafc' }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-between border border-slate-200 bg-white p-2 px-3 rounded-xl transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900">Generate Weekly Report</span>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function CommandCenter({ onNavigate, onLaunchCopilot }: CommandCenterProps) {
  const { projects, risks, resources, reports, selectedCompany } = useCompany();

  // Command input states
  const [commandInput, setCommandInput] = useState('');
  const [showCommandSuggestions, setShowCommandSuggestions] = useState(false);

  // Dynamic Metrics and Counts
  const totalProjects = projects.length;
  const openRisksCount = risks.filter(r => r.status === 'Open').length;
  const staffingGapsCount = resources.filter(r => r.status === 'Overloaded').length;

  const attentionProjects = useMemo(() => {
    return projects.filter(p => p.status === 'Critical' || p.status === 'At Risk');
  }, [projects]);

  const portfolioHealthScore = useMemo(() => {
    if (projects.length === 0) return 100;
    return Math.round(projects.reduce((acc, p) => acc + p.healthScore, 0) / projects.length);
  }, [projects]);

  // Operational Greeting
  const timeGreeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Dynamic active streams (clients count)
  const activeStreamsCount = useMemo(() => {
    const uniqueClients = new Set(projects.map(p => p.client));
    return uniqueClients.size;
  }, [projects]);



  // Submit search query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    onLaunchCopilot(commandInput);
    setCommandInput('');
    setShowCommandSuggestions(false);
  };

  const suggestedCommands = [
    { text: 'Which projects are at risk?', label: 'At Risk' },
    { text: 'Show critical risks', label: 'Critical Risks' },
    { text: 'Portfolio summary', label: 'Portfolio Overview' }
  ];

  // Actionable prioritized items
  const controlTowerAlerts = useMemo(() => {
    const alerts: Array<{
      id: string;
      severity: 'critical' | 'warning' | 'info';
      title: string;
      subtitle: string;
      actionLabel: string;
      action: () => void;
    }> = [];

    // 1. Critical schedule delays
    projects.filter(p => p.status === 'Critical').forEach(p => {
      alerts.push({
        id: `alert-crit-${p.id}`,
        severity: 'critical',
        title: 'Critical Schedule Delay',
        subtitle: `${p.name} (${p.client}) requires immediate project management intervention.`,
        actionLabel: 'Resolve Delay',
        action: () => onNavigate(`project-workspace-${p.id}`)
      });
    });

    // 3. Schedule slippage warnings
    projects.filter(p => p.status === 'At Risk').forEach(p => {
      alerts.push({
        id: `alert-warn-${p.id}`,
        severity: 'warning',
        title: 'Schedule Slippage Detected',
        subtitle: `${p.name} showing health score variance (${p.healthScore}/100). Check logic dependencies.`,
        actionLabel: 'Audit Program Timeline',
        action: () => onNavigate(`project-workspace-${p.id}`)
      });
    });

    // 4. Info executive briefs ready
    alerts.push({
      id: 'alert-brief-ready',
      severity: 'info',
      title: 'Executive Brief Ready',
      subtitle: `Weekly AI status briefs compiled for ${selectedCompany === 'All Companies' ? 'active programs' : selectedCompany} portfolio.`,
      actionLabel: 'Open Report',
      action: () => onNavigate('weekly-reports')
    });

    return alerts.slice(0, 4); // Show 4 alerts max
  }, [projects, resources, selectedCompany, onNavigate]);

  // Framer Motion staggered entrance animations
  const pageContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const slideUpVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 24
      }
    }
  };

  return (
    <div className="relative overflow-hidden font-sans min-h-screen pb-12" id="portfolio-center-root">
      
      {/* PREMIUM BACKGROUNDS: Grid and radial gradient highlights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,white_60%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-500/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[450px] h-[450px] bg-purple-500/2 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        variants={pageContainerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8 max-w-7xl mx-auto px-1 relative z-10"
      >
        
        {/* HEADER SECTION */}
        <motion.div 
          variants={slideUpVariants} 
          className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-5 gap-4"
        >
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans" id="hub-title">
              PORTFOLIO OPERATIONS CENTER
            </h1>
            <p className="text-xs text-slate-505 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
              <span>Executive Briefing Console</span>
              <span className="w-1 h-1 rounded-full bg-slate-350"></span>
              <span className="text-indigo-600 font-semibold">Real-time portfolio intelligence, resource forecasting, and risk oversight</span>
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            PORTFOLIO FEED STATUS: ACTIVE
          </div>
        </motion.div>

        {/* HERO SECTION: CONTROL BRIEFING EXPERIENCE */}
        <motion.section 
          variants={slideUpVariants}
          className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden" 
          id="hero-briefing"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            <div className="space-y-3.5 max-w-xl">
              {/* Greeting with compact AI Copilot avatar inline */}
              <div className="flex items-center gap-3.5">
                {/* Compact AI Avatar — 88px, enterprise style */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
                  className="shrink-0 relative"
                  id="copilot-avatar"
                >
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-md" />
                  {/* Avatar body */}
                  <div className="relative w-[88px] h-[88px] rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg border border-indigo-400/30">
                    {/* Inner highlight */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/15 pointer-events-none" />
                    {/* Sparkles icon */}
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                      <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" fill="white" fillOpacity="0.95"/>
                      <path d="M5 5.5C5 7.43 3.43 9 1.5 9C3.43 9 5 10.57 5 12.5C5 10.57 6.57 9 8.5 9C6.57 9 5 7.43 5 5.5Z" fill="white" fillOpacity="0.6"/>
                      <path d="M19 3C19 4.38 17.88 5.5 16.5 5.5C17.88 5.5 19 6.62 19 8C19 6.62 20.12 5.5 21.5 5.5C20.12 5.5 19 4.38 19 3Z" fill="white" fillOpacity="0.6"/>
                    </svg>
                    {/* Live pulse dot */}
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 border-2 border-white shadow-sm">
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                    </span>
                  </div>

                </motion.div>

                {/* Greeting text */}
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {timeGreeting}, Catherine
                  </h2>
                  <p className="text-[10.5px] text-indigo-600 font-semibold mt-0.5">Portfolio Intelligence Assistant · Active</p>
                </div>
              </div>
              <p className="text-xs text-slate-505 leading-relaxed font-medium">
                You are logged into the central portfolio operations terminal. Operational parameters are dynamically filtered based on selected project clients and active workspaces. Use the search console below to query status logs.
              </p>
              

            </div>

            {/* Right Side: Premium AI Copilot Assistant Panel */}
            <div className="w-full lg:w-[380px] shrink-0 mt-6 lg:mt-0">
              <AICopilotAssistant 
                onNavigate={onNavigate}
                onLaunchCopilot={onLaunchCopilot}
              />
            </div>
          </div>
        </motion.section>

        {/* PORTFOLIO STATUS BAR WITH KPI COUNT-UP ANIMATIONS */}
        <motion.section 
          variants={slideUpVariants}
          className="bg-slate-900 border border-slate-950 text-slate-200 rounded-xl p-3 px-4 shadow-sm" 
          id="status-bar"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10.5px] font-sans font-bold tracking-wide uppercase">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span className="text-slate-400">Portfolio Health:</span>
              <span className="text-white font-sans font-extrabold tracking-tight">
                <CountUp end={portfolioHealthScore} />/100
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span className="text-slate-400">Active Risks:</span>
              <span className="text-white font-sans font-extrabold tracking-tight">
                <CountUp end={openRisksCount} /> Open Issues
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span className="text-slate-400">Capacity Alerts:</span>
              <span className="text-white font-sans font-extrabold tracking-tight">
                <CountUp end={staffingGapsCount} /> Staffing Gaps
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-400">Attention Required:</span>
              <span className="text-white font-sans font-extrabold tracking-tight">
                <CountUp end={attentionProjects.length} /> Flagged Programs
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-850 px-2 py-0.5 rounded border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-450 font-bold font-sans tracking-tight">AI Copilot Online</span>
            </div>
          </div>
        </motion.section>

        {/* PRIMARY SECTION: OVERSIGHT ACTION ALERTS WITH STAGGERED REVEALS */}
        <motion.section 
          variants={slideUpVariants}
          className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4" 
          id="oversight-alerts"
        >
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">Oversight Action Alerts</h2>
              <p className="text-[10.5px] text-slate-455 font-medium font-sans mt-0.5">Prioritized schedule variances, resource bottlenecks, and program updates</p>
            </div>
            <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-150 px-2 py-0.5 rounded font-mono font-bold uppercase select-none">
              Attention Areas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {controlTowerAlerts.map((alert, idx) => (
              <motion.div 
                key={alert.id}
                onClick={alert.action}
                variants={slideUpVariants}
                whileHover={{ 
                  y: -3, 
                  borderColor: "rgba(99, 102, 241, 0.25)", 
                  boxShadow: "0 10px 20px -8px rgba(0, 0, 0, 0.04)"
                }}
                className={`border rounded-xl p-4 flex flex-col justify-between transition-all cursor-pointer bg-white group ${
                  alert.severity === 'critical' ? 'border-rose-200/80' : 
                  alert.severity === 'warning' ? 'border-amber-250/80' : 'border-slate-200/80'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm select-none">
                      {alert.severity === 'critical' ? '🔴' : alert.severity === 'warning' ? '🟡' : '🟢'}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wide ${
                      alert.severity === 'critical' ? 'text-rose-655' : 
                      alert.severity === 'warning' ? 'text-amber-750' : 'text-emerald-650'
                    }`}>
                      {alert.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 font-semibold leading-relaxed font-sans">
                    {alert.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-bold text-slate-405 group-hover:text-indigo-650 transition-colors">
                  <span className="font-sans">{alert.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-650 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </motion.div>
      
    </div>
  );
}
