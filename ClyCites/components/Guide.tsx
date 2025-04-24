import Image from 'next/image'
import React from 'react'

const Guide = () => {
  return (
    <section className="flexCenter flex-col bg-gray-100 py-12 lg:py-16">
      {/* Main Title */}
      <h1 className="text-2xl lg:text-3xl font-semibold text-center text-gray-600">
        Closing the air quality data gaps in Africa
      </h1>
      
      {/* Sub Title */}
      <h2 className="mt-8 text-lg lg:text-xl text-center text-gray-600 max-w-3xl mx-auto">
        We provide accurate, hyperlocal, and timely air quality data to provide evidence of the magnitude and scale of air pollution across Africa.
      </h2>

      {/* Image and Section */}
      <div className="max-container w-full pb-16 lg:pb-24">
        <div className="flex flex-col items-center text-center">
          <Image 
            src="/camp.svg" 
            alt="camp" 
            width={50} 
            height={50} 
            className="mb-3" 
          />
          <p className="uppercase text-green-500 text-lg font-semibold mb-3">We are here for you</p>
        </div>
        
        {/* Content */}
        <div className="flex flex-col gap-6 lg:gap-10 lg:flex-row justify-between items-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-700 max-w-[390px] text-center">
            Guide You to Easy Path
          </h2>
          
          <p className="text-base lg:text-lg text-gray-600 xl:max-w-[520px] text-center lg:text-left">
            Only with the hilink application you will no longer get lost and get lost again, because we already support offline maps when there is no internet connection in the field. Invite your friends, relatives and friends to have fun in the wilderness through the valley and reach the top of the mountain.
          </p>
        </div>
      </div>

      {/* Optional Boat Image Section (Uncommented for optional use) */}
      {/* <div className="flexCenter max-container relative w-full">
        <Image 
          src="/boat.png"
          alt="boat"
          width={1440}
          height={580}
          className="w-full object-cover object-center 2xl:rounded-5xl"
        />
      </div> */}
    </section>
  )
}

export default Guide
