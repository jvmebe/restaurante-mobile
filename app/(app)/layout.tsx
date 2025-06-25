"use client";

import React, { ReactNode, useState, useEffect, useTransition } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { OrderProvider, useOrder } from "@/contexts/PedidoContext";
import { Mesa, fetchMesas } from "@/lib/api-mock";
import { submitOrder } from "@/app/actions";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster } from "@/components/ui/sonner";
import {
  Home,
  ListOrdered,
  Plus,
  Receipt,
  User,
  X,
  ReceiptText,
  Table,
  Users,
  Loader2,
} from "lucide-react";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PedidosProvider, usePedidos } from "@/contexts/ListaPedidosContext";

// Navbar principal =======================================================================================================================
function MainBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedMesaId } = useOrder();
  const { openOrdersCount } = usePedidos(); // Usado para o badge de pedidos em aberto 

  const handleNovoPedidoClick = () => {
    if (selectedMesaId) {
      router.push(`/pedido/novo/cardapio?mesaId=${selectedMesaId}`);
    } else {
      router.push("/pedido/novo");
    }
  };

  // Atalhos da navbar
  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/pedidos", icon: ListOrdered, label: "Pedidos" },
    {
      onClick: handleNovoPedidoClick,
      icon: Plus,
      label: "Novo Pedido",
      isCentral: true,
    },
    { href: "/financeiro", icon: Receipt, label: "Financeiro" },
    { href: "/perfil", icon: User, label: "Perfil" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-t border-t z-30 h-16">
      <nav className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          if ("onClick" in item && item.isCentral) {
            return (
              <button
                key="novo-pedido-btn"
                onClick={item.onClick}
                className="flex flex-col items-center justify-center"
              >
                <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center -mt-8 shadow-lg border-4 border-gray-50">
                  <item.icon size={32} />
                </div>
              </button>
            );
          }
          if ("href" in item) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center text-gray-500 hover:text-red-500 transition-colors",
                  pathname.startsWith(item.href) &&
                    item.href !== "/" &&
                    "text-red-500",
                  pathname === "/" && item.href === "/" && "text-red-500"
                )}
              >
                <>
                  <item.icon size={24} />
                  {item.href === "/pedidos" && openOrdersCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {openOrdersCount}
                    </span>
                  )}
                </>
              </Link>
            );
          }
          return null;
        })}
      </nav>
    </footer>
  );
}
// ===============================================================================================================================================


// Gaveta de Pedidos =============================================================================================================================
/**
 * Esse componente tem que estar aqui para simplificar o gerenciamento do state:
 * Pemite que o usuário navegue para outras abas SEM perder os dados de um pedido não finalizado
 */

function OrderDrawer() {
  const {
    items,
    totalItems,
    totalValue,
    updateItemQuantity,
    selectedMesaId,
    setSelectedMesaId,
    observacoes,
    setObservacoes,
    clearOrder,
  } = useOrder();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function carregarMesas() {
      const mesasData = await fetchMesas();
      setMesas(mesasData);
    }
    carregarMesas();
  }, []);

  const handleSendOrder = () => {
    if (!selectedMesaId || items.length === 0) {
      toast.error("Selecione uma mesa e adicione itens ao pedido.");
      return;
    }
    const orderData = {
      mesaId: selectedMesaId,
      total: totalValue,
      itens: items,
      observacoes: observacoes,
    };

    startTransition(async () => {
      const result = await submitOrder(orderData);
      if (result.success) {
        toast.success(result.message);
        clearOrder();
        router.push("/");
      } else {
        toast.error("Houve um erro ao enviar o pedido.");
      }
    });
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="fixed bottom-16 left-0 right-0 bg-gray-100 p-4 border-y-2 border-gray-200 shadow-t-lg flex items-center justify-between cursor-pointer active:bg-gray-200 transition-colors z-20">
          <p className="font-bold text-lg text-gray-800">Pedido</p>
          <div className="text-right">
            <p className="font-semibold text-gray-800">
              {totalItems} {totalItems === 1 ? "item" : "itens"}
            </p>
            <p className="text-sm text-gray-600">R$ {totalValue.toFixed(2)}</p>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="p-0 bg-gray-200 outline-none">
        <div className="p-4 space-y-4">
          <header className="flex justify-between items-center">
            <ReceiptText className="text-gray-600 h-6 w-6" />
            <h2 className="text-xl font-bold text-gray-800">Pedido</h2>
            <DrawerClose asChild>
              <button className="p-1 rounded-full hover:bg-red-100">
                <X className="text-red-500 h-6 w-6" />
              </button>
            </DrawerClose>
          </header>
          <section className="space-y-3">
            <div className="flex items-center gap-4">
              <Table className="text-gray-700" />
              <p className="flex-1 font-semibold text-gray-800">Mesa</p>
              <Select
                value={selectedMesaId ?? undefined}
                onValueChange={(value) => setSelectedMesaId(value)}
              >
                <SelectTrigger className="w-[120px] bg-white shadow-sm">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {mesas.map((mesa) => (
                    <SelectItem key={mesa.id} value={mesa.id.toString()}>
                      {mesa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Users className="text-gray-700" />
              <p className="flex-1 font-semibold text-gray-800">Clientes</p>
              <Select defaultValue="1">
                <SelectTrigger className="w-[120px] bg-white shadow-sm">
                  <SelectValue placeholder="Nº" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
          <hr className="border-gray-300" />
        </div>
        <section className="px-4 pb-4 overflow-y-auto max-h-[45vh]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-gray-500">Seu pedido está vazio.</p>
              <p className="text-sm text-gray-400 mt-1">
                Adicione itens do cardápio.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`item-${item.id}`}
                    className="h-6 w-6 border-gray-400"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 leading-tight">
                      {item.nome}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">
                        R${item.preco.toFixed(2)}
                      </span>{" "}
                      |
                      <span className="text-red-600 font-bold ml-2">
                        R${(item.preco * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <QuantitySelector
                    quantity={item.quantity}
                    onQuantityChange={(newQuantity) =>
                      updateItemQuantity(item.id, newQuantity)
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="px-4 pb-4 space-y-2">
          <div className="flex flex-row justify-between items-center">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <p className="text-xs text-muted-foreground">
              {observacoes.length} / 128
            </p>
          </div>
          <Textarea
            id="observacoes"
            placeholder="Ex: Sem gelo no suco."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            maxLength={128}
            className="bg-white"
          />
        </section>
        <footer className="p-4 mt-auto border-t border-gray-300 bg-gray-200">
          <Button
            className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 disabled:opacity-50"
            onClick={handleSendOrder}
            disabled={isPending || items.length === 0}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              "Enviar Pedido"
            )}
          </Button>
        </footer>
      </DrawerContent>
    </Drawer>
  );
}
// ===================================================================================================================================

// Componente principal que organiza os outros componentes da UI =====================================================================
function AppUI({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setSelectedMesaId } = useOrder();
  const isInOrderFlow = pathname.startsWith("/pedido/novo");

  useEffect(() => {
    if (isInOrderFlow) {
      const mesaIdFromUrl = searchParams.get("mesaId");
      if (mesaIdFromUrl) {
        setSelectedMesaId(mesaIdFromUrl);
      }
    }
  }, [pathname, searchParams, setSelectedMesaId, isInOrderFlow]);

  return (
    <div className="h-full w-full">
      <main
        className={cn(
          "h-full overflow-y-auto",
          isInOrderFlow ? "pb-36" : "pb-20" // Teoricamente era pra aplicar padding diferente no main dependendo do flow atual, mas parece nao ter funcionado? Apliquei manualmente na div de cada componente por enquanto
        )}
      >
        {children}
      </main>

      {/* Renderiza o banner de pedido APENAS se estiver no flow de criacao de pedido*/}
      {isInOrderFlow && <OrderDrawer />}

      <MainBottomNav />
    </div>
  );
}
// ======================================================================================================================================================================================================================


// Layout principal  ====================================================================================================================================================================================================
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PedidosProvider>
      <OrderProvider>
        <div className="h-screen w-full">
          <React.Suspense fallback={<div>Carregando...</div>}>
            <AppUI>{children}</AppUI>
          </React.Suspense>
          <Toaster richColors position="top-center" />
        </div>
      </OrderProvider>
    </PedidosProvider>
  );
}
