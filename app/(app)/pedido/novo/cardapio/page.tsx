// test/app/(app)/pedido/novo/cardapio/page.tsx - VERSÃO COM SKELETONS
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCategorias, fetchProdutos, Categoria, Produto } from '@/lib/api-mock';
import { ArrowLeft, Search } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"; // Importe o componente Skeleton
import { ProductImage } from '@/components/ui/product-image';
import { SearchDialog } from '../_components/SearchDialog'; // Importe o novo componente

/**
 * Componente para o esqueleto da lista de itens populares.
 * Criar componentes de skeleton separados ajuda a manter o código principal mais limpo.
 */
const PopularItemsSkeleton = () => (
  <section>
    <Skeleton className="h-8 w-40 mb-4" /> {/* Skeleton para o título "Populares" */}
    <div className="space-y-4">
      {/* Repete o skeleton de um item algumas vezes */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-md" /> {/* Skeleton para a imagem */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" /> {/* Skeleton para o nome do produto */}
            <Skeleton className="h-4 w-1/2" /> {/* Skeleton para a descrição */}
          </div>
          <Skeleton className="h-6 w-16" /> {/* Skeleton para o preço */}
        </div>
      ))}
    </div>
  </section>
);

export default function CardapioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mesaId = searchParams.get('mesaId');
  
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtosPopulares, setProdutosPopulares] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
        setIsLoading(true);
        const [categoriasData, produtosData] = await Promise.all([
          fetchCategorias(),
          fetchProdutos()
        ]);
        setCategorias(categoriasData);
        setProdutosPopulares(produtosData.filter(p => p.isPopular));
        setIsLoading(false);
    }
    carregarDados();
  }, []);


  return (
    <div className="p-4 pb-20">
      <header className="flex justify-between items-center mb-4">
        <button onClick={() => router.back()}><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-bold">CARDÁPIO</h1>
        <SearchDialog mesaId={mesaId} />
      </header>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </>
        ) : (
          categorias.map(cat => (
            <Link 
              key={cat.id} 
              href={`/pedido/novo/cardapio/${cat.id}?mesaId=${mesaId}`}
              className="relative h-24 rounded-lg overflow-hidden block group"
            >
              {/* IMAGEM DE FUNDO - CAMADA INFERIOR */}
              <Image 
                src={cat.imagemUrl}
                alt={`Fundo da categoria ${cat.nome}`}
                layout="fill"
                objectFit="cover"
                // CORREÇÃO APLICADA AQUI: Adicionado z-10
                className="transition-transform duration-300 group-hover:scale-110 z-10 blur-[1px]" 
              />
              {/* EFEITO DE BLUR E TEXTO - CAMADA SUPERIOR */}
              <div 
                // CORREÇÃO APLICADA AQUI: Adicionado z-20
                className="absolute inset-0 bg-opacity-0 flex items-center justify-center z-20"
              >
                <h2 className="text-white font-bold text-lg drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)] z-40">
                  {cat.nome.toUpperCase()}
                </h2>
              </div>
            </Link>
          ))
        )}
      </div>

      {isLoading ? (
        <PopularItemsSkeleton />
      ) : (
        <section>
          <h3 className="text-2xl font-bold mb-4">Populares</h3>
          <div className="space-y-4">
            {produtosPopulares.map(produto => (
              <Link key={produto.id} href={`/pedido/novo/item/${produto.id}?mesaId=${mesaId}`} passHref>
                <div className="flex items-center gap-4 cursor-pointer">
                  <ProductImage 
                        src={produto.imagemUrl} 
                        alt={produto.nome} 
                        width={80} 
                        height={80} 
                        className="rounded-md" 
                    />
                  <div className="flex-1">
                    <p className="font-semibold">{produto.nome}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{produto.descricaoBreve}</p>
                  </div>
                  <p className="font-bold">R${produto.preco.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}