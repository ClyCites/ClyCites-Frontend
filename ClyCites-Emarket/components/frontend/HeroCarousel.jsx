"use client";

import { Carousel } from "nuka-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

export default function HeroCarousel() {
  const config = {
    containerClassName: "rounded-full w-12 h-12 overflow-hidden bg-slate-800",
    nextButtonClassName: "string",
    nextButtonText: <ChevronRight />,
    pagingDotsClassName: "me-2 w-4 h-4",
    pagingDotsContainerClassName: "",
    prevButtonText: <ChevronLeft />,
  };

  return (
    <Carousel
      defaultControlsConfig={config}
    //   autoplay
      wrapAround
      slideCount
      autoplay={true} autoplayInterval={1500} wrapMode="wrap"
      className="rounded-md overflow-hidden"
    >
      {/* <Link href="#"> */}
        <Image width={712} height={384} src="/images/one.webp" alt="Slide 1" className="w-full" />
      {/* </Link> */}
      {/* <Link href="#"> */}
        <Image width={712} height={384} src="/images/two.webp" alt="Slide 2" className="w-full" />
      {/* </Link> */}
      {/* <Link href="#"> */}
        <Image width={712} height={384} src="/images/three.gif" alt="Slide 3" className="w-full" />
      {/* </Link> */}
    </Carousel>
  );
}
