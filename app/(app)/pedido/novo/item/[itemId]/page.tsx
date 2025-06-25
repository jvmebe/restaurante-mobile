"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchProdutos, Produto } from '@/lib/api-mock';
import { useOrder } from '@/contexts/PedidoContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Minus, Plus, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { ProductImage } from '@/components/ui/product-image';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Componente de skeleton
 */
const ItemDetailsSkeleton = () => (
  <div className="p-4 -mt-8 bg-white rounded-t-3xl relative z-20">
    <Skeleton className="h-9 w-3/4 mb-3" />
    <Skeleton className="h-8 w-1/3 mb-4" />
    
    <div className="space-y-2 mb-6">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>

    <Skeleton className="h-6 w-32 mb-2" />
     <div className="space-y-2 mb-6">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>

    <div className="flex items-center justify-center gap-6 my-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-9 w-12" />
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>

    <Skeleton className="h-14 w-full" />
  </div>
);


export default function ItemDetalhesPage({ params }: { params: { itemId: string } }) {
  const router = useRouter();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToOrder } = useOrder();

  useEffect(() => {
    async function carregarProduto() {
      setIsLoading(true);
      const todosProdutos = await fetchProdutos();
      const produtoEncontrado = todosProdutos.find(p => p.id === parseInt(params.itemId));
      setProduto(produtoEncontrado || null);
      setIsLoading(false);
    }
    carregarProduto();
  }, [params.itemId]);

  const handleAddToOrder = () => {
    if (produto) {
      addToOrder(produto, quantity);
      toast.success(`${quantity}x ${produto.nome} adicionado ao pedido!`);
      router.back();
    }
  };

  return (
    <div>
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-30">
        <button onClick={() => router.back()} className="bg-white rounded-full p-2 shadow-md">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="relative h-64 w-full bg-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <ProductImage 
            src={produto?.imagemUrl} 
            alt={produto?.nome || 'Imagem do produto'} 
            fill 
            priority 
          />
        )}
      </div>

      {isLoading ? (
        <ItemDetailsSkeleton />
      ) : (
        produto && (
          <div className="p-4 pb-20 -mt-8 bg-white rounded-t-3xl relative z-20">
            <h1 className="text-3xl font-bold">{produto.nome}</h1>
            <p className="text-2xl font-bold text-red-600 my-2">R${produto.preco.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{produto.descricaoBreve}</p>

            <h2 className="font-bold text-lg mb-2">Ingredientes</h2>
            <p className="text-gray-600 text-sm mb-6">{produto.ingredientes.join(', ')}</p>
            
            <div className="flex items-center justify-center gap-6 my-6">
                <Button onClick={() => setQuantity(q => Math.max(1, q - 1))} size="icon" variant="outline" className="rounded-full h-12 w-12">
                    <Minus/>
                </Button>
                <span className="text-3xl font-bold w-12 text-center">{quantity}</span>
                <Button onClick={() => setQuantity(q => q + 1)} size="icon" variant="outline" className="rounded-full h-12 w-12">
                    <Plus/>
                </Button>
            </div>

            <Button onClick={handleAddToOrder} size="lg" className="w-full bg-red-600 hover:bg-red-700 h-14 text-lg">
                ADICIONAR
            </Button>
          </div>
        )
      )}
    </div>
  );
}