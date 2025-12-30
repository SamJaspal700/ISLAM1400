import React, { useState } from 'react';
import { DuaAI } from './DuaAI'; // Import the AI component (we'll keep it as a sub-component)
import { DUA_CATEGORIES } from '../services/api';
import { Search, Sparkles, BookHeart, ChevronRight } from 'lucide-react';

export const DuaCollection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'library' | 'ai'>('library');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4">
             {/* Header */}
             <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <BookHeart size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black">Dua & Adhkar</h2>
                    </div>
                    <p className="text-indigo-200 text-sm font-bold pl-1">Supplications from Quran & Sunnah</p>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-2 mt-6 p-1 bg-black/20 rounded-xl backdrop-blur-sm w-max">
                    <button 
                        onClick={() => setActiveTab('library')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'library' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white'}`}
                    >
                        Library
                    </button>
                    <button 
                        onClick={() => setActiveTab('ai')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeTab === 'ai' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white'}`}
                    >
                        <Sparkles size={12} /> Ask AI
                    </button>
                </div>
            </div>

            {activeTab === 'ai' ? (
                <DuaAI />
            ) : (
                <div className="space-y-4">
                    {/* Categories */}
                    {!selectedCategory ? (
                        <div className="grid gap-4">
                            {DUA_CATEGORIES.map((cat) => (
                                <div 
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <cat.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-800 text-lg">{cat.title}</h3>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">{cat.duas.length} Duas</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                        <ChevronRight size={18} className="text-slate-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <button 
                                onClick={() => setSelectedCategory(null)}
                                className="text-slate-500 font-bold text-xs uppercase flex items-center gap-1 hover:text-indigo-600 mb-2"
                            >
                                <ChevronRight className="rotate-180" size={14} /> Back to Categories
                            </button>
                            
                            {DUA_CATEGORIES.find(c => c.id === selectedCategory)?.duas.map((dua, i) => (
                                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <h3 className="font-black text-slate-800 text-lg mb-4">{dua.title}</h3>
                                    <p className="font-arabic text-2xl text-right text-slate-800 leading-[2.5] mb-4" dir="rtl">{dua.arabic}</p>
                                    <p className="text-slate-500 text-sm italic mb-3 pl-3 border-l-2 border-slate-200">{dua.transliteration}</p>
                                    <p className="text-slate-800 font-medium leading-relaxed mb-4">{dua.translation}</p>
                                    <span className="inline-block bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Source: {dua.source}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};