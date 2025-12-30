import React, { useState, useEffect } from 'react';
import { AllahName } from '../types';
import { get99Names } from '../services/api';

export const Names99: React.FC = () => {
  const [names, setNames] = useState<AllahName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get99Names().then(data => {
        setNames(data);
        setLoading(false);
    });
  }, []);

  // Generate unique HSL color for each index to ensure every card is distinct and colorful
  const getColor = (index: number) => {
      const hue = (index * 137.508) % 360; // Golden angle approximation
      return {
          bg: `hsl(${hue}, 85%, 96%)`,
          border: `hsl(${hue}, 80%, 90%)`,
          text: `hsl(${hue}, 70%, 40%)`,
          circle: `hsl(${hue}, 80%, 90%)`
      };
  };

  if (loading) return <div className="p-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div></div>;

  return (
    <div>
        <div className="mb-6">
            <h2 className="text-3xl font-black text-slate-800">99 Names</h2>
            <p className="text-slate-500 font-medium">Learn the beautiful names of Allah</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {names.map((name, idx) => {
                const colors = getColor(idx);
                return (
                    <div key={name.number} 
                         className="relative p-4 rounded-3xl border flex flex-col items-center text-center shadow-sm transition-transform hover:scale-105"
                         style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                    >
                        <div className="absolute top-3 left-3 text-[10px] font-black opacity-40" style={{ color: colors.text }}>
                            #{name.number}
                        </div>

                        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-inner bg-white/50 backdrop-blur-sm">
                            <span className="font-arabic text-xl" style={{ color: colors.text }}>{name.name}</span>
                        </div>
                        
                        <h3 className="font-bold text-sm mb-0.5" style={{ color: colors.text }}>{name.transliteration}</h3>
                        <p className="text-[9px] font-bold uppercase opacity-80 leading-tight" style={{ color: colors.text }}>{name.en.meaning}</p>
                    </div>
                )
            })}
        </div>
    </div>
  );
};