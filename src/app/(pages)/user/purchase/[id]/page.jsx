"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/app/components/layouts/Container";
import { useGetOrderDetail } from "@/app/queries/order/order.query";
import { FootTypo, BodyTypo } from "@/app/components/ui/Typography";
import { formatDateVN, formatCurrency, generateSlug } from "@/app/helpers";
import {
  Skeleton,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Rating,
  TextField,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import Image from "next/image";
import Button from "@/app/components/ui/Buttons/Button";
import { TbArrowLeft, TbReceipt } from "react-icons/tb";
import {
  MdOutlineShoppingCart,
  MdLocationOn,
  MdClose,
  MdOutlinePayment,
  MdUploadFile,
} from "react-icons/md";
import { LuBuilding, LuCheck } from "react-icons/lu";
import { FaRegCalendarAlt, FaStar, FaBoxOpen } from "react-icons/fa";
import PaymentItemCard from "@/app/components/ui/card/PaymentItemCard";
import { useReviewProduct } from "@/app/queries/review/review.query";
import ResultModal from "@/app/components/ui/Modals/ResultModal";

const PurchaseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: orderDetail, isLoading } = useGetOrderDetail(id);

  const provider = orderDetail?.provider;

  // Review modal state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // Result modal state
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultModalData, setResultModalData] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const { mutate: reviewProduct, isPending: isReviewSubmitting } =
    useReviewProduct();

  // Format the full address from components
  const formatFullAddress = (data) => {
    if (!data || !data.address) return "No address provided";

    const { street, ward, district, province, detail } = data.address || {};

    const addressParts = [];
    if (detail) addressParts.push(detail);
    if (street) addressParts.push(street);
    if (ward) addressParts.push(ward);
    if (district) addressParts.push(district);
    if (province) addressParts.push(province);

    const fullAddress = addressParts.join(", ");
    return fullAddress || "No address provided";
  };

  const handleOpenReviewDialog = (item) => {
    setCurrentItem(item);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setRating(0);
    setComment("");
    setCurrentItem(null);
    setSelectedImages([]);
    setPreviewImages([]);
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
    URL.revokeObjectURL(previewImages[index]?.url);

    // Remove the image from state
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    const newSelected = [...selectedImages];
    newSelected.splice(index, 1);
    setSelectedImages(newSelected);
  };

  const handleSubmitReview = () => {
    if (!currentItem) return;

    // Create FormData for multipart/form-data request
    const formData = new FormData();

    // Add required fields
    formData.append("Rate", rating);
    formData.append("Comment", comment);
    formData.append("ProductId", currentItem.productId);
    formData.append("OrderId", currentItem.orderId);

    // Add optional images if present
    if (selectedImages.length > 0) {
      selectedImages.forEach((image) => {
        formData.append("Images", image);
      });
    }

    reviewProduct(formData, {
      onSuccess: () => {
        setResultModalData({
          title: "Review Submitted",
          message: "Thank you for your review!",
          type: "success",
        });
        setResultModalOpen(true);
        handleCloseReviewDialog();
      },
      onError: (error) => {
        setResultModalData({
          title: "Error",
          message:
            error.message || "Failed to submit review. Please try again.",
          type: "error",
        });
        setResultModalOpen(true);
      },
    });
  };

  // Order status timeline steps
  const getOrderStatusSteps = () => {
    const steps = [
      { label: "Order Placed", icon: <MdOutlineShoppingCart /> },
      { label: "Payment Confirmed", icon: <MdOutlinePayment /> },
      { label: "Completed", icon: <LuCheck /> },
    ];

    // Determine active step based on status
    // Status 0 = pending payment, 1 = paid/completed
    const activeStep = orderDetail?.status === 0 ? 0 : 2;

    return { steps, activeStep };
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center gap-1 mb-6">
          <TbArrowLeft size={20} />
          <FootTypo footlabel="Go Back" className="!m-0" />
        </div>

        <BodyTypo bodylabel="Purchase Details" />

        <Paper
          elevation={0}
          className="p-6 rounded-lg my-6 bg-white dark:bg-slate-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="60%" height={24} />
                </div>
              </div>
            ))}
          </div>
        </Paper>
      </Container>
    );
  }

  // Handle case where no data is available
  if (!orderDetail) {
    return (
      <Container>
        <button
          className="flex items-center gap-1 mb-6"
          onClick={() => router.back()}
        >
          <TbArrowLeft size={20} />
          <FootTypo footlabel="Go Back" className="!m-0" />
        </button>

        <div className="p-8 text-center">
          <FootTypo
            footlabel="Order information not found. Please try again."
            className="text-red-500"
          />
          <Button
            label="Return to Orders"
            onClick={() => router.push("/user/orders/all")}
            className="mt-4"
          />
        </div>
      </Container>
    );
  }

  const { steps, activeStep } = getOrderStatusSteps();
  
  return (
    <Container>
      <button
        className="flex items-center gap-1 mb-6"
        onClick={() => router.back()}
      >
        <TbArrowLeft size={20} />
        <FootTypo footlabel="Go Back" className="!m-0" />
      </button>

      {/* Header Section with Order Code */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <BodyTypo bodylabel="Purchase Details" className="mb-2" />
          <div className="flex items-center gap-2">
            <TbReceipt className="text-gray-600" size={18} />
            <FootTypo
              footlabel={`Order #${orderDetail?.orderCode || id}`}
              className="text-gray-600 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            orderDetail?.status === 1
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
          }`}
        >
          <span
            className={`h-3 w-3 rounded-full ${
              orderDetail?.status === 1 ? "bg-green-500" : "bg-yellow-500"
            }`}
          ></span>
          <FootTypo
            footlabel={orderDetail?.status === 1 ? "Completed" : "Pending"}
            className="font-medium"
          />
        </div>
      </div>

      {/* Order Timeline */}
      <Paper
        elevation={0}
        className="rounded-lg mb-8 bg-white dark:bg-transparent dark:text-white overflow-hidden p-6"
      >
        <div className="mb-4 border-b pb-2">
          <div className="flex items-center gap-2">
            <FaRegCalendarAlt className="text-primary" size={18} />
            <h3 className="font-semibold text-lg">Order Progress</h3>
          </div>
        </div>

        <div className="py-4">
          <Stepper activeStep={activeStep} alternativeLabel className="px-4">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel
                  StepIconProps={{
                    icon: step.icon,
                  }}
                >
                  <Typography
                    className={`${
                      index <= activeStep
                        ? "text-primary dark:text-primary-light font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          <FootTypo
            footlabel={`Order placed on ${formatDateVN(
              orderDetail?.orderDate || new Date()
            )}`}
          />
          {orderDetail?.status === 1 && (
            <FootTypo
              footlabel={`Payment confirmed and order completed`}
              className="ml-2 text-green-600 dark:text-green-400"
            />
          )}
        </div>
      </Paper>

      {/* Two-column layout for main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Order Items */}
        <div className="lg:col-span-2">
          <Paper
            elevation={0}
            className="rounded-lg mb-8 bg-white dark:bg-transparent dark:text-white overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-blue-500 to-primary border-b">
              <div className="flex items-center gap-2">
                <FaBoxOpen className="text-white" size={20} />
                <FootTypo
                  footlabel="Purchased Items"
                  className="font-medium text-white"
                />
              </div>
            </div>

            <div className="py-5 space-y-4">
              {orderDetail?.orderDetails?.map((item) => (
                <PaymentItemCard
                  key={item.id}
                  id={item.id}
                  productName={item.productName}
                  productImage={item.image}
                  quantity={item.quantity}
                  unitPrice={item.unitPrice}
                  orderId={item.orderId}
                  productId={item.productId}
                  href={`/products/${generateSlug(item.productName)}`}
                  isReview={true}
                  handleOpenReviewDialog={() =>
                    handleOpenReviewDialog({
                      ...item,
                      provider: item.provider,
                    })
                  }
                  provider={item.provider}
                />
              ))}

              {(!orderDetail?.orderDetails ||
                orderDetail.orderDetails.length === 0) && (
                <div className="p-6 text-center">
                  <FootTypo
                    footlabel="No items found for this order"
                    className="text-gray-500 italic"
                  />
                </div>
              )}
            </div>
          </Paper>
        </div>

        {/* Right column - Order Information and Seller Details */}
        <div className="lg:col-span-1">
          {/* Order Summary Card */}
          <Paper
            elevation={0}
            className="rounded-lg mb-8 bg-white dark:bg-transparent dark:text-white overflow-hidden"
          >
            <div className="p-4 bg-gray-100 dark:bg-gray-800">
              <h3 className="font-semibold">Order Summary</h3>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <FootTypo footlabel="Subtotal" />
                  <FootTypo
                    footlabel={formatCurrency(orderDetail?.totalPrice || 0)}
                    className="font-medium"
                  />
                </div>

                <div className="flex justify-between">
                  <FootTypo footlabel="Shipping" />
                  <FootTypo footlabel="Free" className="text-green-600" />
                </div>

                <Divider />

                <div className="flex justify-between">
                  <FootTypo
                    footlabel="Total"
                    className="text-lg font-semibold"
                  />
                  <FootTypo
                    footlabel={formatCurrency(orderDetail?.totalPrice || 0)}
                    className="text-lg font-bold"
                  />
                </div>

                <div className="mt-2 pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <FootTypo footlabel="Payment Method" />
                    <FootTypo
                      footlabel="Wallet"
                      className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <FootTypo footlabel="Payment Status" />
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        orderDetail?.status === 1
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {orderDetail?.status === 1 ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          {/* Shipping Address */}
          {orderDetail?.address && (
            <Paper
              elevation={0}
              className="rounded-lg mb-8 bg-white dark:bg-transparent dark:text-white overflow-hidden"
            >
              <div className="p-4 bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <MdLocationOn size={18} />
                  <h3 className="font-semibold">Shipping Address</h3>
                </div>
              </div>

              <div className="p-5">
                <p className="font-medium">
                  {orderDetail?.address?.fullName || ""}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {formatFullAddress(orderDetail)}
                </p>
              </div>
            </Paper>
          )}
        </div>
      </div>

      {/* Rating Dialog */}
      <Dialog
        open={reviewDialogOpen}
        maxWidth="md"
        fullWidth
        disableScrollLock={true}
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6" component="div">
              <div className="mb-1">Rate Your Experience with</div>
              <div className="font-bold">{currentItem?.productName}</div>
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
                How would you rate this product?
              </Typography>
              <Rating
                name="product-rating"
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
                Share more details about your experience
              </Typography>
              <TextField
                autoFocus
                id="comment"
                multiline
                rows={4}
                fullWidth
                placeholder="What did you like or dislike? How was the quality? Was it as described?"
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
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
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
            label={isReviewSubmitting ? "Submitting..." : "Submit Review"}
            isLoading={isReviewSubmitting}
            onClick={handleSubmitReview}
            disabled={!comment.trim() || rating === 0 || isReviewSubmitting}
            className={`${
              !comment.trim() || rating === 0 ? "bg-gray-400" : "bg-primary"
            } text-white`}
          />
        </DialogActions>
      </Dialog>

      {/* Result Modal */}
      <ResultModal
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title={resultModalData.title}
        message={resultModalData.message}
        type={resultModalData.type}
      />
    </Container>
  );
};

export default PurchaseDetailPage;
