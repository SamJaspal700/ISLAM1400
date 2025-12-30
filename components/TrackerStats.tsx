import React, { useState, useEffect } from 'react';
import { CheckCircle2, TrendingUp, Calendar, Shield, XCircle, Clock, Check } from 'lucide-react';
import { PrayerStatus } from '../types';

export const TrackerStats: React.FC = () => {
    const [history, setHistory] = useState<PrayerStatus>({});
    
    useEffect(() => {
        const stored = localStorage.getItem('prayerStatus');
        if (stored) setHistory(JSON.parse(stored));
    }, []);

    // Process data
    const historyEntries = Object.entries(history).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
    
    // Calculate Streak
    let currentStreak = 0;
    if (historyEntries.length > 0) currentStreak = historyEntries.length;

    // Total Stats
    let totalPrayed = 0;
    historyEntries.forEach(([_, day]) => {
        Object.values(day).forEach(status => {
            if (status === 'prayed') totalPrayed++;
        });
    });

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-800 px-2">Your Progress</h2>

            {/* Main Stats Card - Elegant & Big */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
                <div className="relative z-10 text-center">
                    <div className="w-28 h-28 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30 mx-auto ring-8 ring-slate-800">
                        <Shield size={56} fill="currentColor" className="text-white" />
                    </div>
                    <h2 className="text-7xl font-black mb-2 tracking-tighter">{currentStreak}</h2>
                    <p className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-sm">Day Streak</p>
                </div>
                {/* Background FX */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950" />
            </div>

            {/* Big Grid Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 h-40">
                     <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                        <TrendingUp size={32} />
                     </div>
                     <div>
                        <p className="text-5xl font-black text-slate-900">{totalPrayed}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Prayers</p>
                     </div>
                 </div>
            </div>

            {/* Simplified & Big History Log */}
            <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden p-4">
                <div className="p-4 flex items-center gap-3 mb-2">
                    <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                        <Calendar size={24} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-xl">Recent Days</h3>
                </div>
                
                <div className="space-y-4">
                    {historyEntries.slice(0, 5).map(([date, statusObj], i) => {
                        const pCount = Object.values(statusObj).filter(s => s === 'prayed').length;
                        const isPerfect = pCount === 5;
                        
                        return (
                            <div key={date} className="p-6 bg-slate-50 rounded-[2rem] flex items-center justify-between">
                                <div>
                                    <span className="block font-bold text-slate-500 text-xs uppercase tracking-wide mb-1">{new Date(date).toLocaleDateString('en-GB', {weekday: 'long'})}</span>
                                    <span className="block font-black text-slate-800 text-xl">{new Date(date).toLocaleDateString('en-GB', {day: 'numeric', month: 'long'})}</span>
                                </div>
                                <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl ${isPerfect ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-800 border border-slate-200'}`}>
                                    <span className="text-2xl font-black">{pCount}</span>
                                    <span className={`text-xs font-bold uppercase ${isPerfect ? 'text-emerald-100' : 'text-slate-400'}`}>Prayers</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};