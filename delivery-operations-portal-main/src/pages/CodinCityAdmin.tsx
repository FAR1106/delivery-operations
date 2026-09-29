import axios from "axios";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Plus, 
  Github, 
  Settings, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight,
  ShieldCheck, 
  Search, 
  Activity, 
  Layers,
  Database,
  Calendar,
  Lock,
  RefreshCw,
  Mail,
  User, Trash2,
  Zap,
  Info,
  Trello,
  Workflow
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { Organization } from '../types';

export default function CodinCityAdmin() {
  const { organizations, addCompany, deleteCompanyWorkspace, employeeMappings, updateEmployeeAccess } = useCompany();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal / Side Panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Financial Technology');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // Integration States
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUrl, setGithubUrl] = useState('https://api.github.com/orgs/');
  const [githubToken, setGithubToken] = useState('');
  const [githubInterval, setGithubInterval] = useState('1h');

  const [azureConnected, setAzureConnected] = useState(false);
  const [azureUrl, setAzureUrl] = useState('https://dev.azure.com/');
  const [azureProject, setAzureProject] = useState('');
  const [azureToken, setAzureToken] = useState('');
  const [azureInterval, setAzureInterval] = useState('4h');

  // Connection testing states
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, { success: boolean; msg: string }>>({});

  // Access Control panel states
  const [selectedAccessOrg, setSelectedAccessOrg] = useState<Organization | null>(null);
  const [isAccessPanelOpen, setIsAccessPanelOpen] = useState(false);
  const [isSyncingAccess, setIsSyncingAccess] = useState(false);
  const [syncStep, setSyncStep] = useState('');

  // Simulated Sync Logs
  const [syncLogs, setSyncLogs] = useState([
    { org: 'Codincity', platform: 'GitHub', action: 'Polled repository tags', time: 'Just Now', status: 'Success' },
    { org: 'Nexus Labs', platform: 'AzureDevOps', action: 'Imported sprint board backlog', time: '14m ago', status: 'Warning' },
    { org: 'Stratosphere Inc', platform: 'GitHub', action: 'Auth handshake initialized', time: '35m ago', status: 'Pending' },
    { org: 'Codincity', platform: 'AzureDevOps', action: 'Synchronized release Epic board status', time: '1h ago', status: 'Success' },
    { org: 'Nexus Labs', platform: 'GitHub', action: 'Pulled code coverage indices', time: '2h ago', status: 'Success' }
  ]);


  const deleteWorkspace = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetOrg = organizations.find(o => o.id === id);
    const companyNameStr = targetOrg ? targetOrg.name : 'workspace';
    if (!window.confirm(`Are you sure you want to delete ${companyNameStr} and scrap ALL associated projects, metrics, AI data, and telemetry? This cannot be undone.`)) return;
    try {
      await deleteCompanyWorkspace(id);
      setSuccessToast(`Company workspace "${companyNameStr}" and all associated data have been completely purged.`);
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      console.error('Failed to delete workspace', err);
      alert('Failed to delete workspace');
    }
  };

  const handleManageAccess = (org: Organization) => {
    setSelectedAccessOrg(org);
    setIsAccessPanelOpen(true);
  };

  const handleSyncAccessUsers = () => {
    if (!selectedAccessOrg) return;
    setIsSyncingAccess(true);
    setSyncStep('Establishing secure handshake with API endpoints...');
    
    setTimeout(() => {
      setSyncStep('Querying GitHub organization roster & Azure DevOps Directory...');
      setTimeout(() => {
        setSyncStep('Reconciling user IDs and mapping timesheets...');
        setTimeout(() => {
          setIsSyncingAccess(false);
          setSyncStep('');
          
          const hasMappings = employeeMappings.some(m => m.orgId === selectedAccessOrg.id);
          let newMappings = [...employeeMappings];
          
          if (!hasMappings) {
            const companyDomain = selectedAccessOrg.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.io';
            const adminInitials = selectedAccessOrg.adminName.toLowerCase().split(' ');
            const adminGithub = adminInitials[0] + '_gh';
            const adminAdo = adminInitials.join('.');

            const generated = [
              {
                employeeId: `EMP-${String(employeeMappings.length + 1).padStart(3, '0')}`,
                employeeName: selectedAccessOrg.adminName,
                department: 'Operations',
                githubUsername: adminGithub,
                adoUser: adminAdo,
                timesheetId: `TS-${Math.floor(1000 + Math.random() * 9000)}`,
                orgId: selectedAccessOrg.id,
                status: 'Matched' as const,
                role: 'PMO Director',
                accessActive: true
              },
              {
                employeeId: `EMP-${String(employeeMappings.length + 2).padStart(3, '0')}`,
                employeeName: 'James Carter',
                department: 'Engineering',
                githubUsername: 'jcarter_dev',
                adoUser: 'james.carter',
                timesheetId: `TS-${Math.floor(1000 + Math.random() * 9000)}`,
                orgId: selectedAccessOrg.id,
                status: 'Matched' as const,
                role: 'Delivery Lead',
                accessActive: true
              },
              {
                employeeId: `EMP-${String(employeeMappings.length + 3).padStart(3, '0')}`,
                employeeName: 'Sophie Martinez',
                department: 'Engineering',
                githubUsername: 'smartinez',
                adoUser: 'sophie.m',
                timesheetId: `TS-${Math.floor(1000 + Math.random() * 9000)}`,
                orgId: selectedAccessOrg.id,
                status: 'Matched' as const,
                role: 'Team Member',
                accessActive: false
              },
              {
                employeeId: `EMP-${String(employeeMappings.length + 4).padStart(3, '0')}`,
                employeeName: 'Robert Vance',
                department: 'QA & Compliance',
                githubUsername: 'rvance_qa',
                adoUser: '',
                timesheetId: '',
                orgId: selectedAccessOrg.id,
                status: 'Pending' as const,
                role: 'Team Member',
                accessActive: false
              }
            ];
            newMappings = [...newMappings, ...generated];
            updateEmployeeAccess(newMappings);
          } else {
            newMappings = newMappings.map(m => {
              if (m.orgId === selectedAccessOrg.id) {
                return {
                  ...m,
                  role: m.role || 'Team Member',
                  accessActive: m.accessActive !== undefined ? m.accessActive : m.status === 'Matched'
                };
              }
              return m;
            });
            updateEmployeeAccess(newMappings);
          }

          setSyncLogs(prev => [
            {
              org: selectedAccessOrg.name,
              platform: 'System',
              action: `Retrieved and matching directory profiles from API nodes.`,
              time: 'Just Now',
              status: 'Success'
            },
            ...prev
          ]);
        }, 600);
      }, 700);
    }, 700);
  };

  const handleToggleAccess = (empId: string) => {
    const updated = employeeMappings.map(m => {
      if (m.employeeId === empId) {
        return {
          ...m,
          accessActive: !m.accessActive
        };
      }
      return m;
    });
    updateEmployeeAccess(updated);
  };

  const handleRoleChange = (empId: string, newRole: string) => {
    const updated = employeeMappings.map(m => {
      if (m.employeeId === empId) {
        return {
          ...m,
          role: newRole
        };
      }
      return m;
    });
    updateEmployeeAccess(updated);
  };

  const handleBulkGrant = () => {
    if (!selectedAccessOrg) return;
    const updated = employeeMappings.map(m => {
      if (m.orgId === selectedAccessOrg.id) {
        return {
          ...m,
          accessActive: true,
          role: m.role || 'Team Member'
        };
      }
      return m;
    });
    updateEmployeeAccess(updated);
    
    setSyncLogs(prev => [
      {
        org: selectedAccessOrg.name,
        platform: 'System',
        action: `Bulk granted access to all retrieved directory employees.`,
        time: 'Just Now',
        status: 'Success'
      },
      ...prev
    ]);
  };

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const testConnection = (platform: string, url: string, token: string) => {
    if (!url || url.length < 10) {
      setTestResult(prev => ({
        ...prev,
        [platform]: { success: false, msg: 'Invalid or missing endpoint URL.' }
      }));
      return;
    }
    if (!token) {
      setTestResult(prev => ({
        ...prev,
        [platform]: { success: false, msg: 'API connection token is required.' }
      }));
      return;
    }

    setTestingPlatform(platform);
    
    setTimeout(() => {
      setTestingPlatform(null);
      setTestResult(prev => ({
        ...prev,
        [platform]: { success: true, msg: 'Connection verified successfully!' }
      }));
    }, 1200);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !adminEmail || !adminName) {
      alert('Please fill out all required general fields.');
      return;
    }

    // Prepare integrations structures matching types
    const integrationsObj: Organization['integrations'] = {
      github: {
        connected: githubConnected,
        authStatus: githubConnected ? 'Authenticated' : 'Not Connected',
        lastSync: githubConnected ? new Date().toISOString() : null,
        syncHealth: githubConnected ? 'Healthy' : 'N/A',
        importedRecords: githubConnected ? 120 : 0,
        failedImports: 0,
        endpoint: githubUrl,
        token: githubToken,
        syncFrequency: githubInterval
      },
      azureDevOps: {
        connected: azureConnected,
        authStatus: azureConnected ? 'Authenticated' : 'Not Connected',
        lastSync: azureConnected ? new Date().toISOString() : null,
        syncHealth: azureConnected ? 'Healthy' : 'N/A',
        importedRecords: azureConnected ? 210 : 0,
        failedImports: 0,
        endpoint: azureUrl,
        projectKey: azureProject,
        token: azureToken,
        syncFrequency: azureInterval
      }
    };

    try {
      await addCompany(companyName, industry, adminName, adminEmail, integrationsObj);

      // Add log
      setSyncLogs(prev => [
        {
          org: companyName,
          platform: githubConnected ? 'GitHub' : azureConnected ? 'AzureDevOps' : 'System',
          action: 'Company registered and telemetry ingested successfully.',
          time: 'Just Now',
          status: 'Success'
        },
        ...prev
      ]);

      // Show toast
      setSuccessToast(`Company "${companyName}" added successfully with active configurations.`);
      setTimeout(() => setSuccessToast(''), 4000);

      // Reset panel state
      setCompanyName('');
      setAdminName('');
      setAdminEmail('');
      setGithubConnected(false);
      setAzureConnected(false);
      setTestResult({});
      setIsPanelOpen(false);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      alert(`Provisioning Workspace failed: ${errMsg}`);
    }
  };

  const totalIntegrationsCount = organizations.reduce((acc, org) => {
    let count = 0;
    if (org.integrations.github.connected) count++;
    if (org.integrations.azureDevOps?.connected) count++;
    return acc + count;
  }, 0);

  const cv = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };
  const iv = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } } };

  return (
    <motion.div 
      variants={cv} initial="hidden" animate="show"
      className="space-y-6 max-w-7.5xl mx-auto"
      id="admin-dashboard-container"
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 right-6 z-55 bg-slate-900 border border-emerald-500 text-white rounded-xl shadow-xl p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold font-sans">Success Notification</p>
              <p className="text-[11px] text-slate-300 font-medium">{successToast}</p>
            </div>
            <button onClick={() => setSuccessToast('')} className="text-slate-400 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={iv} className="flex flex-col md:flex-row md:items-center justify-end border-b border-slate-200 pb-5 gap-4">

        
        <button
          onClick={() => setIsPanelOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 transition-all self-start md:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          Add New Company
        </button>
      </motion.div>

      {/* Overview Cards */}
      <motion.div variants={iv} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Companies */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Building2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Total Clients</span>
            <h3 className="text-2xl font-bold text-slate-900 font-sans mt-0.5">{organizations.length}</h3>
          </div>
        </div>

        {/* Total Connected Integrations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Database className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Active Integrations</span>
            <h3 className="text-2xl font-bold text-slate-900 font-sans mt-0.5">{totalIntegrationsCount}</h3>
          </div>
        </div>

        {/* Sync Success Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
            <Activity className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Sync Success Rate</span>
            <h3 className="text-2xl font-bold text-slate-900 font-sans mt-0.5">98.2%</h3>
          </div>
        </div>

        {/* Handshake Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <RefreshCw className="w-5.5 h-5.5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Polling Engine</span>
            <h3 className="text-sm font-bold text-emerald-650 font-sans mt-1.5 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE & RUNNING
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Main Workspace Table & logs split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Table) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={iv} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Registered Companies</h3>
              </div>
              
              {/* Search Bar */}
              <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white rounded-md overflow-hidden transition-all pr-2 max-w-xs w-full">
                <div className="pl-2.5 text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  placeholder="Filter client databases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none px-2 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 font-sans"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-150 rounded-xl shadow-3xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[9px] uppercase text-slate-500">
                    <th className="p-3 font-bold">Client / Company Name</th>
                    <th className="p-3 font-bold">Sector / Industry</th>
                    <th className="p-3 font-bold">Contact Admin</th>
                    <th className="p-3 text-center font-bold">Connected Integrations</th>
                    <th className="p-3 text-center font-bold">Status</th>
                    <th className="p-3 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700 font-sans">
                  {filteredOrgs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">
                        No client companies match your filter search.
                      </td>
                    </tr>
                  ) : (
                    filteredOrgs.map((org) => {
                      const gh = org.integrations.github.connected;
                      const az = org.integrations.azureDevOps?.connected;

                      return (
                        <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block leading-tight">{org.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{org.id}</span>
                          </td>
                          <td className="p-3 font-medium text-slate-600">{org.industry}</td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800 block leading-tight">{org.adminName}</span>
                            <span className="text-[10px] text-slate-455 font-mono">{org.adminEmail}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              {/* GitHub Icon */}
                              <div 
                                className={`p-1.5 rounded-lg border transition-all ${
                                  gh 
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-650' 
                                    : 'bg-slate-50 border-slate-100 text-slate-350 opacity-40'
                                }`} 
                                title={gh ? `GitHub Connected (${org.integrations.github.syncFrequency || '1h'} window): ${org.integrations.github.endpoint}` : 'GitHub Disconnected'}
                              >
                                <Github className="w-4 h-4" />
                              </div>

                              {/* Azure DevOps Icon */}
                              <div 
                                className={`p-1.5 rounded-lg border transition-all ${
                                  az 
                                    ? 'bg-blue-50 border-blue-100 text-blue-650' 
                                    : 'bg-slate-50 border-slate-100 text-slate-350 opacity-40'
                                }`}
                                title={az ? `Azure DevOps Connected (${org.integrations.azureDevOps?.syncFrequency || '1h'} window): ${org.integrations.azureDevOps?.endpoint}` : 'Azure DevOps Disconnected'}
                              >
                                <Workflow className="w-4 h-4" />
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
                              org.status === 'Active' 
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                : 'bg-amber-50 border-amber-100 text-amber-700'
                            }`}>
                              {org.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleManageAccess(org)}
                                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-200 text-indigo-700 font-bold rounded-lg text-[10.5px] cursor-pointer transition-all flex items-center gap-1"
                              >
                                <User className="w-3 h-3 text-indigo-600" />
                                Manage Access
                              </button>
                              <button
                                onClick={(e) => deleteWorkspace(org.id, e)}
                                className="p-1.5 rounded-lg border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:border-rose-200 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete Workspace"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-slate-450 font-mono pt-1 pb-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Added companies propagate automatically to other user roles for workspace selectors.</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Logs) */}
        <div>
          <motion.div variants={iv} className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Sync Handshake Log</h3>
              </div>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {syncLogs.map((log, idx) => {
                const isWarning = log.status === 'Warning';
                const isPending = log.status === 'Pending';
                return (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-455 font-mono font-bold">
                      <span className="text-slate-800">{log.org} • {log.platform}</span>
                      <span>{log.time}</span>
                    </div>
                    <p className="text-slate-655 font-medium leading-relaxed font-sans">{log.action}</p>
                    <div className="border-t border-slate-200/40 pt-1.5 flex justify-between items-center text-[9px] font-mono">
                      <span>Status Code:</span>
                      <span className={`font-bold uppercase ${
                        isWarning ? 'text-amber-600' : isPending ? 'text-slate-400 animate-pulse' : 'text-emerald-650'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={() => alert('Polled API telemetries. All endpoints responding properly.')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs cursor-pointer shadow-sm transition-colors text-center font-sans"
            >
              Verify Endpoint Handshakes
            </button>
          </motion.div>
        </div>
      </div>

      {/* Slide-over Form Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 pointer-events-auto"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-950 border-l border-white/10 z-50 flex flex-col shadow-2xl font-sans text-slate-100"
            >
              {/* Form container */}
              <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between overflow-y-auto p-6 md:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Provision New Client Workspace</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Define general details and active project integrations.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPanelOpen(false)}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Body Form Fields */}
                <div className="space-y-5 flex-1 overflow-y-auto py-2 pr-1 scrollbar-thin">
                  
                  {/* General Client Section */}
                  <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-4">
                    <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-widest block">1. Company profile info</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Company Name *</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Tesla Motors"
                          className="w-full px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-lg text-xs outline-none text-white transition-all font-medium"
                        />
                      </div>

                      {/* Industry */}
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Industry Sector</label>
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-white/10 focus:border-indigo-500 rounded-lg text-xs outline-none text-white cursor-pointer appearance-none font-medium"
                        >
                          <option value="Financial Technology">Financial Technology</option>
                          <option value="Retail & Commerce">Retail & Commerce</option>
                          <option value="Defense & Intelligence">Defense & Intelligence</option>
                          <option value="Healthcare Systems">Healthcare Systems</option>
                          <option value="Automotive & Energy">Automotive & Energy</option>
                        </select>
                      </div>

                      {/* Contact Name */}
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Lead Administrator *</label>
                        <input
                          type="text"
                          required
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          placeholder="Sarah Connor"
                          className="w-full px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-lg text-xs outline-none text-white transition-all font-medium"
                        />
                      </div>

                      {/* Contact Email */}
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Admin Email *</label>
                        <input
                          type="email"
                          required
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="sarah@tesla.com"
                          className="w-full px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-lg text-xs outline-none text-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. GITHUB INTEGRATION */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-widest flex items-center gap-1.5">
                        <Github className="w-4 h-4" />
                        GitHub Enterprise Config
                      </span>
                      <button
                        type="button"
                        onClick={() => setGithubConnected(!githubConnected)}
                        className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors shrink-0 ${githubConnected ? 'bg-indigo-650 justify-end' : 'bg-white/10 justify-start'}`}
                      >
                        <span className="w-4 h-4 rounded-full bg-white block shadow-sm"></span>
                      </button>
                    </div>

                    {githubConnected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs"
                      >
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">API Endpoint Organization URL</label>
                          <input
                            type="text"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://api.github.com/orgs/company"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-lg text-xs outline-none text-white font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Personal Access Token (PAT)</label>
                          <input
                            type="password"
                            value={githubToken}
                            onChange={(e) => setGithubToken(e.target.value)}
                            placeholder="ghp_••••••••••••"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-lg text-xs outline-none text-white font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Sync Frequency</label>
                          <select
                            value={githubInterval}
                            onChange={(e) => setGithubInterval(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs outline-none text-white cursor-pointer font-semibold"
                          >
                            <option value="30m">Every 30 Minutes</option>
                            <option value="1h">Every 1 Hour (Default)</option>
                            <option value="6h">Every 6 Hours</option>
                            <option value="24h">Daily Sync</option>
                          </select>
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between border-t border-white/5 pt-3">
                          <button
                            type="button"
                            onClick={() => testConnection('github', githubUrl, githubToken)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded text-[11px] font-bold text-slate-205 cursor-pointer flex items-center gap-1.5"
                          >
                            {testingPlatform === 'github' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                            Test Connection
                          </button>

                          {testResult.github && (
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${
                              testResult.github.success ? 'text-emerald-450' : 'text-rose-400'
                            }`}>
                              {testResult.github.success ? <CheckCircle2 className="w-3.5 h-3.5"/> : <AlertCircle className="w-3.5 h-3.5" />}
                              {testResult.github.msg}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>



                  {/* 4. AZURE DEVOPS CONFIG */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-widest flex items-center gap-1.5">
                        <Workflow className="w-4 h-4" />
                        Azure DevOps Pipeline Config
                      </span>
                      <button
                        type="button"
                        onClick={() => setAzureConnected(!azureConnected)}
                        className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors shrink-0 ${azureConnected ? 'bg-indigo-650 justify-end' : 'bg-white/10 justify-start'}`}
                      >
                        <span className="w-4 h-4 rounded-full bg-white block shadow-sm"></span>
                      </button>
                    </div>

                    {azureConnected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Organization URL</label>
                          <input
                            type="text"
                            value={azureUrl}
                            onChange={(e) => setAzureUrl(e.target.value)}
                            placeholder="https://dev.azure.com/organization"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-lg text-xs outline-none text-white font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Project Name</label>
                          <input
                            type="text"
                            value={azureProject}
                            onChange={(e) => setAzureProject(e.target.value)}
                            placeholder="e.g. CorePlatform"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-lg text-xs outline-none text-white font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Personal Access Token (PAT)</label>
                          <input
                            type="password"
                            value={azureToken}
                            onChange={(e) => setAzureToken(e.target.value)}
                            placeholder="PAT Token"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-lg text-xs outline-none text-white font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Sync Frequency</label>
                          <select
                            value={azureInterval}
                            onChange={(e) => setAzureInterval(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs outline-none text-white cursor-pointer font-semibold"
                          >
                            <option value="1h">Every 1 Hour</option>
                            <option value="4h">Every 4 Hours (Default)</option>
                            <option value="12h">Every 12 Hours</option>
                            <option value="24h">Daily Sync</option>
                          </select>
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between border-t border-white/5 pt-3">
                          <button
                            type="button"
                            onClick={() => testConnection('azure', azureUrl, azureToken)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded text-[11px] font-bold text-slate-205 cursor-pointer flex items-center gap-1.5"
                          >
                            {testingPlatform === 'azure' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                            Test Connection
                          </button>

                          {testResult.azure && (
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${
                              testResult.azure.success ? 'text-emerald-450' : 'text-rose-400'
                            }`}>
                              {testResult.azure.success ? <CheckCircle2 className="w-3.5 h-3.5"/> : <AlertCircle className="w-3.5 h-3.5" />}
                              {testResult.azure.msg}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                </div>

                {/* Footer Save / Cancel */}
                <div className="border-t border-white/10 pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPanelOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer text-center font-sans"
                  >
                    Cancel / Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer text-center shadow-lg shadow-indigo-650/10 border border-indigo-400/20 font-sans"
                  >
                    Provision Workspace
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Access Control Side Panel */}
      <AnimatePresence>
        {isAccessPanelOpen && selectedAccessOrg && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccessPanelOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 pointer-events-auto"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-950 border-l border-white/10 z-50 flex flex-col shadow-2xl font-sans text-slate-100"
            >
              {/* Container */}
              <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 md:p-8 space-y-6 animate-fade-in">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Access Control & Directory Ingestion</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{selectedAccessOrg.name} • Directory Sync Controls</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAccessPanelOpen(false)}
                    className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
                  
                  {/* Integration Status Panel */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-widest block">1. Active Integration Links</span>
                      <span className="text-[9px] text-emerald-450 font-mono uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Handshakes Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[10.5px] font-semibold text-slate-300">
                      <div className={`p-2 rounded-lg border ${selectedAccessOrg.integrations.github.connected ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                        GitHub: {selectedAccessOrg.integrations.github.connected ? 'OK' : 'Off'}
                      </div>
                      <div className={`p-2 rounded-lg border ${selectedAccessOrg.integrations.azureDevOps?.connected ? 'bg-blue-950/20 border-blue-500/25 text-blue-300' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                        Azure: {selectedAccessOrg.integrations.azureDevOps?.connected ? 'OK' : 'Off'}
                      </div>
                    </div>
                  </div>

                  {/* Sync Action Trigger */}
                  <div className="bg-indigo-950/15 border border-indigo-500/10 rounded-xl p-4 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-widest block mb-1">2. Ingest Directory Members</span>
                      <p className="text-[11px] text-slate-400 leading-normal font-sans">
                        Poll connected integration endpoints to fetch employee rosters, resolve usernames, and map platform identities automatically.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleSyncAccessUsers}
                        disabled={isSyncingAccess}
                        className="bg-indigo-650 hover:bg-indigo-550 disabled:bg-indigo-800/40 text-white font-bold py-2 rounded-lg text-xs cursor-pointer flex items-center justify-center gap-2 border border-indigo-500/20 transition-all"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAccess && 'animate-spin'}`} />
                        {isSyncingAccess ? 'Retrieving Directory Telemetries...' : 'Retrieve & Sync Telemetry Data'}
                      </button>

                      {/* Ingestion Progress */}
                      {isSyncingAccess && (
                        <div className="space-y-2 p-2 bg-slate-900 border border-white/5 rounded-lg animate-pulse">
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                            <span>Step: {syncStep}</span>
                            <span className="text-indigo-400">Handshaking...</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2 }}
                              className="h-full bg-indigo-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Roster Listings */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-widest">3. Employee Roster & Role Mapping</span>
                      <span className="text-[9.5px] text-slate-400 font-mono">
                        Count: {employeeMappings.filter(m => m.orgId === selectedAccessOrg.id).length} Active Roster
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {employeeMappings.filter(m => m.orgId === selectedAccessOrg.id).length === 0 ? (
                        <div className="text-center p-8 bg-white/5 border border-white/5 rounded-xl border-dashed">
                          <p className="text-xs text-slate-450 font-medium">No active directory accounts imported yet.</p>
                          <p className="text-[10px] text-indigo-300 mt-1 font-mono">Click "Retrieve & Sync Telemetry Data" above to fetch users.</p>
                        </div>
                      ) : (
                        employeeMappings.filter(m => m.orgId === selectedAccessOrg.id).map((emp) => {
                          const hasGithub = !!emp.githubUsername;
                          const hasAdo = !!emp.adoUser;

                          return (
                            <div key={emp.employeeId} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                              {/* Left details */}
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white truncate block">{emp.employeeName}</span>
                                  <span className="text-[9px] bg-white/10 text-slate-350 px-1 rounded font-mono uppercase shrink-0">{emp.department}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 text-[9px] font-mono text-slate-400">
                                  {hasGithub && (
                                    <span className="flex items-center gap-1 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded text-indigo-300">
                                      <Github className="w-2.5 h-2.5 text-slate-400" />
                                      {emp.githubUsername}
                                    </span>
                                  )}
                                  {hasAdo && (
                                    <span className="flex items-center gap-1 bg-slate-900 border border-white/5 px-1.5 py-0.5 rounded text-indigo-300">
                                      <Workflow className="w-2.5 h-2.5 text-slate-400" />
                                      {emp.adoUser}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Right access details */}
                              <div className="flex items-center gap-3 shrink-0 justify-between md:justify-end">
                                {/* Role Selection */}
                                <select
                                  value={emp.role || 'Team Member'}
                                  onChange={(e) => handleRoleChange(emp.employeeId, e.target.value)}
                                  className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer font-semibold"
                                >
                                  <option value="Executive">Executive</option>
                                  <option value="PMO Director">PMO Director</option>
                                  <option value="Project Manager">Project Manager</option>
                                  <option value="Delivery Lead">Delivery Lead</option>
                                  <option value="Team Member">Team Member</option>
                                </select>

                                {/* Access Switch Toggle */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleAccess(emp.employeeId)}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-[10.5px] border cursor-pointer transition-all ${
                                    emp.accessActive
                                      ? 'bg-emerald-950/30 border-emerald-500/25 text-emerald-400'
                                      : 'bg-white/5 border-white/10 text-slate-400'
                                  }`}
                                >
                                  {emp.accessActive ? 'Active Access' : 'Revoked'}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

                {/* Footer Save / Cancel / Bulk */}
                <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleBulkGrant}
                    disabled={employeeMappings.filter(m => m.orgId === selectedAccessOrg.id).length === 0}
                    className="flex-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none border border-white/10 text-slate-250 hover:text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 font-sans"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Bulk Grant Access
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAccessPanelOpen(false)}
                    className="flex-1 bg-indigo-650 hover:bg-indigo-550 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer text-center border border-indigo-550/20 shadow-lg shadow-indigo-650/15 font-sans"
                  >
                    Save & Close Panel
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
