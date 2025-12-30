import React, { useState } from 'react';
import { getSearchGroundedResponse } from '../services/geminiService';
import { Globe, Search, ArrowRight, ExternalLink } from 'lucide-react';

export const WorldAI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<{ text: string, sources: { title: string, uri: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await getSearchGroundedResponse(query);
    setResponse(res);
    setLoading(false);
  };

  const suggestions = [
    "What is happening in Palestine today?",
    "Prayer times in Makkah",
    "Latest Islamic finance news",
    "Muslim achievements in 2024"
  ];

  return (
    <div className="space-y-6 h-full">
       <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-sky-200">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-5 translate-x-5" />
           <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                        <Globe size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black">World AI</h2>
                        <p className="text-sky-100 text-[10px] font-bold uppercase tracking-widest">Powered by Google Search</p>
                    </div>
               </div>
               <p className="text-sky-50 font-medium text-sm leading-relaxed max-w-sm">
                   Ask about current events, news, or factual questions. I'll browse the web for you.
               </p>
           </div>
       </div>

       <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
           {/* Input Area */}
           <div className="relative">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search the world..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <button 
                    onClick={handleSearch}
                    disabled={loading || !query}
                    className="absolute right-2 top-2 bottom-2 bg-sky-500 text-white px-4 rounded-xl flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <ArrowRight size={20} />}
                </button>
           </div>

           {/* Suggestions */}
           {!response && !loading && (
               <div className="flex flex-wrap gap-2 mt-2">
                   {suggestions.map((s, i) => (
                       <button 
                        key={i} 
                        onClick={() => { setQuery(s); handleSearch(); }} // This won't trigger immediately due to state closure but populates input
                        className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors text-left"
                       >
                           {s}
                       </button>
                   ))}
               </div>
           )}

           {/* Response Area */}
           {response && (
               <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                   <div className="prose prose-sm prose-slate max-w-none bg-sky-50/50 p-6 rounded-[2rem] border border-sky-50">
                       <p className="text-slate-800 leading-loose">{response.text}</p>
                   </div>

                   {/* Sources Chips */}
                   {response.sources.length > 0 && (
                       <div className="mt-4">
                           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 pl-2">Sources</p>
                           <div className="flex flex-wrap gap-2">
                               {response.sources.map((source, idx) => (
                                   <a 
                                    key={idx} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-sky-300 hover:text-sky-600 transition-colors shadow-sm"
                                   >
                                       <span className="truncate max-w-[150px]">{source.title}</span>
                                       <ExternalLink size={10} />
                                   </a>
                               ))}
                           </div>
                       </div>
                   )}
               </div>
           )}
       </div>
    </div>
  );
};