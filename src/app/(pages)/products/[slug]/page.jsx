"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
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
import ReviewSection from "@/app/components/ui/review/ReviewSection";
import { FaDongSign } from "react-icons/fa6";
import { BsCartPlus } from "react-icons/bs";
import { useParams } from "next/navigation";
import { FcShipped } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";
import { useGetProductById } from "@/app/queries/product/product.query";
import { useGetListProduct } from "@/app/queries/list/product.list.query";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { scroller } from "react-scroll";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { ClipLoader } from "react-spinners";
import { useAddToCart } from "@/app/queries/cart/cart.query";
import { useUser } from "@/app/providers/userprovider";
import { useRouter } from "next/navigation";
import { IoIosStar } from "react-icons/io";
import { useAddContact } from "@/app/queries/contact/contact.query";
import { useQueryClient } from "@tanstack/react-query";
import useChat from "@/app/hooks/useChat";
import useChatBox from "@/app/hooks/useChatBox";
import { toast } from "sonner";
import { generateSlug } from "@/app/helpers";
import {
  useAddFavoriteDecorProduct,
  useRemoveFavoriteDecorProduct,
} from "@/app/queries/favorite/favorit.query";
import { useGetListFavoriteProduct } from "@/app/queries/list/favorite.list.query";

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useUser();
  const { setSelectedProvider } = useChat();
  const { onOpen } = useChatBox();
  const router = useRouter();
  const addContactMutation = useAddContact();
  const queryClient = useQueryClient();
  const { data: favorites } = useGetListFavoriteProduct();
  const { mutate: addFavoriteDecorProduct } = useAddFavoriteDecorProduct();
  const { mutate: removeFavoriteDecorProduct } =
    useRemoveFavoriteDecorProduct();

  const { data: productsData } = useGetListProduct();
  const [productId, setProductId] = useState(null);
  const { data: productDetail, isLoading } = useGetProductById(productId);

  const { mutate: addToCart, isPending } = useAddToCart();

  const [quantity, setQuantity] = useState(1);

  // Check if the product is already in favorites
  const isInFavorites = React.useMemo(() => {
    if (!favorites || !productId) return false;
    return favorites.some((fav) => fav.productDetail.id === productId);
  }, [favorites, productId]);

  useEffect(() => {
    if (productsData && productsData.data && Array.isArray(productsData.data)) {
      const matchedProduct = productsData.data.find(
        (p) => generateSlug(p.productName) === slug
      );
      if (matchedProduct) {
        setProductId(matchedProduct.id);
      }
    }
  }, [productsData, slug]);

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

  const handleAddToFavorites = () => {
    if (isInFavorites) return;

    addFavoriteDecorProduct(productId, {
      onSuccess: () => {
        console.log("Added to favorite");
        queryClient.invalidateQueries({
          queryKey: ["get_list_favorite_product"],
        });
      },
      onError: (error) => {
        console.log("Error adding to favorite:", error);
      },
    });
  };

  const handleRatingClick = () => {
    scroller.scrollTo("reviewSection", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -50,
    });
  };

  const handleChatClick = (provider) => {
    const providerData = {
      contactId: productDetail.provider.id,
      contactName: productDetail.provider.businessName,
      avatar: productDetail.provider.avatar,
    };
    addContactMutation.mutate(provider.id, {
      onSuccess: () => {
        setSelectedProvider(providerData);
        onOpen();
        queryClient.invalidateQueries(["get_list_contact"]);
      },
      onError: (error) => {
        console.error("Error adding contact:", error);
      },
    });
  };

  return (
    <>
      <Head>
        {productDetail?.productName && (
          <title>{productDetail.productName} | Season Decor</title>
        )}
      </Head>
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
                  {user?.id !== productDetail.provider.id && (
                    <ExampleNumberField
                      defaultValue={1}
                      onChange={(value) => setQuantity(value)}
                    />
                  )}

                  <FootTypo
                    footlabel={`${productDetail.quantity} pieces available`}
                    className="!mx-0 text-sm pl-5"
                  />
                </span>
              </div>
              <div className="inline-flex items-center gap-4">
                {user?.id !== productDetail.provider.id && (
                  <>
                    <Button
                      label="Add to cart"
                      className="bg-primary"
                      icon={<BsCartPlus size={20} />}
                      onClick={handleAddToCart}
                    />
                    <Button
                      label={
                        isInFavorites ? "In your wishlist" : "Add to Wishlist"
                      }
                      className={isInFavorites ? "bg-rose-600" : "bg-rose-500"}
                      icon={
                        isInFavorites ? (
                          <MdFavorite size={20} />
                        ) : (
                          <MdFavoriteBorder size={20} />
                        )
                      }
                      onClick={handleAddToFavorites}
                      disabled={isInFavorites || isPending}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </BorderBox>

        <BorderBox className="my-5">
          <div className="flex flex-col lg:flex-row gap-20  my-7 px-6 py-5 ">
            <div className="flex flex-row justify-between">
              <Avatar
                userImg={productDetail.provider.avatar}
                w={96}
                h={96}
                className="cursor-pointer mr-3"
              />
              <div className="flex flex-col flex-grow  justify-between items-start">
                <FootTypo
                  footlabel={productDetail.provider.businessName}
                  className="text-lg !mx-0 font-semibold"
                />
                <div className="items-center flex justify-between gap-2">
                  {user?.id === productDetail.provider.id ? (
                    <Button
                      label="Go to your shop"
                      icon={<AiOutlineShop />}
                      className="bg-primary"
                      onClick={() =>
                        router.push(`/provider/${productDetail.provider.slug}`)
                      }
                    />
                  ) : (
                    <>
                      <Button
                        label="Chat Now"
                        icon={<IoChatboxEllipsesOutline />}
                        className="bg-primary"
                        onClick={() => handleChatClick(productDetail.provider)}
                      />
                      <Button
                        label="Browse Shop"
                        icon={<AiOutlineShop />}
                        onClick={() =>
                          router.push(
                            `/provider/${productDetail.provider.slug}`
                          )
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-grow border-l pl-6">
              <div className="grid grid-cols-[repeat(3,auto)] gap-7">
                <div className="flex justify-between outline-none overflow-visible relative">
                  <FootTypo footlabel="Rating" className="text-sm !mx-0" />
                  <div className="flex items-center text-red font-semibold">
                    <FootTypo
                      footlabel={productDetail.provider.totalRate}
                      className="text-sm !mx-0 mr-1"
                    />
                    <IoIosStar />
                  </div>
                </div>
                <div className="flex justify-between outline-none overflow-visible relative">
                  <FootTypo footlabel="Product" className="text-sm !mx-0" />
                  <FootTypo
                    footlabel={productDetail.provider.totalProduct}
                    className="text-sm !mx-0 text-red font-semibold"
                  />
                </div>
                <div className="flex justify-between outline-none overflow-visible relative">
                  <FootTypo footlabel="Followers" className="text-sm !mx-0" />
                  <FootTypo
                    footlabel={productDetail.provider.followersCount}
                    className="text-sm !mx-0 text-red font-semibold"
                  />
                </div>
                <div className="flex justify-between outline-none overflow-visible relative">
                  <FootTypo
                    footlabel="Response time"
                    className="text-sm !mx-0"
                  />
                  <FootTypo
                    footlabel="80 %"
                    className="text-sm !mx-0 text-red font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </BorderBox>
        <DetailSection />
        <DescrriptionSection description={productDetail.description} />
        {/* Review Section */}
        <ReviewSection
          label="PRODUCT REVIEWS"
          reviews={productDetail.reviews || []}
          productId={productDetail.id}
          averageRating={productDetail.averageRating || 0}
          totalReviews={productDetail.reviews?.length || 0}
          onAddReview={({ rating, comment, productId }) => {
            return new Promise((resolve) => {
              console.log("Submit review:", { rating, comment, productId });
              setTimeout(() => {
                queryClient.invalidateQueries({
                  queryKey: ["get_product_by_id", productId],
                });
                resolve();
              }, 1000);
            });
          }}
        />
      </Container>
    </>
  );
};

export default ProductDetail;
