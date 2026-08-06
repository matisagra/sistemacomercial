import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { Login } from "@/features/Login/Login";
import { Dashboard } from "@/features/Dashboard/Dashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import { Productos } from "@/features/Productos/Productos";
import { ProductoForm } from "@/features/Productos/ProductoForm";
import { ClienteForm } from "@/features/Clientes/ClienteForm";
import { Clientes } from "@/features/Clientes/Clientes";
import { ProveedorForm } from "@/features/Proveedores/ProveedorForm";
import { Proveedores } from "@/features/Proveedores/Proveedores";
import { Ventas } from "@/features/Ventas/Ventas";

interface Props {
    autenticado: boolean;
    setAutenticado: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppRouter({
    autenticado,
    setAutenticado,
}: Props) {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={
                        autenticado
                            ? <Navigate to="/" replace />
                            : <Login setAutenticado={setAutenticado} />
                    }
                />

                <Route
                    path="/"
                    element={
                        autenticado
                            ? <AppLayout />
                            : <Navigate to="/login" replace />
                    }
                >

                    <Route
                        index
                        element={<Dashboard />}
                    />

                </Route>

                <Route path="/productos" element={<Productos />} />

                <Route path="/productos/nuevo" element={<ProductoForm />} />

                <Route path="/productos/editar/:id" element={<ProductoForm />} />


                <Route path="/clientes" element={<Clientes />} />
                <Route path="/clientes/nuevo" element={<ClienteForm />} />
                <Route path="/clientes/editar/:id" element={<ClienteForm />} />

                <Route path="/proveedores" element={<Proveedores />} />
                <Route path="/proveedores/nuevo" element={<ProveedorForm />} />
                <Route path="/proveedores/editar/:id" element={<ProveedorForm />} />

                <Route path="/ventas" element={<Ventas />} />
                <Route path="/ventas/nueva" element={<Ventas />} />
                    
                
            
            </Routes>

        </BrowserRouter>
    );
}