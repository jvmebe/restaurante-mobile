"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PedidoSalvo, fetchPedidos } from "@/lib/api-mock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, Tag, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Componente para o skeleton da lista de pedidos.
 */
const OrderListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} className="overflow-hidden">
        <CardHeader className="p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent className="p-4 border-t">
          <Skeleton className="h-5 w-1/4" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoSalvo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para os filtros e abas
  const [abaAtiva, setAbaAtiva] = useState<"aberto" | "finalizado">("aberto");
  const [filtroMesa, setFiltroMesa] = useState("");
  const [filtroData, setFiltroData] = useState<Date | undefined>();

  useEffect(() => {
    async function carregarPedidos() {
      setIsLoading(true);
      const data = await fetchPedidos();
      setPedidos(data);
      setIsLoading(false);
    }
    carregarPedidos();
  }, []);

  // Logica do filtro de pedidos, adiciona em cache com useMemo para performance
  const pedidosFiltrados = useMemo(() => {
    return pedidos
      .filter(p => p.status === abaAtiva) // Filtra pela aba ativa
      .filter(p => // Filtra pelo nome e/ou num da mesa
        filtroMesa === "" || p.mesaNome.toLowerCase().includes(filtroMesa.toLowerCase())
      )
      .filter(p => { // 3. Filtra pela data
        if (!filtroData) return true;
        return p.dataHora.toDateString() === filtroData.toDateString();
      });
  }, [pedidos, abaAtiva, filtroMesa, filtroData]);

  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="text-2xl font-bold">Histórico de Pedidos</h1>

      {/* Filtros e busca */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Buscar por mesa..."
          value={filtroMesa}
          onChange={(e) => setFiltroMesa(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !filtroData && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filtroData ? format(filtroData, "PPP", { locale: ptBR }) : <span>Filtrar por data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filtroData}
              onSelect={setFiltroData}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Abas de status do pedido */}
      <Tabs defaultValue="aberto" onValueChange={(value) => setAbaAtiva(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="aberto">Em Aberto</TabsTrigger>
          <TabsTrigger value="finalizado">Finalizados</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Lista de pedidos */}
      <div className="flex flex-col space-y-5">
        {isLoading ? (
          <OrderListSkeleton />
        ) : pedidosFiltrados.length > 0 ? (
          pedidosFiltrados.map(pedido => (
            <Link key={pedido.id} href={`/pedidos/${pedido.id}`} passHref>
              <Card className="overflow-hidden hover:bg-gray-50 transition-colors">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Tag className="h-5 w-5 text-gray-600" />
                    {pedido.mesaNome}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {format(pedido.dataHora, "'Dia' dd/MM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </CardHeader>
                <CardContent className="p-4 border-t flex justify-between items-center">
                  <span className="text-lg font-bold">R$ {pedido.valorTotal.toFixed(2)}</span>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    pedido.status === 'aberto' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                  }`}>
                    {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 pt-8">Nenhum pedido encontrado com esses filtros.</p>
        )}
      </div>
    </div>
  );
}