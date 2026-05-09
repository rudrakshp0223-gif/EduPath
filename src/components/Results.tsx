import React from 'react';
import { motion } from 'motion/react';
import { RecommendData } from '../types';
import { AIReasoningTooltip } from './Tooltip';
import { ExternalLink, Briefcase, MapPin, TrendingUp, ChevronRight, GraduationCap, RefreshCw } from 'lucide-react';

interface ResultsProps {
  data: RecommendData;
  onReset: () => void;
}

export function Results({ data, onReset }: ResultsProps) {
  return (
    <div className="flex-1 bg-[#F5F5F7] text-[#1D1D1F] p-4 sm:p-8 flex flex-col items-center overflow-x-hidden">
      <nav className="flex justify-between items-center mb-8 max-w-[1200px] w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-semibold tracking-tight">EduPath</span>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#D2D2D7]/50 text-sm font-medium text-[#1D1D1F] hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Start Over
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-[1200px] flex-1 pb-12">
        {/* Left Pane: Target Career */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          <div className="bg-white rounded-[32px] p-8 shadow-sm flex-1 border border-[#D2D2D7]/30 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md tracking-wider border border-blue-100 italic">Analysis Complete</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight mb-4">
              {data.targetCareer.title}
            </h1>
            <p className="text-[#424245] leading-relaxed mb-6 flex-1">
              {data.targetCareer.description}
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7]/20 relative">
                <p className="text-xs text-[#86868B] uppercase font-bold tracking-widest mb-2 flex items-center justify-between">
                  AI Reasoning
                  <AIReasoningTooltip reasoning={data.targetCareer.reasoning} className="ml-2" />
                </p>
                <p className="text-sm italic text-[#1D1D1F]">
                  "{data.targetCareer.reasoning}"
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center Pane: Roadmap */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="lg:col-span-3 bg-white rounded-[32px] p-8 shadow-sm border border-[#D2D2D7]/30 flex flex-col"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#86868B] mb-8 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Your Roadmap
          </h3>
          <div className="flex-1 flex flex-col relative py-2">
            <div className="absolute left-[11px] top-6 bottom-6 w-px bg-[#D2D2D7] border-dashed border-l"></div>
            <div className="space-y-8 flex-1 flex flex-col justify-between">
              {data.roadmap.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start z-10 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 mt-0.5 ${idx === 0 ? 'bg-black' : 'bg-[#E8E8ED] border border-[#D2D2D7]'}`}>
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-[#86868B]'}`}></div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#86868B] uppercase mb-1">Phase 0{idx + 1}: {step.phase}</p>
                    <p className="text-sm font-medium text-[#1D1D1F] leading-snug">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Pane: Programs, Institutes, Market Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          {/* Recommended Programs */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#D2D2D7]/30">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#86868B] mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Recommended Programs
            </h3>
            <div className="space-y-3">
              {data.programs.map((prog, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start justify-between p-4 bg-[#F5F5F7] rounded-2xl gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#1D1D1F] mb-1">{prog.name}</h3>
                    <p className="text-xs text-[#86868B] line-clamp-2">{prog.reasoning}</p>
                  </div>
                  <AIReasoningTooltip reasoning={prog.reasoning} className="shrink-0 sm:mt-0 mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Institutes */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#D2D2D7]/30">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#86868B] mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Top Institute Matches
            </h3>
            <div className="space-y-3">
              {data.institutes.map((inst, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-2xl gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-bold border border-[#D2D2D7]/20 uppercase shrink-0 text-[#1D1D1F]">
                      {inst.name.substring(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1D1D1F] truncate">{inst.name}</p>
                      <p className="text-[10px] text-[#86868B] truncate">{inst.bio}</p>
                    </div>
                  </div>
                  {inst.url && (
                     <a href={inst.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-white border border-[#D2D2D7] rounded-full text-[10px] font-bold hover:bg-gray-50 flex items-center gap-1 shrink-0 text-[#1D1D1F]">
                       Visit <ChevronRight className="w-3 h-3" />
                     </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-[#1D1D1F] rounded-[32px] p-6 shadow-xl flex-1 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Market Trend 2026-30
              </h3>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed bg-[#424245]/30 p-4 rounded-xl border border-white/5">{data.marketInsights.summary}</p>
            </div>
            
            <div className="flex items-end gap-2 h-16 mb-6">
              <div className="flex-1 bg-[#424245] h-[30%] rounded-t-sm"></div>
              <div className="flex-1 bg-[#424245] h-[45%] rounded-t-sm"></div>
              <div className="flex-1 bg-blue-500 h-[70%] rounded-t-sm"></div>
              <div className="flex-1 bg-blue-400 h-[85%] rounded-t-sm"></div>
              <div className="flex-1 bg-white h-[100%] rounded-t-sm"></div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-light">{data.marketInsights.salaryTrend}</p>
                <p className="text-[10px] uppercase opacity-60 tracking-wider">Salary Trend</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-light text-green-400">{data.marketInsights.jobDemand}</p>
                <p className="text-[10px] uppercase opacity-60 tracking-wider">Job Demand</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="mt-2 flex justify-between items-center text-[11px] text-[#86868B] w-full max-w-[1200px] font-medium">
        <div className="flex gap-4">
          <span>Source: Gemini 1.5 Flash</span>
          <span>Analysis ID: {Math.random().toString(36).substring(7).toUpperCase()}-EDU</span>
        </div>
        <p>© 2026 EduPath AI — Your Future, Computed.</p>
      </div>
    </div>
  );
}
