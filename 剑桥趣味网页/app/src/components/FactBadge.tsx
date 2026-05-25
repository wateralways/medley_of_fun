import { memo } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface FactBadgeProps {
  icon: React.ReactNode;
  unlocked?: boolean;
  onUnlock?: () => void;
  className?: string;
}

const FactBadge = memo(function FactBadge({
  icon,
  unlocked = false,
  onUnlock,
  className = '',
}: FactBadgeProps) {
  return (
    <motion.div
      className={`relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer ${
        unlocked
          ? 'bg-cambridge-blue border-[3px] border-gold'
          : 'bg-stone/30 border-[3px] border-stone/50 grayscale'
      } ${className}`}
      onClick={!unlocked ? onUnlock : undefined}
      whileHover={unlocked ? { scale: 1.1 } : { scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={
        unlocked
          ? { boxShadow: ['0 0 8px rgba(245, 184, 0, 0.3)', '0 0 20px rgba(245, 184, 0, 0.6)', '0 0 8px rgba(245, 184, 0, 0.3)'] }
          : {}
      }
      transition={unlocked ? { boxShadow: { duration: 2, repeat: Infinity } } : {}}
    >
      {unlocked ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-white"
        >
          {icon}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center text-stone">
          <Lock size={24} />
        </div>
      )}
    </motion.div>
  );
});

export default FactBadge;
