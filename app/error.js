'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("⚠️ Application Error caught:", error);
  }, [error]);

  return (
    <div className="page-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Something went wrong!</h2>
      <p style={{ color: '#999', marginBottom: '20px' }}>{error?.message || "An unexpected error occurred."}</p>
      
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button className="button-card" onClick={() => reset()}>
          Try Again
        </button>
        <Link href="/" className="unstyled-button" style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px' }}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
