'use client';

import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export default function ProductsProvider(props) {
    const { children } = props;
    const [cart, setCart] = useState({});

    function handleIncrementProduct(price_id, num, data, isAbsolute = false) {
        const newCart = {
            ...cart
        };
        
        // Safely parse input string numbers into real integers
        const changeAmount = parseInt(num, 10) || 0;

        if (price_id in cart) {
            const currentQuantity = cart[price_id]?.quantity || 0;
            newCart[price_id] = {
                ...data,
                // If input comes from a typed text box, overwrite the value directly.
                // If it comes from a button press, increment relatively.
                quantity: isAbsolute ? changeAmount : currentQuantity + changeAmount
            };
        } else {
            newCart[price_id] = {
                ...data,
                quantity: changeAmount
            };
        }

        // If quantities drop to zero or lower, delete the item row from the cart
        if (newCart[price_id] && newCart[price_id].quantity <= 0) {
            delete newCart[price_id];
        }

        setCart(newCart);
    }

    const value = {
        cart,
        handleIncrementProduct,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProducts = () => useContext(ProductContext);
