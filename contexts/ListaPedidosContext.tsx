"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'; // Importe o useMemo
import { PedidoSalvo, fetchPedidos } from '@/lib/api-mock';

interface PedidosContextType {
  pedidos: PedidoSalvo[];
  isLoading: boolean;
  openOrdersCount: number;
}

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

export function PedidosProvider({ children }: { children: ReactNode }) {
  const [pedidos, setPedidos] = useState<PedidoSalvo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setIsLoading(true);
      const data = await fetchPedidos();
      setPedidos(data);
      setIsLoading(false);
    }
    carregarDados();
  }, []);

  // Valor do contexto so e recalculado se 'pedidos' ou 'isLoading' mudarem
  const contextValue = useMemo(() => {
    const openOrdersCount = pedidos.filter(p => p.status === 'aberto').length;
    return { 
      pedidos, 
      isLoading, 
      openOrdersCount 
    };
  }, [pedidos, isLoading]);

  return (
    <PedidosContext.Provider value={contextValue}>
      {children}
    </PedidosContext.Provider>
  );
}

export function usePedidos() {
  const context = useContext(PedidosContext);
  if (context === undefined) {
    throw new Error('usePedidos must be used within a PedidosProvider');
  }
  return context;
}