import { TURKISH_WORDS } from '../data/words';

export function generateWords(count: number): string[] {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * TURKISH_WORDS.length);
        result.push(TURKISH_WORDS[randomIndex]);
    }
    return result;
}

export function calculateWPM(correctChars: number, timeSeconds: number): number {
    if (timeSeconds === 0) return 0;
    const words = correctChars / 5;
    const minutes = timeSeconds / 60;
    return Math.round(words / minutes);
}

export function calculateAccuracy(correct: number, total: number): number {
    if (total === 0) return 100;
    return Math.round((correct / total) * 100);
}
