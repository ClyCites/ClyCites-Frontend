import Image from 'next/image'
import React from 'react'

const Guide = () => {
  return (
    <section className="flexCenter flex-col bg-gray-100">
       <h1 className="lg:text-3xl bold text-center justify-center font-semibold text-gray-600">Closing the air quality data gaps in Africa</h1>
       <h1 className="mt-10 text-center justify-center font-semibold text-gray-600">We provide accurate, hyperlocal, and timely air quality data to provide evidence of the magnitude and scale of air pollution across Africa.</h1>
      <div className="padding-container max-container w-full pb-24">
        <Image src="/camp.svg" alt="camp" width={50} height={50} />
        <p className="uppercase regular-18 -mt-1 mb-3 text-green-50">
          We are here for you
        </p>
        <div className="flex flex-wrap justify-between gap-5 lg:gap-10">
          <h2 className="bold-40 lg:bold-64 xl:max-w-[390px]">Guide You to Easy Path</h2>
          <p className="regular-16 text-gray-30 xl:max-w-[520px]">Only with the hilink application you will no longer get lost and get lost again, because we already support offline maps when there is no internet connection in the field. Invite your friends, relatives and friends to have fun in the wilderness through the valley and reach the top of the mountain</p>
        </div>
      </div>

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