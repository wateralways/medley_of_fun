import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, CheckCircle } from 'lucide-react';
import type { Difficulty } from './quizData';
import { difficultySettings } from './quizData';

interface QuizLobbyProps {
  onStart: (playerName: string, difficulty: Difficulty) => void;
}

const floatingQuestions = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 90 + 5}%`,
  top: `${Math.random() * 80 + 10}%`,
  size: Math.random() * 16 + 16,
  delay: Math.random() * 5,
  duration: Math.random() * 4 + 6,
}));

const rules = [
  { icon: <CheckCircle size={18} className="text-emerald" />, text: '每题10分，答对收集知识宝石' },
  { icon: <CheckCircle size={18} className="text-emerald" />, text: '连续答对有连击加分！' },
  { icon: <CheckCircle size={18} className="text-emerald" />, text: '全部答对可获得神秘证书' },
];

export default function QuizLobby({ onStart }: QuizLobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!playerName.trim()) {
      setError('请输入你的名字哦！');
      return;
    }
    if (playerName.trim().length > 12) {
      setError('名字不能超过12个字符');
      return;
    }
    setError('');
    onStart(playerName.trim(), difficulty);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/quiz-bg.jpg)' }}
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(27, 77, 140, 0.5)' }}
      />

      {/* Floating question marks */}
      {floatingQuestions.map((q) => (
        <motion.div
          key={q.id}
          className="absolute pointer-events-none select-none font-display"
          style={{
            left: q.left,
            top: q.top,
            fontSize: q.size,
            color: 'var(--gold)',
            opacity: 0.08,
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-5, 5, -5],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: q.duration,
            delay: q.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ?
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-20 flex flex-col items-center">
        {/* Trophy decoration */}
        <motion.div
          className="mb-4"
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src="/trophy-star.svg"
            alt=""
            className="w-16 h-16 opacity-80"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-5xl sm:text-6xl text-gold text-center mb-3"
          style={{ textShadow: '0 0 30px rgba(245,184,0,0.3)' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        >
          剑桥知识大挑战
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-body text-xl text-parchment text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          回答10道趣味问题，证明你是剑桥小达人！
        </motion.p>

        {/* Rules panel */}
        <motion.div
          className="w-full bg-white rounded-panel p-6 shadow-card mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="font-display text-xl text-cambridge-blue mb-4 text-center">
            游戏规则
          </h3>
          <div className="space-y-3">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-center gap-3">
                {rule.icon}
                <span className="font-body text-ink text-sm">{rule.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Difficulty selector */}
        <motion.div
          className="w-full mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="font-body text-sm text-parchment/80 text-center mb-2">选择难度</p>
          <div className="flex gap-2 justify-center">
            {(Object.keys(difficultySettings) as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`
                  px-4 py-2 rounded-xl font-body text-sm font-semibold transition-all duration-300
                  ${difficulty === d
                    ? 'bg-gold text-ink shadow-gold-glow scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }
                `}
              >
                {difficultySettings[d].label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Name input */}
        <motion.div
          className="w-full mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="小探险家，输入你的名字..."
            maxLength={12}
            className={`
              w-full h-14 px-5 rounded-2xl font-body text-lg outline-none transition-all duration-300
              bg-white border-2 text-ink placeholder:text-stone/60
              ${error
                ? 'border-gem-red focus:border-gem-red'
                : 'border-transparent focus:border-cambridge-blue'
              }
            `}
          />
          {error && (
            <motion.p
              className="text-gem-red font-body text-sm mt-2 text-center"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Start button */}
        <motion.button
          onClick={handleStart}
          className="
            w-full h-16 rounded-3xl font-display text-xl text-ink
            flex items-center justify-center gap-3
            transition-all duration-300 hover:scale-105 hover:shadow-gold-glow
            active:scale-95
          "
          style={{
            background: 'linear-gradient(135deg, #F5B800, #FFD700)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Swords size={24} />
          开始挑战
        </motion.button>
      </div>
    </div>
  );
}
