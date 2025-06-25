"use client";

import { useState, useEffect, useMemo } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePedidos } from "@/contexts/ListaPedidosContext";
import { fetchMesas, Mesa } from "@/lib/api-mock";
import { ArrowRight, BarChart3, DoorOpen, PlusCircle } from "lucide-react";

/**
 * Componente skeleton mostrado quando a pagina esta carregando
 */
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <Skeleton className="h-8 w-8 mb-2 rounded-full" />
          <Skeleton className="h-7 w-12 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex flex-col items-center p-4 border rounded-lg">
          <Skeleton className="h-8 w-8 mb-2 rounded-full" />
          <Skeleton className="h-7 w-12 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  </div>
);


export default function HomePage() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Usa o contexto para pegar a quantidade de pedidos em aberto
  const { openOrdersCount } = usePedidos();

  useEffect(() => {
    async function carregarDados() {
      setIsLoading(true);
      const mesasData = await fetchMesas();
      setMesas(mesasData);
      setIsLoading(false);
    }
    carregarDados();
  }, []);
  
  /**
   * Calcula os totais das memos e coloca em cache com useMemo, assim o valor não é re-calculado quando re-renderizar o componente
   * https://react.dev/reference/react/useMemo
   */
  const statusMesas = useMemo(() => {
    const ocupadas = mesas.filter(m => m.status === 'ocupada' || m.status === 'atencao').length;
    const livres = mesas.length - ocupadas;
    return { ocupadas, livres };
  }, [mesas]);


  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo, Garçom!</h1>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Card de Acoes Rapidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild size="lg" className="w-full justify-between">
                <Link href="/pedido/novo">
                  <span>Criar Novo Pedido</span>
                  <PlusCircle className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full justify-between">
                <Link href="/pedidos">
                  <span>Ver Pedidos em Aberto</span>
                  <div className="flex items-center gap-2">
                    {openOrdersCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {openOrdersCount}
                      </span>
                    )}
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card de Visao Geral */}
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral do Salão</CardTitle>
              <CardDescription>Status atual das mesas.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                <BarChart3 className="h-8 w-8 mb-2" />
                <p className="text-3xl font-bold">{statusMesas.ocupadas}</p>
                <p className="text-sm font-semibold">Ocupadas</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg">
                <DoorOpen className="h-8 w-8 mb-2" />
                <p className="text-3xl font-bold">{statusMesas.livres}</p>
                <p className="text-sm font-semibold">Livres</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}