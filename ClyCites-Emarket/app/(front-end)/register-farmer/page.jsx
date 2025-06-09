import RegisterForm from "@/components/frontend/RegisterForm"
import PackageSelector from "@/components/frontend/PackageSelector"

export default function page({ searchParams }) {
  const selectedPackage = searchParams?.package || "free"

  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-lime-50 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-600"
        >
          <img
            className="w-10 h-10 mr-3"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          ClyCites Farm
        </a>

        <div className="w-full max-w-4xl">
          {/* Package Selection */}
          <PackageSelector selectedPackage={selectedPackage} />

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 mt-8">
            <div className="p-8 space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Your Farming Journey</h1>
                <p className="text-gray-600">Join thousands of farmers already selling on ClyCites</p>
              </div>

              <RegisterForm role="FARMER" selectedPackage={selectedPackage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
