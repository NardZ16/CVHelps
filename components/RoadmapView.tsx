import React from 'react';
import { RoadmapStep, Language } from '../types';
import { Flag, CheckCircle2, Clock, Map, RefreshCw, ChevronRight } from 'lucide-react';

interface RoadmapViewProps {
  steps: RoadmapStep[];
  role: string;
  onRestart: () => void;
  language: Language;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ steps, role, onRestart, language }) => {
  const labels = {
    title: language === 'tr' ? 'Kariyer Yol Haritası' : 'Career Roadmap',
    subtitle: language === 'tr' ? `Senin için hazırlanan ${role} gelişim planı` : `Personalized ${role} development plan`,
    restart: language === 'tr' ? 'Yeni Analiz Başlat' : 'Start New Analysis',
    duration: language === 'tr' ? 'Süre:' : 'Duration:',
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in px-4">
      
      <div className="text-center mb-16 pt-8">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4 border border-white/5">
             <Map className="text-blue-400 w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {labels.title}
        </h2>
        <p className="text-slate-400 text-lg">{labels.subtitle}</p>
      </div>

      <div className="relative">
        {/* Vertical Line - Hidden on Mobile, Visible on Desktop */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent -translate-x-1/2 rounded-full"></div>

        <div className="space-y-12 md:space-y-24">
          {steps.map((step, index) => (
            <div key={index} className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Timeline Marker */}
              <div className="absolute left-4 md:left-1/2 top-0 md:top-8 w-8 h-full md:w-auto md:h-auto flex flex-col items-center md:-translate-x-1/2 z-10">
                 <div className={`
                    w-12 h-12 rounded-full border-4 border-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center
                    ${index === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-blue-400'}
                 `}>
                    {index === 0 ? <Flag size={20} fill="currentColor" /> : <span className="font-bold text-lg">{index + 1}</span>}
                 </div>
                 {/* Mobile Line */}
                 <div className="md:hidden h-full w-0.5 bg-slate-800 my-2"></div>
              </div>

              {/* Spacer for desktop layout balance */}
              <div className="flex-1 hidden md:block"></div>

              {/* Card */}
              <div className="flex-1 w-full pl-16 md:pl-0 group">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 relative overflow-hidden">
                  
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <span className="text-6xl font-black text-white">{index + 1}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                     <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                        {step.title}
                     </span>
                     <span className="flex items-center gap-1 text-slate-400 text-xs font-mono bg-slate-900/50 px-2 py-1 rounded">
                        <Clock size={12} /> {step.duration}
                     </span>
                  </div>
                  
                  <p className="text-slate-200 text-base mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
                    <ul className="space-y-3">
                      {step.actionItems.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-300 group/item">
                          <ChevronRight className="w-4 h-4 mt-0.5 mr-2 text-blue-500 group-hover/item:translate-x-1 transition-transform" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center">
        <button 
          onClick={onRestart}
          className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-600 hover:border-slate-500 transition-all flex items-center justify-center gap-3 mx-auto shadow-lg"
        >
          <RefreshCw size={20} />
          {labels.restart}
        </button>
      </div>

    </div>
  );
};