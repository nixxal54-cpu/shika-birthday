import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// 3D Crystal Heart Component
function CrystalHeart({ intensity = 1 }) {
  const meshRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 0.3,
        y: (e.clientY / window.innerHeight - 0.5) * 0.3
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = mousePos.y;
      meshRef.current.rotation.z = mousePos.x;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#f8b6c8"
        metalness={0.2}
        roughness={0.1}
        transparent
        opacity={0.6}
        transmission={0.9}
        thickness={0.5}
        emissive="#f8b6c8"
        emissiveIntensity={intensity * 0.3}
      />
    </mesh>
  );
}

// Particle Field Component
function ParticleField({ count = 50 }) {
  const particlesRef = useRef();
  
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#f8b6c8" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// Main App Component
export default function BirthdayShika() {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing Birthday Experience...');
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [sIndex, setSIndex] = useState(0);
  const [revealShika, setRevealShika] = useState(false);
  const [showFinalQuestion, setShowFinalQuestion] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noButtonText, setNoButtonText] = useState('No');
  const [noClickCount, setNoClickCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [heartIntensity, setHeartIntensity] = useState(1);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const containerRef = useRef();

  const sWords = ['Sky', 'Sea', 'Stars', 'Sunset', 'SHIKA'];
  const loadingMessages = [
    'Loading memories...',
    'Loading chaos...',
    'Loading Shika...'
  ];

  const vibeCards = [
    '🌙 Midnight music',
    '🎭 Random chaos',
    '💜 Purple skies',
    '😈 Dangerous humor',
    '✨ Good vibes',
    '🤔 Overthinking'
  ];

  const memories = [
    { id: 1, caption: 'Still one of the funniest moments 😭' },
    { id: 2, caption: 'This day was pure chaos 💜' },
    { id: 3, caption: 'Random but unforgettable ✨' },
    { id: 4, caption: 'When everything just clicked 🌙' }
  ];

  // Loading sequence
  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < loadingMessages.length) {
        setLoadingText(loadingMessages[messageIndex]);
        messageIndex++;
      }
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setTimeout(() => {
            setLoadingText('ACCESS GRANTED ✨');
            setTimeout(() => setLoading(false), 800);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // S-word sequence
  useEffect(() => {
    if (currentSection === 2 && sIndex < sWords.length) {
      const timer = setTimeout(() => {
        if (sIndex === sWords.length - 1) {
          setRevealShika(true);
        }
        setSIndex(sIndex + 1);
      }, sIndex === sWords.length - 1 ? 1500 : 2000);
      return () => clearTimeout(timer);
    }
  }, [currentSection, sIndex]);

  const handleScroll = () => {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    
    if (scrollPos < windowHeight * 0.5) setCurrentSection(0);
    else if (scrollPos < windowHeight * 1.5) setCurrentSection(1);
    else if (scrollPos < windowHeight * 5) setCurrentSection(2);
    else if (scrollPos < windowHeight * 6) setCurrentSection(3);
    else if (scrollPos < windowHeight * 7) setCurrentSection(4);
    else if (scrollPos < windowHeight * 8) setCurrentSection(5);
    else setCurrentSection(6);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNoClick = () => {
    const texts = ['Really?', 'Think again 🙂', 'Wrong button', 'System rejected response', 'Okay okay 😭'];
    
    if (noClickCount < 4) {
      setNoButtonText(texts[noClickCount]);
      setNoButtonPos({
        x: Math.random() * 200 - 100,
        y: Math.random() * 100 - 50
      });
      setNoClickCount(noClickCount + 1);
    } else {
      setNoButtonText('You can click now');
      setNoButtonPos({ x: 0, y: 0 });
    }
  };

  const handleYesClick = () => {
    setAnswered(true);
    setHeartIntensity(3);
    setTimeout(() => {
      setShowFinalQuestion(true);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-[#4a1020] to-[#14050b] flex flex-col items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-pink-300 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.4
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center px-4">
          <h2 className="text-2xl md:text-3xl text-[#f8b6c8] font-light mb-8 animate-pulse">
            {loadingText}
          </h2>
          <div className="w-64 md:w-80 h-2 bg-[#4a1020] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#f8b6c8] to-[#fff7fb] rounded-full transition-all duration-300 shadow-lg shadow-pink-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-[#14050b] text-[#fff7fb] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a1020] via-[#2a0820] to-[#14050b]" />
        
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <CrystalHeart intensity={heartIntensity} />
            <ParticleField count={40} />
          </Canvas>
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#f8b6c8] to-[#fff7fb] bg-clip-text text-transparent animate-pulse">
            HAPPY BIRTHDAY SHIKA ✨
          </h1>
          <p className="text-sm md:text-base text-[#f8b6c8] opacity-80 max-w-md mx-auto mt-6">
            This website may or may not have consumed someone's sanity.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="text-[#f8b6c8] text-2xl">↓</div>
        </div>
      </section>

      {/* The S Experience */}
      <section className="relative min-h-[400vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="text-center px-4">
            {sIndex === 0 && (
              <h2 className="text-3xl md:text-5xl text-[#f8b6c8] font-light animate-fade-in">
                Some beautiful things begin with S...
              </h2>
            )}
            
            {sIndex > 0 && sIndex < sWords.length && (
              <div className="space-y-8">
                {sIndex < 5 && (
                  <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#f8b6c8] to-[#fff7fb] bg-clip-text text-transparent animate-scale-in">
                    {sWords[sIndex - 1]}
                  </h2>
                )}
                
                {sIndex === 5 && (
                  <div className="relative">
                    <h2 className="text-7xl md:text-9xl font-bold text-[#f8b6c8] animate-glow">
                      SHIKA ✨
                    </h2>
                    <div className="absolute inset-0 blur-3xl bg-[#f8b6c8] opacity-30 animate-pulse" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Things That Feel Like Shika */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#f8b6c8]">
            Things that feel like Shika
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vibeCards.map((vibe, i) => (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20 cursor-pointer"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f8b6c8]/0 to-[#f8b6c8]/0 group-hover:from-[#f8b6c8]/10 group-hover:to-transparent transition-all duration-300" />
                <p className="text-xl md:text-2xl text-center relative z-10">{vibe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memory Wall */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#f8b6c8]">
            Memories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {memories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => setSelectedMemory(memory)}
                className="group relative aspect-square bg-gradient-to-br from-[#f8b6c8]/20 to-transparent border-2 border-[#f8b6c8]/30 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-[#4a1020]/40 flex items-center justify-center">
                  <div className="text-6xl">📸</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-sm text-[#f8b6c8]">{memory.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chaos Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl text-[#f8b6c8] mb-4">Scanning personality...</h3>
            <div className="w-64 h-2 bg-[#4a1020] rounded-full mx-auto overflow-hidden">
              <div className="h-full w-full bg-[#f8b6c8] animate-pulse" />
            </div>
          </div>
          <div className="text-3xl md:text-5xl font-bold">
            <span className="text-[#f8b6c8]">✓</span> Certified chaos detected.
          </div>
        </div>
      </section>

      {/* Final Question */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl">
          {!answered ? (
            <>
              <h2 className="text-3xl md:text-5xl font-light text-[#f8b6c8] mb-4">
                One last question...
              </h2>
              <p className="text-4xl md:text-6xl font-bold mb-16 mt-12">
                Do you like me? 👀
              </p>
              
              <div className="flex gap-6 justify-center items-center flex-wrap">
                <button
                  onClick={handleYesClick}
                  className="px-12 py-4 bg-gradient-to-r from-[#f8b6c8] to-[#fff7fb] text-[#14050b] rounded-full text-xl font-bold hover:scale-110 transition-transform duration-300 hover:shadow-2xl hover:shadow-pink-500/50"
                >
                  Yes ✨
                </button>
                
                <button
                  onClick={handleNoClick}
                  className="px-12 py-4 bg-white/5 border-2 border-[#f8b6c8] text-[#f8b6c8] rounded-full text-xl font-bold hover:scale-105 transition-all duration-300"
                  style={{
                    transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {noButtonText}
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-5xl md:text-7xl font-bold text-[#f8b6c8] mb-8">
                Mission Successful ✨
              </h2>
              <p className="text-xl md:text-2xl opacity-80 mb-4">
                Plot twist:
              </p>
              <p className="text-2xl md:text-3xl text-[#f8b6c8]">
                I was hoping you'd press that 🙂
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Final Ending */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <CrystalHeart intensity={2} />
            <ParticleField count={60} />
          </Canvas>
        </div>
        
        <div className="relative z-10 text-center max-w-2xl">
          <h2 className="text-5xl md:text-7xl font-bold mb-12 bg-gradient-to-r from-[#f8b6c8] to-[#fff7fb] bg-clip-text text-transparent">
            Happy Birthday, Shika ✨
          </h2>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed">
            Hope this year gives you amazing memories, happiness, and lots of reasons to smile.
          </p>
        </div>
      </section>

      {/* Memory Modal */}
      {selectedMemory && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <div className="relative max-w-2xl w-full bg-gradient-to-br from-[#4a1020] to-[#14050b] rounded-2xl overflow-hidden border-2 border-[#f8b6c8]/30 p-8">
            <div className="aspect-square bg-gradient-to-br from-[#f8b6c8]/20 to-transparent rounded-xl flex items-center justify-center mb-6">
              <div className="text-8xl">📸</div>
            </div>
            <p className="text-xl text-[#f8b6c8] text-center">{selectedMemory.caption}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(248, 182, 200, 0.5); }
          50% { text-shadow: 0 0 40px rgba(248, 182, 200, 0.8), 0 0 60px rgba(248, 182, 200, 0.6); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-scale-in { animation: scale-in 0.8s ease-out; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}