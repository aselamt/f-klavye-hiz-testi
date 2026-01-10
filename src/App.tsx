import { useState, useEffect, useCallback, useRef } from 'react';
import { generateWords, calculateWPM, calculateAccuracy } from './utils/engine';
import { TypingArea } from './components/TypingArea';
import { Keyboard } from './components/Keyboard';
import { RefreshCw, Trophy, Clock, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [text, setText] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [gameState, setGameState] = useState<'waiting' | 'running' | 'finished'>('waiting');

  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Game
  const resetGame = useCallback(() => {
    setText(generateWords(50).join(" "));
    setUserInput("");
    setGameState('waiting');
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Real-time stats calculation
  useEffect(() => {
    if (gameState === 'running' && startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000;
      const correctChars = userInput.split('').filter((c, i) => c === text[i]).length;

      setWpm(calculateWPM(correctChars, timeElapsed));
      setAccuracy(calculateAccuracy(correctChars, userInput.length));
    }
  }, [userInput, gameState, startTime, text]);

  // Handle Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === 'finished') return;

    const value = e.target.value;

    if (gameState === 'waiting') {
      setGameState('running');
      setStartTime(Date.now());
    }

    setUserInput(value);

    // End game if text completed
    if (value.length >= text.length) {
      setGameState('finished');
    }
  };

  // Keyboard visuals listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent tab from navigating away and use it to reset
      if (e.code === 'Tab') {
        e.preventDefault();
        resetGame();
        return;
      }

      setPressedKeys((prev) => new Set(prev).add(e.code));
      if (inputRef.current) inputRef.current.focus();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame]);

  // Calculate stats for finished screen
  const finalWpm = startTime ? calculateWPM(
    userInput.split('').filter((c, i) => c === text[i]).length,
    (60 - timeLeft)
  ) : 0;

  const finalAcc = calculateAccuracy(
    userInput.split('').filter((c, i) => c === text[i]).length,
    userInput.length
  );

  return (
    <div className="min-h-screen bg-slate-black flex flex-col items-center py-10 px-4 text-white font-mono selection:bg-rust-primary selection:text-white"
      onClick={() => inputRef.current?.focus()}>
      
      <div className="crt-scanner" />

      {/* Header */}
      <header className="w-full max-w-5xl border-b border-white/5 pb-8 mb-16 flex justify-between items-end relative">
        <div className="absolute top-0 right-0 text-[10px] text-rust-primary/40 font-bold flex gap-4">
           <span>SEC_AUTENTICATED: TRUE</span>
           <span>MEM_STABLE: 94%</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-rust-primary flex items-center justify-center font-display text-4xl text-white font-black skew-x-[-12deg] shadow-[4px_4px_0_0_#8c2f16]">
            F
          </div>
          <div>
            <h1 className="text-3xl font-display font-black tracking-tighter uppercase text-rust-primary italic">
              STRUCT<span className="text-white text-opacity-90">_TYPE_v4</span>
            </h1>
            <div className="text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase mt-1">
              // INDUSTRIAL_TYPING_PROTOCOL_0493
            </div>
          </div>
        </div>
        
        <div className="flex gap-10 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-white/20 text-[9px] uppercase tracking-widest mb-1">Time::Clock</span>
            <span className="flex items-center gap-2 text-xl font-bold tabular-nums"><Clock size={14} className="text-rust-primary" /> {timeLeft}s</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/20 text-[9px] uppercase tracking-widest mb-1">Output::WPM</span>
            <span className="flex items-center gap-2 text-xl font-bold text-rust-primary tabular-nums"><Zap size={14} /> {wpm}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/20 text-[9px] uppercase tracking-widest mb-1">Accuracy::Signal</span>
            <span className="flex items-center gap-2 text-xl font-bold text-acid-green tabular-nums"><Target size={14} /> {accuracy}%</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col items-center gap-16 relative">
        {/* Decorative structural lines */}
        <div className="absolute -left-12 top-0 h-full w-px bg-white/5" />
        <div className="absolute -right-12 top-0 h-full w-px bg-white/5" />
        <div className="absolute -left-12 top-1/2 w-4 h-px bg-rust-primary/30" />
        <div className="absolute -right-12 top-1/2 w-4 h-px bg-rust-primary/30" />

        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 -top-[1000px]"
          value={userInput}
          onChange={handleInputChange}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        <div className="w-full relative group">
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-rust-primary opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-rust-primary opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
          
          <TypingArea
            currentText={text}
            userInput={userInput}
            className={gameState === 'finished' ? 'opacity-20 blur-md grayscale pointer-events-none transition-all duration-1000' : ''}
          />
        </div>

        <div className="w-full flex justify-center px-1">
          <Keyboard
            pressedKeys={pressedKeys}
            targetChar={gameState === 'finished' ? '' : text[userInput.length] || ''}
          />
        </div>

        {/* Control Panel */}
        <div className="w-full flex justify-between items-center border-t border-white/5 pt-10 mt-4">
          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-3">
               <div className="h-1.5 w-1.5 bg-acid-green shadow-[0_0_8px_#9dfc03]" />
               <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Buffer_Active // Stream_Stable</span>
             </div>
             <div className="text-[10px] text-white/20 uppercase tracking-widest ml-4">
               CORE_TEMP: 42°C | NODE_STABILITY: NOMINAL
             </div>
          </div>
          
          <button
            onClick={resetGame}
            className="flex items-center gap-4 px-10 py-5 bg-rust-primary text-white hover:bg-white hover:text-black transition-all duration-300 font-display font-black uppercase tracking-tighter skew-x-[-12deg] relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500 skew-x-[12deg]" />
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700 relative z-10" />
            <span className="relative z-10 italic">Hard_Reset (TAB)</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 w-full max-w-5xl border-t border-white/5 flex justify-between items-center text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">
        <div className="flex gap-8">
          <span>// LOC: OSLO_SEC_4</span>
          <span>// PROTO: RAW_UTIL</span>
        </div>
        <div className="hazard-stripes h-1.5 w-48 opacity-10" />
        <span>SYS_CORE_V8.2.1 //</span>
      </footer>

      {/* Result Modal */}
      <AnimatePresence>
        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-black/95 backdrop-blur-xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="raw-border p-1 w-full max-w-2xl shadow-[0_0_80px_rgba(217,78,40,0.1)]"
            >
              <div className="border border-white/5 p-12 flex flex-col items-center gap-10 relative overflow-hidden">
                <div className="hazard-stripes absolute top-0 left-0 w-full h-1" />
                <div className="hazard-stripes absolute bottom-0 left-0 w-full h-1" />
                
                <div className="text-center">
                  <h2 className="text-6xl font-display font-black mb-4 uppercase italic text-rust-primary tracking-tighter skew-x-[-6deg]">
                    REPORT_LOG
                  </h2>
                  <p className="text-acid-green/60 text-[10px] font-bold tracking-[0.3em] uppercase underline decoration-acid-green/20 underline-offset-8">
                    ANALYTICS_SEQUENCE_COMPLETE
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white/[0.02] p-10 border border-white/5 flex flex-col items-center justify-center group hover:bg-rust-primary/5 transition-colors">
                    <div className="text-7xl font-display font-black text-rust-primary italic tracking-tighter skew-x-[-6deg] group-hover:scale-110 transition-transform">{finalWpm}</div>
                    <div className="text-[10px] uppercase tracking-[0.5em] text-white/30 mt-6 font-bold">WPM_RAW_AVG</div>
                  </div>
                  <div className="bg-white/[0.02] p-10 border border-white/5 flex flex-col items-center justify-center group hover:bg-acid-green/5 transition-colors">
                    <div className="text-7xl font-display font-black text-acid-green italic tracking-tighter skew-x-[-6deg] group-hover:scale-110 transition-transform">{finalAcc}%</div>
                    <div className="text-[10px] uppercase tracking-[0.5em] text-white/30 mt-6 font-bold">ACC_SIGNAL_RATIO</div>
                  </div>
                </div>

                <div className="w-full flex justify-between text-[10px] text-white/20 font-bold uppercase tracking-widest px-2">
                   <span>ID: #{Math.floor(Math.random() * 900000 + 100000)}</span>
                   <span>TIMESTAMP: {new Date().toISOString().slice(0, 19).replace('T', ' ')}</span>
                </div>

                <button
                  onClick={resetGame}
                  className="group w-full py-8 bg-rust-primary text-white hover:bg-white hover:text-black font-display font-black text-2xl transition-all duration-300 uppercase tracking-tighter flex items-center justify-center gap-6 skew-x-[-12deg]"
                >
                  <RefreshCw size={28} className="group-hover:rotate-180 transition-transform duration-700" />
                  <span className="italic">INITIALIZE_REBOOT</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
}

export default App;
