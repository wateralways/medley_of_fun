import { useRef, useState, useEffect, memo, useCallback } from 'react';
import {
  Apple,
  Shapes,
  Sailboat,
  Crown,
  Award,
  ScrollText,
  Trophy,
  Monitor,
  Lock,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerConfetti } from './confetti';
import { useGemContext } from '@/context/GemContext';

/* ------------------------------------------------------------------ */
/*  Badge data                                                         */
/* ------------------------------------------------------------------ */
interface BadgeData {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  fact: string;
}

const badges: BadgeData[] = [
  {
    id: 1,
    name: '牛顿的苹果',
    icon: <Apple size={32} />,
    color: '#2D8B57',
    fact: '三一学院里有一棵从牛顿家乡苹果树嫁接来的后代树！',
  },
  {
    id: 2,
    name: '数学桥的秘密',
    icon: <Shapes size={32} />,
    color: '#E63946',
    fact: '数学桥其实用了很多钉子！"不用钉子"只是美丽的传说。',
  },
  {
    id: 3,
    name: '康河撑船',
    icon: <Sailboat size={32} />,
    color: '#1B4D8C',
    fact: '撑船是剑桥最传统的游览方式， punt 是一种平底船。',
  },
  {
    id: 4,
    name: '亨利八世的椅子腿',
    icon: <Crown size={32} />,
    color: '#F5B800',
    fact: '三一学院门口的亨利八世雕像手里拿着椅子腿而不是权杖！',
  },
  {
    id: 5,
    name: '121个诺贝尔奖',
    icon: <Award size={32} />,
    color: '#7C3AED',
    fact: '剑桥大学培养出了121位诺贝尔奖得主，世界最多！',
  },
  {
    id: 6,
    name: '再别康桥',
    icon: <ScrollText size={32} />,
    color: '#EC407A',
    fact: '徐志摩的《再别康桥》刻在国王学院的一块石碑上。',
  },
  {
    id: 7,
    name: '牛剑划船赛',
    icon: <Trophy size={32} />,
    color: '#1B4D8C',
    fact: '牛津和剑桥每年的划船赛始于1829年，是世界最著名的大学比赛！',
  },
  {
    id: 8,
    name: '世界第一台计算机',
    icon: <Monitor size={32} />,
    color: '#2D8B57',
    fact: 'EDSAC——世界上第一台实际运行的存储程序计算机——诞生于剑桥！',
  },
];

/* ------------------------------------------------------------------ */
/*  Individual badge                                                   */
/* ------------------------------------------------------------------ */
const KnowledgeBadge = memo(function KnowledgeBadge({
  badge,
  unlocked,
  onUnlock,
}: {
  badge: BadgeData;
  unlocked: boolean;
  onUnlock: (id: number) => void;
}) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Intersection Observer for scroll-triggered unlock
  useEffect(() => {
    if (unlocked) return;

    const el = badgeRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onUnlock(badge.id);
            // Trigger confetti at badge position
            const rect = el.getBoundingClientRect();
            triggerConfetti(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
              [badge.color, '#F5B800', '#FFFFFF']
            );
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [badge.id, badge.color, unlocked, onUnlock]);

  return (
    <motion.div
      ref={badgeRef}
      className="relative flex flex-col items-center gap-2"
      initial={{ scale: 0, opacity: 0 }}
      animate={
        unlocked
          ? { scale: 1, opacity: 1 }
          : { scale: 0.85, opacity: 0.5 }
      }
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: badge.id * 0.06,
      }}
      onMouseEnter={() => unlocked && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && unlocked && (
          <motion.div
            className="absolute -top-20 left-1/2 z-20 w-48 -translate-x-1/2 rounded-xl bg-white p-3 shadow-lg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-body text-sm text-ink leading-snug">
              {badge.fact}
            </p>
            {/* Triangle */}
            <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge circle */}
      <motion.div
        className="relative flex h-[72px] w-[72px] sm:h-20 sm:w-20 items-center justify-center rounded-full border-[3px] transition-transform duration-300"
        style={{
          borderColor: unlocked ? '#F5B800' : '#8B7E6A',
          background: unlocked ? badge.color : '#D1D1D1',
          filter: unlocked ? 'none' : 'grayscale(100%)',
          boxShadow: unlocked
            ? '0 0 20px rgba(245, 184, 0, 0.4)'
            : 'none',
        }}
        whileHover={unlocked ? { scale: 1.15 } : {}}
      >
        {unlocked ? (
          <div className="text-white">{badge.icon}</div>
        ) : (
          <Lock size={24} className="text-stone/60" />
        )}

        {/* Pulse glow ring (unlocked only) */}
        {unlocked && (
          <motion.div
            className="absolute inset-[-6px] rounded-full border-2"
            style={{ borderColor: `${badge.color}40` }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.15, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Unlock sparkle */}
        {unlocked && (
          <motion.div
            className="absolute -top-1 -right-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10,
              delay: 0.2,
            }}
          >
            <Sparkles size={16} className="text-gold" fill="#F5B800" />
          </motion.div>
        )}
      </motion.div>

      {/* Label */}
      <span
        className={`font-body text-xs sm:text-sm text-center leading-tight max-w-[90px] ${
          unlocked ? 'text-ink font-semibold' : 'text-stone/60'
        }`}
      >
        {badge.name}
      </span>
    </motion.div>
  );
});

/* ------------------------------------------------------------------ */
/*  Badge wall section                                                 */
/* ------------------------------------------------------------------ */
export default function KnowledgeBadgeWall() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<number>>(new Set());
  const { addGem } = useGemContext();

  const handleUnlock = useCallback(
    (id: number) => {
      setUnlockedIds((prev) => {
        if (prev.has(id)) return prev;
        // Award a gem on first unlock
        addGem();
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    },
    [addGem]
  );

  const unlockedCount = unlockedIds.size;
  const totalCount = badges.length;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-24 bg-white overflow-hidden"
    >
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-[42px] text-cambridge-blue mb-3">
            你的知识徽章墙
          </h2>
          <p className="font-body text-lg text-stone">
            已收集 {unlockedCount}/{totalCount} 枚徽章
          </p>

          {/* Progress bar */}
          <div className="mt-4 mx-auto w-64 h-2 rounded-full bg-sky-wash/40 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald to-gold"
              initial={{ width: 0 }}
              animate={{
                width: `${(unlockedCount / totalCount) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            />
          </div>
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-4 gap-6 sm:gap-8 md:gap-10 justify-items-center">
          {badges.map((badge) => (
            <KnowledgeBadge
              key={badge.id}
              badge={badge}
              unlocked={unlockedIds.has(badge.id)}
              onUnlock={handleUnlock}
            />
          ))}
        </div>

        {/* Hint text */}
        <p className="text-center font-body text-sm text-stone/60 mt-10">
          向下滚动，解锁更多知识徽章！每解锁一个徽章可获得一颗宝石！
        </p>
      </div>
    </section>
  );
}
