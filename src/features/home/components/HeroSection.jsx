import React, { useState, useEffect } from 'react';
import { motion as Motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";
import { Link } from 'react-router-dom';

const ease = [0.25, 0.46, 0.45, 0.94];

const HeroSection = () => {
  const { scrollY } = useScroll();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [maxScroll, setMaxScroll] = useState(isMobile ? 300 : 500);
  const [heights, setHeights] = useState(isMobile ? ['1.5rem', '4rem'] : ['6rem', '20rem']);

  useEffect(() => {
    const updateResponsiveValues = () => {
      if (window.innerWidth < 768) {
        setMaxScroll(300);
        setHeights(['1.5rem', '4rem']);
      } else {
        setMaxScroll(500);
        setHeights(['6rem', '20rem']);
      }
    };

    updateResponsiveValues();
    window.addEventListener('resize', updateResponsiveValues);
    return () => window.removeEventListener('resize', updateResponsiveValues);
  }, []);

  // Wheel and trackpad scrolling arrive in discrete jumps; mapping the arc's
  // height 1:1 onto scrollY replays every jump as a visible step, and reversing
  // direction snaps. Passing scrollY through a spring turns those steps into one
  // continuous motion. The spring is deliberately stiff: it settles in roughly
  // 80–100 ms, so a fast scroll still reads as real time, and only the jitter
  // between wheel ticks is absorbed. Softer settings looked smooth at a crawl
  // but visibly lagged behind a quick flick. Reduced-motion readers get the
  // direct mapping.
  const prefersReducedMotion = useReducedMotion();
  const smoothScrollY = useSpring(scrollY, { stiffness: 420, damping: 46, mass: 0.5, restDelta: 0.5 });
  const arcHeight = useTransform(prefersReducedMotion ? scrollY : smoothScrollY, [0, maxScroll], heights);

  return (
    <div className="relative w-full hero-radial-gradient bg-orange-50 overflow-hidden flex flex-col items-center">

      <div
        className="absolute inset-0 z-0 h-[700px] md:h-[850px] lg:h-[1000px]"
        style={{
          WebkitMaskImage: `url(https://framerusercontent.com/images/KrtEpetX0JndZB1QUZVp2ZKCDiY.png?width=2400&height=1080)`,
          WebkitMaskSize: 'cover',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: '50%',
          maskImage: `url(https://framerusercontent.com/images/KrtEpetX0JndZB1QUZVp2ZKCDiY.png?width=2400&height=1080)`,
          maskSize: 'cover',
          maskRepeat: 'no-repeat',
          maskPosition: '50%'
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(32% 25% at 50% 60.4%, #faeacd 0%, #faaf01 49.7297%, #de5900 100%)'
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-16 pt-[120px] md:pt-[150px] lg:pt-[184px] pb-[100px] md:pb-[120px] lg:pb-[150px] max-w-[880px] mx-auto">

        <Motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          className="relative bg-white/70 backdrop-blur-md border border-white/40 px-5 py-2 rounded-full mb-10 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          <span className="relative z-10 text-[#525252] font-medium tracking-wide text-sm">
            Building India's Future, One Learner at a Time.
          </span>
          <span className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#ff6207]/60 to-transparent"></span>
        </Motion.div>

        <Motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-[6rem] leading-tight text-[#0a0a0a] tracking-tight mb-2 font-poppins"
        >
          <span className="font-normal">Bodhan</span><span className="text-[var(--primary-500)]">.</span><span className="text-[var(--primary-500)] font-extralight">AI</span>
        </Motion.h1>

        <Motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.8 }}
          className="text-[#44403C] text-sm md:text-sm lg:text-base tracking-[0.15em] uppercase font-medium mb-10 text-center"
        >
          Centre of Excellence in AI for Education
        </Motion.p>

        <Motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 1.0 }}
          className="bg-[#0a0a0a] text-white text-sm md:text-base font-medium py-3 px-7 min-h-11 rounded-[10px] hover:bg-black transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-px cursor-pointer"
          onClick={() => document.getElementById('narrative')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Explore with Us
        </Motion.button>

      </div>
      <Motion.img src="https://framerusercontent.com/images/7JW5hiKTuIExiSp00XQILMZFt8.png?width=1920&amp;height=676" srcset="https://framerusercontent.com/images/7JW5hiKTuIExiSp00XQILMZFt8.png?scale-down-to=512&amp;width=1920&amp;height=676 512w,https://framerusercontent.com/images/7JW5hiKTuIExiSp00XQILMZFt8.png?scale-down-to=1024&amp;width=1920&amp;height=676 1024w,https://framerusercontent.com/images/7JW5hiKTuIExiSp00XQILMZFt8.png?width=1920&amp;height=676 1920w" alt="" style={{ height: arcHeight }} className="w-full relative flex-shrink-0"></Motion.img>
    </div>
  );
};

export default HeroSection;
