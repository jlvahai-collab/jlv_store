import ImageBanner from "@/components/ImageBanner";
import Products from "@/components/Products";

export async function getProducts() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  
  // 🌟 FIX: Add cache: 'no-store' to force Next.js to make a live request every time
  const response = await fetch(baseURL + '/api/products', { cache: 'no-store' });
  const products = await response.json();
  return products;
}




export default async function Home() {
  const products = await getProducts()
  
  let planner = null
  let stickers = []

  // Inside your page.js Home() component:

if (Array.isArray(products)) {
  for (let product of products) {
    // 🌟 SAFETY CHECK: Skip products with no valid name or empty prices
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
