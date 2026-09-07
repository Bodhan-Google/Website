import { useEffect, useRef, useState } from 'react';

// The template animates every section in with gsap ScrollTrigger: a 28px rise out
// of a fade over 0.72s on power3.out, fired once. This reproduces it in CSS (see
// .reveal in styles.css) so a fade costs no animation library.
//
// Only opacity and transform move. Anything that took the element out of layout
// would break width measurement in recharts' ResponsiveContainer and in the two
// hand-rolled SVG charts, both of which size themselves on mount.
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);

    // Printing never scrolls, so force everything visible first.
    const onPrint = () => setShown(true);
    window.addEventListener('beforeprint', onPrint);
    return () => {
      observer.disconnect();
      window.removeEventListener('beforeprint', onPrint);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${shown ? ' in-view' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;
