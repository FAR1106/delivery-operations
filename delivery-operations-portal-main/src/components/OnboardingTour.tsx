import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, Check } from 'lucide-react';

export interface TourStep {
  targetId?: string;
  title: string;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  isOpen: boolean;
}

export default function OnboardingTour({ steps, onComplete, isOpen }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updateTargetRect = () => {
    if (!isOpen || currentStep >= steps.length) return;
    
    const step = steps[currentStep];
    if (step.targetId) {
      const el = document.getElementById(step.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      } else {
        setTargetRect(null); // Center if target not found
      }
    } else {
      setTargetRect(null);
    }
  };

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    // Add a slight delay to re-calculate rect in case of layout shifts
    const timeout = setTimeout(updateTargetRect, 300);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      clearTimeout(timeout);
    };
  }, [currentStep, isOpen]);

  // Reset to first step if opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(s => Math.max(0, s - 1));
  };

  const getPositionStyles = (): React.CSSProperties => {
    if (!targetRect || step.position === 'center') {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const margin = 16;
    let top = targetRect.top;
    let left = targetRect.left;

    switch (step.position) {
      case 'bottom':
        top = targetRect.bottom + margin;
        left = targetRect.left + (targetRect.width / 2);
        return { top, left, transform: 'translateX(-50%)' };
      case 'top':
        top = targetRect.top - margin;
        left = targetRect.left + (targetRect.width / 2);
        return { top, left, transform: 'translate(-50%, -100%)' };
      case 'right':
        top = targetRect.top + (targetRect.height / 2);
        left = targetRect.right + margin;
        return { top, left, transform: 'translateY(-50%)' };
      case 'left':
        top = targetRect.top + (targetRect.height / 2);
        left = targetRect.left - margin;
        return { top, left, transform: 'translate(-100%, -50%)' };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* Semi-transparent overlay with mask for the target element */}
        <div className="absolute inset-0 pointer-events-auto transition-all duration-300 overflow-hidden">
           {targetRect && (
             <div 
               className="absolute bg-transparent rounded-lg transition-all duration-300 pointer-events-none"
               style={{
                 top: targetRect.top - 8,
                 left: targetRect.left - 8,
                 width: targetRect.width + 16,
                 height: targetRect.height + 16,
                 boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65)'
               }}
             />
           )}
           {!targetRect && (
             <div className="absolute inset-0 bg-slate-900/65 pointer-events-none" />
           )}
        </div>
        
        {/* Highlight ring for target element */}
        {targetRect && (
          <motion.div
            layout
            className="absolute rounded-lg border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-[10000] pointer-events-none"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )}

        {/* Popover Card */}
        <motion.div
          layout
          key={currentStep}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute z-[10001] w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-5 pointer-events-auto flex flex-col"
          style={getPositionStyles()}
        >
          <div className="flex items-center justify-between mb-3">
             <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">
               Step {currentStep + 1} of {steps.length}
             </div>
             <button onClick={onComplete} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
               <X className="w-4 h-4" />
             </button>
          </div>
          
          <h3 className="text-sm font-extrabold text-slate-900 mb-2">{step.title}</h3>
          <div className="text-xs text-slate-600 font-medium leading-relaxed mb-5">
            {step.content}
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
            <button 
              onClick={onComplete}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="w-7 h-7 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext}
                className="h-7 px-3 rounded-full flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 transition-colors gap-1 shadow-sm cursor-pointer"
              >
                <span className="text-[11px] font-bold">{isLast ? 'Complete' : 'Next'}</span>
                {isLast ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
