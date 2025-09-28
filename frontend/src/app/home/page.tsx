"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/SideBar";
import Livros from "@/components/bibliotecario/Livros/Livros";
import Categorias from "@/components/bibliotecario/Categorias/Categorias";
import Leitores from "@/components/bibliotecario/Leitores/Leitores";
import Usuarios from "@/components/bibliotecario/Usuarios/Usuarios";

export default function HomeBibliotecario() {
    const [activeComponent, setActiveComponent] = useState("livros");

    const renderComponent = () => {
        switch (activeComponent) {
            case "livros":
                return <Livros />;
            case "categorias":
                return <Categorias />;
            case "emprestimos":
                return <div>Componente Empréstimos</div>;
            case "leitores":
                return <Leitores />;
            case "bibliotecarios":
                return <Usuarios />
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <Sidebar
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
            />
            <main className="flex-1 ml-64 overflow-auto p-6 bg-gray-100">
                {renderComponent()}
            </main>
        </div>
    );
}
