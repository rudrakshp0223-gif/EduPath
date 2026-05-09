import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Tooltip({ children, content, className }: { children: React.ReactNode, content: string, className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50 font-medium"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AIReasoningTooltip({ reasoning, className }: { reasoning: string, className?: string }) {
  return (
    <Tooltip content={reasoning} className={className}>
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full cursor-help hover:bg-blue-100 transition-colors">
        <Info className="w-3.5 h-3.5" />
        AI Logic
      </span>
    </Tooltip>
  );
}
