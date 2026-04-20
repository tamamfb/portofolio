import { useState, useEffect } from 'react';
import duckImg from '../assets/cursor.png';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only mount/activate on devices with a real mouse pointer
    if (!window.matchMedia('(pointer: fine)').matches) return;

    setIsVisible(true);

    const onMouseMove = (e) => {
      // Snap strictly to mouse
      setPosition({ x: e.clientX, y: e.clientY });

      // Check for hover target
      const target = e.target;
      const isClickable = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
      setIsHovering(Boolean(isClickable));
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  const size = isHovering ? 44 : 30;

  return (
    <img
      src={duckImg}
      alt=""
      className="fixed top-0 left-0 pointer-events-none z-[10000] select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(-50%, -50%) ${isHovering ? 'rotate(-15deg) scale(1.1)' : 'rotate(0deg) scale(1)'}`,
        transition: 'width 200ms ease-out, height 200ms ease-out, transform 200ms ease-out',
      }}
    />
  );
}
