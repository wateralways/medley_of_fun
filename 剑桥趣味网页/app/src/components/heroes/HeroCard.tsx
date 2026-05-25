import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, Sparkles } from 'lucide-react';
import { useGemContext } from '@/context/GemContext';
import TypewriterText from './TypewriterText';

export interface HeroData {
  id: number;
  name: string;
  type: string;
  college: string;
  accent: string;
  avatar: string;
  power: number;
  teaser: string;
  superpower: string;
  fullFact: string;
  stats: {
    creativity: number;
    influence: number;
    courage: number;
    wisdom: number;
  };
}

interface HeroCardProps {
  hero: HeroData;
  index: number;
  collected: boolean;
  onCollect: (id: number) => void;
}

const HeroCard = memo(function HeroCard({ hero, index, collected, onCollect }: HeroCardProps) {
  const { addGem } = useGemContext();
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setShowDetail(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleCollect = useCallback(() => {
    if (collected) return;

    const particles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 120,
      color: ['#F5B800', '#E63946', '#2D8B57', '#7C3AED'][Math.floor(Math.random() * 4)],
    }));
    setConfetti(particles);
    onCollect(hero.id);
    addGem();

    setTimeout(() => {
      setConfetti([]);
    }, 800);
  }, [collected, hero.id, onCollect, addGem]);

  const handleTap = useCallback(() => {
    if (!showDetail) {
      setShowDetail(true);
    } else if (!collected) {
      handleCollect();
    }
  }, [showDetail, collected, handleCollect]);

  const tiltX = isHovered ? -3 : 0;
  const tiltY = isHovered ? 5 : 0;

  return (
    <motion.div
      className="relative perspective-1000"
      initial={{ opacity: 0, rotateY: 90 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
    >
      <motion.div
        className="relative w-full max-w-[280px] mx-auto rounded-[20px] bg-white overflow-hidden cursor-pointer select-none"
        style={{
          boxShadow: isHovered
            ? '0 20px 48px rgba(0, 0, 0, 0.15)'
            : '0 8px 32px rgba(27, 77, 140, 0.12)',
        }}
        animate={{
          rotateX: tiltX,
          rotateY: tiltY,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTap}
      >
        {/* Avatar Section */}
        <div
          className="relative flex items-center justify-center pt-6 pb-4"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${hero.accent}22 0%, transparent 70%)`,
          }}
        >
          {/* Type badge */}
          <span
            className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-body font-bold text-white z-10"
            style={{ backgroundColor: hero.accent }}
          >
            {hero.type}
          </span>

          {/* Avatar with gold ring */}
          <motion.div
            className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] rounded-full flex items-center justify-center"
            style={{
              border: '4px solid #F5B800',
              boxShadow: isHovered
                ? '0 0 30px rgba(245, 184, 0, 0.6), inset 0 0 20px rgba(245, 184, 0, 0.2)'
                : '0 0 15px rgba(245, 184, 0, 0.3)',
            }}
            animate={isHovered ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
          >
            <img
              src={`/${hero.avatar}`}
              alt={hero.name}
              className="w-full h-full rounded-full object-cover"
              draggable={false}
              loading="lazy"
            />
            {collected && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald flex items-center justify-center border-2 border-white">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="px-5 pb-5 text-center">
          <h3 className="font-display text-[22px] text-ink leading-tight">{hero.name}</h3>
          <p className="font-body text-xs text-cambridge-blue font-semibold mt-1 flex items-center justify-center gap-1">
            <Sparkles size={12} />
            {hero.college}
          </p>

          {/* Power Stars */}
          <div className="flex items-center justify-center gap-0.5 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={14}
                className={i < hero.power ? 'text-gold' : 'text-stone/30'}
                fill={i < hero.power ? '#F5B800' : 'transparent'}
              />
            ))}
          </div>

          {/* Teaser */}
          <p className="font-body text-sm text-stone mt-2 leading-relaxed">{hero.teaser}</p>

          {/* Superpower tag */}
          <div
            className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-body font-bold"
            style={{
              backgroundColor: `${hero.accent}18`,
              color: hero.accent,
            }}
          >
            {hero.superpower}
          </div>
        </div>

        {/* Detail Panel - slides up on hover/tap */}
        <AnimatePresence>
          {(isHovered || showDetail) && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gold/30 rounded-b-[20px] px-5 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <TypewriterText
                text={hero.fullFact}
                started={isHovered || showDetail}
                className="font-body text-sm text-ink leading-relaxed block"
                speed={25}
              />

              <motion.button
                className={`mt-3 w-full py-2 rounded-xl font-body font-bold text-sm transition-colors ${
                  collected
                    ? 'bg-emerald/20 text-emerald cursor-default'
                    : 'bg-cambridge-blue text-white hover:bg-cambridge-blue/90'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!collected) handleCollect();
                }}
                whileTap={!collected ? { scale: 0.95 } : {}}
              >
                {collected ? (
                  <span className="flex items-center justify-center gap-1">
                    <Check size={14} strokeWidth={3} /> 已收集
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <Sparkles size={14} /> 收集英雄
                  </span>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti burst on collect */}
        <AnimatePresence>
          {confetti.map((c) => (
            <motion.div
              key={c.id}
              className="absolute top-1/2 left-1/2 w-3 h-3 rounded-sm pointer-events-none z-50"
              style={{ backgroundColor: c.color }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{ x: c.x, y: c.y, opacity: 0, scale: 0.3, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default HeroCard;
