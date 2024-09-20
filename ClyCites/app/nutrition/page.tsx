import Image from 'next/image'
import Button from '../../components/Button'
import Nutrition from '@/components/Nutrition'
import NutritionBelow from '@/components/NutritionBelow'

const DiseasePage = () => {
  return (
      // <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
      <>
      <div className="max-container  -my-4 bg-gray-100 bg-[url('/images/agri.jpg')] bg-cover bg-center bg-no-repeat text-white p-8 rounded-lg">
              <div className="container mx-auto">
                  <div className="flex flex-wrap text-center justify-center al -mx-6 gap-2 lg:gap-6">

                    <h3 className=" mb-2 mt-20 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-4xl">
                    Crop Nutrition Monitoring
                    </h3>
                  </div>
                  <p className="text-center justify-center text-white sm:text-2xl lg:text-xl xl:text-4xl">Ensure soil supports growth</p>
              </div>
        </div>
        <Nutrition/>
        <div className="w-full border-t border-black mb-10" />
        <NutritionBelow />
        {/* <AboutHome />
<div className="w-full border-t border-black mb-10" />
<AboutSection />
<div className="w-full border-t border-black mb-10" />
<AboutMission /> */}
</>

  )
}

export default DiseasePage