import { Truck, Clock, MapPin, Shield, Package, CreditCard } from "lucide-react"

export default function DeliveryDetailsPage() {
  const deliveryZones = [
    { area: "Kampala Central", time: "Same Day", fee: "Free (orders > UGX 50,000)" },
    { area: "Kampala Suburbs", time: "Next Day", fee: "UGX 5,000" },
    { area: "Wakiso District", time: "1-2 Days", fee: "UGX 10,000" },
    { area: "Mukono District", time: "1-2 Days", fee: "UGX 10,000" },
    { area: "Entebbe", time: "1-2 Days", fee: "UGX 15,000" },
    { area: "Other Areas", time: "2-3 Days", fee: "Contact Support" },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Delivery <span className="text-orange-600">Information</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Fast, reliable delivery of fresh agricultural products straight from farms to your doorstep.
        </p>
      </section>

      {/* Delivery Process */}
      <section className="grid md:grid-cols-4 gap-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Placed</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Your order is confirmed and sent to the farmer</p>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quality Check</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Products are harvested and quality verified</p>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">In Transit</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Your order is on its way to your location</p>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivered</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Fresh products delivered to your doorstep</p>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Delivery Zones & Timing</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Delivery Area
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Delivery Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Delivery Fee
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {deliveryZones.map((zone, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{zone.area}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{zone.time}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{zone.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Delivery Policies */}
      <section className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Policies</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Delivery Windows</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Choose from morning (8AM-12PM) or afternoon (1PM-6PM) delivery slots
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Freshness Guarantee</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  All products are harvested within 24-48 hours before delivery
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Packaging</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Eco-friendly packaging to maintain freshness and reduce environmental impact
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Options</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Mobile Money</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Pay using MTN Mobile Money, Airtel Money, or other mobile payment services
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Card Payment</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Secure payment with Visa, Mastercard, or other major credit/debit cards
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Pay in cash when your order is delivered (available in select areas)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Instructions */}
      <section className="bg-orange-50 dark:bg-gray-800 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Special Instructions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Perishable Items</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Please be available during delivery window</li>
              <li>• Refrigerate dairy and meat products immediately</li>
              <li>• Store fruits and vegetables in cool, dry place</li>
              <li>• Contact us immediately if products don't meet expectations</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Instructions</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Provide clear delivery address and landmarks</li>
              <li>• Ensure someone is available to receive the order</li>
              <li>• Check products upon delivery</li>
              <li>• Keep your phone accessible for delivery updates</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
