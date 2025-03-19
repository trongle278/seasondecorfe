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
import { MdFavoriteBorder, MdFavorite, MdLocationOn, MdCategory } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { useAddFavoriteDecorService } from "@/app/queries/favorite/favorit.query";
import { useUser } from "@/app/providers/userprovider";
import { useGetListFavorite } from "@/app/queries/list/favorite.list.query";
import { useQueryClient } from "@tanstack/react-query";
import { getSeasonConfig } from "@/app/components/ui/card/ServiceCard";
import { generateSlug } from "@/app/helpers";
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
    return favorites.some((fav) => fav.decorServiceId === serviceId);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="order-2 md:order-1">
            <div className="grid grid-cols-1 gap-4">
              {serviceDetail.images?.length > 0 ? (
                serviceDetail.images.map((img, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={img.imageURL}
                      alt={`service-${index}`}
                      width={800}
                      height={600}
                      className="transition duration-300 blur-0 w-full rounded-lg border border-neutral-200 object-cover object-center shadow-md dark:border-neutral-800"
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 p-12 border rounded-lg">No images available</p>
              )}
            </div>
          </div>
    
          <div className="order-1 md:order-2 p-4">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-black dark:text-white">
                {serviceDetail.style || "Service Not Found"}
              </h1>
              <div className="flex items-center gap-2">
                <MdCategory size={20} />
                <div className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium">
                  {serviceDetail.categoryName || "Uncategorized"}
                </div>
              </div>

              {/* Season Tags */}
              <div className="flex flex-wrap gap-2 items-center">
                <FootTypo footlabel="Suitable for:" className="!m-0 font-bold text-sm" />
                <div className="flex flex-wrap gap-2">
                  {serviceDetail.seasons && serviceDetail.seasons.length > 0 ? (
                    serviceDetail.seasons.map((season, index) => {
                      const { icon, bgColor } = getSeasonConfig(season.seasonName);
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
                <FootTypo footlabel="People liked : " className="!m-0 font-bold text-sm" />
                <span className="text-sm font-medium">
                  {serviceDetail.favoriteCount || "No favorite yet"}
                </span>
              </div>

              <div className="mt-4">
                <FootTypo footlabel="Description" className="!m-0 font-bold text-lg" />
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
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
                      label={isInFavorites ? "In your wishlist" : "Add to Wishlist"}
                      className={isInFavorites ? "bg-green-600" : "bg-yellow"}
                      icon={isInFavorites ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
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
        </div>
      </div>
    </Container>
  );
};

export default ServiceDetail;
