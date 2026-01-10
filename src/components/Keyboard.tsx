import { useMemo } from 'react';
import { TURKISH_F_LAYOUT } from '../data/layout';
import { Key } from './Key';

interface KeyboardProps {
    pressedKeys: Set<string>;
    targetChar: string;
}

// Create a static map for faster lookups
const charToCodeMap: Record<string, string> = {};
TURKISH_F_LAYOUT.forEach(row => {
    row.forEach(key => {
        if (key.label) charToCodeMap[key.label.toUpperCase()] = key.code;
    });
});
charToCodeMap[' '] = 'Space';

export function Keyboard({ pressedKeys, targetChar }: KeyboardProps) {
    const targetCode = useMemo(() => {
        if (!targetChar) return null;
        return charToCodeMap[targetChar.toUpperCase()] || null;
    }, [targetChar]);

    return (
        <div className="flex flex-col items-center gap-0 p-4 sm:p-10 bg-white/[0.02] border border-white/5 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] w-full max-w-[95vw] sm:max-w-none overflow-x-auto sm:overflow-visible relative">
            <div className="absolute -top-3 left-6 bg-rust-primary px-3 py-0.5 text-[9px] font-black text-white uppercase tracking-[0.2em] skew-x-[-12deg]">
                <span className="skew-x-[12deg] inline-block">INPUT_INTERFACE_01</span>
            </div>

            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-white/10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-white/10 pointer-events-none" />

            {TURKISH_F_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex w-full min-w-[300px] sm:min-w-0 justify-center">
                    {row.map((keyDef) => {
                        const isPressed = pressedKeys.has(keyDef.code);
                        const isTarget = targetCode === keyDef.code;

                        return (
                            <Key
                                key={keyDef.code}
                                label={keyDef.label}
                                isPressed={isPressed}
                                isTarget={isTarget}
                                width={keyDef.width}
                                isSpecial={keyDef.isSpecial}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
