import ImageBanner from "@/components/ImageBanner";
import Products from "@/components/Products";
import Stripe from "stripe";

// Force Next.js to render dynamically so it fetches fresh data from Stripe on every request
export const dynamic = 'force-dynamic';

async function getProducts() {
  const API_KEY = process.env.NEXT_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  
  if (!API_KEY) {
    console.error("Stripe Secret Key is missing in AWS environment variables!");
    return [];
  }

  const stripe = new Stripe(API_KEY, {
    apiVersion: '2023-10-16' 
  });

  try {
    // 🚀 Fetch directly from the Stripe SDK, skipping any local 404 network routes
    const productsList = await stripe.products.list({ active: true, limit: 100 });
    const pricesList = await stripe.prices.list({ active: true, limit: 100 });

    const productsData = productsList.data || [];
    const pricesData = pricesList.data || [];

    // 🚀 FIXED MAPPING: Correctly matching the product id to the price object reference
    return productsData.map((product) => {
      const productPrices = pricesData.filter((price) => {
        // Stripe prices link to products via an ID string (e.g., price.product === 'prod_XYZ')
        const targetProductId = typeof price.product === 'object' ? price.product?.id : price.product;
        return targetProductId === product.id;
      });

      return {
        ...product,
        // Ensure default_price fallback context passes if productPrices array is empty
        prices: productPrices.length > 0 ? productPrices.map((price) => ({
          id: price.id,
          unit_amount: price.unit_amount,
          currency: price.currency,
          recurring: price.recurring
        })) : [{ id: product.default_price, unit_amount: 0, currency: 'usd' }]
      };
    });
  } catch (error) {
    console.error("Stripe SDK extraction error inside page.js:", error.message);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  
  let planner = null;
  let stickers = [];

  if (Array.isArray(products)) {
    for (let product of products) {
      // Clean safety check validation
      if (!product.name) continue; 

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
