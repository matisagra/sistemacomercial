import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({
    className,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}