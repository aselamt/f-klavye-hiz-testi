export interface KeyDefinition {
    code: string;
    label: string;
    isSpecial?: boolean; // For Backspace, Enter, etc.
    width?: number; // Relative width (1 = standard key)
}

export const TURKISH_F_LAYOUT: KeyDefinition[][] = [
    // Row 1 (Numbers)
    [
        { code: 'Backquote', label: '+' },
        { code: 'Digit1', label: '1' },
        { code: 'Digit2', label: '2' },
        { code: 'Digit3', label: '3' },
        { code: 'Digit4', label: '4' },
        { code: 'Digit5', label: '5' },
        { code: 'Digit6', label: '6' },
        { code: 'Digit7', label: '7' },
        { code: 'Digit8', label: '8' },
        { code: 'Digit9', label: '9' },
        { code: 'Digit0', label: '0' },
        { code: 'Minus', label: '/' },
        { code: 'Equal', label: '-' },
        { code: 'Backspace', label: '⌫', isSpecial: true, width: 2 },
    ],
    // Row 2
    [
        { code: 'Tab', label: 'Tab', isSpecial: true, width: 1.5 },
        { code: 'KeyQ', label: 'F' },
        { code: 'KeyW', label: 'G' },
        { code: 'KeyE', label: 'Ğ' },
        { code: 'KeyR', label: 'I' },
        { code: 'KeyT', label: 'O' },
        { code: 'KeyY', label: 'D' },
        { code: 'KeyU', label: 'R' },
        { code: 'KeyI', label: 'N' },
        { code: 'KeyO', label: 'H' },
        { code: 'KeyP', label: 'P' },
        { code: 'BracketLeft', label: 'Q' },
        { code: 'BracketRight', label: 'W' },
        { code: 'Backslash', label: 'X', width: 1.25 }, // ISO vs ANSI varies here, but usually above enter
    ],
    // Row 3 (Home Row)
    [
        { code: 'CapsLock', label: 'Cap', isSpecial: true, width: 1.75 },
        { code: 'KeyA', label: 'U' },
        { code: 'KeyS', label: 'İ' },
        { code: 'KeyD', label: 'E' },
        { code: 'KeyF', label: 'A' },
        { code: 'KeyG', label: 'Ü' },
        { code: 'KeyH', label: 'T' },
        { code: 'KeyJ', label: 'K' },
        { code: 'KeyK', label: 'M' },
        { code: 'KeyL', label: 'L' },
        { code: 'Semicolon', label: 'Y' },
        { code: 'Quote', label: 'Ş' },
        { code: 'Enter', label: 'Enter', isSpecial: true, width: 2.25 },
    ],
    // Row 4
    [
        { code: 'ShiftLeft', label: 'Shift', isSpecial: true, width: 2.25 },
        { code: 'IntlBackslash', label: '<' }, // The key next to Z on ISO
        { code: 'KeyZ', label: 'J' },
        { code: 'KeyX', label: 'Ö' },
        { code: 'KeyC', label: 'V' },
        { code: 'KeyV', label: 'C' },
        { code: 'KeyB', label: 'Ç' },
        { code: 'KeyN', label: 'Z' },
        { code: 'KeyM', label: 'S' },
        { code: 'Comma', label: 'B' },
        { code: 'Period', label: '.' },
        { code: 'Slash', label: ',' },
        { code: 'ShiftRight', label: 'Shift', isSpecial: true, width: 2.75 },
    ],
    // Space Row
    [
        { code: 'ControlLeft', label: 'Ctrl', isSpecial: true, width: 1.5 },
        { code: 'AltLeft', label: 'Alt', isSpecial: true, width: 1.5 },
        { code: 'Space', label: '', width: 7 }, // Spacebar
        { code: 'AltRight', label: 'Alt', isSpecial: true, width: 1.5 },
        { code: 'ControlRight', label: 'Ctrl', isSpecial: true, width: 1.5 },
    ]
];
