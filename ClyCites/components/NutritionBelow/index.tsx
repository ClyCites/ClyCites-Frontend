import React from "react";
import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import Link from "next/link";

 

const NutritionBelow: React.FC = () => {
  return (
    <section className="px-8">
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-4 lg:mb-20">

        {/* Left-hand side (section title) */}
        <div className="lg:flex lg:justify-end lg:mt-20 ">
          <div
            className="wow fadeInUp w-full mx-auto text-start"
            data-wow-delay=".1s"
          >
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black/80 dark:text-white sm:text-4xl md:text-[45px]">
            Continuously Monitor NitrogenOptimize Spray Timing
            </h2>
            <p className="text-base !leading-relaxed text-body-color md:text-lg">
            Monitor plant uptake and utilization of crop nutrients throughout the season. Know what your crop is absorbing, what’s available for future uptake, and if nutrients are being lost. 
            </p>
          </div>
        </div>

        {/* Right-hand side (news articles) */}
        <div className="lg:col-span-2 relative overflow-visible">
          {/* First image (covers the entire column) */}
          <div className="h-96">
            <img
              src="/images/agri.jpg"
              alt="First Image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Second image (allowed to move outside the boundaries of the first image) */}
          <div className="absolute -bottom-10 -right-10 w-[60%] h-[50%]">
            <img
              src="/images/agr.avif"
              alt="Second Image"
              className="w-full h-full object-cover shadow-lg"
            />
          </div>
        </div>


      </div>
      {/* SECOND ROW */}
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-4 lg:mb-20">

        {/* Right-hand side (news articles) */}
        <div className="lg:col-span-2 relative overflow-visible">
          {/* First image (covers the entire column) */}
          <div className="h-96">
            <img
              src="/images/agri.jpg"
              alt="First Image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Second image (allowed to move outside the boundaries of the first image) */}
          <div className="absolute -bottom-10 -left-10 w-[60%] h-[50%]">
            <img
              src="/images/agr.avif"
              alt="Second Image"
              className="w-full h-full object-cover shadow-lg"
            />
          </div>
        </div>

        {/* RIGHT-hand side (section title) */}
        <div className="lg:flex lg:justify-end lg:mt-20 ">
          <div
            className="wow fadeInUp w-full mx-auto text-start"
            data-wow-delay=".1s"
          >
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black/80 dark:text-white sm:text-4xl md:text-[45px]">
            Reduce Impact of Leaching Events
            </h2>
            <p className="text-base !leading-relaxed text-body-color md:text-lg">
            Users can track and report a season-long view of nitrogen leaching events to demonstrate responsible nitrogen management, or establish the conditions that lead to leaching events then make adjustments to prevent future occurences.
            </p>
          </div>
        </div>
      </div>
      {/* THIRD ROW */}
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-4 lg:mb-20">

        {/* Left-hand side (section title) */}
        <div className="lg:flex lg:justify-end lg:mt-20 ">
          <div
            className="wow fadeInUp w-full mx-auto text-start"
            data-wow-delay=".1s"
          >
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black/80 dark:text-white sm:text-4xl md:text-[45px]">
            Manage Soil Salinity Levels
            </h2>
            <p className="text-base !leading-relaxed text-body-color md:text-lg">
            This solution for salinity monitoring is easier, less time-consuming and able to supply immediate results compared to conventional lab soil sample method of measuring the saturated paste EC (electric conductivity).​​
            </p>
          </div>
        </div>

        {/* Right-hand side (news articles) */}
        <div className="lg:col-span-2 relative overflow-visible">
          {/* First image (covers the entire column) */}
          <div className="h-96">
            <img
              src="/images/agri.jpg"
              alt="First Image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Second image (allowed to move outside the boundaries of the first image) */}
          <div className="absolute -bottom-10 -right-10 w-[60%] h-[50%]">
            <img
              src="/images/agr.avif"
              alt="Second Image"
              className="w-full h-full object-cover shadow-lg"
            />
          </div>
        </div>


      </div>
    </section>
  );
};

export default NutritionBelow;

