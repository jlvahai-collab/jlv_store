'use client';

import { useState } from "react";
import Portal from "./Portal";
import { useProducts } from "@/context/ProductContext";

export default function Products(props) {
    const planner = props.planner;
    const stickers = props.stickers || []; 

    const [portalImage, setPortalImage] = useState(null);
    const { handleIncrementProduct } = useProducts();

    // Safe pricing look-up helpers
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

    // Safely calculate the image source
    const plannerImageUrl = planner && planner.images && planner.images.length > 0 
        ? planner.images[0] 
        : "/low_res/planner.jpeg";

    // Render loading state if data hasn't arrived yet
    if (!stickers.length && !planner) { 
        return (
            <div className="section-container" style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading store items from Stripe...</p>
            </div>
        ); 
    }

    return (    
        <>
            {portalImage && (
                <Portal handleClosePortal={() => { setPortalImage(null) }}>
                    <div className="portal-content">
                        <img className="img-display" src={portalImage} alt="Stripe-High-Res-Zoom" />
                    </div>
                </Portal>
            )}
            
            {/* --- SECTION 1: PLANNER SHOWCASE --- */}
            <div className="section-container">
                <div className="section-header">
                    <h2>Shop our Products & Services</h2>
                    <p>Books, Stickers, and More!</p>
                </div>
            
                <div className="planner-container">
                    <div>
                        <button onClick={() => setPortalImage(plannerImageUrl)} className="img-button">
                            <img src={plannerImageUrl} alt="Medieval Dragon Month Planner View" />
                        </button>
                    </div>
                    
                    <div className="planner-info">
                        <p className="text-large planner-header">
                            {planner ? planner.name : "Medieval Dragon Month Planner"}
                        </p>
                        <h3><span>$</span>{getPlannerPrice(planner)}</h3>
                        <p>Stay organized and on top of your schedule with our 2024 planner. Featuring monthly and weekly layouts, goal-setting pages, and inspirational quotes, it's the perfect companion for a productive year ahead!</p>
                        <button className="button-card">Shop Now</button>

                        <ul>
                            <li>Monthly and weekly layouts for easy scheduling</li>
                            <li>Goal-setting pages to help you achieve your dreams</li>
                            <li>Inspirational quotes to keep you motivated</li>
                            <li>Durable cover and high-quality paper for long-lasting use</li> 
                            <li>
                                <strong>Bonus:</strong> Each planner comes with a set of exclusive stickers to add some fun and personality to your planning!
                            </li> 
                        </ul>
                    </div>
                </div>

                <div className="purchase-btns">
                    <button onClick={() => {
                        const plannerPriceId = planner?.prices?.[0]?.id || planner?.default_price;
                        handleIncrementProduct(plannerPriceId, 1, planner);
                    }}>Add to Cart</button>
                </div>                    
            </div>

            {/* --- SECTION 2: SERVICES & STICKERS GRID --- */}
            <div className="section-container">
                <div className="section-header">
                    <h2>Services & Products</h2>
                    <p>Projects, developments, services and products that I have created!</p>
                </div>
                <div className="sticker-wrapper"> 
                    <div className="sticker-container"> 
                        {stickers.map((sticker, stickerIndex) => { 
                            const stickerName = sticker.name || "Custom Sticker";
                            const stripeImage = sticker.images && sticker.images.length > 0 
                                ? sticker.images[0] 
                                : "/low_res/placeholder.jpeg"; 

                            return (
                                <div key={stickerIndex} className="product-wrapper">
                                    <div className="sticker-card"> 
                                        <button onClick={() => setPortalImage(stripeImage)} className="img-button"> 
                                            <img src={stripeImage} alt={`${stickerName}-live-view`} /> 
                                        </button> 
                                    </div>

                                    <div className="sticker-info"> 
                                        <p className="text-medium">{stickerName.replaceAll('_', ' ')}</p> 
                                        <p className="sticker-desc">{sticker.description || "An exclusive design custom-cut sticker."}</p>
                                        <h5>${getStickerPrice(sticker)}</h5> 
                                        
                                        <button onClick={() => {
                                            const stickerPriceId = sticker?.prices?.[0]?.id || sticker?.default_price || sticker?.id;
                                            handleIncrementProduct(stickerPriceId, 1, sticker);
                                        }}>Add to Cart</button>
                                    </div> 
                                </div> 
                            );
                        })} 
                    </div> 
                </div>
            </div>
        </>   
    );
}
