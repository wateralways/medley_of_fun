import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Import sub-sections */
import RiverHero from '@/components/explore/RiverHero';
import CollegeExplorer from '@/components/explore/CollegeExplorer';
import KnowledgeBadgeWall from '@/components/explore/KnowledgeBadgeWall';
import PuntingScene from '@/components/explore/PuntingScene';
import CTASection from '@/components/explore/CTASection';

/* Register GSAP plugins once */
gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Explore Page — "探索魔法校园"                                      */
/* ------------------------------------------------------------------ */
export default function Explore() {
  const pageRef = useRef<HTMLDivElement>(null);

  // Refresh ScrollTrigger on mount (images etc. may shift layout)
  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={pageRef} className="w-full overflow-x-hidden">
      {/* Section 1: River Cam Entrance Hero */}
      <RiverHero />

      {/* Section 2: College Explorer — Interactive Flip Cards */}
      <CollegeExplorer />

      {/* Section 3: Knowledge Badge Wall */}
      <KnowledgeBadgeWall />

      {/* Section 4: Punting Adventure — Interactive Scene */}
      <PuntingScene />

      {/* Section 5: CTA — Next Adventure */}
      <CTASection />
    </div>
  );
}
