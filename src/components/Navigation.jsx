import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-lg'
          : 'bg-white shadow-md'
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-[#2C3E50] hover:text-[#FFB27D] transition-colors duration-300"
        >
          tamamfb
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex h-full gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 h-full flex items-center font-semibold transition-colors duration-300 group ${
                  isActive ? 'text-[#E67E4D]' : 'text-[#2C3E50] hover:text-[#E67E4D]'
                }`}
              >
                {link.name}
                {/* Animated slide-up underline */}
                <span 
                  className={`absolute left-0 bottom-0 w-full h-[3px] bg-[#E67E4D] rounded-t-sm transition-all duration-300 origin-bottom ${
                    isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100'
                  }`} 
                />
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[#2C3E50] hover:bg-[#FFF8F4] transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FFF8F4] border-t border-[#FFD6B8] px-4 py-4 flex flex-col gap-2 fade-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 font-semibold transition-colors border-l-4 ${
                  isActive
                    ? 'border-[#E67E4D] bg-[#FFF2E8] text-[#E67E4D]'
                    : 'border-transparent text-[#2C3E50] hover:bg-[#FFF9F0]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
