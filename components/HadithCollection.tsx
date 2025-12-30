import React, { useState, useEffect } from 'react';
import { getHadith, HADITH_BOOKS } from '../services/api';
import { Hadith } from '../types';
import { BookOpen, Share2, Library, Bookmark } from 'lucide-react';

export const HadithCollection: React.FC = () => {
    const [hadiths, setHadiths] = useState<Hadith[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(HADITH_BOOKS[0].id);
    const [savedHadiths, setSavedHadiths] = useState<Hadith[]>([]);
    const [view, setView] = useState<'browse' | 'saved'>('browse');

    useEffect(() => {
        setLoading(true);
        getHadith(selectedBook).then(data => {
            setHadiths(data);
            setLoading(false);
        });

        const stored = localStorage.getItem('savedHadiths');
        if(stored) setSavedHadiths(JSON.parse(stored));
    }, [selectedBook]);

    const toggleSave = (hadith: Hadith) => {
        const exists = savedHadiths.some(h => h.body === hadith.body);
        let newSaved;
        if(exists) {
            newSaved = savedHadiths.filter(h => h.body !== hadith.body);
        } else {
            newSaved = [...savedHadiths, hadith];
        }
        setSavedHadiths(newSaved);
        localStorage.setItem('savedHadiths', JSON.stringify(newSaved));
    };

    const displayList = view === 'browse' ? hadiths : savedHadiths;

    return (
        <div className="space-y-6">
            {/* Header with Book Selector */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                <BookOpen size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black">Hadith</h2>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">The Prophet's Wisdom</p>
                            </div>
                        </div>
                        
                        <div className="flex bg-white/10 rounded-xl p-1">
                            <button onClick={() => setView('browse')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${view === 'browse' ? 'bg-white text-slate-900' : 'text-slate-300'}`}>Browse</button>
                            <button onClick={() => setView('saved')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${view === 'saved' ? 'bg-white text-slate-900' : 'text-slate-300'}`}>Saved ({savedHadiths.length})</button>
                        </div>
                    </div>

                    {/* Book Tabs - Only show if browsing */}
                    {view === 'browse' && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                            {HADITH_BOOKS.map(book => (
                                <button
                                    key={book.id}
                                    onClick={() => setSelectedBook(book.id)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                        selectedBook === book.id 
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-900/50' 
                                        : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/20'
                                    }`}
                                >
                                    {book.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading && view === 'browse' ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-emerald-500"></div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Collection...</p>
                </div>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-4">
                    {displayList.length === 0 && view === 'saved' && (
                        <div className="text-center py-10 text-slate-400 font-bold">No saved hadiths yet.</div>
                    )}
                    
                    {displayList.map((h, i) => {
                        const isSaved = savedHadiths.some(saved => saved.body === h.body);
                        return (
                            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <Library size={14} />
                                        </div>
                                        <span className="text-slate-600 font-bold text-sm">{h.book}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide">#{h.hadithNumber}</span>
                                        <button onClick={() => toggleSave(h)} className={`p-1.5 rounded-full transition-colors ${isSaved ? 'bg-amber-100 text-amber-600' : 'text-slate-300 hover:bg-slate-100'}`}>
                                            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                </div>
                                
                                <p className="text-slate-800 leading-loose font-medium text-lg mb-6 font-serif">
                                    "{h.body}"
                                </p>
                                
                                <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${h.grade.toLowerCase().includes('sahih') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {h.grade}
                                    </span>
                                    <button className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors text-xs font-bold uppercase">
                                        <Share2 size={16} /> Share
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};