import { memo } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, MapPin } from 'lucide-react';
import type { HotspotData } from './HotspotMarker';

interface DiscoveryLogProps {
  hotspots: HotspotData[];
  discoveredIds: Set<number>;
  discoveryOrder: Map<number, number>;
}

/**
 * Explorer Diary section — shows discovered and undiscovered locations.
 * Cards stagger in with Framer Motion on scroll.
 */
const DiscoveryLog = memo(function DiscoveryLog({
  hotspots,
  discoveredIds,
  discoveryOrder,
}: DiscoveryLogProps) {
  // Sort: discovered first, then by discovery order
  const sortedHotspots = [...hotspots].sort((a, b) => {
    const aDiscovered = discoveredIds.has(a.id);
    const bDiscovered = discoveredIds.has(b.id);
    if (aDiscovered && bDiscovered) {
      return (discoveryOrder.get(a.id) ?? 999) - (discoveryOrder.get(b.id) ?? 999);
    }
    if (aDiscovered) return -1;
    if (bDiscovered) return 1;
    return a.id - b.id;
  });

  const discoveredCount = hotspots.filter((h) => discoveredIds.has(h.id) && !h.isHidden).length;

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl text-cambridge-blue mb-2">
            你的探险日记
          </h2>
          <p className="font-body text-base text-stone">
            已记录 {discoveredCount} / {hotspots.filter((h) => !h.isHidden).length} 个发现
          </p>
        </motion.div>

        {/* Discovery cards */}
        <div className="flex flex-col gap-3">
          {sortedHotspots.map((hotspot, index) => {
            const isDiscovered = discoveredIds.has(hotspot.id);
            const order = discoveryOrder.get(hotspot.id);

            return (
              <motion.div
                key={hotspot.id}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                  isDiscovered
                    ? 'bg-parchment'
                    : 'bg-stone/10 opacity-60'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: isDiscovered ? 1 : 0.6, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                {/* Left: icon circle */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isDiscovered
                      ? hotspot.isHidden
                        ? 'bg-violet/20 text-violet'
                        : 'bg-cambridge-blue/15 text-cambridge-blue'
                      : 'bg-stone/20 text-stone'
                  }`}
                >
                  {isDiscovered ? (
                    hotspot.isHidden ? (
                      <MapPin size={20} />
                    ) : (
                      <span className="font-mono text-sm font-bold">
                        {order}
                      </span>
                    )
                  ) : (
                    <Lock size={18} />
                  )}
                </div>

                {/* Middle: text */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-body font-semibold text-sm ${
                      isDiscovered ? 'text-ink' : 'text-stone'
                    }`}
                  >
                    {isDiscovered ? hotspot.name : '??? 未发现的地点'}
                  </h4>
                  <p
                    className={`font-body text-xs mt-0.5 leading-relaxed ${
                      isDiscovered ? 'text-stone' : 'text-stone/60'
                    }`}
                  >
                    {isDiscovered
                      ? hotspot.fact
                      : '继续探索地图来发现这个秘密！'}
                  </p>
                </div>

                {/* Right: status icon */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isDiscovered
                      ? 'bg-emerald/15 text-emerald'
                      : 'bg-stone/15 text-stone'
                  }`}
                >
                  {isDiscovered ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    <Lock size={14} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default DiscoveryLog;
