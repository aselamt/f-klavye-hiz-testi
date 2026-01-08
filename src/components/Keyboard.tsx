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
        <div className="flex flex-col items-center gap-0.5 sm:gap-1 p-2 sm:p-4 md:p-6 bg-black/20 rounded-xl sm:rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl animate-fade-in-up w-full max-w-[95vw] sm:max-w-none overflow-x-auto sm:overflow-visible">
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
