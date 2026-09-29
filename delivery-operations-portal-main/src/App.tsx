/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Activity,
  Layers,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Users,
  Scale,
  Settings as SettingsIcon,
  Bell,
  ChevronDown,
  Calendar,
  X,
  RefreshCw,
  Sparkles,
  Home,
  LogOut,
  TrendingUp,
  Search,
  Zap,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

// Context
import { CompanyProvider, useCompany, CompanyName } from './context/CompanyContext';
import OnboardingTour, { TourStep } from './components/OnboardingTour';
import CompanyTransition from './components/CompanyTransition';

// Page Imports
import LoginPage from './pages/LoginPage';
import CodinCityAdmin from './pages/CodinCityAdmin';

// Page Imports
import CommandCenter from './pages/CommandCenter';
import PortfolioOverview from './pages/PortfolioOverview';
import Projects from './pages/Projects';
import DeliveryHealth from './pages/DeliveryHealth';
import RiskCenter from './pages/RiskCenter';
import ActiveAlertsHub from './pages/ActiveAlertsHub';
import WeeklyReports from './pages/WeeklyReports';
import Settings from './pages/Settings';
import ProjectWorkspace from './pages/ProjectWorkspace';
import DeliveryCopilot from './components/DeliveryCopilot';
import AIIntelligenceHub from './pages/AIIntelligenceHub';
import ExecutiveAnalytics from './pages/ExecutiveAnalytics';
import AccessManagement from './pages/AccessManagement';

export default function App() {
  return (
    <CompanyProvider>
      <AppContent />
    </CompanyProvider>
  );
}

export type UserRole = 'Executive' | 'PMO Director' | 'Project Manager' | 'Delivery Lead' | 'Team Member' | 'Codin City Admin';

const roleProfiles: Record<UserRole, { name: string; initials: string; title: string }> = {
  'Executive': { name: 'Sarah Jenkins', initials: 'SJ', title: 'Executive • Board' },
  'PMO Director': { name: 'Catherine Vance', initials: 'CV', title: 'PMO Director • C-Suite' },
  'Project Manager': { name: 'David Miller', initials: 'DM', title: 'Project Manager • Operations' },
  'Delivery Lead': { name: 'Alex Rivera', initials: 'AR', title: 'Delivery Lead • Engineering' },
  'Team Member': { name: 'Emma Chen', initials: 'EC', title: 'Software Engineer • Core Team' },
  'Codin City Admin': { name: 'Admin Administrator', initials: 'CC', title: 'Codin City • System Admin' }
};

const roleNavPermissions: Record<UserRole, string[]> = {
  'Executive': ['home', 'portfolio-overview', 'projects', 'delivery-health', 'risk-center', 'weekly-reports'],
  'PMO Director': ['home', 'portfolio-overview', 'projects', 'delivery-health', 'risk-center', 'weekly-reports'],
  'Project Manager': ['home', 'portfolio-overview', 'projects', 'delivery-health', 'risk-center', 'weekly-reports'],
  'Delivery Lead': ['home', 'portfolio-overview', 'projects', 'delivery-health', 'risk-center', 'weekly-reports'],
  'Team Member': ['home', 'projects', 'weekly-reports'],
  'Codin City Admin': ['admin-dashboard', 'settings']
};

function AppContent() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('di_logged_in') === 'true';
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('di_user_role') as UserRole) || 'PMO Director';
  });

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('di_logged_in', 'true');
    localStorage.setItem('di_user_role', role);
    if (role === 'Codin City Admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('di_logged_in');
    localStorage.removeItem('di_user_role');
    setCurrentPage('home');
  };

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const role = localStorage.getItem('di_user_role');
    return role === 'Codin City Admin' ? 'admin-dashboard' : 'home';
  });

  React.useEffect(() => {
    if (isLoggedIn) {
      const allowed = roleNavPermissions[userRole] || [];
      const isWorkspace = currentPage.startsWith('project-workspace-');
      const isAIHub = currentPage.startsWith('ai-intelligence-hub');
      const basePage = isWorkspace ? 'projects' : isAIHub ? 'ai-intelligence-hub' : currentPage;
      if (!allowed.includes(basePage)) {
        setCurrentPage('home');
      }
    }
  }, [userRole, isLoggedIn]);

  // Weekly reports select project logic
  const [selectedWeeklyProjectId, setSelectedWeeklyProjectId] = useState<string>('');

  // Notifications Popover State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState<string>('');

  const { selectedCompany, setSelectedCompany, companies, projects, risks } = useCompany();

  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTargetCompany, setTransitionTargetCompany] = useState<CompanyName | null>(null);

  // Onboarding Tour State
  const [isTourOpen, setIsTourOpen] = useState(() => {
    return localStorage.getItem('di_tour_completed') !== 'true';
  });

  const tourSteps: TourStep[] = [
    {
      title: 'Welcome to Delivery Intel',
      content: 'The centralized portfolio management platform. Monitor organizations, manage risks, and oversee delivery health from one place.',
      position: 'center'
    },
    {
      targetId: 'company-selector',
      title: 'Company Workspace',
      content: 'Every company has its own independent portfolio. Changing this updates the entire dashboard instantly.',
      position: 'bottom'
    },
    {
      targetId: 'left-sidebar',
      title: 'Navigation Center',
      content: 'Access Operations, AI tools, and Administration modules. Your available modules depend on your role.',
      position: 'right'
    },
    {
      targetId: 'portfolio-overview-nav',
      title: 'Portfolio Overview',
      content: 'Monitor aggregate Health Score, which is calculated using Sprint Velocity, Resource Utilization, and Risk Index.',
      position: 'right'
    },
    {
      targetId: 'ai-copilot-btn',
      title: 'AI Copilot',
      content: 'Ask natural language questions about your portfolio. The Copilot automatically uses the currently selected company as its working context.',
      position: 'bottom'
    },
    {
      targetId: 'exec-analytics-nav',
      title: 'Executive Analytics',
      content: 'Access high-level KPIs and comprehensive charts for C-level reporting and strategic alignment.',
      position: 'right'
    }
  ];

  const handleCompanyChange = (newCompany: string) => {
    if (newCompany !== selectedCompany) {
      setTransitionTargetCompany(newCompany as CompanyName);
      setIsTransitioning(true);
    }
  };

  const completeCompanyTransition = () => {
    if (transitionTargetCompany) {
      setSelectedCompany(transitionTargetCompany);
      setIsTransitioning(false);
      setTransitionTargetCompany(null);
    }
  };

  // Active notifications matching alerts hub examples
  const activeAlerts = [
    { title: 'Project Sentinel Critical', text: 'AWS environment provisioning blocked by compliance audit.', time: '10m ago', type: 'critical' },
    { title: 'Chronos Mainframe Shortage', text: 'Senior developer hours exceeded target threshold.', time: '2h ago', type: 'warning' },
    { title: 'Aegis Platform Tested', text: 'Median transaction response calculated at 0.82ms.', time: 'Yesterday', type: 'info' }
  ];

  // Map Pages to Components
  const renderActivePage = () => {
    if (currentPage.startsWith('project-workspace-')) {
      const projId = currentPage.replace('project-workspace-', '');
      return (
        <ProjectWorkspace
          projectId={projId}
          onNavigate={(page) => setCurrentPage(page)}
        />
      );
    }

    if (currentPage.startsWith('ai-intelligence-hub')) {
      const tab = currentPage.replace('ai-intelligence-hub-', '');
      const activeTab = tab === 'ai-intelligence-hub' ? 'knowledge' : tab;
      return <AIIntelligenceHub initialTab={activeTab as any} />;
    }

    switch (currentPage) {
      case 'home':
        return (
          <CommandCenter
            onNavigate={(page) => setCurrentPage(page)}
            onLaunchCopilot={(query?: string) => {
              if (query) {
                setCopilotQuery(query);
              }
              setShowCopilot(true);
            }}
          />
        );
      case 'portfolio-overview':
        return (
          <PortfolioOverview
            onNavigate={(page) => setCurrentPage(page)}
          />
        );
      case 'projects':
        return (
          <Projects
            projects={projects}
            onNavigate={(page) => setCurrentPage(page)}
            onSelectProjectReports={(projId) => setSelectedWeeklyProjectId(projId)}
          />
        );
      case 'delivery-health':
        return <DeliveryHealth projects={projects} />;
      case 'risk-center':
        return <RiskCenter risks={risks} onRiskUpdate={() => { }} />;
      case 'weekly-reports':
        return (
          <WeeklyReports
            selectedProjectId={selectedWeeklyProjectId}
            onClearProjectSelection={() => setSelectedWeeklyProjectId('')}
            projects={projects}
          />
        );
      case 'admin-dashboard':
        return <CodinCityAdmin />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <CommandCenter
            onNavigate={(page) => setCurrentPage(page)}
            onLaunchCopilot={(query?: string) => {
              if (query) {
                setCopilotQuery(query);
              }
              setShowCopilot(true);
            }}
          />
        );
    }
  };

  // Navigations metadata representing Left Sidebar listings
  const portfolioNavigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'portfolio-overview', label: 'Portfolio Overview', icon: Activity },
    { id: 'projects', label: 'Projects Inventory', icon: Layers },
    { id: 'delivery-health', label: 'Delivery Health', icon: ShieldCheck },
    { id: 'risk-center', label: 'Risk Command Center', icon: AlertTriangle, badge: risks.filter(r => r.status === 'Open').length },
    { id: 'weekly-reports', label: 'Weekly AI Reports', icon: FileText },
    { id: 'admin-dashboard', label: 'Admin Console', icon: Building2 },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon }
  ];

  const filteredNavigationItems = portfolioNavigationItems.filter(item =>
    roleNavPermissions[userRole]?.includes(item.id)
  );

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        <motion.div
          key="login-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full"
        >
          <LoginPage onLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div
          key="platform-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="min-h-screen w-full bg-slate-50 flex text-slate-800"
          id="platform-layout"
        >
          {/* LEFT SIDEBAR - Mature enterprise look */}
          <aside className="w-68 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex" id="left-sidebar">
            <div>
              {/* Logo Brand Header */}
              <div className="h-16 px-5 border-b border-slate-200 flex items-center gap-2.5">
                <div className="w-7 h-7 bg-indigo-650 rounded flex items-center justify-center text-white font-mono font-bold text-sm tracking-tighter shadow-sm">
                  DO
                </div>
                <div>
                  <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider block leading-none font-sans">Delivery Intel</span>
                  <span className="text-[9px] text-slate-505 uppercase tracking-widest font-mono select-none block mt-1">OPERATIONAL CORE</span>
                </div>
              </div>

              {/* Enterprise Workspace Picker switcher mockup */}
              <div className="px-3.5 py-4 border-b border-slate-200">
                <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-indigo-50 text-indigo-600 rounded">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-900 block truncate leading-tight">Codincity PMO</span>
                      <span className="text-[9px] text-slate-500 font-mono">IDOPHA Hub</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="p-3 space-y-4 overflow-y-auto">
                {(() => {
                  const groups = [
                    { title: 'Operations', items: ['home', 'portfolio-overview', 'projects', 'delivery-health', 'risk-center', 'weekly-reports', 'resource-utilization', 'settings', 'admin-dashboard'] }
                  ];

                  return groups.map(group => {
                    const groupItems = filteredNavigationItems.filter(item => group.items.includes(item.id));
                    if (groupItems.length === 0) return null;

                    return (
                      <div key={group.title}>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block mb-1.5 font-sans">{group.title}</span>
                        <div className="space-y-0.5">
                          {groupItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id ||
                              (item.id === 'projects' && currentPage.startsWith('project-workspace-'));
                            return (
                              <motion.button
                                key={item.id}
                                id={item.id === 'portfolio-overview' ? 'portfolio-overview-nav' : item.id === 'executive-analytics' ? 'exec-analytics-nav' : undefined}
                                onClick={() => setCurrentPage(item.id)}
                                whileTap={{ scale: 0.99 }}
                                transition={{ duration: 0.12, ease: 'easeOut' }}
                                className={`nav-item w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold cursor-pointer border ${isActive
                                    ? 'bg-indigo-50 text-indigo-750 border-indigo-100'
                                    : 'border-transparent text-slate-655 hover:text-slate-900 hover:bg-slate-50'
                                  }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Icon className={`w-4 h-4 transition-colors duration-[120ms] ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge && item.badge > 0 ? (
                                  <motion.span
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    className="bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold"
                                  >
                                    {item.badge}
                                  </motion.span>
                                ) : null}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </nav>
            </div>

            {/* User Identity context segment */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-750 font-bold flex items-center justify-center font-mono text-xs border border-indigo-100 shrink-0">
                  {roleProfiles[userRole].initials}
                </div>
                <div className="text-left min-w-0">
                  <span className="text-xs font-bold text-slate-900 block leading-tight truncate">{roleProfiles[userRole].name}</span>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">{roleProfiles[userRole].title}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors shrink-0 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>

          {/* RIGHT MAIN PLATFORM WORKSPACE CONTAINER */}
          <div className="flex-1 flex flex-col min-w-0" id="main-workbench">
            {/* TOP SYSTEM HEADER */}
            <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-xs" id="top-header">
              {/* Header Left utilities */}
              <div className="flex items-center gap-4">
                <div className="md:hidden flex items-center justify-center w-8 h-8 bg-slate-105 rounded border border-slate-200 text-slate-805 font-bold select-none cursor-pointer">
                  DI
                </div>

                {currentPage === 'admin-dashboard' && (
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-indigo-650 animate-pulse" />
                    <div>
                      <h1 className="text-sm font-bold tracking-tight text-slate-900 font-sans leading-none">Codin City Admin Console</h1>
                      <p className="text-[10px] text-slate-500 mt-0.5">Global administrator panel. Provision new client workspaces and orchestrate endpoints for Github, Jira, GitLab, and Azure DevOps.</p>
                    </div>
                  </div>
                )}


                {/* Global Search */}
                {currentPage !== 'admin-dashboard' && (
                <div className="relative group hidden sm:block w-64 ml-2">
                  <div className="absolute inset-0 bg-indigo-500/5 rounded-md blur-xs group-hover:blur-sm transition-all"></div>
                  <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-indigo-400 focus-within:bg-white rounded-md overflow-hidden shadow-3xs transition-all pr-2">
                    <div className="pl-2.5 text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search Projects, Employees, Risks..."
                      className="w-full bg-transparent border-0 outline-none px-2 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>
                )}

                {/* Global Company Selector Dropdown */}
                {currentPage !== 'admin-dashboard' && (
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4" id="company-selector">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold font-mono hidden xl:block">Company Selector</span>
                  <div className="relative">
                    <select
                      value={transitionTargetCompany || selectedCompany}
                      onChange={(e) => handleCompanyChange(e.target.value)}
                      className="bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-850 rounded-md pl-3 pr-8 py-1 text-xs font-bold cursor-pointer outline-none font-sans shadow-2xs appearance-none transition-colors"
                    >
                      {companies.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-450">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
                )}
              </div>

              {/* Header Right utilities */}
              <div className="flex items-center gap-4 relative">

                {/* Delivery Copilot Launcher */}
                {currentPage !== 'admin-dashboard' && (
                <motion.button
                  id="ai-copilot-btn"
                  onClick={() => setShowCopilot(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-100 text-[11px] font-bold px-3 py-1.5 rounded-md cursor-pointer shadow-sm transition-colors duration-150"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ask Copilot</span>
                </motion.button>
                )}

                <div className="h-5 w-px bg-slate-200"></div>

                

                <div className="h-5 w-px bg-slate-200"></div>

                {/* Quick Profile capsule widget */}
                <div className="flex items-center gap-2">
                  <div className="avatar w-6 h-6 rounded bg-indigo-50 text-indigo-650 font-bold border border-indigo-100 text-[10px] flex items-center justify-center font-mono select-none">
                    {roleProfiles[userRole].initials}
                  </div>
                  <span className="text-[11px] font-mono text-slate-505 hover:text-slate-900 cursor-pointer select-none hidden sm:inline-block">
                    {roleProfiles[userRole].name.toLowerCase().replace(' ', '_')}
                  </span>
                </div>
              </div>
            </header>

            {/* MAIN DYNAMIC CONTENT WORKSPACE STAGE */}
            <main className="flex-1 p-6 overflow-y-auto bg-slate-50" id="dynamic-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                  className="h-full"
                >
                  {renderActivePage()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>

          {/* Global Delivery Copilot Drawer */}
          <DeliveryCopilot
            isOpen={showCopilot}
            onClose={() => setShowCopilot(false)}
            onNavigate={(page) => setCurrentPage(page)}
            initialQuery={copilotQuery}
            onClearQuery={() => setCopilotQuery('')}
            userRole={userRole}
            userName={roleProfiles[userRole].name}
          />
          
          <CompanyTransition 
            companyName={transitionTargetCompany || selectedCompany} 
            isActive={isTransitioning} 
            onComplete={completeCompanyTransition} 
          />
          
          <OnboardingTour 
            steps={tourSteps} 
            isOpen={isTourOpen} 
            onComplete={() => {
              setIsTourOpen(false);
              localStorage.setItem('di_tour_completed', 'true');
            }} 
          />

          {/* Floating Guide Button */}
          <button
            onClick={() => setIsTourOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-center group cursor-pointer"
            title="Replay Guide"
          >
            <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
