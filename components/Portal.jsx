import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Portal({ handleClosePortal, children }) {
    // 1. Create a state placeholder for your DOM element
    const [portalTarget, setPortalTarget] = useState(null);

    // 2. Set the target safely only once the component mounts in the browser
    useEffect(() => {
        setPortalTarget(document.getElementById('portal'));
    }, []);

    // 3. Fallback safely if the DOM node isn't found yet
    if (!portalTarget) return null;

    // 4. Safely render into your confirmed element target
    return ReactDOM.createPortal(    
        <div className='portal-container'>
            <div onClick={handleClosePortal} className='portal-underlay' />
            {children}
        </div>,
        portalTarget           
    );
}
