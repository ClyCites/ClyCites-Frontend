import Navbar from "@/components/frontend/Navbar"
import Footer from "@/components/frontend/Footer"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  )
}
