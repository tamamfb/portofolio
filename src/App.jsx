import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import About from './pages/About';
import Projects from './pages/Projects';
import CustomCursor from './components/CustomCursor';
import bgImg from './assets/bg.png';
import './styles/globals.css';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={`relative z-[1] text-[#2C3E50] flex flex-col font-[Fredoka] ${isHome ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <CustomCursor />
      <Navigation />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
      {!isHome && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <>
      {/* Duck pattern — truly behind all content */}
      <div
        className="duck-bg fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: `url(${bgImg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
          opacity: 0.1,
        }}
      />
      <Router>
        <AppContent />
      </Router>
    </>
  );
}
