"use client"
import { useState, useEffect } from "react"
import { Plus, Search, Grid, List, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/components/farmer/ProductCard"
import ProductTable from "@/components/farmer/ProductTable"
import ProductFilters from "@/components/farmer/ProductFilters"
import DeleteConfirmDialog from "@/components/farmer/DeleteConfirmDialog"
import { useToast } from "@/hooks/use-toast"

export default function FarmerProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid") // grid or table
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [deleteProduct, setDeleteProduct] = useState(null)
  const { toast } = useToast()

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data || [])
      setFilteredProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter and search products
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.categoryId === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case "price-high":
        filtered.sort((a, b) => (b.salePrice || 0) - (a.salePrice || 0))
        break
      case "price-low":
        filtered.sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0))
        break
      case "name":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId))
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
    setDeleteProduct(null)
  }

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      })

      if (response.ok) {
        setProducts(products.map((p) => (p.id === productId ? { ...p, isActive: !currentStatus } : p)))
        toast({
          title: "Success",
          description: `Product ${!currentStatus ? "activated" : "deactivated"} successfully`,
        })
      }
    } catch (error) {
      console.error("Error updating product status:", error)
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Products</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product inventory ({filteredProducts.length} products)
          </p>
        </div>
        <Link href="/farmer-dashboard/products/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <ProductFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Start by adding your first product"}
            </p>
            <Link href="/farmer-dashboard/products/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={() => setDeleteProduct(product)}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <ProductTable products={filteredProducts} onDelete={setDeleteProduct} onToggleStatus={handleToggleStatus} />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={() => handleDeleteProduct(deleteProduct?.id)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteProduct?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
