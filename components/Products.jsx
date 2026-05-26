'use client';

import { useState } from "react";
import Portal from "./Portal";
import { useProducts } from "@/context/ProductContext";

export default function Products(props) {
    // 🌟 FIX 3: Grab the variables exactly as page.js sends them
    const planner = props.planner;
    const stickers = props.stickers || []; 

    const [portalImage, setPortalImage] = useState(null);
    // ... keep the rest of your state and handlers exactly the same


    const { handleIncrementProduct } = useProducts()

    // 2. Safe pricing look-up helpers
    const getStickerPrice = (sticker) => {
        if (sticker.prices && sticker.prices.length > 0) {
            return (sticker.prices[0].unit_amount / 100).toFixed(2);
        }
        return "1.99";
    };

    const getPlannerPrice = (plannerItem) => {
        if (plannerItem && plannerItem.prices && plannerItem.prices.length > 0) {
            return (plannerItem.prices[0].unit_amount / 100).toFixed(2);
        }
        return "19.99";
    };

    // 🌟 3. MOVE THIS HERE: Safely calculate the image source ABOVE the return statement
    const plannerImageUrl = planner && planner.images && planner.images.length > 0 
        ? planner.images[0] 
        : "/low_res/planner.jpeg";

    // 4. Render nothing if data hasn't arrived yet
    if (!stickers.length && !planner) { 
        return (
            <div className="section-container" style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading store items from Stripe...</p>
            </div>
        ); 
    }

    // 5. Clean HTML block starts here
    return (    
        <>
            {portalImage && (
                <Portal handleClosePortal={() => { setPortalImage(null) }}>
                    <div className="portal-content">
                        <img className="img-display" src={portalImage} alt="Stripe-High-Res-Zoom" />
                    </div>
                </Portal>
            )}
            
            <div className="section-container">
                <div className="section-header">
                    <h2>Shop our Products & Services</h2>
                    <p>Books, Stickers, and More!</p>
                </div>
            
                <div className="planner-container">
                    <div>
                        <button onClick={() => {
                            setPortalImage(plannerImageUrl) 
                        }} className="img-button">
                            {/* Uses the clean variable correctly inside the HTML */}
                            <img src={plannerImageUrl} alt="Medieval Dragon Month Planner View" />
                        </button>
                    </div>
                    
                    {/* ... keep the rest of your file layout exactly the same from here down ... */}

            
            <div className="planner-info">
                <p className="text-large planner-header">
                    {planner ? planner.name : "Medieval Dragon Month Planner"}
                </p>
                {/* Safe price calculation helper we created earlier */}
                <h3><span>$</span>{getPlannerPrice(planner)}</h3>
                <p>Stay organized and on top of your schedule with our 2024 planner. Featuring monthly and weekly layouts, goal-setting pages, and inspirational quotes, it's the perfect companion for a productive year ahead!</p>
                <button className="button-card">Shop Now</button>

                <ul>
                    <li>Monthly and weekly layouts for easy scheduling</li>
                    <li>Goal-setting pages to help you achieve your dreams</li>
                    <li>Inspirational quotes to keep you motivated</li>
                    <li>Durable cover and high-quality paper for long-lasting use</li> 
                    <li>
                        <strong>Bonus:</strong>Each planner comes with a set of exclusive stickers to add some fun and personality to your planning!
                    </li> 
                </ul>
            </div>
        </div>

                
            <div className="purchase-btns">
                <button onClick={() => {
                    const plannerPriceId = planner.default_price || planner.prices?.[0]?.id;
                    handleIncrementProduct(plannerPriceId, 1, planner); // 🌟 Passes full planner object
                }}>Add to Cart</button>
            </div>                    
            
                <div className="section-container">
                    <div className="section-header">
                        <h2>Services & Products</h2>
                        <p>Projects, developments, services and products that I have created!</p>
                    </div>
                    <div className="sticker-wrapper"> 
                        <div className="sticker-container"> 
                            {stickers.map((sticker, stickerIndex) => { 
                                // Find this section inside your stickers.map loop:
                            const stickerName = sticker.name;
                                 
                            // FIX: Make sure to explicitly grab index [0] from the stripe images array
                            const stripeImage = sticker.images && sticker.images.length > 0 
                            ? sticker.images[0] 
                            : "/low_res/placeholder.jpeg"; 

                                return (
                                    <div key={stickerIndex} className="product-wrapper">
                                         <div className="sticker-card"> 
                                            <button onClick={() => {
                                                setPortalImage(stripeImage) // Passes the single string URL to the portal
                                                }} className="img-button"> 
                                                {/* Renders the first image from the array */}
                                                    <img src={stripeImage} alt={`${stickerName}-live-view`} /> 
                                            </button> 
                                        </div>
                                        {/* ... rest of your code remains the same */}

                                        <div className="sticker-info"> 
                                            <p className="text-medium">{stickerName.replaceAll('_', ' ')}</p> 
                      
                                            <p className="sticker-desc">{sticker.description || "An exclusive design custom-cut sticker."}</p>
                      
                                            <h5>${getStickerPrice(sticker)}</h5> 
                      
                                            <button onClick={() => {
    const stickerPriceId = sticker.default_price || sticker.prices?.[0]?.id || sticker.id;
    handleIncrementProduct(stickerPriceId, 1, sticker); // 🌟 Passes full sticker object
}}>Add to Cart</button>
                                        </div> 
                                    </div> 
                                ) 
                            })} 
                        </div> 
                    </div>
                </div>
            </div>
        </>   
    );
} // The component safely ends here now!
