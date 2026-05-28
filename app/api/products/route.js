import Stripe from "stripe";

export const dynamic = 'force-dynamic'; 

export async function GET() {
    const API_KEY = process.env.STRIPE_SECRET_KEY || process.env.NEXT_STRIPE_SECRET_KEY;
    
    if (!API_KEY) {
        return Response.json({ error: 'Stripe credentials missing' }, { status: 500 });
    }

    const stripe = new Stripe(API_KEY, {
        apiVersion: '2023-10-16' 
    });

    try {
        const products = await stripe.products.list({ active: true, limit: 100 });
        const prices = await stripe.prices.list({ active: true, limit: 100 });

        const combinedData = products.data.map((product) => {
            const productPrices = prices.data.filter((price) => {
                const targetProductId = typeof price.product === 'object' ? price.product?.id : price.product;
                return targetProductId === product.id;
            });

            return {
                ...product,
                prices: productPrices.map((price) => ({
                    id: price.id,
                    unit_amount: price.unit_amount || 0,
                    currency: price.currency || 'usd'
                }))
            };
        });

        return Response.json(combinedData);
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
