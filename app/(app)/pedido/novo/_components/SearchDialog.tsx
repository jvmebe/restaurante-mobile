"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { Produto, searchProducts } from "@/lib/api-mock";
import { ProductImage } from "@/components/ui/product-image";

export function SearchDialog({ mesaId }: { mesaId: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Efeito para so pesquisar dps que o usuario terminar de digitar, para nao spammar a API com requests
   */
  useEffect(() => {
    // Limpa os resultados se o campo tiver menos de 2 caracteres
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // Timer para atrasar a chamada da API
    const timer = setTimeout(async () => {
      const searchResult = await searchProducts(searchTerm);
      setResults(searchResult);
      setIsLoading(false);
    }, 300); // Atraso de 300ms

    // Limpa o timer se o usuario digitar novamente antes dos 300ms
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buscar Produto</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Digite o nome do produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-lg"
          />
        </div>
        <div className="min-h-[200px] max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((produto) => (
                <Link
                  key={produto.id}
                  href={`/pedido/novo/item/${produto.id}?mesaId=${mesaId}`}
                  passHref
                  onClick={() => setIsOpen(false)} // Fecha o dialogo ao clicar em um resultado
                >
                  <div className="flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                    <ProductImage src={produto.imagemUrl} alt={produto.nome} width={60} height={60} className="rounded-md object-cover"/>
                    <div className="flex-1"><p className="font-semibold">{produto.nome}</p></div>
                    <p className="font-bold">R${produto.preco.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchTerm.length > 1 ? (
            <p className="text-center text-gray-500 pt-8">Nenhum resultado encontrado para "{searchTerm}".</p>
          ) : (
             <p className="text-center text-gray-500 pt-8">Digite ao menos 2 caracteres para buscar.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}