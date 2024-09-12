import Image from 'next/image'
import Button from '../Button'

const AboutHome = () => {
  return (
    
    <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
      

    <div className="hero-map" />

    <div className="relative z-20 flex flex-1 flex-col xl:w-1/2">
      
      <h1 className="bold-52 lg:bold-25">At AirQo we empower communities across Africa with accurate, hyperlocal, and timely air quality data to drive air pollution mitigation actions.</h1>
      
    </div>

    <div className="relative flex flex-1 items-start">
    <Image 
      src="/images/agri.jpg" 
      alt="logo" 
      className="absolute top-0 left-0 w-full h-full object-cover"
      width={100}
      height={100}
    />
    </div>
  </section>
  )
}

export default AboutHome