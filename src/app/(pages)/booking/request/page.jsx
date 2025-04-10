"use client";

import React, { useState } from "react";
import Container from "@/app/components/layouts/Container";
import { ListSidebar } from "@/app/components/ui/ListWrapper";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { useGetPaginatedBookingsForCustomer } from "@/app/queries/list/booking.list.query";
import BookingCard from "@/app/components/ui/card/BookingCard";
import useInfoModal from "@/app/hooks/useInfoModal";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { BodyTypo } from "@/app/components/ui/Typography";
import { useRouter } from "next/navigation";
import PopoverComponent from "@/app/components/ui/popover/Popover";
import { useGetListQuotationForCustomer } from "@/app/queries/list/quotation.js";
import QuotationCard from "@/app/components/ui/card/QuotationCard";
import { IoIosArrowForward } from "react-icons/io";

const filters = [
  {
    label: "Sort by Status",
    options: [
      { id: 0, name: "All" },
      { id: 1, name: "Pending" },
      { id: 2, name: "Confirmed" },
      { id: 3, name: "Completed" },
      { id: 4, name: "Cancelled" },
    ],
  },
];

const BookingRequestPage = () => {
  const router = useRouter();
  const { onOpen, onClose } = useInfoModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const pageSize = 10;
  const {
    data: bookingsData,
    isLoading: isInitialLoading,
    refetch: refetchInitialList,
  } = useGetPaginatedBookingsForCustomer({
    pageIndex: currentPage,
    pageSize: pageSize,
  });

  const {
    data: quotationsData,
    isLoading: isQuotationsLoading,
    refetch: refetchQuotations,
  } = useGetListQuotationForCustomer({
    pageIndex: currentPage,
    pageSize: pageSize,
    status: selectedStatus,
  });

  const bookings = bookingsData?.data || [];
  const quotations = quotationsData?.data || [];

  const quotationItemCount = quotationsData?.totalCount || 0;

  const handleLoadMore = () => {
    if (calculatedTotalPages && currentPage < calculatedTotalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Container>
      <MuiBreadcrumbs />
      <section className="flex flex-row justify-between items-center my-5">
        <BodyTypo bodylabel="Booking Request" />
        <div className="flex flex-row gap-4">
          <PopoverComponent
            buttonLabel="Pending Quotations"
            itemCount={quotationItemCount}
          >
            <DataMapper
              data={quotations}
              Component={QuotationCard}
              emptyStateComponent={<EmptyState title="No quotations found" />}
              loading={isQuotationsLoading}
              getKey={(item) => item.quotationCode}
              componentProps={(item) => ({
                quotationCode: item.quotationCode,
                createdDate: item.createdAt,
                status: item.status,
                serviceName: item.style,
                onClick: () => {
                  router.push(`/quotation/${item.quotationCode}`);
                },
              })}
            />
          </PopoverComponent>
          <button onClick={() => router.push("/quotation")} className="flex items-center gap-2 px-4 py-2 hover:translate-x-3 transition-all duration-300">
            <IoIosArrowForward size={20} />
            View All
          </button>
        </div>
      </section>
      <section className="flex flex-row justify-between items-center my-5">
        <ListSidebar filters={filters} className="max-w-[200px]" />
      </section>

      <DataMapper
        data={bookings}
        Component={BookingCard}
        emptyStateComponent={<EmptyState title="No booking requests found" />}
        loading={isInitialLoading}
        getKey={(item) => item.bookingId}
        componentProps={(booking) => ({
          bookingCode: booking.bookingCode,
          status: booking.status,
          createdDate: booking.createdAt,
          isPending: booking.status === 0,
          isContracting: booking.status === 3,
          address: booking.address,
          providerAvatar: booking.provider.avatar,
          providerName: booking.provider.businessName,
          serviceName: booking.decorService.style,

          detailClick: () =>
            onOpen({
              isBooking: true,
              buttonLabel: "Done",
              title: "Booking Details",
              bookingCode: booking.bookingCode,
              status: booking.status,
              serviceStyle: booking.decorService.style,
              serviceImage: booking.decorService.images.map(
                (img) => img.imageURL
              ),
              serviceName: booking.decorService.style,
              serviceSeason: booking.decorService.seasons,
              providerImage: booking.provider.avatar,
              providerName: booking.provider.businessName,
              profileClick: () => {
                router.push(`/provider/${booking.provider.slug}`);
                onClose();
              },
            }),
          cancelClick: () => {},
        })}
      />
    </Container>
  );
};

export default BookingRequestPage;
