import { memo } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface KeyProps {
    label: string;
    isPressed: boolean;
    isTarget: boolean;
    width?: number;
    isSpecial?: boolean;
}

export const Key = memo(({ label, isPressed, isTarget, width = 1, isSpecial = false }: KeyProps) => {
    return (
        <motion.div
            animate={{
                scale: isPressed ? 0.9 : 1,
                backgroundColor: isTarget
                    ? '#d94e28'
                    : isPressed
                        ? '#9dfc03'
                        : 'rgba(255, 255, 255, 0.03)',
                color: isTarget ? '#ffffff' : isPressed ? '#000000' : 'rgba(255, 255, 255, 0.4)',
                borderColor: isTarget ? '#ffffff' : isPressed ? '#9dfc03' : 'rgba(255, 255, 255, 0.05)',
                skewX: isTarget ? -12 : -12,
            }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className={clsx(
                "h-10 sm:h-12 md:h-14 flex items-center justify-center rounded-none border m-[2px] select-none",
                "font-display font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-tighter shadow-[2px_2px_0px_rgba(0,0,0,0.5)]",
                isSpecial ? "opacity-20" : "opacity-100",
            )}
            style={{ flex: width }}
        >
            <span className="skew-x-[12deg]">{label}</span>
        </motion.div>
    );
});
