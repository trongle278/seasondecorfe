"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { useDeleteCartItem } from "@/app/queries/cart/cart.query";
import { useUpdateQuantity } from "@/app/queries/cart/cart.query";
import { debounce } from "lodash";
import { generateSlug } from "@/app/helpers";
import { formatCurrency } from "@/app/helpers";
import { useGetAllAddress } from "@/app/queries/user/address.query";
import DropdownSelectReturnObj from "@/app/components/ui/Select/DropdownObject";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/app/queries/order/order.query";


const Cart = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { user } = useUser();
  const { data: cartData, isLoading } = useGetListCart(user?.id, {
    enabled: !!user?.id,
  });

  const { mutate: deleteCartItem } = useDeleteCartItem();
  const { mutate: updateQuantity } = useUpdateQuantity();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const { data: addressData, isLoading: addressLoading } = useGetAllAddress();

  const cartItems = Array.isArray(cartData?.cartItems)
    ? cartData.cartItems
    : [];

  const isCartEmpty = cartItems.length === 0;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      cartId: "",
      addressId: "",
    },
  });

  // Set initial form values when data is loaded
  useEffect(() => {
    if (cartData?.id) {
      setValue("cartId", cartData.id);
      console.log("cartId:", cartData.id);
    }
  }, [cartData, setValue]);


  const onSubmit = (data) => {
    console.log("Form data for order:", data);
    
    // Validate data before submitting
    if (!data.cartId) {
      console.error("Cart ID is missing");
      alert("Cart ID is missing. Please try again.");
      return;
    }
    
    if (!data.addressId) {
      console.error("Address ID is missing");
      alert("Please select a shipping address.");
      return;
    }
    
    // Create FormData object for the API request
    const formData = new FormData();
    formData.append("id", data.cartId);
    formData.append("addressId", data.addressId);

    // Log the FormData entries for debugging
    console.log("Creating order with FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    createOrder(formData, {
      onSuccess: (response) => {
        console.log("Order created successfully:", response);
        router.push("/user/orders/pending");
      },
      onError: (error) => {
        console.error("Error creating order:", error);
      },
    });
  };

  const handleDeleteCartItem = (productId) => {
    deleteCartItem({ accountId: user?.id, productId });
  };

  const handleQuantityChange = React.useRef(
    debounce((newQuantity, productId, accountId, updateQuantity) => {
      updateQuantity({ accountId, productId, quantity: newQuantity });
    }, 500)
  ).current;

  const formatAddress = (address) => {
    if (!address) return "No address available";

    const parts = [];
    // if (address.detail) parts.push(address.detail);
    if (address.street) parts.push(address.street);
    if (address.ward) parts.push(address.ward);
    if (address.district) parts.push(address.district);
    if (address.province) parts.push(address.province);

    return parts.join(", ");
  };

  const addressOptions =
    addressData?.map((address) => ({
      value: address.id,
      label: formatAddress(address),
      isDefault: address.isDefault,
    })) || [];

  const handleAddressChange = (selected) => {
    console.log("Address selection changed:", selected);
    if (selected) {
      setSelectedAddress(selected);
      setValue("addressId", selected.value);
      console.log("Selected Address ID:", selected.value);
    }
  };

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
                <FootTypo footlabel="Shipping address" />
                {addressLoading ? (
                  <Skeleton height={56} animation="wave" />
                ) : addressOptions.length > 0 ? (
                  <DropdownSelectReturnObj
                    options={addressOptions}
                    value={selectedAddress}
                    onChange={handleAddressChange}
                    labelKey="label"
                    valueKey="value"
                    returnObject={true}
                    lisboxClassName="mt-11"
                    placeholder="Select a shipping address"
                    
                  />
                ) : (
                  <button
                    onClick={() => router.push("/user/account/address")}
                    className="py-2 text-gray-500 bg-primary text-white rounded-md px-4"
                  >
                    Add new address
                  </button>
                )}
              </BorderBox>
              <BorderBox>
                <FootTypo footlabel="Order Summary" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <HeadTypo label="Total price" />
                      <div className="inline-flex">
                        <HeadTypo
                          label={formatCurrency(cartData?.totalPrice)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <HeadTypo label="Discount" />
                      <div className="inline-flex">
                        <HeadTypo label={`- ${formatCurrency(0)}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <HeadTypo label="Total" />
                      <div className="inline-flex">
                        <HeadTypo
                          label={formatCurrency(cartData?.totalPrice)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button2
                  label="Checkout"
                  onClick={handleSubmit(onSubmit)}
                  btnClass="w-full"
                  labelClass="justify-center p-3 z-0"
                  disabled={!selectedAddress || isCreatingOrder || !cartData?.id}
                  loading={isCreatingOrder}
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
