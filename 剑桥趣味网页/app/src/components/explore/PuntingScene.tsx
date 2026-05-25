import { useState, useEffect, useRef, memo } from 'react';
import { Sailboat, TreePine, Landmark, Bird } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Fun facts that cycle in the speech bubble                          */
/* ------------------------------------------------------------------ */
const puntingFacts = [
  '撑船人站在船尾，用长篙撑河底来推动船只前进！',
  '康河上的撑船游览已经有100多年的历史了！',
  '最好的撑船季节是春天，河岸两边开满了樱花！',
];

/* ------------------------------------------------------------------ */
/*  Hotspot data                                                       */
/* ------------------------------------------------------------------ */
const hotspots = [
  {
    id: 'tree',
    label: '垂柳树',
    icon: <TreePine size={20} />,
    position: { top: '25%', left: '8%' },
    fact: '康河两岸种满了垂柳树，春天时像绿色的瀑布！',
  },
  {
    id: 'bridge',
    label: '小桥',
    icon: <Landmark size={20} />,
    position: { top: '30%', right: '20%' },
    fact: '数学桥和叹息桥都在康河上，是撑船必经之处！',
  },
  {
    id: 'duck',
    label: '小鸭子',
    icon: <Bird size={20} />,
    position: { bottom: '30%', left: '30%' },
    fact: '康河里住着很多鸭子、天鹅和天鹅宝宝！',
  },
];

/* ------------------------------------------------------------------ */
/*  The punt boat SVG illustration                                     */
/* ------------------------------------------------------------------ */
const PuntBoatSVG = memo(function PuntBoatSVG({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <motion.div
      className="absolute cursor-pointer z-10"
      style={{ bottom: '28%', left: '10%' }}
      animate={{
        y: [0, -6, 0, -3, 0],
        x: [0, 120, 300, 500, 720],
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        x: {
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        width="120"
        height="60"
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Boat hull */}
        <ellipse cx="60" cy="42" rx="55" ry="14" fill="#8B6914" />
        <ellipse cx="60" cy="40" rx="55" ry="14" fill="#A67B2D" />
        {/* Boat interior */}
        <ellipse cx="60" cy="38" rx="45" ry="10" fill="#6B4F1B" />
        {/* Cushion/seats */}
        <rect x="25" y="33" width="20" height="8" rx="3" fill="#C4443B" />
        <rect x="75" y="33" width="20" height="8" rx="3" fill="#C4443B" />
        {/* Punter stick */}
        <line x1="90" y1="38" x2="105" y2="8" stroke="#5C3A1E" strokeWidth="3" strokeLinecap="round" />
        {/* Punter person */}
        <circle cx="88" cy="26" r="6" fill="#F5C6A0" />
        <rect x="82" y="31" width="12" height="14" rx="3" fill="#1B4D8C" />
        {/* Hat on punter */}
        <ellipse cx="88" cy="21" rx="7" ry="3" fill="#2C2420" />
      </svg>
    </motion.div>
  );
});

/* ------------------------------------------------------------------ */
/*  Hotspot component                                                  */
/* ------------------------------------------------------------------ */
function SceneHotspot({
  hotspot,
  onActivate,
  isActive,
}: {
  hotspot: (typeof hotspots)[number];
  onActivate: (id: string) => void;
  isActive: boolean;
}) {
  return (
    <div
      className="absolute z-20"
      style={hotspot.position}
    >
      {/* Pulse ring */}
      {!isActive && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-white/60" />
        </motion.div>
      )}

      {/* Button */}
      <motion.button
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg cursor-pointer"
        onClick={() => onActivate(hotspot.id)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        style={{ color: '#1B4D8C' }}
        aria-label={hotspot.label}
      >
        {hotspot.icon}
      </motion.button>

      {/* Tooltip */}
      {isActive && (
        <motion.div
          className="absolute -top-24 left-1/2 z-30 w-52 -translate-x-1/2 rounded-xl bg-white p-3 shadow-xl"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.25 }}
        >
          <p className="font-body text-sm text-ink leading-snug">
            {hotspot.fact}
          </p>
          <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main punting scene                                                 */
/* ------------------------------------------------------------------ */
export default function PuntingScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [waveTriggered, setWaveTriggered] = useState(false);

  // Cycle through speech bubble facts every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % puntingFacts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-close hotspot after 4 seconds
  useEffect(() => {
    if (!activeHotspot) return;
    const timer = setTimeout(() => setActiveHotspot(null), 4000);
    return () => clearTimeout(timer);
  }, [activeHotspot]);

  const handleBoatClick = () => {
    setWaveTriggered(true);
    setTimeout(() => setWaveTriggered(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        height: 500,
        background:
          'linear-gradient(180deg, #87CEEB 0%, #B8D4E8 55%, #2D8B57 55%, #1B6B3A 100%)',
      }}
    >
      {/* Sky clouds (subtle decoration) */}
      <div className="absolute top-6 left-[10%] w-24 h-10 rounded-full bg-white/30" />
      <div className="absolute top-10 right-[15%] w-32 h-12 rounded-full bg-white/25" />
      <div className="absolute top-4 left-[50%] w-20 h-8 rounded-full bg-white/20" />

      {/* Sun */}
      <div className="absolute top-8 right-[8%] w-14 h-14 rounded-full bg-gold/80 shadow-[0_0_30px_rgba(245,184,0,0.5)]" />

      {/* Willow trees on the bank */}
      <svg
        className="absolute bottom-[35%] left-[2%]"
        width="80"
        height="120"
        viewBox="0 0 80 120"
        fill="none"
      >
        {/* Trunk */}
        <rect x="34" y="50" width="12" height="70" rx="4" fill="#5C3A1E" />
        {/* Leaves */}
        <ellipse cx="40" cy="40" rx="30" ry="35" fill="#2D8B57" opacity="0.8" />
        <ellipse cx="30" cy="55" rx="20" ry="25" fill="#1B6B3A" opacity="0.7" />
        <ellipse cx="50" cy="50" rx="18" ry="22" fill="#2D8B57" opacity="0.7" />
      </svg>

      <svg
        className="absolute bottom-[38%] right-[5%]"
        width="60"
        height="100"
        viewBox="0 0 60 100"
        fill="none"
      >
        <rect x="26" y="40" width="10" height="60" rx="3" fill="#5C3A1E" />
        <ellipse cx="30" cy="32" rx="24" ry="30" fill="#2D8B57" opacity="0.8" />
      </svg>

      {/* Bridge silhouette in background */}
      <svg
        className="absolute bottom-[42%] right-[18%]"
        width="140"
        height="70"
        viewBox="0 0 140 70"
        fill="none"
      >
        <path
          d="M0,70 L0,45 Q35,15 70,45 Q105,15 140,45 L140,70 Z"
          fill="#6B4423"
          opacity="0.4"
        />
        <rect x="10" y="38" width="6" height="32" fill="#5C3A1E" opacity="0.5" />
        <rect x="50" y="32" width="6" height="38" fill="#5C3A1E" opacity="0.5" />
        <rect x="90" y="32" width="6" height="38" fill="#5C3A1E" opacity="0.5" />
        <rect x="128" y="38" width="6" height="32" fill="#5C3A1E" opacity="0.5" />
      </svg>

      {/* Water surface with waves */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] overflow-hidden">
        {/* Wave layers */}
        <svg
          className="absolute top-0 left-0 w-[200%] animate-[wave-drift_10s_linear_infinite]"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          style={{ height: 20 }}
        >
          <path
            d="M0,20 Q180,5 360,20 Q540,35 720,20 Q900,5 1080,20 Q1260,35 1440,20 L1440,40 L0,40 Z"
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
        <svg
          className="absolute top-4 left-0 w-[200%] animate-[wave-drift_14s_linear_infinite_reverse]"
          viewBox="0 0 1440 30"
          preserveAspectRatio="none"
          style={{ height: 16 }}
        >
          <path
            d="M0,15 Q240,0 480,15 Q720,30 960,15 Q1200,0 1440,15 L1440,30 L0,30 Z"
            fill="rgba(255,255,255,0.1)"
          />
        </svg>

        {/* Ripples when boat is clicked */}
        <AnimatePresence>
          {waveTriggered && (
            <motion.div
              className="absolute left-[15%] bottom-[45%]"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
            >
              <div className="w-20 h-4 rounded-full border-2 border-white/40" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Water sparkle dots */}
        <div className="absolute top-[20%] left-[20%] w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
        <div className="absolute top-[40%] left-[45%] w-1 h-1 rounded-full bg-white/25 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-[25%] left-[70%] w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] left-[85%] w-1 h-1 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Speech bubble above boat */}
      <div className="absolute left-[8%] top-[18%] z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            className="relative bg-white rounded-2xl px-4 py-3 shadow-lg max-w-[240px]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-body text-sm text-ink leading-snug">
              {puntingFacts[factIndex]}
            </p>
            {/* Bubble tail */}
            <div
              className="absolute -bottom-2 left-8 w-4 h-4 bg-white rotate-45"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The punt boat */}
      <PuntBoatSVG onClick={handleBoatClick} />

      {/* Clickable hotspots */}
      {hotspots.map((hotspot) => (
        <SceneHotspot
          key={hotspot.id}
          hotspot={hotspot}
          onActivate={setActiveHotspot}
          isActive={activeHotspot === hotspot.id}
        />
      ))}

      {/* CTA button */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center z-30">
        <motion.button
          className="flex items-center gap-2 bg-emerald text-white font-display text-lg px-6 py-3 rounded-full shadow-lg cursor-pointer"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(45, 139, 87, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBoatClick}
        >
          <Sailboat size={20} />
          我想试试撑船！
        </motion.button>
      </div>

      {/* Wave drift keyframes */}
      <style>{`
        @keyframes wave-drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
