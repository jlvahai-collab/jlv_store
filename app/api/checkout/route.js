import { NextResponse } from "next/server";
import Stripe from "stripe";

// 🚀 Force route to stay dynamic to prevent static generation errors during the build
export const dynamic = 'force-dynamic'; 

export async function POST(request) {
    // 🚀 FIXED: Read keys and initialize Stripe inside the runtime handler
    const API_KEY = process.env.NEXT_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    
    const stripe = new Stripe(API_KEY, {
        apiVersion: '2023-10-16' 
    });

    try {
        const { lineItems } = await request.json();
        console.log("Incoming Line Items Payload:", lineItems);

        if (!lineItems || lineItems.length === 0) {
            return NextResponse.json({ error: "No items in cart" }, { status: 400 });
        }

        // Expanded the limit configuration to 100 items so checkouts don't fail for items past the first 10
        const pricesList = await stripe.prices.list({ active: true, limit: 100 });
        const pricesData = pricesList.data || [];

        const billingIntervals = new Set();
        let hasOneTimeItem = false;

        lineItems.forEach(item => {
            const stripePriceInfo = pricesData.find(p => p.id === item.price);
            
            if (stripePriceInfo?.type === "recurring" && stripePriceInfo?.recurring?.interval) {
                billingIntervals.add(stripePriceInfo.recurring.interval);
            } else {
                hasOneTimeItem = true;
            }
        });

        if (billingIntervals.size > 0 && hasOneTimeItem) {
            return NextResponse.json({ 
                error: "Stripe cannot mix subscription services with one-time products in the same checkout." 
            }, { status: 400 });
        }

        if (billingIntervals.size > 1) {
            return NextResponse.json({ 
                error: "Stripe cannot checkout different billing intervals together." 
            }, { status: 400 });
        }

        const checkoutMode = billingIntervals.size > 0 ? "subscription" : "payment";

        const session = await stripe.checkout.sessions.create({
            mode: checkoutMode,
            line_items: lineItems,
            success_url: (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + '/success',
            cancel_url: (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + '/cart'
        });

        return NextResponse.json({ url: session.url });
        
    } catch (err) {
        console.error('Error creating cart checkout:', err.message);
        return NextResponse.json({ error: `Stripe Error: ${err.message}` }, { status: 500 });
    }
}
