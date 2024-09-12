import Image from 'next/image'
import Button from '../../components/Button'
import AboutSection from "@/components/About/AboutSection";

const AboutPage = () => {
  return (
      // <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
      <>
      <div className="max-container  -my-4 bg-gray-100">
              <div className="container mx-auto">
                  <div className="flex flex-wrap text-center justify-center al -mx-6 gap-2 lg:gap-6">

                    <h3 className=" mb-2 mt-20 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-4xl">
                       About Us
                    </h3>
                  </div>
                  <div className="flex justify-between items-center w-full mt-20">
                    <div className="flex space-x-10">
                      <p className="regular-14 text-gray-600 hover:text-blue-600 cursor-pointer">Our vision</p>
                      <p className="regular-14 text-gray-600 hover:text-blue-600 cursor-pointer">Our story</p>
                      <p className="regular-14 text-gray-600 hover:text-blue-600 cursor-pointer">Our mission</p>
                      <p className="regular-14 text-gray-600 hover:text-blue-600 cursor-pointer">Our values</p>
                      <p className="regular-14 text-gray-600 hover:text-blue-600 cursor-pointer">Our Team</p>
                    </div>
                    
                    </div>
              </div>
        </div>


 
<AboutSection />

</>

  )
}

export default AboutPage