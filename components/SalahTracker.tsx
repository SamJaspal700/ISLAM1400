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
     if (status === 'prayed') return `bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]`;
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. MAJESTIC HERO CARD */}
      <div 
        className="relative rounded-[3.5rem] p-8 text-white shadow-2xl overflow-hidden min-h-[660px] flex flex-col items-center justify-between text-center border-[6px] border-white ring-1 ring-slate-100"
        style={{ 
            background: 'linear-gradient(175deg, #172554 0%, #1e3a8a 40%, #0f172a 100%)',
            boxShadow: '0 40px 80px -20px rgba(23, 37, 84, 0.5)'
        }}
      >
          {/* Top: Shahada */}
          <div className="relative z-10 w-full flex justify-center pt-2">
               <div className="bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full border border-white/5 shadow-sm">
                   <p className="font-arabic text-xl font-black drop-shadow-md text-white/90">
                       لَا إِلٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَسُولُ ٱللَّٰهِ
                   </p>
               </div>
          </div>

          {/* Center Flow */}
          <div className="relative z-10 w-full flex flex-col items-center gap-6">
              
              {/* Date Pill */}
              <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">{hijri?.day} {hijri?.month.en} • {currentTime.toLocaleDateString('en-GB', {weekday: 'short'})}</span>
              </div>

              {/* Huge Time */}
              <h1 className="text-[6.5rem] leading-none font-black tracking-tighter drop-shadow-2xl tabular-nums bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h1>
              
              {/* Countdown */}
              <div className="flex flex-col items-center -mt-2 mb-4">
                   <div className="text-2xl font-mono font-bold tracking-tight text-emerald-400 tabular-nums leading-none drop-shadow-lg">
                       {nextPrayerData.timeLeft}
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mt-1">Until {nextPrayerData.name}</span>
              </div>

              {/* Tracker Pills */}
              <div className="w-full flex justify-center gap-2 mt-2">
                  {prayers.map((p) => {
                      const status = todayStatus[p.name] || 'none';
                      return (
                          <button
                            key={p.name}
                            onClick={(e) => toggleStatus(p.name, e)}
                            className={`
                                w-[4.5rem] h-28 rounded-2xl border flex flex-col items-center justify-between py-4 transition-all duration-300
                                ${getPillStyle(p.name, status, p.gradient)}
                            `}
                          >
                              <span className="font-bold text-[10px] uppercase tracking-wider opacity-80">{p.name}</span>
                              <span className="font-mono font-bold text-xs">{p.time}</span>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${status === 'prayed' ? 'bg-white text-emerald-600' : 'bg-white/10'}`}>
                                  {status === 'prayed' && <Check size={14} strokeWidth={4} />}
                              </div>
                          </button>
                      )
                  })}
              </div>
          </div>

          {/* Bottom Info Row */}
          <div className="relative z-10 w-full mt-4 flex justify-between items-end px-4">
               <div className="text-left">
                   <div className="flex items-center gap-1.5 text-blue-200 mb-1">
                       <MapPin size={12} />
                       <span className="text-[10px] font-bold uppercase tracking-wider">Ilford, UK</span>
                   </div>
                   <p className="text-sm font-bold text-white">London Central Mosque</p>
               </div>
               <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                   <Compass size={20} className="text-white" />
               </div>
          </div>
      </div>

      {/* 2. DASHBOARD - Natural Vibrant & Organized */}
      <div className="pt-4 pb-12">
          <h3 className="text-3xl font-black text-slate-800 px-4 mb-6 font-serif">Explore Deen</h3>
          
          <div className="grid grid-cols-2 gap-4">
               
               {/* Iman AI (Compact & Vibrant) */}
               <div onClick={() => onNavigate(AppSection.AI)} className="aspect-[1.1] rounded-[2.5rem] p-6 text-white shadow-xl cursor-pointer hover:scale-[1.03] transition-transform bg-gradient-to-br from-violet-500 to-fuchsia-600 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-5 translate-x-5" />
                   <div className="relative z-10 flex flex-col justify-between h-full">
                       <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <Bot size={24} className="text-white" />
                       </div>
                       <div>
                           <h4 className="font-black text-xl">AI Hub</h4>
                           <p className="text-[10px] font-bold uppercase opacity-80 tracking-wider">Guidance & News</p>
                       </div>
                   </div>
               </div>

               {/* My Progress (Emerald/Teal) */}
               <div onClick={() => onNavigate(AppSection.TRACKER)} className="aspect-[1.1] rounded-[2.5rem] p-6 text-white shadow-xl cursor-pointer hover:scale-[1.03] transition-transform bg-gradient-to-br from-emerald-400 to-teal-600 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-5 translate-x-5" />
                   <div className="relative z-10 flex flex-col justify-between h-full">
                       <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <TrendingUp size={24} className="text-white" />
                       </div>
                       <div>
                           <h4 className="font-black text-xl">Progress</h4>
                           <p className="text-[10px] font-bold uppercase opacity-80 tracking-wider">Your Journey</p>
                       </div>
                   </div>
               </div>

               {/* Prophets (Orange/Amber) */}
               <div onClick={() => onNavigate(AppSection.PROPHETS)} className="aspect-[1.1] rounded-[2.5rem] p-6 text-white shadow-xl cursor-pointer hover:scale-[1.03] transition-transform bg-gradient-to-br from-orange-400 to-amber-600 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-5 translate-x-5" />
                   <div className="relative z-10 flex flex-col justify-between h-full">
                       <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <BookOpen size={24} className="text-white" />
                       </div>
                       <div>
                           <h4 className="font-black text-xl">Prophets</h4>
                           <p className="text-[10px] font-bold uppercase opacity-80 tracking-wider">25 Stories</p>
                       </div>
                   </div>
               </div>

               {/* Calendar (Blue/Sky) */}
               <div onClick={() => onNavigate(AppSection.CALENDAR)} className="aspect-[1.1] rounded-[2.5rem] p-6 text-white shadow-xl cursor-pointer hover:scale-[1.03] transition-transform bg-gradient-to-br from-sky-400 to-blue-600 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-5 translate-x-5" />
                   <div className="relative z-10 flex flex-col justify-between h-full">
                       <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <CalendarIcon size={24} className="text-white" />
                       </div>
                       <div>
                           <h4 className="font-black text-xl">Calendar</h4>
                           <p className="text-[10px] font-bold uppercase opacity-80 tracking-wider">Hijri 1447</p>
                       </div>
                   </div>
               </div>

               {/* 99 Names (Rose/Pink) */}
               <div onClick={() => onNavigate(AppSection.NAMES)} className="aspect-[1.1] rounded-[2.5rem] p-6 text-white shadow-xl cursor-pointer hover:scale-[1.03] transition-transform bg-gradient-to-br from-rose-400 to-pink-600 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-5 translate-x-5" />
                   <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <Heart size={24} className="text-white" />
                        </div>
                       <div>
                           <h4 className="font-black text-xl">99 Names</h4>
                           <p className="text-[10px] font-bold uppercase opacity-80 tracking-wider">Asma Ul Husna</p>
                       </div>
                   </div>
               </div>

               {/* Qibla (Indigo/Slate) */}
               <div onClick={() => onNavigate(AppSection.QIBLA)} className="aspect-[1.1] rounded-[2.5rem] p-6 text-white shadow-xl cursor-pointer hover:scale-[1.03] transition-transform bg-gradient-to-br from-indigo-400 to-slate-600 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -translate-y-5 translate-x-5" />
                   <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                            <Compass size={24} className="text-white" />
                        </div>
                       <div>
                           <h4 className="font-black text-xl">Qibla</h4>
                           <p className="text-[10px] font-bold uppercase opacity-80 tracking-wider">Finder</p>
                       </div>
                   </div>
               </div>
          </div>
      </div>
    </div>
  );
};