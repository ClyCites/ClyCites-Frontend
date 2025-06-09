import Image from "next/image"

export default function MarketHeader({ market }) {
  return (
    <div className="bg-gradient-to-r from-green-600 to-lime-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center space-x-6">
          <Image
            src={market.logoUrl || "/placeholder.svg?height=80&width=80"}
            alt={market.title}
            width={80}
            height={80}
            className="rounded-full bg-white p-2"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{market.title}</h1>
            <p className="text-green-100 max-w-2xl">{market.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
