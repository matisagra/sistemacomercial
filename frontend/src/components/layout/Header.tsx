import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Cloud, Moon, Clock, LogOut, UserCircle2 } from "lucide-react";
import { obtenerUsuario, cerrarSesion } from "@/utils/auth";

function useGreeting() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return { text: "Buenos días", Icon: Sun };
    if (hour >= 12 && hour < 19) return { text: "Buenas tardes", Icon: Cloud };
    return { text: "Buenas noches", Icon: Moon };
}

function useClock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);
    return now;
}

export function Header() {
    const { text: greeting, Icon: GreetingIcon } = useGreeting();
    const now = useClock();
    const navigate = useNavigate();
    const usuario = obtenerUsuario();

    const time = now.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const date = now.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    function handleLogout() {
        cerrarSesion();
        navigate("/login");
    }

    return (
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-8">
            <div className="flex items-center gap-2">
                <GreetingIcon className="h-5 w-5 text-amber-400" />
                <div>
                    <p className="text-sm font-medium leading-tight text-white">
                        {greeting}
                    </p>
                    <p className="text-xs capitalize leading-tight text-zinc-500">
                        {date}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono text-sm tabular-nums">{time}</span>
                </div>

                <div className="h-8 w-px bg-zinc-800" />

                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
                        <UserCircle2 className="h-5 w-5 text-zinc-300" />
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-tight text-white">
                            {usuario?.nombre || usuario?.usuario || "Usuario"}
                        </p>
                        <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium capitalize leading-tight text-emerald-400">
                            {usuario?.rol ?? "—"}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}
