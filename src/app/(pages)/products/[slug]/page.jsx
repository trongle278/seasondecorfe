"use client";

import * as React from "react";
import Container from "@/app/components/layouts/Container";
import ImageSlider from "@/app/components/ui/slider/ImageSlider";
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
import { FcShipped } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";
import { useGetProductById } from "@/app/queries/product/product.query";
import { useGetListProduct } from "@/app/queries/list/product.list.query";
import { MdFavoriteBorder } from "react-icons/md";
import { scroller } from "react-scroll";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { ClipLoader } from "react-spinners";
import { useAddToCart } from "@/app/queries/cart/cart.query";
import { useUser } from "@/app/providers/userprovider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useUser();
  const router = useRouter();

  const { data: products } = useGetListProduct();
  const [productId, setProductId] = React.useState(null);
  const { data: productDetail, isLoading } = useGetProductById(productId);

  const { mutate: addToCart, isLoading: isAddingToCart } = useAddToCart();

  const [quantity, setQuantity] = React.useState(1);

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
    return (
      <p className="text-center mt-20">
        <ClipLoader size={20} />
      </p>
    );
  }

  const handleAddToCart = () => {
    if (!user?.id) {
      toast.error("Please login first");
      router.push("/authen/login");
      return;
    }

    addToCart(
      {
        accountId: user.id,
        productId: productDetail.id,
        quantity: quantity,
      },
      {
        onSuccess: () => {
          console.log("Product added to cart!");
        },
        onError: (error) => {
          console.error("Failed to add to cart:", error);
          alert("Failed to add product to cart.");
        },
      }
    );
  };

  const handleRatingClick = () => {
    scroller.scrollTo("commentSection", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -50,
    });
  };

  return (
    <Container>
      <div className="my-7">
        <MuiBreadcrumbs />
      </div>
      <BorderBox>
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="flex flex-col w-full gap-6  h-fit items-center pt-10">
            <ImageSlider
              img={productDetail.imageUrls || []}
              loading={isLoading}
            />
            <span className="inline-flex items-center gap-2">
              <MdFavoriteBorder /> People liked (...)
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
              <div className="flex text-sm justify-between">
                <div className="inline-flex">
                  <div className="flex gap-2 items-center border-l-[1px] px-5">
                    <button className="underline" onClick={handleRatingClick}>
                      {productDetail.totalRate === 0
                        ? "No Rating Yet"
                        : `${productDetail.totalRate} Ratings`}
                    </button>
                  </div>
                  <div className="flex gap-2 items-center border-l-[1px] px-5">
                    <span className="underline">
                      {productDetail.totalSold === 0
                        ? "No product sold"
                        : `${productDetail.totalSold} Solds`}
                    </span>
                  </div>
                </div>
                <button className="text-red">Report</button>
              </div>

              <span className="bg-gray-50 w-full dark:bg-zinc-800 p-5 gap-2 inline-flex text-red text-3xl">
                <FaDongSign />
                {new Intl.NumberFormat("vi-VN").format(
                  productDetail.productPrice
                )}
              </span>

              <span className="inline-flex items-center gap-5 my-3">
                <FootTypo
                  footlabel="Made In"
                  className="text-lg !mx-0 font-semibold w-40"
                />
                {productDetail.madeIn}
              </span>

              <span className="inline-flex items-center gap-5 my-3">
                <FootTypo
                  footlabel="Ship From"
                  className="text-lg !mx-0 font-semibold w-40"
                />
                <FcShipped size={20} />

                {productDetail.shipFrom}
              </span>
              <span className="inline-flex items-center gap-5 my-3">
                <FootTypo
                  footlabel="Shopping Guarantee"
                  className="text-lg !mx-0 font-semibold w-40"
                />
                <FcApproval size={20} />
                15-Day Free Returns
              </span>
              <span className="my-20 max-w-[500px] inline-flex items-center gap-2">
                <FootTypo
                  footlabel="Quantity"
                  className="text-lg !mx-0 font-semibold w-40"
                />
                <ExampleNumberField
                  defaultValue={1}
                  onChange={(value) => setQuantity(value)}
                />

                <FootTypo
                  footlabel={`${productDetail.quantity} pieces available`}
                  className="!mx-0 text-sm pl-5"
                />
              </span>
            </div>
            <div className="inline-flex items-center gap-4">
              <Button
                label="Add to cart"
                className="bg-primary !p-3"
                icon={<BsCartPlus size={20} />}
                onClick={handleAddToCart}
              />
              <Button
                label="Add to favourite"
                className="bg-yellow !p-3"
                icon={<MdFavoriteBorder size={20} />}
              />
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
