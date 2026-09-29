/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCompany } from '../context/CompanyContext';
import { getCopilotResponse, CopilotResponse } from '../utils/copilotEngine';
import { 
  Sparkles, 
  X, 
  Send, 
  ArrowRight,
  Clock,
  Compass,
  Lock
} from 'lucide-react';
import { UserRole } from '../App';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: CopilotResponse['intent'];
  data?: any;
  actions?: CopilotResponse['actions'];
  suggestions?: string[];
  restricted?: {
    workspace: string;
    currentRole: string;
    requiredRoles: string[];
  };
}

interface DeliveryCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  initialQuery?: string;
  onClearQuery?: () => void;
  userRole: UserRole;
  userName: string;
}

const getSuggestionsForRole = (role: UserRole): string[] => {
  switch (role) {
    case 'Executive':
      return ['Portfolio summary', 'Which projects are at risk?', 'Show weekly status reports'];
    case 'PMO Director':
      return ['Portfolio summary', 'Show capacity planning forecast'];
    case 'Project Manager':
      return ['Which projects are at risk?', 'Show capacity planning forecast'];
    case 'Delivery Lead':
      return ['Show projects at risk', 'Show capacity planning forecast'];
    case 'Team Member':
      return ['Projects inventory health', 'Show projects at risk'];
    default:
      return ['Portfolio summary', 'Which projects are at risk?'];
  }
};

export default function DeliveryCopilot({ isOpen, onClose, onNavigate, initialQuery, onClearQuery, userRole, userName }: DeliveryCopilotProps) {
  const { projects, risks, resources, reports, selectedCompany, askCopilot } = useCompany();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages on mount or user change
  useEffect(() => {
    setMessages([
      {
        id: 'msg-initial',
        sender: 'assistant',
        text: `Welcome, ${userName.split(' ')[0]}. I am your **Delivery Copilot**, acting as a Portfolio Intelligence Assistant. I am grounded in platform metrics, capacity plans, status updates, and risk registries.\n\nAsk me questions about projects, risks, or portfolio performance to begin.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: 'portfolio',
        suggestions: getSuggestionsForRole(userRole)
      }
    ]);
  }, [userName, userRole]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle auto-sending of initial queries from the landing console
  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSend(initialQuery);
      if (onClearQuery) {
        onClearQuery();
      }
    }
  }, [isOpen, initialQuery]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await askCopilot(textToSend, selectedCompany);
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent,
        data: response.data,
        actions: response.actions,
        suggestions: response.suggestions,
        restricted: response.restricted
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending query to copilot backend:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(inputValue);
    }
  };

  // Parses basic markdown elements into HTML React blocks (bold, headers, lists, numbered)
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeLines: string[] = [];

    return lines.map((line, lineIdx) => {
      // Toggle code block
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const codeContent = codeLines.join('\n');
          codeLines = [];
          return (
            <pre key={lineIdx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-md font-mono text-[9.5px] text-slate-700 my-2 overflow-x-auto select-all leading-normal">
              <code>{codeContent}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return null;
      }

      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={lineIdx} className="text-[11.5px] font-bold text-slate-900 mt-2.5 mb-1.5">{parseInlineStyles(line.slice(4))}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={lineIdx} className="text-[12px] font-bold text-slate-900 mt-3 mb-1.5">{parseInlineStyles(line.slice(3))}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={lineIdx} className="text-[13px] font-bold text-slate-900 mt-3.5 mb-2">{parseInlineStyles(line.slice(2))}</h1>;
      }

      // Bullet points
      if (line.trim().startsWith('• ')) {
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 ml-2 mt-1 mb-0.5 leading-normal">
            <span className="text-[10px] text-purple-600 shrink-0 select-none">•</span>
            <span className="text-[11px] text-slate-705">{parseInlineStyles(line.trim().slice(2))}</span>
          </div>
        );
      }
      if (line.trim().startsWith('- ')) {
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 ml-2 mt-1 mb-0.5 leading-normal">
            <span className="text-[10px] text-purple-600 shrink-0 select-none">•</span>
            <span className="text-[11px] text-slate-705">{parseInlineStyles(line.trim().slice(2))}</span>
          </div>
        );
      }
      if (line.trim().startsWith('* ')) {
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 ml-2 mt-1 mb-0.5 leading-normal">
            <span className="text-[10px] text-purple-600 shrink-0 select-none">•</span>
            <span className="text-[11px] text-slate-705">{parseInlineStyles(line.trim().slice(2))}</span>
          </div>
        );
      }

      // Numbered lists
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={lineIdx} className="flex items-start gap-1.5 ml-2 mt-1 mb-0.5 leading-normal">
            <span className="text-[10.5px] text-purple-600 font-mono font-bold shrink-0 select-none">{numMatch[1]}.</span>
            <span className="text-[11px] text-slate-705">{parseInlineStyles(numMatch[2])}</span>
          </div>
        );
      }

      // Paragraph elements
      return line.trim() === '' ? (
        <div key={lineIdx} className="h-1.5" />
      ) : (
        <p key={lineIdx} className="mt-1 leading-normal text-slate-705">{parseInlineStyles(line)}</p>
      );
    }).filter(el => el !== null);
  };

  const parseInlineStyles = (inlineText: string) => {
    const parts = inlineText.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Renders visual metrics dashboard highlights inside the copilot panel
  const renderStructuredCard = (intent: Message['intent'], data: any) => {
    if (!data) return null;

    switch (intent) {
      case 'portfolio':
        return (
          <div className="grid grid-cols-2 gap-2.5 mt-3.5 pt-3.5 border-t border-slate-100 font-sans text-[11px]">
            <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg shadow-2xs">
              <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block">Avg Health</span>
              <span className="text-sm font-bold text-purple-650 block mt-1">{data.avgHealth}%</span>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-purple-500" style={{ width: `${data.avgHealth}%` }}></div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg shadow-2xs">
              <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block">Total Projects</span>
              <span className="text-sm font-bold text-slate-800 block mt-1">{data.total} Programs</span>
              <span className="text-[9px] text-slate-455 block mt-1.5">{data.onTrack} On Track</span>
            </div>
            <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg shadow-2xs">
              <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block">At Risk / Critical</span>
              <span className="text-sm font-bold text-rose-650 block mt-1">{data.attention} Flagged</span>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-rose-500" style={{ width: `${Math.round((data.attention / data.total) * 100)}%` }}></div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg shadow-2xs">
              <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block">Avg Resource Util</span>
              <span className="text-sm font-bold text-slate-800 block mt-1">{data.avgUtil}%</span>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-purple-500" style={{ width: `${data.avgUtil}%` }}></div>
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="mt-3.5 space-y-2 border-t border-slate-100 pt-3.5">
            <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block mb-1">Programs Needing Oversight</span>
            {data.map((p: any) => (
              <div key={p.id} className="bg-slate-50/60 border border-slate-150 p-2.5 rounded-lg flex justify-between items-center text-[10.5px] hover:border-slate-350 transition-colors">
                <div>
                  <span className="font-bold text-slate-850 block leading-tight">{p.name}</span>
                  <span className="text-slate-500 font-mono text-[9px] block mt-0.5">{p.id} • Lead: {p.deliveryLead}</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-semibold border ${
                    p.status === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {p.status}
                  </span>
                  <span className="block text-[8.5px] text-slate-400 font-mono mt-1">Health: {p.healthScore}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'lowest-health':
        return (
          <div className="mt-3.5 bg-slate-50/60 border border-slate-150 p-3 rounded-lg text-[10.5px] space-y-2 shadow-2xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-800">{data.name}</span>
              <span className="text-rose-650 font-bold text-[9.5px] bg-rose-50 px-2 py-0.5 border border-rose-150 rounded">{data.healthScore}/100 Health</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 text-[10px]">
              <div>Lead: <strong className="text-slate-850 font-semibold">{data.deliveryLead}</strong></div>
              <div>Client: <strong className="text-slate-850 font-semibold">{data.client}</strong></div>
              <div className="col-span-2 mt-1">
                <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                  <span>Sprint Velocity:</span>
                  <span className="font-mono">{data.sprintVelocity} / {data.targetVelocity} pts</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, (data.sprintVelocity / data.targetVelocity) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'risks':
        return (
          <div className="mt-3.5 space-y-2 border-t border-slate-100 pt-3.5">
            <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block mb-1">Active Blocker Directory</span>
            {data.map((r: any) => (
              <div key={r.id} className="bg-slate-50/60 border border-slate-150 p-3 rounded-lg text-[10.5px] space-y-1.5 hover:border-slate-350 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-slate-850 line-clamp-1 leading-tight">{r.riskName}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-bold uppercase font-mono border shrink-0 ${
                    r.severity === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {r.severity}
                  </span>
                </div>
                <p className="text-[9.5px] text-slate-500 leading-normal">Project: <strong className="text-slate-700">{r.projectName}</strong> • Lead: {r.owner}</p>
              </div>
            ))}
          </div>
        );

      case 'utilization':
        return (
          <div className="mt-3.5 space-y-2.5 border-t border-slate-100 pt-3.5">
            <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block mb-1">Overload Allocations</span>
            {data.overloaded?.map((res: any) => (
              <div key={res.resourceId} className="bg-slate-50/60 border border-slate-150 p-3 rounded-lg text-[10.5px]">
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="font-bold text-slate-850 block leading-tight">{res.name}</span>
                    <span className="text-slate-500 text-[9px] block mt-0.5">{res.role} • {res.department}</span>
                  </div>
                  <span className="text-rose-655 font-bold bg-rose-50 border border-rose-150 px-1.5 py-0.5 rounded text-[9.5px] font-mono">{res.allocationPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, res.allocationPercentage)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'capacity':
        return (
          <div className="mt-3.5 bg-slate-50/60 border border-slate-150 p-3 rounded-lg text-[10.5px] space-y-2.5 shadow-2xs">
            <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block border-b border-slate-200 pb-1">Capacity Shortfalls</span>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>Peak Month: <strong className="text-slate-800 font-bold font-mono">{data.peakMonth}</strong></div>
              <div>Shortfall: <strong className="text-rose-650 font-bold font-mono">-{data.gapFTE} FTEs</strong></div>
            </div>
            <div className="bg-purple-50/40 border border-purple-100/50 p-2.5 rounded-md text-[9.5px] text-slate-700 leading-normal">
              <span className="text-[8.5px] text-purple-650 font-bold uppercase font-mono block mb-0.5">Mitigation Plan</span>
              {data.recommendation}
            </div>
          </div>
        );

      case 'weekly-brief':
        return (
          <div className="mt-3.5 space-y-2 border-t border-slate-100 pt-3.5">
            <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block mb-1">Executive Brief Status</span>
            {data.slice(0, 3).map((r: any) => (
              <div key={r.id} className="bg-slate-50/60 border border-slate-150 p-3 rounded-lg text-[10px] space-y-1 hover:border-slate-350 transition-colors">
                <div className="flex justify-between items-center">
                  <strong className="text-slate-850 font-bold">{r.projectName}</strong>
                  <span className="text-[8.5px] text-slate-450 font-mono">{r.weekEnding}</span>
                </div>
                <p className="text-slate-600 leading-normal text-[9.5px] italic">"{r.executiveSummary}"</p>
              </div>
            ))}
          </div>
        );

      case 'project-detail': {
        const { project, aspect, spentPercent, risks: aspectRisks, velocityVariance } = data;
        return (
          <div className="mt-3.5 bg-slate-50/60 border border-slate-150 p-3.5 rounded-lg text-[10.5px] space-y-2.5 shadow-2xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
              <div>
                <span className="font-bold text-slate-850 block text-[11px] leading-tight">{project.name}</span>
                <span className="text-[9px] text-slate-450 font-mono block mt-0.5">{project.id} • Client: {project.client}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold border shrink-0 ${
                project.status === 'On Track' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                project.status === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {project.status}
              </span>
            </div>

            {aspect === 'budget' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-655 mb-0.5">
                  <span>Pacing: {spentPercent}% spent</span>
                  <span className="font-mono font-semibold">{project.budget.spent.toLocaleString()} / {project.budget.total.toLocaleString()} {project.budget.currency}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${spentPercent > 80 ? 'bg-rose-500' : 'bg-purple-650'}`} style={{ width: `${Math.min(100, spentPercent)}%` }}></div>
                </div>
              </div>
            )}

            {aspect === 'risks' && (
              <div className="space-y-2">
                <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block">Project Registry Risks</span>
                {aspectRisks && aspectRisks.length > 0 ? (
                  aspectRisks.map((r: any) => (
                    <div key={r.id} className="border-t border-slate-200 pt-2 first:border-0 first:pt-0 space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-700">{r.riskName}</span>
                        <span className="text-rose-650 font-mono text-[8px] uppercase font-bold">{r.severity}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-500 leading-tight">Mitigation: {r.mitigationPlan}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[9.5px] text-slate-500 italic">No project risks flagged.</p>
                )}
              </div>
            )}

            {aspect === 'velocity' && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-655 mb-0.5">
                  <span>Sprint Velocity:</span>
                  <span className="font-mono font-semibold">{project.sprintVelocity} / {project.targetVelocity} pts</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-650" style={{ width: `${Math.min(100, (project.sprintVelocity / project.targetVelocity) * 100)}%` }}></div>
                </div>
              </div>
            )}

            {aspect === 'general' && (
              <div className="space-y-2.5">
                <p className="text-[10px] text-slate-600 leading-relaxed">{project.description}</p>
                <div className="grid grid-cols-2 gap-2 border-t border-slate-150 pt-2 text-[9.5px] text-slate-550">
                  <div>Lead: <strong className="text-slate-700 font-semibold">{project.deliveryLead}</strong></div>
                  <div>Category: <strong className="text-slate-700 font-semibold">{project.category}</strong></div>
                  <div className="col-span-2 mt-1">
                    <span className="block text-[8.5px] text-slate-400 uppercase font-mono mb-1">Time Elapsed ({project.duration.elapsedPercentage}%)</span>
                    <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: `${project.duration.elapsedPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'resource-detail':
        return (
          <div className="mt-3.5 bg-slate-50/60 border border-slate-150 p-3.5 rounded-lg text-[10.5px] space-y-3 shadow-2xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
              <div>
                <span className="font-bold text-slate-850 block text-[11px] leading-tight">{data.name}</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">{data.role} • {data.department}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold border shrink-0 ${
                data.status === 'Overloaded' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                data.status === 'Underutilized' ? 'bg-amber-50 text-amber-705 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {data.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-655 mb-0.5">
                <span>FTE Allocation Load:</span>
                <span className="font-mono font-bold">{data.allocationPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${data.status === 'Overloaded' ? 'bg-rose-500' : 'bg-purple-650'}`} style={{ width: `${Math.min(100, data.allocationPercentage)}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block">Assigned Projects</span>
              <div className="flex flex-wrap gap-1">
                {data.projects.map((proj: string, pIdx: number) => (
                  <span key={pIdx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[9px] font-medium shadow-3xs">
                    {proj}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block">Expertise Skills</span>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill: string, sIdx: number) => (
                  <span key={sIdx} className="bg-purple-50/50 border border-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[8.5px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'client-detail':
        return (
          <div className="mt-3 bg-slate-50/60 border border-slate-150 p-3 rounded-lg text-[10.5px] space-y-2 shadow-2xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-800 text-[11px] leading-tight">{data.client} Account</span>
              <span className="text-purple-650 font-bold bg-purple-50 border border-purple-100 px-2 py-0.5 rounded font-mono text-[9px]">{data.avgHealth}% Health</span>
            </div>
            <span className="text-[9px] text-slate-400 uppercase font-mono font-semibold block mt-1">Managed Programs</span>
            <div className="space-y-1.5">
              {data.projects.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center text-[10px] bg-white border border-slate-150 p-2 rounded shadow-3xs hover:border-slate-350 transition-colors">
                  <span className="font-semibold text-slate-700 truncate max-w-[200px]">{p.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[7.5px] font-mono border ${
                    p.status === 'On Track' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    p.status === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-705 border-amber-100'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay background */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 z-40 backdrop-blur-[1.5px]"
          />

          {/* Slide panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 250 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white border-l border-slate-200 text-slate-800 z-50 flex flex-col shadow-2xl overflow-hidden font-sans"
            id="copilot-panel"
          >
            {/* Header - Grounded Enterprise branding */}
            <div className="p-4 border-b border-slate-150 bg-white flex items-center justify-between shrink-0 shadow-3xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6.5 h-6.5 bg-purple-50 border border-purple-100 text-purple-650 rounded flex items-center justify-center shadow-3xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[12px] font-bold text-slate-800 tracking-tight leading-none">Delivery Copilot</h2>
                    <span className="bg-purple-50 text-purple-700 border border-purple-200/50 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold select-none font-sans leading-none flex items-center gap-1">
                      Context: {selectedCompany}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono mt-1 uppercase tracking-wider">Portfolio Intelligence Assistant</p>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded text-slate-450 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat stage area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 min-h-0 bg-slate-50/25 scrollbar-thin scrollbar-thumb-slate-200">
              {messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-3.5 ${!isAssistant ? 'flex-row-reverse' : ''} animate-fade-in`}
                  >
                    {/* Mini avatar representation */}
                    <div className={`w-7 h-7 rounded border flex items-center justify-center shrink-0 font-mono text-[9px] font-bold shadow-3xs ${
                      isAssistant 
                        ? 'bg-purple-50 border-purple-100 text-purple-655' 
                        : 'bg-slate-100 border-slate-200 text-slate-550'
                    }`}>
                      {isAssistant ? 'AI' : 'US'}
                    </div>

                    {/* Chat Bubble & Custom Cards */}
                    <div className="space-y-2.5 max-w-[82%]">
                      <div className={`overflow-hidden rounded-xl leading-relaxed font-sans ${
                        msg.restricted 
                          ? 'w-full shadow-2xs border border-amber-250/85 bg-amber-50/40 text-slate-750' 
                          : isAssistant 
                            ? 'p-3.5 bg-white border border-slate-150 text-slate-750 shadow-sm' 
                            : 'p-3.5 bg-purple-50/30 border border-purple-100 text-slate-800 font-medium shadow-3xs'
                      }`}>
                        {msg.restricted ? (
                          <div className="p-4 space-y-3.5 text-left">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/10 shrink-0">
                                <Lock className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 leading-none">Access Restricted</h3>
                                <span className="text-[9px] text-amber-600 font-mono font-medium block mt-0.5 uppercase tracking-wider">Protected Workspace</span>
                              </div>
                            </div>
                            
                            <p className="text-slate-600 leading-relaxed font-medium">
                              This information belongs to a protected workspace and is not available under your current role permissions.
                            </p>

                            <div className="border-t border-slate-200/60 pt-3 grid grid-cols-2 gap-y-2.5 gap-x-2 text-[10px] text-slate-500">
                              <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Current User Role</span>
                                <strong className="text-slate-800 font-semibold">{msg.restricted.currentRole}</strong>
                              </div>
                              <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Requested Workspace</span>
                                <strong className="text-slate-850 font-semibold">{msg.restricted.workspace}</strong>
                              </div>
                              <div className="col-span-2">
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">Required Roles</span>
                                <div className="flex flex-wrap gap-1">
                                  {msg.restricted.requiredRoles.map((r, ri) => (
                                    <span key={ri} className="bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[8.5px] font-semibold">
                                      {r}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {parseMarkdown(msg.text)}

                            {/* Structured visual metric highlights */}
                            {isAssistant && renderStructuredCard(msg.intent, msg.data)}

                            {/* Multiple inline Action triggers inside bubble */}
                            {isAssistant && msg.actions && msg.actions.length > 0 && (
                              <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                                {msg.actions.map((act, actIdx) => (
                                  <button
                                    key={actIdx}
                                    onClick={() => onNavigate(act.target)}
                                    className="text-[9px] font-bold text-purple-650 hover:text-purple-750 flex items-center gap-1 cursor-pointer transition-colors bg-purple-50/40 hover:bg-purple-50/80 border border-purple-150 px-2 py-0.8 rounded-md shadow-3xs active:scale-97"
                                  >
                                    <span>{act.label}</span>
                                    <ArrowRight className="w-2.5 h-2.5" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Follow up suggestions pills */}
                      {isAssistant && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 pl-1">
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSend(sug)}
                              className="bg-white hover:bg-purple-50/40 border border-slate-200 hover:border-purple-200 text-slate-650 hover:text-purple-700 text-[9px] font-sans font-semibold px-2 py-0.8 rounded transition-all cursor-pointer shadow-3xs"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}

                      <span className={`text-[8px] text-slate-400 font-mono block px-1 ${!isAssistant ? 'text-right' : ''}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {isTyping && (
                <div className="flex items-start gap-3.5 animate-pulse">
                  <div className="w-7 h-7 rounded border bg-purple-50 border-purple-100 text-purple-650 flex items-center justify-center shrink-0 font-mono text-[9px] font-bold shadow-3xs">
                    AI
                  </div>
                  <div className="bg-white border border-slate-150 p-3 rounded-lg text-[10.5px] text-slate-500 italic font-sans flex items-center gap-2 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 animate-spin text-purple-600" />
                    Analyzing platform telemetry data...
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggestions & Input panel */}
            <div className="p-4 bg-white border-t border-slate-150 shrink-0 space-y-3.5 shadow-2xl">
              {/* Quick suggestions pills */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[9px] text-slate-455 font-bold uppercase tracking-wider font-mono">
                  <Compass className="w-3.5 h-3.5 text-purple-600" />
                  <span>Suggested Questions</span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto">
                  {getSuggestionsForRole(userRole).map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="bg-white hover:bg-purple-50/40 border border-slate-200 hover:border-purple-200 text-slate-655 hover:text-purple-700 text-[9.5px] font-sans font-semibold px-2.5 py-1 rounded transition-all cursor-pointer whitespace-nowrap shadow-3xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input section */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask about projects, budgets, risks, capacity planning..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-purple-200 focus:bg-white text-slate-800 rounded-lg px-3 py-2 text-[11px] outline-none font-sans font-medium placeholder-slate-400 transition-all focus:ring-1 focus:ring-purple-200/50 shadow-3xs"
                />
                <button
                  onClick={() => handleSend(inputValue)}
                  className="bg-purple-650 hover:bg-purple-700 border border-purple-700 text-white p-2 rounded-lg transition-colors cursor-pointer active:scale-95 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
