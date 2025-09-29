"use client";

import { useEffect, useState } from "react";
import { Leitor } from "@/models/leitor";
import { getLeitores, createLeitor, updateLeitor, deleteLeitor } from "@/services/leitorService";
import FormLeitor from "./FormLeitor";
import { toast } from "sonner";
import ConfirmModal from "../../ConfirmModal";
import IMask from "imask";

export default function LeitoresPage() {
  const [leitores, setLeitores] = useState<Leitor[]>([]);
  const [selectedLeitor, setSelectedLeitor] = useState<Leitor | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [leitorToDelete, setLeitorToDelete] = useState<Leitor | null>(null);

  // Filtros
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCPF, setFiltroCPF] = useState("");

  const loadLeitores = async () => {
    try {
      const data = await getLeitores();
      setLeitores(data);
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar leitores");
    }
  };

  useEffect(() => {
    loadLeitores();
  }, []);

  const handleSaveLeitor = async (data: any, id?: number) => {
    try {
      if (id) {
        await updateLeitor(id, data);
        toast.success("Leitor atualizado com sucesso!");
      } else {
        await createLeitor(data);
        toast.success("Leitor criado com sucesso!");
      }
      setIsFormModalOpen(false);
      setSelectedLeitor(null);
      loadLeitores();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar leitor");
    }
  };

  const handleDeleteLeitor = async () => {
    if (!leitorToDelete) return;
    try {
      await deleteLeitor(leitorToDelete.id);
      toast.success("Leitor deletado com sucesso!");
      setIsConfirmModalOpen(false);
      setLeitorToDelete(null);
      loadLeitores();
    } catch (err: any) {
      toast.error(err.message || "Erro ao deletar leitor");
    }
  };

  const leitoresFiltrados = leitores.filter((l) => {
    const nomeMatch = l.nome_completo.toLowerCase().includes(filtroNome.toLowerCase());
    const cpfMatch = l.cpf.includes(filtroCPF);
    return nomeMatch && cpfMatch;
  });

  const resetarFiltros = () => {
    setFiltroNome("");
    setFiltroCPF("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leitores</h1>
      
      {/* Filtros */}
      <div className="flex gap-4 mb-4">
        <div>
          <input
            type="text"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            className="border p-1 rounded"
            placeholder="Buscar por Nome"
          />
        </div>

        <div>
          <input
            ref={(el) => {
              if (el) {
                IMask(el, { mask: "000.000.000-00" });
              }
            }}
            value={filtroCPF}
            onChange={(e) => setFiltroCPF(e.target.value)}
            className="border p-1 rounded"
            placeholder="Buscar por CPF"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Adicionar Leitor
        </button>
        <button
          onClick={resetarFiltros}
          className="mb-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-700"
        >
          Resetar filtros
        </button>
      </div>

      <table className="w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300">Nome</th>
            <th className="p-2 border border-gray-300">CPF</th>
            <th className="p-2 border border-gray-300">E-mail</th>
            <th className="p-2 border border-gray-300">Telefone</th>
            <th className="p-2 border border-gray-300">Endereço</th>
            <th className="p-2 border border-gray-300">Ações</th>
          </tr>
        </thead>
        <tbody>
          {leitoresFiltrados.map((l) => (
            <tr key={l.id} className="border-b border-gray-300 text-center">
              <td className="p-2 border border-gray-300">{l.nome_completo}</td>
              <td className="p-2 border border-gray-300">{l.cpf}</td>
              <td className="p-2 border border-gray-300">{l.email}</td>
              <td className="p-2 border border-gray-300">{l.telefone}</td>
              <td className="p-2 border border-gray-300">
                {`${l.endereco.rua}, ${l.endereco.numero} - ${l.endereco.cidade}/${l.endereco.estado} - CEP: ${l.endereco.cep}`}
              </td>
              <td className="p-2 border border-gray-300 flex justify-around">
                <button
                  onClick={() => { setSelectedLeitor(l); setIsFormModalOpen(true); }}
                  className="px-2 py-1 bg-yellow-400 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => { setLeitorToDelete(l); setIsConfirmModalOpen(true); }}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormModalOpen && (
        <FormLeitor
          leitor={selectedLeitor}
          onClose={() => { setIsFormModalOpen(false); setSelectedLeitor(null); }}
          onSave={handleSaveLeitor}
        />
      )}

      {isConfirmModalOpen && leitorToDelete && (
        <ConfirmModal
          message={`Deseja realmente deletar o leitor "${leitorToDelete.nome_completo}"?`}
          onConfirm={handleDeleteLeitor}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
}
