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
    <div className="min-h-screen bg-deep-charcoal flex flex-col items-center py-10 px-4 text-white font-sans selection:bg-transparent"
      onClick={() => inputRef.current?.focus()}>

      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-turkish-red rounded-lg flex items-center justify-center font-bold text-2xl shadow-[0_0_15px_rgba(227,10,23,0.5)]">
            F
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TurboType<span className="text-white/40 font-light">.tr</span></h1>
        </div>
        <div className="flex gap-6 text-sm font-medium text-white/60">
          <span className="flex items-center gap-2"><Clock size={16} /> {timeLeft}s</span>
          <span className="flex items-center gap-2 text-white"><Zap size={16} className="text-yellow-400" /> {wpm} WPM</span>
          <span className="flex items-center gap-2 text-white"><Target size={16} className="text-green-400" /> {accuracy}%</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col items-center gap-12 relative">

        {/* Hidden Input */}
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

        {/* Typing Area */}
        <TypingArea
          currentText={text}
          userInput={userInput}
          className={gameState === 'finished' ? 'opacity-50 blur-sm pointer-events-none' : ''}
        />

        {/* Visual Keyboard */}
        <div className="w-full flex justify-center px-1">
          <Keyboard
            pressedKeys={pressedKeys}
            targetChar={gameState === 'finished' ? '' : text[userInput.length] || ''}
          />
        </div>

        {/* Restart Button */}
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm font-medium uppercase tracking-wider group"
        >
          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          Yeniden Başlat (Tab)
        </button>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-white/20 text-xs">
        F Klavye Düzeni • Profesyonel 10 Parmak Testi
      </footer>

      {/* Result Modal */}
      <AnimatePresence>
        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-10 max-w-md w-full shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-turkish-red to-orange-500" />

              <div className="flex flex-col items-center gap-6">
                <Trophy size={48} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />

                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">Test Tamamlandı</h2>
                  <p className="text-white/50">Harika iş çıkardın!</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                    <div className="text-3xl font-bold">{finalWpm}</div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mt-1">WPM</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                    <div className="text-3xl font-bold text-green-400">{finalAcc}%</div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Doğruluk</div>
                  </div>
                </div>

                <button
                  onClick={resetGame}
                  className="w-full py-4 bg-turkish-red hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(227,10,23,0.4)] hover:shadow-[0_0_30px_rgba(227,10,23,0.6)]"
                >
                  Yeni Test
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
