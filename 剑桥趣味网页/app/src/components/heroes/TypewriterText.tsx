import { useState, useEffect, memo } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  started: boolean;
  className?: string;
}

const TypewriterText = memo(function TypewriterText({
  text,
  speed = 30,
  started,
  className = '',
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!started) {
      setDisplayed('');
      return;
    }

    let index = 0;
    setDisplayed('');

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
});

export default TypewriterText;
