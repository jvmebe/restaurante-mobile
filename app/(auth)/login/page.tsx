"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, Eye } from "lucide-react";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    console.log("Simulando login e salvando cookie...");
    
    Cookies.set('auth_token', 'mock_token_value', { expires: 1 }); 

    router.push("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Image 
          src="/images/logo.png"
          alt="Logo Miyako"
          width={100}
          height={100}
          className="mb-8"
        />

        <h1 className="text-3xl font-bold mb-8">Fazer login</h1>

        <div className="w-full space-y-6">
          <div className="relative">
            <Label htmlFor="matricula" className="text-xs text-gray-400">MATRÍCULA:</Label>
            <User className="absolute left-3 top-1/2 h-5 w-5 text-gray-400" />
            <Input 
              id="matricula" 
              placeholder="1234567" 
              className="bg-black border-b-2 border-t-0 border-x-0 border-gray-600 rounded-none pl-10 focus:border-red-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="relative">
            <Label htmlFor="senha" className="text-xs text-gray-400">SENHA:</Label>
            <Lock className="absolute left-3 top-1/2 h-5 w-5 text-gray-400" />
            <Input 
              id="senha" 
              type="password"
              placeholder="••••"
              className="bg-black border-b-2 border-t-0 border-x-0 border-gray-600 rounded-none pl-10 focus:border-red-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Eye className="absolute right-3 top-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center w-full my-6">
          <Checkbox id="lembre-me" className="border-white data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
          <Label htmlFor="lembre-me" className="ml-2 text-sm font-medium">LEMBRE-ME</Label>
        </div>

        <Button onClick={handleLogin} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg rounded-lg">
          ACESSAR
        </Button>
      </div>
    </div>
  );
}