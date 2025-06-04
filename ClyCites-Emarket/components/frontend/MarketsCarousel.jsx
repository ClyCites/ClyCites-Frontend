"use client"

import React from 'react'
import Image from 'next/image';
import Link from "next/link";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

export default function MarketsCarousel() {
    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 6,
          slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 3,
          slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 2,
          slidesToSlide: 1 // optional, default to 1.
        }
      };

      const slides =[
        {},{},{},{},{},{},{},{},{},{},{},{}
      ]
  return (
    <Carousel
  swipeable={false}
  draggable={false}
  showDots={true}
  responsive={responsive}
  ssr={true} // means to render carousel on server-side.
  infinite={true}
  autoPlay={true}
  autoPlaySpeed={1000}
  keyBoardControl={true}
  customTransition="all .5"
  transitionDuration={500}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["tablet", "mobile"]}
//   deviceType={}
  dotListClass="custom-dot-list-style"
  itemClass="px-4"
>
{
    slides.map((slide,i)=>{
        return (
            <Link key={i} href="#" className="rounded-lg mr-3 rounded-lg bg-red-400">
            <Image width={556} height={556} src="/images/logo.jpeg" alt="" className="w-full" />
            <h2 className="text-center dark:text-slate-200 text-slate-300 mt-2">Vegetables</h2>

            </Link>
        )
    })
}

</Carousel>
  );
}
