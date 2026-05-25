export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  illustration: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '剑桥大学成立于哪一年？',
    options: ['A. 1009年', 'B. 1209年', 'C. 1509年', 'D. 1809年'],
    correctIndex: 1,
    illustration: 'calendar',
  },
  {
    id: 2,
    question: '谁被苹果砸到头发现了万有引力？',
    options: ['A. 爱因斯坦', 'B. 达尔文', 'C. 牛顿', 'D. 霍金'],
    correctIndex: 2,
    illustration: 'apple',
  },
  {
    id: 3,
    question: '剑桥一共有多少个学院？',
    options: ['A. 15个', 'B. 21个', 'C. 31个', 'D. 41个'],
    correctIndex: 2,
    illustration: 'building',
  },
  {
    id: 4,
    question: '哪位中国校友写了《再别康桥》？',
    options: ['A. 鲁迅', 'B. 徐志摩', 'C. 金庸', 'D. 巴金'],
    correctIndex: 1,
    illustration: 'scroll',
  },
  {
    id: 5,
    question: '三一学院大门上亨利八世手里拿着什么？',
    options: ['A. 权杖', 'B. 椅子腿', 'C. 宝剑', 'D. 书本'],
    correctIndex: 1,
    illustration: 'crown',
  },
  {
    id: 6,
    question: '康河上的小船游览叫什么？',
    options: ['A. Boating', 'B. Punting', 'C. Sailing', 'D. Rowing'],
    correctIndex: 1,
    illustration: 'boat',
  },
  {
    id: 7,
    question: '剑桥培养了多少位诺贝尔奖得主？',
    options: ['A. 50位', 'B. 80位', 'C. 100位', 'D. 121位'],
    correctIndex: 3,
    illustration: 'trophy',
  },
  {
    id: 8,
    question: '谁提出了进化论？',
    options: ['A. 牛顿', 'B. 爱因斯坦', 'C. 达尔文', 'D. 图灵'],
    correctIndex: 2,
    illustration: 'leaf',
  },
  {
    id: 9,
    question: '计算机科学之父是谁？',
    options: ['A. 比尔·盖茨', 'B. 乔布斯', 'C. 图灵', 'D. 扎克伯格'],
    correctIndex: 2,
    illustration: 'computer',
  },
  {
    id: 10,
    question: '金庸在剑桥哪个学院学习过？',
    options: ['A. 三一学院', 'B. 国王学院', 'C. 圣约翰学院', 'D. 基督学院'],
    correctIndex: 2,
    illustration: 'book',
  },
];

export type Difficulty = 'easy' | 'normal' | 'hard';

export const difficultySettings: Record<Difficulty, { timePerQuestion: number; label: string }> = {
  easy: { timePerQuestion: 20, label: '简单' },
  normal: { timePerQuestion: 15, label: '普通' },
  hard: { timePerQuestion: 10, label: '困难' },
};

export interface QuizState {
  currentQuestion: number;
  score: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  playerName: string;
  difficulty: Difficulty;
  gameState: 'lobby' | 'playing' | 'results';
  answers: { questionId: number; correct: boolean }[];
}

export const initialQuizState: Omit<QuizState, 'playerName' | 'difficulty'> = {
  currentQuestion: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  correctCount: 0,
  gameState: 'lobby',
  answers: [],
};
