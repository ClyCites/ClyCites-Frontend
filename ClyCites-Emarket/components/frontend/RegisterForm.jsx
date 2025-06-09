"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import SubmitButton from "../FormInputs/SubmitButton"
import TextInput from "../FormInputs/TextInput"

export default function RegisterForm({ role = "USER", selectedPackage = "free" }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [emailErr, setEmailErr] = useState("")

  async function onSubmit(data) {
    try {
      console.log(data)
      setLoading(true)

      // Add selected package to user data
      data.selectedPackage = selectedPackage

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (response.ok) {
        console.log(responseData)
        setLoading(false)
        toast.success("Account Created Successfully!")
        reset()

        if (role === "USER") {
          router.push("/")
        } else {
          // Redirect to subscription confirmation page
          router.push(`/farmer-onboarding/${responseData.data.id}?package=${selectedPackage}`)
        }
      } else {
        setLoading(false)
        if (response.status === 409) {
          setEmailErr("User with this Email already exists")
          toast.error("User with this Email already exists")
        } else {
          console.error("Server Error:", responseData.message)
          toast.error("Oops Something Went wrong")
        }
      }
    } catch (error) {
      setLoading(false)
      console.error("Network Error:", error)
      toast.error("Something Went wrong, Please Try Again")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("role")} value={role} />
      <input type="hidden" {...register("selectedPackage")} value={selectedPackage} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput label="Full Name" name="name" register={register} errors={errors} type="text" className="w-full" />

        <TextInput
          label="Email Address"
          name="email"
          register={register}
          errors={errors}
          type="email"
          className="w-full"
        />
      </div>

      {emailErr && <small className="text-red-600 -mt-2 mb-2">{emailErr}</small>}

      <TextInput label="Password" name="password" register={register} errors={errors} type="password" />

      {role === "FARMER" && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Package Benefits:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            {selectedPackage === "free" && (
              <>
                <li>• List up to 10 products</li>
                <li>• Basic analytics dashboard</li>
                <li>• Email support</li>
                <li>• 5% transaction fee</li>
              </>
            )}
            {selectedPackage === "basic" && (
              <>
                <li>• List up to 100 products</li>
                <li>• Advanced analytics</li>
                <li>• Priority chat support</li>
                <li>• 3% transaction fee</li>
                <li>• Marketing tools</li>
              </>
            )}
            {selectedPackage === "pro" && (
              <>
                <li>• List up to 500 products</li>
                <li>• Professional analytics</li>
                <li>• 24/7 phone support</li>
                <li>• 2% transaction fee</li>
                <li>• Advanced marketing suite</li>
                <li>• API access</li>
              </>
            )}
            {selectedPackage === "enterprise" && (
              <>
                <li>• Unlimited products</li>
                <li>• Custom analytics dashboard</li>
                <li>• Dedicated support team</li>
                <li>• 1% transaction fee</li>
                <li>• White-label solution</li>
                <li>• Custom integrations</li>
              </>
            )}
          </ul>
        </div>
      )}

      <SubmitButton
        isLoading={loading}
        buttonTitle={role === "FARMER" ? "Start Farming Journey" : "Create Account"}
        loadingButtonTitle="Creating Account..."
      />

      <div className="flex items-center">
        <div className="w-full bg-gray-300 h-[1px]"></div>
        <span className="mx-4 text-gray-500">or</span>
        <div className="w-full bg-gray-300 h-[1px]"></div>
      </div>

      <p className="text-sm text-gray-600 text-center">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-green-600 hover:text-green-500 hover:underline">
          Sign In
        </Link>
      </p>

      {role === "FARMER" && (
        <p className="text-xs text-gray-500 text-center">
          By registering, you agree to our{" "}
          <Link href="/terms-conditions" className="text-green-600 hover:underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-green-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      )}
    </form>
  )
}
