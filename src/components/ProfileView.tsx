// Notes are for me to clock it, plz feel free to ignore them!
import { motion, AnimatePresence } from 'motion/react';
import { CharacterData } from '../types';
import { ArrowLeft, MapPin, Calendar, Briefcase, List, BookOpen, Sparkles, X, Award, ExternalLink, Headphones, FileText, Play } from 'lucide-react';
import { useState, Suspense, useMemo, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Html, Float, Center } from '@react-three/drei';

// --- IMPORTS FOR GAME  ---
import floatGif from '../../images/float.gif';
import runGif from '../../images/run.gif';
import chairGif from '../../images/chair.gif';
import obj1 from '../../images/obj1.png';
import obj2 from '../../images/obj2.png';
import obj3 from '../../images/obj3.png';
import faceGlb from '../../images/face.glb?url';
import yukiImg from '../../images/yuki.png';

// Custom emoticons cause we bougie like that
const POST_GAME_EMOJIS = ['✎', '🎧ྀི', '𓍝', '✉︎'];


function useIsResizing(delay = 350) {
  const [isResizing, setIsResizing] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const onResize = () => {
      setIsResizing(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setIsResizing(false), delay);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [delay]);
  return isResizing;
}

interface ProfileViewProps {
  character: CharacterData;
  onBack: () => void;
}

function CharacterModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} rotation={[0, -Math.PI / 2, 0]} />;
}

function FaceModelDisplay({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  return (
    <Center>
      <primitive object={scene} scale={4.2} rotation={[0, -Math.PI / 2, 0]} />
    </Center>
  );
}

function NeonEmojis({ color, count = 100, proxyRef, visible = true }: { color: string, count?: number, proxyRef: any, visible?: boolean }) {
  const emojis = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      
      let x = (Math.random() - 0.5) * 12; // -6 to 6
      if (x > -2.5 && x <= 0) x -= 2.5;
      if (x > 0 && x < 2.5) x += 2.5;

      let y = (Math.random() - 0.5) * 8 - 0.5;
      let z = (Math.random() - 0.5) * 6; // Spread in 3D depth (-3 to 3)

      return {
        id: i,
        x, y, z,
        emoji: POST_GAME_EMOJIS[i % POST_GAME_EMOJIS.length],
        scale: Math.random() * 0.4 + 0.6, 
        speed: Math.random() * 2 + 1,
        rotationIntensity: Math.random() * 1.5,
        floatIntensity: Math.random() * 2 + 1,
      };
    });
  }, [count]);

  return (
    <group visible={visible}>
      {emojis.map((item) => (
        <Float key={item.id} position={[item.x, item.y, item.z]} speed={item.speed} rotationIntensity={item.rotationIntensity} floatIntensity={item.floatIntensity}>
          <Html center occlude={[proxyRef]}>
            <div style={{
              fontSize: `${2.5 * item.scale}rem`,
              userSelect: 'none',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              textShadow: `0 0 10px #fff, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`,
              color: 'white',
              opacity: 0.95,
              transition: 'opacity 0.2s ease-out' 
            }}>
              {item.emoji}
            </div>
          </Html>
        </Float>
      ))}
    </group>
  );
}
// POST-GAME SCENE — face.glb is preloaded (THIS GAVE ME SO MUCH ISSUE, STILL DK HOW I FIXED IT ;_;)
function PostGameScene({ color }: { color: string }) {
  const proxyRef = useRef<any>(null);
  const [emojisReady, setEmojisReady] = useState(false);
  const isResizing = useIsResizing(350);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEmojisReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <ambientLight intensity={1.0} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <FaceModelDisplay url={faceGlb} />
      <mesh ref={proxyRef} position={[0, -0.2, 0]}>
        <sphereGeometry args={[1.5, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {emojisReady && proxyRef.current && (
        <NeonEmojis color={color} count={60} proxyRef={proxyRef} visible={!isResizing} />
      )}
      <OrbitControls 
      autoRotate 
      autoRotateSpeed={3} 
      enableZoom={false} 
      minPolarAngle={Math.PI / 2} 
      maxPolarAngle={Math.PI / 2}  />
    </>
  );
}

function FloatingProp({ url, position }: { url: string, position: [number, number, number] }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    return () => {
      cloned.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [cloned]);

  return (
    <Float speed={4} rotationIntensity={2} floatIntensity={2} position={position}>
      <primitive object={cloned} scale={0.3} />
    </Float>
  );
}

function LoadingOverlay({ color, visible }: { color: string, visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
      <div className="flex flex-col items-center gap-3 bg-black/70 backdrop-blur-md px-6 py-4 rounded-sm" style={{ border: `1px solid ${color}33` }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          <span className="text-[10px] tracking-[0.4em] uppercase font-display" style={{ color }}>INITIALISING...</span>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color, animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}

function OnLoadSignal({ onLoad }: { onLoad: () => void }) {
  useEffect(() => { onLoad(); }, [onLoad]);
  return null;
}

function CharacterCanvas({ character, paused = false }: { character: CharacterData, paused?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);

  useEffect(() => { setLoaded(false); }, [character.id]);

  // iOS WebGL memory limit (~256MB) can't handle multiple high-res GLBs in one context.
  // Fall back to CSS floating symbols on iOS — they already exist for non-GLB characters.
  const isMobile = useMemo(() => /iPad|iPhone|iPod|Android/i.test(navigator.userAgent), []);
const hasGlbs = !isMobile && character.floatingGlbs && character.floatingGlbs.length > 0;

  const floatingSymbols = useMemo(() => {
    const baseIcons = ['✎', '🎧ྀི', '𓍝', '✉︎'];
    return Array.from({ length: 8 }).map((_, i) => {
      const isLeft = i % 2 === 0;
      return {
        id: i, icon: baseIcons[i % baseIcons.length],
        top: `${Math.random() * 80 + 10}%`,
        left: isLeft ? `${Math.random() * 15 + 5}%` : `${Math.random() * 15 + 80}%`,
        delay: Math.random() * 5, duration: Math.random() * 5 + 4, scale: Math.random() * 0.4 + 0.6,
        xDrift: Math.random() * 20 - 10, yDrift: Math.random() * -30 - 10, rotation: Math.random() * 40 - 20
      };
    });
  }, [character.id]);

  const floatPositions: [number, number, number][] = useMemo(() => [
    [-0.45, 0.4, 0.3], [0.45, 0.3, 0.3], [-0.4, -0.3, -0.4], [0.4, -0.4, -0.4], [0, 0.7, 0.1]
  ], []);

  return (
    <div className="w-full h-full relative z-20 cursor-grab active:cursor-grabbing">
      {!hasGlbs && floatingSymbols.map((item) => (
        <motion.div
          key={item.id}
          animate={{ y: [0, item.yDrift, 0], x: [0, item.xDrift, 0], rotate: [0, item.rotation, 0], opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
          className="absolute pointer-events-none z-10 select-none text-xl md:text-2xl"
          style={{ top: item.top, left: item.left, color: 'white', transform: `scale(${item.scale})`, textShadow: `0 0 6px ${character.color}, 0 0 15px ${character.color}` }}
        >
          {item.icon}
        </motion.div>
      ))}

      <LoadingOverlay color={character.color} visible={!loaded} />

      <Canvas camera={{ position: [0, 0, 3.5], fov: 35 }}
              dpr={isMobile ? [1, 1] : [1, 1.5]}
              performance={{ min: 0.3 }}
              frameloop={paused ? "never" : "demand"}
              style={{ touchAction: 'pan-y' }}
              gl={{ antialias: !isMobile, powerPreference: 'low-power' }}
              onCreated={({ gl }) => { return () => gl.dispose(); }}
              >
        <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6} adjustCamera={character.id === 'creator' ? 1.25 : character.id === 'strategist' ? 0.95 : character.id === 'executive' ? 1.00 : 1.00}>
            <CharacterModel url={character.profileImage} />
          </Stage>
          {hasGlbs && (
            <>
              <ambientLight intensity={2.5} />
              <pointLight position={[2, 2, 2]} intensity={2} />
            </>
          )}
          {hasGlbs && character.floatingGlbs!.map((url, i) => (
            <FloatingProp key={i} url={url} position={floatPositions[i % floatPositions.length]} />
          ))}
          <OnLoadSignal onLoad={onLoad} />
        </Suspense>
        <OrbitControls
        autoRotate 
        autoRotateSpeed={1.0} 
        enableZoom={false} 
        enablePan={false}
        enableRotate={!isMobile}
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}

// Yuki memorial watermark 
function YukiWatermark() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed left-3 sm:left-5 bottom-4 sm:bottom-6 z-50 flex flex-col items-center gap-2 cursor-default select-none"
      style={{ maxWidth: '96px' }}
    >
      <img
        src={yukiImg}
        alt="Yuki"
        className="w-14 sm:w-20 h-14 sm:h-20 object-contain transition-all duration-700"
        style={{
          filter: hovered ? 'grayscale(0%) brightness(1)' : 'grayscale(100%) brightness(0.55)',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.35 }}
            className="text-[8px] text-white/70 font-display tracking-wide text-center leading-relaxed"
            style={{
              maxWidth: '160px',
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '10px',
              background: 'rgba(0,0,0,0.88)',
              padding: '8px 10px',
              borderRadius: '4px',
              width: 'max-content',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
             space for yuki~
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProfileView({ character, onBack }: ProfileViewProps) {
  const defaultCategory = character.id === 'creator' ? 'publication' : (character.id === 'strategist' ? 'education' : 'experience');
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory);
  const [activeExpId, setActiveExpId] = useState(character.experiences.find(e => e.category === defaultCategory)?.id || character.experiences[0]?.id);
  const [activeContribution, setActiveContribution] = useState<{title: string, text: string, index: number} | null>(null);
  
  // State for the Game Modal
  const [showGameModal, setShowGameModal] = useState(false);

  useEffect(() => {
    const newDefault = character.id === 'creator' ? 'publication' : (character.id === 'strategist' ? 'education' : 'experience');
    setActiveCategory(newDefault);
    const newExp = character.experiences.find(e => e.category === newDefault) || character.experiences[0];
    if (newExp) setActiveExpId(newExp.id);
  }, [character.id]);

  const activeExp = character.experiences.find(e => e.id === activeExpId) || character.experiences[0];

  const handleCategorySwitch = (category: string) => {
    setActiveCategory(category);
    const firstExp = character.experiences.find(e => e.category === category) || character.experiences[0];
    if (firstExp) setActiveExpId(firstExp.id);
  };

  useEffect(() => {
    if (showGameModal || activeContribution) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.documentElement.style.overflow = 'unset';
      document.body.style.overflow = 'unset';
    };
  }, [showGameModal, activeContribution]);

  const memoizedCanvas = <CharacterCanvas character={character} paused={showGameModal} />;

  return (
    <div className={`min-h-screen relative flex flex-col pt-6 sm:pt-10 px-4 sm:px-8 md:px-12 lg:px-16 pb-16 sm:pb-20 overflow-hidden`}>
      <div className="fixed inset-0 transition-colors duration-1000 -z-10" 
        style={{ background: `radial-gradient(circle at 10% 50%, ${character.theme.accentGlow}, black 85%)`, opacity: 0.6 }} />

      <header className="flex justify-between items-center mb-8 sm:mb-12 z-50 gap-4 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-display text-white/40 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> RETURN_TO_MENU
        </button>
        <div className="text-[10px] uppercase tracking-[0.5em] font-display text-white/20">
        SECURE_ACCESS // <span className="text-white/60">PRAKRITI // {character.title}</span>    
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 relative z-10 items-start">
        
        {/* LEFT COLUMN: Character Display */}
        <div className={`${character.id === 'creator' ? 'lg:col-span-7' : 'lg:col-span-5'} flex flex-col h-full w-full transition-all duration-700`}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="pointer-events-none mb-4 z-30 w-full overflow-hidden">
            <h2 className="text-[clamp(3.5rem,5.5vw,7.5rem)] whitespace-nowrap font-serif text-white tracking-tighter uppercase leading-[0.8] -ml-1">
              {character.title.split(' ')[1] || character.title}
            </h2>
            <div className="flex items-start gap-4 mt-6">
              <div className="w-12 h-[1px] shrink-0 mt-[8px]" style={{ backgroundColor: character.color }} />
              <p className="text-[10px] font-display tracking-[0.3em] text-white/40 uppercase leading-relaxed">{character.motto}</p>
            </div>
          </motion.div>

          <div className="flex-1 relative min-h-[380px] sm:min-h-[500px] md:min-h-[600px] -mt-12 sm:-mt-16 flex flex-col justify-end pb-4">
            <div className="absolute inset-0">
               {memoizedCanvas}
            </div>
            
            {/* FINALISE BUTTON */}
            <div className="relative z-30 flex justify-center pointer-events-auto">
               <button 
                 onClick={() => { useGLTF.preload(faceGlb); setShowGameModal(true); }}
                 className="px-8 py-3 rounded-sm glass-panel border border-white/20 text-white font-display tracking-[0.3em] text-[10px] uppercase hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group flex items-center gap-3 overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                 <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform relative z-10" style={{ color: character.color }} />
                 <span className="relative z-10">Finalise this skin</span>
               </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: UI Panels */}
        <div className={`${character.id === 'creator' ? 'lg:col-span-5' : 'lg:col-span-7'} flex flex-col gap-10 transition-all duration-700`}>
          
          {/* TABS AREA */}
          <div className="w-full">
            {character.id === 'creator' ? (
              <div className="grid grid-cols-2 gap-0">
                <div className="col-span-1"><TabButton compact active={activeCategory === 'publication'} subLabel="DATABASE" label="PUBLICATIONS" icon={<FileText className="w-4 h-4"/>} color="#88FFFF" onClick={() => handleCategorySwitch('publication')} /></div>
                <div className="col-span-1"><TabButton compact active={activeCategory === 'achievement'} subLabel="RECORDS" label="CREDENTIALS" icon={<Award className="w-4 h-4"/>} color="#88FFFF" onClick={() => handleCategorySwitch('achievement')} /></div>
                <div className="col-span-2"><TabButton compact active={activeCategory === 'hobby'} subLabel="MODULE" label="AUXILIARY" icon={<Headphones className="w-4 h-4"/>} color="#88FFFF" onClick={() => handleCategorySwitch('hobby')} /></div>
              </div>
            ) : character.id === 'strategist' ? (
              <div className="grid grid-cols-2 gap-4">
                <TabButton active={activeCategory === 'education'} subLabel="ACADEMIC" label="QUALIFICATION" icon={<BookOpen className="w-5 h-5"/>} color="#B088FF" onClick={() => handleCategorySwitch('education')} />
                <TabButton active={activeCategory === 'experience'} subLabel="FIELD_WORK" label="INTERNSHIPS" icon={<Briefcase className="w-5 h-5"/>} color="#f59e0b" onClick={() => handleCategorySwitch('experience')} />
              </div>
            ) : (
               <div className="glass-panel p-8 border-l-4 w-full" style={{ borderLeftColor: character.color }}>
                 <div className="text-[10px] text-white/30 uppercase tracking-[0.4em] mb-2 font-display">SYSTEM_AUTHORIZATION</div>
                 <div className="text-2xl text-white font-serif uppercase tracking-widest">{character.skills?.[0]?.name}</div>
               </div>
            )}
          </div>

          {character.id === 'creator' ? (
            /* CREATIVE MODE */
            <div className="glass-panel p-8 md:p-10 rounded-sm overflow-hidden flex flex-col max-h-[600px] w-full">
              <AnimatePresence mode="wait">
                <motion.div key={activeCategory} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-10 overflow-y-auto custom-scrollbar pr-4">
                  {activeCategory === 'hobby' && (
                    <div className="flex flex-col gap-2 p-5 bg-white/[0.03] border border-white/10 rounded-sm hover:border-white/40 hover:bg-white/[0.05] transition-all w-full relative overflow-hidden group/item cursor-default">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                      <div className="flex justify-between items-start gap-3 w-full relative z-10">
                        <h4 className="text-xs font-display tracking-widest text-white/90 uppercase flex items-center gap-3 flex-1 break-words">
                          <Sparkles className="w-4 h-4 shrink-0" style={{ color: character.color }} />Writing Samples
                        </h4>
                        <button onClick={() => window.open('https://drive.google.com/file/d/1FseTbEnwmhQSdL1PpcdxZXJuH6TGCvEM/view?usp=drive_link')} className="shrink-0 text-[9px] text-white border border-white/20 px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition-all font-display tracking-widest cursor-pointer relative z-20">OPEN</button>
                      </div>
                      <p className="text-[11px] text-white/40 italic leading-relaxed whitespace-pre-wrap pl-7 relative z-10">"A selection of my written work."</p>
                    </div>
                  )}

                  {character.experiences.filter(e => e.category === activeCategory).map(exp => (
                    <div key={exp.id} className="space-y-6 w-full">
                      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <div className="w-2 h-2 rotate-45" style={{ backgroundColor: character.color }} />
                        <span className="text-[11px] uppercase tracking-[0.5em] text-white/60 font-display">{exp.company}</span>
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        {exp.contributions.map((c, i) => (
                          <div key={i} className="flex flex-col gap-2 p-5 bg-white/[0.03] border border-white/10 rounded-sm hover:border-white/40 hover:bg-white/[0.05] transition-all w-full relative overflow-hidden group/item cursor-default">
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/item:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                             
                             <div className="flex justify-between items-start gap-3 w-full relative z-10">
                                <h4 className="text-xs font-display tracking-widest text-white/90 uppercase flex items-center gap-3 flex-1 break-words">
                                  <Sparkles className="w-4 h-4 shrink-0" style={{ color: character.color }} />{c.title}
                                </h4>
                                {c.link && <button onClick={() => window.open(c.link, '_blank')} className="shrink-0 text-[9px] text-white border border-white/20 px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition-all font-display tracking-widest cursor-pointer relative z-20">LAUNCH</button>}
                             </div>
                             <p className="text-[11px] text-white/40 italic leading-relaxed whitespace-pre-wrap pl-7 relative z-10">"{c.text}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}


                </motion.div>
              </AnimatePresence>
            </div>
          ) : 
          
          (
            /* PROFESSIONAL MODE*/
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[600px] w-full">
               <div className="lg:col-span-4 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                  <div className="flex items-center gap-2 mb-4 text-white/20"><List className="w-4 h-4"/><span className="text-xs uppercase tracking-widest font-display">ARCHIVE_INDEX</span></div>
                  {character.experiences.filter(e => e.category === activeCategory || (!e.category && character.id === 'executive')).map((exp) => (
                    <button 
                      key={exp.id} 
                      onClick={() => { 
                        setActiveExpId(exp.id); 
                        if (window.innerWidth < 1024) {
                          document.getElementById('experience-details')?.scrollIntoView({ behavior: 'smooth' }); 
                        }
                      }} 
                      className={`w-full text-left p-5 rounded-sm transition-all glass-panel border-r-4 relative overflow-hidden group/btn ${activeExpId === exp.id ? 'opacity-100 bg-white/[0.08] border-white/50 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]' : 'opacity-40 hover:opacity-70 border-transparent'}`} 
                      style={{ borderRightColor: activeExpId === exp.id ? exp.accentColor : 'transparent' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
                      <div className="text-xs font-display uppercase text-white tracking-widest leading-tight relative z-10">{exp.company}</div>
                      <div className="text-[10px] text-white/40 uppercase mt-2 relative z-10">{exp.duration}</div>
                    </button>
                  ))}
               </div>
              
               <div id="experience-details" className="lg:col-span-8 glass-panel p-8 rounded-sm overflow-hidden flex flex-col">
                  <AnimatePresence mode="wait">
                    {activeExp && (
                      <motion.div key={activeExp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full space-y-6">
                        
                        {/* Stats Box */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-white/[0.02] p-4 md:p-6 border border-white/5 rounded-sm relative overflow-hidden group/stats hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-default">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/stats:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                          
                          <div className="space-y-2 relative z-10">
                             <span className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-4 h-4"/> DURATION</span>
                             <div className="text-sm text-white/80 break-words">{activeExp.duration}</div>
                          </div>
                          
                          <div className="space-y-2 relative z-10">
                             <span className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4"/> LOCATION</span>
                             <div className="text-sm text-white/80 break-words">{activeExp.location}</div>
                          </div>
                          
                          {activeExp.cgpa && (
                             <div className="col-span-1 sm:col-span-2 pt-4 border-t border-white/5 space-y-2 relative z-10">
                                <span className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2"><Award className="w-4 h-4"/> EVALUATION</span>
                                <div className="text-sm text-white/80 font-mono tracking-widest break-words">{activeExp.cgpa}</div>
                             </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar pb-2">
                           {activeExp.contributions.map((c, i) => {
                             const isLastOdd = activeExp.contributions.length % 2 !== 0 && i === activeExp.contributions.length - 1;
                             const isUnopenable = c.title.toLowerCase().includes('thesis') || c.title.toLowerCase().includes('honours') || c.title.toLowerCase().includes('degree') || c.title.toLowerCase().includes('ll.m');

                             if (isUnopenable) {
                               return (
                                 <div key={i} className={`p-5 bg-white/[0.03] border border-white/10 rounded-sm hover:border-white/30 transition-all group flex flex-col gap-2 relative overflow-hidden cursor-default ${isLastOdd ? 'md:col-span-2' : ''}`}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                                    <div className="flex justify-between items-start gap-3 w-full mb-1 relative z-10">
                                      <h4 className="text-xs text-white/90 font-display tracking-widest uppercase leading-tight flex-1 break-words flex items-center gap-2">
                                         <Sparkles className="w-3 h-3 shrink-0" style={{ color: character.color }} /> {c.title}
                                      </h4>
                                    </div>
                                    <p className="text-[11px] text-white/40 italic leading-relaxed whitespace-pre-wrap pl-5 relative z-10">"{c.text}"</p>
                                 </div>
                               );
                             }

                             return (
                               <div key={i} onClick={() => setActiveContribution({ title: c.title, text: c.text, index: i })} className={`p-5 bg-white/[0.03] border border-white/10 rounded-sm hover:border-white/40 hover:bg-white/[0.05] cursor-pointer transition-all group flex flex-col justify-between min-h-[110px] relative overflow-hidden ${isLastOdd ? 'md:col-span-2' : ''}`}>
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                                 <div className="flex flex-col gap-1.5 w-full mb-3 relative z-10">
                                   <h4 className="text-xs text-white/90 font-display tracking-widest uppercase leading-tight">{c.title}</h4>
                                   <span className="text-[9px] text-white/20 group-hover:text-white/60 font-display tracking-widest">[ OPEN ]</span>
                                 </div>
                                 <p className="text-[11px] text-white/40 italic line-clamp-2 pr-2 relative z-10">"{c.text}"</p>
                               </div>
                             );
                           })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          )}
        </div>
      </main>

    {createPortal(
      <AnimatePresence>
        {activeContribution && character.id !== 'creator' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-start',
              overflowY: 'auto', overflowX: 'hidden',
              padding: '16px',
              background: 'rgba(0,0,0,0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              WebkitOverflowScrolling: 'touch',
              boxSizing: 'border-box',
            }}
            onClick={() => setActiveContribution(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '640px',
                /* margin auto: 3 hours */
                marginTop: 'auto',
                marginBottom: 'auto',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#050505',
                borderLeft: `4px solid ${activeExp.accentColor}`,
                boxShadow: '0 0 50px rgba(0,0,0,1)',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
              className="glass-panel"
            >

              <div style={{
                padding: 'clamp(12px, 4vw, 32px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '12px', flexShrink: 0,
                backgroundColor: 'rgba(5,5,5,0.8)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <Sparkles style={{ color: activeExp.accentColor, width: 'clamp(14px,3vw,20px)', height: 'clamp(14px,3vw,20px)', flexShrink: 0 }} />
                  <h3 style={{
                    fontSize: 'clamp(0.8rem, 3.5vw, 1.4rem)',
                    color: 'white', fontFamily: 'serif',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    lineHeight: 1.2, margin: 0, wordBreak: 'break-word',
                  }}>
                    {activeContribution.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveContribution(null)}
                  style={{ padding: '6px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  <X style={{ width: 'clamp(16px,4vw,22px)', height: 'clamp(16px,4vw,22px)' }} />
                </button>
              </div>
              {/* Body */}
              <div style={{
                padding: 'clamp(12px, 4vw, 40px)',
                WebkitOverflowScrolling: 'touch',
              }}>
                <p style={{
                  fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
                  color: 'rgba(255,255,255,0.7)', lineHeight: 1.8,
                  fontStyle: 'italic', whiteSpace: 'pre-wrap', margin: 0,
                }}>
                  "{activeContribution.text}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}

     {/* GAME MODAL INTEGRATION */}
     {createPortal(
      <AnimatePresence>
        {showGameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-start',
              overflowY: 'auto', overflowX: 'hidden',
              padding: '16px',
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              WebkitOverflowScrolling: 'touch',
              boxSizing: 'border-box',
            }}
          >
            <GameModal characterId={character.id} color={character.color} onClose={() => setShowGameModal(false)} />
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}

    <YukiWatermark />

    </div>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

function TabButton({ active, subLabel, label, icon, color, onClick, compact = false }: any) {
  return (
    <button onClick={onClick} className={`w-full text-left rounded-sm border-l-2 md:border-l-4 transition-all duration-500 glass-panel group relative overflow-hidden
      ${active ? 'bg-white/[0.05] opacity-100 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'opacity-30 hover:opacity-70 border-white/5'}
      p-3 md:p-8`}
      style={{ borderLeftColor: active ? color : 'transparent' }}>
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      <div className={`flex items-center gap-2 md:gap-3 mb-1 md:mb-3 relative z-10`} style={{ color: active ? color : 'inherit' }}>
        {icon} 
        <span className={`uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30 font-display text-[8px] md:text-xs`}>{subLabel}</span>
      </div>
      <div className={`text-white uppercase font-serif tracking-wider leading-tight relative z-10 transition-all
        ${compact ? 'text-[10px] sm:text-sm md:text-base lg:text-lg' : 'text-[10px] sm:text-xs md:text-xl group-hover:tracking-[0.1em]'}`}>
        {label}
      </div>
    </button>
  );
}

// --- THE GAME LOGIC --- //

function GameModal({ characterId, color, onClose }: { characterId: string, color: string, onClose: () => void }) {
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Attempt to force landscape on mobile devices when modal opens
  useEffect(() => {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (e) {}

    return () => {
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (e) {}
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      onClick={e => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '768px',
        /* margin auto x2 */
        marginTop: 'auto',
        marginBottom: 'auto',
        flexShrink: 0,
        backgroundColor: '#050505',
        borderTop: `4px solid ${color}`,
        boxShadow: '0 0 60px rgba(0,0,0,1)',
        boxSizing: 'border-box',
        padding: 'clamp(12px, 4vw, 40px)',
      }}
      className="glass-panel rounded-sm"
    >
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
           <div className="w-2 h-2 rotate-45" style={{ backgroundColor: color }} />
           <span className="text-white/60 font-display uppercase tracking-[0.4em] text-[10px]">Secure Connection sequence</span>
        </div>
        <button onClick={onClose} className="text-[10px] text-white/40 hover:text-white uppercase font-display tracking-widest transition-colors">[ ABORT ]</button>
      </div>

      {status === 'playing' ? (
        <div className="flex flex-col gap-6">
          <div className="text-center space-y-2 mb-4">
             <h3 className="text-2xl font-serif text-white uppercase tracking-widest">System Firewall Active</h3>
             <p className="text-[11px] text-white/40 font-display tracking-widest uppercase">Survive the corruption to gain access.</p>
          </div>
          {/* Game Canvas */}
          <MiniGame characterId={characterId} color={color} onEnd={(won) => setStatus(won ? 'won' : 'lost')} />
        </div>
      ) : (
        <PostGameScreen status={status} color={color} onRestart={() => setStatus('playing')} onClose={onClose} />
      )}

    </motion.div>
  );
}

function MiniGame({ characterId, color, onEnd }: { characterId: string, color: string, onEnd: (won: boolean) => void }) {
  const dinoRef = useRef<HTMLDivElement>(null);
  const obsRef = useRef<HTMLDivElement>(null);
  const reqRef = useRef<number | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Game Images Selection
  const playerImageSrc = useMemo(() => {
    if (characterId === 'creator') return floatGif;
    if (characterId === 'strategist') return runGif;
    if (characterId === 'executive') return chairGif;
    return runGif; // w Fallback too~
  }, [characterId]);

  const obstacleImages = useMemo(() => [obj1, obj2, obj3], []);

  const state = useRef({
    y: 0,
    vy: 0,
    obsX: 800,
    obsY: 0,
    obsImage: obj1,
    speed: 8,
    startTime: Date.now(),
    isGameOver: false,
  });

  const jump = () => {
    if (state.current.y === 0) {
      state.current.vy = 17; // jump power
    }
  };

  useEffect(() => {
    state.current.startTime = Date.now();

    const loop = () => {
      if (state.current.isGameOver) return;

      // Physics (Gravity adjusted for bigger jump: AI slop but really cool lmao)
      state.current.y += state.current.vy;
      state.current.vy -= 1.2; 
      if (state.current.y < 0) {
        state.current.y = 0;
        state.current.vy = 0;
      }

      state.current.obsX -= state.current.speed;
      if (state.current.obsX < -80) { // Buffer to let it fully clear screen
        state.current.obsX = window.innerWidth > 600 ? 600 : window.innerWidth;
        state.current.speed += 0.2; // Progressively faster

        // Randomize obstacle
        const randIndex = Math.floor(Math.random() * obstacleImages.length);
        const selectedImg = obstacleImages[randIndex];
        state.current.obsImage = selectedImg;

        // Apply air obstacle logic - obj3
        if (selectedImg === obj3) {
            // Because player is taller (96px), "run under" needs to be at least 110px high
            state.current.obsY = Math.random() > 0.5 ? 20 : 110;
        } else {
            state.current.obsY = 0; // Grounded
        }
      }

      // Detect Collision ( and Forgiving hitboxes )
      const playerX = 50 + 15; // Visual padding
      const playerW = 60; // width
      const playerH = 70; // height
      
      const obsW = 40; 
      const obsH = 40; 

      const hitX = state.current.obsX < playerX + playerW && state.current.obsX + obsW > playerX;
      const hitY = state.current.y < state.current.obsY + obsH && state.current.y + playerH > state.current.obsY;
      
      if (hitX && hitY) {
        state.current.isGameOver = true;
        onEnd(false); // hit
        return;
      }

      // Detect Win (30 Seconds)
      const elapsed = Date.now() - state.current.startTime;
      if (elapsed >= 30000) {
        state.current.isGameOver = true;
        onEnd(true); // survived
        return;
      }

      // smooth like butter 
      if (dinoRef.current) dinoRef.current.style.bottom = `${state.current.y}px`;
      if (obsRef.current) {
         obsRef.current.style.left = `${state.current.obsX}px`;
         obsRef.current.style.bottom = `${state.current.obsY}px`;
    
     if (obsRef.current.firstElementChild) {
        (obsRef.current.firstElementChild as HTMLImageElement).src = state.current.obsImage;
         }
      }

      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);
      
    // SPACEBAR blocking
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault(); // CRITICAL: This stops the page from jumping down!
        jump();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    // Touch anywhere on the page jumps — not just the game div
    const handleTouch = (e: TouchEvent) => { e.preventDefault(); jump(); };
    window.addEventListener('touchstart', handleTouch, { passive: false });

    // Pause the loop when tab/app is hidden to save battery
    const handleVisibility = () => {
      if (document.hidden) {
        if (reqRef.current) cancelAnimationFrame(reqRef.current);
      } else if (!state.current.isGameOver) {
        reqRef.current = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(timer);
    };
  }, [onEnd, obstacleImages]);

  return (
    <div 
      className="relative w-full h-[180px] sm:h-[220px] md:h-[250px] bg-black/40 border border-white/10 rounded-sm overflow-hidden cursor-pointer shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] group"
      onClick={jump}
    >

      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 text-white font-display text-xs sm:text-sm tracking-[0.3em] flex items-center gap-3">
         <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
         00:{timeLeft.toString().padStart(2, '0')}
      </div>
      <div className="absolute top-3 sm:top-6 right-3 sm:right-6 text-white/20 font-display text-[8px] sm:text-[10px] tracking-widest uppercase group-hover:text-white/50 transition-colors hidden xs:block">
        TAP OR SPACE TO JUMP
      </div>
      
      {/* Ground Line */}
      <div className="absolute bottom-0 w-full h-[1px] bg-white/20" />
      <div className="absolute bottom-0 w-full h-[30px] bg-gradient-to-t from-white/5 to-transparent" />
      
      {/* Player Sprite size */}
      <div 
        ref={dinoRef}
        className="absolute left-[50px] bottom-0 w-24 h-24 flex items-center justify-center pointer-events-none z-20"
      >
         <img 
  src={playerImageSrc} 
  alt="Player Sprite" 
  className="w-full h-full object-contain"
  style={{ 
    filter: 'brightness(1) drop-shadow(0 0 18px rgba(9, 2, 17, 0.9)) drop-shadow(00 0 35px rgba(66, 66, 66, 0.7))'
  }}
/>
      </div>

      {/* Obstacle size */}
      <div 
        ref={obsRef}
        className="absolute left-[800px] bottom-0 w-16 h-16 flex items-center justify-center pointer-events-none z-10"
      >
         <img 
            src={obj1}
            alt="Obstacle Sprite" 
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" 
         />
      </div>
    </div>
  );
}

// PostGameCanvas
function PostGameCanvas({ color }: { color: string }) {
  const isMobile = useMemo(() => /iPad|iPhone|iPod|Android/i.test(navigator.userAgent), []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let lastWidth = 0;
    let stableFrames = 0;

    const check = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0 && w === lastWidth) {
        stableFrames++;
        if (stableFrames >= 2) {
          setCanvasReady(true);
          return; // done — stop observing
        }
      } else {
        stableFrames = 0;
        lastWidth = w;
      }
      rafId = requestAnimationFrame(check);
    };

    let rafId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-[220px] sm:h-[300px] relative rounded-sm overflow-hidden"
    >
      {canvasReady && (
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          performance={{ min: 0.3 }}
          frameloop="demand"
          style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: 'low-power' }}
          onCreated={({ gl }) => { return () => gl.dispose(); }}
        >
          <Suspense fallback={null}>
            <PostGameScene color={color} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

function PostGameScreen({ status, color, onRestart, onClose }: any) {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 w-full mx-auto animate-in fade-in zoom-in duration-500">
      
      <div className="text-center space-y-2 z-10 relative">
         <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-white uppercase tracking-widest">
             {status === 'won' ? 'Access Granted.' : 'Simulation Failed.'}
         </h3>
         <p className="text-[9px] md:text-[10px] text-white/40 font-display tracking-[0.3em] uppercase px-2">
             {status === 'won' ? 'Data access granted. Awaiting further communication. Contact Subject for assignment.' : 'Firewall breached. Re-initialization required. Contact Subject for details.'}
         </p>
      </div>
      
      <PostGameCanvas color={color} />

      {/* CONTACT LINKS (say hi~) */}
      <div className="w-full flex items-center gap-4 mb-[-8px] opacity-60">
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
    <span className="text-[15px] text-white/50 font-display tracking-[0.5em] uppercase whitespace-nowrap">
        Subject: Prakriti
    </span>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
</div>
      <div className="flex flex-row w-full gap-3 md:gap-4 relative z-10">
          
          <a href="mailto:praina.law@gmail.com" className="flex-1 glass-panel p-4 md:p-5 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors border border-white/5 group">
              <span className="text-white/30 text-[7px] md:text-[8px] tracking-[0.4em] font-display uppercase group-hover:text-white/50 text-center">Direct Line</span>
              <span className="text-white/80 text-[10px] md:text-xs tracking-widest font-display uppercase text-center">EMAIL</span>
          </a>
          
          <a href="https://www.linkedin.com/in/prakritir12/" target="_blank" rel="noopener noreferrer" className="flex-1 glass-panel p-4 md:p-5 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors border border-white/5 group">
              <span className="text-white/30 text-[7px] md:text-[8px] tracking-[0.4em] font-display uppercase group-hover:text-white/50 text-center">Network</span>
              <span className="text-white/80 text-[10px] md:text-xs tracking-widest font-display uppercase text-center">LINKEDIN</span>
          </a>
          
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full mt-2 relative z-10">
          <button onClick={onRestart} className="rpg-button flex-1 text-center py-4 bg-white/5 hover:bg-white/10 text-[10px] md:text-xs" style={{ borderColor: color, color: color }}>
              PLAY AGAIN
          </button>
          <button onClick={onClose} className="rpg-button flex-1 text-center py-4 border-white/20 hover:border-white/50 text-[10px] md:text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
              RETURN TO ARCHIVE
          </button>
      </div>
      
    </div>
  );
}
//never again