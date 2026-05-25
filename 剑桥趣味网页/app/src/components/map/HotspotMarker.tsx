import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, MapPin, Sparkles } from 'lucide-react';

export interface HotspotData {
  id: number;
  name: string;
  fact: string;
  top: string;
  left: string;
  image?: string;
  isHidden?: boolean;
}

interface HotspotMarkerProps {
  hotspot: HotspotData;
  discovered: boolean;
  discoveryOrder: number;
  onClick: (hotspot: HotspotData) => void;
}

/**
 * Isolated pulsing marker component.
 * Wrapped with React.memo to prevent parent re-renders from resetting the infinite pulse animation.
 */
const HotspotMarker = memo(function HotspotMarker({
  hotspot,
  discovered,
  discoveryOrder,
  onClick,
}: HotspotMarkerProps) {
  const handleClick = useCallback(() => {
    onClick(hotspot);
  }, [hotspot, onClick]);

  if (hotspot.isHidden) {
    // Hidden easter egg — nearly invisible, subtle shimmer
    return (
      <motion.button
        className="absolute z-20 w-8 h-8 rounded-full cursor-pointer"
        style={{ top: hotspot.top, left: hotspot.left, transform: 'translate(-50%, -50%)' }}
        onClick={handleClick}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="隐藏的秘密"
      >
        <Sparkles size={20} className="text-violet/50" />
      </motion.button>
    );
  }

  return (
    <motion.button
      className="absolute z-20 flex items-center justify-center cursor-pointer group"
      style={{ top: hotspot.top, left: hotspot.left, transform: 'translate(-50%, -50%)' }}
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: hotspot.id * 0.08,
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      aria-label={hotspot.name}
    >
      {/* Outer pulsing ring (only for undiscovered) */}
      {!discovered && (
        <motion.span
          className="absolute inset-0 rounded-full bg-gold/30"
          style={{ width: 40, height: 40, marginLeft: -8, marginTop: -8 }}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Inner dot */}
      <span
        className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors duration-300 ${
          discovered
            ? 'bg-emerald border-white'
            : 'bg-gold border-white group-hover:bg-gem-red'
        }`}
      >
        {discovered ? (
          <Check size={14} className="text-white" strokeWidth={3} />
        ) : (
          <MapPin size={12} className="text-white" strokeWidth={2.5} />
        )}
      </span>

      {/* Discovery order badge */}
      {discovered && discoveryOrder > 0 && (
        <motion.span
          className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-cambridge-blue text-white text-[10px] font-bold font-body border-2 border-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          {discoveryOrder}
        </motion.span>
      )}

      {/* Tooltip label on hover */}
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-body text-xs font-semibold text-white bg-ink/80 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {hotspot.name}
      </span>
    </motion.button>
  );
});

export default HotspotMarker;
