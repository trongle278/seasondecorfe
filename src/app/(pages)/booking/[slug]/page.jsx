"use client";

import React from "react";
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
import { getSeasonConfig } from "@/app/components/ui/card/ServiceCard";
import { generateSlug } from "@/app/helpers";
import ReviewSection from "@/app/components/ui/review/ReviewSection";
import OverallRating from "@/app/components/ui/review/OverallRating";
import ReviewCard from "@/app/components/ui/card/ReviewCard";
import { BiPhotoAlbum } from "react-icons/bi";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { FaFlag } from "react-icons/fa";
import Link from "next/link";

const ServiceDetail = () => {
  const { slug } = useParams();
  const [serviceId, setServiceId] = React.useState(null);
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: serviceDetail, isLoading } = useGetDecorServiceById(serviceId);
  const { data: favorites, isLoading: isLoadingFavorites } =
    useGetListFavorite();

  const { mutate: addFavoriteDecorService, isPending } =
    useAddFavoriteDecorService();

  const { data: services } = useGetListDecorService();

  React.useEffect(() => {
    if (services) {
      console.log(services);
      const matchedService = services.find(
        (p) => generateSlug(p.style) === slug
      );
      if (matchedService) {
        setServiceId(matchedService.id);
      }
    }
  }, [services, slug]);

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

  if (!serviceDetail) {
    return (
      <div className="text-center mt-20">
        <FootTypo footlabel="Service not found" className="text-primary" />
      </div>
    );
  }

  return (
    <Container>
      <div className="my-7">
        <MuiBreadcrumbs />
      </div>
      <div className="mx-auto w-full min-w-0 md:px-0 mt-10">
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
              <div className="relative aspect-[4/3] md:aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={serviceDetail.images[0]?.imageURL}
                  alt="Primary image"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Grid of smaller images */}
              <div className="hidden md:grid grid-cols-2 gap-2">
                {serviceDetail.images.slice(1, 5).map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg"
                  >
                    <Image
                      src={img.imageURL}
                      alt={`Room image ${index + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile only: Small images row */}
              <div className="grid grid-cols-3 gap-2 md:hidden">
                {serviceDetail.images.slice(1, 4).map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg"
                  >
                    <Image
                      src={img.imageURL}
                      alt={`Room image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button className="absolute bottom-3 right-3 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 transition-colors">
              <BiPhotoAlbum size={18} />
              Show all photos
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500 p-12 border rounded-lg mb-10">
            <p>No images available</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MdCategory size={20} />
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
                      season.seasonName
                    );
                    return (
                      <div
                        key={index}
                        className={`flex items-center text-white ${bgColor} rounded-xl py-1 px-3 text-xs font-medium`}
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
                {serviceDetail.province || "Location not specified"}
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
                  <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                    {serviceDetail.description || "No description available"}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t mt-8">
                {!isServiceProvider ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      label="Book now"
                      className="bg-primary"
                      icon={<IoCallOutline size={20} />}
                    />
                    <Button
                      label={
                        isInFavorites ? "In your wishlist" : "Add to Wishlist"
                      }
                      className={isInFavorites ? "bg-green-600" : "bg-yellow"}
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
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500 italic">
                      You are the provider of this service
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <BorderBox className="shadow-xl">
              <FootTypo
                footlabel="Service available"
                className="!m-0 font-bold text-lg"
              />
            </BorderBox>

            <Link href="/report" className="flex items-center gap-2 mt-10">
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
      <div className="mt-16 border-t pt-8">
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
      </div>

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
    </Container>
  );
};

export default ServiceDetail;
