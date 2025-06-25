"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Mesa, fetchMesas } from '@/lib/api-mock';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';


export default function MesaSelectorPage() {
  const router = useRouter();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setIsLoading(true);
        const mesasData = await fetchMesas();
        setMesas(mesasData);
      } catch (error) {
        console.error("Erro ao buscar as mesas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDados();
  }, []);

  const getStatusColor = (status: Mesa['status']) => {
    switch (status) {
      case 'atencao':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'ocupada':
        return 'bg-yellow-400 hover:bg-yellow-500 text-black';
      case 'livre':
      default:
        return 'bg-white hover:bg-gray-100 text-black border border-gray-300';
    }
  };


  const handleSelectMesa = (mesaId: number) => {
    router.push(`/pedido/novo/cardapio?mesaId=${mesaId}`);
  };

  return (
    <div className="w-full bg-white min-h-full pb-20">

      <div className="p-6">
        <h2 className="text-center text-2xl font-bold my-4 text-gray-800">Mesas</h2>

        {isLoading ? (
          <div className="text-center text-gray-500">Carregando mesas...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {mesas.map((mesa) => (
              <Button
                key={mesa.id}
                onClick={() => handleSelectMesa(mesa.id)}
                className={cn(
                  "h-20 text-2xl font-bold rounded-lg shadow-md transition-transform duration-150 ease-in-out hover:scale-105",
                  getStatusColor(mesa.status)
                )}
              >
                {mesa.nome}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}