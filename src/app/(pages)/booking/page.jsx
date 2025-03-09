"use client";

import React from "react";
import AuroraBg from "@/app/components/ui/animated/AuroraBg";
import Input from "@/app/components/ui/inputs/Input";
import { FcSearch } from "react-icons/fc";
import { useGetListDecorService } from "@/app/queries/list/service.query";
import DataMapper from "@/app/components/DataMapper";
import ServiceCard from "@/app/components/ui/card/ServiceCard";
import EmptyState from "@/app/components/EmptyState";
import RollingGallery from "@/app/components/ui/animated/RollingGallery";
import Container from "@/app/components/layouts/Container";

const BookingPage = () => {
  const {
    data: listDecorService,
    isLoading,
    isError,
  } = useGetListDecorService();

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <>
      <AuroraBg
        colorStops={["#5fc1f1", "#5fc1f1", "#5fc1f1"]}
        blend={1}
        amplitude={1}
        speed={0}
      >
        <div className="absolute pb-40 pt-10 md:pt-20 px-2 w-full md:px-4 lg:px-8">
          <div className="relative pb-4 md:pb-20 flex flex-col items-center justify-center px-8  md:px-8 w-full ">
            <div className="relative flex flex-col items-center justify-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-8 mt-20 relative text-center max-w-6xl mx-auto !leading-snug dark:text-white">
                Browse all services from providers
                <span>
                  <br className="hidden md:block" />
                </span>
              </h1>
              <h2 className="relative font-regular text-base md:text-xl tracking-wide mb-8 text-center max-w-3xl mx-auto antialiased">
                With an intuitive interface, users can browse through a range of
                services, view detailed provider profiles, and check
                availability in real-time. The page includes essential features
                such as search and filtering options, provider ratings and
                reviews, and secure payment integrations for a smooth booking
                experience
              </h2>
              <div className="flex relative sm:flex-row flex-col space-y-2 justify-center dark:text-white sm:space-y-0 sm:space-x-4 sm:justify-center mb-4 w-full"></div>

              <div className="flex gap-4 items-center justify-center w-full pb-5">
                <Input
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  placeholder="Search for services"
                  icon={<FcSearch size={20} />}
                  className="w-[400px]"
                />
              </div>
            </div>
          </div>
        </div>
      </AuroraBg>
      <RollingGallery autoplay={true} pauseOnHover={false} />
      <div className="bg-[linear-gradient(to_right,transparent_1%,var(--gray-50)_10%,var(--gray-50)_90%,transparent_99%)] pb-20 pt-20 dark:bg-[linear-gradient(to_right,transparent_0%,var(--neutral-900)_10%,var(--neutral-900)_90%,transparent_100%)] md:pt-32">
        <Container>
          <div className="flex flex-col gap-10 md:gap-20">
            <DataMapper
              data={listDecorService}
              Component={ServiceCard}
              loading={isLoading}
              emptyStateComponent={
                <EmptyState title="No decor services available" />
              }
              getKey={(service) => service.id}
              componentProps={(service) => ({
                style: service.style,
                description: service.description,
                images: service.images,
                id: service.id,
                href: `/booking/${generateSlug(service.style)}`
              })}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default BookingPage;
