/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useCompany } from '../context/CompanyContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  TrendingUp, 
  Coins, 
  BarChart3, 
  ArrowUpRight, 
  Sparkles, 
  Download,
  Percent,
  SlidersHorizontal,
  Info
} from 'lucide-react';

export default function ExecutiveAnalytics() {
  const { projects } = useCompany();

  // Financial calculations
  const portfolioFinancials = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    projects.forEach(p => {
      totalBudget += p.budget.total;
      totalSpent += p.budget.spent;
    });
    const totalRemaining = totalBudget - totalSpent;
    const spentPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    
    // Mock ROI & NPV
    const roi = totalBudget > 0 ? 24.8 : 0;
    const npv = totalBudget * 0.45; // Simulated NPV as 45% of budget

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      spentPercent,
      roi,
      npv
    };
  }, [projects]);

  // Cost contingency simulation state (default 10%)
  const [contingencyRate, setContingencyRate] = useState<number>(10);

  // Project budgets for chart
  const projectBudgetData = useMemo(() => {
    return projects.map(p => {
      const contingency = p.budget.total * (contingencyRate / 100);
      const simulatedNPV = (p.budget.total * 0.45) - contingency;
      return {
        name: p.name.split(' ')[0], // short name
        budget: p.budget.total / 1000, // in thousands
        spent: p.budget.spent / 1000,
        contingency: contingency / 1000,
        simulatedNPV: Math.max(0, simulatedNPV) / 1000
      };
    });
  }, [projects, contingencyRate]);

  // Simulated cumulative value over quarters
  const quarterlyTrendData = useMemo(() => {
    const scale = portfolioFinancials.totalBudget / 1000000; // scale in millions
    return [
      { quarter: 'Q3 2025', actualValue: 2.1 * scale, plannedValue: 2.0 * scale },
      { quarter: 'Q4 2025', actualValue: 4.8 * scale, plannedValue: 4.5 * scale },
      { quarter: 'Q1 2026', actualValue: 7.6 * scale, plannedValue: 7.2 * scale },
      { quarter: 'Q2 2026', actualValue: 11.2 * scale, plannedValue: 10.5 * scale },
      { quarter: 'Q3 2026 (Proj)', actualValue: (14.5 + (contingencyRate - 10) * 0.1) * scale, plannedValue: 14.0 * scale },
      { quarter: 'Q4 2026 (Proj)', actualValue: (18.8 + (contingencyRate - 10) * 0.25) * scale, plannedValue: 18.0 * scale }
    ];
  }, [portfolioFinancials, contingencyRate]);

  const cv = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.02 } } };
  const iv = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } } };

  return (
    <motion.div
      variants={cv} initial="hidden" animate="show"
      className="space-y-6"
      id="executive-analytics-container"
    >
      {/* Page Header */}
      <motion.div variants={iv} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-2" id="exec-analytics-title">
            <TrendingUp className="w-6 h-6 text-indigo-650" />
            Executive Analytics & ROI Forecast
          </h1>
          <p className="text-sm text-slate-500 mt-1">C-Suite dashboard for strategic portfolio investment tracing, NPV forecasting, and cost control simulations.</p>
        </div>

        <button 
          onClick={() => alert('Financial report downloaded: EXECUTIVE_FINANCIAL_KPI_SHEET.xlsx')}
          className="bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-3xs hover:border-slate-350 transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-slate-400" />
          Export Financial Ledger
        </button>
      </motion.div>

      {/* Financial KPI Cards */}
      <motion.div variants={iv} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'Total Portfolio Budget', 
            value: `$${(portfolioFinancials.totalBudget / 1000000).toFixed(2)}M`, 
            sub: `${projects.length} Active Programs`,
            icon: Coins, 
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
            trend: '+12.4% vs last Q'
          },
          { 
            title: 'NPV (Net Present Value)', 
            value: `$${(portfolioFinancials.npv / 1000000).toFixed(2)}M`, 
            sub: 'Operational Yield',
            icon: TrendingUp, 
            color: 'text-purple-650 bg-purple-50 border-purple-100',
            trend: '+8.1% vs target'
          },
          { 
            title: 'Aggregate Burn Rate', 
            value: `${portfolioFinancials.spentPercent}%`, 
            sub: `$${(portfolioFinancials.totalSpent / 1000000).toFixed(2)}M Expended`,
            icon: Percent, 
            color: 'text-amber-600 bg-amber-50 border-amber-100',
            trend: 'Pacing optimal'
          },
          { 
            title: 'Portfolio Projected ROI', 
            value: `${portfolioFinancials.roi}%`, 
            sub: 'Next 18mo Target',
            icon: BarChart3, 
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            trend: '+2.4% vs baseline'
          }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-slate-350 transition-colors">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">{kpi.title}</span>
                <div className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">{kpi.value}</div>
              </div>
              <div className={`p-2 rounded-lg border ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-[10.5px]">
              <span className="text-slate-500 font-medium">{kpi.sub}</span>
              <span className="font-bold font-mono text-emerald-650 flex items-center gap-0.5 font-sans">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Contingency Simulation Control Panel */}
      <motion.div variants={iv} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4 relative overflow-hidden" id="financial-simulator">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/3 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4.5 h-4.5 text-indigo-650" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Portfolio Contingency Sandbox Simulator</h3>
          </div>
          <span className="text-[9px] bg-indigo-50 text-indigo-750 font-bold border border-indigo-150 px-2 py-0.5 rounded font-mono">FINANCIAL FORECASTING</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="space-y-2 lg:max-w-2xl text-xs">
            <p className="text-slate-600 leading-relaxed font-sans font-medium">
              Simulate contingency reserves to see their immediate impact on Net Present Value (NPV) and delivery buffers. Drag the slider to alter the budget contingency percentage.
            </p>
            <div className="text-[10px] text-slate-455 font-mono flex items-center gap-1 font-semibold">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Formula: NPV decreases as contingency increases to account for locked capitalization thresholds.
            </div>
          </div>

          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-5 shrink-0 w-full lg:w-96">
            <div className="flex justify-between w-full text-xs font-bold font-mono">
              <span className="text-slate-500">Contingency Reserve:</span>
              <span className="text-indigo-650">{contingencyRate}% of Budget</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="25" 
              step="1"
              value={contingencyRate}
              onChange={(e) => setContingencyRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
            />
          </div>
        </div>
      </motion.div>

      {/* Chart Layout */}
      <motion.div variants={iv} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Cost vs. Actuals vs. NPV Bar Chart */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Project Budgets & Simulated NPV ($k)
            </h3>
            <span className="text-[9px] text-slate-400 font-mono">[Executive Analytics Ledger]</span>
          </div>

          <div className="h-[300px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectBudgetData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Bar dataKey="budget" name="Total Budget ($k)" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Spent to Date ($k)" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
                <Bar dataKey="simulatedNPV" name="Simulated NPV ($k)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Value Accrual Trend Line */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Value Accrual Trend ($M)
            </h3>
            <span className="text-[9px] text-slate-400 font-mono">[Planned vs. Actual Value]</span>
          </div>

          <div className="h-[300px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quarterlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="quarter" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Line type="monotone" dataKey="actualValue" stroke="#10b981" strokeWidth={2.5} name="Actual Accrued Value" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="plannedValue" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" name="Target Planned Baseline" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Program Cost Efficiency Index (CPI) */}
      <motion.div variants={iv} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            Portfolio Cost Performance Index (CPI)
          </h3>
          <p className="text-[10.5px] text-slate-455 font-medium font-sans mt-0.5">
            Formula: Earned Value (EV) / Actual Cost (AC). A CPI &gt; 1.0 indicates cost efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((proj, idx) => {
            // Simulate CPI from health score
            const cpi = 0.8 + (proj.healthScore / 100) * 0.4;
            const cpiOk = cpi >= 1.0;
            return (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs font-semibold space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{proj.name}</span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                    cpiOk ? 'bg-emerald-50 text-emerald-750 border border-emerald-100' : 'bg-rose-50 text-rose-750 border border-rose-100'
                  }`}>
                    CPI: {cpi.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className={`h-full ${cpiOk ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, cpi * 70)}%` }}></div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>EV: ${(proj.budget.spent * cpi / 1000).toFixed(0)}k</span>
                  <span>AC: ${(proj.budget.spent / 1000).toFixed(0)}k</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
