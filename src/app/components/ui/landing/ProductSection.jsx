"use client";

import { BlackBgButton } from "../Buttons/Button2colors";
import Categories from "./components/Categories";
import Card from "../card/Card";
import Container from "../../layouts/Container";

const ProductSection = () => {
  return (
    <Container>
      <Categories />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-12 mt-10  relative">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <div className="absolute inset-x-0 bottom-0 z-30 h-80 bg-gradient-to-t from-white to-transparent dark:from-black"></div>
      </div>
      <div className="flex justify-center w-full">
        <BlackBgButton blackBtnlable="Browse products" />
      </div>
    </Container>
  );
};

export default ProductSection;
