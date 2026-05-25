import confetti from 'canvas-confetti';

/**
 * Trigger a small confetti burst from a specific position.
 * Used for card flips and badge unlocks.
 */
export function triggerConfetti(x: number, y: number, colors?: string[]) {
  const defaults = {
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors: colors || ['#F5B800', '#E63946', '#2D8B57', '#7C3AED', '#1B4D8C', '#F8D7DA'],
    disableForReducedMotion: true,
  };

  confetti({
    ...defaults,
    particleCount: 30,
    spread: 50,
    startVelocity: 25,
    gravity: 1.2,
    ticks: 200,
    scalar: 0.8,
  });

  // Secondary smaller burst for depth
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 15,
      spread: 30,
      startVelocity: 15,
      gravity: 0.8,
      ticks: 150,
      scalar: 0.5,
    });
  }, 100);
}

/**
 * Trigger a larger celebration confetti (for completing sections).
 */
export function triggerCelebration() {
  const duration = 1500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#F5B800', '#E63946', '#2D8B57', '#7C3AED', '#1B4D8C'],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#F5B800', '#E63946', '#2D8B57', '#7C3AED', '#1B4D8C'],
      disableForReducedMotion: true,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
