/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { useCompany } from '../context/CompanyContext';
import { 
  BarChart, Bar, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
  PieChart, Pie
} from 'recharts';
import { 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck,
  TrendingUp, 
  LineChart as LineIcon,
  Sparkles,
  Zap,
  Activity,
  Award,
  BellRing
} from 'lucide-react';

interface DeliveryHealthProps {
  projects: Project[];
}

export default function DeliveryHealth({ projects }: DeliveryHealthProps) {
  const { slaMetrics, telemetryEvents } = useCompany();

  // Sort projects by health score descending
  const sortedProjectsByHealth = [...projects].sort((a, b) => b.healthScore - a.healthScore);

  // Classify projects
  const greenProjects = projects.filter(p => p.status === 'On Track');
  const amberProjects = projects.filter(p => p.status === 'At Risk');
  const redProjects = projects.filter(p => p.status === 'Critical');

  const totalProjects = projects.length;
  const healthDistributionData = [
    { name: 'On Track', value: greenProjects.length, color: '#10B981' },
    { name: 'At Risk', value: amberProjects.length, color: '#F59E0B' },
    { name: 'Critical', value: redProjects.length, color: '#EF4444' }
  ];

  // Custom coloring for the health scores
  const getHealthColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const chartData = sortedProjectsByHealth.map(p => ({
    name: p.name.replace(' Platform', '').replace(' Translation', '').substring(0, 15) + '...',
    'Health Score': p.healthScore,
    color: getHealthColor(p.healthScore),
    velocity: p.sprintVelocity,
    target: p.targetVelocity
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.02 } }
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
      id="delivery-health-container"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans" id="delivery-health-title">Delivery Integrity & Health Checks</h1>
          <p className="text-sm text-slate-500 mt-1">Algorithmic project safety scoring, schedule deviation tracking, and operational commitments auditing.</p>
        </div>
      </motion.div>

      {/* State Allocations Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6" id="health-grid-metrics">
        <motion.div variants={itemVariants} className="card-hover bg-white border-l-4 border-l-emerald-500 border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 shrink-0 border border-emerald-100">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-lighter font-mono">On Track (Green Category)</h3>
            <span className="text-2xl font-extrabold font-mono text-slate-900 inline-block mt-1">{greenProjects.length} Programs</span>
            <p className="text-xs text-slate-500 mt-1">Teams operating within standard velocity coefficients. Risk parameters nominal.</p>
            
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono block">Current items:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {greenProjects.map(p => (
                  <span key={p.id} className="text-[10px] bg-slate-50 text-emerald-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                    {p.id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border-l-4 border-l-amber-500 border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600 shrink-0 border border-amber-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-lighter font-mono">At Risk (Amber Category)</h3>
            <span className="text-2xl font-extrabold font-mono text-slate-900 inline-block mt-1">{amberProjects.length} Programs</span>
            <p className="text-xs text-slate-500 mt-1">Moderate variance in velocities or pending integrations. Needs localized PMO assistance.</p>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono block">Current items:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {amberProjects.map(p => (
                  <span key={p.id} className="text-[10px] bg-slate-50 text-amber-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                    {p.id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-hover bg-white border-l-4 border-l-rose-500 border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600 shrink-0 border border-rose-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-lighter font-mono">Critical (Red Category)</h3>
            <span className="text-2xl font-extrabold font-mono text-slate-900 inline-block mt-1">{redProjects.length} Programs</span>
            <p className="text-xs text-slate-500 mt-1">Significant sprint misses or critical skills deficit. Mandatory program escalation in effect.</p>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono block">Current items:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {redProjects.map(p => (
                  <span key={p.id} className="text-[10px] bg-slate-50 text-rose-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                    {p.id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Charts & SLA Monitoring Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Health Scoring visual comparisons */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-3">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Algorithmic Health Index Comparison
            </h3>
            <span className="text-[11px] text-slate-500 font-mono font-semibold">Ranked high to low</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {/* Left Side: vertical BarChart (takes 3/5 width) */}
            <div className="h-[300px] md:col-span-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} tickLine={false} />
                  <Tooltip
                    content={({ payload, label }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 shadow-md rounded p-3 text-xs font-sans">
                            <p className="font-extrabold text-slate-900 mb-2">{label}</p>
                            <div className="space-y-1 font-semibold text-slate-600">
                              <p>Health Index: <strong style={{ color: data.color }}>{data['Health Score']}/100</strong></p>
                              <p>Sprint Speed: <span className="text-slate-800 font-mono font-bold">{data.velocity} points</span></p>
                              <p>Target Speed: <span className="text-slate-800 font-mono font-bold">{data.target} points</span></p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="Health Score" radius={[0, 4, 4, 0]} barSize={12}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Right Side: Pie Chart (takes 2/5 width) */}
            <div className="md:col-span-2 flex flex-col items-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3.5 self-start md:self-center">Health Allocations</span>
              <div className="h-[180px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {healthDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px' }}
                      itemStyle={{ color: '#0f172a' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <div className="text-2xl font-extrabold font-mono text-slate-900">{totalProjects}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Projects</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5 mt-2.5 w-full max-w-[130px] text-xs">
                {healthDistributionData.map((d, index) => (
                  <div key={index} className="flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                      <span>{d.name}</span>
                    </div>
                    <span className="font-mono text-slate-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: SLA Auditing Dashboard */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Regulatory SLA Compliance Audit
              </h3>
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="space-y-4">
              {slaMetrics && slaMetrics.length > 0 ? (
                slaMetrics.map((sla, i) => (
                  <div key={i} className="border border-slate-200 p-3 rounded-lg flex items-center justify-between gap-4 bg-slate-50 hover:border-slate-350 transition-all shadow-3xs">
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">{sla.name}</h4>
                      <div className="text-[10px] text-slate-500 font-mono font-bold">Target Threshold: {sla.target}</div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold font-mono text-slate-950 block">{sla.current}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-mono font-bold mt-1 ${
                        sla.status === 'On Track' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                        sla.status === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {sla.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic p-3 text-center">No SLA metrics recorded.</p>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2.5 text-xs text-amber-800 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/30">
            <BellRing className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="font-medium">1 SLA warnings currently active regarding sprint burn-down limits inside the Sentinel product.</p>
          </div>
        </div>
      </motion.div>

      {/* ML-Based Delivery Health Scoring Model Breakdown */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4" id="ml-health-classifier-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              ML-Based Delivery Health Scoring Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated multi-factor classification model (Green / Amber / Red) using gradient boosting across ingestion signals.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 self-start md:self-auto">
            <Zap className="w-3 h-3 text-indigo-600" />
            ML Model Confidence: 94.8%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Feature Weights Matrix */}
          <div className="lg:col-span-2 space-y-3 bg-slate-50/70 p-4 rounded-lg border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide font-mono flex items-center justify-between">
              <span>ML Feature Impact & Weight Allocation</span>
              <span className="text-[10px] text-slate-400 font-normal">Scikit-Learn Gradient Booster v2.4</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              {[
                { feature: 'Defect Density & Open Issues Rate', weight: 25, impact: 'Negative', color: 'bg-rose-500' },
                { feature: 'Sprint Velocity Variance vs Target', weight: 22, impact: 'Negative', color: 'bg-amber-500' },
                { feature: 'Resource Over-allocation Ratio', weight: 18, impact: 'Negative', color: 'bg-indigo-500' },
                { feature: 'PR Review Cycle Time & Merges', weight: 15, impact: 'Negative', color: 'bg-blue-500' },
                { feature: 'Budget Burn Rate & Elapsed Time Gap', weight: 12, impact: 'Negative', color: 'bg-purple-500' },
                { feature: 'Commit Activity Frequency & Stars', weight: 8, impact: 'Positive', color: 'bg-emerald-500' }
              ].map((f, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">{f.feature}</span>
                    <span className="font-mono font-bold text-slate-600">{f.weight}% Weight ({f.impact})</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className={`${f.color} h-1.5 rounded-full`} style={{ width: `${f.weight * 3.5}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classification Probabilities Card */}
          <div className="bg-slate-900 text-white rounded-lg p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold font-mono text-indigo-400 uppercase">Classification Matrix</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                Projects are classified into <strong>Green (On Track)</strong>, <strong>Amber (At Risk)</strong>, and <strong>Red (Critical)</strong> risk bands based on real-time signal probability density.
              </p>

              <div className="mt-3 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-850 rounded border border-slate-800">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Green (On Track)
                  </span>
                  <span className="font-extrabold text-white">
                    {totalProjects > 0 ? Math.round((greenProjects.length / totalProjects) * 100) : 0}% Prob
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-850 rounded border border-slate-800">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Amber (At Risk)
                  </span>
                  <span className="font-extrabold text-white">
                    {totalProjects > 0 ? Math.round((amberProjects.length / totalProjects) * 100) : 0}% Prob
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-850 rounded border border-slate-800">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    Red (Critical)
                  </span>
                  <span className="font-extrabold text-white">
                    {totalProjects > 0 ? Math.round((redProjects.length / totalProjects) * 100) : 0}% Prob
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[9px] text-slate-400 font-mono block text-center border-t border-slate-800 pt-2">
              Daily ML Training Pipeline • Continuous Telemetry Scoring
            </span>
          </div>
        </div>
      </motion.div>

      {/* Real-time Event Stream */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Activity className="w-4 h-4 text-indigo-650 animate-pulse" />
          Latest Delivery Telemetry Events
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {telemetryEvents && telemetryEvents.length > 0 ? (
            telemetryEvents.map((evt, idx) => (
              <div key={idx} className={`flex items-start gap-3 border-l-2 ${evt.borderColor} pl-3 py-2 ${evt.bgColor} rounded-r-md`}>
                <span className="text-slate-400 font-bold whitespace-nowrap">{evt.timestamp}</span>
                <div className="text-slate-700">
                  <span className="text-slate-950 font-extrabold">{evt.projectName}</span> {evt.message}
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic p-3 text-center">No recent telemetry events recorded.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
