import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MapPage from './pages/Map';

// Route stubs for sub-pages (to be implemented by page agents)
const ExplorePage = () => (
  <div className="min-h-screen pt-24 flex items-center justify-center bg-parchment">
    <div className="text-center">
      <h1 className="font-display text-4xl text-cambridge-blue mb-4">探索校园</h1>
      <p className="font-body text-lg text-stone">即将推出...</p>
    </div>
  </div>
);
const HeroesPage = () => (
  <div className="min-h-screen pt-24 flex items-center justify-center bg-parchment">
    <div className="text-center">
      <h1 className="font-display text-4xl text-cambridge-blue mb-4">英雄人物</h1>
      <p className="font-body text-lg text-stone">即将推出...</p>
    </div>
  </div>
);
const QuizPage = () => (
  <div className="min-h-screen pt-24 flex items-center justify-center bg-parchment">
    <div className="text-center">
      <h1 className="font-display text-4xl text-cambridge-blue mb-4">知识挑战</h1>
      <p className="font-body text-lg text-stone">即将推出...</p>
    </div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/heroes" element={<HeroesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
