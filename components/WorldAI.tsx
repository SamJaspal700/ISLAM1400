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
    "News in Palestine",
    "Prayer times Makkah",
    "Islamic History facts",
    "Halal investing 2025"
  ];

  return (
    <div className="space-y-6 h-full pb-8">
       <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-sky-200">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-5 translate-x-5" />
           <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                        <Globe size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black">World AI</h2>
                        <p className="text-sky-100 text-[10px] font-bold uppercase tracking-widest">Live Grounding</p>
                    </div>
               </div>
               <p className="text-sky-50 font-medium text-sm leading-relaxed max-w-sm">
                   Ask about current events, news, or factual questions.
               </p>
           </div>
       </div>

       <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
           {/* Input Area */}
           <div className="relative group">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search the world..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
                <button 
                    onClick={handleSearch}
                    disabled={loading || !query}
                    className="absolute right-2 top-2 bottom-2 bg-sky-500 text-white w-10 rounded-xl flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-md"
                >
                    {loading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <ArrowRight size={18} />}
                </button>
           </div>

           {/* Suggestions */}
           {!response && !loading && (
               <div className="flex flex-wrap gap-2 mt-2">
                   {suggestions.map((s, i) => (
                       <button 
                        key={i} 
                        onClick={() => { setQuery(s); }} 
                        className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors text-left"
                       >
                           {s}
                       </button>
                   ))}
               </div>
           )}

           {/* Response Area */}
           {response && (
               <div className="mt-2 animate-in fade-in slide-in-from-bottom-2">
                   <div className="prose prose-sm prose-slate max-w-none bg-sky-50/30 p-6 rounded-[2rem] border border-sky-50">
                       <p className="text-slate-800 leading-loose whitespace-pre-wrap">{response.text}</p>
                   </div>

                   {/* Sources Chips */}
                   {response.sources.length > 0 && (
                       <div className="mt-4">
                           <p className="text-[10px] font-black uppercase text-slate-400 mb-2 pl-2">Sources</p>
                           <div className="flex flex-col gap-2">
                               {response.sources.map((source, idx) => (
                                   <a 
                                    key={idx} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 hover:border-sky-200 hover:bg-sky-50 transition-colors shadow-sm"
                                   >
                                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <ExternalLink size={10} />
                                       </div>
                                       <span className="truncate">{source.title}</span>
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