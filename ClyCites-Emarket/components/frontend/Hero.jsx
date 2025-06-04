"use client"

import React from 'react'
import Link from "next/link";
import Image from 'next/image';
import HeroCarousel from "./HeroCarousel"
import { HelpCircle, FolderSync, CircleDollarSign } from "lucide-react";
import advert from '../../public/images/adv.gif'

export default function Hero() {
    const categories = [
        {},{},{}
    ]
  return (
    <div className='grid grid-cols-12 gap-8 mb-6 '>
        <div className="sm:col-span-4 sm:block bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 text-slate-800 overflow-hidden hidden">
        <h2 className="bg-slate-100 dark:bg-slate-700 py-3 px-6 font-semibold border-b border-gray-300 text-slate-800 dark:text-slate-100 ">Shop By Category</h2>
        <div className="py-3 px-6 h-[300px] overflow-y-auto flex flex-col gap-2">
            
        {
            categories.map((category,i) => {
                return (
                <Link key={i} href="#" className="flex items-center gap-3 hover:bg-slate-50 duration-300 transition-all dark:text-slate-300 dark:hover:bg-slate-600 rounded-md">
                    <Image src="/images/logo.jpeg" alt="Fruits" width={556} height={556} className="w-10 h-10 rounded-full object-cover border border-lime-300"/>
                    <span className='text-sm'>Vegetables</span>
                </Link>
                )
            })
        }

        </div>
        </div>
        <div className="col-span-full sm:col-span-6 rounded-md">
        <HeroCarousel/>
        </div>
        <div className="col-span-2 hidden sm:block rounded-md bg-white p-3 dark:bg-slate-800 rounded-lg">
        <Link href="" className='flex items-center space-x-1 mb-4'>
         <HelpCircle className='shrink-0 w-5 h-5 text-lime-500'/>
         <div className='flex flex-col gap-2'>
            <h2 className="uppercase text-sm"> Help Center</h2>
            <p className='text-[0.6rem]'>Guide to Customer Care</p>
         </div>
        </Link>

        <Link href="" className='flex items-center space-x-1 mb-4'>
         <FolderSync className='shrink-0 w-5 h-5 text-lime-500'/>
         <div className='flex flex-col gap-2'>
            <h2 className="uppercase text-sm"> Easy Return</h2>
            <p className='text-[0.6rem]'>Quick Return</p>
         </div>
        </Link>

        <Link href="/register-farmer" className='flex items-center space-x-1 mb-6'>
         <CircleDollarSign className='shrink-0 w-5 h-5 text-lime-500'/>
         <div className='flex flex-col gap-2'>
            <h2 className="uppercase text-sm">Sell On ClyCites</h2>
            <p className='text-[0.6rem]'>Million of Vistors</p>
         </div>
        </Link>
        <Image src={advert} alt="Clycites" className="w-full rounded-lg" />
        </div>
    </div>
  )
}