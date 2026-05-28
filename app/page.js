import ImageBanner from "@/components/ImageBanner";
import Products from "@/components/Products";
import Stripe from "stripe";

// Force this page to render dynamically so it fetches fresh Stripe data on load
export const dynamic = 'force-dynamic';

async function getProducts() {
  const API_KEY = process.env.NEXT_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  
  // Safety check to prevent crashing if keys are not loaded yet
  if (!API_KEY) {
    console.error("Stripe Secret Key is missing in environment variables!");
    return [];
  }

  const stripe = new Stripe(API_KEY, {
    apiVersion: '2023-10-16' 
  });

  try {
    // 🚀 Fetch directly from Stripe's SDK, bypassing the local network request completely
    const products = await stripe.products.list({ active: true, limit: 100 });
    const prices = await stripe.prices.list({ active: true, limit: 100 });

    // Map your prices to your products exactly like your route did
    return products.data.map((product) => {
      const productPrices = prices.data.filter((price) => price.product === product.id);
      return {
        ...product,
        prices: productPrices.map((price) => ({
          id: price.id,
          unit_amount: price.unit_amount,
          currency: price.currency,
          recurring: price.recurring
        }))
      };
    });
  } catch (error) {
    console.error("Stripe SDK data collection error:", error.message);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  
  let planner = null;
  let stickers = [];

  if (Array.isArray(products)) {
    for (let product of products) {
      if (!product.name || !product.prices || product.prices.length === 0) {
        continue; 
      }

      if (product.name.toLowerCase().includes('planner')) {
        planner = product;
        continue; 
      }
      
      stickers.push(product);
    }
  }

  return (
    <>
      <ImageBanner />
      <section>
        <Products planner={planner} stickers={stickers} />
      </section>    
    </>
  );
}
