import { useRef, memo, useCallback, useState } from 'react';
import { TreePine, TreeDeciduous } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CollegeFlipCard, { type CollegeData } from './CollegeFlipCard';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  College dataset                                                    */
/* ------------------------------------------------------------------ */
export const colleges: CollegeData[] = [
  {
    id: 1,
    name: '三一学院',
    englishName: 'Trinity',
    accentColor: '#F5B800',
    frontImage: '/trinity-college.jpg',
    badgeName: '财富之星',
    badgeIcon: '💎',
    description: '最大最富有的学院！牛顿和拜伦都在这里学习过。',
    funFacts: [
      '拥有牛顿的苹果树后代',
      '亨利八世雕像拿着椅子腿',
      '最富有的学院',
    ],
  },
  {
    id: 2,
    name: '国王学院',
    englishName: "King's",
    accentColor: '#E63946',
    frontImage: '/kings-chapel.jpg',
    badgeName: '礼拜堂之光',
    badgeIcon: '⛪',
    description: '拥有世界最著名的哥特式礼拜堂，徐志摩曾在这里学习。',
    funFacts: [
      '礼拜堂有世界最大的扇形拱顶',
      '徐志摩《再别康桥》石碑',
      '唱诗班举世闻名',
    ],
  },
  {
    id: 3,
    name: '圣约翰学院',
    englishName: "St John's",
    accentColor: '#2D8B57',
    frontImage: '/trinity-college.jpg',
    badgeName: '叹息之桥',
    badgeIcon: '🌉',
    description: '有著名的叹息桥，连接学院两侧，美丽如画。',
    funFacts: [
      '叹息桥仿照威尼斯建造',
      '拥有美丽的花园',
      '金庸曾在此就读',
    ],
  },
  {
    id: 4,
    name: '基督学院',
    englishName: "Christ's",
    accentColor: '#7C3AED',
    frontImage: '/trinity-college.jpg',
    badgeName: '进化之光',
    badgeIcon: '🧬',
    description: '达尔文的母校！拥有全剑桥最美丽的花园之一。',
    funFacts: [
      '达尔文在此提出进化论思想',
      '花园里有珍稀植物',
      '成立于1505年',
    ],
  },
  {
    id: 5,
    name: '圣凯瑟琳学院',
    englishName: "St Catharine's",
    accentColor: '#1B4D8C',
    frontImage: '/trinity-college.jpg',
    badgeName: '戏剧之冠',
    badgeIcon: '🎭',
    description: '甘道夫的扮演者伊恩·麦克莱恩的学院！',
    funFacts: [
      '伊恩·麦克莱恩演过甘道夫',
      '学院位于市中心',
      '成立于1473年',
    ],
  },
  {
    id: 6,
    name: '伊曼纽尔学院',
    englishName: 'Emmanuel',
    accentColor: '#FF8C42',
    frontImage: '/trinity-college.jpg',
    badgeName: '知识之灯',
    badgeIcon: '💡',
    description: '牛顿曾在此学习，拥有24小时开放的图书馆！',
    funFacts: [
      '24小时图书馆',
      '美丽的橡树庭院',
      '成立于1584年',
    ],
  },
  {
    id: 7,
    name: '王后学院',
    englishName: "Queens'",
    accentColor: '#E63946',
    frontImage: '/math-bridge.jpg',
    badgeName: '数学之桥',
    badgeIcon: '🔢',
    description: '拥有著名的数学桥，传说没用一根钉子！',
    funFacts: [
      '数学桥其实用了钉子',
      '横跨康河最美的一段',
      '1448年成立',
    ],
  },
  {
    id: 8,
    name: '格顿学院',
    englishName: 'Girton',
    accentColor: '#EC407A',
    frontImage: '/trinity-college.jpg',
    badgeName: '先锋之花',
    badgeIcon: '🌸',
    description: '剑桥第一所女子学院！女性教育的先驱。',
    funFacts: [
      '1869年成立',
      '远离市中心的城堡式建筑',
      '培养了众多杰出女性',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Decorative river path & trees                                      */
/* ------------------------------------------------------------------ */
const RiverPathDecoration = memo(function RiverPathDecoration() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Dotted river path line */}
      <svg
        className="absolute left-1/2 top-0 h-full w-8 -translate-x-1/2"
        viewBox="0 0 32 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M16,0 Q20,100 12,200 Q4,300 20,400 Q28,500 12,600 Q4,700 20,800 Q28,900 16,1000"
          fill="none"
          stroke="#2D8B57"
          strokeWidth="2"
          strokeDasharray="8,8"
          opacity="0.15"
        />
        {/* Small punt boat icons along the path */}
        <g opacity="0.2">
          <ellipse cx="16" cy="150" rx="8" ry="3" fill="#2D8B57" />
          <ellipse cx="16" cy="400" rx="8" ry="3" fill="#2D8B57" />
          <ellipse cx="16" cy="650" rx="8" ry="3" fill="#2D8B57" />
          <ellipse cx="16" cy="900" rx="8" ry="3" fill="#2D8B57" />
        </g>
      </svg>

      {/* Tree decorations alternating sides */}
      <TreePine
        size={48}
        className="absolute top-[8%] left-[3%] text-emerald/20"
      />
      <TreeDeciduous
        size={40}
        className="absolute top-[20%] right-[4%] text-emerald/15"
      />
      <TreePine
        size={36}
        className="absolute top-[35%] right-[2%] text-emerald/20"
      />
      <TreeDeciduous
        size={44}
        className="absolute top-[50%] left-[3%] text-emerald/15"
      />
      <TreePine
        size={38}
        className="absolute top-[65%] left-[5%] text-emerald/20"
      />
      <TreeDeciduous
        size={42}
        className="absolute top-[80%] right-[3%] text-emerald/15"
      />
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */
export default function CollegeExplorer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [, setUnlockedIds] = useState<Set<number>>(new Set());

  const handleBadgeUnlock = useCallback((collegeId: number) => {
    setUnlockedIds((prev) => {
      if (prev.has(collegeId)) return prev;
      const next = new Set(prev);
      next.add(collegeId);
      return next;
    });
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Animate each card sliding in from its respective side
      const cards = gsap.utils.toArray<HTMLElement>('.college-card-wrapper');
      cards.forEach((card, index) => {
        const isLeft = index % 2 === 0;
        gsap.from(card, {
          x: isLeft ? -60 : 60,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Animate section title
      gsap.from('.college-section-title', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.college-section-title',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20"
      style={{
        background:
          'linear-gradient(180deg, #E8F5E9 0%, #B8D4E8 50%, #E8F5E9 100%)',
      }}
    >
      <RiverPathDecoration />

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section title */}
        <div className="college-section-title text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl sm:text-5xl text-cambridge-blue mb-3">
            魔法学院之旅
          </h2>
          <p className="font-body text-lg text-stone">
            点击卡片，发现每所学院的秘密！
          </p>
        </div>

        {/* College cards — alternating left/right */}
        <div className="flex flex-col gap-10 md:gap-14">
          {colleges.map((college, index) => (
            <div key={college.id} className="college-card-wrapper">
              <CollegeFlipCard
                college={college}
                isLeft={index % 2 === 0}
                onBadgeUnlock={handleBadgeUnlock}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
