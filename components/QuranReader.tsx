import React, { useState, useEffect, useRef } from 'react';
import { Surah, SurahDetail, Bookmark, AppSettings } from '../types';
import { getSurahs, getSurahDetails, getEnglishTranslation, searchQuran } from '../services/api';
import { ChevronLeft, Play, Pause, Search, Volume2, Bookmark as BookmarkIcon, Settings as SettingsIcon } from 'lucide-react';

const RubElHizb: React.FC<{ number: number }> = ({ number }) => (
    <div className="relative flex items-center justify-center w-12 h-12 shrink-0 text-blue-800">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
            <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" opacity="0.1" fill="currentColor" stroke="none" />
            <path d="M12 22V2M2 12H22" stroke="none" /> 
            <rect x="4.5" y="4.5" width="15" height="15" transform="rotate(45 12 12)" stroke="currentColor" />
            <rect x="4.5" y="4.5" width="15" height="15" stroke="currentColor" />
        </svg>
        <span className="absolute text-[10px] font-black text-blue-900">{number}</span>
    </div>
);

export const QuranReader: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [activeSurah, setActiveSurah] = useState<SurahDetail | null>(null);
  const [translation, setTranslation] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'reader' | 'search'>('list');
  const [activeTab, setActiveTab] = useState<'surahs' | 'saved'>('surahs');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  const [reciter, setReciter] = useState('ar.alafasy');
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    getSurahs().then(setSurahs);
    const stored = localStorage.getItem('bookmarks');
    if (stored) setBookmarks(JSON.parse(stored));
    const s = localStorage.getItem('appSettings');
    if(s) {
        try {
            const parsed = JSON.parse(s) as AppSettings;
            if(parsed.quranReciter) setReciter(parsed.quranReciter);
        } catch(e) {}
    }
  }, []);

  const handleSearch = async (e: React.KeyboardEvent) => {
      if(e.key === 'Enter' && searchTerm.length > 2) {
          setLoading(true);
          setView('search');
          const results = await searchQuran(searchTerm);
          setSearchResults(results);
          setLoading(false);
      }
  };

  const openSurah = async (surahNumber: number) => {
    setLoading(true);
    setView('reader');
    try {
        const [arabicData, englishData] = await Promise.all([
            getSurahDetails(surahNumber, reciter),
            getEnglishTranslation(surahNumber)
        ]);
        setActiveSurah(arabicData);
        setTranslation(englishData);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const changeReciter = (id: string) => {
      setReciter(id);
      setShowReciterMenu(false);
      const s = localStorage.getItem('appSettings');
      let newSettings: AppSettings = s ? JSON.parse(s) : {} as any;
      newSettings = { ...newSettings, quranReciter: id };
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      if(activeSurah) openSurah(activeSurah.number);
  };

  const toggleBookmark = (ayahNumber: number, text: string) => {
      if(!activeSurah) return;
      const isBookmarked = bookmarks.some(b => b.surahNumber === activeSurah.number && b.ayahNumber === ayahNumber);
      let newBookmarks;
      if (isBookmarked) {
          newBookmarks = bookmarks.filter(b => !(b.surahNumber === activeSurah.number && b.ayahNumber === ayahNumber));
      } else {
          newBookmarks = [...bookmarks, {
              surahNumber: activeSurah.number,
              ayahNumber,
              surahName: activeSurah.englishName,
              text,
              timestamp: Date.now()
          }];
      }
      setBookmarks(newBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const playAudio = (url: string) => {
      if(audioRef.current) {
          if (currentAudioUrl === url && isPlaying) {
              audioRef.current.pause();
              setIsPlaying(false);
          } else {
              if(currentAudioUrl !== url) {
                  audioRef.current.src = url;
                  setCurrentAudioUrl(url);
              }
              audioRef.current.play();
              setIsPlaying(true);
          }
      }
  };

  const backToList = () => {
    if(audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
    }
    setView('list');
    setActiveSurah(null);
    setSearchTerm('');
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.number.toString().includes(searchTerm)
  );

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div>
            <h2 className="text-3xl font-black text-slate-800 px-2">The Noble Quran</h2>
            <div className="flex gap-4 mt-4 px-1 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('surahs')} 
                    className={`pb-3 text-sm font-bold transition-all ${activeTab === 'surahs' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-slate-400'}`}
                >
                    Surahs
                </button>
                <button 
                    onClick={() => setActiveTab('saved')} 
                    className={`pb-3 text-sm font-bold transition-all ${activeTab === 'saved' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-slate-400'}`}
                >
                    Saved Ayahs
                </button>
            </div>
        </div>
        
        {activeTab === 'surahs' && (
            <>
                <div className="relative group">
                    <div className="relative bg-white rounded-[1.5rem] shadow-sm border border-slate-100 focus-within:border-blue-800 transition-colors">
                        <input 
                            type="text" 
                            value={searchTerm}
                            onKeyDown={handleSearch}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Surah..." 
                            className="w-full bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none rounded-[1.5rem]" 
                        />
                        <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                    </div>
                </div>

                <div className="space-y-3 pb-8">
                    {filteredSurahs.map((s) => (
                        <div key={s.number} onClick={() => openSurah(s.number)} className="bg-white p-5 rounded-[2rem] flex items-center justify-between border border-slate-50 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-900 hover:bg-blue-50">
                            <div className="flex items-center gap-5">
                                <RubElHizb number={s.number} />
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-900 transition-colors">{s.englishName}</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wide group-hover:text-blue-400">{s.englishNameTranslation} • {s.numberOfAyahs}</p>
                                </div>
                            </div>
                            <p className="font-arabic text-xl text-slate-300 group-hover:text-blue-800 transition-colors">{s.name.replace('سُورَةُ', '')}</p>
                        </div>
                    ))}
                </div>
            </>
        )}

        {activeTab === 'saved' && (
            <div className="space-y-3 pb-8">
                {bookmarks.length === 0 ? <div className="text-center py-20 text-slate-400">No saved verses yet.</div> : 
                    bookmarks.map((b, i) => (
                        <div key={i} onClick={() => openSurah(b.surahNumber)} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm cursor-pointer hover:border-blue-900">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900">{b.surahName}</h3>
                                <span className="text-xs font-bold text-white px-2 py-1 rounded-lg bg-blue-900">Ayah {b.ayahNumber}</span>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2 font-serif">{b.text}</p>
                        </div>
                    ))
                }
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
      
      {/* Majestic Blue Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-[#1e3a8a] text-white z-20 shadow-lg">
        <button onClick={backToList} className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
          <ChevronLeft size={20} />
          <span className="font-bold text-xs uppercase">Back</span>
        </button>
        <h3 className="font-bold text-white text-lg tracking-wide">{activeSurah?.englishName}</h3>
        
        <div className="relative">
            <button onClick={() => setShowReciterMenu(!showReciterMenu)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <SettingsIcon size={20} className="text-white" />
            </button>
            {showReciterMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-56 z-50 max-h-64 overflow-y-auto text-slate-900">
                    <p className="text-xs font-bold text-slate-400 uppercase p-2 sticky top-0 bg-white">Select Reciter</p>
                    <button onClick={() => changeReciter('ar.alafasy')} className="w-full text-left p-3 hover:bg-slate-50 text-sm font-bold border-b border-slate-50">Mishary Alafasy</button>
                    <button onClick={() => changeReciter('ar.abdulbasitmurattal')} className="w-full text-left p-3 hover:bg-slate-50 text-sm font-bold border-b border-slate-50">Abdul Basit</button>
                    <button onClick={() => changeReciter('ar.sudais')} className="w-full text-left p-3 hover:bg-slate-50 text-sm font-bold border-b border-slate-50">Al Sudais</button>
                    <button onClick={() => changeReciter('ar.shuraym')} className="w-full text-left p-3 hover:bg-slate-50 text-sm font-bold border-b border-slate-50">Saud Al-Shuraym</button>
                    <button onClick={() => changeReciter('ar.hudhaify')} className="w-full text-left p-3 hover:bg-slate-50 text-sm font-bold">Al Hudhaify</button>
                </div>
            )}
        </div>
      </div>

      {loading ? (
         <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-[#1e3a8a]"></div>
            <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-wider">Loading Surah...</p>
         </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-2 pb-40 hide-scrollbar scroll-smooth bg-[#F8FAFC]">
            {/* Basmalah Card */}
            <div className="text-center py-10 bg-white m-4 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#1e3a8a]"></div>
                <p className="text-4xl font-arabic text-[#1e3a8a] leading-relaxed drop-shadow-sm relative z-10 py-6">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
            </div>

            <div className="space-y-4 px-2">
                {activeSurah?.ayahs.map((ayah, idx) => {
                    const transText = translation?.ayahs[idx]?.text || "";
                    const isPlayingThis = isPlaying && currentAudioUrl === ayah.audio;
                    const isBookmarked = bookmarks.some(b => b.surahNumber === activeSurah.number && b.ayahNumber === ayah.numberInSurah);
                    
                    return (
                        <div key={ayah.number} className={`p-6 rounded-[2.5rem] transition-all duration-500 ${isPlayingThis ? 'bg-white border-2 border-[#1e3a8a] shadow-xl scale-[1.01]' : 'bg-white border border-slate-100 hover:border-slate-200'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white text-sm font-bold flex items-center justify-center shadow-md">
                                    {ayah.numberInSurah}
                                </div>
                                <div className="flex gap-2">
                                     <button 
                                        onClick={() => toggleBookmark(ayah.numberInSurah, transText)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isBookmarked ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                     >
                                         <BookmarkIcon size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                                     </button>
                                     <button 
                                        onClick={() => playAudio(ayah.audio)} 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlayingThis ? 'bg-[#1e3a8a] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                     >
                                        {isPlayingThis ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-right text-3xl font-arabic leading-[2.6] text-slate-900 mb-8 w-full font-medium" dir="rtl">
                                {ayah.text.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", "").trim()}
                            </p>
                            
                            <p className="text-slate-600 text-lg leading-relaxed font-serif pl-2 border-l-4 border-slate-100">
                                {transText}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
      )}

      {currentAudioUrl && (
          <div className="absolute bottom-6 left-4 right-4 bg-[#1e3a8a] text-white p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between z-30 border-2 border-white/20 animate-in slide-in-from-bottom-5">
              <div className="flex items-center gap-4 pl-2">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                      {isPlaying ? <div className="flex gap-1 h-3 items-end"><span className="w-1 bg-white animate-[bounce_1s_infinite] h-2"></span><span className="w-1 bg-white animate-[bounce_1.2s_infinite] h-3"></span><span className="w-1 bg-white animate-[bounce_0.8s_infinite] h-1"></span></div> : <Volume2 size={20} />}
                  </div>
                  <div>
                      <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">Now Playing</p>
                      <p className="text-sm font-bold text-white leading-none capitalize">{reciter.replace('ar.', '')}</p>
                  </div>
              </div>
              <button onClick={() => audioRef.current?.paused ? audioRef.current.play() : audioRef.current?.pause()} className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#1e3a8a] shadow-xl hover:scale-105 transition-transform">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
          </div>
      )}
    </div>
  );
};