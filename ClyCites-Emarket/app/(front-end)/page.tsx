import React from 'react'
import Link from "next/link";
import Hero from "@/components/frontend/Hero"

export default function page() {
  return (
    <div className='min-h-screen '>

     <Hero/>
      <h2 className='text-4xl'>Welcome to Online Store</h2>

      <Link className="my-4 underline " href="/register-farmer">Become a farmer / Vendor / Supplier</Link>
    </div>
  )
}
