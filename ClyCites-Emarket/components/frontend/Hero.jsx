"use client"

import React from 'react'
import Link from "next/link";
import Image from 'next/image';
import HeroCarousel from "./HeroCarousel"

export default function Hero() {
    const categories = [
        {},{},{}
    ]
  return (
    <div className='flex gap-8'>
        <div className="w-1/3 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 text-slate-800 overflow-hidden">
        <h2 className="bg-slate-100 dark:bg-slate-700 py-3 px-6 font-semibold border-b border-gray-300 text-slate-800 dark:text-slate-100 ">Shop By Category</h2>
        <div className="py-3 px-6 h-[300px] overflow-y-auto flex flex-col gap-2">
            
        {
            categories.map((category,i) => {
                return (
                <Link key={i} href="#" className="flex items-center gap-3 hover:bg-slate-50 duration-300 transition-all dark:text-slate-300 dark:hover:bg-slate-600 rounded-md">
                    <Image src="/images/logo.jpeg" alt="Fruits" width={556} height={556} className="w-12 h-12 rounded-full object-cover border border-lime-300"/>
                    <span className='text-sm'>Vegetables</span>
                </Link>
                )
            })
        }

        </div>
        </div>
        <div className="w-2/3 bg-blue-600 rounded-md">
        <HeroCarousel/>
        </div>
    </div>
  )
}