import ProfileForm from "@/components/buyer/ProfileForm"
import AddressBook from "@/components/buyer/AddressBook"
import SecuritySettings from "@/components/buyer/SecuritySettings"

export default async function BuyerProfilePage() {
  // In a real app, get current user data
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+256 700 000 000",
    avatar: "/placeholder.svg?height=100&width=100",
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileForm userData={userData} />
          <SecuritySettings />
        </div>
        <div>
          <AddressBook />
        </div>
      </div>
    </div>
  )
}
