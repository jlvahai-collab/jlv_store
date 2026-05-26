import { NextResponse } from "next/server";
import Stripe from "stripe";

// 🌟 FIX: Use your private backend secret key variable instead of NEXT_PUBLIC_
const API_KEY = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY;
const stripe = new Stripe(API_KEY, {
    apiVersion: '2023-10-16'
});

export async function POST(request) {
    try {
        const { lineItems } = await request.json();
        console.log("Incoming Line Items Payload:", lineItems);

        if (!lineItems || lineItems.length === 0) {
            return NextResponse.json({ error: "No items in cart" }, { status: 400 });
        }

        // 🔍 Retrieve full prices from Stripe to dynamically inspect their intervals
        const pricesList = await stripe.prices.list({ active: true });

        // Collect unique billing intervals present in this cart order
        const billingIntervals = new Set();
        let hasOneTimeItem = false;

        lineItems.forEach(item => {
            const stripePriceInfo = pricesList.data.find(p => p.id === item.price);
            
            if (stripePriceInfo?.type === "recurring" && stripePriceInfo?.recurring?.interval) {
                billingIntervals.add(stripePriceInfo.recurring.interval);
            } else {
                hasOneTimeItem = true;
            }
        });

        // 🚨 CRITICAL CHECK: Stop the checkout if mixing subscriptions with one-time items
        if (billingIntervals.size > 0 && hasOneTimeItem) {
            return NextResponse.json({ 
                error: "Stripe cannot mix subscription services with one-time products in the same checkout." 
            }, { status: 400 });
        }

        // 🚨 CRITICAL CHECK: Stop the checkout if mixing different subscription lengths
        if (billingIntervals.size > 1) {
            return NextResponse.json({ 
                error: "Stripe cannot checkout different billing intervals together." 
            }, { status: 400 });
        }

        // Dynamically swap modes based on the validated cart contents
        const checkoutMode = billingIntervals.size > 0 ? "subscription" : "payment";

        const session = await stripe.checkout.sessions.create({
            mode: checkoutMode,
            line_items: lineItems,
            success_url: (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + '/success',
            cancel_url: (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + '/cart'
        });

        // 🌟 Return using NextResponse utility to guarantee valid JSON formatting
        return NextResponse.json({ url: session.url });
        
    } catch (err) {
        console.error('Error creating cart checkout:', err.message);
        return NextResponse.json({ error: `Stripe Error: ${err.message}` }, { status: 500 });
    }
}
