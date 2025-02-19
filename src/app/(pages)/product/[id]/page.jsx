"use client";

import Container from "@/app/components/layouts/Container";
import ImageSlider from "@/app/components/ui/slider/ImageSlider";
import { FavouriteBtn } from "@/app/components/layouts/header/components/indexBtn";
import Avatar from "@/app/components/ui/avatar/Avatar";
import { FootTypo } from "@/app/components/ui/typography";
import Button from "@/app/components/ui/buttons/Button";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { AiOutlineShop } from "react-icons/ai";
import { BorderBox } from "@/app/components/ui/BorderBox";
import DetailSection from "./components/sections/DetailSection";
import DescrriptionSection from "./components/sections/DescriptionSection";
import ExampleNumberField from "@/app/components/ui/select/NumberField";
import CommentSection from "./components/sections/CommentSection";

const ProductDetail = () => {
  return (
    <Container>
      <div className="my-7"></div>
      <BorderBox>
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="flex flex-col w-full gap-6  h-fit items-center pt-10">
            <ImageSlider />
            <span className="inline-flex items-center">
              <FavouriteBtn /> People liked (...)
            </span>
          </div>
          {/* INFO */}
          <div className="flex-flex-col w-full p-10 dark:text-white">
            <div className="">
              <div className="text-3xl font-bold my-5">xczzx</div>
              <div className=" font-semibold my-10">Created Date : czxcz</div>
              {/*<div className="text-black font-semibold my-5">
              Updated Date : {formattedUpdatedDate}
            </div> */}
              <div className=" font-semibold my-10">Description : zcx</div>
              <div className=" font-semibold my-10">Color : dad</div>
              <div className=" font-semibold my-10">
                Material : {"adsa" || "N/A"}
              </div>
              <div className=" font-semibold my-10">
                Type : {"dsasd" || "N/A"}
              </div>
              <div className=" font-semibold my-10">
                Brand : {"asdsa" || "N/A"}
              </div>
              <div className="font-semibold my-10">Created By : adsad</div>
              <div className="my-7 font-semibold">
                Expected Starting Price :
              </div>
              <div className="text-3xl font-semibold">dasda</div>
              <div className="my-20 max-w-[500px]">
                <ExampleNumberField />
              </div>
            </div>
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
                  label="Contact Seller"
                  icon={<IoChatboxEllipsesOutline />}
                />
                <Button label="Browse shop" icon={<AiOutlineShop />} />
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
      <DescrriptionSection />
      <CommentSection/>
    </Container>
  );
};

export default ProductDetail;
