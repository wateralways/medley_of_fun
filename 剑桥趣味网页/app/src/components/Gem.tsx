import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond } from 'lucide-react';
import { useGemContext } from '@/context/GemContext';

interface GemProps {
  className?: string;
  delay?: number;
}

const Gem = memo(function Gem({ className = '', delay = 0 }: GemProps) {
  const { addGem } = useGemContext();
  const [collected, setCollected] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleCollect = useCallback(() => {
    if (collected) return;

    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.cos((i * Math.PI * 2) / 8) * 60,
      y: Math.sin((i * Math.PI * 2) / 8) * 60,
    }));
    setParticles(newParticles);
    setCollected(true);
    addGem();

    setTimeout(() => setParticles([]), 600);
  }, [collected, addGem]);

  return (
    <motion.div
      className={`absolute cursor-pointer select-none ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: collected ? 0 : 1, scale: collected ? 0 : 1 }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
      }}
      style={{ animationDelay: `${delay}s` }}
    >
      <motion.div
        animate={{ y: [-12, 12, -12] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        onClick={handleCollect}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <Diamond
          size={28}
          className="text-gem-red drop-shadow-gem-glow"
          fill="#E63946"
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Diamond size={14} className="text-gold" fill="#F5B800" />
        </motion.div>
      </motion.div>

      {/* Particle burst on collect */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gem-red pointer-events-none"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ marginLeft: '-4px', marginTop: '-4px' }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
});

export default Gem;
