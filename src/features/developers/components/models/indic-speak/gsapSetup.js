import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

// Registered in one place so the page and the sections that animate
// themselves cannot disagree about which plugins exist.
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger };
