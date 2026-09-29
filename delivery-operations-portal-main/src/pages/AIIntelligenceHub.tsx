/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  Network, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  AlertTriangle, 
  TrendingUp, 
  Terminal, 
  Info, 
  Send,
  HelpCircle,
  FileCode,
  Clock,
  Briefcase,
  Layers,
  ChevronDown,
  Mail,
  UserCheck,
  Check
} from 'lucide-react';

// Define the 30 features list with coordinates for quick navigation
interface FeatureAuditItem {
  id: number;
  name: string;
  suite: 'knowledge' | 'document' | 'risk' | 'insights' | 'communications';
  sectionId: string;
  status: 'Exists Fully' | 'Implemented';
}

const FEATURE_AUDIT_LIST: FeatureAuditItem[] = [
  { id: 1, name: 'Delivery Copilot', suite: 'communications', sectionId: 'copilot-drawer', status: 'Exists Fully' },
  { id: 2, name: 'Meeting Notes Intelligence', suite: 'communications', sectionId: 'meeting-notes', status: 'Implemented' },
  { id: 3, name: 'AI Weekly Reports', suite: 'communications', sectionId: 'weekly-reports-link', status: 'Exists Fully' },
  { id: 4, name: 'Root Cause Analysis', suite: 'risk', sectionId: 'root-cause', status: 'Implemented' },
  { id: 5, name: 'Compliance Advisor', suite: 'risk', sectionId: 'compliance', status: 'Implemented' },
  { id: 6, name: 'Organizational Knowledge Search', suite: 'knowledge', sectionId: 'knowledge-search', status: 'Implemented' },
  { id: 7, name: 'Lessons Learned Engine', suite: 'knowledge', sectionId: 'lessons-learned', status: 'Implemented' },
  { id: 8, name: 'Executive Briefing Generator', suite: 'communications', sectionId: 'exec-briefing', status: 'Implemented' },
  { id: 9, name: 'Cross-Project Impact Analysis', suite: 'insights', sectionId: 'cross-project', status: 'Implemented' },
  { id: 10, name: 'Intelligent Recommendation Engine', suite: 'insights', sectionId: 'recommendations', status: 'Implemented' },
  { id: 11, name: 'Email / Teams / Slack Intelligence', suite: 'communications', sectionId: 'chat-channels', status: 'Implemented' },
  { id: 12, name: 'Project Document Assistant', suite: 'document', sectionId: 'doc-uploader', status: 'Implemented' },
  { id: 13, name: 'Semantic Project Search', suite: 'knowledge', sectionId: 'semantic-search', status: 'Implemented' },
  { id: 14, name: 'Historical Risk Analysis', suite: 'risk', sectionId: 'historical-risk', status: 'Implemented' },
  { id: 15, name: 'Project Retrospective Analyzer', suite: 'insights', sectionId: 'retro-analyzer', status: 'Implemented' },
  { id: 16, name: 'Stakeholder Communication Intelligence', suite: 'insights', sectionId: 'stakeholder-comms', status: 'Implemented' },
  { id: 17, name: 'Audit & Governance Assistant', suite: 'risk', sectionId: 'audit-governance', status: 'Implemented' },
  { id: 18, name: 'Dependency Impact Analyzer', suite: 'risk', sectionId: 'dependency-analyzer', status: 'Implemented' },
  { id: 19, name: 'Change Request Intelligence', suite: 'insights', sectionId: 'change-requests', status: 'Implemented' },
  { id: 20, name: 'Portfolio Knowledge Assistant', suite: 'knowledge', sectionId: 'portfolio-assistant', status: 'Implemented' },
  { id: 21, name: 'Executive Q&A Assistant', suite: 'communications', sectionId: 'exec-qa', status: 'Implemented' },
  { id: 22, name: 'Document Summarization Engine', suite: 'document', sectionId: 'doc-summarize', status: 'Implemented' },
  { id: 23, name: 'Contract Intelligence', suite: 'document', sectionId: 'contract-intel', status: 'Implemented' },
  { id: 24, name: 'Policy Intelligence Assistant', suite: 'knowledge', sectionId: 'policy-intel', status: 'Implemented' },
  { id: 25, name: 'Regulatory Impact Analysis', suite: 'document', sectionId: 'regulatory-impact', status: 'Implemented' },
  { id: 26, name: 'Decision Traceability Assistant', suite: 'risk', sectionId: 'decision-trace', status: 'Implemented' },
  { id: 27, name: 'Enterprise Knowledge Base Search', suite: 'knowledge', sectionId: 'kb-search', status: 'Implemented' },
  { id: 28, name: 'Project Context Assistant', suite: 'knowledge', sectionId: 'project-context', status: 'Implemented' },
  { id: 29, name: 'Risk Mitigation Recommendation Engine', suite: 'risk', sectionId: 'risk-recommendations', status: 'Implemented' },
  { id: 30, name: 'Program Insights Generator', suite: 'insights', sectionId: 'program-insights', status: 'Implemented' },
];

interface AIIntelligenceHubProps {
  initialTab?: 'knowledge' | 'document' | 'risk' | 'insights' | 'communications';
}

export default function AIIntelligenceHub({ initialTab = 'knowledge' }: AIIntelligenceHubProps) {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'document' | 'risk' | 'insights' | 'communications'>(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Quick navigation helper
  const handleFeatureClick = (suite: 'knowledge' | 'document' | 'risk' | 'insights' | 'communications', sectionId: string) => {
    setActiveTab(suite);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight class addition
        element.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2');
        }, 2000);
      }
    }, 150);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==========================================
  // STATE & MOCK ACTIONS FOR SUITE 1 (KNOWLEDGE)
  // ==========================================
  const [kbQuery, setKbQuery] = useState('');
  const [kbResults, setKbResults] = useState<any[]>([]);
  const [searchSearching, setSearchSearching] = useState(false);

  // Semantic Project Search
  const [semanticQuery, setSemanticQuery] = useState('');
  const [semanticResults, setSemanticResults] = useState<any[]>([]);
  const [semanticSearching, setSemanticSearching] = useState(false);

  // Enterprise KB Search
  const [kbSearchQuery, setKbSearchQuery] = useState('');
  const [kbSearchResults, setKbSearchResults] = useState<any[]>([]);
  const [kbSearching, setKbSearching] = useState(false);

  // Portfolio Knowledge Assistant
  const [portfolioQuery, setPortfolioQuery] = useState('');
  const [portfolioAnswer, setPortfolioAnswer] = useState('');
  const [portfolioLoading, setPortfolioLoading] = useState(false);

  const handleKbSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbQuery.trim()) return;
    setSearchSearching(true);
    setTimeout(() => {
      const clean = kbQuery.toLowerCase();
      let answers = [
        {
          title: '[Lessons Learned] Aegis Database Locking Blocker',
          desc: 'Historically in Q3 2025, Aegis experienced locking timeouts on batch ingestion. The mitigation blueprint requires setting SQL transaction levels to Read Committed Snapshot Isolation.',
          score: '96% Match score'
        },
        {
          title: '[Policy Document] Section 4.2 HIPAA Health Data Sovereignty',
          desc: 'All HIPAA covered workloads in active environments must maintain TLS 1.3 in-transit and KMS envelope encryption at-rest. AWS region lock must restrict traffic strictly to US East.',
          score: '91% Match score'
        }
      ];
      if (clean.includes('contract') || clean.includes('sla')) {
        answers = [
          {
            title: '[Contract Review] Vanguard PMO SLA Agreement',
            desc: 'Section 9.1 specifies severity 1 blocker response time must remain under 60 minutes. Failure to comply incurs a penalty of $5,000 per business day.',
            score: '94% Match score'
          }
        ];
      }
      setKbResults(answers);
      setSearchSearching(false);
      triggerToast('Semantic retrieval complete across corporate vector databases.');
    }, 800);
  };

  const handleSemanticSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!semanticQuery.trim()) return;
    setSemanticSearching(true);
    setTimeout(() => {
      setSemanticResults([
        { name: 'Synapse ML Recommender', client: 'RetailOne', match: '94% Similarity', desc: 'Active recommendation engine mapping user attributes. Conceptual overlap with Sentinel Health patient clustering models.' },
        { name: 'Aura IoT Smart Gateway', client: 'MedTech Solutions', match: '89% Similarity', desc: 'Edge processing pipelines. Shares security tag definitions and encrypted telemetry configurations.' }
      ]);
      setSemanticSearching(false);
      triggerToast('Semantic project similarity analysis finalized.');
    }, 700);
  };

  const handleKbSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbSearchQuery.trim()) return;
    setKbSearching(true);
    setTimeout(() => {
      setKbSearchResults([
        { source: 'Confluence (PMO Space)', title: 'Security tag guidelines for AWS template deployment', link: '#' },
        { source: 'SharePoint (Regulatory Core)', title: 'HIPAA Data localization standard operating manual v4.2', link: '#' }
      ]);
      setKbSearching(false);
      triggerToast('Federated Enterprise Knowledge Base search completed.');
    }, 700);
  };

  const handlePortfolioAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioQuery.trim()) return;
    setPortfolioLoading(true);
    setPortfolioAnswer('');
    setTimeout(() => {
      const q = portfolioQuery.toLowerCase();
      let answer = '';
      if (q.includes('soc2') || q.includes('compliance')) {
        answer = 'According to corporate policies, the **Sentinel Health Cloud** migration workspace requires automatic SOC2 VPC tagging configurations before compliance release authorization.';
      } else if (q.includes('velocity') || q.includes('sprint')) {
        answer = 'The current average sprint velocity is **38.4 story points**. Chronos Banking Rewrite is currently running behind target velocity by 14% due to legacy mainframe COBOL dependency bottlenecks.';
      } else {
        answer = 'Portfolio records check: 8 active projects are managed across 5 client accounts. 4 projects are flagged with high/medium risk variances.';
      }
      setPortfolioAnswer(answer);
      setPortfolioLoading(false);
      triggerToast('Portfolio Knowledge Base query completed.');
    }, 700);
  };

  // Decision Traceability
  const [traceDecisionId, setTraceDecisionId] = useState('DEC-024');
  const [traceHistory, setTraceHistory] = useState<any | null>(null);
  const [tracing, setTracing] = useState(false);

  const handleTraceDecision = (id: string) => {
    setTraceDecisionId(id);
    setTracing(true);
    setTraceHistory(null);
    setTimeout(() => {
      setTracing(false);
      if (id === 'DEC-024') {
        setTraceHistory({
          title: 'DEC-024: AWS VPC De-identification Pipeline Approval',
          date: 'June 02, 2026',
          owner: 'Catherine Vance (PMO Director)',
          justification: 'HIPAA compliance requires de-identification of data prior to crossing state VPC boundaries. Approved custom KMS tags in Terraform to bypass baseline lockout.',
          auditTrail: [
            { step: 'Proposed', user: 'Alex Rivera (Lead)', time: 'May 28, 2026' },
            { step: 'SOC2 Review', user: 'Security Bot', time: 'May 30, 2026' },
            { step: 'Approved Signature', user: 'Catherine Vance', time: 'June 02, 2026' }
          ]
        });
      } else {
        setTraceHistory({
          title: 'DEC-011: Chronos Transaction Isolation Standard Shift',
          date: 'May 14, 2026',
          owner: 'Sarah Jenkins (Executive)',
          justification: 'Outage prevention overrides standard latency performance bounds. Transitioned database to Snapshot Isolation.',
          auditTrail: [
            { step: 'Incident Logged', user: 'Alerts Hub', time: 'May 10, 2026' },
            { step: 'Mitigation Plan Created', user: 'David Miller (PM)', time: 'May 12, 2026' },
            { step: 'Executive Signoff', user: 'Sarah Jenkins', time: 'May 14, 2026' }
          ]
        });
      }
      triggerToast(`Decision Traceability audit loaded for ${id}.`);
    }, 600);
  };

  // ==========================================
  // STATE & MOCK ACTIONS FOR SUITE 2 (DOCUMENT)
  // ==========================================
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [docAnalyzing, setDocAnalyzing] = useState(false);
  const [docReport, setDocReport] = useState<any | null>(null);

  const handleFileChange = (fileName: string) => {
    setSelectedFile(fileName);
    setDocAnalyzing(true);
    setDocReport(null);
    setTimeout(() => {
      setDocAnalyzing(false);
      setDocReport({
        summary: `Document brief parsed: Executive Master Services Contract outline for Vanguard RetailOne Expansion project. Formatted across standard GDPR compliance regulations.`,
        keyContractLiabilities: [
          'Clause 14.3: Unlimited liability on data exposure breaches.',
          'Clause 2.1: Payment schedule terms fixed at Net 90 days.'
        ],
        complianceAdvisoryScore: 92,
        regulatoryRisks: [
          'High Risk: Data localization clauses do not fully specify strict EU boundaries (GDPR Chapter V compatibility).',
          'Medium Risk: Inconsistent subcontractor definitions in security audit reports.'
        ]
      });
      triggerToast(`Contract and Regulatory check complete for ${fileName}.`);
    }, 1800);
  };

  // ==========================================
  // STATE & MOCK ACTIONS FOR SUITE 3 (RISK)
  // ==========================================
  const [selectedRootCauseProject, setSelectedRootCauseProject] = useState('Sentinel Health Cloud Migration');
  const [showRcaDiagram, setShowRcaDiagram] = useState(false);

  const activeRcaInfo = useMemo(() => {
    if (selectedRootCauseProject.includes('Sentinel')) {
      return {
        blocker: 'HIPAA Compliance Audit Blocked',
        chain: [
          { title: 'Trigger Event', desc: 'AWS provisioning script failed compliance verification check (SOC2 checklist fail).' },
          { title: 'Intermediate Constraint', desc: 'DevOps team attempted manual KMS key allocation, violating security pipeline guardrails.' },
          { title: 'Root Cause Identified', desc: 'Missing standard Terraform compliance policy tags inside the VPC configuration repository.' }
        ],
        reco: 'Integrate the automatic Compliance Policy tagging suite in Git validation hooks.'
      };
    }
    return {
      blocker: 'Chronos Mainframe Shortage',
      chain: [
        { title: 'Trigger Event', desc: 'Velocity drop detected in sprint 14 of COBOL to Java code compiling.' },
        { title: 'Intermediate Constraint', desc: 'Principal mainframe engineer assigned to help support Vanguard database outage.' },
        { title: 'Root Cause Identified', desc: 'Single point of failure on legacy system knowledge. Team lacks cross-training on mainframe logic parser tools.' }
      ],
      reco: 'Host two shadow sessions and document mainframe logic parsing tools in corporate wiki.'
    };
  }, [selectedRootCauseProject]);

  // ==========================================
  // STATE & MOCK ACTIONS FOR SUITE 4 (INSIGHTS)
  // ==========================================
  const [primaryDelayProject, setPrimaryDelayProject] = useState('Sentinel Health');
  const [delayDuration, setDelayDuration] = useState('2 Weeks');
  const [impactResults, setImpactResults] = useState<any | null>(null);
  const [simulatingImpact, setSimulatingImpact] = useState(false);

  const handleRunImpactSimulation = () => {
    setSimulatingImpact(true);
    setImpactResults(null);
    setTimeout(() => {
      setSimulatingImpact(false);
      setImpactResults({
        affectedProjects: [
          { name: 'Synapse ML Recommender', delay: '1.5 Weeks delay projected', riskLevel: 'Medium', reason: 'Blocked by delayed healthcare model ingestion from Sentinel API.' },
          { name: 'Velo Routing Logistics', delay: '1.0 Weeks delay projected', riskLevel: 'Low', reason: 'Resource rescheduling bottleneck as DevOps engineers are diverted.' }
        ],
        capacityPacingDelta: '-12% efficiency',
        recommendation: 'Temporarily assign 1 Senior DevOps Engineer from Aegis Trading platform to offload database configurations.'
      });
      triggerToast('Cross-Project ripple analysis finalized.');
    }, 1000);
  };

  // ==========================================
  // STATE & MOCK ACTIONS FOR SUITE 5 (COMMUNICATIONS)
  // ==========================================
  const [transcriptText, setTranscriptText] = useState('');
  const [summarizingTranscript, setSummarizingTranscript] = useState(false);
  const [transcriptSummary, setTranscriptSummary] = useState<any | null>(null);

  const handleMeetingNotesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcriptText.trim()) return;
    setSummarizingTranscript(true);
    setTranscriptSummary(null);
    setTimeout(() => {
      setSummarizingTranscript(false);
      setTranscriptSummary({
        brief: 'Chronos Steering Align Sync: Mainframe COBOL migration blockers resolved, database backup scripts approved.',
        actionItems: [
          'Catherine Vance to allocate backup contractor budget by Friday.',
          'Alex Rivera to coordinate mainframe logic decompilation test run.'
        ],
        decisions: [
          'Approved transaction replication tool migration blueprint.',
          'Rejected temporary cloud migration alternative due to security policy rules.'
        ]
      });
      triggerToast('Meeting transcript summary generated.');
    }, 1500);
  };

  const [qaQuery, setQaQuery] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');
  const [qaLoading, setQaLoading] = useState(false);

  const handleQaAsk = (queryStr: string) => {
    setQaQuery(queryStr);
    setQaLoading(true);
    setQaAnswer('');
    setTimeout(() => {
      setQaLoading(false);
      if (queryStr.includes('budget')) {
        setQaAnswer('### PORTFOLIO BUDGET FORECAST OUTLOOK\n\n- **Overall Portfolio Budget:** $18.4M Total, $12.1M Expended (65% pacing).\n- **High Burn Rate Risk:** Chronos Banking Rewrite is trending 14% over baseline allocations due to mainframe consulting premium expenses.\n- **Mitigation:** Adjust contractor allocation weights downward for Q3.');
      } else if (queryStr.includes('capacity')) {
        setQaAnswer('### STAFFING CAPACITY & BURNOUT ALERT\n\n- **Peak Staffing Deficit:** August-September 2026 presents a -20 FTE deficit.\n- **Overloaded Department:** Core systems and DevOps teams show average resource utilization at 96%.\n- **Recommended Mitigation:** Contract 2 DevOps contractors and defer Sentinel legacy migrations by 10 business days.');
      } else {
        setQaAnswer('### STAKEHOLDER PORTFOLIO UPDATE BRIEF\n\n- **Programs At-Risk/Critical:** 4 out of 8 active programs.\n- **Primary Blocker:** AWS security compliance validation failure and pos edge API spec lag.\n- **Operational Status:** Average portfolio health index sits at 84%. Core milestones remain achievable if compliance is approved by end of month.');
      }
    }, 600);
  };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 font-sans text-slate-800 bg-slate-50" id="ai-hub-container">
      {/* Toast popup */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-xl p-4 flex items-center gap-3 shadow-xl max-w-sm"
          >
            <div className="p-1 bg-indigo-500 rounded-full text-white">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold font-sans">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workbench Area (Left 75% on large screens) */}
      <div className="flex-1 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
              AI Cognitive Intelligence Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Interactive workspace for natural language search, automated risk audit controls, contract parsing, and cross-project cascade simulators.
            </p>
          </div>
        </div>

        {/* Cognitive Tab Navigation */}
        <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex flex-wrap gap-1 shadow-2xs">
          {[
            { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen, desc: 'Organizational knowledge search & policy audit' },
            { id: 'document', label: 'Document & Contract Analyzer', icon: FileText, desc: 'Contract intelligence & summarization' },
            { id: 'risk', label: 'Risk & Compliance Control', icon: ShieldCheck, desc: 'RCA timelines, compliance checks, risk predictive trends' },
            { id: 'insights', label: 'Program Insights & Impact', icon: Network, desc: 'Cross-project cascades & retrospectives' },
            { id: 'communications', label: 'Meeting & Comms Intelligence', icon: MessageSquare, desc: 'Meeting summary, slack analytics & C-Suite QA' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg border text-xs font-bold cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-750 shadow-3xs'
                    : 'bg-white border-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                }`}
                title={tab.desc}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Workspace Display Stage */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="space-y-8"
            >
              {/* TAB 1: KNOWLEDGE HUB */}
              {activeTab === 'knowledge' && (
                <div className="space-y-6">
                  {/* 1. Organizational Knowledge Search */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4" id="knowledge-search">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-100 text-indigo-750 font-bold px-2 py-0.5 rounded font-mono uppercase">
                          Org Search
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          Organizational Knowledge Search
                        </h3>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">[Organizational Knowledge Search]</span>
                    </div>

                    <form onSubmit={handleKbSearchSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={kbQuery}
                          onChange={(e) => setKbQuery(e.target.value)}
                          placeholder="Search HIPAA compliance, database locks, COBOL logic runbooks..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-250 focus:border-indigo-500 rounded-xl text-xs font-semibold outline-none shadow-2xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={searchSearching}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        {searchSearching ? 'Searching...' : 'Search KB'}
                      </button>
                    </form>

                    {kbResults.length > 0 && (
                      <div className="space-y-2.5 pt-2 animate-fade-in">
                        <div className="divide-y divide-slate-150 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                          {kbResults.map((res, index) => (
                            <div key={index} className="p-4 space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800 text-xs">{res.title}</span>
                                <span className="text-[9px] text-emerald-650 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full font-mono font-bold">{res.score}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed font-sans">{res.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Semantic Project Search */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4" id="semantic-search">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-100 text-indigo-750 font-bold px-2 py-0.5 rounded font-mono uppercase">
                          Semantic Search
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          Semantic Project Search
                        </h3>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">[Semantic Project Search]</span>
                    </div>

                    <form onSubmit={handleSemanticSearch} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={semanticQuery}
                          onChange={(e) => setSemanticQuery(e.target.value)}
                          placeholder="Describe technical traits (e.g. 'encryption tags in Terraform' or 'latency metrics') to find related programs..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-250 focus:border-indigo-500 rounded-xl text-xs font-semibold outline-none shadow-2xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={semanticSearching}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        {semanticSearching ? 'Matching...' : 'Find Matches'}
                      </button>
                    </form>

                    {semanticResults.length > 0 && (
                      <div className="space-y-2.5 pt-2 animate-fade-in">
                        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Conceptually Related Projects</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {semanticResults.map((res, index) => (
                            <div key={index} className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-3xs">
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-slate-800 text-xs">{res.name}</span>
                                <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full font-mono">
                                  {res.match}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed font-sans">{res.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Enterprise Knowledge Base Search */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4" id="kb-search">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-100 text-indigo-750 font-bold px-2 py-0.5 rounded font-mono uppercase">
                          KB Directories
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          Enterprise Knowledge Base Search
                        </h3>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">[Enterprise Knowledge Base Search]</span>
                    </div>

                    <form onSubmit={handleKbSearch} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={kbSearchQuery}
                          onChange={(e) => setKbSearchQuery(e.target.value)}
                          placeholder="Search across Confluence, SharePoint, and Google Drive simultaneously..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-250 focus:border-indigo-500 rounded-xl text-xs font-semibold outline-none shadow-2xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={kbSearching}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        {kbSearching ? 'Searching...' : 'Federated Search'}
                      </button>
                    </form>

                    {kbSearchResults.length > 0 && (
                      <div className="space-y-2 pt-2 animate-fade-in">
                        <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs">
                          {kbSearchResults.map((res, index) => (
                            <div key={index} className="p-3.5 flex justify-between items-center text-xs">
                              <div>
                                <span className="text-[9px] font-bold text-slate-400 font-mono block uppercase">{res.source}</span>
                                <span className="font-bold text-slate-800 block mt-0.5">{res.title}</span>
                              </div>
                              <button 
                                onClick={() => triggerToast(`Downloaded ${res.title.replace(/ /g, '_')}.pdf`)}
                                className="text-[10px] font-bold text-indigo-650 hover:text-indigo-850 cursor-pointer"
                              >
                                View File
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. Portfolio Knowledge Assistant */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4" id="portfolio-assistant">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-purple-100 text-purple-750 font-bold px-2 py-0.5 rounded font-mono uppercase">
                          Portfolio Assistant
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          Portfolio Knowledge Assistant
                        </h3>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">[Portfolio Knowledge Assistant]</span>
                    </div>

                    <form onSubmit={handlePortfolioAsk} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={portfolioQuery}
                          onChange={(e) => setPortfolioQuery(e.target.value)}
                          placeholder="Ask anything about active programs (e.g. 'Show SOC2 blockers' or 'sprint velocities')..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-250 focus:border-indigo-500 rounded-xl text-xs font-semibold outline-none shadow-2xs"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={portfolioLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        {portfolioLoading ? 'Answering...' : 'Ask Assistant'}
                      </button>
                    </form>

                    {portfolioAnswer && (
                      <div className="p-4 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-700 animate-fade-in shadow-3xs space-y-1">
                        <span className="text-[9px] text-indigo-655 font-bold font-mono block uppercase">Assistant Reply</span>
                        <p className="font-semibold text-slate-800">{portfolioAnswer}</p>
                      </div>
                    )}
                  </div>

                  {/* Lessons Learned Engine */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-slate-200 rounded-xl p-5 space-y-3 relative overflow-hidden" id="lessons-learned">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Lessons Learned Engine</h4>
                          <h3 className="text-sm font-extrabold text-slate-800">Historical Post-Mortems</h3>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">[Lessons Learned Engine]</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Archived solutions and blueprints to optimize active project parameters. Select a topic to populate active mitigation tasks.
                      </p>
                      
                      <div className="space-y-2 pt-1.5">
                        {[
                          { title: 'Legacy Database Migrations (2025)', desc: 'Index constraints on legacy migrations require 3.5x buffer timing allocations.', impact: 'Schedule risk mitigation' },
                          { title: 'AWS HIPAA Provisioning (2026)', desc: 'Manual KMS generation fails secure pipeline checks. Always configure KMS automatic tags in root templates.', impact: 'Compliance warning' }
                        ].map((lesson, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => triggerToast(`Copied lesson parameters to active PMO planning buffer.`)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 p-3 rounded-lg text-left cursor-pointer transition-colors shadow-3xs"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-slate-800">{lesson.title}</span>
                              <span className="text-[8px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded font-mono font-bold uppercase">{lesson.impact}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-normal">{lesson.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Policy & Context Assistant */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-4 flex flex-col justify-between" id="policy-intel">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">SOP & Context Assistant</h4>
                            <h3 className="text-sm font-extrabold text-slate-800">Standard Operating Policy Assistant</h3>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">[Policy Intelligence / Project Context Assistant]</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Query corporate standard operating procedures, safety guidelines, and active project contextual briefs to align new delivery personnel.
                        </p>

                        <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-2 text-xs" id="project-context">
                          <div className="font-bold text-slate-850 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-indigo-650" />
                            Active Context: Aegis Trading Platform Setup
                          </div>
                          <p className="text-slate-600 leading-normal text-[11px]">
                            Aegis requires compliance with FINRA latency targets. New developers must review the Q4 2025 latency benchmark runbooks before pushing code changes.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerToast('Generated PDF briefing: AEGIS_DEVELOPER_ONBOARDING_CONTEXT.pdf')}
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg text-xs cursor-pointer shadow-3xs flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        Generate Contextual Onboarding Brief
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DOCUMENT & CONTRACT ANALYZER */}
              {activeTab === 'document' && (
                <div className="space-y-6">
                  {/* File Dropzone & Uploader */}
                  <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-8 bg-slate-50/50 text-center transition-colors relative" id="doc-uploader">
                    <span className="absolute top-3 right-3 text-[9px] text-slate-400 font-mono">[Project Document Assistant / Document Summarization Engine]</span>
                    
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto shadow-2xs">
                        <Upload className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-700">Upload Project Documents</h4>
                        <p className="text-[11px] text-slate-450 mt-1 leading-normal">
                          Drag and drop legal contracts, SLAs, SOW briefs, or system design files (PDF, Word, TXT, JSON) to parse compliance indicators.
                        </p>
                      </div>
                      
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleFileChange('MSA_Vanguard_Retail_Expand.pdf')}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-3xs"
                        >
                          Select Demo Contract (Vanguard)
                        </button>
                        <button
                          onClick={() => handleFileChange('SOW_Sentinel_Health_Ingestion.docx')}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-3xs"
                        >
                          Select Demo SOW (Sentinel)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Processing Status Loader */}
                  {docAnalyzing && (
                    <div className="border border-slate-200 rounded-xl p-8 bg-white text-center flex flex-col items-center justify-center gap-3 shadow-2xs animate-pulse">
                      <Clock className="w-8 h-8 text-indigo-600 animate-spin" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-700">Contract Ingestion Engine Running</h4>
                        <p className="text-[10px] text-slate-400 font-mono">Parsing PDF telemetry, comparing clause compliance matrices...</p>
                      </div>
                    </div>
                  )}

                  {/* Analysis Report Outputs */}
                  {docReport && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="doc-summarize">
                      {/* Document Summary (Engine) */}
                      <div className="lg:col-span-2 border border-slate-200 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">AI Document Summary</h3>
                          <span className="text-[8.5px] bg-slate-150 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">Processed Successfully</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans">{docReport.summary}</p>
                        
                        <div className="space-y-2.5 pt-2" id="contract-intel">
                          <h4 className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            Contract SLA Liabilities Alert [Contract Intelligence]
                          </h4>
                          <div className="space-y-2">
                            {docReport.keyContractLiabilities.map((lib: string, idx: number) => (
                              <div key={idx} className="bg-amber-50/40 border border-amber-100 p-3 rounded-lg text-xs text-slate-700 font-medium">
                                {lib}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Regulatory Compliance & Score (Regulatory Impact) */}
                      <div className="border border-slate-200 rounded-xl p-5 space-y-4" id="regulatory-impact">
                        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono">Compliance Advisor</h3>
                          <span className="text-[9px] text-slate-400 font-mono">[Regulatory Impact Analysis]</span>
                        </div>
                        
                        {/* Interactive gauge simulation */}
                        <div className="flex flex-col items-center justify-center p-3.5 bg-slate-50 rounded-xl text-center space-y-2 border border-slate-200/50">
                          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Audit Score</span>
                          <span className="text-3xl font-extrabold font-mono text-indigo-700">{docReport.complianceAdvisoryScore}%</span>
                          <span className="text-[9.5px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">Sufficient Alignment</span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Flagged Policy Warnings</span>
                          {docReport.regulatoryRisks.map((risk: string, idx: number) => (
                            <div key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-655 p-2 bg-slate-50 border border-slate-150 rounded-lg">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                              <span>{risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: RISK & COMPLIANCE CONTROL */}
              {activeTab === 'risk' && (
                <div className="space-y-6">
                  {/* Select target project to trace Root Cause Analysis */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Operational Root Cause & Compliance Auditor
                      </h3>
                      <p className="text-xs text-slate-500">Configure predictive telemetry, tracers, and mitigation guidelines.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">Target:</span>
                      <select
                        value={selectedRootCauseProject}
                        onChange={(e) => setSelectedRootCauseProject(e.target.value)}
                        className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer outline-none shadow-3xs"
                      >
                        <option value="Sentinel Health Cloud Migration">Sentinel Health Cloud</option>
                        <option value="Chronos Digital Ledger Rewrite">Chronos Banking Rewrite</option>
                      </select>
                    </div>
                  </div>

                  {/* Chain of causal event triggers (Root Cause Analysis / Decision Traceability) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="root-cause">
                    {/* Event Trigger Chain */}
                    <div className="lg:col-span-2 border border-slate-200 rounded-xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">
                          Telemetry Root Cause Tracer
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono">[Root Cause Analysis / Decision Traceability Assistant]</span>
                      </div>

                      {/* Interactive Step Timeline */}
                      <div className="relative pl-6 space-y-4 border-l border-slate-200 ml-3">
                        {activeRcaInfo.chain.map((step, idx) => (
                          <div key={idx} className="relative space-y-1">
                            <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full bg-indigo-50 border-2 border-indigo-500 flex items-center justify-center font-mono text-[8px] font-bold text-indigo-700">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-800 block">{step.title}</span>
                            <p className="text-[11px] text-slate-600 leading-normal">{step.desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* Recommendation Engine response */}
                      <div className="bg-indigo-50/40 border border-indigo-150 p-4 rounded-xl space-y-2 text-xs" id="risk-recommendations">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-650" />
                            Mitigation recommendation [Risk Mitigation Recommendation Engine]
                          </span>
                        </div>
                        <p className="text-slate-655 font-medium leading-relaxed">{activeRcaInfo.reco}</p>
                      </div>
                    </div>

                    {/* Policy compliance & Audit checklists */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-4" id="compliance">
                      <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Compliance Advisor Checklist</h3>
                        <span className="text-[9px] text-slate-400 font-mono">[Compliance Advisor / Audit & Governance]</span>
                      </div>

                      <div className="space-y-3" id="audit-governance">
                        {[
                          { label: 'HIPAA Health Security Rules', checked: selectedRootCauseProject.includes('Sentinel') ? false : true, critical: true },
                          { label: 'SOC2 Security Pipeline Validation', checked: true, critical: true },
                          { label: 'SLA Response Bounds Verification', checked: true, critical: false },
                          { label: 'Database Backup Schedule', checked: true, critical: false }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between p-2.5 bg-slate-50 border border-slate-150 rounded-lg">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                readOnly
                                className="w-3.5 h-3.5 accent-indigo-600 cursor-not-allowed"
                              />
                              <span className="text-xs font-bold text-slate-700">{item.label}</span>
                            </div>
                            {item.critical && !item.checked && (
                              <span className="text-[8px] bg-rose-50 border border-rose-100 text-rose-700 font-extrabold px-1.5 py-0.2 rounded uppercase">
                                Blocking
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => triggerToast('Compliance Audit Report created: SYSTEM_COMPLIANCE_RUN_REPORT.pdf')}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs cursor-pointer shadow-sm transition-colors text-center"
                      >
                        Run Governance Audit
                      </button>
                    </div>
                  </div>

                  {/* Decision Traceability Assistant */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4" id="decision-trace">
                    <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-100 text-indigo-750 font-bold px-2 py-0.5 rounded font-mono uppercase">
                          Traceability
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          Decision Traceability Assistant
                        </h3>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">[Decision Traceability Assistant]</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider font-mono">Select Signed Decision</label>
                        <div className="flex flex-col gap-2">
                          {[
                            { id: 'DEC-024', label: 'DEC-024: AWS VPC KMS Keys approval' },
                            { id: 'DEC-011', label: 'DEC-011: DB transaction isolation shift' }
                          ].map((dec) => (
                            <button
                              key={dec.id}
                              type="button"
                              onClick={() => handleTraceDecision(dec.id)}
                              className={`p-2.5 rounded-lg border text-left font-bold text-xs transition-colors cursor-pointer ${
                                traceDecisionId === dec.id 
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-750' 
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              {dec.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-4 min-h-[140px] flex flex-col justify-between shadow-3xs">
                        {tracing ? (
                          <div className="flex items-center justify-center h-full text-xs font-mono text-slate-400 animate-pulse">
                            Tracing cryptographic approval chain...
                          </div>
                        ) : traceHistory ? (
                          <div className="space-y-3 text-xs leading-relaxed animate-fade-in">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                              <strong className="text-slate-850 font-extrabold">{traceHistory.title}</strong>
                              <span className="text-[9.5px] text-slate-400 font-mono">{traceHistory.date}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-455 font-mono uppercase font-bold">Justification & Context</span>
                              <p className="text-slate-655 font-semibold mt-0.5">{traceHistory.justification}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-455 font-mono uppercase font-bold block mb-1">Approval Trail Audit</span>
                              <div className="flex flex-wrap gap-2.5">
                                {traceHistory.auditTrail.map((trail: any, ti: number) => (
                                  <div key={ti} className="bg-slate-50 border border-slate-150 rounded px-2 py-1 text-[10px] text-slate-605 font-medium">
                                    <strong className="text-slate-800 font-bold">{trail.step}:</strong> {trail.user} ({trail.time})
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs font-sans text-slate-400 italic">
                            Select a decision log to review cryptographic trace parameters.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Historical Risk Tracker & Dependency Graph (Historical Risk Analysis / Dependency Analyzer) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-slate-200">
                    {/* Historical Risk Analysis */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-4" id="historical-risk">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Historical Risk Analyzer</h4>
                          <h3 className="text-sm font-extrabold text-slate-800">Historical Risk Trajectory Trends</h3>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">[Historical Risk Analysis]</span>
                      </div>
                      
                      <div className="h-44 flex items-end justify-between px-4 pb-2 pt-6 bg-slate-50 border border-slate-200/80 rounded-xl relative">
                        {/* Grid lines */}
                        <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between pointer-events-none opacity-[0.06] px-1 text-[8px] font-mono">
                          <div className="border-b border-slate-900 w-full pt-1" />
                          <div className="border-b border-slate-900 w-full pt-1" />
                          <div className="border-b border-slate-900 w-full pt-1" />
                        </div>
                        
                        {/* Graph columns */}
                        {[
                          { week: 'Week 12', count: 4, height: 'h-[35%]' },
                          { week: 'Week 13', count: 6, height: 'h-[50%]' },
                          { week: 'Week 14', count: 9, height: 'h-[75%]', active: true },
                          { week: 'Week 15', count: 5, height: 'h-[45%]' }
                        ].map((bar, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 select-none">
                            <span className="text-[10px] font-bold font-mono text-slate-655">{bar.count} Risks</span>
                            <div className={`w-8 ${bar.height} rounded-t-md transition-all duration-150 ${bar.active ? 'bg-indigo-650' : 'bg-slate-300'}`} />
                            <span className="text-[9px] font-mono font-bold text-slate-400">{bar.week}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        Risk density peaked in Week 14 at 9 open issues due to the security compliance blockage on Sentinel.
                      </p>
                    </div>

                    {/* Dependency Analyzer */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-4" id="dependency-analyzer">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Critical Path Dependency Graph</h4>
                          <h3 className="text-sm font-extrabold text-slate-800">Cross-Project Dependency Analyzer</h3>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">[Dependency Impact Analyzer]</span>
                      </div>

                      {/* Interactive Dependency Visualizer representation */}
                      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs font-semibold relative min-h-[176px]">
                        <div className="flex flex-col items-center bg-white border border-slate-200 p-2.5 rounded-lg shadow-3xs max-w-[100px] text-center gap-1">
                          <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono font-bold uppercase">PRJ-003</span>
                          <span className="truncate w-full font-bold">Sentinel Ingestion</span>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center relative">
                          <div className="h-0.5 bg-rose-350 w-full relative" />
                          <span className="text-[8.5px] bg-rose-50 text-rose-700 border border-rose-100 px-1.5 py-0.2 rounded font-mono font-bold absolute -top-3">
                            Critical Path Blocker
                          </span>
                        </div>

                        <div className="flex flex-col items-center bg-white border border-rose-350 p-2.5 rounded-lg shadow-3xs max-w-[100px] text-center gap-1">
                          <span className="text-[8px] bg-rose-50 text-rose-650 px-1.5 py-0.2 rounded font-mono font-bold uppercase">PRJ-007</span>
                          <span className="truncate w-full font-bold">Synapse ML Models</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PROGRAM INSIGHTS & IMPACT */}
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  {/* Cross-Project Delay Ripple Simulator */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4" id="cross-project">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Cascade Impact Analysis</h4>
                        <h3 className="text-sm font-extrabold text-slate-800">
                          Cross-Project Delay Ripple Effect Simulator
                        </h3>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">[Cross-Project Impact Analysis / Program Insights Generator]</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Primary Bottleneck Project</label>
                        <select
                          value={primaryDelayProject}
                          onChange={(e) => setPrimaryDelayProject(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer outline-none shadow-2xs"
                        >
                          <option value="Sentinel Health">Sentinel Health Cloud</option>
                          <option value="Chronos Banking">Chronos Banking Rewrite</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">Estimated Delay</label>
                        <select
                          value={delayDuration}
                          onChange={(e) => setDelayDuration(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer outline-none shadow-2xs"
                        >
                          <option value="2 Weeks">2 Weeks</option>
                          <option value="4 Weeks">4 Weeks</option>
                          <option value="6 Weeks">6 Weeks</option>
                        </select>
                      </div>

                      <button
                        onClick={handleRunImpactSimulation}
                        disabled={simulatingImpact}
                        className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        <Network className="w-4 h-4" />
                        {simulatingImpact ? 'Analyzing Impact...' : 'Run Simulation'}
                      </button>
                    </div>

                    {impactResults && (
                      <div className="space-y-3 pt-3 animate-fade-in" id="recommendations">
                        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Cascading Delay Projection</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {impactResults.affectedProjects.map((proj: any, idx: number) => (
                            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-3xs">
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-slate-800 text-xs">{proj.name}</span>
                                <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full font-mono">
                                  {proj.delay}
                                </span>
                              </div>
                              <p className="text-xs text-slate-550 leading-relaxed font-sans">{proj.reason}</p>
                            </div>
                          ))}
                        </div>

                        {/* Program Insights recommendation */}
                        <div className="bg-purple-50/50 border border-purple-100/50 p-4 rounded-xl space-y-1.5 text-xs" id="program-insights">
                          <span className="font-bold text-purple-700 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-650" />
                            Delivery Optimizer Blueprint [Intelligent Recommendation Engine]
                          </span>
                          <p className="text-slate-655 font-medium leading-relaxed">{impactResults.recommendation}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Retro & Change Request Analyzer (Retrospective Analyzer / Change Request Intelligence / Stakeholder) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3 border-t border-slate-200">
                    {/* Retrospective Analyzer */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-3" id="retro-analyzer">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Retro & Sentiment Analyzer</h4>
                          <h3 className="text-xs font-extrabold text-slate-800">Sprint Retrospective Summary</h3>
                        </div>
                        <span className="text-[8px] text-slate-405 font-mono">[Project Retrospective Analyzer]</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        Ingests sprint retrospective notes to gauge morale and surface action plans.
                      </p>

                      <div className="p-3 bg-slate-50 border border-slate-205 rounded-lg space-y-1.5 text-xs font-semibold">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                          <span>Team Sentiment Score:</span>
                          <span className="font-mono text-emerald-600">84% Positive</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '84%' }}></div>
                        </div>
                        <p className="text-slate-600 font-medium text-[10.5px] leading-normal pt-1.5">
                          "DevOps pipelines are running stable, but database locking issues remain a primary pain point."
                        </p>
                      </div>
                    </div>

                    {/* Change Request Intelligence */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-3" id="change-requests">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Change order impact</h4>
                          <h3 className="text-xs font-extrabold text-slate-800">Change Request Intelligence</h3>
                        </div>
                        <span className="text-[8px] text-slate-405 font-mono">[Change Request Intelligence]</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        Simulates scope shift impact on project baselines and resource load.
                      </p>

                      <div className="p-3 bg-slate-50 border border-slate-205 rounded-lg space-y-2 text-xs font-semibold">
                        <span className="text-[9px] text-slate-400 font-mono block">Active request: CR-042 Checkout Expansion</span>
                        <div className="flex justify-between text-[10.5px]">
                          <span className="text-slate-600">Schedule impact:</span>
                          <span className="text-rose-650 font-bold">+12 business days</span>
                        </div>
                        <div className="flex justify-between text-[10.5px]">
                          <span className="text-slate-600">Resource load delta:</span>
                          <span className="text-amber-700 font-bold">+1.2 FTEs peak demand</span>
                        </div>
                        <button 
                          onClick={() => triggerToast('CR-042 impact blueprint created.')}
                          className="w-full mt-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-1 rounded text-[10px] font-bold cursor-pointer"
                        >
                          Simulate Base variance
                        </button>
                      </div>
                    </div>

                    {/* Stakeholder Communication Intelligence */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-3" id="stakeholder-comms">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Steering update briefs</h4>
                          <h3 className="text-xs font-extrabold text-slate-800">Stakeholder Communication</h3>
                        </div>
                        <span className="text-[8px] text-slate-405 font-mono">[Stakeholder Communication Intel]</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        Align stakeholder communications mapping frequency and recipient logs.
                      </p>

                      <div className="p-3 bg-slate-50 border border-slate-205 rounded-lg space-y-2 text-xs font-medium">
                        <div className="flex justify-between items-center text-[10px] text-slate-455">
                          <span>Steering Sync Interval:</span>
                          <span className="font-bold text-slate-800">Bi-Weekly</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-455">
                          <span>Steering list coverage:</span>
                          <span className="font-bold text-slate-800">9 Recipient accounts</span>
                        </div>
                        <button
                          onClick={() => triggerToast('Stakeholder communications report delivered.')}
                          className="w-full mt-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-1 rounded text-[10px] font-bold cursor-pointer"
                        >
                          Verify steering coverage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: COMMUNICATIONS & MEETING NOTES INTELLIGENCE */}
              {activeTab === 'communications' && (
                <div className="space-y-6">
                  {/* Meeting Notes summarizer */}
                  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4" id="meeting-notes">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Meeting Notes Intelligence</h4>
                        <h3 className="text-sm font-extrabold text-slate-800">Meeting Notes Transcripts summarizer</h3>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">[Meeting Notes Intelligence]</span>
                    </div>

                    <form onSubmit={handleMeetingNotesSubmit} className="space-y-3">
                      <textarea
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        placeholder="Paste sync transcripts, daily standup reports, or steering committee meeting notes here..."
                        className="w-full h-24 p-3 bg-white border border-slate-250 focus:border-indigo-500 rounded-xl text-xs font-semibold outline-none shadow-2xs resize-none"
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setTranscriptText('Chronos Banking sync: Catherine Vance approved database replication blueprint. Outage issues are resolved. Alex Rivera to begin integration test scripts. PMO to adjust contractor allocations.')}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-3xs"
                          >
                            Insert Demo Standup Transcript
                          </button>
                        </div>
                        <button
                          type="submit"
                          disabled={summarizingTranscript || !transcriptText.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer disabled:opacity-50 shadow-xs"
                        >
                          {summarizingTranscript ? 'Summarizing...' : 'Summarize Notes'}
                        </button>
                      </div>
                    </form>

                    {transcriptSummary && (
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-3xs animate-fade-in">
                        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">AI Summary Brief</h4>
                        <p className="text-xs text-slate-700 leading-normal">{transcriptSummary.brief}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-150">
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wider font-mono">Action Items</span>
                            <ul className="space-y-1">
                              {transcriptSummary.actionItems.map((act: string, idx: number) => (
                                <li key={idx} className="text-xs text-slate-655 flex gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 mt-1.5 shrink-0" />
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wider font-mono">Decisions Approved</span>
                            <ul className="space-y-1">
                              {transcriptSummary.decisions.map((dec: string, idx: number) => (
                                <li key={idx} className="text-xs text-slate-655 flex gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                  <span>{dec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slack/Teams & Exec Briefing & QA Assistant */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-3 border-t border-slate-200">
                    {/* C-Suite Q&A Console (Executive Q&A Assistant) */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-4" id="exec-qa">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">C-Level Q&A Console</h4>
                          <h3 className="text-xs font-extrabold text-slate-800 font-sans">Executive Q&A Assistant</h3>
                        </div>
                        <span className="text-[8px] text-slate-405 font-mono">[Executive Q&A Assistant]</span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Quick Questions</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'What is the budget outlook?',
                            'Show staffing & capacity'
                          ].map((query, i) => (
                            <button
                              key={i}
                              onClick={() => handleQaAsk(query)}
                              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10.5px] font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                            >
                              {query}
                            </button>
                          ))}
                        </div>
                      </div>

                      {qaLoading && (
                        <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-center text-xs animate-pulse font-mono text-slate-400">
                          Analyzing portfolio data models...
                        </div>
                      )}

                      {qaAnswer && (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-700 animate-fade-in space-y-2 max-h-[140px] overflow-y-auto">
                          {qaAnswer.split('\n').map((line, li) => {
                            if (line.startsWith('###')) return <strong key={li} className="block font-bold text-slate-850 border-b border-slate-200 pb-1 mb-1">{line.replace('### ', '')}</strong>;
                            if (line.startsWith('-')) return <div key={li} className="flex gap-1.5 pl-1"><span className="text-indigo-650">•</span><span>{line.replace('- ', '')}</span></div>;
                            return <p key={li}>{line}</p>;
                          })}
                        </div>
                      )}
                    </div>

                    {/* Email/Teams/Slack feed indicators */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-3" id="chat-channels">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Chat Analytics feeds</h4>
                          <h3 className="text-xs font-extrabold text-slate-800">Email / Teams / Slack Intelligence</h3>
                        </div>
                        <span className="text-[8px] text-slate-405 font-mono">[Email/Slack Intelligence]</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        Monitors team channels sentiment to highlight threat indicators and action-blocking conversations.
                      </p>

                      <div className="space-y-2 pt-1">
                        {[
                          { title: '#pmo-sentinel (Slack)', alert: 'SOC2 checklist validation delays flagged by leads.', time: '12m ago' },
                          { title: 'Project Sentinel Sync (Email)', alert: 'AWS credentials tagging guidelines outlined by security architect.', time: '2h ago' }
                        ].map((feed, fi) => (
                          <div key={fi} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10.5px] leading-normal font-medium">
                            <div className="flex justify-between items-center mb-1 text-[9.5px]">
                              <span className="font-extrabold text-slate-805">{feed.title}</span>
                              <span className="text-slate-400 font-mono">{feed.time}</span>
                            </div>
                            <p className="text-slate-600">{feed.alert}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Executive Briefing Generator */}
                    <div className="border border-slate-200 rounded-xl p-5 space-y-4 flex flex-col justify-between" id="exec-briefing">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-indigo-700 uppercase font-mono">Operational briefs</h4>
                            <h3 className="text-xs font-extrabold text-slate-800">Executive Briefing Generator</h3>
                          </div>
                          <span className="text-[8px] text-slate-405 font-mono">[Executive Briefing Generator]</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Synthesize active program updates, cost pacing indices, and staffing capacities into executive PDF slides.
                        </p>
                      </div>

                      <button
                        onClick={() => triggerToast('Executive brief compiled. Downloaded: CODIN_PMO_EXECUTIVE_SLIDES_Q2.pdf')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        Compile Executive Presentation Brief
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Sidebar Checklist (Right 25% on large screens) */}
      <div className="w-full xl:w-80 shrink-0 space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-150 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-mono">
              Audited Features Index
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Checklist of all 30 audited features for verification. Click a feature to jump to its UI simulation.
            </p>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {FEATURE_AUDIT_LIST.map((item) => (
              <button
                key={item.id}
                onClick={() => handleFeatureClick(item.suite, item.sectionId)}
                className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-150 bg-slate-50/50 hover:bg-indigo-50/20 hover:border-indigo-150 text-left transition-all duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-400 text-[9.5px] font-bold flex items-center justify-center font-mono shrink-0 group-hover:border-indigo-250 group-hover:text-indigo-650">
                    {item.id}
                  </span>
                  <span className="text-[10.5px] font-semibold text-slate-700 truncate group-hover:text-slate-900">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1.5">
                  <span className={`text-[8.5px] font-bold uppercase font-mono px-1.5 py-0.2 rounded-full ${
                    item.status === 'Exists Fully' 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {item.status === 'Exists Fully' ? 'Exist' : 'Audit OK'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
