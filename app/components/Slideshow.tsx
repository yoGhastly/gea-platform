"use client";
import { Chip, CircularProgress } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Post } from "../interfaces";
import { useMediaQuery } from "../lib/useMediaQuery";

interface SlideshowProps {
  posts: Post[];
}

export const Slideshow: React.FC<SlideshowProps> = ({ posts }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isSm = useMediaQuery(480);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? posts.length - 1 : prevSlide - 1,
    );
  };

  useEffect(() => {
    // Use setInterval to trigger nextSlide every 5 seconds
    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clear the interval when the component unmounts or when posts change
    return () => {
      clearInterval(intervalId);
    };
  }, [currentSlide, posts]);

  if (!posts) return <CircularProgress color="primary" />;

  return posts.length > 0 ? (
    <div className="relative w-[370px] h-[350px] md:w-full md:min-h-[700px] md:rounded-2xl overflow-hidden">
      {posts.map((post, index) => (
        <img
          key={index}
          src={post.image}
          alt={`Slideshow Image ${index + 1}`}
          className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ${index === currentSlide
              ? "opacity-100 bg-gradient-to-b from-black"
              : "opacity-0"
            }`}
        />
      ))}
      <div className="absolute inset-0 bg-black opacity-40 md:rounded-lg"></div>
      <div className="absolute inset-0 flex flex-col items-start justify-between md:ml-24">
        <Chip
          variant="solid"
          size="lg"
          color="primary"
          className="basis-10 my-5 mx-5 md:my-20 md:mx-0"
        >
          {posts[currentSlide].date
            .match(/(\d{2}_\d{2}_\d{4})/)![0]
            .replace(/_/g, " ")}
        </Chip>

        <div className="flex gap-2 md:gap-10 flex-col md:basis-3/5 text-white">
          <p className="text-2xl md:text-4xl my-5 mx-5 md:my-0 md:mx-0">
            GEITS
          </p>
          <p className="text-4xl md:text-6xl my-14 mx-5 md:my-0 md:mx-0 font-extrabold max-w-md leading-normal">
            {posts[currentSlide].title}
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-4 flex flex-row items-center justify-center">
        <div>
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 md:h-4 md:w-4 rounded-full mx-1 md:mx-2 focus:outline-none self-center transition-opacity duration-300 ${index === currentSlide
                  ? "bg-white opacity-100"
                  : "bg-gray opacity-60"
                }`}
            ></button>
          ))}
        </div>
      </div>
      <Link
        href={`/blog/${posts[currentSlide].postId}`}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex justify-center items-center"
      >
        <Image
          src="/arrow-up-right.svg"
          width={isSm ? 14 : 24}
          height={isSm ? 14 : 24}
          alt={`Post_${posts[currentSlide].date}`}
        />
      </Link>
    </div>
  ) : (
    <div className="bg-gradient-to-b from-secondary relative w-[370px] h-[350px] md:w-full md:min-h-[700px] md:rounded-2xl overflow-hidden"></div>
  );
};
