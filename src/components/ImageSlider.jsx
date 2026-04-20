import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageSlider({ images, className = '' }) {
  const n = images.length;

  // Extended array: [last, ...images, first] for seamless wrap
  const extended = n > 1 ? [images[n - 1], ...images, images[0]] : images;

  const [idx, setIdx] = useState(n > 1 ? 1 : 0);
  const [animated, setAnimated] = useState(true);
  const moving = useRef(false);

  const goTo = useCallback((next, anim = true) => {
    setAnimated(anim);
    setIdx(next);
  }, []);

  const prev = () => {
    if (moving.current) return;
    moving.current = true;
    goTo(idx - 1);
  };

  const next = () => {
    if (moving.current) return;
    moving.current = true;
    goTo(idx + 1);
  };

  const onTransitionEnd = () => {
    moving.current = false;
    if (n <= 1) return;
    if (idx === 0) {
      goTo(n, false);
    } else if (idx === n + 1) {
      goTo(1, false);
    }
  };

  useEffect(() => {
    setIdx(n > 1 ? 1 : 0);
    setAnimated(false);
    moving.current = false;
  }, [images, n]);

  if (!images || n === 0) return null;

  // Single image: just show it
  if (n === 1) {
    return (
      <div className={`overflow-hidden rounded-xl ${className}`}>
        <img src={images[0]} alt="Project screenshot" className="w-full h-full object-cover" />
      </div>
    );
  }

  const realIdx = idx === 0 ? n - 1 : idx === n + 1 ? 0 : idx - 1;

  return (
    <div className={`relative overflow-hidden rounded-xl group/slider select-none ${className}`}>
      {/* Slides */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${idx * (100 / extended.length)}%)`,
          transition: animated ? 'transform 0.4s ease-in-out' : 'none',
          width: `${extended.length * 100}%`,
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {extended.map((src, i) => (
          <div key={i} style={{ width: `${100 / extended.length}%` }} className="flex-shrink-0 h-full">
            <img src={src} alt={`Slide ${i}`} className="w-full h-full object-contain bg-black/5" />
          </div>
        ))}
      </div>

      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 z-10"
        aria-label="Previous"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 z-10"
        aria-label="Next"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => { moving.current = false; goTo(i + 1); }}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              i === realIdx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full z-10">
        {realIdx + 1} / {n}
      </div>
    </div>
  );
}
