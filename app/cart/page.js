'use client';

import Link from "next/link";
import { useProducts } from "@/context/ProductContext";

export default function CartPage() {
    const { cart, handleIncrementProduct } = useProducts();
    const cartItems = Object.entries(cart);

    // Calculate checkout cart subtotal summary balance
    const totalAmount = cartItems.reduce((acc, [id, item]) => {
        const price = item.prices?.[0]?.unit_amount || 0;
        return acc + (price / 100) * item.quantity;
    }, 0);

    const handleCheckout = async () => {
        try {
            const payloadItems = cartItems.map(([id, item]) => ({
                price: id,
                quantity: item.quantity
            }));

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lineItems: payloadItems })
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // Hand over execution context to Stripe Checkout page
            } else if (data.error) {
                alert(data.error);
            }
        } catch (err) {
            console.error("Checkout execution failure:", err);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="page-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <h2>Your shopping cart is currently empty!</h2>
                <p>Browse our digital inventory on the main catalog index.</p>
                <Link href="/" className="button-card" style={{ display: 'inline-block', marginTop: '15px' }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '28px' }}>Your Shopping Cart</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cartItems.map(([priceId, item]) => {
                    const price = item.prices?.[0]?.unit_amount ? (item.prices[0].unit_amount / 100).toFixed(2) : "0.00";
                    const itemImage = item.images?.[0] || "/low_res/placeholder.jpeg";

                    return (
                        <div key={priceId} style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px', alignItems: 'center' }}>
                            <img src={itemImage} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div style={{ flex: '1' }}>
                                <h4 style={{ fontSize: '18px', margin: '0 0 5px 0' }}>{item.name}</h4>
                                <p style={{ margin: 0, color: '#666' }}>${price} each</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => handleIncrementProduct(priceId, -1, item)} style={{ padding: '5px 10px' }}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleIncrementProduct(priceId, 1, item)} style={{ padding: '5px 10px' }}>+</button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: '30px', textAlign: 'right' }}>
                <h3>Total: ${totalAmount.toFixed(2)}</h3>
                <button onClick={handleCheckout} className="button-card" style={{ marginTop: '15px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}>
                    Proceed to Stripe Checkout
                </button>
            </div>
        </div>
    );
}
