/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, HealthStatus } from '../types';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Settings2, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Eye, 
  TrendingUp, 
  Users, 
  X,
  CreditCard,
  Calendar,
  Layers,
  ArrowUpDown,
  Mail,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock
} from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
  onSelectProjectReports?: (projectId: string) => void;
  onNavigate?: (page: string) => void;
}

type SortField = 'name' | 'client' | 'healthScore' | 'sprintVelocity' | 'teamSize' | 'lastUpdated';
type SortOrder = 'asc' | 'desc';

export default function Projects({ projects, onSelectProjectReports, onNavigate }: ProjectsProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('healthScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected project for drawer detail view
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const list = new Set(projects.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [projects]);

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending for numbers
    }
  };

  // Filter & Sort core logic
  const processedProjects = useMemo(() => {
    let result = [...projects];

    // 1. Search Query Search
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.client.toLowerCase().includes(query) ||
        p.deliveryLead.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(p => p.status === statusFilter);
    }

    // 3. Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // 4. Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle String Case-Insensitive sorting
      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [projects, searchTerm, statusFilter, categoryFilter, sortField, sortOrder]);

  // Paginated Projects computation
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProjects, currentPage]);

  const totalPages = Math.ceil(processedProjects.length / itemsPerPage) || 1;

  // Sync back page bounds
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusStyle = (status: HealthStatus) => {
    switch (status) {
      case 'On Track': return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
      case 'At Risk': return 'bg-amber-50 text-amber-700 border-amber-200 font-bold';
      case 'Critical': return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
    }
  };

  const getIndicatorIcon = (indicator: 'On Track' | 'At Risk' | 'Critical') => {
    switch (indicator) {
      case 'On Track': return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 status-glow-success"></div>;
      case 'At Risk': return <div className="w-2.5 h-2.5 rounded-full bg-amber-500 status-glow-warning"></div>;
      case 'Critical': return <div className="w-2.5 h-2.5 rounded-full bg-rose-500 status-glow-critical"></div>;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.02 } }
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
      id="projects-page-container"
    >
      {/* Table Title and Overview */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans" id="projects-title">Portfolio Delivery Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Direct access to the status parameters, sizing metrics, and execution speeds of active projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setCategoryFilter('All');
            }}
            className="border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md px-3.5 py-1.5 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            Reset Filters
          </motion.button>
        </div>
      </motion.div>

      {/* Control Search bar and Select controls */}
      <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center" id="filter-controls-card">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, leads, clients..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page 
            }}
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 rounded-md pl-10 pr-4 py-2 text-xs font-sans outline-none placeholder-slate-450 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold font-mono">Health:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer outline-none font-sans shadow-2xs"
            >
              <option value="All">All Health Statuses</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold font-mono">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer outline-none font-sans shadow-2xs"
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>{c === 'All' ? 'All Classes' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Data Table + Details Drawer */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Main interactive Table Card */}
        <div className={`${selectedProject ? 'xl:col-span-3' : 'xl:col-span-4'} bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider font-mono font-bold">
                  <th className="py-4 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">
                      Project name
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-4 px-4 cursor-pointer hover:text-slate-900" onClick={() => handleSort('client')}>
                    <div className="flex items-center gap-2">
                      Client
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-4 px-3 cursor-pointer hover:text-slate-900">Delivery Lead</th>
                  <th className="py-4 px-3 cursor-pointer text-center hover:text-slate-900" onClick={() => handleSort('healthScore')}>
                    <div className="flex items-center justify-center gap-1">
                      HealthScore
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-4 px-3 text-center">Indicators</th>
                  <th className="py-4 px-3 cursor-pointer text-center hover:text-slate-900" onClick={() => handleSort('sprintVelocity')}>
                    <div className="flex items-center justify-center gap-1">
                      Velocity
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-4 px-3 text-center cursor-pointer hover:text-slate-900" onClick={() => handleSort('teamSize')}>
                    <div className="flex items-center justify-center gap-1 text-center">
                      FTEs
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-right cursor-pointer hover:text-slate-900" onClick={() => handleSort('lastUpdated')}>
                    <div className="flex items-center justify-end gap-1">
                      Updated
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans">
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No program results located within applied parameters.
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((p, rowIdx) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut', delay: rowIdx * 0.05 }}
                      onClick={() => onNavigate && onNavigate('project-workspace-' + p.id)}
                      className="table-row-hover cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex flex-col">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono font-medium mt-0.5">{p.id} • {p.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{p.client}</td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-[9px] font-mono shadow-3xs">
                            {p.deliveryLead.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <span className="font-medium">{p.deliveryLead}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center border rounded px-2 py-0.5 font-bold text-[10px] ${getStatusStyle(p.status)}`}>
                            {p.status}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-slate-500">{p.healthScore}/100</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex flex-col items-center gap-0.5">
                            {getIndicatorIcon(p.indicators.scope)}
                            <span className="text-[8px] font-bold font-mono text-slate-400">Scp</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5">
                            {getIndicatorIcon(p.indicators.schedule)}
                            <span className="text-[8px] font-bold font-mono text-slate-400">Sch</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5">
                            {getIndicatorIcon(p.indicators.budget)}
                            <span className="text-[8px] font-bold font-mono text-slate-400">Bdg</span>
                          </div>
                          <div className="flex flex-col items-center gap-0.5">
                            {getIndicatorIcon(p.indicators.resources)}
                            <span className="text-[8px] font-bold font-mono text-slate-400">Res</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        <div className="flex flex-col items-center">
                          <span className="text-slate-900 font-bold">{p.sprintVelocity}</span>
                          <span className="text-[9px] text-slate-400 font-medium">tgt: {p.targetVelocity}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-700 font-bold">{p.teamSize}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-500 font-semibold text-[11px]">
                        {p.lastUpdated}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Controller Pagination Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong className="text-slate-900 font-bold">{Math.min(currentPage * itemsPerPage, processedProjects.length)}</strong> of <strong className="text-slate-900 font-bold">{processedProjects.length}</strong> listings
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-1 border border-slate-200 bg-white text-slate-600 rounded hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-3xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 2 <= totalPages + 1 ? currentPage + 1 : currentPage)}
                className="p-1 border border-slate-200 bg-white text-slate-600 rounded hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-3xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
