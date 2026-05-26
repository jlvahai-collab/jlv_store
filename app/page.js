import ImageBanner from "@/components/ImageBanner";
import Products from "@/components/Products";

export async function getProducts() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL
  const response = await fetch(baseURL + '/api/products')
  const products = await response.json()
  return products
}

export default async function Home() {
  const products = await getProducts()
  
  let planner = null
  let stickers = []

  // Ensure products is a valid array before looping
  if (Array.isArray(products)) {
    for (let product of products) {
      // 🌟 FIX 1: Flexible, case-insensitive check for the word "planner"
      if (product.name.toLowerCase().includes('planner')) {
        planner = product;
        continue; // Prevents the planner from entering the stickers grid
      }
      
      // 🌟 FIX 2: Push all other products cleanly into this array
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
