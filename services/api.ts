import { PrayerTimes, Surah, SurahDetail, AllahName, HijriDate, IslamicEvent, Hadith, Prophet, DuaCategory } from '../types';
import { Sun, Moon, Coffee, Plane, Shield, Heart } from 'lucide-react';

const ILFORD_LAT = 51.5588;
const ILFORD_LNG = 0.0855;

export const getPrayerTimes = async (date: Date = new Date()): Promise<{ timings: PrayerTimes, hijri: HijriDate }> => {
  try {
    const timestamp = Math.floor(date.getTime() / 1000);
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${ILFORD_LAT}&longitude=${ILFORD_LNG}&method=2`
    );
    const data = await response.json();
    return {
        timings: data.data.timings,
        hijri: data.data.date.hijri
    };
  } catch (error) {
    console.error("Failed to fetch prayer times", error);
    return {
      timings: { Fajr: "05:00", Sunrise: "06:30", Dhuhr: "13:00", Asr: "16:30", Maghrib: "19:00", Isha: "20:30" },
      hijri: { date: "", month: { number: 1, en: "", ar: "" }, year: "", day: "", weekday: { en: "", ar: "" } }
    };
  }
};

export const getCalendarMonth = async (month: number, year: number): Promise<any[]> => {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${ILFORD_LAT}&longitude=${ILFORD_LNG}&method=2`);
        const data = await response.json();
        return data.data; 
    } catch (e) {
        return [];
    }
}

export const getSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

export const getSurahDetails = async (number: number, reciterIdentifier: string = 'ar.alafasy'): Promise<SurahDetail | null> => {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/${reciterIdentifier}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
};

export const getEnglishTranslation = async (number: number): Promise<any> => {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${number}/en.asad`);
        const data = await response.json();
        return data.data;
      } catch (error) {
        return null;
      }
}

export const searchQuran = async (query: string): Promise<any[]> => {
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/search/${query}/all/en`);
        const data = await response.json();
        return data.data.matches || [];
    } catch (error) {
        return [];
    }
}

export const get99Names = async (): Promise<AllahName[]> => {
  try {
    const response = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
}

export const HADITH_BOOKS = [
    { id: 'eng-bukhari', name: 'Sahih Bukhari' },
    { id: 'eng-muslim', name: 'Sahih Muslim' },
    { id: 'eng-abudawud', name: 'Sunan Abu Dawud' },
    { id: 'eng-tirmidhi', name: 'Jami At-Tirmidhi' }
];

export const getHadith = async (bookSlug: string = 'eng-bukhari'): Promise<Hadith[]> => {
    try {
        const page = Math.floor(Math.random() * 50) + 1; 
        const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${bookSlug}/${page}.json`);
        const data = await response.json();
        return data.hadiths.slice(0, 50).map((h: any) => ({
            hadithNumber: h.hadithnumber,
            heading: HADITH_BOOKS.find(b => b.id === bookSlug)?.name || bookSlug,
            body: h.text,
            book: bookSlug,
            grade: h.grades?.[0]?.grade || "Unknown"
        }));
    } catch (e) {
        return [];
    }
}

export const getUpcomingEvents = (hijriMonth: number, hijriYear: string): IslamicEvent[] => {
    return [
        { name: "Ramadan Begins", hijriDate: "1 Ramadan", gregorianDate: "18 Feb 2026", daysLeft: 42 },
        { name: "Eid al-Fitr", hijriDate: "1 Shawwal", gregorianDate: "20 Mar 2026", daysLeft: 72 },
        { name: "Day of Arafah", hijriDate: "9 Dhul Hijjah", gregorianDate: "27 May 2026", daysLeft: 140 },
    ];
};

// --- STATIC DATA FOR NEW SECTIONS ---

export const PROPHETS_DATA: Prophet[] = [
    { id: 1, name: "Adam", arabicName: "آدم", title: "The First Human", year: "Beginning of Time", story: "Created from clay by Allah, Adam (AS) was the first human and prophet. He taught us repentance after his descent from Paradise." },
    { id: 2, name: "Idris (Enoch)", arabicName: "إدريس", title: "The Trustworthy", year: "~4500 BCE", story: "Known for his wisdom and being the first to write with a pen. He was raised to a high station by Allah." },
    { id: 3, name: "Nuh (Noah)", arabicName: "نوح", title: "The Grateful Servant", year: "~3000 BCE", story: "Preached for 950 years. Built the Ark under Allah's command to save believers and animals from the Great Flood." },
    { id: 4, name: "Hud", arabicName: "هود", title: "Messenger to 'Ad", year: "~2400 BCE", story: "Sent to the powerful tribe of 'Ad who built lofty pillars. They were destroyed by a fierce wind for their arrogance." },
    { id: 5, name: "Saleh", arabicName: "صالح", title: "Messenger to Thamud", year: "~2000 BCE", story: "Miraculously brought forth a she-camel from a rock. His people hamstrung the camel and were destroyed by a blast." },
    { id: 6, name: "Ibrahim (Abraham)", arabicName: "إبراهيم", title: "Khalilullah", year: "~2000 BCE", story: "The friend of Allah. Built the Kaaba, challenged idolatry, and was ready to sacrifice his son Ismail in obedience to Allah." },
    { id: 7, name: "Lut (Lot)", arabicName: "لوط", title: "Messenger to Sodom", year: "~2000 BCE", story: "Nephew of Ibrahim. Sent to Sodom to warn against immorality. His wife looked back during the destruction and perished." },
    { id: 8, name: "Ismail (Ishmael)", arabicName: "إسماعيل", title: "The Patient Son", year: "~1900 BCE", story: "Son of Ibrahim. Helped build the Kaaba. His patience during the sacrifice trial is honored every Eid al-Adha." },
    { id: 9, name: "Ishaq (Isaac)", arabicName: "إسحاق", title: "The Glad Tidings", year: "~1900 BCE", story: "Son of Ibrahim and Sarah. A prophet of righteous character and the forefather of many prophets including Yaqub." },
    { id: 10, name: "Yaqub (Jacob)", arabicName: "يعقوب", title: "Israel", year: "~1800 BCE", story: "Son of Ishaq. Known for his immense patience (Sabr) regarding the loss of his beloved son Yusuf." },
    { id: 11, name: "Yusuf (Joseph)", arabicName: "يوسف", title: "The Truthful", year: "~1700 BCE", story: "Blessed with beauty and dream interpretation. Thrown in a well, sold into slavery, imprisoned, and rose to govern Egypt." },
    { id: 12, name: "Ayyub (Job)", arabicName: "أيوب", title: "Example of Patience", year: "~1600 BCE", story: "Tested with loss of wealth, health, and family. He remained patient and grateful, and Allah restored everything twofold." },
    { id: 13, name: "Shu'aib (Jethro)", arabicName: "شعيب", title: "Speaker of Prophets", year: "~1500 BCE", story: "Sent to Madyan. Warned against cheating in weights and measures and highway robbery." },
    { id: 14, name: "Musa (Moses)", arabicName: "موسى", title: "Kalimullah", year: "~1300 BCE", story: "Spoke directly to Allah. Freed Bani Israel from Pharaoh. Received the Torah and led his people through the Red Sea." },
    { id: 15, name: "Harun (Aaron)", arabicName: "هارون", title: "Musa's Brother", year: "~1300 BCE", story: "Gifted with eloquent speech. Supported Musa in his mission to Pharaoh and guided Bani Israel." },
    { id: 16, name: "Dhul-Kifl (Ezekiel)", arabicName: "ذو الكفل", title: "The Possessor of a Portion", year: "~1300 BCE", story: "Known for his patience, fasting during the day, and praying at night. He judged with justice among his people." },
    { id: 17, name: "Dawud (David)", arabicName: "داود", title: "The King Prophet", year: "~1000 BCE", story: "Defeated Jalut (Goliath). Revealed the Zabur (Psalms). Could soften iron with his hands and sang praises with the mountains." },
    { id: 18, name: "Sulaiman (Solomon)", arabicName: "سليمان", title: "The Wise King", year: "~950 BCE", story: "Given control over wind and jinn. Understood the language of birds and ants. Built the Temple in Jerusalem." },
    { id: 19, name: "Ilyas (Elijah)", arabicName: "إلياس", title: "Messenger to Baal", year: "~900 BCE", story: "Warned his people against worshipping the idol Baal. He called them back to the worship of Allah alone." },
    { id: 20, name: "Al-Yasa (Elisha)", arabicName: "اليسع", title: "The Successor", year: "~850 BCE", story: "Succeeded Ilyas. Guided the Bani Israel with the Torah and maintained the laws of Allah." },
    { id: 21, name: "Yunus (Jonah)", arabicName: "يونس", title: "Dhul-Nun", year: "~750 BCE", story: "Swallowed by a whale after leaving his people in anger. Repented in the darkness of the belly and was saved by Allah." },
    { id: 22, name: "Zakariya (Zechariah)", arabicName: "زكريا", title: "Guardian of Maryam", year: "~1 CE", story: "Caretaker of Maryam. Prayed for an heir in old age, and Allah blessed him with Yahya." },
    { id: 23, name: "Yahya (John)", arabicName: "يحيى", title: "The Chaste", year: "~30 CE", story: "Son of Zakariya. Given wisdom while still a child. Known for his compassion and asceticism." },
    { id: 24, name: "Isa (Jesus)", arabicName: "عيسى", title: "Ruhullah", year: "~30 CE", story: "Born miraculously to Maryam. Spoke in the cradle. Healed the blind and lepers. Will return before the Day of Judgment." },
    { id: 25, name: "Muhammad", arabicName: "محمد", title: "Seal of the Prophets", year: "570–632 CE", story: "The final messenger to all mankind. Revealed the Holy Quran. The mercy to the worlds and the perfect role model." }
];

export const DUA_CATEGORIES: DuaCategory[] = [
    {
        id: 'morning',
        title: 'Morning & Evening',
        icon: Sun,
        duas: [
            {
                title: 'Morning Dua',
                arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا ، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
                transliteration: 'Allahumma bika asbahna wa bika amsayna, wa bika nahya wa bika namutu wa-ilaikan-nushur',
                translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.',
                source: 'Tirmidhi'
            }
        ]
    },
    {
        id: 'protection',
        title: 'Protection',
        icon: Shield,
        duas: [
            {
                title: 'Ayat al-Kursi',
                arabic: 'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ...',
                transliteration: 'Allahu la ilaha illa Huwa, Al-Hayyul-Qayyum...',
                translation: 'Allah! There is no god but He, the Living, the Self-subsisting, Eternal...',
                source: 'Surah Al-Baqarah 2:255'
            }
        ]
    },
    {
        id: 'travel',
        title: 'Travel',
        icon: Plane,
        duas: [
            {
                title: 'Dua for Traveling',
                arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
                transliteration: 'Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun',
                translation: 'Glory to Him Who has subjected this to us, and we could never have it (by our efforts). And verily, to Our Lord we indeed are to return.',
                source: 'Surah Az-Zukhruf'
            }
        ]
    }
];
