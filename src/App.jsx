import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import About from './pages/About';
import Projects from './pages/Projects';
import CustomCursor from './components/CustomCursor';
import './styles/globals.css';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // new page, start at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative min-h-[100svh] flex flex-col text-ink font-sans">
      <CustomCursor />
      <Navigation />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
      {/* Home is a single screen; every other page ends on the doodle crew */}
      {!isHome && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
