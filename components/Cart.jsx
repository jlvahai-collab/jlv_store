'use client'; 

import { useProducts } from "@/context/ProductContext";
import Link from "next/link";

export default function Cart() {
  const { cart } = useProducts();
  const activeCart = cart || {};

  const totalItems = Object.values(activeCart).reduce((sum, itemData) => {
    return sum + (itemData?.quantity || 0);
  }, 0);

  return (
    <Link href="/cart" className="global-cart-anchor">
      {/* 🛒 Shopping Cart Symbol */}
      <span className="global-cart-icon">🛒</span>
      
      {/* 🔴 Number Badge tightly pulled in */}
      {totalItems > 0 && (
        <span className="global-cart-badge">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
