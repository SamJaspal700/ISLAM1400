
export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface HijriDate {
  date: string;
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  audio: string;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

export interface AllahName {
  name: string;
  transliteration: string;
  en: { meaning: string };
  number: number;
}

export interface Prophet {
  id: number;
  name: string;
  arabicName: string;
  title: string;
  story: string;
  year?: string;
}

export interface DuaCategory {
  id: string;
  title: string;
  icon: any;
  duas: { title: string; arabic: string; transliteration: string; translation: string; source: string }[];
}

export enum AppSection {
  SALAH = 'salah',
  TRACKER = 'tracker',
  QURAN = 'quran',
  HADITH = 'hadith',
  TASBIH = 'tasbih',
  NAMES = 'names',
  DUA = 'dua',
  PROPHETS = 'prophets',
  QIBLA = 'qibla',
  ZAKAT = 'zakat',
  SETTINGS = 'settings',
  CALENDAR = 'calendar',
  AI = 'ai'
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: 'normal' | 'large' | 'xl';
  accentColor: string;
  adhanPreferences: {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  quranReciter: string;
}

export interface IslamicEvent {
  name: string;
  hijriDate: string;
  gregorianDate: string;
  daysLeft: number;
}

export interface Hadith {
  hadithNumber: string | number;
  heading: string;
  body: string;
  book: string;
  grade: string;
}

export interface Bookmark {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  text: string;
  timestamp: number;
}

export interface PrayerStatus {
  [date: string]: {
    [prayer: string]: string;
  };
}
