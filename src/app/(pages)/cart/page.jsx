"use client";

import React from "react";
import Container from "@/app/components/layouts/Container";
import { HeadTypo, BodyTypo, FootTypo } from "@/app/components/ui/Typography";
import Button2 from "@/app/components/ui/Buttons/Button2";
import { BorderBox } from "@/app/components/ui/BorderBox";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";
import CartItem from "@/app/components/ui/cartItem/CartItem";
import { useGetListCart } from "@/app/queries/list/cart.query";
import DataMapper from "@/app/components/DataMapper";
import { useUser } from "@/app/providers/userprovider";
import EmptyState from "@/app/components/EmptyState";
import { Skeleton } from "@mui/material";
import { CiShoppingBasket } from "react-icons/ci";
import { TbCurrencyDong } from "react-icons/tb";
import { useDeleteCartItem } from "@/app/queries/cart/cart.query";
import { useUpdateQuantity } from "@/app/queries/cart/cart.query";
import { debounce } from "lodash";

const Cart = () => {
  const { user } = useUser();
  const { data: cartData, isLoading } = useGetListCart(user?.id, {
    enabled: !!user?.id,
  });

  const { mutate: deleteCartItem } = useDeleteCartItem();
  const { mutate: updateQuantity } = useUpdateQuantity();
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const cartItems = Array.isArray(cartData?.cartItems)
    ? cartData.cartItems
    : [];

  const isCartEmpty = cartItems.length === 0;

  const handleDeleteCartItem = (productId) => {
    deleteCartItem({ accountId: user?.id, productId });
  };

  const handleQuantityChange = React.useRef(
    debounce((newQuantity, productId, accountId, updateQuantity) => {
      updateQuantity({ accountId, productId, quantity: newQuantity });
    }, 500)
  ).current;

  return (
    <Container>
      <section className="w-full min-h-screen mx-auto 2xl:px-0">
        <BodyTypo bodylabel="Cart item" />
        <main className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          {/* left Cart */}

          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              <DataMapper
                data={cartItems}
                Component={CartItem}
                emptyStateComponent={
                  <EmptyState
                    title="Cart is empty"
                    subtitle="Go buy some products now"
                    showBtn={true}
                    label="Shop now"
                    icon={<CiShoppingBasket size={20} />}
                    linkTo="/products"
                  />
                }
                loading={isLoading}
                getKey={(item) => item.id}
                componentProps={(product) => ({
                  image: product.image || <Skeleton animation="wave" />,
                  productId: product.productId,
                  productName: product.productName,
                  price: product.unitPrice,
                  quantity: product.quantity,
                  id: product.id,
                  href: `/products/${generateSlug(product.productName)}`,
                  onDelete: () => handleDeleteCartItem(product.productId),
                  onChangeQuantity: (newQuantity) =>
                    handleQuantityChange(
                      newQuantity,
                      product.productId,
                      user.id,
                      updateQuantity
                    ),
                })}
              />
            </div>
          </div>

          {/* right Cart */}

          {!isCartEmpty && (
            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <BorderBox>
                <FootTypo footlabel="Order Summary" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <HeadTypo label="Total price" />
                      <div className="inline-flex">
                        <TbCurrencyDong size={20} />
                        <HeadTypo
                          label={new Intl.NumberFormat("vi-VN").format(
                            cartData?.totalPrice
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <HeadTypo label="Discount" />
                      <div className="inline-flex">
                        <TbCurrencyDong size={20} />
                        <HeadTypo label="- 100" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <HeadTypo label="Total" />
                      <div className="inline-flex">
                        <TbCurrencyDong size={20} />
                        <HeadTypo label="10000" />
                      </div>
                    </div>
                  </div>
                </div>
                <Button2
                  label="Checkout"
                  onClick={() => {}}
                  btnClass="w-full"
                  labelClass="justify-center p-3 z-0"
                />
                <div className="flex items-center justify-center gap-2">
                  <span className="">or</span>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-sm font-medium text-red underline hover:no-underline dark:text-primary-500"
                  >
                    Continue Shopping <MdKeyboardArrowRight size={20} />
                  </Link>
                </div>
              </BorderBox>
            </div>
          )}
        </main>
      </section>
    </Container>
  );
};

export default Cart;
