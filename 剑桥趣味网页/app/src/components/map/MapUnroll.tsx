import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface MapUnrollProps {
  children: React.ReactNode;
}

/**
 * GSAP-isolated component for map scroll animations.
 * Handles the "unroll" entrance effect and parallax on the map.
 * CRITICAL: No Framer Motion inside this component tree.
 */
export default function MapUnroll({ children }: MapUnrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !mapRef.current) return;

      // Map "unroll" entrance — scaleX from 0 to 1 centered
      gsap.fromTo(
        mapRef.current,
        {
          scaleX: 0,
          opacity: 0,
          transformOrigin: 'center center',
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 30%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Parallax effect on background map image
      if (mapImageRef.current) {
        gsap.to(mapImageRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full">
      <div
        ref={mapRef}
        className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden"
        style={{
          border: '8px solid #8B6914',
          boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
        }}
      >
        {/* Corner decorations — rolled map scrolls */}
        <div className="absolute top-0 left-0 w-8 h-8 z-10 pointer-events-none">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <path d="M0 0 L12 0 Q8 8 8 16 Q8 24 12 32 L0 32 Z" fill="#6B5310" />
            <path d="M0 0 L12 0 Q8 8 8 16 Q8 24 12 32 L0 32 Z" fill="url(#cornerGrad)" />
            <defs>
              <linearGradient id="cornerGrad" x1="0" y1="0" x2="12" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B6914" />
                <stop offset="1" stopColor="#6B5310" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-8 h-8 z-10 pointer-events-none transform scale-x-[-1]">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <path d="M0 0 L12 0 Q8 8 8 16 Q8 24 12 32 L0 32 Z" fill="#6B5310" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-8 h-8 z-10 pointer-events-none transform scale-y-[-1]">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <path d="M0 0 L12 0 Q8 8 8 16 Q8 24 12 32 L0 32 Z" fill="#6B5310" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8 z-10 pointer-events-none transform scale-x-[-1] scale-y-[-1]">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <path d="M0 0 L12 0 Q8 8 8 16 Q8 24 12 32 L0 32 Z" fill="#6B5310" />
          </svg>
        </div>

        {/* Map background with parallax */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <img
            ref={mapImageRef}
            src="/map-illustration.jpg"
            alt="剑桥魔法地图"
            className="absolute inset-0 w-full h-[120%] object-cover"
            style={{ top: '-10%' }}
          />

          {/* Semi-transparent overlay for better hotspot visibility */}
          <div className="absolute inset-0 bg-cambridge-blue/5 pointer-events-none" />

          {/* Hotspot children rendered on top */}
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
