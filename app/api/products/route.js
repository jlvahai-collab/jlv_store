import Stripe from "stripe";

const API_KEY = process.env.NEXT_STRIPE_SECRET_KEY;

// 🌟 FIX: Forcing an older, universally supported version overrides the dashboard lock
const stripe = new Stripe(API_KEY, {
    apiVersion: '2023-10-16' 
});

export const dynamic = 'force-dynamic'; 

export async function GET() {
    try {
        // 🌟 FIX 2: Correct auto-pagination syntax pattern using standard list methods
        const products = await stripe.products.list({ active: true, limit: 100 });
        const prices = await stripe.prices.list({ active: true, limit: 100 });

        // 🌟 FIX 3: Safe array iteration mapping
        const combinedData = products.data.map((product) => {
            const productPrices = prices.data.filter((price) => {
                return price.product === product.id;
            });

            return {
                ...product,
                prices: productPrices.map((price) => {
                    return {
                        id: price.id,
                        unit_amount: price.unit_amount,
                        currency: price.currency,
                        recurring: price.recurring
                    };
                })
            };
        });

        return Response.json(combinedData);

    } catch (err) {
        console.error('Error fetching data from stripe: ', err.message); 
        return Response.json({ error: 'Failed to fetch data from stripe' }, { status: 500 });
    }
}
