import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, Sparkles, Star, BookOpen } from 'lucide-react';
import Gem from '@/components/Gem';
import HeroCard from '@/components/heroes/HeroCard';
import HeroComparison from '@/components/heroes/HeroComparison';
import type { HeroData } from '@/components/heroes/HeroCard';

/* ------------------------------------------------------------------ */
/*  Hero data                                                          */
/* ------------------------------------------------------------------ */

const heroesData: HeroData[] = [
  {
    id: 1,
    name: '艾萨克·牛顿',
    type: '科学家',
    college: '三一学院',
    accent: '#F5B800',
    avatar: 'hero-newton.png',
    power: 5,
    teaser: '被苹果砸出头的天才！',
    superpower: '重力掌控 — 发现万有引力定律',
    fullFact: '据说被苹果砸到头发现了万有引力！他发现了让东西往下掉的"万有引力"，还发明了微积分！',
    stats: { creativity: 5, influence: 5, courage: 3, wisdom: 5 },
  },
  {
    id: 2,
    name: '查尔斯·达尔文',
    type: '探险家',
    college: '基督学院',
    accent: '#2D8B57',
    avatar: 'hero-darwin.png',
    power: 5,
    teaser: '人类和猴子是远房亲戚！',
    superpower: '进化之力 — 提出进化论',
    fullFact: '他告诉我们人类和猴子是远房亲戚！提出了进化论，所有生物都在不断进化！',
    stats: { creativity: 4, influence: 5, courage: 5, wisdom: 5 },
  },
  {
    id: 3,
    name: '斯蒂芬·霍金',
    type: '宇宙学家',
    college: '三一学院',
    accent: '#7C3AED',
    avatar: 'hero-hawking.png',
    power: 5,
    teaser: '轮椅上的宇宙之王！',
    superpower: '黑洞洞察 — 揭开宇宙奥秘',
    fullFact: '坐在轮椅上研究黑洞的物理学家，写过《时间简史》，活了55年，大脑飞到了宇宙最遥远的地方！',
    stats: { creativity: 5, influence: 5, courage: 5, wisdom: 5 },
  },
  {
    id: 4,
    name: '艾伦·图灵',
    type: '密码大师',
    college: '国王学院',
    accent: '#1B4D8C',
    avatar: 'hero-turing.png',
    power: 4,
    teaser: '计算机的爸爸！',
    superpower: '代码破译 — 破解二战密码',
    fullFact: '计算机科学之父！他破解了二战密码，救了很多人，还提出了"图灵测试"来判断机器是否有智能。',
    stats: { creativity: 5, influence: 4, courage: 4, wisdom: 5 },
  },
  {
    id: 5,
    name: '金庸',
    type: '武侠大师',
    college: '圣约翰学院',
    accent: '#E74C3C',
    avatar: 'hero-jinyong.png',
    power: 4,
    teaser: '武侠小说的神仙！',
    superpower: '笔墨神功 — 创造武侠世界',
    fullFact: '写了《射雕英雄传》的武侠大师！他的小说被改编成无数电视剧，2005年还来剑桥读博士呢！',
    stats: { creativity: 5, influence: 5, courage: 3, wisdom: 4 },
  },
  {
    id: 6,
    name: '徐志摩',
    type: '诗人',
    college: '国王学院',
    accent: '#E63946',
    avatar: 'hero-xzhimo.png',
    power: 3,
    teaser: '"再别康桥"的诗人！',
    superpower: '诗意漫步 — 用诗歌描绘剑桥之美',
    fullFact: '写了《再别康桥》的诗人："轻轻的我走了，正如我轻轻的来"。现在国王学院还有他的诗句石碑！',
    stats: { creativity: 5, influence: 3, courage: 3, wisdom: 4 },
  },
  {
    id: 7,
    name: '拜伦',
    type: '诗人',
    college: '三一学院',
    accent: '#9B59B6',
    avatar: 'hero-byron.png',
    power: 3,
    teaser: '带着宠物熊上学的诗人！',
    superpower: '浪漫诗篇 — 用文字改变世界',
    fullFact: '著名诗人，他养了一只宠物熊！因为他觉得狗太普通了，学校不让养狗，但没说不能养熊！',
    stats: { creativity: 4, influence: 4, courage: 4, wisdom: 3 },
  },
  {
    id: 8,
    name: '伊恩·麦克莱恩',
    type: '演员',
    college: '圣凯瑟琳学院',
    accent: '#3498DB',
    avatar: 'hero-gandalf.png',
    power: 4,
    teaser: '甘道夫本人！',
    superpower: '角色变身 — 演绎传奇角色',
    fullFact: '演过《指环王》里的甘道夫！他说"You shall not pass!"，还在《X战警》里演万磁王！',
    stats: { creativity: 4, influence: 4, courage: 4, wisdom: 4 },
  },
  {
    id: 9,
    name: '埃迪·雷德梅恩',
    type: '演员',
    college: '三一学院',
    accent: '#E67E22',
    avatar: 'hero-redmayne.png',
    power: 3,
    teaser: '奥斯卡影帝！',
    superpower: '银幕魔法 — 演绎神奇动物',
    fullFact: '奥斯卡影帝，演过《神奇动物在哪里》的纽特·斯卡曼德，还演过霍金，和牛顿、霍金是同一个学院的！',
    stats: { creativity: 4, influence: 3, courage: 3, wisdom: 4 },
  },
  {
    id: 10,
    name: '威廉·皮特',
    type: '首相',
    college: '三一学院',
    accent: '#1ABC9C',
    avatar: 'hero-pitt.png',
    power: 4,
    teaser: '24岁的超级首相！',
    superpower: '政治天才 — 英国最年轻首相',
    fullFact: '英国历史上最年轻的首相，24岁就当了首相！想象一下，24岁就管理整个国家！',
    stats: { creativity: 3, influence: 5, courage: 5, wisdom: 4 },
  },
];

/* ------------------------------------------------------------------ */
/*  Floating stars (background decoration)                            */
/* ------------------------------------------------------------------ */

interface StarFieldProps {
  count?: number;
}

const FloatingStars = memo(function FloatingStars({ count = 40 }: StarFieldProps) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      opacity: 0.15 + Math.random() * 0.5,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [s.opacity, s.opacity * 0.3, s.opacity],
            y: [-2, 2, -2],
            x: [-1, 1, -1],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function Heroes() {
  const [collectedIds, setCollectedIds] = useState<Set<number>>(new Set());
  const collectCount = collectedIds.size;

  const handleCollect = useCallback((id: number) => {
    setCollectedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="w-full">
      {/* ============================================================ */}
      {/* Section 1 — Heroes Hall (Hero Hall Entrance)                 */}
      {/* ============================================================ */}
      <section
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          minHeight: '50vh',
          background: 'linear-gradient(180deg, #2C2420 0%, #1B4D8C 100%)',
        }}
      >
        <FloatingStars count={50} />

        {/* Floating gems */}
        <Gem className="top-[15%] left-[10%]" delay={0} />
        <Gem className="top-[25%] right-[12%]" delay={1.2} />
        <Gem className="bottom-[20%] left-[18%]" delay={2.5} />

        <div className="relative z-10 text-center px-4 py-24 max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center justify-center gap-2 text-white/70 font-body text-sm mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="hover:text-gold transition-colors">
              <BookOpen size={14} className="inline mr-1" />
              首页
            </Link>
            <ChevronRight size={14} />
            <span className="text-gold">传奇英雄</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl text-gold mb-4"
            style={{ textShadow: '0 0 20px rgba(245, 184, 0, 0.4)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
            }}
          >
            剑桥英雄殿堂
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="font-body text-xl sm:text-2xl text-sky-wash mb-2 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            认识从剑桥走出的伟大人物
          </motion.p>

          {/* Flavor text */}
          <motion.p
            className="font-body text-base text-stone italic mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            点击卡片，发现他们的秘密故事...
          </motion.p>

          {/* Hero counter */}
          <motion.div
            className="inline-flex items-center gap-2 bg-ink/40 backdrop-blur-sm px-5 py-2.5 rounded-full border border-gold/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
          >
            <Trophy size={18} className="text-gold" />
            <span className="font-mono text-gold text-lg">
              已认识 {collectCount}/10 位英雄
            </span>
          </motion.div>

          {/* Glow pulse animation on title */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(245,184,0,0.08) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section 2 — Heroes Grid (Character Cards)                    */}
      {/* ============================================================ */}
      <section className="relative bg-parchment py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl text-cambridge-blue mb-3">
              传奇英雄阵容
            </h2>
            <p className="font-body text-lg text-stone">
              10位从剑桥走出的超级明星，每个人都有自己的超能力！
            </p>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 place-items-center">
            {heroesData.map((hero, index) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                index={index}
                collected={collectedIds.has(hero.id)}
                onCollect={handleCollect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section 3 — Hero Power Comparison                            */}
      {/* ============================================================ */}
      <section className="relative bg-white py-16 lg:py-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl text-cambridge-blue mb-2">
              英雄能力大比拼
            </h2>
            <p className="font-body text-base text-stone">
              选择两位英雄，看看谁更厉害！
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <HeroComparison heroes={heroesData} />
          </motion.div>

          <motion.p
            className="text-center font-body text-lg italic text-stone mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            他们都是剑桥的骄傲！
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Section 4 — CTA                                              */}
      {/* ============================================================ */}
      <section
        className="relative w-full py-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #E63946, #C1121F)' }}
      >
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            >
              {i % 2 === 0 ? <Star size={20 + i * 3} /> : <Sparkles size={20 + i * 3} />}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <motion.h2
            className="font-display text-3xl sm:text-4xl text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            觉得这些英雄厉害吗？
          </motion.h2>

          <motion.p
            className="font-body text-xl text-parchment mb-8"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            来测试一下你学到了多少！
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
            }}
          >
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-display text-xl text-ink transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F5B800, #FFD700)' }}
            >
              去知识挑战
              <ChevronRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
