import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGemContext } from '@/context/GemContext';
import QuizLobby from '@/components/quiz/QuizLobby';
import QuizGame from '@/components/quiz/QuizGame';
import QuizResults from '@/components/quiz/QuizResults';
import { quizQuestions } from '@/components/quiz/quizData';
import type { Difficulty } from '@/components/quiz/quizData';

export default function Quiz() {
  const { addGem } = useGemContext();
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [results, setResults] = useState({
    score: 0,
    correctCount: 0,
    maxCombo: 0,
    answers: [] as { questionId: number; correct: boolean }[],
  });
  // Key to force remount of QuizGame on restart
  const [gameKey, setGameKey] = useState(0);

  const handleStart = useCallback((name: string, diff: Difficulty) => {
    setPlayerName(name);
    setDifficulty(diff);
    setGameState('playing');
    setGameKey((prev) => prev + 1);
  }, []);

  const handleComplete = useCallback(
    (quizResults: {
      score: number;
      correctCount: number;
      maxCombo: number;
      answers: { questionId: number; correct: boolean }[];
    }) => {
      setResults(quizResults);
      setGameState('results');
    },
    []
  );

  const handleRestart = useCallback(() => {
    setResults({ score: 0, correctCount: 0, maxCombo: 0, answers: [] });
    setGameState('lobby');
    setGameKey((prev) => prev + 1);
  }, []);

  const handleAddGem = useCallback(() => {
    addGem();
  }, [addGem]);

  return (
    <AnimatePresence mode="wait">
      {gameState === 'lobby' && (
        <motion.div
          key="lobby"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <QuizLobby onStart={handleStart} />
        </motion.div>
      )}

      {gameState === 'playing' && (
        <motion.div
          key={`game-${gameKey}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
        >
          <QuizGame
            questions={quizQuestions}
            difficulty={difficulty}
            playerName={playerName}
            onComplete={handleComplete}
            onAddGem={handleAddGem}
          />
        </motion.div>
      )}

      {gameState === 'results' && (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <QuizResults
            score={results.score}
            correctCount={results.correctCount}
            maxCombo={results.maxCombo}
            totalQuestions={quizQuestions.length}
            playerName={playerName}
            onRestart={handleRestart}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
