import React from 'react'
import MarketsCarousel from "./MarketsCarousel"

export default function MarketList() {
  return (
    <div className='text-white py-16'>
      <div className="bg-slate-50 dark:bg-lime-900 rounded-lg p-4">
      <h2 className='py-2 text-center text-2xl text-slate-900 dark:text-slate-50'>Shop By Market</h2>
         <MarketsCarousel />
      </div>
    </div>
  )
}
