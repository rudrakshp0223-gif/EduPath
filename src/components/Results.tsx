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
    <div className="flex-1 text-foreground p-4 sm:p-8 flex flex-col items-center overflow-x-hidden">
      <nav className="flex justify-between items-center mb-8 max-w-[1200px] w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
          </div>
          <span className="text-xl font-semibold tracking-tight text-card-foreground">EduPath</span>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border/50 text-sm font-medium text-card-foreground hover:bg-card/80 transition-colors shadow-sm ml-auto mr-32 sm:mr-40 relative z-30"
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
          <div className="bg-card backdrop-blur-xl rounded-[32px] p-8 shadow-sm flex-1 border border-border/50 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-1 bg-blue-900/40 text-blue-300 text-[10px] font-bold uppercase rounded-md tracking-wider border border-blue-800/50 italic">Analysis Complete</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight mb-4 text-card-foreground">
              {data.targetCareer.title}
            </h1>
            <p className="text-foreground/90 leading-relaxed mb-6 flex-1">
              {data.targetCareer.description}
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-background/50 rounded-2xl border border-border/20 relative">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-2 flex items-center justify-between">
                  AI Reasoning
                  <AIReasoningTooltip reasoning={data.targetCareer.reasoning} className="ml-2" />
                </p>
                <p className="text-sm italic text-card-foreground">
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
           className="lg:col-span-3 bg-card backdrop-blur-xl rounded-[32px] p-8 shadow-sm border border-border/50 flex flex-col"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Your Roadmap
          </h3>
          <div className="flex-1 flex flex-col relative py-2">
            <div className="absolute left-[11px] top-6 bottom-6 w-px bg-border border-dashed border-l"></div>
            <div className="space-y-8 flex-1 flex flex-col justify-between">
              {data.roadmap.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start z-10 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-card shrink-0 mt-0.5 ${idx === 0 ? 'bg-primary' : 'bg-background border border-border'}`}>
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary-foreground' : 'bg-muted-foreground'}`}></div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Phase 0{idx + 1}: {step.phase}</p>
                    <p className="text-sm font-medium text-card-foreground leading-snug">{step.description}</p>
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
          <div className="bg-card backdrop-blur-xl rounded-[32px] p-6 shadow-sm border border-border/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Recommended Programs
            </h3>
            <div className="space-y-3">
              {data.programs.map((prog, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start justify-between p-4 bg-background/50 rounded-2xl gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-card-foreground mb-1">{prog.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{prog.reasoning}</p>
                  </div>
                  <AIReasoningTooltip reasoning={prog.reasoning} className="shrink-0 sm:mt-0 mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Institutes */}
          <div className="bg-card backdrop-blur-xl rounded-[32px] p-6 shadow-sm border border-border/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Top Institute Matches
            </h3>
            <div className="space-y-3">
              {data.institutes.map((inst, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-background/50 rounded-2xl gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center text-[10px] font-bold border border-border/20 uppercase shrink-0 text-card-foreground">
                      {inst.name.substring(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-card-foreground truncate">{inst.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{inst.bio}</p>
                    </div>
                  </div>
                  {inst.url && (
                     <a href={inst.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-card border border-border rounded-full text-[10px] font-bold hover:bg-card/80 flex items-center gap-1 shrink-0 text-card-foreground">
                       Visit <ChevronRight className="w-3 h-3" />
                     </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-primary rounded-[32px] p-6 shadow-xl flex-1 text-primary-foreground flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Market Trend 2026-30
              </h3>
              <p className="text-primary-foreground/90 text-sm mb-6 leading-relaxed bg-black/10 p-4 rounded-xl border border-white/5">{data.marketInsights.summary}</p>
            </div>
            
            <div className="flex items-end gap-2 h-16 mb-6">
              <div className="flex-1 bg-black/20 h-[30%] rounded-t-sm"></div>
              <div className="flex-1 bg-black/20 h-[45%] rounded-t-sm"></div>
              <div className="flex-1 bg-blue-400/80 h-[70%] rounded-t-sm"></div>
              <div className="flex-1 bg-blue-300/80 h-[85%] rounded-t-sm"></div>
              <div className="flex-1 bg-primary-foreground h-[100%] rounded-t-sm"></div>
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
      <div className="mt-2 flex justify-between items-center text-[11px] text-muted-foreground w-full max-w-[1200px] font-medium">
        <div className="flex gap-4">
          <span>Source: Gemini 1.5 Flash</span>
          <span>Analysis ID: {Math.random().toString(36).substring(7).toUpperCase()}-EDU</span>
        </div>
        <p>© 2026 EduPath AI — Your Future, Computed.</p>
      </div>
    </div>
  );
}
