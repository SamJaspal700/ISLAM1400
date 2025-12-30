import React, { useState } from 'react';
import { DuaAI } from './DuaAI';
import { WorldAI } from './WorldAI';
import { ImageGen } from './ImageGen';
import { Sparkles, Globe, Palette } from 'lucide-react';

export const AIHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'iman' | 'world' | 'art'>('iman');

    return (
        <div className="space-y-6 pb-24 h-full">
            {/* Header / Tab Switcher - Optimized for Mobile Thumbs */}
            <div className="bg-white p-1.5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between sticky top-4 z-30 mx-2 ring-1 ring-slate-50">
                <button 
                    onClick={() => setActiveTab('iman')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-[1.8rem] text-sm font-bold transition-all duration-300 ${activeTab === 'iman' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Sparkles size={16} />
                    <span>Iman</span>
                </button>
                
                <button 
                    onClick={() => setActiveTab('world')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-[1.8rem] text-sm font-bold transition-all duration-300 ${activeTab === 'world' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Globe size={16} />
                    <span>World</span>
                </button>

                <button 
                    onClick={() => setActiveTab('art')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-[1.8rem] text-sm font-bold transition-all duration-300 ${activeTab === 'art' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-rose-200 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Palette size={16} />
                    <span>Art</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[50vh]">
                {activeTab === 'iman' && <DuaAI />}
                {activeTab === 'world' && <WorldAI />}
                {activeTab === 'art' && <ImageGen />}
            </div>
        </div>
    );
};