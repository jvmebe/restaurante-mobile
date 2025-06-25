// test/contexts/OrderContext.tsx - VERSÃO COMPLETA E CORRIGIDA

"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Produto } from '@/lib/api-mock';

export interface OrderItem extends Produto {
  quantity: number;
}

interface OrderContextType {
  items: OrderItem[];
  addToOrder: (product: Produto, quantity: number) => void;
  updateItemQuantity: (productId: number, newQuantity: number) => void;
  removeItem: (productId: number) => void;
  totalItems: number;
  totalValue: number;
  selectedMesaId: string | null;
  setSelectedMesaId: (id: string | null) => void; // Corrigido para aceitar null
  observacoes: string; // NOVO
  setObservacoes: (text: string) => void; // NOVO
  clearOrder: () => void; // NOVO
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedMesaId, setSelectedMesaId] = useState<string | null>(null);
  const [observacoes, setObservacoes] = useState(""); // NOVO ESTADO

  /**
   * CORREÇÃO APLICADA AQUI:
   * Lógica para adicionar um produto ao pedido.
   */
  const addToOrder = (product: Produto, quantity: number) => {
    setItems(prevItems => {
      // Verifica se o item já existe no pedido
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Se já existe, atualiza a quantidade do item existente
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Se for um item novo, adiciona ao final do array do pedido
      return [...prevItems, { ...product, quantity }];
    });
  };

  const clearOrder = () => {
    setItems([]);
    setSelectedMesaId(null);
    setObservacoes("");
  };


  const updateItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.preco * item.quantity, 0);

  return (
    <OrderContext.Provider value={{
      items,
      addToOrder,
      updateItemQuantity,
      removeItem,
      totalItems,
      totalValue,
      selectedMesaId,
      setSelectedMesaId,
      observacoes, // NOVO
      setObservacoes, // NOVO
      clearOrder, // NOVO
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}