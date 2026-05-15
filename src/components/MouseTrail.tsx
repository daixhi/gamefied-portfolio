import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
}

export function MouseTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const newParticle: Particle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };

      setParticles((prev) => [...prev.slice(-15), newParticle]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[500] overflow-hidden">
      <motion.div
        animate={{
          x: mousePos.x - 100,
          y: mousePos.y - 100,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
        className="w-[200px] h-[200px] rounded-full blur-[80px] bg-brand-gold/10 mix-blend-screen"
      />
      
      <AnimatePresence>
        {particles.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: i % 2 === 0 ? '4px' : '2px',
              height: i % 2 === 0 ? '1px' : '4px',
              backgroundColor: '#c5a059',
              boxShadow: '0 0 10px #c5a059',
              pointerEvents: 'none',
              zIndex: 501,
              translate: '-50% -50%',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
