import React, { useState } from 'react';
import { PROPHETS_DATA } from '../services/api';
import { ChevronDown, BookOpen } from 'lucide-react';

export const ProphetStories: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-[#1e3a8a] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <BookOpen size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black">Prophets</h2>
                    </div>
                    <p className="text-blue-200 text-sm font-bold pl-1">Qisas Al-Anbiya (Stories of the Prophets)</p>
                </div>
            </div>

            <div className="relative pl-4 space-y-6">
                {/* Vertical Line */}
                <div className="absolute left-[2.25rem] top-4 bottom-4 w-0.5 bg-slate-200" />

                {PROPHETS_DATA.map((prophet) => {
                    const isExpanded = expandedId === prophet.id;
                    return (
                        <div key={prophet.id} className="relative pl-12 group">
                            {/* Dot on Timeline */}
                            <div className={`absolute left-[1.65rem] top-6 w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 transition-colors ${isExpanded ? 'bg-[#1e3a8a]' : 'bg-slate-300'}`} />

                            <div 
                                onClick={() => setExpandedId(isExpanded ? null : prophet.id)}
                                className={`
                                    bg-white rounded-[2rem] border transition-all duration-300 cursor-pointer overflow-hidden
                                    ${isExpanded ? 'border-blue-200 shadow-xl ring-2 ring-blue-50' : 'border-slate-100 shadow-sm hover:shadow-md'}
                                `}
                            >
                                <div className="p-6 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{prophet.year}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900">{prophet.name}</h3>
                                        <p className="text-sm font-medium text-slate-500">{prophet.title}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-arabic text-2xl text-[#1e3a8a] font-bold">{prophet.arabicName}</p>
                                    </div>
                                </div>

                                <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-6 pb-6 pt-0">
                                        <div className="w-full h-px bg-slate-100 mb-4" />
                                        <p className="text-slate-700 leading-loose font-serif text-lg">
                                            {prophet.story}
                                        </p>
                                        <button className="mt-4 text-[#1e3a8a] text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline">
                                            Read Full Story <ChevronDown size={14} className="-rotate-90" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};