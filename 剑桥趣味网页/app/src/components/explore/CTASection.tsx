import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Diamond, Gem, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGemContext } from '@/context/GemContext';

/* ------------------------------------------------------------------ */
/*  Floating decorative gem (no gem count impact)                    */
/* ------------------------------------------------------------------ */
const FloatGem = memo(function FloatGem({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`absolute pointer-events-none animate-float-slow ${className || ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <Gem size={24} className="text-gold/30" fill="#F5B800" />
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  CTA Section                                                        */
/* ------------------------------------------------------------------ */
export default function CTASection() {
  const { addGem } = useGemContext();

  return (
    <section
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ background: '#FFF8E7' }}
    >
      {/* Floating decorative gems */}
      <FloatGem className="top-[20%] left-[8%]" delay={0.3} />
      <FloatGem className="bottom-[25%] right-[10%]" delay={0.8} />
      <FloatGem className="top-[40%] right-[20%]" delay={1.2} />

      {/* Decorative sparkle dots */}
      <div className="absolute top-[15%] left-[15%] w-2 h-2 rounded-full bg-gold/30 animate-sparkle" />
      <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 rounded-full bg-gem-red/30 animate-sparkle" style={{ animationDelay: '0.7s' }} />
      <div className="absolute top-[30%] right-[15%] w-2 h-2 rounded-full bg-emerald/30 animate-sparkle" style={{ animationDelay: '1.4s' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-cambridge-blue mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          准备好认识传奇英雄了吗？
        </motion.h2>

        <motion.p
          className="font-body text-lg text-stone mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          这些了不起的校友就像冒险故事里的英雄！
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
          }}
        >
          <Link
            to="/heroes"
            className="inline-flex items-center gap-3 bg-gem-red text-white font-display text-xl px-8 py-4 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
            onClick={() => addGem()}
          >
            <Diamond size={22} className="text-white" fill="#FFFFFF" />
            认识英雄们
            <ArrowRight size={22} />
          </Link>
        </motion.div>

        {/* Clickable gems near the CTA */}
        <div className="mt-10 flex justify-center gap-8">
          <motion.button
            className="cursor-pointer transition-transform hover:scale-125"
            onClick={() => addGem()}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            aria-label="收集宝石"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Diamond size={24} className="text-gem-red" fill="#E63946" />
          </motion.button>
          <motion.button
            className="cursor-pointer transition-transform hover:scale-125"
            onClick={() => addGem()}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            aria-label="收集宝石"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Diamond size={28} className="text-gold" fill="#F5B800" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
