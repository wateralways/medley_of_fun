import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface GemContextType {
  gemCount: number;
  addGem: () => void;
}

const GemContext = createContext<GemContextType>({
  gemCount: 0,
  addGem: () => {},
});

export function GemProvider({ children }: { children: ReactNode }) {
  const [gemCount, setGemCount] = useState(0);

  const addGem = useCallback(() => {
    setGemCount((prev) => prev + 1);
  }, []);

  return (
    <GemContext.Provider value={{ gemCount, addGem }}>
      {children}
    </GemContext.Provider>
  );
}

export function useGemContext() {
  return useContext(GemContext);
}
