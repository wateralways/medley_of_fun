import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, RotateCcw, Map, Download, Award, CheckCircle, Zap, Diamond } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizResultsProps {
  score: number;
  correctCount: number;
  maxCombo: number;
  totalQuestions: number;
  playerName: string;
  onRestart: () => void;
}

function getStarRating(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

function getRankTitle(score: number): { title: string; color: string } {
  if (score >= 90) return { title: '剑桥大师', color: 'var(--gem-red)' };
  if (score >= 70) return { title: '剑桥小博士', color: 'var(--emerald)' };
  if (score >= 50) return { title: '剑桥小学者', color: 'var(--cambridge-blue)' };
  return { title: '剑桥新手', color: 'var(--stone)' };
}

function getMessage(score: number): string {
  if (score === 100) return '完美通关！你是真正的剑桥大师！';
  if (score >= 90) return '太棒了！你是剑桥小达人！';
  if (score >= 70) return '做得不错！继续加油！';
  return '再试一次，你一定可以更好！';
}

function getMessageColor(score: number): string {
  if (score === 100) return 'var(--gem-red)';
  if (score >= 90) return 'var(--emerald)';
  if (score >= 70) return 'var(--cambridge-blue)';
  return 'var(--stone)';
}

export default function QuizResults({
  score,
  correctCount,
  maxCombo,
  totalQuestions,
  playerName,
  onRestart,
}: QuizResultsProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [starsAnimated, setStarsAnimated] = useState(0);
  const certificateRef = useRef<HTMLDivElement>(null);
  const hasRunConfetti = useRef(false);
  const starRating = getStarRating(score);
  const rank = getRankTitle(score);
  const message = getMessage(score);
  const messageColor = getMessageColor(score);
  const gemsCollected = Math.min(correctCount + (maxCombo >= 3 ? 5 : 0), 15);

  // Confetti celebration on mount
  useEffect(() => {
    if (hasRunConfetti.current) return;
    hasRunConfetti.current = true;

    // Main burst from center
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#F5B800', '#2D8B57', '#E63946', '#1B4D8C', '#7C3AED'],
        disableForReducedMotion: true,
        ticks: 200,
      });
    }, 300);

    // Second burst from left
    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5, x: 0.2 },
        angle: 60,
        colors: ['#F5B800', '#FFD700', '#FFF8E7'],
        disableForReducedMotion: true,
        ticks: 180,
      });
    }, 1500);

    // Third burst from right
    const timer3 = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5, x: 0.8 },
        angle: 120,
        colors: ['#2D8B57', '#B8D4E8', '#F5B800'],
        disableForReducedMotion: true,
        ticks: 180,
      });
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Score count-up animation
  useEffect(() => {
    const duration = 2000;
    const delay = 800;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [score]);

  // Stars animation
  useEffect(() => {
    if (starRating === 0) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= starRating; i++) {
      timers.push(
        setTimeout(() => {
          setStarsAnimated(i);
        }, 1200 + i * 300)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [starRating]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="min-h-[100dvh] pt-16 pb-12 px-4 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #1B4D8C 0%, #7C3AED 100%)',
      }}
    >
      {/* Floating gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              background: 'var(--gold)',
              opacity: 0.3,
            }}
            animate={{
              y: ['100vh', '-10vh'],
              x: [0, Math.random() * 40 - 20],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              delay: Math.random() * 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        {/* Results card */}
        <motion.div
          className="bg-white rounded-panel p-8 sm:p-10 shadow-2xl mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
            delay: 0.3,
          }}
        >
          {/* Star rating */}
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={
                  starsAnimated >= i
                    ? { scale: 1, rotate: 0 }
                    : { scale: 0.5, rotate: 0 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: i * 0.2,
                }}
              >
                <Star
                  size={48}
                  className={
                    starsAnimated >= i
                      ? 'text-gold'
                      : 'text-stone/20'
                  }
                  fill={starsAnimated >= i ? '#F5B800' : 'none'}
                  strokeWidth={starsAnimated >= i ? 1.5 : 1}
                />
              </motion.div>
            ))}
          </div>

          {/* Score display */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-mono text-6xl sm:text-7xl text-gold font-medium">
                {displayScore}
              </span>
              <span className="font-display text-2xl text-stone">分</span>
            </div>
            <p className="font-body text-sm text-stone mt-1">满分100分</p>
          </div>

          {/* Rank title */}
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span
              className="inline-block px-5 py-1.5 rounded-full font-display text-lg"
              style={{
                background: `${rank.color}15`,
                color: rank.color,
                border: `2px solid ${rank.color}40`,
              }}
            >
              <Award size={18} className="inline mr-1 -mt-0.5" />
              {rank.title}
            </span>
          </motion.div>

          {/* Personalized message */}
          <motion.p
            className="font-display text-xl sm:text-2xl text-center mb-6"
            style={{ color: messageColor }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {message}
          </motion.p>

          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-center p-3 bg-parchment rounded-2xl">
              <CheckCircle size={20} className="text-emerald mx-auto mb-1" />
              <p className="font-mono text-lg text-ink">{correctCount}/{totalQuestions}</p>
              <p className="font-body text-xs text-stone">答对题数</p>
            </div>
            <div className="text-center p-3 bg-parchment rounded-2xl">
              <Zap size={20} className="text-gold mx-auto mb-1" />
              <p className="font-mono text-lg text-ink">x{maxCombo}</p>
              <p className="font-body text-xs text-stone">最高连击</p>
            </div>
            <div className="text-center p-3 bg-parchment rounded-2xl">
              <Diamond size={20} className="text-gem-red mx-auto mb-1" />
              <p className="font-mono text-lg text-ink">{gemsCollected}</p>
              <p className="font-body text-xs text-stone">收集宝石</p>
            </div>
          </motion.div>

          {/* Generate certificate button */}
          {!showCertificate && (
            <motion.button
              onClick={() => setShowCertificate(true)}
              className="
                w-full h-14 rounded-2xl font-display text-lg text-white
                flex items-center justify-center gap-2 mb-4
                transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
              "
              style={{
                background: 'linear-gradient(135deg, #F5B800, #FFD700)',
                color: 'var(--ink)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Award size={22} />
              生成证书
            </motion.button>
          )}
        </motion.div>

        {/* Certificate */}
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* Certificate card */}
            <div
              ref={certificateRef}
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{
                backgroundImage: 'url(/certificate-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Fallback background if image fails */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #FFF8E7 0%, #F5F5DC 50%, #FFF8E7 100%)',
                  zIndex: 0,
                }}
              />

              {/* Ornate border overlay */}
              <div
                className="absolute inset-3 sm:inset-5 rounded-2xl border-4 pointer-events-none"
                style={{ borderColor: 'var(--gold)', zIndex: 1 }}
              />
              <div
                className="absolute inset-4 sm:inset-6 rounded-xl border pointer-events-none"
                style={{ borderColor: 'rgba(245,184,0,0.4)', zIndex: 1 }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 sm:p-12 text-center">
                {/* Title */}
                <motion.h2
                  className="font-display text-3xl sm:text-4xl mb-2"
                  style={{ color: 'var(--gold)', textShadow: '0 2px 8px rgba(245,184,0,0.3)' }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  剑桥小达人证书
                </motion.h2>

                <div
                  className="w-24 h-0.5 mx-auto mb-6"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
                />

                {/* Certificate body */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="font-body text-lg text-ink mb-4">特此证明</p>

                  <p
                    className="font-display text-2xl sm:text-3xl mb-4"
                    style={{ color: 'var(--cambridge-blue)' }}
                  >
                    {playerName || '小探险家'}
                  </p>

                  <p className="font-body text-lg text-ink mb-2">
                    成功完成剑桥知识大挑战
                  </p>

                  <p className="font-body text-base text-stone mb-6">
                    获得 <span className="font-display text-gold">{'★'.repeat(starRating)}{'☆'.repeat(3 - starRating)}</span> 评价
                  </p>

                  {/* Score */}
                  <div className="flex justify-center items-baseline gap-2 mb-6">
                    <span className="font-body text-stone">最终得分</span>
                    <span className="font-mono text-3xl text-gold font-medium">{score}</span>
                    <span className="font-body text-stone">分</span>
                  </div>

                  {/* Rank badge */}
                  <div className="mb-8">
                    <span
                      className="inline-block px-6 py-2 rounded-full font-display text-lg"
                      style={{
                        background: `${rank.color}15`,
                        color: rank.color,
                        border: `2px solid ${rank.color}40`,
                      }}
                    >
                      荣誉称号：{rank.title}
                    </span>
                  </div>

                  {/* Date */}
                  <p className="font-body text-sm text-stone mb-8">
                    {today}
                  </p>

                  {/* Decorative stamp */}
                  <div className="flex justify-end">
                    <div
                      className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
                      style={{
                        borderColor: 'var(--gold)',
                        background: 'rgba(245,184,0,0.1)',
                        transform: 'rotate(-12deg)',
                      }}
                    >
                      <div className="text-center">
                        <Award size={24} className="text-gold mx-auto" />
                        <span className="font-display text-[10px] text-gold block">认证</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Certificate actions */}
            <div className="flex gap-3 mt-4">
              <motion.button
                onClick={handlePrint}
                className="
                  flex-1 h-12 rounded-xl font-display text-base text-white
                  flex items-center justify-center gap-2
                  bg-cambridge-blue hover:bg-cambridge-blue/90
                  transition-all duration-300
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={18} />
                打印证书
              </motion.button>
              <motion.button
                onClick={onRestart}
                className="
                  flex-1 h-12 rounded-xl font-display text-base text-white
                  flex items-center justify-center gap-2
                  bg-emerald hover:bg-emerald/90
                  transition-all duration-300
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw size={18} />
                再玩一次
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Retry / Continue CTA (only when certificate not shown) */}
        {!showCertificate && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <p className="font-body text-white/80 mb-4">想挑战满分吗？</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={onRestart}
                className="
                  px-8 h-12 rounded-xl font-display text-base
                  flex items-center justify-center gap-2 mx-auto
                  transition-all duration-300 hover:scale-105
                "
                style={{
                  background: 'linear-gradient(135deg, #F5B800, #FFD700)',
                  color: 'var(--ink)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={18} />
                再玩一次
              </motion.button>
              <a
                href="#/map"
                className="
                  px-8 h-12 rounded-xl font-display text-base
                  flex items-center justify-center gap-2 mx-auto
                  border-2 border-white text-white
                  hover:bg-white/10 transition-all duration-300
                "
              >
                <Map size={18} />
                去魔法地图
              </a>
            </div>

            {/* Floating gems decoration */}
            <div className="relative h-16 mt-6 pointer-events-none">
              <motion.div
                className="absolute left-1/4"
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Diamond size={20} className="text-gold/40" fill="#F5B800" />
              </motion.div>
              <motion.div
                className="absolute right-1/4"
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <Diamond size={16} className="text-gold/30" fill="#F5B800" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
