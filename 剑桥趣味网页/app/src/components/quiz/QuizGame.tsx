import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  Calendar,
  Apple,
  Building2,
  Scroll,
  Crown,
  Sailboat,
  Trophy,
  Leaf,
  Monitor,
  BookOpen,
  Diamond,
} from 'lucide-react';
import type { QuizQuestion, Difficulty } from './quizData';
import { difficultySettings } from './quizData';
import confetti from 'canvas-confetti';

const illustrationMap: Record<string, React.ReactNode> = {
  calendar: <Calendar size={48} className="text-cambridge-blue" />,
  apple: <Apple size={48} className="text-emerald" />,
  building: <Building2 size={48} className="text-cambridge-blue" />,
  scroll: <Scroll size={48} className="text-gold" />,
  crown: <Crown size={48} className="text-gold" />,
  boat: <Sailboat size={48} className="text-cambridge-blue" />,
  trophy: <Trophy size={48} className="text-gold" />,
  leaf: <Leaf size={48} className="text-emerald" />,
  computer: <Monitor size={48} className="text-cambridge-blue" />,
  book: <BookOpen size={48} className="text-gem-red" />,
};

interface QuizGameProps {
  questions: QuizQuestion[];
  difficulty: Difficulty;
  playerName: string;
  onComplete: (results: {
    score: number;
    correctCount: number;
    maxCombo: number;
    answers: { questionId: number; correct: boolean }[];
  }) => void;
  onAddGem: () => void;
}

export default function QuizGame({
  questions,
  difficulty,
  playerName,
  onComplete,
  onAddGem,
}: QuizGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: number; correct: boolean }[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(difficultySettings[difficulty].timePerQuestion);
  const [comboPopup, setComboPopup] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const question = questions[currentIdx];
  const totalQuestions = questions.length;

  // Timer logic
  useEffect(() => {
    if (showFeedback) return;

    setTimeLeft(difficultySettings[difficulty].timePerQuestion);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto wrong
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, showFeedback]);

  const handleTimeUp = useCallback(() => {
    setSelectedOption(-1);
    setIsCorrect(false);
    setShowFeedback(true);
    setCombo(0);
    setAnswers((prev) => [...prev, { questionId: question.id, correct: false }]);

    setTimeout(() => {
      if (currentIdx < totalQuestions - 1) {
        setCurrentIdx((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // Quiz complete
        const finalResults = {
          score,
          correctCount,
          maxCombo,
          answers: [...answers, { questionId: question.id, correct: false }],
        };
        onComplete(finalResults);
      }
    }, 1800);
  }, [currentIdx, totalQuestions, question, score, correctCount, maxCombo, answers, onComplete]);

  const handleOptionClick = (optionIndex: number) => {
    if (showFeedback) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const correct = optionIndex === question.correctIndex;
    setSelectedOption(optionIndex);
    setIsCorrect(correct);
    setShowFeedback(true);

    const newAnswers = [...answers, { questionId: question.id, correct }];
    setAnswers(newAnswers);

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const comboMultiplier = newCombo >= 3 ? 3 : newCombo >= 2 ? 2 : 1;
      const points = 10 * comboMultiplier;
      setScore((prev) => prev + points);
      setCorrectCount((prev) => prev + 1);

      // Add gems
      onAddGem();
      if (newCombo >= 3) {
        // Bonus gems for 3+ combo
        for (let i = 0; i < 5; i++) {
          setTimeout(() => onAddGem(), i * 100);
        }
        setComboPopup(true);
        setTimeout(() => setComboPopup(false), 1500);
      }

      // Small confetti for correct answer
      confetti({
        particleCount: 15,
        spread: 50,
        origin: { y: 0.7, x: 0.5 },
        colors: ['#F5B800', '#2D8B57', '#E63946'],
        disableForReducedMotion: true,
      });
    } else {
      setCombo(0);
    }

    // Auto advance
    setTimeout(() => {
      if (currentIdx < totalQuestions - 1) {
        setCurrentIdx((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setComboPopup(false);
      } else {
        // Quiz complete - calculate final score
        const finalScore = correct
          ? score + 10 * (combo >= 2 ? (combo >= 3 ? 3 : 2) : 1)
          : score;
        const finalCorrectCount = correct ? correctCount + 1 : correctCount;
        const finalMaxCombo = correct
          ? Math.max(maxCombo, combo + 1)
          : maxCombo;
        onComplete({
          score: finalScore,
          correctCount: finalCorrectCount,
          maxCombo: finalMaxCombo,
          answers: newAnswers,
        });
      }
    }, 1500);
  };

  const totalTime = difficultySettings[difficulty].timePerQuestion;
  const timerPercent = (timeLeft / totalTime) * 100;
  const timerColor = timeLeft <= 5 ? 'var(--gem-red)' : 'var(--emerald)';

  const progressPercent = ((currentIdx) / totalQuestions) * 100;

  return (
    <div
      className="min-h-[100dvh] pt-16 pb-8 px-4"
      style={{
        background: 'linear-gradient(180deg, #FFF8E7 0%, #B8D4E8 100%)',
      }}
    >
      {/* HUD Bar */}
      <div
        className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-6"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Top row */}
          <div className="flex items-center justify-between mb-2">
            {/* Left: Question counter + name */}
            <div className="flex flex-col">
              <span className="font-body text-xs text-stone">{playerName}</span>
              <span className="font-display text-lg text-cambridge-blue">
                第 {currentIdx + 1} / {totalQuestions} 题
              </span>
            </div>

            {/* Center: Score + combo */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl text-gold font-medium">{score}</span>
                <span className="font-display text-sm text-stone">分</span>
              </div>
              <AnimatePresence>
                {combo > 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-1"
                  >
                    <Diamond size={12} className="text-gem-red" fill="#E63946" />
                    <span className="font-mono text-xs text-gem-red font-medium">
                      连击 x{combo}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Timer */}
            <div className="flex flex-col items-end">
              <div
                className="relative w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(${timerColor} ${timerPercent * 3.6}deg, #e5e5e5 0deg)`,
                }}
              >
                <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                  <span
                    className="font-mono text-sm font-medium"
                    style={{ color: timerColor }}
                  >
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-stone/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < currentIdx
                    ? 'bg-emerald'
                    : i === currentIdx
                    ? 'bg-cambridge-blue scale-125'
                    : 'bg-stone/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            {/* Question card */}
            <div className="bg-white rounded-panel shadow-lg p-6 sm:p-8 mb-6">
              {/* Question number badge */}
              <div className="flex justify-center mb-4">
                <span className="px-4 py-1 bg-cambridge-blue text-white font-display text-sm rounded-full">
                  第 {currentIdx + 1} 题
                </span>
              </div>

              {/* Illustration */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--sky-wash)' }}
                >
                  {illustrationMap[question.illustration] || illustrationMap.book}
                </div>
              </div>

              {/* Question text */}
              <h2 className="font-display text-xl sm:text-2xl text-ink text-center leading-relaxed mb-6">
                {question.question}
              </h2>

              {/* Answer options */}
              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const letter = option.charAt(0);
                  const text = option.slice(3);
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = idx === question.correctIndex;
                  const showCorrect = showFeedback && isCorrectOption;
                  const showWrong = showFeedback && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={showFeedback}
                      className={`
                        w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2
                        text-left transition-all duration-200
                        ${showCorrect
                          ? 'border-emerald bg-emerald/10 shadow-emerald-glow'
                          : showWrong
                          ? 'border-gem-red bg-gem-red/10'
                          : isSelected
                          ? 'border-emerald bg-emerald/10'
                          : 'border-stone/30 bg-white hover:border-cambridge-blue hover:bg-sky-wash'
                        }
                        ${showFeedback ? 'cursor-default' : 'cursor-pointer hover:translate-x-1'}
                      `}
                      whileHover={!showFeedback ? { scale: 1.01, x: 4 } : {}}
                      whileTap={!showFeedback ? { scale: 0.98 } : {}}
                      animate={
                        showWrong
                          ? { x: [0, -8, 8, -8, 8, 0] }
                          : showCorrect
                          ? { scale: [1, 1.03, 1] }
                          : {}
                      }
                      transition={
                        showWrong
                          ? { duration: 0.4 }
                          : showCorrect
                          ? { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }
                          : {}
                      }
                    >
                      {/* Option letter */}
                      <span
                        className={`font-display text-xl w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          showCorrect
                            ? 'bg-emerald text-white'
                            : showWrong
                            ? 'bg-gem-red text-white'
                            : 'bg-sky-wash text-cambridge-blue'
                        }`}
                      >
                        {letter}
                      </span>

                      {/* Option text */}
                      <span className="font-body text-base sm:text-lg text-ink flex-1">
                        {text}
                      </span>

                      {/* Status icon */}
                      {showCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 15,
                          }}
                        >
                          <Check size={24} className="text-emerald" />
                        </motion.div>
                      )}
                      {showWrong && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 15,
                          }}
                        >
                          <X size={24} className="text-gem-red" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback text */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center mt-5"
                  >
                    {isCorrect ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-display text-xl text-emerald">
                          答对了！+{10 * (combo >= 3 ? 3 : combo >= 2 ? 2 : 1)}分
                        </span>
                        {combo >= 2 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 12,
                            }}
                            className="font-display text-lg text-gold"
                          >
                            连击 x{combo}！
                          </motion.span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-display text-xl text-gem-red">
                          {selectedOption === -1 ? '时间到！' : '答错了！'}
                        </span>
                        <span className="font-body text-sm text-stone">
                          正确答案是：{question.options[question.correctIndex].slice(3)}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Combo popup overlay */}
      <AnimatePresence>
        {comboPopup && combo >= 3 && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
              className="bg-white/90 backdrop-blur-md rounded-3xl px-8 py-6 shadow-2xl border-4 border-gold"
            >
              <div className="flex items-center gap-3">
                <Diamond size={36} className="text-gem-red" fill="#E63946" />
                <div>
                  <p className="font-display text-3xl text-gold">
                    连击 x{combo}！
                  </p>
                  <p className="font-body text-sm text-stone">额外获得5颗宝石！</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
