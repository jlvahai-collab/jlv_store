'use client';

import { useProducts } from "@/context/ProductContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
    const { cart, handleIncrementProduct } = useProducts();
    const activeCart = cart || {};

    // 💰 Calculate the total cost dynamically with fallbacks
    const total = Object.keys(activeCart).reduce((acc, curr) => {
        const cartItem = activeCart[curr];
        const quantity = cartItem?.quantity || 0;
        
        // Safe check for the price amount
        const cost = cartItem?.prices?.[0]?.unit_amount || 0;
        
        return acc + (cost * quantity);
    }, 0);

    async function createCheckout() {
    try {
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        
        // 🌟 FIX: Explicitly extract the price identifier string from itemData properties
        const lineItems = Object.keys(activeCart).map((key) => {
            const itemData = activeCart[key];
            const validPriceId = itemData?.default_price || itemData?.prices?.[0]?.id || key;
            
            return {
                price: validPriceId,
                quantity: itemData.quantity || 1
            };
        });

        if (lineItems.length === 0) return;

        const response = await fetch(`${baseURL}/api/checkout`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ lineItems })
        });
        
        const data = await response.json();
        
        // Handle server validation messages smoothly
        if (!response.ok) {
            alert(data.error || "Failed to create checkout.");
            return;
        }

        if (data.url) {
            router.push(data.url);
        }
    } catch (err) {
        console.log('Error creating checkout:', err.message);
    }
}



    return (
        <section className="cart-section" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <h2>Your Cart</h2>
            
            {Object.keys(activeCart).length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>You have no items in your cart!</p>
                    <Link href="/" style={{ color: '#000', fontWeight: 'bold' }}>Go back to shop</Link>
                </div>
            )}

            <div className="cart-container">
                {Object.keys(activeCart).map((item, itemIndex) => {
                    const itemData = activeCart[item];
                    const itemQuantity = itemData?.quantity || 0;
                    const itemName = itemData?.name || "Premium Item";
                    const itemDescription = itemData?.description || "An exclusive custom design.";
                    
                    // Safe unit price conversion from cents to dollars
                    const unitPrice = itemData?.prices?.[0]?.unit_amount 
                        ? (itemData.prices[0].unit_amount / 100).toFixed(2) 
                        : "0.00";

                    // 🖼️ Image file asset string mapping logic
                    const imgName = itemName === 'Medieval Dragon Month Planner' ?
                        'planner' :
                        itemName.replaceAll(' Sticker.png', '').replaceAll(' ', '_');
                    const imgUrl = '/low_res/' + imgName + '.jpeg';

                    return (
                        <div key={itemIndex} className="cart-item" style={{ display: 'flex', gap: '20px', padding: '20px 0', borderBottom: '1px solid #eee' }}>
                            <img 
                                src={imgUrl} 
                                alt={`${imgName}-img`} 
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                onError={(e) => { e.target.src = "/low_res/planner.jpeg"; }} // Fallback if image asset doesn't exist
                            />
                            <div className="cart-item-info" style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>{itemName}</h3>
                                <p style={{ color: '#666', fontSize: '14px' }}>
                                    {itemDescription.slice(0, 100)}{itemDescription.length > 100 ? '...' : ''}
                                </p>
                                <h4 style={{ margin: '10px 0' }}>${unitPrice}</h4>
                                
                                <div className="quantity-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <p style={{ margin: 0 }}><strong>Quantity</strong></p>
                                    <input 
                                        type="number" 
                                        value={itemQuantity} 
                                        min="0"
                                        style={{ width: '60px', padding: '4px', textAlign: 'center' }}
                                        onChange={(e) => {
                                            const priceId = itemData.default_price || itemData.prices?.[0]?.id || item;
                                            handleIncrementProduct(priceId, e.target.value, itemData, true);
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {Object.keys(activeCart).length > 0 && (
                <div className="checkout-container" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Total: ${(total / 100).toFixed(2)}</h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link href={'/'}>
                            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>&larr; Continue shopping</button>
                        </Link>
                        <button onClick={createCheckout} style={{ padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            Checkout &rarr;
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
