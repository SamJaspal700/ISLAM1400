import React, { useState } from 'react';
import { getDuaSuggestion } from '../services/geminiService';
import { Sparkles, Send, RefreshCw, User, Bot } from 'lucide-react';

export const DuaAI: React.FC = () => {
  const [feeling, setFeeling] = useState('');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const feelings = ["Anxious", "Grateful", "Sad", "Hopeful", "Stressed", "Lost"];

  const handleAsk = async () => {
    if (!feeling && !context) return;
    setLoading(true);
    const res = await getDuaSuggestion(feeling || "seeking guidance", context);
    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
       <div className="bg-[#0f172a] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-teal-500 rounded-xl">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Iman AI</h2>
                        <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest">Assistant</p>
                    </div>
               </div>
               <p className="text-slate-400 font-medium text-sm pl-1">
                   "Call upon Me; I will respond to you."
               </p>
           </div>
       </div>

       <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 min-h-[400px] flex flex-col relative">
           {!response ? (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                   <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Feeling</label>
                       <div className="flex flex-wrap gap-2">
                           {feelings.map(f => (
                               <button 
                                key={f}
                                onClick={() => setFeeling(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    feeling === f 
                                    ? 'bg-teal-500 text-white border-teal-500' 
                                    : 'bg-white text-slate-500 border-slate-200'
                                }`}
                               >
                                   {f}
                               </button>
                           ))}
                       </div>
                   </div>

                   <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Context</label>
                        <textarea 
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Type here..."
                            className="w-full p-4 rounded-xl bg-slate-50 border-none text-sm text-slate-700 h-24 focus:ring-1 focus:ring-teal-500"
                        />
                   </div>

                   <button 
                    onClick={handleAsk}
                    disabled={loading || (!feeling && !context)}
                    className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-200 disabled:opacity-50"
                   >
                       {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Send size={18} />}
                       <span>Ask Guidance</span>
                   </button>
               </div>
           ) : (
               <div className="flex flex-col h-full">
                   <div className="flex gap-3 mb-6 justify-end">
                       <div className="bg-slate-100 text-slate-600 p-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%]">
                           <span className="font-bold">{feeling}</span> {context ? `- ${context}` : ''}
                       </div>
                   </div>

                   <div className="flex gap-3 mb-6 flex-1">
                       <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                           <Bot size={16} className="text-teal-600" />
                       </div>
                       <div className="bg-teal-50 border border-teal-100 p-4 rounded-2xl rounded-tl-sm text-sm w-full">
                            <div className="prose prose-sm prose-slate max-w-none">
                                {response.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2 leading-relaxed text-slate-700">{line}</p>
                                ))}
                            </div>
                       </div>
                   </div>

                   <button 
                    onClick={() => setResponse('')}
                    className="mt-auto w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2"
                   >
                       <RefreshCw size={16} /> New Chat
                   </button>
               </div>
           )}
       </div>
    </div>
  );
};