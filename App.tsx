import React, { useState, useRef } from 'react';
import { AppStage, AnalysisResult, Language, FileData } from './types';
import { analyzeResume } from './services/geminiService';
import { AnalysisView } from './components/AnalysisView';
import { InterviewSession } from './components/InterviewSession';
import { RoadmapView } from './components/RoadmapView';
import { AdUnit } from './components/AdUnit';
import { UploadCloud, Briefcase, Loader, Languages, Award, CheckCircle2, ArrowRight, Github, Twitter, Linkedin, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.UPLOAD);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [language, setLanguage] = useState<Language>('tr'); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setErrorMsg(null);
    }
  };

  const fileToGenerativePart = async (file: File): Promise<FileData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve({
            data: reader.result.split(',')[1],
            mimeType: file.type
          });
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setErrorMsg(null);
    
    try {
      const fileData = await fileToGenerativePart(selectedFile);
      const result = await analyzeResume(fileData, language);
      setAnalysisResult(result);
      setStage(AppStage.ANALYSIS);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || (language === 'tr' ? 'Bir hata oluştu.' : 'An error occurred.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setStage(AppStage.UPLOAD);
    setSelectedFile(null);
    setAnalysisResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'tr' : 'en');
  };

  const labels = {
    heroTitle: language === 'tr' ? 'Kariyerini Şekillendir.' : 'Forge Your Career.',
    heroSubtitle: language === 'tr' ? 'Yapay Zeka ile Mükemmelleş.' : 'Perfect it with AI.',
    heroDesc: language === 'tr' 
      ? 'CV dosyanı yükle. Yapay zeka potansiyelini analiz etsin, eksiklerini tamamlasın ve gerçek bir mülakat simülasyonu ile seni işe hazırlasın.' 
      : 'Upload your resume. Let AI analyze your potential, fix the gaps, and prepare you for the job with a realistic interview simulation.',
    features: language === 'tr' 
      ? ['Detaylı CV Analizi', 'Alanına Özel Mülakat', 'Kişisel Yol Haritası']
      : ['Detailed Resume Audit', 'Role-Specific Interview', 'Personalized Roadmap'],
    dropZoneDefault: language === 'tr' 
      ? 'CV Yüklemek için Tıklayın' 
      : 'Click to Upload Resume',
    dropZoneSub: language === 'tr' ? 'veya sürükleyip bırakın' : 'or drag and drop',
    dropZoneSelected: language === 'tr' ? 'Dosya Hazır:' : 'File Ready:',
    analyzeBtn: language === 'tr' ? 'Analizi Başlat' : 'Start Analysis',
    analyzingBtn: language === 'tr' ? 'İnceleniyor...' : 'Analyzing...',
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 bg-slate-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-[100] animate-fade-in-up">
           <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-red-400/50 flex items-start gap-3">
              <XCircle className="shrink-0 w-6 h-6 mt-0.5" />
              <div className="flex-1">
                 <h4 className="font-bold text-sm mb-1">{language === 'tr' ? 'Hata Oluştu' : 'Error'}</h4>
                 <p className="text-xs opacity-90 leading-relaxed">{errorMsg}</p>
              </div>
              <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                 <XCircle size={16} />
              </button>
           </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="glass-panel sticky top-0 z-50 border-b-0 border-b-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={resetApp}>
            <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              CV<span className="text-blue-400">Helps</span>
            </span>
          </div>
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-sm font-medium transition-all border border-white/10 hover:border-white/20"
          >
            <Languages size={16} className="text-slate-400" />
            <span className="text-slate-200">{language === 'en' ? 'EN' : 'TR'}</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 relative z-10 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 flex-1 flex flex-col">
          
          {stage === AppStage.UPLOAD && (
            <>
              <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-center justify-center min-h-[calc(100vh-250px)]">
                
                {/* Left Side: Marketing */}
                <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                      <Award size={14} /> {language === 'tr' ? 'v2.0 Yayında' : 'v2.0 Live'}
                  </div>
                  
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                    <span className="text-gradient">{labels.heroTitle}</span>
                    <br />
                    <span className="text-gradient-blue">{labels.heroSubtitle}</span>
                  </h1>
                  
                  <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    {labels.heroDesc}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-slate-300">
                      {labels.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-white/5">
                          <CheckCircle2 className="text-emerald-500" size={16} />
                          {feat}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Right Side: Interactive Upload */}
                <div className="w-full max-w-md mx-auto mt-12 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="glass-panel p-1 rounded-3xl shadow-2xl shadow-blue-900/20">
                    <div className="bg-slate-900/80 rounded-[22px] p-6 sm:p-8 border border-white/5 relative overflow-hidden">
                      
                      {/* Glow Effect */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                      <div 
                        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                        className={`
                          relative group border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                          ${selectedFile 
                            ? 'border-emerald-500/50 bg-emerald-900/10' 
                            : 'border-slate-700 hover:border-blue-500 hover:bg-slate-800/50'}
                        `}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileSelect} 
                          className="hidden" 
                          accept=".pdf,image/*" 
                        />
                        
                        {selectedFile ? (
                          <div className="text-center p-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                              <CheckCircle2 className="text-white w-8 h-8" />
                            </div>
                            <p className="text-emerald-400 font-medium mb-1">{labels.dropZoneSelected}</p>
                            <p className="text-white font-bold truncate max-w-[200px] mx-auto">{selectedFile.name}</p>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300 shadow-xl mx-auto">
                              <UploadCloud className="text-slate-400 group-hover:text-white w-8 h-8 transition-colors" />
                            </div>
                            <p className="text-white font-semibold text-lg">
                              {labels.dropZoneDefault}
                            </p>
                            <p className="text-slate-500 text-sm mt-2">{labels.dropZoneSub}</p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !selectedFile}
                        className={`
                          w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95
                          ${isAnalyzing || !selectedFile 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25'}
                        `}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader className="animate-spin" /> {labels.analyzingBtn}
                          </>
                        ) : (
                          <>
                            {labels.analyzeBtn} <ArrowRight size={18} />
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                </div>
              </div>
              
              {/* ADSENSE UNIT */}
              <AdUnit />
            </>
          )}

          {stage === AppStage.ANALYSIS && analysisResult && (
            <AnalysisView 
              analysis={analysisResult} 
              onStartInterview={() => setStage(AppStage.INTERVIEW)}
              onRetry={resetApp}
              language={language}
            />
          )}

          {stage === AppStage.INTERVIEW && analysisResult && (
            <InterviewSession 
              skills={analysisResult.skillsDetected}
              onFinish={() => setStage(AppStage.ROADMAP)}
              language={language}
            />
          )}

          {stage === AppStage.ROADMAP && analysisResult && (
            <RoadmapView 
              steps={analysisResult.roadmap}
              role={analysisResult.detectedRole}
              onRestart={resetApp}
              language={language}
            />
          )}

        </div>
      </main>
      
      {/* Simple Footer */}
      {stage === AppStage.UPLOAD && (
        <footer className="border-t border-white/5 bg-slate-950/50 py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="text-slate-500 text-sm">
               © 2024 CVHelps. All rights reserved.
             </div>
             <div className="flex gap-6">
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github size={20} /></a>
                <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors"><Linkedin size={20} /></a>
             </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;