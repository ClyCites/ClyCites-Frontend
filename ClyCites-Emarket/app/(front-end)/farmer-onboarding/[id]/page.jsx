import SubscriptionConfirmation from "@/components/frontend/SubscriptionConfirmation"

export default function FarmerOnboardingPage({ params, searchParams }) {
  const { id } = params
  const selectedPackage = searchParams?.package || "free"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-lime-50">
      <SubscriptionConfirmation userId={id} selectedPackage={selectedPackage} />
    </div>
  )
}
