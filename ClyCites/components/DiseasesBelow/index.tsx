import React from "react";
import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import Link from "next/link";

 

const DiseasesBelow: React.FC = () => {
  return (
    <section className="px-8">
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-4 lg:mb-20 mb-20">

        {/* Left-hand side (section title) */}
        <div className="lg:flex lg:justify-end lg:mt-20 ">
          <div
            className="wow fadeInUp w-full mx-auto text-start"
            data-wow-delay=".1s"
          >
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black/80 dark:text-white sm:text-4xl md:text-[45px]">
            Optimize Spray Timing
            </h2>
            <p className="text-base !leading-relaxed text-body-color md:text-lg">
            The most effective way to manage plant disease is by prevention. Know exactly where, what and when to spray, even down to the best time of day. Save costs on chemicals and spraying while you maximize protection.
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
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-4 lg:mb-20 mb-20">

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
        <div className="lg:flex lg:justify-end lg:mt-20 mt-10">
          <div
            className="wow fadeInUp w-full mx-auto text-start"
            data-wow-delay=".1s"
          >
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black/80 dark:text-white sm:text-4xl md:text-[45px]">
            Reduce Chemical Use
            </h2>
            <p className="text-base !leading-relaxed text-body-color md:text-lg">
            The system calculates a dynamic, daily infection risk that takes into account conditions for fungal growth, plant growth, crop type, and previous crop protection applications. The system also recommends the day and time to minimize environmental loss.
            </p>
          </div>
        </div>
      </div>
      {/* THIRD ROW */}
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-4 lg:mb-20 mb-20">

        {/* Left-hand side (section title) */}
        <div className="lg:flex lg:justify-end lg:mt-20 ">
          <div
            className="wow fadeInUp w-full mx-auto text-start"
            data-wow-delay=".1s"
          >
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black/80 dark:text-white sm:text-4xl md:text-[45px]">
            Optimize Spray Timing
            </h2>
            <p className="text-base !leading-relaxed text-body-color md:text-lg">
            The most effective way to manage plant disease is by prevention. Know exactly where, what and when to spray, even down to the best time of day. Save costs on chemicals and spraying while you maximize protection.
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

export default DiseasesBelow;

