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
  const pageSize = 10;
  const {
    data: bookingsData,
    isLoading: isInitialLoading,
    refetch: refetchInitialList,
  } = useGetPaginatedBookingsForCustomer({
    pageIndex: currentPage,
    pageSize: pageSize,
  });

  const bookings = bookingsData?.data || [];

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
      <BodyTypo bodylabel="Booking Request" />
      <div className="flex justify-center w-fit my-5">
        <ListSidebar filters={filters} />
      </div>

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
          address: booking.address,
          detailClick: () =>
            onOpen({
              isBooking: true,
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
