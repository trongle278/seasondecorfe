"use client";

import React, { useState, useEffect } from "react";
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
import { FormControl, InputLabel, Select, MenuItem, Skeleton } from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { IoFilterOutline } from "react-icons/io5";

const BookingRequestPage = () => {
  const router = useRouter();
  const { onOpen, onClose } = useInfoModal();
  
  const [filters, setFilters] = useState({
    status: "",
  });
  
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    status: "",
  });

  // Update pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      status: filters.status,
    }));
  }, [filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };
  
  // Status options for the filter
  const statusOptions = [
    { id: "", name: "All" },
    { id: "0", name: "Pending" },
    { id: "1", name: "Approved" },
    { id: "2", name: "Quoting" },
    { id: "3", name: "Contracting" },
    { id: "4", name: "Paid" },
    { id: "5", name: "In Progress" },
    { id: "6", name: "Completed" },
    { id: "7", name: "Cancelled" },
    { id: "8", name: "Refunding" },
    { id: "9", name: "Refunded" },
    { id: "10", name: "Rejected" },
    { id: "11", name: "Expired" },
    { id: "12", name: "Contract Created" },
    { id: "13", name: "Contract Accepted" },
  ];

  const {
    data: bookingsData,
    isLoading: isInitialLoading,
    refetch: refetchInitialList,
  } = useGetPaginatedBookingsForCustomer(pagination);

  const {
    data: quotationsData,
    isLoading: isQuotationsLoading,
    refetch: refetchQuotations,
  } = useGetListQuotationForCustomer({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    status: 0, 
  });

  const bookings = bookingsData?.data || [];
  const quotations = quotationsData?.data || [];

  const quotationItemCount = quotationsData?.totalCount || 0;
  const totalCount = bookingsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  const handlePaginationChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  };

  // Filter selection component
  const FilterSelectors = () => (
    <div className="mb-6 flex items-center gap-5 p-2 w-full">
      <div className="font-medium mr-2 flex items-center gap-2">
        <IoFilterOutline size={18} />
        Filters
      </div>
      
      <FormControl
        variant="outlined"
        size="small"
        className="w-full max-w-[250px] dark:text-white"
      >
        <InputLabel id="status-label" className="dark:text-white">
          Status
        </InputLabel>
        <Select
          MenuProps={{
            disableScrollLock: true,
          }}
          labelId="status-label"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          label="Status"
          className="bg-white dark:bg-gray-700 dark:text-white"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button 
        label="Reset Filter" 
        onClick={() =>
          setFilters({
            status: "",
          })
        }
        className="ml-auto"
      />
    </div>
  );

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
          <button
            onClick={() => router.push("/quotation")}
            className="flex items-center gap-2 px-4 py-2 hover:translate-x-3 transition-all duration-300"
          >
            <IoIosArrowForward size={20} />
            All Quotations
          </button>
        </div>
      </section>
      
      <FilterSelectors />

      {isInitialLoading && bookings.length === 0 ? (
        <>
          <Skeleton animation="wave" width="100%" />
          <Skeleton animation="wave" variant="rectangular" height={120} />
          <Skeleton animation="wave" variant="rectangular" height={120} />
          <Skeleton animation="wave" variant="rectangular" height={120} />
        </>
      ) : bookings.length === 0 && !isInitialLoading ? (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">No Booking Requests Found</h2>
          <p>
            {filters.status 
              ? "No booking requests match your filter criteria. Try adjusting your filters."
              : "You don't have any booking requests at the moment."}
          </p>
        </div>
      ) : (
        <>
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
          
          {totalCount > 0 && (
            <div className="flex justify-center mt-4 gap-4">
              <button 
                onClick={() => pagination.pageIndex > 1 && handlePaginationChange(pagination.pageIndex - 1)}
                disabled={pagination.pageIndex <= 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center">
                Page {pagination.pageIndex} of {totalPages}
              </span>
              <button 
                onClick={() => pagination.pageIndex < totalPages && handlePaginationChange(pagination.pageIndex + 1)}
                disabled={pagination.pageIndex >= totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default BookingRequestPage;
