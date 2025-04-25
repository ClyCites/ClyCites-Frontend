import React from "react";
import Navbar from '@/components/frontend/Navbar'


export default function Layout({children}) {
    return (
        <div>
        <Navbar/>
        {children}

        </div>
    )
}