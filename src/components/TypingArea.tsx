import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface TypingAreaProps {
    currentText: string;
    userInput: string;
    className?: string;
}

export function TypingArea({ currentText, userInput, className }: TypingAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeCharRef = useRef<HTMLSpanElement>(null);

    // Auto-scroll to keep active char in view
    useEffect(() => {
        if (activeCharRef.current && containerRef.current) {
            const container = containerRef.current;
            const char = activeCharRef.current;

            const containerRect = container.getBoundingClientRect();
            const charRect = char.getBoundingClientRect();

            if (charRect.top > containerRect.bottom - 40 || charRect.top < containerRect.top + 40) {
                char.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [userInput.length]);

    return (
        <div
            ref={containerRef}
            className={clsx(
                "relative w-full max-w-4xl h-32 sm:h-40 md:h-64 overflow-hidden text-xl sm:text-2xl md:text-3xl font-mono leading-relaxed bg-black/40 p-10 md:p-14 border border-white/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]",
                className
            )}
        >
            <div className="absolute top-3 left-4 text-[9px] font-bold text-white/10 uppercase tracking-[0.3em] pointer-events-none flex items-center gap-4">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-rust-primary animate-flicker"></div> STREAM_001A</span>
                <span className="opacity-5 via-white/5">0xFF09_DATA_BLOCK</span>
            </div>

            <div className="absolute bottom-3 right-4 text-[9px] font-bold text-white/10 uppercase tracking-[0.3em] pointer-events-none">
                BLOCK_ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}
            </div>

            <div className="flex flex-wrap select-none transition-all gap-y-3">
                {currentText.split(' ').map((word, wIndex) => {
                    const startIndex = currentText.split(' ').slice(0, wIndex).reduce((acc, w) => acc + w.length + 1, 0);

                    return (
                        <div key={wIndex} className="inline-block whitespace-nowrap">
                            {word.split('').map((char, cIndex) => {
                                const index = startIndex + cIndex;
                                const isTyped = index < userInput.length;
                                const isCorrect = isTyped && userInput[index] === char;
                                const isActive = index === userInput.length;

                                return (
                                    <span
                                        key={index}
                                        ref={isActive ? activeCharRef : null}
                                        className={clsx(
                                            "inline-block relative transition-all duration-75 min-w-[1ch] px-[1px]",
                                            {
                                                'text-white/15': !isTyped && !isActive,
                                                'text-acid-green drop-shadow-[0_0_8px_rgba(157,252,3,0.3)] font-bold': isCorrect,
                                                'text-white bg-rust-primary/80 font-black italic': isTyped && !isCorrect,
                                                'text-white bg-rust-primary scale-110 font-black z-10 shadow-[2px_2px_0_0_#8c2f16]': isActive,
                                            }
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="caret"
                                                className="absolute -left-1 top-0 bottom-0 w-[4px] bg-white animate-flicker shadow-[0_0_15px_white]"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [1, 0.4, 1] }}
                                                transition={{ duration: 0.4, repeat: Infinity }}
                                            />
                                        )}
                                        {char}
                                    </span>
                                );
                            })}

                            {wIndex < currentText.split(' ').length - 1 && (() => {
                                const index = startIndex + word.length;
                                const isTyped = index < userInput.length;
                                const isCorrect = isTyped && userInput[index] === ' ';
                                const isActive = index === userInput.length;

                                return (
                                    <span
                                        key={index}
                                        ref={isActive ? activeCharRef : null}
                                        className={clsx(
                                            "inline-block relative transition-all duration-75 min-w-[1ch]",
                                            {
                                                'text-white/15': !isTyped && !isActive,
                                                'text-acid-green': isCorrect,
                                                'text-white bg-rust-primary/80 italic': isTyped && !isCorrect,
                                                'text-white bg-rust-primary scale-110 font-black z-10 shadow-[2px_2px_0_0_#8c2f16]': isActive,
                                            }
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="caret"
                                                className="absolute -left-1 top-0 bottom-0 w-[4px] bg-white animate-flicker shadow-[0_0_15px_white]"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [1, 0.4, 1] }}
                                                transition={{ duration: 0.4, repeat: Infinity }}
                                            />
                                        )}
                                        {'\u00A0'}
                                    </span>
                                )
                            })()}
                        </div>
                    );
                })}
            </div>
        </div>

    );
}
