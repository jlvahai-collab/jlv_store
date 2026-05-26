'use client';

import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export default function ProductsProvider(props) {
    const { children } = props;
    const [cart, setCart] = useState({});

    function handleIncrementProduct(price_id, num, data, isAbsolute = false) {
        if (!price_id) {
            console.error("Cannot add product to cart: Missing price_id", data);
            return;
        }

        const newCart = { ...cart };
        const changeAmount = parseInt(num, 10) || 0;

        if (price_id in cart) {
            const currentQuantity = cart[price_id]?.quantity || 0;
            // 🌟 If isAbsolute is true (like a text input box), overwrite the value.
            // Otherwise, increment it (like clicking "Add to Cart").
            const finalQuantity = isAbsolute ? changeAmount : currentQuantity + changeAmount;

            if (finalQuantity <= 0) {
                delete newCart[price_id];
            } else {
                newCart[price_id] = {
                    ...cart[price_id],
                    quantity: finalQuantity
                };
            }
        } else {
            // Item does not exist in cart yet, create it if quantity is positive
            if (changeAmount > 0) {
                newCart[price_id] = {
                    ...data,
                    quantity: changeAmount
                };
            }
        }
        
        setCart(newCart);
    }

    return (
        <ProductContext.Provider value={{ cart, handleIncrementProduct }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductContext);
}
