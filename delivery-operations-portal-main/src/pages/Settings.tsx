/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings as SettingsIcon, 
  RefreshCw, 
  Check, 
  Building2, 
  Database, 
  Workflow, 
  Clock, 
  Slack,
  SlidersHorizontal,
  ChevronDown,
  AlertTriangle,
  Github
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

export default function Settings() {
  const { selectedCompany, organizations, updateCompany, refetchTelemetry } = useCompany();
  const currentOrg = organizations.find(o => o.name === selectedCompany);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Workspace Configurations details
  const [workspaceName, setWorkspaceName] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [directorEmail, setDirectorEmail] = useState('');
  const [industry, setIndustry] = useState('');
  
  // Configurable thresholds for Early Risk Flagging Engine
  const [warningThreshold, setWarningThreshold] = useState(80);
  const [criticalThreshold, setCriticalThreshold] = useState(60);

  // Azure DevOps Integration details
  const [adoConnected, setAdoConnected] = useState(false);
  const [adoUrl, setAdoUrl] = useState('');
  const [adoProject, setAdoProject] = useState('');
  const [adoToken, setAdoToken] = useState('');
  const [adoInterval, setAdoInterval] = useState('1h');

  // GitHub Integration details
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [githubInterval, setGithubInterval] = useState('1h');

  // Jira Integration details
  const [jiraConnected, setJiraConnected] = useState(false);
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraProject, setJiraProject] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  const [jiraInterval, setJiraInterval] = useState('1h');

  // Timesheet Integration details
  const [timesheetConnected, setTimesheetConnected] = useState(false);
  const [timesheetUrl, setTimesheetUrl] = useState('');
  const [timesheetInterval, setTimesheetInterval] = useState('1h');

  // Local toggles
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Populate form states when active company changes
  useEffect(() => {
    if (currentOrg) {
      setWorkspaceName(currentOrg.name);
      setDirectorName(currentOrg.adminName);
      setDirectorEmail(currentOrg.adminEmail);
      setIndustry(currentOrg.industry);
      setWarningThreshold(currentOrg.healthWarningThreshold ?? 80);
      setCriticalThreshold(currentOrg.healthCriticalThreshold ?? 60);

      const ad = currentOrg.integrations.azureDevOps || {};
      setAdoConnected(ad.connected || false);
      setAdoUrl(ad.endpoint || '');
      setAdoProject(ad.projectKey || '');
      setAdoToken(ad.token || '');
      setAdoInterval(ad.syncFrequency || '1h');

      const gh = currentOrg.integrations.github || {};
      setGithubConnected(gh.connected || false);
      setGithubUrl(gh.endpoint || '');
      setGithubToken(gh.token || '');
      setGithubInterval(gh.syncFrequency || '1h');

      const ji = currentOrg.integrations.jira || {};
      setJiraConnected(ji.connected || false);
      setJiraUrl(ji.endpoint || '');
      setJiraProject(ji.projectKey || '');
      setJiraToken(ji.token || '');
      setJiraInterval(ji.syncFrequency || '1h');

      const ts = currentOrg.integrations.timesheet || {};
      setTimesheetConnected(ts.connected || false);
      setTimesheetUrl(ts.endpoint || '');
      setTimesheetInterval(ts.syncFrequency || '1h');
    }
  }, [currentOrg]);

  if (selectedCompany === 'All Companies') {
    return (
      <div className="space-y-6 animate-fade-in" id="settings-page-container">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-2" id="settings-title">
              <SettingsIcon className="w-6 h-6 text-indigo-650" />
              System Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">Configure third-party integrations, operational alert triggers, and client company settings.</p>
          </div>
        </div>

        <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-xl text-center max-w-xl mx-auto my-12 shadow-xs">
          <SlidersHorizontal className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">Workspace Selection Required</h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Integration parameters, API tokens, and early risk thresholds are managed on a per-organization basis. 
            Please select a specific company workspace from the dropdown in the sidebar to configure its settings.
          </p>
        </div>
      </div>
    );
  }

  const handleTriggerSync = async () => {
    if (!currentOrg) return;
    setIsSyncing(true);
    try {
      await axios.post(`/api/companies/${currentOrg.id}/sync`);
      await refetchTelemetry();
      setToastMessage('Forced company data synchronization successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (e) {
      console.error(e);
      setToastMessage('Failed to trigger synchronization.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrg) return;

    try {
      const updatedIntegrations = {
        github: {
          connected: githubConnected,
          endpoint: githubUrl,
          token: githubToken,
          syncFrequency: githubInterval,
          authStatus: githubConnected ? 'Authenticated' as const : 'Not Connected' as const,
          lastSync: currentOrg.integrations.github.lastSync,
          syncHealth: currentOrg.integrations.github.syncHealth,
          importedRecords: currentOrg.integrations.github.importedRecords,
          failedImports: currentOrg.integrations.github.failedImports
        },
        jira: {
          connected: jiraConnected,
          endpoint: jiraUrl,
          projectKey: jiraProject,
          token: jiraToken,
          syncFrequency: jiraInterval,
          authStatus: jiraConnected ? 'Authenticated' as const : 'Not Connected' as const,
          lastSync: currentOrg.integrations.jira?.lastSync || null,
          syncHealth: currentOrg.integrations.jira?.syncHealth || 'N/A',
          importedRecords: currentOrg.integrations.jira?.importedRecords || 0,
          failedImports: 0
        },
        timesheet: {
          connected: timesheetConnected,
          endpoint: timesheetUrl,
          syncFrequency: timesheetInterval,
          authStatus: timesheetConnected ? 'Authenticated' as const : 'Not Connected' as const,
          lastSync: currentOrg.integrations.timesheet?.lastSync || null,
          syncHealth: currentOrg.integrations.timesheet?.syncHealth || 'N/A',
          importedRecords: currentOrg.integrations.timesheet?.importedRecords || 0,
          failedImports: 0
        }
      };

      await updateCompany(
        currentOrg.id,
        workspaceName,
        industry,
        directorName,
        directorEmail,
        updatedIntegrations,
        warningThreshold,
        criticalThreshold
      );

      setToastMessage('Workspace configurations and alert thresholds saved successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      console.error(err);
      setToastMessage('Failed to save configurations.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="settings-page-container">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-white border border-slate-250 rounded-xl p-4 shadow-lg flex items-center gap-3 animate-bounce">
          <div className="p-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-2" id="settings-title">
            <SettingsIcon className="w-6 h-6 text-indigo-650" />
            System Settings ({selectedCompany})
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure third-party integrations, operational alert triggers, client company settings, and early risk thresholds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Workspace Configurations Details form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
          
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3 flex items-center gap-2 font-mono">
              <Building2 className="w-4.5 h-4.5 text-indigo-600" />
              Company Workspace Configuration
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 rounded-md p-2 outline-none font-semibold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Sector / Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 rounded-md p-2 outline-none font-semibold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">PMO Lead / Admin Name</label>
                  <input
                    type="text"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 rounded-md p-2 outline-none font-semibold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">PMO Lead Email</label>
                  <input
                    type="email"
                    value={directorEmail}
                    onChange={(e) => setDirectorEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 rounded-md p-2 outline-none font-semibold transition-all"
                  />
                </div>
              </div>

              {/* Section 2: Early Risk Flagging thresholds */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-indigo-600" />
                  Early Risk Flagging Thresholds
                </h3>
                <p className="text-slate-500 text-[11px] mb-4 font-normal leading-relaxed">
                  Configure the project safety score boundaries. Project status will transition to <strong>At Risk (Amber)</strong> or <strong>Critical (Red)</strong> based on these thresholds.
                </p>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        Warning Threshold (Amber)
                      </span>
                      <span className="font-bold text-amber-600 font-mono bg-amber-55 px-2 py-0.5 rounded border border-amber-100">{warningThreshold}/100</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={warningThreshold}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setWarningThreshold(val);
                        if (val <= criticalThreshold) setCriticalThreshold(val - 1);
                      }}
                      className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-amber-550"
                    />
                    <span className="text-[10px] text-slate-400 block font-medium">Scores below this limit trigger early PMO escalation triggers.</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-555" />
                        Critical Threshold (Red)
                      </span>
                      <span className="font-bold text-rose-600 font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{criticalThreshold}/100</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={criticalThreshold}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCriticalThreshold(val);
                        if (val >= warningThreshold) setWarningThreshold(val + 1);
                      }}
                      className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-rose-555"
                    />
                    <span className="text-[10px] text-slate-400 block font-medium">Scores below this limit mandate immediate program steering audits.</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Credentials for ADO / Github */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Database className="w-4.5 h-4.5 text-indigo-600" />
                  API Endpoint Credentials
                </h3>

                {/* ADO Config panel */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-indigo-650" />
                      Azure DevOps Board Sync
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdoConnected(!adoConnected)}
                      className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${adoConnected ? 'bg-indigo-650 justify-end' : 'bg-slate-200 justify-start'}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white block shadow-sm"></span>
                    </button>
                  </div>

                  {adoConnected && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Organization URL</label>
                        <input
                          type="text"
                          value={adoUrl}
                          onChange={(e) => setAdoUrl(e.target.value)}
                          placeholder="https://dev.azure.com/your-org"
                          className="w-full bg-white border border-slate-200 rounded-md p-2 outline-none font-semibold focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Project Name</label>
                        <input
                          type="text"
                          value={adoProject}
                          onChange={(e) => setAdoProject(e.target.value)}
                          placeholder="e.g. CorePlatform"
                          className="w-full bg-white border border-slate-200 rounded-md p-2 outline-none font-semibold focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Personal Access Token (PAT)</label>
                        <input
                          type="password"
                          value={adoToken}
                          onChange={(e) => setAdoToken(e.target.value)}
                          placeholder="••••••••••••••••••••"
                          className="w-full bg-white border border-slate-200 rounded-md p-2 outline-none font-semibold focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Github Config panel */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <Github className="w-4 h-4 text-slate-800" />
                      GitHub Repository Sync
                    </span>
                    <button
                      type="button"
                      onClick={() => setGithubConnected(!githubConnected)}
                      className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${githubConnected ? 'bg-indigo-650 justify-end' : 'bg-slate-200 justify-start'}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white block shadow-sm"></span>
                    </button>
                  </div>

                  {githubConnected && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">API Endpoint URL</label>
                        <input
                          type="text"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://api.github.com/orgs/your-org"
                          className="w-full bg-white border border-slate-200 rounded-md p-2 outline-none font-semibold focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Access Token (PAT)</label>
                        <input
                          type="password"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                          placeholder="ghp_••••••••••••••••••••"
                          className="w-full bg-white border border-slate-200 rounded-md p-2 outline-none font-semibold focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Jira Config panel */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-blue-600" />
                      Jira Software Board Sync
                    </span>
                    <button
                      type="button"
                      onClick={() => setJiraConnected(!jiraConnected)}
                      className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${jiraConnected ? 'bg-indigo-650 justify-end' : 'bg-slate-200 justify-start'}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white block shadow-sm"></span>
                    </button>
                  </div>

                  {jiraConnected && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Jira Host URL</label>
                        <input
                          type="text"
                          value={jiraUrl}
                          onChange={(e) => setJiraUrl(e.target.value)}
                          placeholder="https://your-org.atlassian.net"
                          className="w-full bg-white border border-slate-200 rounded-md p-2 outline-none font-semibold focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Project Key</label>
                        <input
                          type="text"
                          value={jiraProject}
                          onChange={(e) => setJiraProject(e.target.value)}
                          placeholder="e.g. PROJ"
                          className="w-full bg-white border border-slate-200 rounded-md p-2 outline-none font-semibold focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">API Token / Credential</label>
                        <input
                          type="password"
                          value={jiraToken}
                          onChange={(e) => setJiraToken(e.target.value)}
                          placeholder="••••••••••••••••••••"
                          className="w-full bg-white border border-slate-200 rounded-md p-2 outline-none font-semibold focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Timesheet Config panel */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Timesheet & Hours Sync
                    </span>
                    <button
                      type="button"
                      onClick={() => setTimesheetConnected(!timesheetConnected)}
                      className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${timesheetConnected ? 'bg-indigo-650 justify-end' : 'bg-slate-200 justify-start'}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white block shadow-sm"></span>
                    </button>
                  </div>

                  {timesheetConnected && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Timesheet API Endpoint</label>
                        <input
                          type="text"
                          value={timesheetUrl}
                          onChange={(e) => setTimesheetUrl(e.target.value)}
                          placeholder="https://timesheets.company.com/api"
                          className="w-full bg-white border border-slate-200 rounded-md p-2 outline-none font-semibold focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <button 
                  type="submit"
                  className="bg-indigo-650 hover:bg-indigo-700 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  Save Workspace Configurations
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Third-party API Integrations Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between font-mono">
              <span>Third-party integrations</span>
              <Database className="w-4 h-4 text-indigo-600" />
            </h3>

            <div className="space-y-3.5 text-xs">
              {/* Azure DevOps Connection indicator */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-3xs">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md border ${adoConnected ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-150 text-slate-400 border-slate-200'}`}>
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Azure DevOps</h4>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {adoConnected ? 'Active boards sync' : 'Offline'}
                    </span>
                  </div>
                </div>
                
                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold border ${
                  adoConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-150 text-slate-500 border-slate-200'
                }`}>
                  {adoConnected ? 'LINKED' : 'OFF'}
                </span>
              </div>

              {/* GITHUB INTEGRATION */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-3xs">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md border ${githubConnected ? 'bg-slate-950 text-white border-slate-900' : 'bg-slate-150 text-slate-400 border-slate-200'}`}>
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">GitHub Enterprise</h4>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {githubConnected ? 'Commit and PR stats sync' : 'Offline'}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold border ${
                  githubConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-150 text-slate-500 border-slate-200'
                }`}>
                  {githubConnected ? 'LINKED' : 'OFF'}
                </span>
              </div>

              {/* JIRA INTEGRATION */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-3xs">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md border ${jiraConnected ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-slate-150 text-slate-400 border-slate-200'}`}>
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Jira Software</h4>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {jiraConnected ? 'Sprint boards & tickets' : 'Offline'}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold border ${
                  jiraConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-150 text-slate-500 border-slate-200'
                }`}>
                  {jiraConnected ? 'LINKED' : 'OFF'}
                </span>
              </div>

              {/* TIMESHEETS INTEGRATION */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-3xs">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md border ${timesheetConnected ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-150 text-slate-400 border-slate-200'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Timesheets Tracker</h4>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {timesheetConnected ? 'Logged hours & utilization' : 'Offline'}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold border ${
                  timesheetConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-150 text-slate-500 border-slate-200'
                }`}>
                  {timesheetConnected ? 'LINKED' : 'OFF'}
                </span>
              </div>
            </div>

            <div className="pt-1.5">
              <button 
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="w-full bg-white border border-slate-250 hover:bg-slate-5 text-slate-700 text-xs font-bold py-2 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-650 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Synchronizing files...' : 'Force Global Resync'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between font-mono">
              <span>Alert Notifications Rules</span>
              <Slack className="w-4 h-4 text-emerald-600" />
            </h3>

            <div className="space-y-3 font-sans text-xs">
              <label className="flex items-start gap-2.5 text-slate-650 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={slackAlerts}
                  onChange={(e) => setSlackAlerts(e.target.checked)}
                  className="rounded bg-slate-50 border-slate-300 text-indigo-650 focus:ring-0 cursor-pointer mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Slack Webhook alerts</span>
                  <p className="text-[10px] text-slate-455 mt-0.5 leading-relaxed font-semibold">Publish escalation logs to #pmo-alerts channel when indicators are marked Critical.</p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 text-slate-650 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded bg-slate-50 border-slate-300 text-indigo-650 focus:ring-0 cursor-pointer mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Weekly Newsletter Email</span>
                  <p className="text-[10px] text-slate-455 mt-0.5 leading-relaxed font-semibold">Deliver weekly AI operational report directly to executive mailing list every Friday.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
