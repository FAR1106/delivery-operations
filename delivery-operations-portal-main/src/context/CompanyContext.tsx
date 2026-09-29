import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Project, Risk, ResourceAllocation, WeeklyStatusReport, Organization, EmployeeMapping } from '../types';

export type CompanyName = string;

export interface PortfolioTrendItem {
  name: string;
  healthy: number;
  atRisk: number;
  critical: number;
  velocity: number;
}

export interface CapacityForecastItem {
  month: string;
  currentCapacity: number;
  projectedDemand: number;
}

export interface OperationalConfidenceData {
  deliveryConfidence: number;
  demandVariance: number;
  slaCompliance: number;
}

export interface AiBriefingData {
  briefing: string;
  source: string;
  loading: boolean;
}

interface CompanyContextType {
  selectedCompany: CompanyName;
  setSelectedCompany: (company: CompanyName) => void;
  companies: CompanyName[];
  organizations: Organization[];
  employeeMappings: EmployeeMapping[];
  updateEmployeeAccess: (mappings: EmployeeMapping[]) => void;
  addCompany: (
    name: string,
    industry: string,
    adminName: string,
    adminEmail: string,
    integrations: Organization['integrations']
  ) => Promise<void>;
  updateCompany: (
    orgId: string,
    name: string,
    industry: string,
    adminName: string,
    adminEmail: string,
    integrations: Organization['integrations'],
    healthWarningThreshold: number,
    healthCriticalThreshold: number
  ) => Promise<void>;
  deleteCompanyWorkspace: (id: string) => Promise<void>;
  projects: Project[];
  allProjects: Project[];
  setAllProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  risks: Risk[];
  allRisks: Risk[];
  setAllRisks: React.Dispatch<React.SetStateAction<Risk[]>>;
  resources: ResourceAllocation[];
  allResources: ResourceAllocation[];
  setAllResources: React.Dispatch<React.SetStateAction<ResourceAllocation[]>>;
  reports: WeeklyStatusReport[];
  allReports: WeeklyStatusReport[];
  setAllReports: React.Dispatch<React.SetStateAction<WeeklyStatusReport[]>>;
  trendsData: PortfolioTrendItem[];
  capacityForecastData: CapacityForecastItem[];
  operationalConfidence: OperationalConfidenceData;
  aiBriefing: AiBriefingData;
  refetchTelemetry: () => Promise<void>;
  fetchProjectAiReport: (projectId: string) => Promise<any>;
  slaMetrics: any[];
  telemetryEvents: any[];
  askCopilot: (queryText: string, companyName: string) => Promise<any>;
  updateRiskStatus: (riskId: string, newStatus: string) => Promise<void>;
  fetchRiskAiRecommendation: (riskId: string) => Promise<any>;
  fetchResourceDemands: () => Promise<any[]>;
  createResourceDemand: (demand: any) => Promise<void>;
  updateResourceAllocation: (resourceId: string, allocationPercentage: number, status?: string) => Promise<void>;
  fetchResourceRagRecommendation: () => Promise<any>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const initialCompaniesList: CompanyName[] = [
  'All Companies'
];

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyName>('All Companies');
  const [companies, setCompanies] = useState<CompanyName[]>(initialCompaniesList);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [employeeMappings, setEmployeeMappings] = useState<EmployeeMapping[]>([]);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]); // Keep state compatibility

  const [risks, setRisks] = useState<Risk[]>([]);
  const [allRisks, setAllRisks] = useState<Risk[]>([]);

  const [resources, setResources] = useState<ResourceAllocation[]>([]);
  const [allResources, setAllResources] = useState<ResourceAllocation[]>([]);

  const [reports, setReports] = useState<WeeklyStatusReport[]>([]);
  const [allReports, setAllReports] = useState<WeeklyStatusReport[]>([]);

  const [trendsData, setTrendsData] = useState<PortfolioTrendItem[]>([]);
  const [capacityForecastData, setCapacityForecastData] = useState<CapacityForecastItem[]>([]);
  const [operationalConfidence, setOperationalConfidence] = useState<OperationalConfidenceData>({
    deliveryConfidence: 92.4,
    demandVariance: -18,
    slaCompliance: 96.7
  });
  const [aiBriefing, setAiBriefing] = useState<AiBriefingData>({
    briefing: 'Loading RAG operational briefing...',
    source: 'Gemini RAG Engine',
    loading: true
  });
  const [slaMetrics, setSlaMetrics] = useState<any[]>([]);
  const [telemetryEvents, setTelemetryEvents] = useState<any[]>([]);

  // 1. Fetch Companies & Organizations List
  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/companies');
      const orgs: Organization[] = response.data;
      setOrganizations(orgs);
      
      const namesList = ['All Companies', ...orgs.map(o => o.name)];
      setCompanies(namesList);
    } catch (error) {
      console.error('Failed to fetch companies list:', error);
    }
  };

  // 2. Fetch Active Telemetry & Portfolio Metrics
  const fetchTelemetry = async () => {
    try {
      setAiBriefing(prev => ({ ...prev, loading: true }));
      const params = { company: selectedCompany };
      
      const [projRes, riskRes, resRes, repRes, empRes, trendsRes, capRes, opRes, briefingRes, slaRes, eventsRes] = await Promise.all([
        axios.get('/api/dashboard/projects', { params }),
        axios.get('/api/dashboard/risks', { params }),
        axios.get('/api/dashboard/resources', { params }),
        axios.get('/api/dashboard/reports', { params }),
        axios.get('/api/dashboard/employees', { params }),
        axios.get('/api/dashboard/trends', { params }).catch(() => ({ data: [] })),
        axios.get('/api/dashboard/capacity-forecast', { params }).catch(() => ({ data: [] })),
        axios.get('/api/dashboard/operational-confidence', { params }).catch(() => ({ data: { deliveryConfidence: 92.4, demandVariance: -18, slaCompliance: 96.7 } })),
        axios.get('/api/dashboard/ai-briefing', { params }).catch(() => ({ data: { briefing: 'Portfolio operational telemetry synchronized.', source: 'Fallback Telemetry' } })),
        axios.get('/api/dashboard/sla', { params }).catch(() => ({ data: [] })),
        axios.get('/api/dashboard/events', { params }).catch(() => ({ data: [] }))
      ]);

      setProjects(projRes.data);
      setAllProjects(projRes.data);

      setRisks(riskRes.data);
      setAllRisks(riskRes.data);

      setResources(resRes.data);
      setAllResources(resRes.data);

      setReports(repRes.data);
      setAllReports(repRes.data);

      setEmployeeMappings(empRes.data);

      if (trendsRes.data && Array.isArray(trendsRes.data)) {
        setTrendsData(trendsRes.data);
      }
      if (capRes.data && Array.isArray(capRes.data)) {
        setCapacityForecastData(capRes.data);
      }
      if (opRes.data) {
        setOperationalConfidence(opRes.data);
      }
      if (briefingRes.data) {
        setAiBriefing({
          briefing: briefingRes.data.briefing,
          source: briefingRes.data.source || 'Gemini RAG Engine',
          loading: false
        });
      }
      setSlaMetrics(slaRes.data);
      setTelemetryEvents(eventsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard telemetry:', error);
      setAiBriefing(prev => ({ ...prev, loading: false }));
    }
  };

  // Run initial company list fetch
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Run fetch telemetry whenever the selected company changes + automatic 15-second real-time polling
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedCompany]);

  // Resource Demands & Allocation Helpers
  const fetchResourceDemands = async () => {
    try {
      const res = await axios.get('/api/dashboard/resource-demands', {
        params: { company: selectedCompany }
      });
      return res.data;
    } catch (e) {
      console.error('Failed fetching resource demands:', e);
      return [];
    }
  };

  const createResourceDemand = async (demand: any) => {
    try {
      await axios.post('/api/dashboard/resource-demands', {
        ...demand,
        company: selectedCompany
      });
      await fetchTelemetry();
    } catch (e) {
      console.error('Failed submitting resource demand:', e);
    }
  };

  const updateResourceAllocation = async (resourceId: string, allocationPercentage: number, status?: string) => {
    try {
      await axios.patch(`/api/dashboard/resources/${resourceId}/allocation`, {
        allocationPercentage,
        status
      });
      await fetchTelemetry();
    } catch (e) {
      console.error('Failed updating resource allocation:', e);
    }
  };

  const fetchResourceRagRecommendation = async () => {
    try {
      const res = await axios.get('/api/dashboard/resources/rag-recommendation', {
        params: { company: selectedCompany }
      });
      return res.data;
    } catch (e) {
      console.error('Failed fetching resource RAG recommendation:', e);
      return null;
    }
  };

  // Update employee mappings access
  const updateEmployeeAccess = async (updatedMappings: EmployeeMapping[]) => {
    try {
      await axios.post('/api/dashboard/employees/access', updatedMappings);
      fetchTelemetry(); // Refresh
    } catch (error) {
      console.error('Failed to update employee access rules:', error);
    }
  };

  // Add new company and trigger synchronization
  const addCompany = async (
    name: string,
    industry: string,
    adminName: string,
    adminEmail: string,
    integrations: Organization['integrations']
  ): Promise<void> => {
    try {
      await axios.post('/api/companies', {
        name,
        industry,
        adminName,
        adminEmail,
        integrations
      });
      
      // Refresh list
      await fetchCompanies();
      // Switch focus to the newly added company workspace
      setSelectedCompany(name);
    } catch (error) {
      console.error('Failed to provision company workspace:', error);
      throw error;
    }
  };

  const updateCompany = async (
    orgId: string,
    name: string,
    industry: string,
    adminName: string,
    adminEmail: string,
    integrations: Organization['integrations'],
    healthWarningThreshold: number,
    healthCriticalThreshold: number
  ): Promise<void> => {
    try {
      await axios.patch(`/api/companies/${orgId}`, {
        name,
        industry,
        adminName,
        adminEmail,
        integrations,
        healthWarningThreshold,
        healthCriticalThreshold
      });
      await fetchCompanies();
      await fetchTelemetry();
    } catch (error) {
      console.error('Failed to update company workspace:', error);
      throw error;
    }
  };

  const deleteCompanyWorkspace = async (id: string): Promise<void> => {
    try {
      const targetOrg = organizations.find(o => o.id === id);
      await axios.delete(`/api/companies/${id}`);
      if (targetOrg && selectedCompany === targetOrg.name) {
        setSelectedCompany('All Companies');
      }
      await fetchCompanies();
      await fetchTelemetry();
    } catch (error) {
      console.error('Failed to delete company workspace:', error);
      throw error;
    }
  };

  const fetchProjectAiReport = async (projectId: string) => {
    try {
      const res = await axios.get(`/api/dashboard/projects/${projectId}/ai-report`);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch AI report for project ${projectId}:`, error);
      return null;
    }
  };

  const askCopilot = async (queryText: string, companyName: string): Promise<any> => {
    try {
      const response = await axios.post('/api/dashboard/copilot', { query: queryText, company: companyName });
      return response.data;
    } catch (error) {
      console.error('Failed to get Copilot response from backend:', error);
      return {
        text: 'Sorry, I encountered an error communicating with the portfolio intelligence backend.',
        intent: 'unsupported'
      };
    }
  };

  const updateRiskStatus = async (riskId: string, newStatus: string): Promise<void> => {
    try {
      await axios.patch(`/api/dashboard/risks/${riskId}/status`, { status: newStatus });
      await fetchTelemetry();
    } catch (error) {
      console.error(`Failed to update status for risk ${riskId}:`, error);
    }
  };

  const fetchRiskAiRecommendation = async (riskId: string): Promise<any> => {
    try {
      const res = await axios.get(`/api/dashboard/risks/${riskId}/ai-recommendation`);
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch AI recommendation for risk ${riskId}:`, error);
      return null;
    }
  };

  return (
    <CompanyContext.Provider value={{
      selectedCompany,
      setSelectedCompany,
      companies,
      organizations,
      employeeMappings,
      updateEmployeeAccess,
      addCompany,
      updateCompany,
      deleteCompanyWorkspace,
      projects,
      allProjects,
      setAllProjects,
      risks,
      allRisks,
      setAllRisks,
      resources,
      allResources,
      setAllResources,
      reports,
      allReports,
      setAllReports,
      trendsData,
      capacityForecastData,
      operationalConfidence,
      aiBriefing,
      refetchTelemetry: fetchTelemetry,
      fetchProjectAiReport,
      slaMetrics,
      telemetryEvents,
      askCopilot,
      updateRiskStatus,
      fetchRiskAiRecommendation,
      fetchResourceDemands,
      createResourceDemand,
      updateResourceAllocation,
      fetchResourceRagRecommendation
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
