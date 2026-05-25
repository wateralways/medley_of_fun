import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Gem, Sparkles } from 'lucide-react';
import type { HotspotData } from './HotspotMarker';

interface DiscoveryPopupProps {
  hotspot: HotspotData | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hotspot: HotspotData) => void;
  alreadyDiscovered: boolean;
  isMobile: boolean;
}

const imageMap: Record<string, string> = {
  '三一学院': '/trinity-college.jpg',
  '国王学院': '/kings-chapel.jpg',
  '国王学院礼拜堂': '/kings-chapel.jpg',
  '康河': '/river-cam-bg.jpg',
  '康河撑船': '/river-cam-bg.jpg',
  '数学桥': '/math-bridge.jpg',
  '牛顿苹果树': '/newton-apple-tree.jpg',
  '圣约翰学院': '/trinity-college.jpg',
  '叹息桥': '/math-bridge.jpg',
  '基督学院': '/trinity-college.jpg',
  '评议院大楼': '/kings-chapel.jpg',
  '徐志摩石碑': '/hero-xzhimo.png',
  '圣玛丽教堂': '/kings-chapel.jpg',
  '集市广场': '/river-cam-bg.jpg',
};

function getHotspotImage(name: string): string {
  return imageMap[name] || '/map-illustration.jpg';
}

/**
 * Discovery popup — modal on desktop, bottom sheet on mobile.
 * Uses Framer Motion AnimatePresence for enter/exit animations.
 */
const DiscoveryPopup = memo(function DiscoveryPopup({
  hotspot,
  isOpen,
  onClose,
  onConfirm,
  alreadyDiscovered,
  isMobile,
}: DiscoveryPopupProps) {
  const handleConfirm = useCallback(() => {
    if (hotspot) {
      onConfirm(hotspot);
    }
  }, [hotspot, onConfirm]);

  return (
    <AnimatePresence>
      {isOpen && hotspot && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {isMobile ? (
            /* Mobile bottom sheet */
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-5">
                {/* Drag handle */}
                <div className="w-10 h-1 bg-stone/30 rounded-full mx-auto mb-4" />

                <PopupContent
                  hotspot={hotspot}
                  alreadyDiscovered={alreadyDiscovered}
                  onClose={onClose}
                  onConfirm={handleConfirm}
                />
              </div>
            </motion.div>
          ) : (
            /* Desktop modal */
            <motion.div
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
                <PopupContent
                  hotspot={hotspot}
                  alreadyDiscovered={alreadyDiscovered}
                  onClose={onClose}
                  onConfirm={handleConfirm}
                />
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
});

interface PopupContentProps {
  hotspot: HotspotData;
  alreadyDiscovered: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function PopupContent({ hotspot, alreadyDiscovered, onClose, onConfirm }: PopupContentProps) {
  const isEasterEgg = hotspot.isHidden;

  return (
    <>
      {/* Colored banner */}
      <div
        className={`px-4 py-3 flex items-center justify-between ${
          isEasterEgg
            ? 'bg-gradient-to-r from-violet to-cambridge-blue'
            : 'bg-gradient-to-r from-cambridge-blue to-sky-wash'
        }`}
      >
        <div className="flex items-center gap-2">
          {isEasterEgg && <Sparkles size={18} className="text-gold" />}
          <h3 className="font-display text-lg text-white">
            {isEasterEgg ? '隐藏的秘密！' : hotspot.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="关闭"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Image */}
        <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-parchment">
          <img
            src={getHotspotImage(hotspot.name)}
            alt={hotspot.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Fun fact */}
        <p className="font-body text-sm text-ink leading-relaxed mb-4">
          {hotspot.fact}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2">
          {alreadyDiscovered ? (
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald/10 text-emerald font-body text-sm font-semibold">
              <CheckCircle2 size={18} />
              已发现
            </div>
          ) : (
            <button
              onClick={onConfirm}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg active:scale-95 ${
                isEasterEgg
                  ? 'bg-gradient-to-r from-violet to-cambridge-blue hover:shadow-violet/30'
                  : 'bg-gradient-to-r from-cambridge-blue to-emerald hover:shadow-emerald/30'
              }`}
            >
              <Gem size={16} />
              {isEasterEgg ? '领取奖励！' : '发现宝藏！'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default DiscoveryPopup;
