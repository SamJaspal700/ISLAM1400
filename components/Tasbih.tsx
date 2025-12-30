import React, { useState, useEffect } from 'react';
import { RotateCcw, Save, History } from 'lucide-react';

export const Tasbih: React.FC = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
     try {
         const storedCount = localStorage.getItem('tasbihCount');
         if(storedCount) setCount(parseInt(storedCount, 10));
         
         const storedHistory = localStorage.getItem('tasbihHistory');
         if(storedHistory) setHistory(JSON.parse(storedHistory));
     } catch(e) {
         console.error("Storage error", e);
     }
  }, []);

  const updateCount = (newCount: number) => {
      setCount(newCount);
      localStorage.setItem('tasbihCount', newCount.toString());
  };

  const handleIncrement = () => {
      const next = count + 1;
      updateCount(next);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
             navigator.vibrate(5);
          } catch(e) {
              // Ignore vibration errors
          }
      }
  };

  const saveSession = () => {
      if(count === 0) return;
      // Using functional update to ensure we get the latest history
      setHistory(prevHistory => {
          const newHistory = [count, ...prevHistory].slice(0, 10);
          localStorage.setItem('tasbihHistory', JSON.stringify(newHistory));
          return newHistory;
      });
      updateCount(0);
  };

  const reset = () => updateCount(0);

  const radius = 120;
  const stroke = 18;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progressRatio = (count % target) / target;
  const visualProgress = (count > 0 && count % target === 0) ? 1 : progressRatio;
  const strokeDashoffset = circumference - (visualProgress * circumference);

  return (
    <div className="flex flex-col items-center h-full min-h-[70vh] py-6 relative">
        <div className="w-full flex justify-between items-center mb-10 px-2">
             <h2 className="text-xl font-bold text-slate-800">Tasbih Counter</h2>
             <div className="flex bg-slate-100 rounded-lg p-1">
                {[33, 100].map(t => (
                    <button 
                        key={t}
                        onClick={() => setTarget(t)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${target === t ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-400'}`}
                    >
                        {t}
                    </button>
                ))}
             </div>
        </div>

        {/* Counter Ring - Matches Screenshot Style */}
        <div className="relative group cursor-pointer mb-12" onClick={handleIncrement}>
            <div className="relative w-72 h-72 flex items-center justify-center">
                 {/* Grey Background Ring */}
                 <div className="absolute inset-0 rounded-full bg-slate-200 border-4 border-slate-50 shadow-inner"></div>
                 
                 {/* White Inner Circle for depth */}
                 <div className="absolute inset-4 rounded-full bg-slate-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)]"></div>

                 {/* Progress SVG */}
                 <svg height="280" width="280" className="transform -rotate-90 absolute z-10 pointer-events-none">
                     <circle stroke="transparent" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx="140" cy="140" />
                     <circle 
                        stroke="white" 
                        strokeWidth={stroke} 
                        strokeDasharray={circumference + ' ' + circumference} 
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.2s ease-out' }} 
                        strokeLinecap="round" 
                        fill="transparent" 
                        r={normalizedRadius} 
                        cx="140" cy="140" 
                        className="drop-shadow-lg"
                     />
                 </svg>

                 <div className="relative z-20 flex flex-col items-center select-none">
                     <span className="text-7xl font-black text-slate-800 tabular-nums">{count}</span>
                     <span className="text-teal-600 font-bold text-xs uppercase tracking-widest mt-2">Dhikr</span>
                 </div>
            </div>
            {/* Click Ripple */}
            <div className="absolute inset-0 rounded-full bg-teal-500/10 opacity-0 group-active:opacity-100 transition-opacity pointer-events-none scale-95" />
        </div>

        <div className="flex gap-4 w-full max-w-xs mb-8">
            <button onClick={reset} className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"><RotateCcw size={16} /> Reset</button>
            <button onClick={saveSession} className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-200 hover:bg-teal-700 transition-colors"><Save size={16} /> Save</button>
        </div>

        {/* History List */}
        {history.length > 0 && (
            <div className="w-full mt-4">
                <div className="flex items-center gap-2 mb-3 px-2">
                    <History size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase">Recent Sessions</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-2">
                    {history.map((h, i) => (
                        <div key={i} className="flex-shrink-0 w-14 h-14 bg-white rounded-xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                            <span className="font-bold text-slate-700">{h}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};