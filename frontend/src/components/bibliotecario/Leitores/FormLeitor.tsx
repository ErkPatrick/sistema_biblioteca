"use client";

import { useState, useEffect } from "react";
import { Leitor } from "@/models/leitor";
import { buscarEndereco } from "@/utils/viaCep";
import { IMaskInput } from "react-imask";

interface FormLeitorProps {
    leitor: Leitor | null;
    onClose: () => void;
    onSave: (data: any, id?: number) => void;
}

export default function FormLeitor({ leitor, onClose, onSave }: FormLeitorProps) {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [cep, setCep] = useState("");

    useEffect(() => {
        if (leitor) {
            setNome(leitor.nome_completo);
            setCpf(leitor.cpf);
            setEmail(leitor.email || "");
            setTelefone(leitor.telefone || "");
            setRua(leitor.endereco?.rua || "");
            setNumero(leitor.endereco?.numero || "");
            setCidade(leitor.endereco?.cidade || "");
            setEstado(leitor.endereco?.estado || "");
            setCep(leitor.endereco?.cep || "");
        } else {
            setNome("");
            setCpf("");
            setEmail("");
            setTelefone("");
            setRua("");
            setNumero("");
            setCidade("");
            setEstado("");
            setCep("");
        }
    }, [leitor]);

    const handleCepChange = async (valor: string) => {
        setCep(valor);
        if (valor.replace(/\D/g, "").length === 8) {
            const endereco = await buscarEndereco(valor);
            if (endereco) {
                setRua(endereco.logradouro || "");
                setCidade(endereco.localidade || "");
                setEstado(endereco.uf || "");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            nome_completo: nome,
            cpf,
            email,
            telefone,
            endereco_attributes: { rua, numero, cidade, estado, cep },
        };
        onSave(data, leitor?.id);
    };

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-md w-11/12 max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">
                    {leitor ? "Editar Leitor" : "Adicionar Leitor"}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Nome completo</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="border p-3 rounded w-full"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">CPF</label>
                        <IMaskInput
                            mask="000.000.000-00"
                            value={cpf}
                            onAccept={(val: any) => setCpf(val)}
                            className="border p-3 rounded w-full"
                            placeholder="000.000.000-00"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-3 rounded w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Telefone</label>
                        <IMaskInput
                            mask="(00)00000-0000"
                            value={telefone}
                            onAccept={(val: any) => setTelefone(val)}
                            className="border p-3 rounded w-full"
                            placeholder="(00)00000-0000"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">CEP</label>
                        <IMaskInput
                            mask="00000-000"
                            value={cep}
                            onAccept={(val: any) => handleCepChange(val)}
                            className="border p-3 rounded w-full"
                            placeholder="00000-000"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Rua</label>
                        <input
                            type="text"
                            value={rua}
                            onChange={(e) => setRua(e.target.value)}
                            className="border p-3 rounded w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Cidade</label>
                        <input
                            type="text"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            className="border p-3 rounded w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Estado</label>
                        <input
                            type="text"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="border p-3 rounded w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-semibold">Número</label>
                        <input
                            type="text"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            className="border p-3 rounded w-full"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {leitor ? "Atualizar" : "Criar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
