"use client";

import React from "react";
import Container from "@/app/components/layouts/Container";
import { FootTypo } from "@/app/components/ui/Typography";
import Button from "@/app/components/ui/Buttons/Button";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetListDecorService } from "@/app/queries/list/service.query";
import { useGetDecorServiceById } from "@/app/queries/service/service.query";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { ClipLoader } from "react-spinners";
import { MdFavoriteBorder } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";

const ServiceDetail = () => {
  const { slug } = useParams();
  const [serviceId, setServiceId] = React.useState(null);

  const { data: serviceDetail, isLoading } = useGetDecorServiceById(serviceId);

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

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (!serviceDetail) {
    return (
      <p className="text-center mt-20">
        <ClipLoader size={20} />
      </p>
    );
  }

  return (
    <Container>
      <div className="my-7">
        <MuiBreadcrumbs />
      </div>
      <div className="mx-auto w-full min-w-0 px-4 md:px-0">
        <div className="relative overflow-hidden bg-[linear-gradient(to_right,transparent_1%,var(--gray-50)_10%,var(--gray-50)_90%,transparent_99%)] py-4 dark:bg-[linear-gradient(to_right,transparent_0%,var(--neutral-950)_10%,var(--neutral-950)_90%,transparent_100%)] md:py-10">
          <div className="">
            <div className="relative z-20 mb-4 flex flex-col items-center justify-between text-sm text-muted-foreground md:flex-row md:items-end">
              <div className="gap-2">
                <FootTypo
                  footlabel={serviceDetail.style || "Service Not Found"}
                  className="mb-6 scroll-m-20 text-center text-4xl font-bold tracking-tight text-black dark:text-white md:text-left"
                />
                <FootTypo
                  footlabel={
                    serviceDetail.description || "No description available"
                  }
                  className="!mb-6 max-w-xl text-center text-lg text-muted-foreground md:text-left"
                />
              </div>
              <div className="flex flex-col items-center md:items-end">
                <div className="mt-6 flex flex-col justify-center md:justify-start">
                  <div className="flex flex-col justify-center gap-2 sm:flex-row md:justify-start">
                    <Button
                      label="Book now"
                      className="bg-primary"
                      icon={<IoCallOutline size={20} />}
                    />
                    <Button
                      label="Add to Whislist"
                      className="bg-yellow"
                      icon={<MdFavoriteBorder size={20} />}                  
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-12 pt-8">
          <div className="grid w-full grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:px-0">
            <div className="relative">
              {serviceDetail.images?.length > 0 ? (
                serviceDetail.images.map((img, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={img.imageURL}
                      alt={`service-${index}`}
                      width={500}
                      height={500}
                      className="transition duration-300 blur-0 aspect-video w-full rounded-md border border-neutral-200 object-cover object-center shadow-sm dark:border-neutral-800"
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No images available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ServiceDetail;
