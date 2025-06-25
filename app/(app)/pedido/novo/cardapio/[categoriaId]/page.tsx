"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Categoria, fetchCategorias, Produto, fetchProdutos } from "@/lib/api-mock";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { ProductImage } from "@/components/ui/product-image";
import { cn } from "@/lib/utils";
import { SearchDialog } from '../../_components/SearchDialog';

export default function CategoriaPage({ params }: { params: { categoriaId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mesaId = searchParams.get('mesaId');

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      setIsLoading(true);
      const [categoriasData, produtosData] = await Promise.all([
        fetchCategorias(),
        fetchProdutos(),
      ]);
      setCategorias(categoriasData);
      setProdutos(produtosData);
      setIsLoading(false);
    }
    carregarDados();
  }, []);

  const handleTabChange = (categoriaId: string) => {
    router.replace(`/pedido/novo/cardapio/${categoriaId}?mesaId=${mesaId}`);
  };

  return (
    <div className="p-4 pb-20">
      <header className="flex justify-between items-center mb-4">
        <button onClick={() => router.back()}><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold">CARDÁPIO</h1>
        <SearchDialog mesaId={mesaId} />
      </header>

      <Tabs 
        defaultValue={params.categoriaId} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="relative w-full overflow-x-auto whitespace-nowrap p-1 h-auto rounded-lg bg-muted [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categorias.length > 0 ? (
            categorias.map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id.toString()}
                className="px-4 py-2" 
              >
                {cat.nome}
              </TabsTrigger>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500">Carregando abas...</div>
          )}
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center items-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          categorias.map(cat => (
            <TabsContent key={cat.id} value={cat.id.toString()} className="mt-4">
              <div className="space-y-4">
                {produtos.filter(p => p.categoriaId === cat.id).map(produto => (
                  <Link key={produto.id} href={`/pedido/novo/item/${produto.id}?mesaId=${mesaId}`} passHref>
                    <div className="flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                      <ProductImage src={produto.imagemUrl} alt={produto.nome} width={80} height={80} className="rounded-md object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold">{produto.nome}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{produto.descricaoBreve}</p>
                      </div>
                      <p className="font-bold">R${produto.preco.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))
        )}
      </Tabs>
    </div>
  );
}