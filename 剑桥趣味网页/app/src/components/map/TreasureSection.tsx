import { memo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Gem, Sparkles, Eye, ArrowRight, RotateCcw } from 'lucide-react';

interface TreasureSectionProps {
  visible: boolean;
  easterEggFound: boolean;
  gemCount: number;
  onClaim: () => void;
  onReset: () => void;
  claimed: boolean;
}

/**
 * Ultimate Treasure celebration section.
 * Golden chest animation, confetti, and gem rewards.
 */
const TreasureSection = memo(function TreasureSection({
  visible,
  easterEggFound,
  gemCount,
  onClaim,
  onReset,
  claimed,
}: TreasureSectionProps) {
  const hasFiredConfetti = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fire confetti when section first becomes visible
  useEffect(() => {
    if (visible && !hasFiredConfetti.current) {
      hasFiredConfetti.current = true;
      // Delay slightly for the section to render
      setTimeout(() => {
        fireTreasureConfetti();
      }, 400);
    }
  }, [visible]);

  const handleClaim = useCallback(() => {
    onClaim();
    // Big confetti celebration
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#F5B800', '#E63946', '#2D8B57', '#1B4D8C', '#7C3AED'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#F5B800', '#E63946', '#2D8B57', '#1B4D8C', '#7C3AED'],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [onClaim]);

  const handleReset = useCallback(() => {
    hasFiredConfetti.current = false;
    onReset();
  }, [onReset]);

  if (!visible) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F5B800, #FFD700)',
        padding: '80px 24px',
      }}
    >
      {/* Floating sparkles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${8 + (i * 8) % 84}%`,
              top: `${10 + (i * 13) % 80}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2.5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <Sparkles
              size={16 + (i % 3) * 6}
              className="text-white/40"
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Treasure chest SVG */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          <div className="relative">
            {/* Golden glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                width: 200,
                height: 200,
                marginLeft: -50,
                marginTop: -30,
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Chest SVG */}
            <motion.svg
              width="120"
              height="100"
              viewBox="0 0 120 100"
              fill="none"
              animate={claimed ? { rotateX: [0, -25] } : {}}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              style={{ perspective: 1000 }}
            >
              {/* Chest body */}
              <rect x="10" y="40" width="100" height="50" rx="6" fill="#8B6914" />
              <rect x="10" y="40" width="100" height="50" rx="6" fill="url(#chestGradient)" />
              {/* Gold band */}
              <rect x="52" y="40" width="16" height="50" fill="#F5B800" />
              {/* Lock */}
              <circle cx="60" cy="55" r="8" fill="#FFD700" />
              <circle cx="60" cy="55" r="4" fill="#8B6914" />
              {/* Chest lid (opens when claimed) */}
              <motion.g
                animate={claimed ? { rotateX: -50, y: -5 } : {}}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
                style={{ originX: '60px', originY: '40px' }}
              >
                <path d="M10 40 Q60 10 110 40" fill="#A07C29" stroke="#8B6914" strokeWidth="2" />
                <path d="M10 40 Q60 10 110 40" fill="url(#lidGradient)" />
                <rect x="52" y="28" width="16" height="16" fill="#F5B800" rx="2" />
              </motion.g>
              {/* Light rays from inside */}
              {claimed && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <polygon points="60,40 30,10 40,40" fill="#FFD700" opacity="0.5" />
                  <polygon points="60,40 60,5 70,40" fill="#FFD700" opacity="0.6" />
                  <polygon points="60,40 90,10 80,40" fill="#FFD700" opacity="0.5" />
                </motion.g>
              )}
              <defs>
                <linearGradient id="chestGradient" x1="10" y1="40" x2="110" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A07C29" />
                  <stop offset="1" stopColor="#6B5310" />
                </linearGradient>
                <linearGradient id="lidGradient" x1="10" y1="20" x2="110" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C49A3C" />
                  <stop offset="1" stopColor="#8B6914" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Explorer badge */}
            <motion.div
              className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center"
              initial={{ scale: 0, rotateY: 180 }}
              whileInView={{ scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
              }}
            >
              <Eye size={28} className="text-gold" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="font-display text-3xl md:text-4xl text-cambridge-blue mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          恭喜！你发现了所有秘密！
        </motion.h2>

        <motion.p
          className="font-body text-lg text-ink/80 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          你是真正的剑桥探险家！
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex items-center justify-center gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 bg-white/30 rounded-xl px-4 py-2">
            <Trophy size={20} className="text-cambridge-blue" />
            <span className="font-mono text-base text-cambridge-blue font-medium">
              12/12 秘密已发现
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/30 rounded-xl px-4 py-2">
            <Gem size={20} className="text-gem-red" fill="#E63946" />
            <span className="font-mono text-base text-cambridge-blue font-medium">
              {gemCount} 颗宝石
            </span>
          </div>
        </motion.div>

        {/* Easter egg bonus message */}
        {easterEggFound && (
          <motion.p
            className="font-body text-sm text-cambridge-blue/80 mb-4 flex items-center justify-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Sparkles size={16} className="text-violet" />
            额外奖励：你发现了一条知识金鱼！+5 宝石！
          </motion.p>
        )}

        {/* Special badge */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 bg-white/40 rounded-full px-5 py-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <Eye size={20} className="text-cambridge-blue" />
          <span className="font-display text-base text-cambridge-blue">
            探险家之眼 徽章已获得
          </span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {!claimed ? (
            <motion.button
              onClick={handleClaim}
              className="flex items-center gap-2 bg-cambridge-blue text-white font-body font-semibold text-base px-8 py-3.5 rounded-xl hover:bg-cambridge-blue/90 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gem size={20} />
              领取宝藏
              <ArrowRight size={18} />
            </motion.button>
          ) : (
            <motion.div
              className="flex items-center gap-2 bg-emerald text-white font-body font-semibold text-base px-8 py-3.5 rounded-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <CheckIcon />
              宝藏已领取！
            </motion.div>
          )}

          <motion.button
            onClick={handleReset}
            className="flex items-center gap-2 bg-white/40 text-cambridge-blue font-body font-semibold text-base px-6 py-3.5 rounded-xl hover:bg-white/60 transition-colors border-2 border-cambridge-blue/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={18} />
            再探索一次
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
});

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="white" fillOpacity="0.3" />
      <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function fireTreasureConfetti() {
  const colors = ['#F5B800', '#E63946', '#2D8B57', '#1B4D8C', '#7C3AED', '#FFFFFF'];
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    disableForReducedMotion: true,
  });
}

export default TreasureSection;
