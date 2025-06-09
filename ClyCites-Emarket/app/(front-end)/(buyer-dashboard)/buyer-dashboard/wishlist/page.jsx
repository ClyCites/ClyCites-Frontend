import { getData } from "@/lib/getData"
import WishlistGrid from "@/components/buyer/WishlistGrid"

export default async function BuyerWishlistPage() {
  const products = (await getData("products")) || []

  // In a real app, filter by user's wishlist
  const wishlistProducts = products.slice(0, 12)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <p className="text-gray-600 dark:text-gray-400">{wishlistProducts.length} items saved</p>
      </div>

      <WishlistGrid products={wishlistProducts} />
    </div>
  )
}
