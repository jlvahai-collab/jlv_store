'use client';

import { useState } from 'react';

export default function EmailInput() {
  const [email, setEmail] = useState('');

  // 🌟 FIX 1: Keep only the complete async submission logic block
  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return; // Prevent submitting empty inputs

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        alert("Thank you for subscribing!");
        setEmail(''); // Clear input out upon success
      } else {
        alert("Subscription failed. Please try again.");
      }
    } catch (error) {
      console.error('Subscription network error:', error.message);
    }
  } 

  return (
    /* 🌟 FIX 2: Wrapped in a form component to support standard submit layouts */
    <form onSubmit={handleSubmit} className="sign-up">
        <input 
          type="email" // Explicitly declare the text parsing type for security
          required
          placeholder="Email address..." 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Changed to type="submit" so the form captures enter/return actions natively */}
        <button type="submit" className="button-card">
          Subscribe
        </button>    
    </form>          
  );
}
