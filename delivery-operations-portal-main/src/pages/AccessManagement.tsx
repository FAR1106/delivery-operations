/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Key, 
  FileLock, 
  Check, 
  X, 
  Plus, 
  Lock, 
  Unlock,
  Info,
  Clock
} from 'lucide-react';
import { UserRole } from '../App';

interface PermissionRow {
  pageId: string;
  label: string;
  Executive: boolean;
  'PMO Director': boolean;
  'Project Manager': boolean;
  'Delivery Lead': boolean;
  'Team Member': boolean;
}

export default function AccessManagement() {
  // Permission Matrix state for simulation
  const [permissions, setPermissions] = useState<PermissionRow[]>([
    { pageId: 'home', label: 'Home Dashboard', Executive: true, 'PMO Director': true, 'Project Manager': true, 'Delivery Lead': true, 'Team Member': true },
    { pageId: 'portfolio-overview', label: 'Portfolio Overview', Executive: true, 'PMO Director': true, 'Project Manager': false, 'Delivery Lead': false, 'Team Member': false },
    { pageId: 'projects', label: 'Projects Inventory', Executive: true, 'PMO Director': true, 'Project Manager': true, 'Delivery Lead': true, 'Team Member': true },
    { pageId: 'delivery-health', label: 'Delivery Health Dashboard', Executive: true, 'PMO Director': true, 'Project Manager': false, 'Delivery Lead': true, 'Team Member': false },
    { pageId: 'risk-center', label: 'Risk Command Center', Executive: true, 'PMO Director': true, 'Project Manager': true, 'Delivery Lead': false, 'Team Member': false },
    { pageId: 'weekly-reports', label: 'Weekly AI Reports', Executive: true, 'PMO Director': true, 'Project Manager': false, 'Delivery Lead': false, 'Team Member': false },
    { pageId: 'ai-intelligence-hub', label: 'AI Intelligence Hub', Executive: true, 'PMO Director': true, 'Project Manager': true, 'Delivery Lead': true, 'Team Member': true },

    { pageId: 'executive-analytics', label: 'Executive Analytics', Executive: true, 'PMO Director': true, 'Project Manager': false, 'Delivery Lead': true, 'Team Member': false },
    { pageId: 'access-management', label: 'Access Management', Executive: true, 'PMO Director': true, 'Project Manager': false, 'Delivery Lead': false, 'Team Member': false }
  ]);

  // Toggle single cell permission in matrix (simulation)
  const handleTogglePermission = (pageId: string, role: UserRole) => {
    setPermissions(prev => prev.map(row => {
      if (row.pageId === pageId) {
        return {
          ...row,
          [role]: !row[role]
        };
      }
      return row;
    }));
  };

  // Directory and SSO configurations state
  const [ssoConnected, setSsoConnected] = useState(true);
  const [activeDirectoryDomain, setActiveDirectoryDomain] = useState('corp.codincity.com');
  const [sessionTimeout, setSessionTimeout] = useState('60');

  // Simulated Access Logs list
  const [accessLogs, setAccessLogs] = useState([
    { user: 'Sarah Jenkins', role: 'Executive', ip: '192.168.1.45', time: '10m ago', action: 'Accessed Portfolio Overview', status: 'Success' },
    { user: 'Catherine Vance', role: 'PMO Director', ip: '192.168.1.12', time: '22m ago', action: 'Modified Capacity Forecast', status: 'Success' },
    { user: 'Alex Rivera', role: 'Delivery Lead', ip: '10.0.4.19', time: '1h ago', action: 'Accessed Executive Analytics', status: 'Success' },
    { user: 'Emma Chen', role: 'Team Member', ip: '10.0.5.82', time: '2h ago', action: 'Attempted to open Risk Center', status: 'Blocked (RBAC)' },
    { user: 'David Miller', role: 'Project Manager', ip: '192.168.1.88', time: '4h ago', action: 'Synchronized Azure DevOps board indicators', status: 'Success' }
  ]);

  const cv = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.02 } } };
  const iv = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } } };

  return (
    <motion.div
      variants={cv} initial="hidden" animate="show"
      className="space-y-6"
      id="access-management-container"
    >
      {/* Page Header */}
      <motion.div variants={iv} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-2" id="access-title">
            <ShieldCheck className="w-6 h-6 text-indigo-650" />
            Access Management & RBAC
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure role-based access control, enforce security boundaries, trace entry audits, and manage active directories.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Matrix config) - takes 2 cols on large screen */}
        <div className="lg:col-span-2 space-y-6">
          {/* Permission Matrix */}
          <motion.div variants={iv} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileLock className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Role-Based Access Matrix</h3>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-2 py-0.5 rounded font-mono">LIVE POLICY MATRIX</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Click the checkmarks or cross marks below to dynamically adjust resource access boundaries for each user role in this sandbox session.
            </p>

            {/* Scrollable table container */}
            <div className="overflow-x-auto border border-slate-150 rounded-xl shadow-3xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[9px] uppercase text-slate-500">
                    <th className="p-3 font-bold">Workspace Section</th>
                    <th className="p-3 text-center font-bold">Exec</th>
                    <th className="p-3 text-center font-bold">PMO Dir</th>
                    <th className="p-3 text-center font-bold">Proj Mgr</th>
                    <th className="p-3 text-center font-bold">Deliv Lead</th>
                    <th className="p-3 text-center font-bold">Team Member</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700 font-sans">
                  {permissions.map((row) => (
                    <tr key={row.pageId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800">{row.label}</td>
                      
                      {/* Exec */}
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleTogglePermission(row.pageId, 'Executive')}
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            row.Executive ? 'text-indigo-600 bg-indigo-50/40 hover:bg-indigo-100' : 'text-slate-350 hover:bg-slate-100'
                          }`}
                        >
                          {row.Executive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>

                      {/* PMO Dir */}
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleTogglePermission(row.pageId, 'PMO Director')}
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            row['PMO Director'] ? 'text-indigo-600 bg-indigo-50/40 hover:bg-indigo-100' : 'text-slate-350 hover:bg-slate-100'
                          }`}
                        >
                          {row['PMO Director'] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>

                      {/* Proj Mgr */}
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleTogglePermission(row.pageId, 'Project Manager')}
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            row['Project Manager'] ? 'text-indigo-600 bg-indigo-50/40 hover:bg-indigo-100' : 'text-slate-350 hover:bg-slate-100'
                          }`}
                        >
                          {row['Project Manager'] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>

                      {/* Deliv Lead */}
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleTogglePermission(row.pageId, 'Delivery Lead')}
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            row['Delivery Lead'] ? 'text-indigo-600 bg-indigo-50/40 hover:bg-indigo-100' : 'text-slate-350 hover:bg-slate-100'
                          }`}
                        >
                          {row['Delivery Lead'] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>

                      {/* Team Member */}
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => handleTogglePermission(row.pageId, 'Team Member')}
                          className={`p-1.5 rounded transition-all cursor-pointer ${
                            row['Team Member'] ? 'text-indigo-600 bg-indigo-50/40 hover:bg-indigo-100' : 'text-slate-350 hover:bg-slate-100'
                          }`}
                        >
                          {row['Team Member'] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-455 font-mono pt-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Permission updates synchronize dynamically into workspace navigation routers.</span>
            </div>
          </motion.div>

          {/* Directory Integrations & Single Sign-On */}
          <motion.div variants={iv} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Directory SSO Configuration</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4 font-sans">
                {/* Active Directory Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Enterprise SSO Domain</label>
                  <input
                    type="text"
                    value={activeDirectoryDomain}
                    onChange={(e) => setActiveDirectoryDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 rounded-md p-2 outline-none font-semibold transition-all"
                  />
                </div>

                {/* Session Timeout */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Session Lockout Timeout (Minutes)</label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-md p-2 outline-none cursor-pointer font-semibold focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes (Default)</option>
                    <option value="120">120 Minutes</option>
                  </select>
                </div>
              </div>

              {/* SSO Activation state toggle */}
              <div className="flex flex-col justify-between bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      {ssoConnected ? <Lock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                      SAML SSO Gateway
                    </span>
                    <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed font-sans">
                      Enforce Single Sign-On authentication via Okta or Azure AD integrations.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSsoConnected(!ssoConnected)}
                    className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors shrink-0 ${ssoConnected ? 'bg-indigo-650 justify-end' : 'bg-slate-200 justify-start'}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white block shadow-sm"></span>
                  </button>
                </div>

                <div className="border-t border-slate-200/60 pt-2.5 text-[9.5px] text-slate-400 font-mono font-bold flex justify-between">
                  <span>SSO status:</span>
                  <span className={ssoConnected ? 'text-emerald-650' : 'text-slate-400'}>{ssoConnected ? 'SSO ENFORCED' : 'BYPASS ACTIVE'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Access logs & user roles list) */}
        <div className="space-y-6">
          {/* Active Security Access Logs */}
          <motion.div variants={iv} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Access Audit Trail Log</h3>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {accessLogs.map((log, idx) => {
                const isBlocked = log.status.startsWith('Blocked');
                return (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[10px] text-slate-455 font-mono font-bold">
                      <span className="text-slate-800">{log.user} ({log.role})</span>
                      <span>{log.time}</span>
                    </div>
                    <p className="text-slate-655 font-medium leading-relaxed font-sans">{log.action}</p>
                    <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center text-[9px] font-mono">
                      <span>IP: {log.ip}</span>
                      <span className={`font-bold uppercase ${isBlocked ? 'text-rose-650' : 'text-emerald-600'}`}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => alert('Access Audit log exported: SYSTEM_AUDIT_LOG_Q2.log')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs cursor-pointer shadow-sm transition-colors text-center font-sans"
            >
              Export Security Audits
            </button>
          </motion.div>

          {/* Role profiles details */}
          <motion.div variants={iv} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2 font-mono">
              <Users className="w-4.5 h-4.5 text-indigo-600" />
              Role Profiles Overview
            </h3>

            <div className="space-y-3.5 text-xs font-sans">
              {[
                { name: 'Executive', desc: 'Read-only access to high-level portfolio financials, overall health indexes, and weekly AI briefing reports.' },
                { name: 'PMO Director', desc: 'Full administrative rights to modify budgets, manage capacity allocations, and override risk mitigations.' },
                { name: 'Project Manager', desc: 'Read-write access to designated project workspaces, risks registries, and team sprint velocity parameters.' },
                { name: 'Delivery Lead', desc: 'Access to engineering indicators and operational root cause checklists.' },
                { name: 'Team Member', desc: 'Restricted read-only access to projects checklists, assigned sprint cards, and standard operating policies.' }
              ].map((profile, idx) => (
                <div key={idx} className="space-y-1">
                  <strong className="font-bold text-slate-900 block">{profile.name} Profile</strong>
                  <p className="text-slate-505 font-medium leading-relaxed">{profile.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
