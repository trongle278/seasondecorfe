"use client";

import React, { useState, useEffect } from "react";
import AuroraBg from "@/app/components/ui/animated/AuroraBg";
import { useGetListDecorService } from "@/app/queries/list/service.list.query";
import DataMapper from "@/app/components/DataMapper";
import ServiceCard from "@/app/components/ui/card/ServiceCard";
import EmptyState from "@/app/components/EmptyState";
import RollingGallery from "@/app/components/ui/animated/RollingGallery";
import Container from "@/app/components/layouts/Container";
import { ListSidebar } from "@/app/components/ui/ListWrapper";
import { MultiSearch } from "@/app/components/ui/search/MultiSearch";
import { generateSlug } from "@/app/helpers";
import Button from "@/app/components/ui/Buttons/Button";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

const filters = [
  {
    label: "Sort by",
    options: [
      { id: 0, name: "All" },
      { id: 1, name: "Newest" },
      { id: 2, name: "Oldest" },
      { id: 3, name: "Rating" },
    ],
  },
];

const BookingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; 

  const {
    data: listDecorService,
    isLoading: isInitialLoading,
    isError,
    refetch: refetchInitialList,
  } = useGetListDecorService({
    pageIndex: currentPage,
    pageSize: pageSize,
    // Force pagination to be used for all requests
    forcePagination: true 
  });

  // State to hold search results
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  
  // Calculate correct total pages based on totalCount and pageSize
  const calculatedTotalPages = listDecorService?.totalCount 
    ? Math.ceil(listDecorService.totalCount / pageSize) 
    : 0;

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search results
  const handleSearchResults = (results) => {
    setIsSearching(false);
    if (results === null) {
      setHasSearched(false);
      setSearchResults(null);
      setCurrentPage(1); // Reset to page 1
      // Explicitly set page size again when returning to default listing
      refetchInitialList().then(() => {
        //console.log("Refetched with page size:", pageSize);
      });
      return;
    }
    setSearchResults(results);
    setHasSearched(true);
  };

  // Data to display (either search results or current page data)
  const displayData = hasSearched 
    ? searchResults?.data 
    : listDecorService?.data || [];
  
  const isLoading = isInitialLoading || isSearching;

  // Pagination controls
  const handleLoadMore = () => {
    if (calculatedTotalPages && currentPage < calculatedTotalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <>
      <AuroraBg
        colorStops={["#5fc1f1", "#5fc1f1", "#5fc1f1"]}
        blend={1}
        amplitude={0}
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

              <div
                className={`flex items-center justify-center w-full max-w-[1000px] mx-auto pb-5 transition-all duration-300 ease-in-out ${
                  isSticky
                    ? "fixed top-1 left-0 right-0 z-[50] max-w-[850px]"
                    : ""
                }`}
              >
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
      {isSticky && <div className="h-[120px]" />}
      <RollingGallery autoplay={true} pauseOnHover={false} />
      <div className="bg-[linear-gradient(to_right,transparent_1%,var(--gray-50)_10%,var(--gray-50)_90%,transparent_99%)] pb-20 dark:bg-[linear-gradient(to_right,transparent_0%,var(--neutral-900)_10%,var(--neutral-900)_90%,transparent_100%)]">
        <Container>
          <div className="flex flex-col gap-10 md:gap-20">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
              </div>
            ) : (
              <>
                {!displayData || displayData.length === 0 ? (
                  <EmptyState
                    title={
                      hasSearched
                        ? "No services found matching your search"
                        : "No decor services available"
                    }
                    description={
                      hasSearched
                        ? "Try adjusting your search criteria"
                        : "Please check back later"
                    }
                  />
                ) : (
                  <>
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
                        province: service.sublocation,
                        href: `/booking/${generateSlug(service.style)}`,
                      })}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      enforcePagination={true}
                    />
                  </>
                )}
              </>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={handlePreviousPage} disabled={currentPage === 1} className="text-primary" icon={<MdNavigateBefore size={20} />}/>
              <Button onClick={handleLoadMore} disabled={currentPage === calculatedTotalPages} className="text-primary" icon={<MdNavigateNext size={20} />}/>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default BookingPage;
