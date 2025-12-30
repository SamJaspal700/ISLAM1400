import React, { useState, useEffect } from 'react';
import { Check, Star } from 'lucide-react';

export const Productivity: React.FC = () => {
    const goalsList = [
        { id: '1', text: "Pray all 5 prayers", type: 'salah' },
        { id: '2', text: "Read Surah Al-Mulk", type: 'quran' },
        { id: '3', text: "Do 100 Istighfar", type: 'dhikr' },
        { id: '4', text: "Read morning Azkar", type: 'dua' },
        { id: '5', text: "Learn 1 Name of Allah", type: 'names' },
    ];

    const [checked, setChecked] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const stored = localStorage.getItem('dailyGoals');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === new Date().toDateString()) {
                setChecked(data.items);
            }
        }
    }, []);

    const toggle = (id: string) => {
        const next = { ...checked, [id]: !checked[id] };
        setChecked(next);
        localStorage.setItem('dailyGoals', JSON.stringify({
            date: new Date().toDateString(),
            items: next
        }));
    };

    const completedCount = Object.values(checked).filter(Boolean).length;
    const progress = (completedCount / goalsList.length) * 100;

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-8 rounded-3xl text-white shadow-lg shadow-indigo-200">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Daily Goals</h2>
                        <p className="text-indigo-100 text-sm mt-1">Consistency is beloved to Allah.</p>
                    </div>
                    <div className="text-4xl font-black opacity-20">
                        {Math.round(progress)}%
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-white/90 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {goalsList.map((g) => (
                    <button 
                        key={g.id}
                        onClick={() => toggle(g.id)}
                        className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${
                            checked[g.id] 
                                ? 'bg-teal-50 border-teal-200' 
                                : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            checked[g.id] ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'
                        }`}>
                            <Check size={16} strokeWidth={3} />
                        </div>
                        <span className={`font-bold ${checked[g.id] ? 'text-teal-800 line-through opacity-70' : 'text-slate-700'}`}>
                            {g.text}
                        </span>
                        {checked[g.id] && <Star size={16} className="ml-auto text-yellow-400 fill-yellow-400" />}
                    </button>
                ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start">
                <div className="bg-white p-2 rounded-xl shadow-sm">💡</div>
                <div>
                    <h4 className="font-bold text-blue-900 text-sm mb-1">AI Suggestion</h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                        Try to read Ayat al-Kursi after every prayer today. It is a protection and a way to Jannah.
                    </p>
                </div>
            </div>
        </div>
    );
};