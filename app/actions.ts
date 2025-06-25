"use server";

import { OrderItem } from "@/contexts/PedidoContext";
import { saveNewOrder, finalizarPedido } from "../lib/api-mock"; 

interface OrderData {
  mesaId: string | null;
  total: number;
  itens: OrderItem[];
  observacoes?: string;
}

export async function submitOrder(data: OrderData) {
  try {

    if (!data.mesaId || data.itens.length === 0) {
      throw new Error("Dados do pedido inválidos para submissão.");
    }

    await saveNewOrder({
      mesaId: data.mesaId,
      itens: data.itens,
      valorTotal: data.total,
      observacoes: data.observacoes,
    });

    console.log("\n --- NOVO PEDIDO RECEBIDO E PROCESSADO --- ");
    console.log(`Mesa: ${data.mesaId}`);
    console.log(`Valor Total: R$${data.total.toFixed(2)}`);
    console.log(`Observações: ${data.observacoes || 'Nenhuma'}`);
    console.log("Itens do Pedido:");
    console.log(JSON.stringify(data.itens, null, 2));
    console.log("-------------------------------------------\n");

    return { success: true, message: "Pedido enviado com sucesso!" };

  } catch (error) {

    console.error("Erro ao processar o pedido:", error);

    return { success: false, message: "Ocorreu uma falha ao enviar o pedido." };
  }
}


export async function closeOrderAction(pedidoId: number) {
  try {
    const result = await finalizarPedido(pedidoId);
    if (result.success) {
      return { success: true, message: "Pedido entregue!" };
    }
    throw new Error("Pedido não encontrado.");
  } catch (error) {
    console.error("Erro ao finalizar o pedido:", error);
    return { success: false, message: "Falha ao marcar pedido como entregue." };
  }
}