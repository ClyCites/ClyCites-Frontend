import { Carousel } from 'nuka-carousel';

export default function HeroCarousel() {
  return (
    <Carousel autoplay={true} autoplayInterval={2000} wrapMode="wrap">
    <img src="/images/one.webp" />
    <img src="/images/two.webp" />
    <img src="/images/three.gif" />
    </Carousel>
  );
};