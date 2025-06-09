import { getData } from "@/lib/getData"
import ProductDetails from "@/components/frontend/ProductDetails"
import RelatedProducts from "@/components/frontend/RelatedProducts"
import ProductReviews from "@/components/frontend/ProductReviews"
import Breadcrumb from "@/components/frontend/Breadcrumb"

export default async function ProductDetailPage({ params }) {
  const products = (await getData("products")) || []
  const product = products.find((p) => p.slug === params.slug)

  if (!product) {
    return <div>Product not found</div>
  }

  const relatedProducts = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.title, href: `/products/${product.slug}` },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />

        <ProductDetails product={product} />
        <ProductReviews productId={product.id} />
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  )
}
