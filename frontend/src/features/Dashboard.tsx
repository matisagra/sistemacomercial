import { motion, type Variants } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  PackageX,
  TrendingUp,
  Plus,
  Users,
  FileText,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProductos } from "../hooks/useProductos";
import { useVentas } from "../hooks/useVentas";

interface QuickAction {
  label: string;
  to: string;
  icon: typeof Plus;
}

const accesos: QuickAction[] = [
  { label: "Nueva venta", to: "/ventas/nueva", icon: ShoppingCart },
  { label: "Nuevo producto", to: "/productos/nuevo", icon: Plus },
  { label: "Clientes", to: "/clientes", icon: Users },
  { label: "Reportes", to: "/reportes", icon: FileText },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const formatCurrency = (n: number) =>
  n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

const esHoy = (fechaIso: string) => {
  const fecha = new Date(fechaIso);
  const hoy = new Date();
  return (
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()
  );
};

export function Dashboard() {
  const {
    data: productos,
    isLoading: loadingProductos,
    isError: errorProductos,
  } = useProductos();
  const {
    data: ventas,
    isLoading: loadingVentas,
    isError: errorVentas,
  } = useVentas();

  const isLoading = loadingProductos || loadingVentas;
  const isError = errorProductos || errorVentas;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-zinc-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando dashboard...
      </div>
    );
  }

  if (isError || !productos || !ventas) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
        No se pudo cargar la información del dashboard. Verificá que la API
        esté corriendo en http://localhost:5187.
      </div>
    );
  }

  const ventasHoy = ventas.filter((v) => esHoy(v.fechaHora));
  const totalHoy = ventasHoy.reduce((acc, v) => acc + v.subTotal, 0);
  const ticketPromedio = ventasHoy.length ? totalHoy / ventasHoy.length : 0;

  const productosStockBajo = productos
    .filter((p) => p.stockActual <= p.stockMinimo)
    .sort((a, b) => a.stockActual - b.stockActual);

  const ultimasVentas = [...ventas]
    .sort(
      (a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
    )
    .slice(0, 5);

  const stats = [
    { label: "Ventas de hoy", value: formatCurrency(totalHoy), icon: DollarSign },
    { label: "Tickets del día", value: String(ventasHoy.length), icon: ShoppingCart },
    { label: "Stock bajo", value: String(productosStockBajo.length), icon: PackageX },
    { label: "Ticket promedio", value: formatCurrency(ticketPromedio), icon: TrendingUp },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 text-white"
    >
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-zinc-400">Bienvenido al Sistema Comercial.</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            whileHover={{ y: -3 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
              <s.icon className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="mt-4 text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Últimas ventas */}
        <motion.div
          variants={item}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Últimas ventas</h2>
            <Link
              to="/ventas"
              className="text-xs text-zinc-500 transition-colors hover:text-emerald-400"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-1">
            {ultimasVentas.length === 0 && (
              <p className="py-6 text-center text-sm text-zinc-500">
                Todavía no hay ventas registradas.
              </p>
            )}
            {ultimasVentas.map((v) => (
              <div
                key={v.idVenta}
                className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-zinc-800/50"
              >
                <div>
                  <p className="text-sm font-medium">Cliente #{v.idCliente}</p>
                  <p className="text-xs text-zinc-500">
                    {v.numeroVenta} · {v.estado} ·{" "}
                    {new Date(v.fechaHora).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-400">
                  {formatCurrency(v.subTotal)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stock bajo */}
        <motion.div
          variants={item}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Stock bajo</h2>
            <Link
              to="/productos?filtro=stock-bajo"
              className="text-xs text-zinc-500 transition-colors hover:text-emerald-400"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {productosStockBajo.length === 0 && (
              <p className="py-6 text-center text-sm text-zinc-500">
                Todo el stock está en orden.
              </p>
            )}
            {productosStockBajo.slice(0, 5).map((p) => (
              <div key={p.idProducto} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{p.nombre}</p>
                  <p className="text-xs text-zinc-500">{p.codigo}</p>
                </div>
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                  {p.stockActual}/{p.stockMinimo}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Accesos rápidos */}
      <motion.div variants={item}>
        <h2 className="mb-4 font-semibold">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {accesos.map((a) => (
            <Link key={a.label} to={a.to}>
              <motion.div
                whileHover={{ y: -3, borderColor: "rgb(63 63 70)" }}
                className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 py-6 text-center transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                  <a.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-sm text-zinc-300">{a.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
