import React, { useState, useEffect } from 'react';
import { Palette, Type, Moon, Sun, Bell, Save, Check } from 'lucide-react';
import { AppSettings } from '../types';

export const Settings: React.FC = () => {
    const defaultSettings: AppSettings = {
        theme: 'light',
        fontSize: 'large',
        accentColor: 'blue',
        adhanPreferences: {
            Fajr: 'alafasy',
            Dhuhr: 'alafasy',
            Asr: 'alafasy',
            Maghrib: 'alafasy',
            Isha: 'alafasy'
        },
        quranReciter: 'ar.alafasy'
    };

    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [saved, setSaved] = useState(false);

    const colors = [
        { id: 'blue', name: 'Royal Blue', val: '#2563eb', light: '#dbeafe' },
        { id: 'teal', name: 'Emerald Teal', val: '#0d9488', light: '#ccfbf1' },
        { id: 'rose', name: 'Soft Rose', val: '#e11d48', light: '#ffe4e6' },
        { id: 'violet', name: 'Deep Violet', val: '#7c3aed', light: '#ede9fe' },
        { id: 'amber', name: 'Warm Amber', val: '#d97706', light: '#fef3c7' },
    ];

    useEffect(() => {
        try {
            const stored = localStorage.getItem('appSettings');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with default to ensure all keys exist
                const merged = { ...defaultSettings, ...parsed };
                setSettings(merged);
                applySettings(merged);
            } else {
                applySettings(defaultSettings);
            }
        } catch (e) {
            console.error("Settings load error", e);
            applySettings(defaultSettings);
        }
    }, []);

    const updateSetting = (key: keyof AppSettings, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        applySettings(newSettings);
        setSaved(false);
    };

    const updateAdhan = (prayer: string, reciter: string) => {
        const newPrefs = { ...settings.adhanPreferences, [prayer]: reciter };
        updateSetting('adhanPreferences', newPrefs);
    };

    const applySettings = (s: AppSettings) => {
        const root = document.documentElement;
        
        // Apply Fonts
        if(s.fontSize === 'normal') root.style.fontSize = '14px';
        if(s.fontSize === 'large') root.style.fontSize = '16px';
        if(s.fontSize === 'xl') root.style.fontSize = '18px';
        
        // Apply Theme
        if(s.theme === 'dark') {
            document.body.style.backgroundColor = '#1e293b';
            document.body.style.color = '#ffffff';
        } else {
            document.body.style.backgroundColor = '#F3F4F6';
            document.body.style.color = '#0f172a';
        }

        // Apply Global Colors via CSS Variables
        const selectedColor = colors.find(c => c.id === s.accentColor) || colors[0];
        root.style.setProperty('--primary', selectedColor.val);
        root.style.setProperty('--primary-light', selectedColor.light);
    };

    const saveSettings = () => {
        try {
            localStorage.setItem('appSettings', JSON.stringify(settings));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch(e) {
            console.error("Save failed", e);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Settings</h2>
                    <p className="text-slate-500 font-medium">Customize your experience</p>
                </div>
                <button 
                    onClick={saveSettings}
                    className="text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                    style={{ background: 'var(--primary)', boxShadow: '0 4px 14px 0 var(--primary-light)' }}
                >
                    <Save size={18} /> {saved ? 'Saved!' : 'Save'}
                </button>
            </div>

            {/* Colors Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                        <Palette size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">App Theme Color</h3>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    {colors.map(c => (
                        <button 
                            key={c.id}
                            onClick={() => updateSetting('accentColor', c.id)}
                            className={`
                                relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110
                                ${settings.accentColor === c.id ? 'ring-4 ring-offset-2 ring-slate-200 scale-105' : ''}
                            `}
                            style={{ backgroundColor: c.val }}
                        >
                            {settings.accentColor === c.id && (
                                <Check size={24} className="text-white drop-shadow-md" strokeWidth={3} />
                            )}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-400 font-bold mt-4 uppercase tracking-wide">Sets the main color for buttons and highlights.</p>
            </div>

            {/* Adhan Preferences */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                        <Bell size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">Notifications</h3>
                </div>
                
                <div className="grid gap-3">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => (
                        <div key={prayer} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <span className="font-bold text-slate-700">{prayer}</span>
                            <select 
                                value={(settings.adhanPreferences as any)[prayer]}
                                onChange={(e) => updateAdhan(prayer, e.target.value)}
                                className="bg-white border border-slate-200 rounded-lg text-xs font-bold p-2 text-slate-600 focus:outline-none focus:ring-2"
                                style={{ borderColor: 'var(--primary-light)' }}
                            >
                                <option value="alafasy">Mishary Alafasy</option>
                                <option value="makkah">Makkah Live</option>
                                <option value="madinah">Madinah Live</option>
                                <option value="istanbul">Istanbul Style</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Typography */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                        <Type size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">Typography</h3>
                </div>
                <div className="flex flex-col gap-3">
                    {['normal', 'large', 'xl'].map((size) => (
                        <button 
                            key={size}
                            onClick={() => updateSetting('fontSize', size)} 
                            className={`p-4 rounded-xl text-left border-2 transition-all ${settings.fontSize === size ? 'bg-slate-50' : 'border-slate-100'}`}
                            style={{ borderColor: settings.fontSize === size ? 'var(--primary)' : undefined }}
                        >
                            <span className="block font-bold text-slate-800 capitalize">{size} Text</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};