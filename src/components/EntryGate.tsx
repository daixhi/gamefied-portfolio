import { motion } from 'motion/react';
import { useState } from 'react';

interface EntryGateProps {
  onEnter: () => void;
}

export function EntryGate({ onEnter }: EntryGateProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleGateOpen = () => {
    if (isOpening) return; // Prevent double-clicks
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 800); 
  };

  return (
    <div 
      className="fixed inset-0 z-[200] bg-transparent flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <motion.div 
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-zinc-950 -z-10" 
      />
      <motion.div 
        animate={{ opacity: isOpening ? 0 : 1 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white/5" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/5" />
      </motion.div>

      {/* Left Gate Panel */}
      <motion.div
        animate={{ 
          x: isOpening ? '-100%' : (isHovered ? '-5%' : '0%'),
          opacity: isOpening ? 0 : 1
        }}
        transition={{ duration: isOpening ? 0.7 : 1.2, ease: isOpening ? "circIn" : [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-0 w-1/2 h-full bg-zinc-900 border-r border-white/10 flex items-center justify-end overflow-hidden pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="mr-[-20px] opacity-10 blur-sm flex flex-col gap-4">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-4 w-64 bg-white/5 rounded-full" />
          ))}
        </div>
      </motion.div>

      {/* Right Gate Panel */}
      <motion.div
        animate={{ 
          x: isOpening ? '100%' : (isHovered ? '5%' : '0%'),
          opacity: isOpening ? 0 : 1
        }}
        transition={{ duration: isOpening ? 0.7 : 1.2, ease: isOpening ? "circIn" : [0.22, 1, 0.36, 1] }}
        className="absolute right-0 top-0 w-1/2 h-full bg-zinc-900 border-l border-white/10 flex items-center justify-start overflow-hidden pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent" />
        <div className="ml-[-20px] opacity-10 blur-sm flex flex-col gap-4">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-4 w-64 bg-white/5 rounded-full" />
          ))}
        </div>
      </motion.div>

      {/* Central HUD  */}
      <motion.div
        animate={{ 
          scale: isOpening ? 15 : (isHovered ? 1.05 : 1),
          opacity: isOpening ? 0 : 1,
          filter: isOpening ? 'blur(10px)' : 'blur(0px)'
        }}
        transition={{ duration: isOpening ? 0.6 : 0.8, ease: "easeIn" }}
        className="relative z-10 flex flex-col items-center gap-6 cursor-pointer"
        onClick={handleGateOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative group flex items-center justify-center">
          {/* Left Handle */}
          <motion.div
            animate={{ x: isHovered ? -40 : -20, opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-end gap-1"
          >
            <div className="w-[1px] h-48 bg-gradient-to-b from-transparent via-brand-gold to-transparent" />
            <div className="w-12 h-[1px] bg-brand-gold/50" />
            <div className="w-6 h-[1px] bg-brand-gold/30" />
          </motion.div>

          <div className="relative w-32 h-32 flex items-center justify-center">
            <motion.div
              animate={{ scale: isHovered ? 1.5 : 1, opacity: isHovered ? 0.8 : 0.2 }}
              className="absolute w-[2px] h-8 bg-brand-gold blur-[2px]"
            />
            <motion.div
              animate={{ opacity: isHovered ? [0.1, 0.4, 0.1] : 0.1 }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-brand-gold/10 blur-3xl rounded-full"
            />
          </div>

          {/* Right Handle */}
          <motion.div
            animate={{ x: isHovered ? 40 : 20, opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start gap-1"
          >
            <div className="w-[1px] h-48 bg-gradient-to-b from-transparent via-brand-gold to-transparent" />
            <div className="w-12 h-[1px] bg-brand-gold/50" />
            <div className="w-6 h-[1px] bg-brand-gold/30" />
          </motion.div>
        </div>

        <div className="text-center space-y-2">
          <motion.span 
            animate={{ letterSpacing: isHovered ? '0.8em' : '0.5em' }}
            className="text-[10px] text-white/40 uppercase font-display block"
          >
            Access Identity Archive
          </motion.span>
          <h2 className="text-2xl font-serif text-white tracking-widest uppercase">
            ENTER SYSTEM
          </h2>
        </div>
      </motion.div>

      <motion.div animate={{ opacity: isOpening ? 0 : 1 }} transition={{ duration: 0.3 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/10" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/10" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/10" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/10" />
        <div className="absolute bottom-12 w-full flex justify-between px-12 text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
          <span>Identity Protocol v0.0.1</span>
          <span>Secure Connection Established</span>
        </div>
      </motion.div>
    </div>
  );
}