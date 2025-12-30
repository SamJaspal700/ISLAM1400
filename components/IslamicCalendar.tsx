import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Moon, CalendarDays } from 'lucide-react';
import { getCalendarMonth, getUpcomingEvents } from '../services/api';

export const IslamicCalendar: React.FC = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [calendarData, setCalendarData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        setLoading(true);
        getCalendarMonth(currentMonth, currentYear).then(data => {
            setCalendarData(data);
            setLoading(false);
            
            // Mock fetching events for this Hijri Month/Year context
            if(data.length > 0) {
                 const m = data[0].date.hijri.month.number;
                 const y = data[0].date.hijri.year;
                 setEvents(getUpcomingEvents(m, y));
            }
        });
    }, [currentMonth, currentYear]);

    const monthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });

    const handlePrev = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNext = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const firstDayIndex = calendarData.length > 0 ? new Date(calendarData[0].date.gregorian.date.split('-').reverse().join('-')).getDay() : 0;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 pb-24">
             {/* Header Card */}
             <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10" />
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10">
                            <Moon size={28} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black">Hijri Calendar</h2>
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Lunar Guidance</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-6">
                {/* Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <button onClick={handlePrev} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>
                    <div className="text-center">
                        <h3 className="text-xl font-black text-slate-900">{monthName} {currentYear}</h3>
                        {calendarData.length > 0 && (
                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">
                                {calendarData[0].date.hijri.month.en}
                            </p>
                        )}
                    </div>
                    <button onClick={handleNext} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <ChevronRight size={24} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-4 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</div>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-100 border-t-indigo-600"></div></div>
                ) : (
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {Array(firstDayIndex).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                        {calendarData.map((dayData, i) => {
                            const dateObj = new Date(dayData.date.gregorian.date.split('-').reverse().join('-'));
                            const isToday = dateObj.toDateString() === today.toDateString();
                            const isFriday = dateObj.getDay() === 5;
                            
                            return (
                                <div key={i} className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 border ${isToday ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-300 border-indigo-600 scale-105 z-10' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200'}`}>
                                    <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-slate-800'}`}>{dayData.date.gregorian.day}</span>
                                    <span className={`text-[8px] font-black font-arabic ${isToday ? 'text-indigo-200' : isFriday ? 'text-emerald-500' : 'text-slate-400'}`}>{dayData.date.hijri.day}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Events List */}
            {events.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <CalendarDays size={20} className="text-indigo-600" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg">Upcoming Events</h4>
                    </div>
                    <div className="space-y-4">
                        {events.map((e, i) => (
                            <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] hover:bg-slate-100 transition-colors">
                                <div className="text-center min-w-[3.5rem] bg-white p-2 rounded-xl shadow-sm">
                                    <span className="block text-xl font-black text-slate-800">{e.gregorianDate.split(' ')[0]}</span>
                                    <span className="block text-[9px] font-bold text-slate-400 uppercase">{e.gregorianDate.split(' ')[1]}</span>
                                </div>
                                <div className="border-l-2 border-slate-200 pl-5">
                                    <p className="font-bold text-slate-900 text-lg">{e.name}</p>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">{e.hijriDate}</p>
                                    <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">{e.daysLeft} Days Left</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};