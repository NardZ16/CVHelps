import React, { useState, useEffect, useRef } from 'react';
import { generateInterviewQuestion, evaluateAnswer } from '../services/geminiService';
import { InterviewMessage, Language } from '../types';
import { Send, User, Bot, Loader2, SkipForward, ArrowRight, MessageSquare } from 'lucide-react';

interface InterviewSessionProps {
  skills: string[];
  onFinish: () => void;
  language: Language;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({ skills, onFinish, language }) => {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const labels = {
    header: language === 'tr' ? 'Mülakat Simülasyonu' : 'Interview Simulation',
    subHeader: language === 'tr' ? 'Yapay Zeka İK Uzmanı' : 'AI Recruiter',
    endMessage: language === 'tr' ? 'Oturumumuz sona erdi. Şimdi yol haritana bakalım.' : 'That concludes our session. Let\'s check your roadmap.',
    placeholder: language === 'tr' ? 'Cevabınızı buraya yazın...' : 'Type your answer here...',
    thinking: language === 'tr' ? 'Yanıtı inceliyor...' : 'Reviewing answer...',
    viewRoadmap: language === 'tr' ? 'Yol Haritasını Gör' : 'View Career Roadmap',
    skip: language === 'tr' ? 'Atla' : 'Skip',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial Question
  useEffect(() => {
    const startInterview = async () => {
      setIsLoading(true);
      const question = await generateInterviewQuestion(skills, [], language);
      setMessages([{
        id: 'init',
        sender: 'ai',
        content: question
      }]);
      setQuestionCount(1);
      setIsLoading(false);
    };
    startInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: InterviewMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const lastAiQuestion = messages.filter(m => m.sender === 'ai').pop()?.content || "";
      const evaluation = await evaluateAnswer(lastAiQuestion, userMsg.content, language);

      setMessages(prev => prev.map(msg => 
        msg.id === userMsg.id ? { ...msg, feedback: evaluation } : msg
      ));

      if (questionCount < 5) {
        const previousQuestions = messages.filter(m => m.sender === 'ai').map(m => m.content);
        const nextQuestion = await generateInterviewQuestion(skills, previousQuestions, language);
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: nextQuestion
        }]);
        setQuestionCount(prev => prev + 1);
      } else {
        setMessages(prev => [...prev, {
          id: 'end',
          sender: 'ai',
          content: labels.endMessage
        }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[80vh] min-h-[500px] max-w-5xl mx-auto glass-panel rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden animate-fade-in">
      
      {/* Header - Fixed Height, Flex Item */}
      <div className="flex-none p-4 bg-slate-900/95 border-b border-white/5 flex justify-between items-center z-10">
        <div className="flex items-center space-x-4">
          <div className="relative">
             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/50">
                <Bot size={24} className="text-white" />
             </div>
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{labels.header}</h3>
            <p className="text-xs text-slate-400">{labels.subHeader}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex text-xs font-mono text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded border border-emerald-900/50">
            {questionCount}/5
          </div>
          <button 
            onClick={onFinish}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors flex items-center gap-2 border border-slate-700"
          >
            {labels.skip} <SkipForward size={14} />
          </button>
        </div>
      </div>

      {/* Chat Area - Flexible Height, Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} group`}>
            
            <div className={`flex max-w-[95%] sm:max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-md ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <MessageSquare size={16} />}
              </div>
              
              {/* Bubble */}
              <div className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-lg break-words ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
              }`}>
                {msg.content}
              </div>
            </div>

            {/* AI Feedback Card */}
            {msg.feedback && (
              <div className="mt-2 mr-12 max-w-[80%] sm:max-w-[60%] animate-fade-in origin-top-right">
                <div className={`
                    backdrop-blur-md border rounded-xl p-3 text-xs flex items-start gap-3 shadow-xl
                    ${msg.feedback.score >= 7 
                        ? 'bg-emerald-950/40 border-emerald-500/20' 
                        : 'bg-amber-950/40 border-amber-500/20'}
                `}>
                  <div className={`flex-shrink-0 font-bold px-2 py-1 rounded text-base ${msg.feedback.score >= 7 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {msg.feedback.score}
                  </div>
                  <div>
                      <p className={`font-semibold mb-1 ${msg.feedback.score >= 7 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {msg.feedback.score >= 7 ? 'Good Answer' : 'Needs Improvement'}
                      </p>
                      <p className="text-slate-300 leading-normal break-words">{msg.feedback.critique}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-emerald-600/50 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-slate-800/50 p-3 rounded-2xl rounded-tl-none text-slate-400 text-xs flex items-center gap-2">
              <Loader2 className="animate-spin" size={14} /> {labels.thinking}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed Height, Flex Item */}
      <div className="flex-none p-4 bg-slate-900/95 border-t border-white/5 z-10">
        {questionCount > 5 ? (
           <div className="flex justify-center w-full">
             <button 
              onClick={onFinish}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 w-full sm:w-auto justify-center"
            >
              {labels.viewRoadmap}
              <ArrowRight size={20} />
            </button>
           </div>
        ) : (
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={labels.placeholder}
              className="flex-1 bg-slate-950 text-white px-4 py-3.5 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-inner"
              disabled={isLoading}
              autoFocus
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="px-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};