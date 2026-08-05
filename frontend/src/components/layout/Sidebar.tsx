import {
    LayoutDashboard,
    Package,
    Users,
    Truck,
    ShoppingCart,
    Receipt,
    Wallet,
    Shield,
    Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [

    {
        nombre: "Dashboard",
        icono: LayoutDashboard,
        ruta: "/",
    },

    {
        nombre: "Productos",
        icono: Package,
        ruta: "/productos",
    },

    {
        nombre: "Clientes",
        icono: Users,
        ruta: "/clientes",
    },

    {
        nombre: "Proveedores",
        icono: Truck,
        ruta: "/proveedores",
    },

    {
        nombre: "Compras",
        icono: ShoppingCart,
        ruta: "/compras",
    },

    {
        nombre: "Ventas",
        icono: Receipt,
        ruta: "/ventas",
    },

    {
        nombre: "Caja",
        icono: Wallet,
        ruta: "/caja",
    },

    {
        nombre: "Auditoría",
        icono: Shield,
        ruta: "/auditoria",
    },

    {
        nombre: "Configuración",
        icono: Settings,
        ruta: "/configuracion",
    },

];

export function Sidebar() {

    return (

        <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-900">

            <div className="border-b border-zinc-800 p-6">

                <h1 className="text-xl font-bold text-white">

                    Sistema Comercial

                </h1>

                <p className="mt-1 text-sm text-zinc-500">

                    Panel Administrativo

                </p>

            </div>

            <nav className="flex-1 space-y-1 p-4">

                {

                    menus.map((item) => {

                        const Icono = item.icono;

                        return (

                            <NavLink

                                key={item.nombre}

                                to={item.ruta}

                                className={({ isActive }) =>

                                    `flex items-center gap-3 rounded-lg px-4 py-3 transition-all

                                    ${

                                        isActive

                                            ? "bg-white text-black font-semibold"

                                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"

                                    }`

                                }

                            >

                                <Icono size={20} />

                                {item.nombre}

                            </NavLink>

                        );

                    })

                }

            </nav>

        </aside>

    );

}