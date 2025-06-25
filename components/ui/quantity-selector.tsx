// components/ui/quantity-selector.tsx
"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "./button";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export function QuantitySelector({ quantity, onQuantityChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        className="h-7 w-7 rounded-full border-red-500 text-red-500"
        onClick={() => onQuantityChange(quantity - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="text-lg font-bold w-6 text-center">{quantity}</span>
      <Button
        size="icon"
        variant="outline"
        className="h-7 w-7 rounded-full border-red-500 text-red-500 bg-red-100"
        onClick={() => onQuantityChange(quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}