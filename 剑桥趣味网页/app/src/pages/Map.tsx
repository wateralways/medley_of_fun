import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Diamond,
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
  Search,
} from 'lucide-react';
import { useGemContext } from '@/context/GemContext';
import HotspotMarker from '@/components/map/HotspotMarker';
import type { HotspotData } from '@/components/map/HotspotMarker';
import DiscoveryPopup from '@/components/map/DiscoveryPopup';
import DiscoveryLog from '@/components/map/DiscoveryLog';
import TreasureSection from '@/components/map/TreasureSection';
import MapUnroll from '@/components/map/MapUnroll';

/* ------------------------------------------------------------------ */
/*  Helpers to work around TS constructor issues                       */
/* ------------------------------------------------------------------ */

function createSet<T>(): Set<T> {
  return new (globalThis.Set as unknown as { new (): Set<T> })();
}

function createMap<K, V>(): Map<K, V> {
  return new (globalThis.Map as unknown as { new (): Map<K, V> })();
}

function copySet<T>(s: Set<T>): Set<T> {
  return new (globalThis.Set as unknown as { new (iterable: Iterable<T>): Set<T> })(s);
}

function copyMap<K, V>(m: Map<K, V>): Map<K, V> {
  return new (globalThis.Map as unknown as { new (entries: Iterable<[K, V]>): Map<K, V> })(m);
}

/* ------------------------------------------------------------------ */
/*  Hotspot data                                                       */
/* ------------------------------------------------------------------ */

const HOTSPOTS: HotspotData[] = [
  {
    id: 1,
    name: '三一学院',
    fact: '牛顿曾在这里学习，学院有一棵传说中的苹果树！',
    top: '35%',
    left: '25%',
  },
  {
    id: 2,
    name: '国王学院礼拜堂',
    fact: '拥有世界上最大的扇形拱顶天花板！徐志摩在这里学习过。',
    top: '55%',
    left: '30%',
  },
  {
    id: 3,
    name: '圣约翰学院',
    fact: '金庸在这里学习过！学院有一座美丽的叹息桥。',
    top: '30%',
    left: '55%',
  },
  {
    id: 4,
    name: '基督学院',
    fact: '达尔文在这里学习过！学院有一个美丽的草坪。',
    top: '45%',
    left: '60%',
  },
  {
    id: 5,
    name: '数学桥',
    fact: '传说不用一根钉子建造，其实是用了钉子的！',
    top: '65%',
    left: '45%',
  },
  {
    id: 6,
    name: '牛顿苹果树',
    fact: '这棵苹果树的后代仍然在三一学院生长着！',
    top: '40%',
    left: '20%',
  },
  {
    id: 7,
    name: '康河撑船',
    fact: '坐上平底船游览剑桥，叫"Punting"，是最受欢迎的活动！',
    top: '70%',
    left: '40%',
  },
  {
    id: 8,
    name: '评议院大楼',
    fact: '剑桥学生在这里举行毕业典礼，已经300年了！',
    top: '45%',
    left: '45%',
  },
  {
    id: 9,
    name: '徐志摩石碑',
    fact: '石碑上刻着《再别康桥》的诗句。',
    top: '52%',
    left: '32%',
  },
  {
    id: 10,
    name: '圣玛丽教堂',
    fact: '可以爬上教堂塔顶，俯瞰整个剑桥！',
    top: '48%',
    left: '48%',
  },
  {
    id: 11,
    name: '叹息桥',
    fact: '因为考试不及格的学生在这里叹息而得名！',
    top: '35%',
    left: '60%',
  },
  {
    id: 12,
    name: '集市广场',
    fact: '这里可以买到剑桥纪念品和好吃的！',
    top: '75%',
    left: '35%',
  },
];

const EASTER_EGG: HotspotData = {
  id: 99,
  name: '霍格沃茨的秘密',
  fact: '你发现了一个秘密！剑桥的学院制度和霍格沃茨很像哦！',
  top: '68%',
  left: '42%',
  isHidden: true,
};

const ALL_HOTSPOTS = [...HOTSPOTS, EASTER_EGG];

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function Map() {
  const { gemCount, addGem } = useGemContext();
  const [discoveredIds, setDiscoveredIds] = useState<Set<number>>(createSet);
  const [discoveryOrder, setDiscoveryOrder] = useState<Map<number, number>>(createMap);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [easterEggFound, setEasterEggFound] = useState(false);
  const [treasureClaimed, setTreasureClaimed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  /* Detect mobile */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const discoveredRegularCount = useMemo(
    () => HOTSPOTS.filter((h) => discoveredIds.has(h.id)).length,
    [discoveredIds]
  );

  const allDiscovered = discoveredRegularCount === HOTSPOTS.length;

  /* Handle hotspot click */
  const handleHotspotClick = useCallback(
    (hotspot: HotspotData) => {
      setSelectedHotspot(hotspot);
      setPopupOpen(true);

      // If first time discovering this hotspot
      if (!discoveredIds.has(hotspot.id)) {
        // Small confetti burst on discovery
        if (!hotspot.isHidden) {
          confetti({
            particleCount: 15,
            spread: 50,
            origin: { y: 0.5 },
            colors: ['#F5B800', '#E63946', '#2D8B57'],
            disableForReducedMotion: true,
          });
        }
      }
    },
    [discoveredIds]
  );

  /* Handle discovery confirm */
  const handleConfirmDiscovery = useCallback(
    (hotspot: HotspotData) => {
      if (discoveredIds.has(hotspot.id)) {
        setPopupOpen(false);
        setSelectedHotspot(null);
        return;
      }

      // Add to discovered set
      const newDiscovered = copySet(discoveredIds);
      newDiscovered.add(hotspot.id);
      setDiscoveredIds(newDiscovered);

      // Record discovery order
      const newOrder = copyMap(discoveryOrder);
      newOrder.set(hotspot.id, discoveryOrder.size + 1);
      setDiscoveryOrder(newOrder);

      // Award gems
      if (hotspot.isHidden) {
        setEasterEggFound(true);
        // +5 gems for easter egg
        for (let i = 0; i < 5; i++) addGem();
        confetti({
          particleCount: 60,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#7C3AED', '#F5B800', '#E63946', '#FFD700'],
          disableForReducedMotion: true,
        });
      } else {
        // +1 gem per hotspot
        addGem();
      }

      setPopupOpen(false);
      setSelectedHotspot(null);
    },
    [discoveredIds, discoveryOrder, addGem]
  );

  /* Handle treasure claim (+10 gems) */
  const handleClaimTreasure = useCallback(() => {
    if (treasureClaimed) return;
    // +10 gems
    for (let i = 0; i < 10; i++) addGem();
    setTreasureClaimed(true);
  }, [treasureClaimed, addGem]);

  /* Reset map */
  const handleReset = useCallback(() => {
    setDiscoveredIds(createSet);
    setDiscoveryOrder(createMap);
    setEasterEggFound(false);
    setTreasureClaimed(false);
    setSelectedHotspot(null);
    setPopupOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
    setSelectedHotspot(null);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-parchment">
      {/* ============================================================ */}
      {/* Section 1 — Page Header                                      */}
      {/* ============================================================ */}
      <header
        ref={headerRef}
        className="relative pt-20 pb-10 md:pt-24 md:pb-14 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #5D3A1A 0%, #2C2420 100%)',
        }}
      >
        {/* Compass rose decoration */}
        <motion.div
          className="absolute top-20 right-6 md:right-16 opacity-20 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <Compass size={80} className="text-gold" />
        </motion.div>

        {/* Floating knowledge gems */}
        <FloatingGem left="10%" delay={0} />
        <FloatingGem left="75%" delay={0.8} />
        <FloatingGem left="88%" delay={1.6} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center justify-center gap-1 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="font-body text-sm text-white/70 hover:text-gold transition-colors"
            >
              首页
            </Link>
            <span className="text-white/40">→</span>
            <span className="font-body text-sm text-white/70">魔法地图</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-display text-4xl md:text-6xl mb-3"
            style={{
              color: '#F5B800',
              textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={headerInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            魔法地图
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="font-body text-lg md:text-xl mb-4"
            style={{ color: '#FFF8E7' }}
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            点击地图上的标记，发现隐藏的秘密！
          </motion.p>

          {/* Discovery counter */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Search size={18} className="text-gold" />
            <span className="font-mono text-base text-gold font-medium">
              已发现 {discoveredRegularCount} / {HOTSPOTS.length} 个秘密
            </span>
          </motion.div>

          {/* Hint */}
          <motion.p
            className="font-body text-sm italic"
            style={{ color: '#8B7E6A' }}
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            找到所有秘密，解锁终极宝藏！
          </motion.p>
        </div>
      </header>

      {/* ============================================================ */}
      {/* Section 2 — Interactive Map                                  */}
      {/* ============================================================ */}
      <section className="w-full bg-parchment py-10 md:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Map instruction */}
          <motion.p
            className="text-center font-body text-sm text-stone mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <MapPin size={14} className="inline mr-1" />
            点击闪烁的标记来探索剑桥的秘密
          </motion.p>

          {/* Interactive map with GSAP unroll + parallax */}
          <MapUnroll>
            {ALL_HOTSPOTS.map((hotspot) => (
              <HotspotMarker
                key={hotspot.id}
                hotspot={hotspot}
                discovered={discoveredIds.has(hotspot.id)}
                discoveryOrder={discoveryOrder.get(hotspot.id) ?? 0}
                onClick={handleHotspotClick}
              />
            ))}
          </MapUnroll>

          {/* Mobile hint for easter egg */}
          <motion.p
            className="text-center font-body text-xs text-stone/60 mt-4 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Sparkles size={12} className="inline mr-1" />
            据说地图上还藏着一个看不见的秘密...
          </motion.p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Discovery Popup (modal / bottom sheet)                       */}
      {/* ============================================================ */}
      <DiscoveryPopup
        hotspot={selectedHotspot}
        isOpen={popupOpen}
        onClose={closePopup}
        onConfirm={handleConfirmDiscovery}
        alreadyDiscovered={selectedHotspot ? discoveredIds.has(selectedHotspot.id) : false}
        isMobile={isMobile}
      />

      {/* ============================================================ */}
      {/* Section 3 — Discovery Log (Explorer Diary)                   */}
      {/* ============================================================ */}
      <DiscoveryLog
        hotspots={ALL_HOTSPOTS}
        discoveredIds={discoveredIds}
        discoveryOrder={discoveryOrder}
      />

      {/* ============================================================ */}
      {/* Section 4 — Treasure Completion                              */}
      {/* ============================================================ */}
      <TreasureSection
        visible={allDiscovered}
        easterEggFound={easterEggFound}
        gemCount={gemCount}
        onClaim={handleClaimTreasure}
        onReset={handleReset}
        claimed={treasureClaimed}
      />

      {/* ============================================================ */}
      {/* Section 5 — Adventure Complete CTA                           */}
      {/* ============================================================ */}
      <section
        className="w-full py-14 md:py-16 px-4"
        style={{ background: '#1B4D8C' }}
      >
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-2xl md:text-3xl text-white mb-2">
            探索完了地图？
          </h2>
          <p className="font-body text-base mb-6" style={{ color: '#B8D4E8' }}>
            来测试一下你的知识吧！
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 font-body font-semibold text-base px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
              style={{
                background: '#F5B800',
                color: '#2C2420',
              }}
            >
              <BookOpen size={18} />
              去知识挑战
              <ArrowRight size={18} />
            </Link>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 font-body font-semibold text-base px-6 py-3 rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
            >
              或者再探索一次
            </button>
          </div>

          {/* Back to home */}
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-body text-sm text-white/60 hover:text-gold transition-colors"
            >
              <ArrowRight size={14} className="rotate-180" />
              回到首页
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating Gem micro-component (isolated infinite animation)         */
/* ------------------------------------------------------------------ */

function FloatingGem({ left, delay }: { left: string; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top: '25%' }}
      animate={{ y: [-12, 12, -12] }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <Diamond size={22} className="text-gold/25" />
    </motion.div>
  );
}
