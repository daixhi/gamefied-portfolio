import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CHARACTERS } from '../constants';
import { CharacterType } from '../types';
import { Sparkles, Crown, Stars, Briefcase, BookOpen, Palette } from 'lucide-react';
import { StarsBackground } from './animate-ui/components/backgrounds/stars';
import yukiImg from '../../images/yuki.png';

interface CharacterSelectionProps {
  onSelect: (id: CharacterType) => void;
}

// Yuki memorial watermark — greyscale by default, colour on hover
function YukiWatermark() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed', left: '20px', bottom: '24px', zIndex: 50,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '8px', cursor: 'default', userSelect: 'none', maxWidth: '96px',
      }}
    >
      <img
        src={yukiImg}
        alt="Yuki"
        style={{
        width: '90px', height: '110px', objectFit: 'cover', objectPosition: 'top',
        borderRadius: '4px',
        transition: 'filter 0.7s ease, transform 0.7s ease',
        filter: hovered ? 'grayscale(0%) brightness(1)' : 'grayscale(100%) brightness(0.5)',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
     }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35 }}
            style={{
              fontSize: '8px', color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-display, monospace)', letterSpacing: '0.05em',
              textAlign: 'center', lineHeight: 1.6,
              maxWidth: '160px', position: 'absolute',
              bottom: '100%', left: '50%', transform: 'translateX(-50%)',
              marginBottom: '10px', background: 'rgba(0,0,0,0.88)',
              padding: '8px 10px', borderRadius: '4px', width: 'max-content',
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            space for yuki~
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CharacterSelection({ onSelect }: CharacterSelectionProps) {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooted(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 py-20 relative z-10 overflow-hidden">
      {/* STARS BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <StarsBackground />
      </div>
  
      <AnimatePresence>
        {!isBooted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="fixed inset-0 z-50 bg-white/5 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
        className="text-center mb-16 space-y-4 relative"
      >
        <div className="flex items-center justify-center gap-4 mb-2">
          <motion.div 
            animate={{ rotate: [0, 90, 180, 270, 360] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-brand-gold/50" />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '1em' }}
            animate={{ opacity: 1, letterSpacing: '0.4em' }}
            transition={{ duration: 1.5, delay: 1 }}
            className="text-[10px] uppercase font-display text-white/40"
          >
            Terminal Interface v0.0.1
          </motion.span>
          <motion.div 
            animate={{ rotate: [0, -90, -180, -270, -360] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-brand-gold/50" />
          </motion.div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-serif tracking-tight text-white mb-4 relative">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            SELECT YOUR ROLE
          </motion.span>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
            className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"
          />
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-sm font-display uppercase tracking-[0.3em] text-white/50"
        >
          -Pick a skin for your player-
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full relative">
        {CHARACTERS.map((char, index) => (
          <CharacterCard 
            key={char.id} 
            char={char} 
            index={index} 
            onSelect={() => onSelect(char.id as CharacterType)} 
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="mt-20 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
        <span className="text-[10px] font-display uppercase tracking-[0.5em] text-white/30">Syncing complete. Awaiting Input.</span>
      </motion.div>

      <YukiWatermark />
    </div>
  );
}

function CharacterCard({ char, index, onSelect }: { char: any, index: number, onSelect: () => void }) {
 const Icon = char.id === 'executive' ? Briefcase : char.id === 'strategist' ? BookOpen : Palette;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2 + index * 0.2 }}
      className="w-full"
    >
    
      <div 
        className={`group relative h-[600px] rounded-sm overflow-hidden glass-panel flex flex-col border-white/5 transition-all duration-300 ease-out hover:-translate-y-6 hover:scale-[1.15] hover:z-50 cursor-pointer
          ${char.id === 'executive' ? 'char-card-glow-maroon' : char.id === 'strategist' ? 'char-card-glow-purple' : 'char-card-glow-pink'}
        `}
        onClick={onSelect}
      >
        <div className="absolute inset-0 z-0 char-image-container pointer-events-none">
          <motion.img
            src={char.image}
            alt={char.title}
            className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent h-full opacity-90" />
        </div>
        
        <div className="absolute top-4 right-4 text-whileHover={{ y: -50hite/10 font-display text-[60px] select-none leading-none z-10">0{index + 1}</div>
        <div className="flex-grow z-10" />
        
        <div className="p-8 z-20 space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-4 h-4 text-zinc-400 group-hover:scale-110 transition-transform duration-500" style={{ color: char.color }} />
              <div className="h-[1px] w-12 bg-white/20" />
            </div>
            <h2 className="text-3xl font-serif text-white group-hover:tracking-wider transition-all duration-700">{char.title}</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] font-display text-white/40">{char.tagline}</p>
          </div>
          <div className="space-y-6 pt-4 border-t border-white/10">
            <p className="text-xs font-sans text-white/60 leading-relaxed">
              "{char.description}"
            </p>
            <button className="rpg-button w-full group-hover:bg-white/10" style={{ borderColor: char.color, color: char.color }}>
            SELECT
            </button>
          </div>
        </div>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none z-10" 
          style={{ background: `radial-gradient(circle at 50% 50%, ${char.color}, transparent 70%)` }} 
        />
      </div>
    </motion.div>
  );
}