"use client";

import { FaBook, FaTags, FaUser, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeComponent: string;
  setActiveComponent: (comp: string) => void;
  role: string;
}

export default function Sidebar({ activeComponent, setActiveComponent, role }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  // Função para aplicar a classe de ativo
  const buttonClass = (comp: string) =>
    `flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
      activeComponent === comp ? "bg-gray-700 font-bold" : ""
    }`;

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white fixed flex flex-col p-4 gap-4">
      <h1 className="text-center text-xl font-bold">Bibliotecário</h1>
      <hr className="mb-4" />

      <button className={buttonClass("livros")} onClick={() => setActiveComponent("livros")}>
        <FaBook /> Livros
      </button>

      <button className={buttonClass("categorias")} onClick={() => setActiveComponent("categorias")}>
        <FaTags /> Categorias de livros
      </button>

      <button className={buttonClass("emprestimos")} onClick={() => setActiveComponent("emprestimos")}>
        <FaClipboardList /> Empréstimos
      </button>

      <button className={buttonClass("leitores")} onClick={() => setActiveComponent("leitores")}>
        <FaUser /> Leitores
      </button>

      <button className={buttonClass("bibliotecarios")} onClick={() => setActiveComponent("bibliotecarios")}>
        <FaUser /> Usuários do Sistema
      </button>

      <button
        className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded mt-auto"
        onClick={handleLogout}
      >
        <FaSignOutAlt /> Sair
      </button>
    </aside>
  );
}
