'use client';
import { Chip } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
// components/Slideshow.tsx
import React, { useState } from 'react';

interface Post {
  src: string;
  title: string;
  date: string;
  postId: number;
}

interface SlideshowProps {
  posts: Post[];
}

export const Slideshow: React.FC<SlideshowProps> = ({ posts }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? posts.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="relative w-full min-h-[700px] rounded-2xl overflow-hidden">
      {posts.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={`Slideshow Image ${index + 1}`}
          className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ))}
      <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
      <div className="absolute inset-0 flex flex-col items-start justify-between ml-24">
        <Chip
          variant="flat"
          size='lg'
          color='primary'
          className='basis-10 mt-20'
        >
          {posts[currentSlide].date}
        </Chip>

        <div className="flex gap-10 flex-col basis-3/5 text-white">
          <p className='text-4xl'>GEITS</p>
          <p className='text-6xl font-extrabold max-w-md leading-normal'>{posts[currentSlide].title}</p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-4 flex flex-row items-center justify-center">
        <div>
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-4 w-4 rounded-full mx-2 focus:outline-none self-center transition-opacity duration-300 ${index === currentSlide ? 'bg-white opacity-100' : 'bg-gray opacity-60'
                }`}
            ></button>
          ))}
        </div>
      </div>
      <Link href={`/blog/${posts[currentSlide].postId}`} className='absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full flex justify-center items-center'>
        <Image src="/arrow-up-right.svg" width={24} height={24} alt={`Post_${posts[currentSlide].date}`} />
      </Link>
    </div>
  );
};

