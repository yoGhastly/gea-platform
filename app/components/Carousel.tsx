"use client";
import React, { useEffect, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../styles/Carousel.css";
import { poppins } from '../fonts';
import Image from 'next/image';
import Link from 'next/link';


interface CarouselProps {
  images: string[]; // An array of image URLs to display in the carousel
}

export const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const settings: Settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    dots: true,
    adaptiveHeight: true,
    pauseOnDotsHover: true,
    swipe: true,
  };


  return (
    <div className="relative rounded w-full -mt-7">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className='relative flex flex-col justify-between gap-5'>
            <section>
              <div className='bg-white rounded-2xl absolute p-5 mx-16 my-8 h-12 flex justify-center items-center'>
                <p>Sep 05, 2023</p>
              </div>
            </section>
            <div className='absolute top-1/3 mx-16 gap-5 flex flex-col'>
              <section className='flex flex-col gap-10'>
                <h2 className={`${poppins.className} text-white font-bold text-4xl`}>GEITS</h2>
                <p className={`${poppins.className} text-6xl text-white w-full max-w-md leading-[80px] font-bold`}>Asesorias Medio Curso</p>
              </section>
            </div>
            <Link href='/' className='absolute w-14 h-14 bg-white rounded-full self-end flex right-16 bottom-10 justify-center items-center'>
              <Image src="/arrow-up-right.svg" alt='Arrow up right' width={24} height={24} />
            </Link>
            <img src={image} alt={`Slide ${index + 1}`} style={{ width: "100%", borderRadius: "20px" }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

