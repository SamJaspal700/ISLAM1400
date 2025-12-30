import React from 'react';
import { AppSection } from '../types';
import { Home, BookOpen, Settings, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeSection, onNavigate }) => {
  const navItems = [
    { id: AppSection.SALAH, icon: Home, label: 'Home' },
    { id: AppSection.QURAN, icon: BookOpen, label: 'Quran' },
    { id: AppSection.AI, icon: Sparkles, label: 'AI Hub' },
    { id: AppSection.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans pb-32 md:pb-0 md:pl-28 selection:bg-[var(--primary-light)]">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-6 top-6 bottom-6 w-24 bg-white rounded-[2.5rem] flex-col items-center py-8 z-50 shadow-[0_8px_40px_rgba(0,0,0,0.06)] justify-between border border-slate-100 overflow-y-auto hide-scrollbar">
        <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 transform hover:scale-105 transition-transform"
            style={{ background: 'var(--primary)', boxShadow: '0 10px 25px -5px var(--primary-light)' }}
        >
            14
        </div>
        
        <div className="flex flex-col gap-6 w-full px-2 items-center flex-1 justify-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative group p-4 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 w-full ${
                activeSection === item.id 
                  ? 'bg-slate-50 shadow-sm scale-105' 
                  : 'text-slate-400 hover:bg-slate-50 hover:scale-105'
              }`}
            >
              <item.icon size={24} strokeWidth={activeSection === item.id ? 2.5 : 2} style={{ color: activeSection === item.id ? 'var(--primary)' : undefined }} className={activeSection !== item.id ? 'text-slate-400' : ''} />
              {activeSection === item.id && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full" style={{ background: 'var(--primary)' }}></span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto md:max-w-3xl md:p-10 pt-safe-top min-h-screen safe-area-bottom">
         
         {/* Mobile Top Header */}
         <div className="md:hidden sticky top-0 bg-[#F1F5F9]/90 backdrop-blur-xl z-40 px-6 py-4 flex justify-between items-center mb-2 transition-all">
            <div className="flex items-center gap-3">
                <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg"
                    style={{ background: 'var(--primary)' }}
                >1400</div>
                <div>
                    <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight font-serif">ISLAM1400</h1>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Majestic Edition</span>
                </div>
            </div>
         </div>
        
        <div className="px-4 pb-8 md:px-0 md:pb-10">
            {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Floating Pill */}
      <div className="fixed bottom-6 left-0 right-0 md:hidden z-50 pointer-events-none flex justify-center px-4 safe-area-bottom">
          <nav className="pointer-events-auto bg-white/95 text-slate-600 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] flex justify-between items-center px-6 h-18 py-4 backdrop-blur-xl border border-white/50 w-full max-w-sm gap-4 ring-1 ring-slate-900/5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex-1 flex items-center justify-center transition-all duration-300 ${
                    isActive 
                        ? 'scale-110' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    style={{ color: isActive ? 'var(--primary)' : undefined }}
                >
                    <div className="flex flex-col items-center gap-1">
                        <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} />
                        {isActive && <div className="w-1 h-1 rounded-full absolute -bottom-2.5" style={{ background: 'var(--primary)' }} />}
                    </div>
                </button>
              );
            })}
          </nav>
      </div>
    </div>
  );
};