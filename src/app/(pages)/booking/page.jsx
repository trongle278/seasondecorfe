"use client";

import React, { useState } from "react";
import AuroraBg from "@/app/components/ui/animated/AuroraBg";
import Input from "@/app/components/ui/inputs/Input";
import { FcSearch } from "react-icons/fc";
import { useGetListDecorService } from "@/app/queries/list/service.list.query";
import DataMapper from "@/app/components/DataMapper";
import ServiceCard from "@/app/components/ui/card/ServiceCard";
import EmptyState from "@/app/components/EmptyState";
import RollingGallery from "@/app/components/ui/animated/RollingGallery";
import Container from "@/app/components/layouts/Container";
import { ListSidebar } from "@/app/components/ui/ListWrapper";
import { MultiSearch } from "@/app/components/ui/search/MultiSearch";
import { generateSlug } from "@/app/helpers";

const filters = [
  {
    label: "Season",
    options: [
      { id: 0, name: "All" },
      { id: 1, name: "Winter" },
      { id: 2, name: "Spring" },
      { id: 3, name: "Summer" },
      { id: 4, name: "Autumn" },
      { id: 5, name: "Christmas" },
      { id: 6, name: "New Year" },
    ],
  },
  {
    label: "Category",
    options: [
      { id: 0, name: "All" },
      { id: 1, name: "Living room" },
      { id: 2, name: "Dining room" },
      { id: 3, name: "Kitchen" },
      { id: 4, name: "Bathroom" },
      { id: 5, name: "Bedroom" },
      { id: 6, name: "Other" },
    ],
  },
];

const BookingPage = () => {
  const {
    data: listDecorService,
    isLoading: isInitialLoading,
    isError,
    refetch: refetchInitialList
  } = useGetListDecorService();

  // State to hold search results
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Handle scroll event
  React.useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search results
  const handleSearchResults = (results) => {
    if (results === null) {
      setSearchResults(null);
      setHasSearched(false);
      refetchInitialList();
    } else {
      setSearchResults(results);
      setHasSearched(true);
    }
    setIsSearching(false);
  };

  // Data to display (either search results or initial list)
  const displayData = hasSearched ? searchResults?.data : listDecorService;
  const isLoading = isInitialLoading || isSearching;

  return (
    <>
      <AuroraBg
        colorStops={["#0e87eb", "#0e87eb", "#0e87eb"]}
        blend={1}
        amplitude={1}
        speed={0}
      >
        <div className="absolute pb-40 pt-10 md:pt-20 px-2 w-full md:px-4 lg:px-8">
          <div className="relative pb-4 md:pb-20 flex flex-col items-center justify-center px-8 md:px-8 w-full">
            <div className="relative flex flex-col items-center justify-center w-full">
              <h1 className="text-4xl md:text-6xl font-bold mb-8 mt-20 relative text-center max-w-6xl mx-auto !leading-snug dark:text-white">
                Explore All Decor Services
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

              <div className={`flex gap-4 items-center justify-center w-full max-w-[1000px] justify-self-center pb-5 transition-all duration-500 ${
                isSticky 
                  ? 'fixed top-1 left-0 right-0 z-[50] bg-transparent dark:bg-black px-4' 
                  : ''
              }`}>
                <MultiSearch 
                  onSearchResults={handleSearchResults}
                  onSearch={() => {
                    setIsSearching(true);
                    setHasSearched(false);
                  }}
                />                
              </div>
            </div>
          </div>
        </div>
      </AuroraBg>
      {isSticky && <div className="h-[100px]" />}
      <RollingGallery autoplay={true} pauseOnHover={false} />
      <div className="bg-[linear-gradient(to_right,transparent_1%,var(--gray-50)_10%,var(--gray-50)_90%,transparent_99%)] pb-20 dark:bg-[linear-gradient(to_right,transparent_0%,var(--neutral-900)_10%,var(--neutral-900)_90%,transparent_100%)]">
        <Container>
          <div className="mb-20 ">
            <ListSidebar
              filters={filters}
              className="max-w-[450px]"
            />
          </div>
          <div className="flex flex-col gap-10 md:gap-20">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
              </div>
            ) : (
              <>
                {(!displayData || displayData.length === 0) ? (
                  <EmptyState 
                    title={hasSearched ? "No services found matching your search" : "No decor services available"} 
                    description={hasSearched ? "Try adjusting your search criteria" : "Please check back later"}
                  />
                ) : (
                  <DataMapper
                    data={displayData}
                    Component={ServiceCard}
                    getKey={(service) => service.id}
                    componentProps={(service) => ({
                      style: service.style,
                      description: service.description,
                      images: service.images,
                      id: service.id,
                      seasons: service.seasons,
                      category: service.categoryName,
                      province: service.province,
                      href: `/booking/${generateSlug(service.style)}`,
                    })}
                  />
                )}
              </>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default BookingPage;
