import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  Calendar,
  Building2,
  Award,
  Users,
  Castle,
  Crown,
  Trophy,
  Map,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Star,
  BookOpen,
  Gem as GemIcon,
  GraduationCap,
} from 'lucide-react';
import Gem from '@/components/Gem';

/* ─────────────── Animation helpers ─────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
});

const bounceIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
});

/* ─────────────── Floating particles (CSS) ─────────────── */
function FloatingParticles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    duration: 8 + Math.random() * 7,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gold animate-particle-drift"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            '--drift-duration': `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.6,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ─────────────── Section 1: Hero ─────────────── */
function HeroSection() {
  const [gemsVisible] = useState(true);

  const scrollToHub = useCallback(() => {
    const el = document.getElementById('adventure-hub');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url(/hero-gate-bg.jpg)' }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(27, 77, 140, 0.4)' }} />

      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-20">
        {/* Title */}
        <motion.h1
          className="font-display text-5xl sm:text-6xl lg:text-7xl text-white text-shadow-gold mb-6"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        >
          欢迎来到剑桥大冒险！
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-body text-lg sm:text-xl lg:text-2xl text-parchment max-w-xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          探索世界最古老的大学之一，收集知识宝石，成为剑桥小达人！
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        >
          <motion.button
            onClick={scrollToHub}
            className="inline-flex items-center gap-2 h-14 px-8 rounded-3xl font-display text-xl text-ink gradient-gold-btn shadow-gold-glow hover:shadow-lg transition-shadow cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            开始冒险
            <ArrowRight size={22} />
          </motion.button>
        </motion.div>
      </div>

      {/* Mascot */}
      <motion.div
        className="absolute bottom-8 right-4 sm:right-12 lg:right-20 z-10 hidden sm:block"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
      >
        <motion.img
          src="/hero-mascot.png"
          alt="剑桥大冒险吉祥物"
          className="h-64 lg:h-80 object-contain drop-shadow-2xl"
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Floating Gems */}
      {gemsVisible && (
        <>
          <Gem className="top-[25%] left-[8%]" delay={0} />
          <Gem className="top-[35%] right-[10%]" delay={0.5} />
          <Gem className="bottom-[30%] left-[15%]" delay={1} />
          <Gem className="top-[50%] right-[5%]" delay={1.5} />
          <Gem className="bottom-[20%] left-[35%]" delay={2} />
          <Gem className="top-[20%] right-[25%]" delay={2.5} />
        </>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <ChevronDown className="text-gold animate-chevron-bounce" size={32} />
      </motion.div>
    </section>
  );
}

/* ─────────────── Section 2: Magic Numbers ─────────────── */
const stats = [
  { icon: <Calendar size={28} />, value: 1209, label: '成立于这一年', suffix: '' },
  { icon: <Building2 size={28} />, value: 31, label: '所魔法学院', suffix: '' },
  { icon: <Award size={28} />, value: 121, label: '位诺贝尔奖得主', suffix: '' },
  { icon: <Users size={28} />, value: 1, label: '条美丽的康河', suffix: '' },
];

function MagicNumbersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative py-20 lg:py-24 gradient-cambridge overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center text-center"
              {...bounceIn(i * 0.15)}
            >
              {/* Medallion */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 mb-3">
                {/* Rotating ring */}
                <div className="absolute inset-0 rounded-full border-4 border-gold/80 animate-spin-slow" />
                {/* Inner circle */}
                <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center shadow-lg">
                  <div className="text-cambridge-blue mb-1">{stat.icon}</div>
                  <div className="font-display text-4xl sm:text-5xl text-cambridge-blue">
                    {inView ? (
                      <CountUp end={stat.value} duration={2} delay={i * 0.15} suffix={stat.suffix} />
                    ) : (
                      '0'
                    )}
                  </div>
                </div>
              </div>
              {/* Label */}
              <span className="font-body text-sm sm:text-base text-sky-wash">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Floating gems */}
        <Gem className="top-[30%] left-[20%]" delay={1} />
        <Gem className="top-[40%] right-[22%]" delay={2} />
      </div>
    </section>
  );
}

/* ─────────────── Section 3: Adventure Navigation Hub ─────────────── */
const questCards = [
  {
    title: '探索魔法校园',
    subtitle: '参观31所学院，发现隐藏的秘密',
    accent: 'emerald',
    icon: <Castle size={40} />,
    link: '/explore',
    gradient: 'linear-gradient(135deg, #fff, rgba(45,139,87,0.08))',
  },
  {
    title: '认识传奇英雄',
    subtitle: '了解10位改变世界的校友',
    accent: 'gem-red',
    icon: <Crown size={40} />,
    link: '/heroes',
    gradient: 'linear-gradient(135deg, #fff, rgba(230,57,70,0.06))',
  },
  {
    title: '知识大挑战',
    subtitle: '回答10道趣味问题，赢取证书',
    accent: 'gold',
    icon: <Trophy size={40} />,
    link: '/quiz',
    gradient: 'linear-gradient(135deg, #fff, rgba(245,184,0,0.08))',
  },
  {
    title: '魔法地图',
    subtitle: '在互动地图上探索剑桥',
    accent: 'violet',
    icon: <Map size={40} />,
    link: '/map',
    gradient: 'linear-gradient(135deg, #fff, rgba(124,58,237,0.06))',
  },
];

function AdventureHubSection() {
  return (
    <section id="adventure-hub" className="py-24 lg:py-28 bg-parchment">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          className="text-center mb-14"
          {...fadeUp(0)}
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="text-gold" size={24} />
            <h2 className="font-display text-4xl lg:text-5xl text-cambridge-blue">
              选择你的冒险章节
            </h2>
            <Sparkles className="text-gold" size={24} />
          </div>
        </motion.div>

        {/* Quest Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {questCards.map((card, i) => (
            <motion.div
              key={card.title}
              {...fadeUp(i * 0.12)}
            >
              <Link to={card.link}>
                <motion.div
                  className="relative rounded-panel p-8 border-2 border-transparent shadow-card overflow-hidden group cursor-pointer h-full"
                  style={{ background: card.gradient }}
                  whileHover={{
                    y: -12,
                    borderColor: `var(--${card.accent})`,
                    boxShadow: '0 20px 48px rgba(0, 0, 0, 0.15)',
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                >
                  {/* Icon */}
                  <motion.div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-${card.accent} text-white`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {card.icon}
                  </motion.div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display text-2xl lg:text-3xl text-ink mb-2">
                    {card.title}
                  </h3>
                  <p className="font-body text-base text-stone mb-5">
                    {card.subtitle}
                  </p>

                  {/* CTA */}
                  <span className={`inline-flex items-center gap-1 font-body font-semibold text-base text-${card.accent} group-hover:underline`}>
                    开始探索
                    <ArrowRight size={18} />
                  </span>

                  {/* Decorative dots pattern */}
                  <div
                    className="absolute top-4 right-4 w-16 h-16 opacity-[0.05] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle, var(--${card.accent}) 1.5px, transparent 1.5px)`,
                      backgroundSize: '8px 8px',
                    }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Floating gems */}
        <Gem className="top-[20%] left-[5%]" delay={0.5} />
        <Gem className="bottom-[15%] right-[8%]" delay={1.5} />
      </div>
    </section>
  );
}

/* ─────────────── Section 4: Daily Discovery Carousel ─────────────── */
const carouselImages = [
  '/trinity-college.jpg',
  '/math-bridge.jpg',
  '/newton-apple-tree.jpg',
];

const carouselFacts = [
  {
    title: '三一学院的秘密',
    body: '三一学院大门上的亨利八世雕像，手里本该拿权杖，却拿着一根椅子腿！学生们恶作剧换上去的，一直保留到现在。',
  },
  {
    title: '数学桥传说',
    body: '这座桥不用一根钉子，全靠木头互相支撑！传说牛顿就是靠它领悟了万有引力。',
  },
  {
    title: '牛顿的苹果树',
    body: '这棵苹果树的后代还在三一学院呢！据说一个掉下来的苹果让牛顿想到了万有引力定律。',
  },
];

function DailyDiscoverySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="py-20 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section label */}
        <motion.div
          className="text-center mb-8"
          {...fadeUp(0)}
        >
          <div className="flex items-center justify-center gap-2">
            <Star className="text-gold" size={18} fill="#F5B800" />
            <span className="font-display text-xl text-gold">今日小发现</span>
            <Star className="text-gold" size={18} fill="#F5B800" />
          </div>
        </motion.div>

        {/* Fact Card */}
        <motion.div
          className="rounded-panel shadow-card overflow-hidden bg-white"
          {...bounceIn(0.1)}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image area */}
            <div className="relative w-full md:w-[45%] h-56 md:h-auto overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={carouselImages[activeIndex]}
                  alt={carouselFacts[activeIndex].title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
            </div>

            {/* Text area */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="font-display text-2xl text-cambridge-blue mb-4">
                    你知道吗？
                  </h3>
                  <p className="font-body text-lg text-ink leading-relaxed mb-5">
                    {carouselFacts[activeIndex].body}
                  </p>
                </motion.div>
              </AnimatePresence>
              <Link
                to="/explore"
                className="inline-flex items-center gap-1 font-body font-semibold text-cambridge-blue hover:underline w-fit"
              >
                了解更多
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i === activeIndex ? 'bg-gold' : 'bg-stone/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Section 5: CTA Banner ─────────────── */
const floatingDecorations = [
  { icon: <BookOpen size={24} />, left: '8%', top: '20%', delay: 0 },
  { icon: <Star size={22} />, left: '85%', top: '15%', delay: 1 },
  { icon: <GemIcon size={20} />, left: '15%', top: '70%', delay: 2 },
  { icon: <GraduationCap size={26} />, left: '75%', top: '65%', delay: 0.5 },
  { icon: <Sparkles size={20} />, left: '50%', top: '10%', delay: 1.5 },
  { icon: <Trophy size={22} />, left: '92%', top: '50%', delay: 2.5 },
  { icon: <Map size={20} />, left: '5%', top: '45%', delay: 3 },
  { icon: <Award size={22} />, left: '60%', top: '75%', delay: 1.8 },
];

function CTABannerSection() {
  return (
    <section className="relative py-20 lg:py-24 gradient-cta overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingDecorations.map((d, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            style={{ left: d.left, top: d.top }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: d.delay,
              ease: 'easeInOut',
            }}
          >
            {d.icon}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4"
          {...fadeUp(0)}
        >
          准备好开始你的剑桥冒险了吗？
        </motion.h2>

        <motion.p
          className="font-body text-lg sm:text-xl text-parchment mb-10"
          {...fadeUp(0.15)}
        >
          每一颗知识宝石都在等待被发现！
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          {...fadeUp(0.3)}
        >
          <Link to="/explore">
            <motion.button
              className="h-16 px-10 rounded-3xl font-display text-2xl text-ink gradient-gold-btn shadow-gold-glow cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              立即开始！
            </motion.button>
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-1 font-body text-lg text-gold hover:underline"
          >
            先看看地图
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────── Home Page ─────────────── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <MagicNumbersSection />
      <AdventureHubSection />
      <DailyDiscoverySection />
      <CTABannerSection />
    </>
  );
}
