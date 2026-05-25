import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Swords, Diamond, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGemContext } from '@/context/GemContext';

const navLinks = [
  { to: '/explore', label: '探索校园' },
  { to: '/heroes', label: '英雄人物' },
  { to: '/quiz', label: '知识挑战' },
  { to: '/map', label: '魔法地图' },
];

export default function Navbar() {
  const { gemCount } = useGemContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center" style={{ background: 'rgba(27, 77, 140, 0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center -space-x-1">
            <BookOpen className="text-gold" size={24} />
            <Swords className="text-gold" size={22} />
          </div>
          <span className="font-display text-xl text-gold tracking-wide hidden sm:inline">剑桥大冒险</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative font-body font-semibold text-white text-base hover:text-gold transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>

        {/* Score HUD + Mobile menu button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-ink/30 px-3 py-1.5 rounded-full">
            <Diamond size={18} className="text-gem-red" fill="#E63946" />
            <span className="font-mono text-gold text-base font-medium">{gemCount}</span>
          </div>

          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute top-16 left-0 right-0 bg-cambridge-blue/95 backdrop-blur-md md:hidden border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={link.to}
                    className="block font-body font-semibold text-white text-lg py-3 px-4 rounded-xl hover:bg-white/10 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
