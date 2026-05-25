import { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords } from 'lucide-react';
import type { HeroData } from './HeroCard';

interface HeroComparisonProps {
  heroes: HeroData[];
}

const statLabels: Record<string, string> = {
  creativity: '创造力',
  influence: '影响力',
  courage: '勇气',
  wisdom: '智慧',
};

const statColors: Record<string, string> = {
  creativity: '#E63946',
  influence: '#F5B800',
  courage: '#2D8B57',
  wisdom: '#7C3AED',
};

const HeroComparison = memo(function HeroComparison({ heroes }: HeroComparisonProps) {
  const [heroAId, setHeroAId] = useState(heroes[0]?.id ?? 1);
  const [heroBId, setHeroBId] = useState(heroes[1]?.id ?? 2);

  const heroA = useMemo(() => heroes.find((h) => h.id === heroAId) ?? heroes[0], [heroes, heroAId]);
  const heroB = useMemo(() => heroes.find((h) => h.id === heroBId) ?? heroes[1], [heroes, heroBId]);

  if (!heroA || !heroB) return null;

  const statKeys = ['creativity', 'influence', 'courage', 'wisdom'] as const;

  return (
    <div className="max-w-[800px] mx-auto">
      {/* Dropdown Selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <div className="relative">
          <select
            value={heroA.id}
            onChange={(e) => setHeroAId(Number(e.target.value))}
            className="appearance-none bg-white border-2 border-cambridge-blue/30 rounded-xl px-5 py-3 pr-10 font-body text-ink font-semibold cursor-pointer focus:outline-none focus:border-cambridge-blue transition-colors min-w-[180px]"
          >
            {heroes.map((h) => (
              <option key={`a-${h.id}`} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cambridge-blue">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="w-12 h-12 rounded-full bg-gem-red flex items-center justify-center shrink-0">
          <Swords size={20} className="text-white" />
        </div>

        <div className="relative">
          <select
            value={heroB.id}
            onChange={(e) => setHeroBId(Number(e.target.value))}
            className="appearance-none bg-white border-2 border-cambridge-blue/30 rounded-xl px-5 py-3 pr-10 font-body text-ink font-semibold cursor-pointer focus:outline-none focus:border-cambridge-blue transition-colors min-w-[180px]"
          >
            {heroes.map((h) => (
              <option key={`b-${h.id}`} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cambridge-blue">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Comparison Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
        {/* Hero A */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroA.id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className="flex flex-col items-center"
          >
            <div
              className="w-[100px] h-[100px] rounded-full border-4 border-gold overflow-hidden shadow-gold-glow"
              style={{
                boxShadow: `0 0 20px ${heroA.accent}66`,
                borderColor: heroA.accent,
              }}
            >
              <img
                src={`/${heroA.avatar}`}
                alt={heroA.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <p className="font-display text-lg text-ink mt-2">{heroA.name}</p>
          </motion.div>
        </AnimatePresence>

        {/* VS Badge */}
        <div className="w-16 h-16 rounded-full bg-gem-red flex items-center justify-center shrink-0 shadow-gem-glow">
          <span className="font-display text-xl text-white">VS</span>
        </div>

        {/* Hero B */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroB.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className="flex flex-col items-center"
          >
            <div
              className="w-[100px] h-[100px] rounded-full border-4 overflow-hidden"
              style={{
                boxShadow: `0 0 20px ${heroB.accent}66`,
                borderColor: heroB.accent,
              }}
            >
              <img
                src={`/${heroB.avatar}`}
                alt={heroB.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <p className="font-display text-lg text-ink mt-2">{heroB.name}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stat Bars */}
      <div className="mt-8 space-y-4">
        {statKeys.map((statKey, i) => {
          const valA = heroA.stats[statKey];
          const valB = heroB.stats[statKey];
          const maxVal = Math.max(valA, valB, 5);
          const color = statColors[statKey];

          return (
            <motion.div
              key={statKey}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-sm font-bold" style={{ color }}>
                  {valA}
                </span>
                <span className="font-body text-sm font-semibold text-ink/70">
                  {statLabels[statKey]}
                </span>
                <span className="font-body text-sm font-bold" style={{ color }}>
                  {valB}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Hero A bar */}
                <div className="flex-1 h-3 bg-stone/15 rounded-full overflow-hidden flex justify-end">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: heroA.accent }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(valA / maxVal) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                  />
                </div>
                {/* Hero B bar */}
                <div className="flex-1 h-3 bg-stone/15 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: heroB.accent }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(valB / maxVal) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default HeroComparison;
