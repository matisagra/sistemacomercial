import { useState } from "react";
import { AppRouter } from "./routes/AppRouter";
import { estaAutenticado } from "./utils/auth";

export default function App() {
    const [autenticado, setAutenticado] = useState(
        estaAutenticado()
    );

    return (
        <AppRouter
            autenticado={autenticado}
            setAutenticado={setAutenticado}
        />
    );
}