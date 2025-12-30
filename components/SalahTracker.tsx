import React, { useState, useEffect } from 'react';
import { PrayerTimes, HijriDate, AppSection } from '../types';
import { getPrayerTimes } from '../services/api';
import { Sun, Sunrise, Sunset, Moon, MapPin, Calendar as CalendarIcon, Compass, CircleDot, Heart, Calculator, Sparkles, ChevronDown, BookOpen, Info, Check, Bot, TrendingUp, Globe } from 'lucide-react';

interface SalahTrackerProps {
    onNavigate: (section: AppSection) => void;
}

export const SalahTracker: React.FC<SalahTrackerProps> = ({ onNavigate }) => {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [hijri, setHijri] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayStatus, setTodayStatus] = useState<Record<string, string>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayerData, setNextPrayerData] = useState<{name: string, timeLeft: string}>({ name: '', timeLeft: '' });
  const [expandedPrayer, setExpandedPrayer] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await getPrayerTimes();
      setTimes(data.timings);
      setHijri(data.hijri);
      setLoading(false);
      
      const stored = localStorage.getItem('prayerStatus');
      if (stored) {
        try {
            const parsed = JSON.parse(stored);
            const todayKey = new Date().toDateString();
            if (parsed[todayKey]) setTodayStatus(parsed[todayKey]);
        } catch(e) {}
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!times) return;
    const prayerList = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const now = new Date();
    let nextP = '';
    let targetTime = new Date();
    let found = false;

    for (const p of prayerList) {
        const [h, m] = times[p].split(':').map(Number);
        const pDate = new Date();
        pDate.setHours(h, m, 0, 0);
        if (pDate > now) {
            nextP = p;
            targetTime = pDate;
            found = true;
            break;
        }
    }

    if (!found) {
        nextP = 'Fajr';
        const [h, m] = times['Fajr'].split(':').map(Number);
        targetTime = new Date();
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(h, m, 0, 0);
    }

    const diff = targetTime.getTime() - now.getTime();
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    setNextPrayerData({
        name: nextP,
        timeLeft: `-${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    });
  }, [currentTime, times]);

  const toggleStatus = (prayer: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = todayStatus[prayer] || 'none';
    let next = 'none';
    if (current === 'none') next = 'prayed';
    else if (current === 'prayed') next = 'late';
    else next = 'none';

    const newStatus = { ...todayStatus, [prayer]: next };
    setTodayStatus(newStatus);
    
    const stored = localStorage.getItem('prayerStatus') || '{}';
    try {
        const parsed = JSON.parse(stored);
        parsed[new Date().toDateString()] = newStatus;
        localStorage.setItem('prayerStatus', JSON.stringify(parsed));
    } catch(e) {
        localStorage.setItem('prayerStatus', JSON.stringify({ [new Date().toDateString()]: newStatus }));
    }
  };

  const getPillStyle = (prayer: string, status: string, baseGradient: string) => {
     if (status === 'prayed') return `bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] transform scale-105`;
     if (status === 'late') return `bg-amber-500 border-amber-400 text-white`;
     return `bg-white/5 border-white/10 text-white/70 hover:bg-white/10`; 
  };

  const prayers = [
    { name: 'Fajr', time: times?.Fajr, icon: Sunrise, gradient: 'from-[#0f172a] to-[#334155]', rakats: '2 Sunnah • 2 Fard', info: 'Pray before sunrise.' },
    { name: 'Dhuhr', time: times?.Dhuhr, icon: Sun, gradient: 'from-[#eab308] to-[#ca8a04]', rakats: '4 Sunnah • 4 Fard • 2 Sunnah', info: 'Midday prayer.' },
    { name: 'Asr', time: times?.Asr, icon: Sun, gradient: 'from-[#f97316] to-[#ea580c]', rakats: '4 Sunnah • 4 Fard', info: 'Afternoon prayer.' },
    { name: 'Maghrib', time: times?.Maghrib, icon: Sunset, gradient: 'from-[#7c3aed] to-[#6d28d9]', rakats: '3 Fard • 2 Sunnah', info: 'Just after sunset.' },
    { name: 'Isha', time: times?.Isha, icon: Moon, gradient: 'from-[#1e293b] to-[#0f172a]', rakats: '4 Sunnah • 4 Fard • 2 Sunnah', info: 'Night prayer.' },
  ];

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-900"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      
      {/* 1. RESPONSIVE HERO CARD */}
      <div 
        className="relative rounded-[3rem] p-6 sm:p-8 text-white shadow-2xl overflow-hidden flex flex-col items-center justify-between text-center border-[4px] border-white ring-1 ring-slate-100 transition-all"
        style={{ 
            background: 'linear-gradient(175deg, #172554 0%, #1e3a8a 40%, #0f172a 100%)',
            boxShadow: '0 30px 60px -15px rgba(23, 37, 84, 0.4)',
            minHeight: '65vh', // Dynamic height for mobile screens
            maxHeight: '800px'
        }}
      >
          {/* Top: Shahada */}
          <div className="relative z-10 w-full flex justify-center pt-2">
               <div className="bg-white/5 backdrop-blur-xl px-5 py-1.5 rounded-full border border-white/5 shadow-sm">
                   <p className="font-arabic text-lg font-black drop-shadow-md text-white/90">
                       لَا إِلٰهَ إِلَّا ٱللَّٰهُ
                   </p>
               </div>
          </div>

          {/* Center Flow */}
          <div className="relative z-10 w-full flex flex-col items-center gap-4 flex-1 justify-center">
              
              {/* Date Pill */}
              <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 mt-4">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">{hijri?.day} {hijri?.month.en} • {currentTime.toLocaleDateString('en-GB', {weekday: 'short'})}</span>
              </div>

              {/* Huge Time */}
              <h1 className="text-[18vw] sm:text-[6.5rem] leading-none font-black tracking-tighter drop-shadow-2xl tabular-nums bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent select-none">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h1>
              
              {/* Countdown */}
              <div className="flex flex-col items-center -mt-2 mb-4">
                   <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-emerald-400 tabular-nums leading-none drop-shadow-lg">
                       {nextPrayerData.timeLeft}
                   </div>
                   <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mt-1">Until {nextPrayerData.name}</span>
              </div>

              {/* Tracker Pills - Optimized for Touch */}
              <div className="w-full flex justify-between gap-1.5 px-1 mt-auto sm:mt-4 max-w-sm">
                  {prayers.map((p) => {
                      const status = todayStatus[p.name] || 'none';
                      return (
                          <button
                            key={p.name}
                            onClick={(e) => toggleStatus(p.name, e)}
                            className={`
                                flex-1 h-24 sm:h-28 rounded-2xl border flex flex-col items-center justify-between py-3 sm:py-4 transition-all duration-300 active:scale-95
                                ${getPillStyle(p.name, status, p.gradient)}
                            `}
                          >
                              <span className="font-bold text-[9px] uppercase tracking-wider opacity-80">{p.name}</span>
                              <span className="font-mono font-bold text-[10px] sm:text-xs">{p.time}</span>
                              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${status === 'prayed' ? 'bg-white text-emerald-600' : 'bg-white/10'}`}>
                                  {status === 'prayed' && <Check size={12} strokeWidth={4} />}
                              </div>
                          </button>
                      )
                  })}
              </div>
          </div>

          {/* Bottom Info Row */}
          <div className="relative z-10 w-full mt-6 flex justify-between items-end px-2">
               <div className="text-left">
                   <div className="flex items-center gap-1 text-blue-200 mb-0.5">
                       <MapPin size={10} />
                       <span className="text-[9px] font-bold uppercase tracking-wider">Ilford, UK</span>
                   </div>
                   <p className="text-xs font-bold text-white truncate max-w-[150px]">London Central Mosque</p>
               </div>
               <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md">
                   <Compass size={18} className="text-white" />
               </div>
          </div>
      </div>

      {/* 2. DASHBOARD - COMPACT & ORGANIZED */}
      <div className="pt-2 pb-8">
          <h3 className="text-2xl font-black text-slate-800 px-4 mb-4 font-serif">Explore Deen</h3>
          
          <div className="grid grid-cols-2 gap-3 px-1">
               
               {/* Iman AI - Compacted to 1 col */}
               <div onClick={() => onNavigate(AppSection.AI)} className="aspect-square rounded-[2rem] p-5 text-white shadow-lg shadow-violet-200 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br from-violet-500 to-fuchsia-600 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl -translate-y-4 translate-x-4" />
                   <div className="relative z-10 flex flex-col justify-between h-full">
                       <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <Bot size={20} className="text-white" />
                       </div>
                       <div>
                           <h4 className="font-black text-lg leading-tight">AI Hub</h4>
                           <p className="text-[9px] font-bold uppercase opacity-80 tracking-wider mt-0.5">Guidance & News</p>
                       </div>
                   </div>
               </div>

               {/* My Progress */}
               <div onClick={() => onNavigate(AppSection.TRACKER)} className="aspect-square rounded-[2rem] p-5 text-white shadow-lg shadow-emerald-200 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br from-emerald-400 to-teal-600 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl -translate-y-4 translate-x-4" />
                   <div className="relative z-10 flex flex-col justify-between h-full">
                       <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <TrendingUp size={20} className="text-white" />
                       </div>
                       <div>
                           <h4 className="font-black text-lg leading-tight">Progress</h4>
                           <p className="text-[9px] font-bold uppercase opacity-80 tracking-wider mt-0.5">Your Journey</p>
                       </div>
                   </div>
               </div>

               {/* Prophets */}
               <div onClick={() => onNavigate(AppSection.PROPHETS)} className="aspect-square rounded-[2rem] p-5 text-white shadow-lg shadow-orange-200 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br from-orange-400 to-amber-600 relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col justify-between h-full">
                       <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <BookOpen size={20} className="text-white" />
                       </div>
                       <div>
                           <h4 className="font-black text-lg leading-tight">Prophets</h4>
                           <p className="text-[9px] font-bold uppercase opacity-80 tracking-wider mt-0.5">25 Stories</p>
                       </div>
                   </div>
               </div>

               {/* Calendar */}
               <div onClick={() => onNavigate(AppSection.CALENDAR)} className="aspect-square rounded-[2rem] p-5 text-white shadow-lg shadow-sky-200 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br from-sky-400 to-blue-600 relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col justify-between h-full">
                       <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <CalendarIcon size={20} className="text-white" />
                       </div>
                       <div>
                           <h4 className="font-black text-lg leading-tight">Calendar</h4>
                           <p className="text-[9px] font-bold uppercase opacity-80 tracking-wider mt-0.5">Hijri 1447</p>
                       </div>
                   </div>
               </div>

               {/* 99 Names */}
               <div onClick={() => onNavigate(AppSection.NAMES)} className="aspect-square rounded-[2rem] p-5 text-white shadow-lg shadow-rose-200 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br from-rose-400 to-pink-600 relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <Heart size={20} className="text-white" />
                        </div>
                       <div>
                           <h4 className="font-black text-lg leading-tight">99 Names</h4>
                           <p className="text-[9px] font-bold uppercase opacity-80 tracking-wider mt-0.5">Asma Ul Husna</p>
                       </div>
                   </div>
               </div>

               {/* Qibla */}
               <div onClick={() => onNavigate(AppSection.QIBLA)} className="aspect-square rounded-[2rem] p-5 text-white shadow-lg shadow-slate-300 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br from-indigo-400 to-slate-600 relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <Compass size={20} className="text-white" />
                        </div>
                       <div>
                           <h4 className="font-black text-lg leading-tight">Qibla</h4>
                           <p className="text-[9px] font-bold uppercase opacity-80 tracking-wider mt-0.5">Finder</p>
                       </div>
                   </div>
               </div>
               
                {/* Zakat */}
               <div onClick={() => onNavigate(AppSection.ZAKAT)} className="aspect-square rounded-[2rem] p-5 text-white shadow-lg shadow-teal-200 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br from-teal-500 to-cyan-600 relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <Calculator size={20} className="text-white" />
                        </div>
                       <div>
                           <h4 className="font-black text-lg leading-tight">Zakat</h4>
                           <p className="text-[9px] font-bold uppercase opacity-80 tracking-wider mt-0.5">Calculator</p>
                       </div>
                   </div>
               </div>
               
               {/* Dua Library */}
               <div onClick={() => onNavigate(AppSection.DUA)} className="aspect-square rounded-[2rem] p-5 text-white shadow-lg shadow-indigo-200 cursor-pointer active:scale-95 transition-transform bg-gradient-to-br from-indigo-500 to-blue-600 relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <Sparkles size={20} className="text-white" />
                        </div>
                       <div>
                           <h4 className="font-black text-lg leading-tight">Dua Lib</h4>
                           <p className="text-[9px] font-bold uppercase opacity-80 tracking-wider mt-0.5">Daily Adhkar</p>
                       </div>
                   </div>
               </div>
          </div>
      </div>
    </div>
  );
};