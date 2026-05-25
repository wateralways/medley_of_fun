import { useState, useCallback, useRef, memo } from 'react';
import { Star, Lock, Sparkles, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { triggerConfetti } from './confetti';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface CollegeData {
  id: number;
  name: string;
  englishName: string;
  accentColor: string;
  frontImage: string;
  badgeName: string;
  badgeIcon: React.ReactNode;
  description: string;
  funFacts: string[];
}

interface CollegeFlipCardProps {
  college: CollegeData;
  isLeft: boolean;
  onBadgeUnlock?: (collegeId: number) => void;
}

/* ------------------------------------------------------------------ */
/*  Card component                                                     */
/* ------------------------------------------------------------------ */
const CollegeFlipCard = memo(function CollegeFlipCard({
  college,
  isLeft,
  onBadgeUnlock,
}: CollegeFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);

    // Trigger confetti from card center
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      triggerConfetti(centerX, centerY, [college.accentColor, '#F5B800', '#FFFFFF']);
    }

    // Unlock badge on first flip
    if (!badgeUnlocked) {
      setBadgeUnlocked(true);
      onBadgeUnlock?.(college.id);
    }
  }, [badgeUnlocked, college, onBadgeUnlock]);

  return (
    <div
      className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className="relative w-full sm:w-[520px] cursor-pointer perspective-1000"
        onClick={handleFlip}
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`${college.name} 翻转卡片`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        <motion.div
          className="relative w-full preserve-3d"
          style={{
            aspectRatio: '520 / 360',
            minHeight: 300,
          }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
          }}
        >
          {/* ---------- FRONT ---------- */}
          <div
            className="absolute inset-0 backface-hidden rounded-card overflow-hidden shadow-card"
            style={{ transform: 'rotateY(0deg)' }}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${college.frontImage})` }}
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(transparent 40%, rgba(0,0,0,0.7))',
              }}
            />

            {/* Tap hint */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full">
              <Fingerprint size={14} className="text-white/70" />
              <span className="font-body text-xs text-white/70">
                点击翻转
              </span>
            </div>

            {/* College name */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <h3 className="font-display text-2xl sm:text-[28px] text-white leading-tight">
                  {college.name}
                </h3>
                <p className="font-body text-sm text-white/80 mt-0.5">
                  {college.englishName}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: college.accentColor }}
              >
                <Sparkles size={18} className="text-white" />
              </div>
            </div>
          </div>

          {/* ---------- BACK ---------- */}
          <div
            className="absolute inset-0 backface-hidden rounded-card overflow-hidden shadow-card bg-white"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Header bar */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ background: college.accentColor }}
            >
              <h3 className="font-display text-xl text-white">
                {college.name}
              </h3>
              <span className="font-body text-xs text-white/80">
                {college.englishName}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col h-[calc(100%-52px)]">
              {/* Description */}
              <p className="font-body text-base text-ink leading-relaxed mb-4">
                {college.description}
              </p>

              {/* Fun facts */}
              <ul className="space-y-2 mb-auto">
                {college.funFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Star
                      size={14}
                      className="text-gold mt-1 shrink-0"
                      fill="#F5B800"
                    />
                    <span className="font-body text-sm text-stone leading-relaxed">
                      {fact}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Badge slot */}
              <div className="flex justify-center mt-4">
                <motion.div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center border-[3px]"
                  style={{
                    borderColor: badgeUnlocked ? '#F5B800' : '#8B7E6A',
                    background: badgeUnlocked
                      ? college.accentColor
                      : '#E5E5E5',
                    boxShadow: badgeUnlocked
                      ? '0 0 20px rgba(245, 184, 0, 0.5)'
                      : 'none',
                  }}
                  initial={false}
                  animate={
                    badgeUnlocked
                      ? {
                          scale: [0, 1.2, 1],
                          rotate: [0, 10, -10, 0],
                        }
                      : { scale: 1 }
                  }
                  transition={{
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1] as [
                      number,
                      number,
                      number,
                      number,
                    ],
                  }}
                >
                  {badgeUnlocked ? (
                    <>
                      <div className="text-white">{college.badgeIcon}</div>
                      {/* Glow ring */}
                      <motion.div
                        className="absolute inset-[-4px] rounded-full border-2 border-gold/40"
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.4, 0.1, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </>
                  ) : (
                    <Lock size={22} className="text-stone/60" />
                  )}
                </motion.div>
              </div>

              {/* Badge label */}
              <p className="text-center font-body text-xs text-stone mt-2">
                {badgeUnlocked ? college.badgeName : '翻转卡片解锁徽章'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

export default CollegeFlipCard;
