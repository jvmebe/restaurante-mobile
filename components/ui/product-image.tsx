// components/ui/product-image.tsx - NOVO ARQUIVO
"use client";

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

// Define o caminho para a nossa imagem padrão
const FALLBACK_IMAGE_SRC = '/images/placeholder.jpg';

// Nossas props serão as mesmas do <Image> do Next, mas 'src' é opcional
interface ProductImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
}

/**
 * Um componente de Imagem que mostra uma imagem padrão caso a 'src' fornecida
 * seja inválida, nula ou falhe ao carregar.
 */
export function ProductImage({ src, ...props }: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_IMAGE_SRC);

  // Garante que a imagem seja atualizada se a prop 'src' mudar
  useEffect(() => {
    setCurrentSrc(src || FALLBACK_IMAGE_SRC);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      // O 'onError' é chamado pelo navegador se a imagem falhar ao carregar
      onError={() => {
        setCurrentSrc(FALLBACK_IMAGE_SRC);
      }}
    />
  );
}