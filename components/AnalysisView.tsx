import React from 'react';
import { AnalysisResult, Language } from '../types';
import { CheckCircle2, AlertTriangle, ArrowRight, Lightbulb, Target, TrendingUp, BarChart3, Search, Briefcase, Star, Hash } from 'lucide-react';

interface AnalysisViewProps {
  analysis: AnalysisResult;
  onStartInterview: () => void;
  onRetry: () => void;
  language: Language;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, onStartInterview, onRetry, language }) => {
  
  const labels = {
    scoreTitle: language === 'tr' ? 'Uyumluluk Puanı' : 'Impact Score',
    summaryTitle: language === 'tr' ? 'Genel Bakış' : 'Executive Summary',
    strengths: language === 'tr' ? 'Öne Çıkanlar' : 'Top Strengths',
    improvements: language === 'tr' ? 'Acil Düzeltmeler' : 'Critical Fixes',
    breakdown: language === 'tr' ? 'Detaylar' : 'Breakdown',
    catFormat: language === 'tr' ? 'Düzen' : 'Format',
    catExpertise: language === 'tr' ? 'Bilgi' : 'Skills',
    catImpact: language === 'tr' ? 'Etki' : 'Impact',
    missingKeys: language === 'tr' ? 'Eksik Anahtar Kelimeler' : 'Missing Keywords',
    projects: language === 'tr' ? 'Önerilen Projeler' : 'Recommended Projects',
    career: language === 'tr' ? 'Kariyer Tavsiyesi' : 'Career Strategy',
    retryBtn: language === 'tr' ? 'Yeniden Yükle' : 'Upload New',
    startBtn: language === 'tr' ? 'Mülakatı Başlat' : 'Start Interview'
  };

  // SVG Gauge Config
  const radius = 70;
  const center = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (analysis.score / 100) * circumference;
  const color = analysis.score > 80 ? '#10b981' : analysis.score > 50 ? '#f59e0b' : '#ef4444';

  const ScoreBar = ({ label, score, colorClass }: { label: string, score: number, colorClass: string }) => (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
        <span>{label}</span>
        <span>{score}/100</span>
      </div>
      <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 mb-2">
              <Briefcase size={12} /> {analysis.detectedRole}
           </div>
           <h2 className="text-3xl font-bold text-white">
             {language === 'tr' ? 'Analiz Raporun' : 'Analysis Report'}
           </h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onRetry}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium border border-transparent hover:border-slate-700"
          >
            {labels.retryBtn}
          </button>
          <button 
            onClick={onStartInterview}
            className="group px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center"
          >
            {labels.startBtn}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* 1. Score Card (Main Highlight) - Tall on Desktop */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center md:col-span-1 md:row-span-2 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 className="text-slate-400 font-medium mb-4 uppercase tracking-wider text-xs z-10">{labels.scoreTitle}</h3>
          
          <div className="relative w-48 h-48 flex items-center justify-center z-10 my-4">
            <svg className="transform -rotate-90 w-full h-full drop-shadow-2xl" viewBox="0 0 180 180">
              <circle cx={center} cy={center} r={radius} stroke="#1e293b" strokeWidth={strokeWidth} fill="transparent" />
              <circle cx={center} cy={center} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-5xl font-extrabold text-white tracking-tighter drop-shadow-lg">{analysis.score}</span>
            </div>
          </div>

          <div className="w-full mt-auto space-y-4 text-left bg-slate-900/40 p-4 rounded-2xl border border-white/5">
             <ScoreBar label={labels.catFormat} score={analysis.categoryScores.formatting} colorClass="bg-blue-500" />
             <ScoreBar label={labels.catExpertise} score={analysis.categoryScores.expertise} colorClass="bg-purple-500" />
             <ScoreBar label={labels.catImpact} score={analysis.categoryScores.impact} colorClass="bg-amber-500" />
          </div>
        </div>

        {/* 2. Summary Card - Wide */}
        <div className="glass-panel p-6 rounded-3xl md:col-span-2 lg:col-span-3 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          <h3 className="flex items-center text-lg font-bold text-white mb-4">
             <TrendingUp className="text-blue-400 mr-2" /> {labels.summaryTitle}
          </h3>
          <p className="text-slate-300 leading-relaxed text-lg font-light">
             "{analysis.summary}"
          </p>
        </div>

        {/* 3. Strengths Card */}
        <div className="glass-panel p-6 rounded-3xl md:col-span-1 lg:col-span-1 border-t-4 border-t-emerald-500">
           <h3 className="flex items-center text-emerald-400 font-bold mb-4">
              <CheckCircle2 className="w-5 h-5 mr-2" /> {labels.strengths}
           </h3>
           <ul className="space-y-3">
              {analysis.strengths.slice(0, 3).map((item, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start bg-emerald-900/10 p-2 rounded border border-emerald-900/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span> {item}
                </li>
              ))}
           </ul>
        </div>

        {/* 4. Improvements Card */}
        <div className="glass-panel p-6 rounded-3xl md:col-span-1 lg:col-span-1 border-t-4 border-t-red-500">
           <h3 className="flex items-center text-red-400 font-bold mb-4">
              <AlertTriangle className="w-5 h-5 mr-2" /> {labels.improvements}
           </h3>
           <ul className="space-y-3">
              {analysis.improvements.slice(0, 3).map((item, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-start bg-red-900/10 p-2 rounded border border-red-900/20">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span> {item}
                </li>
              ))}
           </ul>
        </div>

        {/* 5. ATS Keywords - Wide */}
        <div className="glass-panel p-6 rounded-3xl md:col-span-1 lg:col-span-1 flex flex-col">
          <h3 className="flex items-center text-amber-400 font-bold mb-4">
             <Search className="w-5 h-5 mr-2" /> {labels.missingKeys}
          </h3>
          <div className="flex flex-wrap gap-2 content-start">
            {analysis.missingKeywords.length > 0 ? analysis.missingKeywords.slice(0, 5).map((kw, i) => (
              <span key={i} className="px-2 py-1 bg-amber-900/20 text-amber-200 border border-amber-900/30 rounded text-xs font-bold">
                #{kw}
              </span>
            )) : <span className="text-slate-500 text-sm">Clean scan.</span>}
          </div>
        </div>

        {/* 6. Career Strategy - Wide */}
        <div className="glass-panel p-6 rounded-3xl md:col-span-2 lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800">
           <h3 className="flex items-center text-blue-400 font-bold mb-4">
             <Target className="w-5 h-5 mr-2" /> {labels.career}
           </h3>
           <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-blue-500 pl-4">
             {analysis.careerAdvice}
           </p>
        </div>
        
        {/* 7. Projects - Full Width on Mobile, 2 Col on Large */}
        <div className="glass-panel p-6 rounded-3xl md:col-span-3 lg:col-span-2 border border-purple-500/20">
          <h3 className="flex items-center text-purple-400 font-bold mb-4">
             <Lightbulb className="w-5 h-5 mr-2" /> {labels.projects}
          </h3>
          <div className="space-y-3">
            {analysis.projectSuggestions.map((proj, i) => (
              <div key={i} className="bg-slate-950/50 p-3 rounded-xl border border-white/5 flex gap-3 items-start">
                <div className="bg-purple-500/20 p-1.5 rounded-lg text-purple-300 shrink-0 mt-0.5">
                  <Star size={14} />
                </div>
                <span className="text-sm text-slate-300">{proj}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};