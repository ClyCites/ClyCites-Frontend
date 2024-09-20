import React from "react";
import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import Link from "next/link";
const newsData = [
  {
    category: "Sports",
    title:
      "Bugema University sports play a vital role in student life ............",
    link: "/studentlife",
    imageSrc: "/images/agri.jpg",
    altText: "Image related to depression biotypes",
  },
  {
    category: "Business",
    title: "Why advertisers pay more to reach viewers who watch less",
    link: "/",
    imageSrc: "/images/agri.jpg",
    altText: "Image related to advertising study",
  },
  {
    category: "Health & Medicine",
    title: "Study finds high blood pressure drug may prevent epilepsy",
    link: "/",
    imageSrc: "/images/agri.jpg",
    altText: "Image related to epilepsy study",
  },
  {
    category: "Commencement 2024",
    title: "Congratulations, graduates!",
    link: "/",
    imageSrc: "/images/agri.jpg",
    altText: "Commencement 2024 highlights",
  },
  {
    category: "Commencement 2024",
    title: "Congratulations, graduates!",
    link: "/",
    imageSrc: "/images/agri.jpg",
    altText: "Commencement 2024 highlights",
  },
  {
    category: "Commencement 2024",
    title: "Congratulations, graduates!",
    link: "/",
    imageSrc: "/images/agri.jpg",
    altText: "Commencement 2024 highlights",
  },
];

const Nutrition: React.FC = () => {
  return (
    <section className="px-8">
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-4 ">

        {/* Left-hand side (section title) */}
        <div className="lg:flex lg:justify-end lg:mt-20 ">
          <div
            className="wow fadeInUp w-full mx-auto text-start"
            data-wow-delay=".1s"
          >
            <h2 className="mb-4 text-3xl font-bold !leading-tight text-black/80 dark:text-white sm:text-4xl md:text-[45px]">
              CropX System Disease Control
            </h2>
            <p className="text-base !leading-relaxed text-body-color md:text-lg">
              Know exactly when, where, and what to apply, even the best time of day to spray. Save costs while you maximize protection with the most tested and reliable digital fungal disease management advisor in the market.
            </p>
          </div>
        </div>

        {/* Right-hand side (news articles) */}
        <div className="lg:col-span-2">
          <div className="grid lg:mt-10 lg:mb-10 grid-cols-1 md:grid-cols-3 gap-4">
            {newsData.map((news, index) => (
              <article
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <a href={news.link} aria-hidden="true" tabIndex={-1}>
                    <Image
                      src={news.imageSrc}
                      alt={news.altText}
                      height={350}
                      width={350}
                    />
                  </a>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-2">
                    {news.category}
                  </div>
                  <h3 className="text-lg text-black font-semibold">
                    <a href={news.link}>{news.title}</a>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nutrition;

