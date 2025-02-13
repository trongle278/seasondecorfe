"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "./ui/Carousel";

export function BannerCarousel() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout={true} />
  ));

  return (
    <div className="w-full h-full py-20">
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = ({ img, title, content }) => {
  return (
    <>
      {[...new Array(1).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700">{title}</span>{" "}
              {content}
            </p>
            <Image
              src={img}
              alt="Image from House decor"
              height="500"
              width="500"
              loading="lazy"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Interior Design",
    title: "Revamp your living space with minimalist interiors.",
    src: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <DummyContent
        title="Beautiful interior design"
        content="Beautifulssssssssssssssssssssssssssssssssssssssssss"
        img="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    ),
  },
  {
    category: "DIY Projects",
    title: "Transform your space with these DIY home decor ideas.",
    src: "https://images.unsplash.com/photo-1523413184730-e85dbbd04aba?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <DummyContent
        title="Explore DIY styles for your home"
        content="Beautifulllllll"
        img="https://images.unsplash.com/photo-1617201929478-8eedff7508f9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    ),
  },
  {
    category: "Sustainability",
    title: "Eco-friendly tips for stylish home decoration.",
    src: "https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Lighting",
    title: "Brighten up your home with stunning lighting designs.",
    src: "https://images.unsplash.com/photo-1526827826797-7b05204a22ef?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Furniture",
    title: "Modern furniture ideas for a cozy and elegant space.",
    src: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Color Palettes",
    title: "Play with colors: Perfect palettes for your dream home.",
    src: "https://images.unsplash.com/photo-1541723011216-c57eaed19919?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
];
