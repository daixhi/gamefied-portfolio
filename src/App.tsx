import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterSelection } from './components/CharacterSelection.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { EntryGate } from './components/EntryGate.tsx';
import { MouseTrail } from './components/MouseTrail.tsx';
import { CharacterType } from './types.ts';
import { CHARACTERS } from './constants.ts';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedCharId, setSelectedCharId] = useState<CharacterType | null>(null);

  const selectedCharacter = CHARACTERS.find(c => c.id === selectedCharId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCharId]);

  return (
    <div className={`min-h-screen bg-zinc-950 overflow-x-hidden relative ${!selectedCharId ? 'scanlines' : ''}`}>
      <MouseTrail />
      
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            key="gate"
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="z-[200] relative"
          >
            <EntryGate onEnter={() => setHasEntered(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.05),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <AnimatePresence mode="wait">
        {hasEntered && !selectedCharId ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <CharacterSelection onSelect={(id) => setSelectedCharId(id)} />
          </motion.div>
        ) : hasEntered && selectedCharId ? (
          <motion.div
            key={`profile-${selectedCharId}`}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <ProfileView 
              character={selectedCharacter!} 
              onBack={() => setSelectedCharId(null)} 
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {/* idk  */}
      <div className="fixed inset-0 pointer-events-none z-[200]">
        <div className="absolute top-0 left-0 w-full h-full mix-blend-overlay opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </div>
  );
}