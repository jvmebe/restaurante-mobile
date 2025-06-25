"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { PedidoSalvo, fetchPedidoById } from "@/lib/api-mock";
import { closeOrderAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Loader2, StickyNote, Tag, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DetailSkeleton = () => (
  <div className="p-4 space-y-4">
    <Skeleton className="h-8 w-48" />
    <Card>
      <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
    <Skeleton className="h-12 w-full mt-4" />
  </div>
);

export default function PedidoDetalhesPage({ params }: { params: { pedidoId: string } }) {
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoSalvo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  const pedidoId = parseInt(params.pedidoId);

  useEffect(() => {
    if (isNaN(pedidoId)) return;
    
    async function carregarPedido() {
      setIsLoading(true);
      const data = await fetchPedidoById(pedidoId);
      setPedido(data || null);
      setIsLoading(false);
    }
    carregarPedido();
  }, [pedidoId]);

  const handleFinalizarPedido = () => {
    startTransition(async () => {
      const result = await closeOrderAction(pedidoId);
      if (result.success) {
        toast.success(result.message);
        if (pedido) {
          setPedido({ ...pedido, status: 'entregue' });
        }
      } else {
        toast.error(result.message);
      }
    });
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!pedido) {
    return <div className="p-4 text-center">Pedido não encontrado.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Detalhes do Pedido</h1>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Tag className="h-5 w-5" />
            {pedido.mesaNome}
          </CardTitle>
          <CardDescription>ID do Pedido: {pedido.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {format(pedido.dataHora, "PPP", { locale: ptBR })}</p>
          <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {format(pedido.dataHora, "HH:mm'h'", { locale: ptBR })}</p>
          <p className="flex items-center gap-2">
            <CheckCircle className={`h-4 w-4 ${pedido.status === 'aberto' ? 'text-yellow-500' : 'text-green-500'}`} />
            Status: <span className="font-semibold">{pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {pedido.itens.map(item => (
              <li key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold">{item.quantity}x</span> {item.nome}
                </div>
                <span className="font-mono">R$ {(item.preco * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between items-center font-bold text-lg border-t pt-4">
          <span>Total</span>
          <span>R$ {pedido.valorTotal.toFixed(2)}</span>
        </CardFooter>
      </Card>

      {pedido.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <StickyNote className="h-4 w-4" /> Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">"{pedido.observacoes}"</p>
          </CardContent>
        </Card>
      )}

      {pedido.status === 'aberto' && (
        <Button 
          className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
          onClick={handleFinalizarPedido}
          disabled={isPending}
        >
          {isPending ? (<Loader2 className="mr-2 h-6 w-6 animate-spin" />) : ("Marcar como entregue")}
        </Button>
      )}
    </div>
  );
}