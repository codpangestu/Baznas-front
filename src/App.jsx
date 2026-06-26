import { Routes, Route } from 'react-router-dom';
import ProvinceDetail from './pages/ProvinceDetail';
import DaerahDetail from './pages/DaerahDetail';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#06101D] text-white font-sans">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<MapPage />} />
        <Route path="/province/:slug" element={<ProvinceDetail />} />
        <Route path="/daerah/:slug" element={<DaerahDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
