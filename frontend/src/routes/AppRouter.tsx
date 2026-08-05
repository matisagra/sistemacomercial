import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { Login } from "@/features/Login";
import { Dashboard } from "@/features/Dashboard";
import { AppLayout } from "@/components/layout/AppLayout";
import { Productos } from "@/features/Productos";
import { ProductoForm } from "@/features/ProductoForm";

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

            </Routes>

        </BrowserRouter>
    );
}