import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SalahTracker } from './components/SalahTracker';
import { QuranReader } from './components/QuranReader';
import { Tasbih } from './components/Tasbih';
import { Names99 } from './components/Names99';
import { DuaCollection } from './components/DuaCollection';
import { AIHub } from './components/AIHub'; // Changed from DuaAI to AIHub
import { ProphetStories } from './components/ProphetStories';
import { Qibla } from './components/Qibla';
import { TrackerStats } from './components/TrackerStats';
import { ZakatCalculator } from './components/ZakatCalculator';
import { Settings } from './components/Settings';
import { IslamicCalendar } from './components/IslamicCalendar';
import { HadithCollection } from './components/HadithCollection';
import { AppSection } from './types';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.SALAH);

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.SALAH: return <SalahTracker onNavigate={setActiveSection} />;
      case AppSection.TRACKER: return <TrackerStats />;
      case AppSection.QURAN: return <QuranReader />;
      case AppSection.HADITH: return <HadithCollection />;
      case AppSection.TASBIH: return <Tasbih />;
      case AppSection.NAMES: return <Names99 />;
      case AppSection.DUA: return <DuaCollection />;
      case AppSection.AI: return <AIHub />;
      case AppSection.PROPHETS: return <ProphetStories />;
      case AppSection.QIBLA: return <Qibla />;
      case AppSection.ZAKAT: return <ZakatCalculator />;
      case AppSection.SETTINGS: return <Settings />;
      case AppSection.CALENDAR: return <IslamicCalendar />;
      default: return <SalahTracker onNavigate={setActiveSection} />;
    }
  };

  return (
    <Layout activeSection={activeSection} onNavigate={setActiveSection}>
      {renderSection()}
    </Layout>
  );
}

export default App;