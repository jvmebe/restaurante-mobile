// app/(app)/page.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo, Garçom!</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>O que você deseja fazer?</CardTitle>
        </CardHeader>
        <CardContent>
           <Link href="/pedido/novo" passHref>
            <Button size="lg" className="w-full">
              Criar Novo Pedido
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}