import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Building2 } from 'lucide-react';

interface CompanyTransitionProps {
  companyName: string;
  isActive: boolean;
  onComplete: () => void;
}

export default function CompanyTransition({ companyName, isActive, onComplete }: CompanyTransitionProps) {
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    'Loading Portfolio...',
    'Syncing GitHub...',
    'Syncing GitLab...',
    'Syncing Jira...',
    'Loading Executive Dashboard...'
  ];

  useEffect(() => {
    if (isActive) {
      setLoadingStep(0);
      
      const timings = [0, 400, 800, 1200, 1600];
      
      timings.forEach((time, index) => {
        setTimeout(() => {
          if (isActive) {
            setLoadingStep(index);
          }
        }, time);
      });

      const completeTimeout = setTimeout(() => {
        if (isActive) {
          onComplete();
        }
      }, 2000);

      return () => {
        clearTimeout(completeTimeout);
      };
    }
  }, [isActive, companyName, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-50 bg-slate-50/80 backdrop-blur-md flex flex-col items-center justify-center font-sans"
        >
          <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-8 max-w-sm w-full text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-center mb-6 relative">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
            </div>
            
            <h2 className="text-lg font-extrabold text-slate-900 mb-1 flex items-center justify-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              {companyName}
            </h2>
            <p className="text-xs text-slate-500 font-mono font-bold uppercase tracking-wider mb-6">
              Switching Workspace
            </p>

            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'linear' }}
              />
            </div>

            <div className="h-6 flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-bold text-slate-600"
                >
                  {steps[loadingStep]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
