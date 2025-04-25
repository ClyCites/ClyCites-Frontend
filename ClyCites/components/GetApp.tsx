import React from 'react'
import Button from './Button'
import Image from 'next/image'

const GetApp = () => {
  return (
    <section className="flexCenter w-full flex-col pb-24 lg:pb-32 xl:pb-40">
      <div className="flex w-full flex-col xl:flex-row items-center gap-12 xl:gap-24">
        {/* Text Section */}
        <div className="z-20 flex flex-col items-start justify-center gap-8 xl:max-w-[50%]">
          <h2 className="font-bold text-3xl lg:text-5xl xl:text-6xl text-blue-500">
            Download the app
          </h2>
          <p className="text-gray-700 text-lg xl:text-xl">
            Discover the quality of your plants and soil from the palm of your hand.
          </p>
          <div className="flex flex-col gap-4 xl:flex-row xl:gap-6">
            <Button 
              type="button"
              title="App Store"
              icon="/apple.svg"
              variant="btn_white"
              full
            />
            <Button 
              type="button"
              title="Google Play"
              icon="/android.svg"
              variant="btn_dark_green_outline"
              full
            />
          </div>
        </div>

        {/* Image Section */}
        <div className="flex flex-1 justify-center items-center xl:justify-end">
          <Image 
            src="/phones.png" 
            alt="Mobile phones showcasing the app" 
            width={550} 
            height={870} 
            className="object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default GetApp
