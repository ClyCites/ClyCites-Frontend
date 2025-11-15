"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Brand } from "@/types/brand"

type ApiResponse = {
  data: Brand[]
  success: boolean
  message?: string
}

const fetchBrands = async (): Promise<Brand[]> => {
  try {
    // TODO: Replace with your actual API endpoint
    // const response = await fetch('/api/brands')
    // const data: ApiResponse = await response.json()
    // if (!data.success) throw new Error(data.message || 'Failed to fetch brands')
    // return data.data || []
    
    // For now, return an empty array
    return []
  } catch (error) {
    console.error('Error fetching brands:', error)
    // Return an empty array in case of error
    return []
  }
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBrands = async () => {
      try {
        setIsLoading(true)
        const data = await fetchBrands()
        setBrands(data)
      } catch (err) {
        console.error('Failed to load brands:', err)
        setError('Failed to load partner information')
      } finally {
        setIsLoading(false)
      }
    }

    loadBrands()
  }, [])

  if (isLoading) {
    return (
      <section className="pt-5 bg-gray-100">
        <div className="container">
          <h1 className="bold text-center justify-center font-semibold text-gray-600">
            CLCITES IS SUPPORTED BY
          </h1>
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-gray-500">Loading partners...</div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="pt-5 bg-gray-100">
        <div className="container">
          <h1 className="bold text-center justify-center font-semibold text-gray-600">
            CLCITES IS SUPPORTED BY
          </h1>
          <div className="flex justify-center py-8">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </section>
    )
  }

  if (brands.length === 0) {
    // Don't show anything if there are no brands
    return null
  }

  return (
    <section className="pt-5 bg-gray-100">
      <div className="container">
        <h1 className="bold text-center justify-center font-semibold text-gray-600">
          CLCITES IS SUPPORTED BY
        </h1>
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp flex flex-wrap items-center justify-center rounded-md bg-dark py-4 px-8 dark:bg-primary dark:bg-opacity-5 sm:px-10 md:py-[10px] md:px-[50px] xl:p-[20px] 2xl:py-[40px] 2xl:px-[70px]"
              data-wow-delay=".1s"
            >
              {brands.map((brand) => (
                <SingleBrand key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Brands;

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { href, image, name } = brand;

  return (
    <div className="mx-3 flex w-full max-w-[200px] items-center justify-center sm:mx-4 lg:max-w-[130px] xl:mx-6 xl:max-w-[150px] 2xl:mx-8 2xl:max-w-[160px]">
      <a
        href={href}
        target="_blank"
        rel="nofollow noreferrer"
        className="relative flex h-14 w-28 opacity-70 grayscale hover:opacity-100 hover:scale-105 hover:grayscale-0 dark:opacity-60 dark:hover:opacity-100 transition-all duration-500"
      >
        <Image src={image} alt={name} className="w-20 h-10" width={20} height={20} />
        <span>{name}</span>
      </a>
    </div>
  );
};
