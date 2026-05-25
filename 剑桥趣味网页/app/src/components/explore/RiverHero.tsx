import { useRef, memo } from 'react';
import { Diamond, Gem } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGemContext } from '@/context/GemContext';

gsap.registerPlugin();

/* ------------------------------------------------------------------ */
/*  Floating gem (decorative only — does not affect gem count)        */
/* ------------------------------------------------------------------ */
const FloatingHeroGem = memo(function FloatingHeroGem({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`absolute pointer-events-none animate-float-slow ${className || ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <Gem size={24} className="text-gold/60" fill="#F5B800" />
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Wave SVG at the bottom of the hero                                 */
/* ------------------------------------------------------------------ */
const WaveSVG = memo(function WaveSVG() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
      {/* Back wave — emerald, slower drift */}
      <svg
        viewBox="0 0 1440 120"
        className="absolute bottom-0 left-0 w-[200%] animate-[wave-drift_12s_linear_infinite]"
        preserveAspectRatio="none"
        style={{ height: 80 }}
      >
        <path
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
          fill="#2D8B57"
          fillOpacity="0.6"
        />
      </svg>
      {/* Front wave — sky-wash, faster drift */}
      <svg
        viewBox="0 0 1440 120"
        className="relative bottom-0 left-0 w-full"
        preserveAspectRatio="none"
        style={{ height: 60 }}
      >
        <path
          d="M0,80 C360,40 720,100 1080,60 C1260,40 1380,70 1440,80 L1440,120 L0,120 Z"
          fill="#B8D4E8"
          fillOpacity="0.9"
        />
      </svg>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Hero section                                                       */
/* ------------------------------------------------------------------ */
export default function RiverHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addGem } = useGemContext();

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-title', {
        y: -40,
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(1.7)',
      })
        .from(
          '.hero-subtitle',
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.35'
        )
        .from(
          '.hero-progress',
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.25'
        )
        .from(
          '.hero-gem',
          {
            scale: 0,
            opacity: 0,
            stagger: 0.15,
            duration: 0.5,
            ease: 'back.out(2)',
          },
          '-=0.3'
        );
    },
    { scope: containerRef }
  );

  const handleGemClick = () => {
    addGem();
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        height: '60vh',
        minHeight: 420,
        backgroundImage:
          'linear-gradient(180deg, rgba(27, 77, 140, 0.35) 0%, rgba(27, 77, 140, 0.55) 100%), url(/river-cam-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Floating decorative gems (clickable for real gems) */}
      <button
        className="hero-gem absolute cursor-pointer transition-transform hover:scale-125"
        style={{ top: '18%', left: '12%' }}
        onClick={handleGemClick}
        aria-label="收集宝石"
      >
        <Diamond size={28} className="text-gem-red" fill="#E63946" />
      </button>
      <button
        className="hero-gem absolute cursor-pointer transition-transform hover:scale-125"
        style={{ top: '28%', right: '15%' }}
        onClick={handleGemClick}
        aria-label="收集宝石"
      >
        <Diamond size={22} className="text-gold" fill="#F5B800" />
      </button>
      <button
        className="hero-gem absolute cursor-pointer transition-transform hover:scale-125"
        style={{ top: '12%', right: '35%' }}
        onClick={handleGemClick}
        aria-label="收集宝石"
      >
        <Diamond size={20} className="text-emerald" fill="#2D8B57" />
      </button>

      {/* Non-clickable floating decorations */}
      <FloatingHeroGem className="top-[35%] left-[25%]" delay={0.5} />
      <FloatingHeroGem className="top-[15%] right-[8%]" delay={1.2} />

      {/* Breadcrumb */}
      <div className="absolute top-20 left-4 sm:left-8 z-10">
        <span className="font-body text-sm text-white/70">
          首页 → 探索校园
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1
          className="hero-title font-display text-5xl sm:text-6xl md:text-7xl text-white mb-4"
          style={{ textShadow: '2px 2px 0 #2D8B57' }}
        >
          探索魔法校园
        </h1>

        <p className="hero-subtitle font-body text-lg sm:text-xl md:text-[22px] text-[#FFF8E7] mb-6 max-w-xl">
          沿着康河，探访8所最神奇的学院！
        </p>

        {/* Progress indicator */}
        <div className="hero-progress flex flex-col items-center gap-2">
          <span className="font-mono text-lg text-gold">
            已发现 0/8 个秘密
          </span>
          <div
            className="w-48 h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <div
              className="progress-bar-fill h-full rounded-full transition-all duration-500"
              style={{
                width: '0%',
                background: 'linear-gradient(90deg, #2D8B57, #F5B800)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Animated waves */}
      <WaveSVG />

      {/* Inline keyframe for wave drift */}
      <style>{`
        @keyframes wave-drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
