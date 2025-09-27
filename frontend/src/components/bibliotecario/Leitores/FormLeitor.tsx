"use client";

import { useState, useEffect } from "react";
import { Leitor } from "@/models/leitor";
import { buscarEndereco } from "@/utils/viaCep";

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


    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setCep(valor);

        // só busca se o CEP tiver 8 dígitos
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
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">{leitor ? "Editar Leitor" : "Adicionar Leitor"}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label>Nome completo</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="border p-2 rounded w-full" required />
                    </div>

                    <div className="flex flex-col">
                        <label>CPF</label>
                        <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className="border p-2 rounded w-full" required />
                    </div>

                    <div className="flex flex-col">
                        <label>E-mail</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded w-full" />
                    </div>

                    <div className="flex flex-col">
                        <label>Telefone</label>
                        <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="border p-2 rounded w-full" />
                    </div>

                    <div className="flex flex-col">
                        <label>CEP</label>
                        <input
                            type="text"
                            value={cep}
                            onChange={handleCepChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Rua</label>
                        <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} className="border p-2 rounded w-full" />
                    </div>

                    <div className="flex flex-col">
                        <label>Cidade</label>
                        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className="border p-2 rounded w-full" />
                    </div>

                    <div className="flex flex-col">
                        <label>Estado</label>
                        <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} className="border p-2 rounded w-full" />
                    </div>

                    <div className="flex flex-col">
                        <label>Número</label>
                        <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} className="border p-2 rounded w-full" />
                    </div>

                    <div className="col-span-2 flex justify-end gap-2 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">{leitor ? "Atualizar" : "Criar"}</button>
                    </div>
                </form>

            </div>
        </div>
    );
}
