"use client";

import { useState } from "react";

interface SenhaEmprestimoModalProps {
    onConfirm: (senha: string) => void;
    onCancel: () => void;
}

export default function SenhaEmprestimoModal({ onConfirm, onCancel }: SenhaEmprestimoModalProps) {
    const [senha, setSenha] = useState("");

    const handleConfirm = () => {
        if (!senha) return;
        onConfirm(senha);
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Confirmação de Empréstimo</h2>
                <label className="flex flex-col mb-4">
                    Senha de empréstimo
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="border p-2 rounded mt-1"
                    />
                </label>
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-green-500 text-white rounded">Confirmar</button>
                </div>
            </div>
        </div>
    );
}
