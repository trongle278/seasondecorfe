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
import { useGetListQuotationForCustomer } from "@/app/queries/list/quotation.list.query.js";
import QuotationCard from "@/app/components/ui/card/QuotationCard";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { IoFilterOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import useDeleteConfirmModal from "@/app/hooks/useDeleteConfirmModal";
import { generateSlug } from "@/app/helpers";
import { toast } from "sonner";
import { FaStar } from "react-icons/fa";
import { MdClose, MdUploadFile } from "react-icons/md";
import Image from "next/image";
import { useReviewService } from "@/app/queries/review/review.query";

const BookingRequestPage = () => {
  const router = useRouter();
  const { onOpen, onClose } = useInfoModal();
  const deleteConfirmModal = useDeleteConfirmModal();
  const { mutate: reviewService, isPending: isReviewing } = useReviewService();

  // Review Modal State
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentReviewBooking, setCurrentReviewBooking] = useState(null);

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

  // Review Dialog Handlers
  const handleOpenReviewDialog = (booking) => {
    setCurrentReviewBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    // Reset form state
    setRating(0);
    setComment("");
    setSelectedImages([]);
    setPreviewImages([]);
    setCurrentReviewBooking(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedImages([...selectedImages, ...files]);

    // Create previews for the images
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index].url);

    // Remove the image from state
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    const newSelected = [...selectedImages];
    newSelected.splice(index, 1);
    setSelectedImages(newSelected);
  };

  // Status options for the filter
  const statusOptions = [
    { id: "", name: "All" },
    { id: "0", name: "Pending" },
    { id: "1", name: "Planning" },
    { id: "2", name: "Quoting" },
    { id: "3", name: "Contracting" },
    { id: "4", name: "Confirmed" },
    { id: "5", name: "Deposit Paid" },
    { id: "6", name: "Preparing" },
    { id: "7", name: "In Transit" },
    { id: "8", name: "Progressing" },
    { id: "9", name: "All Done" },
    { id: "10", name: "Final Paid" },
    { id: "11", name: "Completed" },
    { id: "12", name: "Pending Cancel" },
    { id: "13", name: "Cancelled" },
    { id: "14", name: "Rejected" },
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

  const handleSubmitReview = () => {
    if (!currentReviewBooking) return;

    // Create FormData for multipart/form-data request
    const formData = new FormData();

    // Add required fields
    formData.append("Rate", rating);
    formData.append("Comment", comment);
    formData.append("BookingId", currentReviewBooking.bookingId);

    // Add optional images if present
    if (selectedImages.length > 0) {
      selectedImages.forEach((image) => {
        formData.append("Images", image);
      });
    }

    // Use the reviewService hook for creating a new review
    reviewService(formData, {
      onSuccess: () => {
        //toast.success("Thank you for your review!");
        refetchInitialList();
        handleCloseReviewDialog();
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to submit review. Please try again."
        );
      },
    });
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
          <Skeleton animation="wave" height={20} />
          <Skeleton animation="wave" height={20} />
          <Skeleton animation="wave" height={20} />
        </>
      ) : bookings.length === 0 && !isInitialLoading ? (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">
            No Booking Requests Found
          </h2>
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
            emptyStateComponent={
              <EmptyState title="No booking requests found" />
            }
            loading={isInitialLoading}
            getKey={(item) => item.bookingId}
            componentProps={(booking) => ({
              bookingCode: booking.bookingCode,
              status: booking.status,
              createdDate: booking.createdAt,
              isPending: booking.status === 0,
              isPlanning: booking.status === 1,
              isContracting: booking.status === 3,
              isCancelled: booking.status === 13,
              isDepositPaid: booking.status === 5,
              isQuoteExist: booking.isQuoteExisted,
              isCompleted: booking.status === 11,
              isPendingCancel: booking.status === 12,
              isTracked: booking.isTracked,
              isSigned: booking.isContractSigned,
              address: booking.address,
              isReviewed: booking.isReviewed,
              providerAvatar: booking.provider.avatar,
              providerName: booking.provider.businessName,
              serviceName: booking.decorService.style,
              serviceId: booking.decorService.id,
              handleReview: () => handleOpenReviewDialog(booking),
              trackingNavigate: () =>
                router.push(
                  `progress/${booking.bookingCode}?is-tracked=${booking.isTracked}&status=${booking.status}&quotation-code=${booking.quotationCode}&provider=${booking.provider.businessName}&avatar=${booking.provider.avatar}&is-reviewed=${booking.isReviewed}`
                ),

              detailClick: () =>
                onOpen({
                  isBooking: true,
                  viewService: () =>
                    router.push(
                      `/booking/${generateSlug(booking.decorService.style)}`
                    ),
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
              cancelClick: () =>
                deleteConfirmModal.onOpen(
                  booking.bookingCode,
                  booking.bookingCode,
                  "request"
                ),
            })}
          />

          {totalCount > 0 && (
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() =>
                  pagination.pageIndex > 1 &&
                  handlePaginationChange(pagination.pageIndex - 1)
                }
                disabled={pagination.pageIndex <= 1}
                className="p-1 border rounded-full disabled:opacity-50"
              >
                <IoIosArrowBack size={20} />
              </button>
              <span className="flex items-center">
                Page {pagination.pageIndex} of {totalPages}
              </span>
              <button
                onClick={() =>
                  pagination.pageIndex < totalPages &&
                  handlePaginationChange(pagination.pageIndex + 1)
                }
                disabled={pagination.pageIndex >= totalPages}
                className="p-1 border rounded-full disabled:opacity-50"
              >
                <IoIosArrowForward size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} maxWidth="md" fullWidth>
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6" component="div">
              Rate Your Experience with{" "}
              <span className="font-bold">
                {currentReviewBooking?.provider?.businessName}
              </span>
            </Typography>
            <IconButton onClick={handleCloseReviewDialog}>
              <MdClose />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <Typography component="legend" className="mb-2 text-center">
                How would you rate your experience?
              </Typography>
              <Rating
                name="service-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                precision={1}
                className="space-x-2"
                icon={<FaStar className="text-amber-400" fontSize="inherit" />}
                emptyIcon={
                  <FaStar className="text-gray-300" fontSize="inherit" />
                }
                size="large"
              />
            </div>

            <div>
              <Typography component="legend" className="mb-2">
                Share your thoughts about the service
                <span className="font-bold ml-2">
                  {currentReviewBooking?.decorService?.style}
                </span>
              </Typography>
              <TextField
                autoFocus
                id="comment"
                multiline
                rows={4}
                fullWidth
                placeholder="Tell provider what you liked or didn't like about this service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
              />
            </div>

            <div>
              <Typography component="legend" className="mb-2">
                Add Photos
              </Typography>
              <div className="flex flex-wrap gap-2 my-2">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="h-24 w-24 relative overflow-hidden rounded-lg">
                      <Image
                        src={image.url}
                        alt={`Preview ${index}`}
                        className="object-cover"
                        fill
                        sizes="96px"
                        unoptimized={false}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Box
                  component="label"
                  htmlFor="upload-image"
                  className="h-24 w-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <MdUploadFile size={24} />
                  <Typography variant="caption">Add Photo</Typography>
                  <input
                    id="upload-image"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </Box>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button label="Cancel" onClick={handleCloseReviewDialog} />

          <Button
            label={isReviewing ? "Submitting..." : "Submit Review"}
            isLoading={isReviewing}
            onClick={handleSubmitReview}
            disabled={!comment.trim() || rating === 0}
            className={`${
              !comment.trim() || rating === 0 ? "bg-gray-400" : "bg-primary"
            } text-white`}
          />
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingRequestPage;
