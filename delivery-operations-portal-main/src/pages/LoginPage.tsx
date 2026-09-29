/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  Sparkles, 
  Mail, 
  Lock, 
  UserCheck, 
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { UserRole } from '../App';
import { GradientBackground } from '../components/ui/paper-design-shader-background';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const activityTexts = [
  'AI analyzing portfolio telemetry...',
  'Reviewing resource constraints...',
  'Scanning delivery blockers...',
  'Forecasting capacity demand...',
  'Generating executive insights...'
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [portal, setPortal] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('PMO Director');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // AI Activity index cycling
  const [activityIdx, setActivityIdx] = useState(0);

  // Mouse position tracking state for subtle parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize values between -0.5 and 0.5
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIdx((prev) => (prev + 1) % activityTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        portal,
        role: portal === 'user' ? role : undefined
      });

      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem('di_auth_token', response.data.token);
        }
        onLogin(response.data.user.role);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.error || 'Unable to connect to the authentication server';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 overflow-hidden font-sans relative">
      {/* 1. Paper Design Premium animated shader background (custom colors) */}
      <GradientBackground />

      {/* 2. Structured grid overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
          transition: 'transform 0.25s ease-out'
        }} 
      />

      {/* 3. Soft vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none bg-slate-950/20" 
        style={{
          backgroundImage: 'radial-gradient(circle at center, transparent 35%, rgba(2, 6, 23, 0.8) 100%)'
        }}
      />

      {/* Left Section: Hero Showcase (Clean spacing, top logo removed) */}
      <div className="w-[55%] xl:w-[58%] hidden md:flex flex-col justify-center p-10 lg:p-16 relative z-10">
        
        {/* Central Display: Grid dividing text and Radar centerpiece */}
        <div className="w-full grid grid-cols-12 items-center gap-6 lg:gap-8 my-auto">
          {/* Main Typography (Col 1-7 on desktop, 1-12 on tablet) */}
          <div className="col-span-12 xl:col-span-6 pr-4 text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="space-y-6"
            >
              <h1 className="text-4xl xl:text-5.5xl font-black text-white tracking-tight leading-[1.08] font-sans">
                Run Every Project.<br />
                See Every Risk.<br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-300 bg-clip-text text-transparent">
                  Before It Happens.
                </span>
              </h1>
              <p className="text-sm xl:text-base text-slate-300/85 leading-relaxed font-normal max-w-md">
                The enterprise operating system for portfolio governance, resource planning, delivery intelligence and AI-assisted execution.
              </p>
            </motion.div>
          </div>

          {/* Abstract Portfolio Operations Intelligence Radar visual centerpiece (Col 8-12) */}
          <div className="col-span-12 xl:col-span-6 flex flex-col justify-center items-center relative min-h-[440px] space-y-6">
            {/* Ambient soft glow backlights behind the radar */}
            <div className="absolute w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute w-52 h-52 rounded-full bg-violet-600/10 blur-2xl pointer-events-none animate-pulse delay-75" />

            {/* Parallax-enabled wrapper for Portfolio Radar */}
            <motion.div
              style={{
                transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
                transition: 'transform 0.15s ease-out'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-[280px] h-[280px] lg:w-[320px] lg:h-[320px] flex items-center justify-center relative overflow-hidden animate-float-slow-1 bg-slate-950/30 rounded-full border border-white/5 shadow-[inset_0_2px_12px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.45)]"
            >
              {/* Layered high-fidelity telemetry scan SVG */}
              <svg className="w-full h-full p-2 text-slate-100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="sweep-line" x1="100" y1="100" x2="100" y2="10" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Radar Grid Circles */}
                <circle cx="100" cy="100" r="85" fill="url(#radar-glow)" />
                <circle cx="100" cy="100" r="80" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.75" />
                <circle cx="100" cy="100" r="55" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.75" />
                <circle cx="100" cy="100" r="30" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.75" />

                {/* Axis lines */}
                <line x1="100" y1="15" x2="100" y2="185" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
                <line x1="15" y1="100" x2="185" y2="100" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />

                {/* Dashed outer rings rotating at offset velocities */}
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '24s' }}>
                  <circle cx="100" cy="100" r="70" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="0.75" strokeDasharray="6, 8" />
                </g>
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '16s', animationDirection: 'reverse' }}>
                  <circle cx="100" cy="100" r="45" stroke="rgba(167, 139, 250, 0.15)" strokeWidth="0.75" strokeDasharray="3, 5" />
                </g>

                {/* Glowing sweep scanner line */}
                <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '7s' }}>
                  <line x1="100" y1="100" x2="100" y2="20" stroke="url(#sweep-line)" strokeWidth="1.25" strokeLinecap="round" />
                </g>

                {/* Active telemetry Project Stream Nodes */}
                {/* 1: Kubernetes (Top-Left) */}
                <g className="animate-pulse">
                  <circle cx="60" cy="50" r="3.5" fill="#3b82f6" />
                  <circle cx="60" cy="50" r="7.5" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="0.75" />
                </g>
                <text x="35" y="38" fill="rgba(255,255,255,0.3)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.05em">KUBERNETES</text>

                {/* 2: Octokit (Top-Right) */}
                <g className="animate-pulse" style={{ animationDelay: '0.4s' }}>
                  <circle cx="145" cy="65" r="3.5" fill="#a855f7" />
                  <circle cx="145" cy="65" r="7.5" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="0.75" />
                </g>
                <text x="135" y="53" fill="rgba(255,255,255,0.3)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.05em">OCTOKIT</text>

                {/* 3: Cloud (Bottom-Left) */}
                <g className="animate-pulse" style={{ animationDelay: '0.8s' }}>
                  <circle cx="50" cy="130" r="3.5" fill="#10b981" />
                  <circle cx="50" cy="130" r="7.5" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="0.75" />
                </g>
                <text x="38" y="142" fill="rgba(255,255,255,0.3)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.05em">CLOUD</text>

                {/* 4: Engineering (Bottom-Right) */}
                <g className="animate-pulse" style={{ animationDelay: '1.2s' }}>
                  <circle cx="150" cy="135" r="3.5" fill="#f59e0b" />
                  <circle cx="150" cy="135" r="7.5" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="0.75" />
                </g>
                <text x="130" y="147" fill="rgba(255,255,255,0.3)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.05em">ENGINEERING</text>

                {/* Pulsing Telemetry Flow Packets */}
                <motion.circle cx={60} cy={50} r={1} fill="#60a5fa"
                  animate={{ cx: [60, 100], cy: [50, 100] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle cx={145} cy={65} r={1} fill="#c084fc"
                  animate={{ cx: [145, 100], cy: [65, 100] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay: 0.8 }}
                />
                <motion.circle cx={50} cy={130} r={1} fill="#34d399"
                  animate={{ cx: [50, 100], cy: [130, 100] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "linear", delay: 0.4 }}
                />
                <motion.circle cx={150} cy={135} r={1} fill="#fbbf24"
                  animate={{ cx: [150, 100], cy: [135, 100] }}
                  transition={{ duration: 3.0, repeat: Infinity, ease: "linear", delay: 1.2 }}
                />

                {/* Central Radar Target Ingestion Core */}
                <circle cx="100" cy="100" r="14" fill="rgba(99, 102, 241, 0.08)" stroke="#818cf8" strokeWidth="0.75" />
                <circle cx="100" cy="100" r="18" stroke="rgba(129, 140, 248, 0.2)" strokeWidth="0.75" strokeDasharray="2, 4" className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '10s' }} />
                <circle cx="100" cy="100" r="7" fill="#4f46e5" className="animate-pulse" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-slate-650 flex justify-center pt-4 border-t border-white/5 mt-4">
          <span>© 2026 Delivery Intel Inc. All rights reserved.</span>
        </div>
      </div>

      {/* Right Section: Glassmorphic Login Form */}
      <div className="flex-1 w-full md:w-[45%] xl:w-[42%] flex flex-col justify-center items-center p-6 md:p-12 relative z-10 overflow-y-auto min-h-screen">
        
        {/* Mobile Brand & Header (shown only on small screens) */}
        <div className="flex lg:hidden flex-col items-center text-center space-y-4 mb-8 relative z-20 w-full max-w-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 bg-indigo-655 rounded-lg flex items-center justify-center text-white font-mono font-bold text-sm shadow-md">
              DI
            </div>
            <span className="font-extrabold text-sm text-white uppercase tracking-wider">
              Delivery Intel
            </span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">
            Run Every Project.<br />See Every Risk.
          </h1>
          <p className="text-xs text-slate-350 px-4 leading-relaxed">
            The enterprise operating system for portfolio governance, resource planning, and AI-assisted execution.
          </p>
        </div>

        <div className="w-full max-w-md space-y-6 relative z-20">
          {/* Glassmorphic Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="backdrop-blur-2xl bg-slate-950/45 border border-white/10 shadow-[0_12px_40px_0_rgba(0,0,0,0.55)] rounded-2xl p-6 md:p-8 space-y-5"
          >
            {/* Header with Security access pill */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 self-start bg-indigo-500/10 border border-indigo-400/20 px-2 py-0.5 rounded-full mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">Secure Enterprise Access</span>
              </div>

              {/* Portal Selector Tabs */}
              <div className="flex border-b border-white/10 my-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPortal('user');
                    setEmail('');
                    setPassword('');
                    setError('');
                  }}
                  className={`flex-1 pb-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    portal === 'user'
                      ? 'text-indigo-400 border-b-2 border-indigo-500 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Enterprise Portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPortal('admin');
                    setEmail('admin@codincity.io');
                    setPassword('admin123');
                    setError('');
                  }}
                  className={`flex-1 pb-2 text-center text-xs font-bold transition-all cursor-pointer ${
                    portal === 'admin'
                      ? 'text-indigo-400 border-b-2 border-indigo-500 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Codin City Admin
                </button>
              </div>

              <h2 className="text-xl font-bold text-white font-sans tracking-tight">
                {portal === 'admin' ? 'Codin City Admin Access' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {portal === 'admin' 
                  ? 'Manage organizational integration endpoints & clients.' 
                  : 'Access the enterprise portfolio operations core.'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-lg text-xs font-semibold text-rose-400 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {portal === 'admin' ? 'Admin Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={portal === 'admin' ? 'admin@codincity.io' : 'name@company.com'}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/40 border border-white/10 hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-950/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-xs outline-none text-slate-100 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/40 border border-white/10 hover:border-slate-700 focus:border-indigo-500 focus:bg-slate-950/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-xs outline-none text-slate-100 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Role Dropdown (Only for general enterprise user portal) */}
              {portal === 'user' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role Access Mode</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full pl-9 pr-8 py-2.5 bg-slate-950/40 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-xs outline-none cursor-pointer appearance-none transition-all font-semibold text-slate-100"
                    >
                      <option value="Executive" className="bg-slate-900 text-white">Executive</option>
                      <option value="PMO Director" className="bg-slate-900 text-white">PMO Director</option>
                      <option value="Project Manager" className="bg-slate-900 text-white">Project Manager</option>
                      <option value="Delivery Lead" className="bg-slate-900 text-white">Delivery Lead</option>
                      <option value="Team Member" className="bg-slate-900 text-white">Team Member</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={loading ? {} : { y: -1, boxShadow: '0 4px 20px rgba(79, 70, 229, 0.35)' }}
                  whileTap={loading ? {} : { y: 0 }}
                  className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-150 border border-indigo-400/20 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {loading ? 'Authenticating...' : (portal === 'admin' ? 'Access Admin Dashboard' : 'Sign In to Platform')}
                </motion.button>

                {portal === 'user' && (
                  <button
                    type="button"
                    onClick={() => onLogin(role)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-xl text-xs flex items-center justify-center transition-all duration-150 border border-slate-600/50"
                  >
                    Bypass Login (Dev Mode)
                  </button>
                )}

                {/* Protected Governance Micro-copy */}
                <p className="text-[8.5px] text-slate-500 text-center leading-normal mt-1.5 select-none">
                  {portal === 'admin' 
                    ? 'Superuser session with database write access and API mapping privileges.' 
                    : 'Protected by role-based access control, audit logging and enterprise governance.'}
                </p>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
