import React from "react";
import Navbar from '@/components/frontend/Navbar'


export default function Layout({children}) {
    return (
        <div>
        <Navbar/>
        <div className="max-w-7xl mx-auto py-6">

        {children}
        </div>

        </div>
    )
}