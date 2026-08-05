import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "w-full h-11 rounded-lg bg-zinc-100 text-zinc-900 font-semibold transition-all duration-200 hover:bg-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}