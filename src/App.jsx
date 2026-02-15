import { useEffect } from 'react';
import useStore from './store/useStore';
import Header from './components/Header';
import IdeaBook from './components/IdeaBook';
import GenerateScreen from './components/GenerateScreen';
import HistoryScreen from './components/HistoryScreen';
import SettingsScreen from './components/SettingsScreen';
import { startScheduler, stopScheduler } from './services/scheduler';

function App() {
  const currentView = useStore((s) => s.currentView);

  // スケジューラーを起動
  useEffect(() => {
    startScheduler(() => useStore.getState());
    return () => stopScheduler();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>
        {currentView === 'ideabook' && <IdeaBook />}
        {currentView === 'generate' && <GenerateScreen />}
        {currentView === 'history' && <HistoryScreen />}
        {currentView === 'settings' && <SettingsScreen />}
      </main>
    </div>
  );
}

export default App;
