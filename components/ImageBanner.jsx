'use client';

import { useState, useRef, useEffect } from 'react';

export default function ImageBanner() {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        if (imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, []);


    return (    
        <div className="banner-images">
            <img className="low-res-img" src="low_res/banner.jpeg" 
            alt="banner-low-res" />
            <img ref={imgRef} className="high-res-img" src="med_res/banner.png" 
            alt="banner-high-res" style={{ opacity: isLoaded ? 1 : 0 }} onLoad={() => { setIsLoaded(true) }}/> 
            <div className="cta-btns-container">
                <div>
                    <div>
                        <h1>Welcome to JLV Store!</h1>
                        <p>Discover our exclusive collection of products. Shop now and experience the best in quality and style!</p>
                    </div>
                    <div>
                        <button>Shop Products</button>
                        <button>Shop Services</button>
                    </div>
                </div>

            </div>
        </div>
               
            
    );
}     