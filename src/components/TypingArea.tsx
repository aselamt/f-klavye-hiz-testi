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
                "relative w-full max-w-4xl h-32 sm:h-40 md:h-48 overflow-hidden text-xl sm:text-2xl md:text-3xl font-mono leading-relaxed bg-black/10 rounded-xl p-4 sm:p-6 md:p-8 border border-white/5 shadow-inner",
                className
            )}
        >
            <div className="flex flex-wrap select-none transition-all gap-y-2">
                {currentText.split(' ').map((word, wIndex) => {
                    // Logic to maintain global index
                    const startIndex = currentText.split(' ').slice(0, wIndex).reduce((acc, w) => acc + w.length + 1, 0);

                    return (
                        <div key={wIndex} className="inline-block whitespace-nowrap">
                            {/* Chars of the word */}
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
                                            "inline-block relative transition-colors duration-100 min-w-[1ch] opacity-80",
                                            {
                                                'text-gray-500': !isTyped && !isActive,
                                                'text-white': isCorrect,
                                                'text-turkish-red underline decoration-2 underline-offset-4': isTyped && !isCorrect,
                                                'text-white bg-white/10 rounded-sm scale-110 font-bold z-10': isActive,
                                            }
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="caret"
                                                className="absolute -left-0.5 top-1 bottom-1 w-0.5 bg-turkish-red shadow-[0_0_8px_2px_rgba(227,10,23,0.5)]"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.1 }}
                                            />
                                        )}
                                        {char}
                                    </span>
                                );
                            })}

                            {/* Space after word (except last) */}
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
                                            "inline-block relative transition-colors duration-100 min-w-[1ch] opacity-80",
                                            {
                                                'text-gray-500': !isTyped && !isActive,
                                                'text-white': isCorrect,
                                                'text-turkish-red underline decoration-2 underline-offset-4': isTyped && !isCorrect,
                                                'text-white bg-white/10 rounded-sm scale-110 font-bold z-10': isActive,
                                            }
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="caret"
                                                className="absolute -left-0.5 top-1 bottom-1 w-0.5 bg-turkish-red shadow-[0_0_8px_2px_rgba(227,10,23,0.5)]"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.1 }}
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
