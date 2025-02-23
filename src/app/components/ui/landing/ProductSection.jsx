"use client";

import { MdOutlineExplore } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { TbShoppingCartCopy } from "react-icons/tb";
import { FaRocketchat } from "react-icons/fa";
import { HeadTypo, BodyTypo, FootTypo } from "../Typography";
import { GrFormPrevious } from "react-icons/gr";
import Categories from "./components/Categories";
import Card from "../card/Card";
import Container from "../../layouts/Container";

const ProductSection = () => {
  return (
    <Container>
      <Categories />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-12 mt-10 ">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </Container>
  );
};

export default ProductSection;
