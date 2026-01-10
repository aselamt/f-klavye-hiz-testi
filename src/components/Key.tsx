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
                scale: isPressed ? 0.92 : 1,
                backgroundColor: isTarget
                    ? 'rgba(227, 10, 23, 0.2)'
                    : isPressed
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                borderColor: isTarget
                    ? '#E30A17'
                    : isPressed
                        ? 'rgba(255, 255, 255, 0.4)'
                        : 'rgba(255, 255, 255, 0.1)'
            }}
            transition={{ duration: 0.05, ease: "easeOut" }}
            className={clsx(
                "h-9 sm:h-10 md:h-12 flex items-center justify-center rounded lg:rounded-lg border m-[1px] sm:m-0.5 select-none",
                "text-white font-medium text-[10px] sm:text-xs md:text-sm backdrop-blur-md shadow-lg",
                isSpecial ? "opacity-60" : "",
            )}
            style={{ flex: width }}
        >
            {label}
        </motion.div>
    );
});
