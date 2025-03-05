"use client";

import * as React from "react";
import Container from "@/app/components/layouts/Container";
import ImageSlider from "@/app/components/ui/slider/ImageSlider";
import { FavouriteBtn } from "@/app/components/layouts/header/components/indexBtn";
import Avatar from "@/app/components/ui/Avatar/Avatar";
import { FootTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { AiOutlineShop } from "react-icons/ai";
import { BorderBox } from "@/app/components/ui/BorderBox";
import DetailSection from "../components/sections/DetailSection";
import DescrriptionSection from "../components/sections/DescriptionSection";
import ExampleNumberField from "@/app/components/ui/Select/NumberField";
import CommentSection from "../components/sections/CommentSection";
import { FaDongSign } from "react-icons/fa6";
import { BsCartPlus } from "react-icons/bs";
import { useParams } from "next/navigation";
import { useGetProductById } from "@/app/queries/product/product.query";
import { useGetListProduct } from "@/app/queries/list/product.list.query";

const ProductDetail = () => {
  const { slug } = useParams();

  const { data: products } = useGetListProduct();
  const [productId, setProductId] = React.useState(null);
  const { data: productDetail, isLoading } = useGetProductById(productId);

  React.useEffect(() => {
    if (products) {
      console.log(products);
      const matchedProduct = products.find(
        (p) => generateSlug(p.productName) === slug
      );
      if (matchedProduct) {
        setProductId(matchedProduct.id);
      }
    }
  }, [products, slug]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (!productDetail) {
    return <p className="text-center mt-20">Loading product details...</p>;
  }

  return (
    <Container>
      <div className="my-7"></div>
      <BorderBox>
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="flex flex-col w-full gap-6  h-fit items-center pt-10">
            <ImageSlider img={productDetail.imageUrls || []} loading={isLoading} />
            <span className="inline-flex items-center">
              <FavouriteBtn /> People liked (...)
            </span>
          </div>
          {/* INFO */}
          <div className="flex-flex-col w-full p-10 dark:text-white">
            <div className="flex flex-col justify-start">
              <span className="inline-flex items-center gap-5 my-3">
                <FootTypo
                  footlabel={productDetail.productName}
                  className="text-3xl !mx-0 font-primary"
                />
              </span>

              <span className="bg-gray-50 w-full dark:bg-zinc-800 inline-flex text-3xl p-5 text-red">
                <FaDongSign />
                {new Intl.NumberFormat("vi-VN").format(
                  productDetail.productPrice
                )}
              </span>

              <span className="inline-flex items-center gap-5 my-3">
                <FootTypo
                  footlabel="Color"
                  className="text-lg !mx-0 font-semibold w-40"
                />{" "}
                asdad
              </span>

              <span className="inline-flex items-center gap-5 my-3">
                <FootTypo
                  footlabel="Color"
                  className="text-lg !mx-0 font-semibold w-40"
                />{" "}
                asdad
              </span>
              <span className="inline-flex items-center gap-5 my-3">
                <FootTypo
                  footlabel="Color"
                  className="text-lg !mx-0 font-semibold w-40"
                />{" "}
                asdad
              </span>
              <span className="inline-flex items-center gap-5 my-3">
                <FootTypo
                  footlabel="Color"
                  className="text-lg !mx-0 font-semibold w-40"
                />{" "}
                asdad
              </span>
              <span className="inline-flex items-center gap-5 my-3">
                <FootTypo
                  footlabel="Color"
                  className="text-lg !mx-0 font-semibold w-40"
                />
                asdad
              </span>
              <span className="my-20 max-w-[500px] inline-flex items-center gap-2">
                <FootTypo
                  footlabel="Quantity"
                  className="text-lg !mx-0 font-semibold w-40"
                />
                <ExampleNumberField />
              </span>
            </div>
            <Button
              label="Add to cart"
              className="bg-primary !p-3"
              icon={<BsCartPlus size={20} />}
            />
          </div>
        </div>
      </BorderBox>

      <BorderBox className="my-5">
        <div className="flex flex-col lg:flex-row gap-20  my-7 px-6 py-5 ">
          <div className="flex flex-row justify-between">
            <Avatar userImg="" w={96} h={96} className="cursor-pointer mr-3" />
            <div className="flex flex-col flex-grow  justify-between items-start">
              <FootTypo
                footlabel="ten seller"
                className="text-lg !mx-0 font-semibold"
              />
              <div className="items-center flex">
                <FootTypo footlabel="Online 1 hours ago" className="text-sm" />
              </div>
              <div className="items-center flex justify-between gap-2">
                <Button
                  label="Chat Now"
                  icon={<IoChatboxEllipsesOutline />}
                  className="bg-primary"
                />
                <Button label="Browse Shop" icon={<AiOutlineShop />} />
              </div>
            </div>
          </div>
          <div className="flex-grow border-l pl-6">
            <div className="grid grid-cols-[repeat(3,auto)] gap-7">
              <div className="flex justify-between outline-none overflow-visible relative">
                <FootTypo footlabel="Rating" className="text-sm !mx-0" />
                <FootTypo
                  footlabel="5.0"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
              <div className="flex justify-between outline-none overflow-visible relative">
                <FootTypo footlabel="Product" className="text-sm !mx-0" />
                <FootTypo
                  footlabel="5.0"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
              <div className="flex justify-between outline-none overflow-visible relative">
                <FootTypo footlabel="Followers" className="text-sm !mx-0" />
                <FootTypo
                  footlabel="5.0"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
              <div className="flex justify-between outline-none overflow-visible relative">
                <FootTypo footlabel="Response time" className="text-sm !mx-0" />
                <FootTypo
                  footlabel="5.0"
                  className="text-sm !mx-0 text-red font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </BorderBox>
      <DetailSection />
      <DescrriptionSection description={productDetail.description} />
      <CommentSection />
    </Container>
  );
};

export default ProductDetail;
