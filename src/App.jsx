import useStore from './store/useStore';
import Header from './components/Header';
import IdeaBook from './components/IdeaBook';
import GenerateScreen from './components/GenerateScreen';
import HistoryScreen from './components/HistoryScreen';

function App() {
  const currentView = useStore((s) => s.currentView);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>
        {currentView === 'ideabook' && <IdeaBook />}
        {currentView === 'generate' && <GenerateScreen />}
        {currentView === 'history' && <HistoryScreen />}
      </main>
    </div>
  );
}

export default App;
