"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import { FootTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetListDecorService } from "@/app/queries/list/service.list.query";
import { useGetDecorServiceById } from "@/app/queries/service/service.query";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import {
  MdFavoriteBorder,
  MdFavorite,
  MdLocationOn,
  MdCategory,
} from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { useAddFavoriteDecorService } from "@/app/queries/favorite/favorit.query";
import { useUser } from "@/app/providers/userprovider";
import { useGetListFavorite } from "@/app/queries/list/favorite.list.query";
import { useQueryClient } from "@tanstack/react-query";
import { generateSlug, getSeasonConfig } from "@/app/helpers";
import ReviewSection from "@/app/components/ui/review/ReviewSection";
import OverallRating from "@/app/components/ui/review/OverallRating";
import ReviewCard from "@/app/components/ui/card/ReviewCard";
import { FaFlag } from "react-icons/fa";
import Link from "next/link";
import HostSection from "@/app/(pages)/booking/components/HostSection";
import { Skeleton } from "@mui/material";
import useInfoModal from "@/app/hooks/useInfoModal";
import PickDate from "@/app/(pages)/booking/components/PickDate";
import { useBookService } from "@/app/queries/book/book.query";
import { useForm } from "react-hook-form";
import DropdownSelectReturnObj from "@/app/components/ui/Select/DropdownObject";
import { useGetAllAddress } from "@/app/queries/user/address.query";
import { useRouter } from "next/navigation";
import { seasons } from "@/app/constant/season";
import { useGetPaginatedBookingsForCustomer } from "@/app/queries/list/booking.list.query";
import { CgSpinner } from "react-icons/cg";
import { FcFolder } from "react-icons/fc";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { toast } from "sonner";

const ServiceDetail = () => {
  const pagination = {
    pageIndex: 1,
    pageSize: 10,
  };
  const router = useRouter();
  const { slug } = useParams();
  const [serviceId, setServiceId] = React.useState(null);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const infoModal = useInfoModal();
  const { mutate: bookService, isPending: isBookingPending } = useBookService();
  const [selectedBookingData, setSelectedBookingData] = React.useState(null);
  const { data: addressData, isLoading: addressLoading } = useGetAllAddress();
  const { data: bookings, isLoading: isBookingsLoading } =
    useGetPaginatedBookingsForCustomer(pagination);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const { data: serviceDetail, isLoading } = useGetDecorServiceById(serviceId);
  const { data: favorites, isLoading: isLoadingFavorites } =
    useGetListFavorite();

  const { mutate: addFavoriteDecorService, isPending } =
    useAddFavoriteDecorService();

  // Use pagination to prevent loading all services at once
  const { data: listDecorService } = useGetListDecorService({
    pageIndex: 1,
    pageSize: 10,
    forcePagination: true,
  });

  useEffect(() => {
    setSelectedAddress(null);
    reset();

    if (listDecorService?.data) {
      const matchedService = listDecorService.data.find(
        (p) => generateSlug(p.style) === slug
      );
      if (matchedService) {
        setServiceId(matchedService.id);
      } else {
        // If not found in first page, fetch the service by slug directly
        // This should be implemented in a real API endpoint
        console.log("Service not found in first page");
      }
    }
  }, [listDecorService, slug]);

  // Check if the current user is the service provider
  const isServiceProvider = React.useMemo(() => {
    if (!user || !serviceDetail) return false;
    return user.id === serviceDetail.accountId;
  }, [user, serviceDetail]);

  // Check if the service is already in favorites
  const isInFavorites = React.useMemo(() => {
    if (!favorites || !serviceId) return false;
    return favorites.some((fav) => fav.decorServiceDetails.id === serviceId);
  }, [favorites, serviceId]);

  // Check if the service is already in booking
  const isBooked = React.useMemo(() => {
    if (!bookings?.data || !serviceId) return false;
    return bookings?.data.some((fav) => fav.decorService.id === serviceId);
  }, [bookings, serviceId]);

  const handleAddToFavorites = () => {
    if (isInFavorites) return;

    addFavoriteDecorService(serviceId, {
      onSuccess: () => {
        console.log("Added to favorite");
        queryClient.invalidateQueries({ queryKey: ["get_list_favorite"] });
      },
      onError: (error) => {
        console.log("Error adding to favorite:", error);
      },
    });
  };

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

  const onSubmit = (data) => {
    if (!selectedAddress || !selectedBookingData) {
      alert("Please select both an address and a date before booking");
      return;
    }

    console.log("Selected booking data:", selectedBookingData);

    const bookingData = {
      decorServiceId: serviceDetail.id,
      addressId: selectedAddress.value,
      surveyDate: selectedBookingData.date,
    };

    console.log("Booking data being sent:", bookingData);

    bookService(bookingData, {
      onSuccess: () => {
        console.log("Booking successful");
        alert(
          `Booking successful! Your survey is scheduled for ${selectedBookingData.formattedDate}`
        );
      },
      onError: (error) => {
        toast.error(error.message);
        console.error("Error booking service:", error);
      },
    });
  };

  if (!serviceDetail) {
    return (
      <div className="text-center mt-20">
        <FootTypo footlabel="Service not found" className="text-primary" />
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height="100%" />;
  }

  return (
    <Container>
      <div className="my-7">
        <MuiBreadcrumbs />
      </div>
      <div
        className={`mx-auto w-full min-w-0 md:px-0 mt-10 relative ${
          isServiceProvider ? "pointer-events-none" : ""
        }`}
      >
        {isServiceProvider && (
          <div className="absolute inset-[-20] bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 rounded-lg">
            <div className="flex flex-col items-center justify-center h-full">
              <FootTypo
                footlabel="You are the provider of this service"
                className="font-bold text-2xl bg-primary text-white rounded-lg p-2"
              />
            </div>
          </div>
        )}
        {/* Service Name */}
        <div className="mb-6">
          <FootTypo
            footlabel={serviceDetail.style || "Service Not Found"}
            className="text-3xl font-bold text-black dark:text-white mb-2"
          />
        </div>

        {/* Image Gallery - Airbnb Style */}
        {serviceDetail.images?.length > 0 ? (
          <div className="relative mb-10 cursor-pointer">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
                <Image
                  src={serviceDetail.images[0]?.imageURL}
                  alt="Primary image"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Grid of smaller images */}
              <div className="hidden md:grid grid-cols-2 gap-2">
                {serviceDetail.images.slice(1, 5).map((img, index) => (
                  <div
                    key={index}
                    className="relative h-[244px] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={img.imageURL}
                      alt={`Room image ${index + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile only: Small images row */}
              <div className="grid grid-cols-3 gap-2 md:hidden">
                {serviceDetail.images.slice(1, 4).map((img, index) => (
                  <div
                    key={index}
                    className="relative h-[120px] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={img.imageURL}
                      alt={`Room image ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 p-12 border rounded-lg mb-10">
            <p>No images available</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex flex-row items-center gap-2">
                <MdCategory size={20} />
                <FootTypo
                  footlabel="This service is suitable for"
                  className="!m-0 font-bold text-sm"
                />
              </span>

              <div className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium">
                {serviceDetail.categoryName || "Uncategorized"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <FootTypo
                footlabel="Suitable for:"
                className="!m-0 font-bold text-sm"
              />
              <div className="flex flex-wrap gap-2">
                {serviceDetail.seasons && serviceDetail.seasons.length > 0 ? (
                  serviceDetail.seasons.map((season, index) => {
                    const { icon, bgColor } = getSeasonConfig(
                      season.seasonName,
                      seasons
                    );
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-white ${bgColor} rounded-xl py-1 px-3 text-xs font-medium`}
                      >
                        {icon}
                        {season.seasonName}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-gray-500 text-sm">All seasons</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MdLocationOn size={20} />
              <span className="text-sm font-medium">
                {serviceDetail.sublocation || "Location not specified"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MdFavorite size={20} />
              <FootTypo
                footlabel="People liked : "
                className="!m-0 font-bold text-sm"
              />
              <span className="text-sm font-medium">
                {serviceDetail.favoriteCount || "No favorite yet"}
              </span>
            </div>
            <div className="space-y-6">
              <div>
                <FootTypo
                  footlabel="Description"
                  className="!m-0 font-bold text-lg"
                />
                <div className="mt-3 rounded-lg">
                  <p className="whitespace-pre-line break-words line-clamp-6 text-gray-700 dark:text-gray-300 pb-3">
                    {serviceDetail.description || "No description available"}
                  </p>
                  <button
                    className="text-primary font-semibold underline"
                    onClick={() =>
                      infoModal.onOpen({
                        title: `${serviceDetail.style}`,
                        description:
                          serviceDetail.description ||
                          "No description available",
                      })
                    }
                  >
                    Read more
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t mt-8">
                {!isServiceProvider ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      label={isBooked ? "Waiting for confirmation" : "Book now"}
                      className={`${isBooked ? "bg-yellow" : "bg-primary"}`}
                      icon={
                        isBooked ? (
                          <CgSpinner className="animate-spin" size={20} />
                        ) : (
                          <IoCallOutline size={20} />
                        )
                      }
                      disabled={
                        isBooked || !selectedAddress || !selectedBookingData
                      }
                      onClick={handleSubmit(onSubmit)}
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
                  </div>
                ) : (
                  <div className="p-4 rounded-lg text-center">
                    <p className="text-gray-500 italic">
                      You are the provider of this service
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-5 mb-5 w-full">
              {isBooked ? (
                <BorderBox>
                  <div className="flex flex-row items-center gap-2 rounded-lg mb-4">
                    <FcFolder size={20} />
                    <FootTypo
                      footlabel="You have a pending booking for this service"
                      className="!m-0 font-semibold"
                    />
                  </div>
                  <Link
                    href="/booking/request"
                    className="font-semibold underline"
                  >
                    View my booking
                  </Link>
                </BorderBox>
              ) : (
                <>
                  <FootTypo
                    footlabel="Where to survey"
                    className="!m-0 font-bold text-lg"
                  />
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
                      isDisabled={isBooked}
                    />
                  ) : (
                    <button
                      onClick={() => router.push("/user/account/address")}
                      className="py-2 text-gray-500 bg-primary text-white rounded-md px-4"
                      disabled={isBooked}
                    >
                      Add new address
                    </button>
                  )}
                </>
              )}
            </div>

            {!isBooked && (
              <PickDate
                availableDates={serviceDetail.availableDates || []}
                onDateSelect={(dateData) => {
                  console.log("Selected date data:", dateData);
                  setSelectedBookingData(dateData);
                }}
              />
            )}

            <Link
              href="/report"
              className="flex items-center justify-center gap-2 mt-10"
            >
              <FaFlag size={14} />
              <FootTypo
                footlabel="Report this service"
                className="!m-0 font-bold text-sm underline"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Ratings and Reviews Section */}
      <section className="mt-16 border-t pt-8">
        <FootTypo
          footlabel="Ratings, reviews, and reliability"
          className="!m-0 text-2xl font-bold mb-8"
        />

        {/* Ratings Overview */}
        <OverallRating
          overallRating={serviceDetail.averageRating || 5.0}
          cleanliness={5.0}
          accuracy={5.0}
          checkIn={5.0}
          communication={4.9}
          location={4.9}
          value={4.8}
        />
      </section>

      {/* Full ReviewSection with form (can be kept or removed) */}
      <div className="mt-10">
        <ReviewSection
          label="Leave a review"
          reviews={[]}
          serviceId={serviceId}
          averageRating={serviceDetail.averageRating || 0}
          totalReviews={serviceDetail.reviews?.length || 0}
          onAddReview={({ rating, comment, serviceId }) => {
            return new Promise((resolve) => {
              console.log("Submit review:", { rating, comment, serviceId });
              setTimeout(() => {
                queryClient.invalidateQueries({
                  queryKey: ["get_decor_service_by_id", serviceId],
                });
                resolve();
              }, 1000);
            });
          }}
        />
      </div>
      {/* Individual Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-8">
        <ReviewCard />
        <div className="col-span-2 text-center py-10">
          <p className="text-gray-500">No reviews yet</p>
        </div>
      </div>

      <div className="mt-10">
        <HostSection
          //href={`/provider/${serviceDetail.provider.slug}`}
          avatar={serviceDetail.provider.avatar}
          name={serviceDetail.provider.businessName}
          joinDate={serviceDetail.provider.joinedDate}
          followers={serviceDetail.provider.followersCount}
        />
      </div>
    </Container>
  );
};

export default ServiceDetail;
