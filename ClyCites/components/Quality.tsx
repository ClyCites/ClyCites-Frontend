import Image from 'next/image'
import Button from './Button'

const Quality = () => {
  return (
    <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
      <div className="hero-map" />

      <div className="relative z-20 flex flex-1 flex-col xl:w-1/2">
      <button
            type="button"
            className="bg-blue-100 text-black font-bold py-2 px-4 rounded"
          >
            ClyCites Quality
          </button>
        
        <h1 className="bold-52 lg:bold-25">Agriculture in your community</h1>
        {/* <p className="regular-16 mt-6 text-blue-800 xl:max-w-[520px]">
        “9 out of 10 people breathe polluted air”
        </p> */}
        <p className="regular-16 mt-6 text-gray-30 xl:max-w-[520px]">
        We deploy a high-resolution air quality monitoring network in target urban areas across Africa to increase awareness and understanding of air quality management, provide actionable information and derive actions against air pollution
        </p>

        <div className="my-11 flex flex-wrap gap-5">
          <div className="flex items-center gap-2">
            {Array(5).fill(1).map((_, index) => (
              <Image 
                src="/star.svg"
                key={index}
                alt="star"
                width={24}
                height={24}
              />
            ))}
          </div>

          <p className="bold-16 lg:bold-20 text-blue-70">
            198k
            <span className="regular-16 lg:regular-20 ml-1">Excellent Reviews</span>
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 sm:flex-row">
        <button
            type="button"
            className="text-blue-500 font-bold py-2 px-4 rounded"
          >
            Learn more
            <img src="/user.svg" alt="icon" className="inline-block w-4 h-4 ml-2" />
          </button>
          {/* <button
            type="button"
            className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Explore Data
            <img src="/user.svg" alt="icon" className="inline-block w-4 h-4 ml-2" />
          </button> */}

          {/* <Button 
            type="button" 
            title="Download App" 
            variant="btn_green" 
          />
          <Button 
            type="button" 
            title="How we work?" 
            icon="/play.svg"
            variant="btn_white_text" 
          /> */}
        </div>
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

export default Quality