import ImageBanner from "@/components/ImageBanner";
import Products from "@/components/Products";

export async function getProducts() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';
  
  try {
    // 🚀 FIXED: Using relative routing if baseURL fails prevents build timeouts
    const fetchURL = baseURL ? `${baseURL}/api/products` : '/api/products';
    
    const response = await fetch(fetchURL, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Stripe API returned status code: ${response.status}`);
    }
    
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Failed to collect backend data array:", error.message);
    return []; // Return empty array fallback to prevent the page crashing completely
  }
}

export default async function Home() {
  const products = await getProducts();
  
  let planner = null;
  let stickers = [];

  if (Array.isArray(products)) {
    for (let product of products) {
      // SAFETY CHECK: Skip products with no valid name or empty prices
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




































