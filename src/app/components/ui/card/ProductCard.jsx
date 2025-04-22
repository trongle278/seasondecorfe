"use client";

import Image from "next/image";
import React, { useState } from "react";
import { CardContainer, CardBody, CardItem } from "./components/3dCard";
import { FootTypo } from "../Typography";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/app/helpers";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Rating,
} from "@mui/material";
import { IoMdAdd, IoMdRemove, IoIosMore } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import ImageSlider from "../slider/ImageSlider";
import Button from "../Buttons/Button";


const ProductCard = ({
  image,
  productName,
  rate,
  price,
  totalSold,
  href,
  isAdditionalProduct = false,
  id,
  onAddProduct
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(false);

  const processedImages = React.useMemo(() => {
    if (!image) return [];
    if (typeof image === "string") return [image];
    if (Array.isArray(image)) return image;
    if (image.imageUrls && Array.isArray(image.imageUrls))
      return image.imageUrls;
    return [];
  }, [image]);

  const handleClick = () => {
    if (href && !isAdditionalProduct) {
      router.push(href);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (onAddProduct && id) {
      onAddProduct(id, quantity);
      setIsModalOpen(false);
    } else {
      alert("Missing product ID or add product function");
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: "600px", md: "700px" },
    bgcolor: "background.paper",
    borderRadius: "12px",
    boxShadow: 24,
    p: 0,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  // If no images are available, show a placeholder
  if (processedImages.length === 0 && typeof image !== "object") {
    processedImages.push("/placeholder-image.jpg");
  }

  return (
    <>
      <CardContainer
        className="inter-var flex cursor-pointer"
        onClick={handleClick}
      >
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] max-w-[300px] sm:w-[30rem] h-auto rounded-xl p-2 border">
          <CardItem translateZ="100" className="w-full relative">
            {/* Card thumbnail - show just the first image */}
            {processedImages.length > 0 ? (
              <Image
                src={processedImages[0]}
                width={1000}
                height={1000}
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt={productName || "Product image"}
              />
            ) : (
              <div className="h-60 w-full bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </CardItem>
          <div className="flex flex-col items-start mt-5 flex-grow gap-3">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white flex-grow break-words w-full"
            >
              {productName}
            </CardItem>
            <CardItem
              translateZ="50"
              className="flex flex-row items-center justify-between text-xl font-primary text-neutral-600 dark:text-white w-full"
            >
              <span className="inline-flex items-center justify-between text-primary">
                {formatCurrency(price)}
              </span>
              <FootTypo
                footlabel={`${totalSold} sold`}
                className="!m-0 text-sm"
              />
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>

      {/* Product Detail Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="product-detail-modal"
        aria-describedby="product-detail-modal-description"
      >
        <Box sx={modalStyle}>
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b">
            <Typography
              id="product-detail-modal"
              variant="h5"
              component="h2"
              fontWeight="600"
            >
              {productName}
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <IoClose size={22} />
            </IconButton>
          </div>

          <div className="p-6 font-semibold">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column: Image slider */}
              <div className="overflow-hidden rounded-lg col-span-2">
                <ImageSlider img={processedImages} loading={imageLoading} />
              </div>

              {/* Right column: Product info */}
              <div className="flex flex-col gap-5">
                {/* Quantity selector */}
                <div className="py-1">
                  <FootTypo footlabel="Quantity" className="mb-3" />
                  <div className="flex items-center">
                    <IconButton
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      size="small"
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        p: "6px",
                        color: "text.secondary",
                      }}
                    >
                      <IoMdRemove size={18} />
                    </IconButton>

                    <TextField
                      value={quantity}
                      onChange={handleQuantityChange}
                      type="number"
                      variant="outlined"
                      size="small"
                      inputProps={{
                        min: 1,
                        style: {
                          textAlign: "center",
                          padding: "6px 0",
                          fontSize: "14px",
                        },
                      }}
                      sx={{
                        width: "60px",
                        mx: 1,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                          },
                        },
                      }}
                    />

                    <IconButton
                      onClick={increaseQuantity}
                      size="small"
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                        p: "6px",
                        color: "text.secondary",
                      }}
                    >
                      <IoMdAdd size={18} />
                    </IconButton>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <FootTypo
                    footlabel={`Total: ${formatCurrency(price * quantity)}`}
                    className="mb-2"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-auto">
                  <Button
                    icon={<IoMdAdd />}
                    label="I want this"
                    className="bg-primary text-white"
                    onClick={handleAddToCart}
                    disabled={!onAddProduct || !id}
                  />

                  <Button
                    icon={<IoIosMore />}
                    label="Browse more"
                    onClick={() => router.push("/products")}
                  />
                </div>
              </div>
              <div className="p-5 rounded-lg">
                <FootTypo
                  footlabel={formatCurrency(price)}
                  className="flex items-center text-red text-2xl"
                />

                <div className="flex items-center gap-2 mt-2">
                  <Rating
                    value={rate || 4.8}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <FootTypo
                    footlabel={`${totalSold} sold`}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-8 border-t border-gray-100 pt-5">
              <Typography variant="h6" fontWeight="600" className="mb-3">
                Product Description
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                This beautiful {productName} will enhance your space with its
                elegant design and premium quality. Perfect for any home decor
                project, it offers both style and functionality. Made with
                high-quality materials to ensure durability and long-lasting
                performance.
              </Typography>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ProductCard;
