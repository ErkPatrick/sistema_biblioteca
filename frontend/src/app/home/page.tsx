"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/SideBar";
import EmprestimosPage from "@/components/bibliotecario/Emprestimos/Emprestimos";
import LivrosPage from "@/components/bibliotecario/Livros/Livros";
import CategoriasPage from "@/components/bibliotecario/Categorias/Categorias";
import LeitoresPage from "@/components/bibliotecario/Leitores/Leitores";
import UsuariosPage from "@/components/bibliotecario/Usuarios/Usuarios";

export default function HomeBibliotecario() {
    const [activeComponent, setActiveComponent] = useState("livros");

    const renderComponent = () => {
        switch (activeComponent) {
            case "livros":
                return <LivrosPage />;
            case "categorias":
                return <CategoriasPage />;
            case "emprestimos":
                return <EmprestimosPage/>
            case "leitores":
                return <LeitoresPage />;
            case "bibliotecarios":
                return <UsuariosPage />
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
