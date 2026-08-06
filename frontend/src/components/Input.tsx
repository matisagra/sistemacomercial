import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref} // 👈 Aquí inyectamos el ref
                className={cn(
                    "w-full h-11 rounded-lg border border-zinc-700 bg-zinc-800 px-4 text-white outline-none transition focus:border-zinc-300 placeholder:text-zinc-500",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";