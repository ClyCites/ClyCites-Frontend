import { Bell } from "lucide-react"
import ThemeSwitcherBtn from "../ThemeSwitcherBtn"

export default function FarmerNavbar() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-30 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Farmer Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                5
              </span>
            </button>
          </div>

          <ThemeSwitcherBtn />

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
