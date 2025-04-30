"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import { useParams } from "next/navigation";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import {
  useGetQuotationDetailByCustomerId,
  useConfirmQuotation,
  useAddProductToQuotation,
  useRemoveProductFromQuotation,
} from "@/app/queries/quotation/quotation.query";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo } from "@/app/components/ui/Typography";
import { formatDate, formatCurrency } from "@/app/helpers";
import Button from "@/app/components/ui/Buttons/Button";
import DataTable from "@/app/components/ui/table/DataTable";
import { TbLayoutList, TbFileText, TbSignature } from "react-icons/tb";
import { FaCheck, FaTimes } from "react-icons/fa6";
import { Divider } from "@mui/material";
import { IoIosRemove } from "react-icons/io";
import useInfoModal from "@/app/hooks/useInfoModal";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { PiSealWarning } from "react-icons/pi";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { BsCheckCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  setQuotationExisted,
  setQuotationSigned,
  setQuotationConfirmed,
} from "@/app/lib/redux/reducers/quotationSlice";
import { useGetListRelatedProduct } from "@/app/queries/list/quotation.list.query";
import Threads from "@/app/components/ui/animated/Threads";
import DataMapper from "@/app/components/DataMapper";
import ProductCard from "@/app/components/ui/card/ProductCard";
import EmptyState from "@/app/components/EmptyState";
import { generateSlug } from "@/app/helpers";
import ScrollAnimationWrapper from "@/app/components/ScrollAnimation";
import Skeleton from "@mui/material/Skeleton";
import useProductRemoveModal from "@/app/hooks/useProductRemoveModal";
import ProductRemoveModal from "@/app/components/ui/Modals/ProductRemoveModal";

const QuotationDetailPage = () => {
  const params = useParams();
  const slug = params.slug;
  const [activeTab, setActiveTab] = useState("details");
  const [processedMaterials, setProcessedMaterials] = useState([]);
  const [processedTasks, setProcessedTasks] = useState([]);
  const [isStatusChecked, setIsStatusChecked] = useState(false);
  const infoModal = useInfoModal();
  const { mutate: confirmQuotation, isPending: isConfirming } =
    useConfirmQuotation();
  const { mutate: addProductToQuotation, isPending: isAddingProduct } =
    useAddProductToQuotation();
  const { mutate: removeProductFromQuotation, isPending: isRemovingProduct } =
    useRemoveProductFromQuotation();
  const dispatch = useDispatch();

  const quotationExisted = useSelector(
    (state) => state.quotation.quotationExisted
  );

  const quotationSigned = useSelector(
    (state) => state.quotation.quotationSigned
  );

  const quotationConfirmed = useSelector(
    (state) => state.quotation.quotationConfirmed
  );

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const {
    data: quotationDetail,
    isLoading: isQuotationDetailLoading,
    refetch: refetchQuotationDetail,
  } = useGetQuotationDetailByCustomerId(slug);

  const productRemoveModal = useProductRemoveModal();

  // First effect: Process quotation details and update Redux store
  useEffect(() => {
    if (quotationDetail) {
      const materials = normalizeArray(quotationDetail.materials);
      const tasks = normalizeArray(quotationDetail.constructionTasks);

      setProcessedMaterials(materials);
      setProcessedTasks(tasks);

      // First, track if the contract is signed
      dispatch(setQuotationSigned(quotationDetail.isSigned || false));

      // Now set the quotationExisted state
      // We want this true ONLY if isQuoteExisted is true AND BOTH isContractExisted and isSigned are false
      const shouldExist =
        quotationDetail.isQuoteExisted &&
        !(quotationDetail.isContractExisted && quotationDetail.isSigned);

      dispatch(setQuotationExisted(shouldExist));

      setIsStatusChecked(true);
    }

    if (quotationDetail?.status === 1) {
      dispatch(setQuotationConfirmed(true));
    }
  }, [quotationDetail, dispatch]);

  // Only fetch related products when status has been checked
  const { data: relatedProduct, isLoading: isRelatedProductLoading } =
    useGetListRelatedProduct(pagination, slug, isStatusChecked);

  const products = relatedProduct?.data || [];

  const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === "object") return Object.values(data);
    return [];
  };

  if (isQuotationDetailLoading) {
    return (
      <Container>
        <div className="my-4">
          <Skeleton variant="text" width={300} height={30} />
        </div>

        <div className="flex my-4 border-b">
          <Skeleton
            variant="rectangular"
            width={120}
            height={40}
            sx={{ mr: 2 }}
          />
          <Skeleton variant="rectangular" width={120} height={40} />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 grid-rows-1 gap-4">
            <Skeleton variant="rectangular" height={150} />
            <Skeleton variant="rectangular" height={150} />
          </div>

          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={200} />

          <div>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="rectangular" height={140} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  const materialColumns = [
    {
      header: "Material Name",
      accessorKey: "materialName",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Cost",
      accessorKey: "cost",
      cell: ({ row }) => formatCurrency(row.original.cost),
    },
    {
      header: "Total Cost",
      accessorKey: "totalCost",
      cell: ({ row }) => formatCurrency(row.original.totalCost),
    },
  ];

  // Construction tasks table columns
  const constructionColumns = [
    {
      header: "Task Name",
      accessorKey: "taskName",
    },
    {
      header: "Unit",
      accessorKey: "unit",
    },
    {
      header: "Cost",
      accessorKey: "cost",
      cell: ({ row }) => formatCurrency(row.original.cost),
    },
  ];

  const handleQuotationAccept = () => {
    try {
      confirmQuotation(quotationDetail?.quotationCode);
      infoModal.onClose();
    } catch (error) {
      console.error("Error accepting quotation:", error);
    }
  };

  const handleAcceptQuotation = () => {
    infoModal.onOpen({
      title: "Our Policies & Terms",
      description:
        "Important Terms and Conditions:\n\n" +
        "1. Survey Agreement\n" +
        "By accepting this quotation, you authorize the provider to conduct a detailed survey at your specified address.\n\n" +
        "2. Service Timeline\n" +
        "• Expected duration: 3-5 business days after contract signing\n" +
        "• Service begins only after both parties sign the official contract\n\n" +
        "3. Payment Terms\n" +
        "• Required deposit: As stated in the quotation\n" +
        "• Deposit must be paid before service commencement\n\n" +
        "4. Contract Process\n" +
        "• Digital contract will be sent to your email\n" +
        "• Service starts only after contract is signed\n" +
        "• Contract changes require mutual agreement\n\n" +
        "5. Cancellation Policy\n" +
        "• Changes after signing must be agreed by both parties\n" +
        "• Cancellation terms as per platform policy\n\n" +
        "6. Platform Compliance\n" +
        "All processes follow Season Decor's terms and policies",
      buttonLabel: "I Agree",
      isTerms: true,
      onSubmit: handleQuotationAccept,
    });
  };

  // Handle adding product to quotation
  const handleAddProductToQuotation = (productId, quantity) => {
    addProductToQuotation(
      {
        quotationCode: slug,
        productId: productId,
        quantity: quantity,
      },
      {
        onSuccess: () => {
          refetchQuotationDetail();
        },
        onError: (error) => {
          console.error("Error adding product to quotation:", error);
        },
      }
    );
  };

  // Handle removing product from quotation
  const handleRemoveProductFromQuotation = (productId) => {
    removeProductFromQuotation(
      {
        quotationCode: slug,
        productId: productId,
      },
      {
        onSuccess: () => {
          refetchQuotationDetail();
        },
        onError: (error) => {
          console.error("Error removing product from quotation:", error);
        },
      }
    );
  };

  // Extract product details from quotation
  const quotationProducts = quotationDetail?.productDetails || [];

  // Calculate the total price of all products
  const totalProductsPrice = quotationProducts.reduce(
    (total, product) => total + (product.totalPrice || 0),
    0
  );

  // For the products section
  const ProductsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border rounded-lg overflow-hidden">
          <Skeleton variant="rectangular" height={180} />
          <div className="p-3">
            <Skeleton variant="text" height={24} width="70%" />
            <Skeleton variant="text" height={20} width="40%" />
            <Skeleton variant="text" height={24} width="50%" />
          </div>
        </div>
      ))}
    </div>
  );

  // Add PDF skeleton loading
  const PDFSkeleton = () => (
    <div className="h-[800px] flex flex-col border rounded-lg p-6">
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height="90%" />
    </div>
  );

  return (
    <Container>
      <ProductRemoveModal onRemoveProduct={handleRemoveProductFromQuotation} />
      <MuiBreadcrumbs />

      {/* Tab Navigation */}
      <div className="flex my-4 border-b">
        <button
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === "details"
              ? "border-b-2 border-primary text-primary font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("details")}
        >
          <TbLayoutList size={20} />
          <span>Details</span>
        </button>

        <button
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === "pdf"
              ? "border-b-2 border-primary text-primary font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pdf")}
        >
          <TbFileText size={20} />
          <span>PDF Document</span>
        </button>
      </div>

      {activeTab === "details" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 grid-rows-1 gap-4 font-semibold">
            <BorderBox className="section-left">
              <div className="flex flex-row gap-2 items-center">
                <FootTypo footlabel="Quotation Code" className="!m-0 text-sm" />
                <FootTypo
                  footlabel={quotationDetail?.quotationCode}
                  className="!m-0 text-lg bg-primary text-white rounded-md px-2 py-1"
                />
              </div>

              <div className="flex flex-row gap-2 items-center mt-3">
                <FootTypo footlabel="Created Date" className="!m-0 text-sm" />
                <FootTypo
                  footlabel={formatDate(quotationDetail?.createdAt)}
                  className="!m-0 text-lg"
                />
              </div>
              <div className="flex flex-row gap-2 items-center mt-3">
                <FootTypo footlabel="Status" className="!m-0 text-sm" />
                <StatusChip
                  status={quotationDetail?.status}
                  isQuotation={true}
                />
              </div>
              {quotationDetail?.status === 1 &&
                !quotationDetail?.isContractExisted && (
                  <div className="flex flex-row gap-2 items-center mt-3">
                    <PiSealWarning size={20} />
                    <FootTypo
                      footlabel="The provider is preparing the contract"
                      className="!m-0 text-sm"
                    />
                  </div>
                )}
              {quotationDetail?.isContractExisted &&
                !quotationDetail?.isSigned && (
                  <div className="flex flex-row gap-2 items-center mt-3">
                    <TbSignature size={20} color="blue" />
                    <FootTypo
                      footlabel="Your contract is ready to sign"
                      className="!m-0 text-sm"
                    />
                  </div>
                )}
              {quotationDetail?.isSigned && (
                <div className="flex flex-row gap-2 items-center mt-3">
                  <BsCheckCircleFill size={20} color="green" />
                  <FootTypo
                    footlabel="Contract signed"
                    className="!m-0 text-sm"
                  />
                </div>
              )}
            </BorderBox>
            <BorderBox className="section-right">
              <div className="flex flex-row gap-2 items-center">
                <FootTypo footlabel="Material Cost" className="!m-0 text-sm" />
                <FootTypo
                  footlabel={formatCurrency(quotationDetail?.materialCost)}
                  className="!m-0 text-lg"
                />
              </div>
              <div className="flex flex-row gap-2 items-center mt-3">
                <FootTypo
                  footlabel="Construction Cost"
                  className="!m-0 text-sm"
                />
                <FootTypo
                  footlabel={formatCurrency(quotationDetail?.constructionCost)}
                  className="!m-0 text-lg"
                />
              </div>
              <div className="flex flex-row gap-2 items-center mt-3">
                <FootTypo footlabel="Total Cost" className="!m-0 text-sm" />
                <FootTypo
                  footlabel={formatCurrency(quotationDetail?.totalCost)}
                  className="!m-0 text-lg font-bold text-primary"
                />
                <FootTypo
                  footlabel={`(Deposit: ${
                    quotationDetail?.depositPercentage || 0
                  }%)`}
                  className="!m-0 text-lg"
                />
              </div>
              {quotationDetail?.status === 0 && (
                <div className="flex flex-row gap-5 items-center mt-3">
                  <Button
                    label="Accept Quotation"
                    className="bg-action text-lg font-bold text-white"
                    icon={<FaCheck size={20} />}
                    onClick={handleAcceptQuotation}
                  />
                  <Divider orientation="vertical" flexItem />
                  <Button
                    label="Reject Quotation"
                    className="text-lg font-bold bg-red text-white"
                    icon={<IoIosRemove size={20} />}
                  />
                </div>
              )}
            </BorderBox>
          </div>

          {/* Materials Section */}
          <BorderBox>
            <h2 className="text-xl font-semibold mb-4">Materials </h2>
            {processedMaterials.length > 0 ? (
              <DataTable
                data={processedMaterials}
                columns={materialColumns}
                showPagination={false}
                manualSorting={false}
                pageSize={pagination.pageSize}
              />
            ) : (
              <p className="text-gray-500">No materials available</p>
            )}
          </BorderBox>

          {/* Labour Tasks Section */}
          <BorderBox>
            <h2 className="text-xl font-semibold mb-4">Labour Tasks</h2>
            {processedTasks.length > 0 ? (
              <DataTable
                data={processedTasks}
                columns={constructionColumns}
                showPagination={false}
                manualSorting={false}
                pageSize={pagination.pageSize}
              />
            ) : (
              <p className="text-gray-500">No construction tasks available</p>
            )}
          </BorderBox>

          {/* Added Products Section */}
          {!quotationSigned && !quotationConfirmed && (
            <BorderBox>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Added Products</h2>
                {totalProductsPrice > 0 && (
                  <span className="text-primary font-semibold">
                    Total: {formatCurrency(totalProductsPrice)}
                  </span>
                )}
              </div>

              {isQuotationDetailLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rectangular" height={140} />
                  ))}
                </div>
              ) : quotationProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {quotationProducts.map((product) => (
                    <BorderBox key={product.id} className="border">
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="h-16 w-16 flex-shrink-0">
                          {product.image ? (
                            <img
                              className="h-16 w-16 rounded-md object-cover"
                              src={product.image}
                              alt={product.productName}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400 text-xs">
                                No img
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">
                              {product.productName}
                            </h3>
                            <span className="text-primary font-medium text-right">
                              {formatCurrency(product.totalPrice)}
                            </span>
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Quantity: {product.quantity}
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="mt-4">
                        <Button
                          icon={<IoIosRemove size={20} />}
                          label="Remove"
                          className="bg-red text-white w-full justify-center"
                          onClick={() => {
                            productRemoveModal.onOpen(
                              product.productId,
                              product.productName
                            );
                          }}
                          disabled={isRemovingProduct}
                        />
                      </div>
                    </BorderBox>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 rounded-md">
                  <FootTypo
                    footlabel="No products added to this quotation"
                    className="text-gray-500 dark:text-gray-400 mb-3"
                  />
                  <FootTypo
                    footlabel="Browse our recommended products below"
                    className="text-gray-400 dark:text-gray-500 max-w-md mx-auto"
                  />
                </div>
              )}
            </BorderBox>
          )}

          {/* Confirmed Products Section - Shown when quotation is signed or status is 1 */}
          {(quotationSigned || quotationDetail?.status === 1) &&
            quotationProducts.length > 0 && (
              <BorderBox>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Add-on Funitures</h2>
                  {totalProductsPrice > 0 && (
                    <span className="text-primary font-semibold">
                      Total: {formatCurrency(totalProductsPrice)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 font-semibold">
                  {quotationProducts.map((product) => (
                    <BorderBox key={product.id} className="border">
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="h-16 w-16 flex-shrink-0">
                          {product.image ? (
                            <img
                              className="h-16 w-16 rounded-md object-cover"
                              src={product.image}
                              alt={product.productName}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-gray-500 dark:text-gray-400 text-xs">
                                No img
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <FootTypo
                              footlabel={product.productName}
                              className="!m-0 text-lg"
                            />

                            <FootTypo
                              footlabel={formatCurrency(product.totalPrice)}
                              className="!m-0"
                            />
                          </div>

                          <FootTypo
                            footlabel={`Quantity: ${product.quantity}`}
                            className="!m-0"
                          />

                          <FootTypo
                            footlabel={` Price: ${formatCurrency(
                              product.unitPrice
                            )}`}
                            className="!m-0"
                          ></FootTypo>
                        </div>
                      </div>
                    </BorderBox>
                  ))}
                </div>
              </BorderBox>
            )}

          {/* Related Products Section - Only shown when quotation is not signed */}
          {!quotationSigned && !quotationConfirmed && (
            <>
              <div
                style={{ width: "100%", height: "360px", position: "relative" }}
              >
                <FootTypo
                  footlabel="Make your space more beautiful with our funitures"
                  className="max-w-[20vw] break-after-all !m-0 text-base absolute top-1/2 -translate-y-1/2 bg-transparent  font-bold"
                />
                <Threads
                  amplitude={1.1}
                  distance={0}
                  enableMouseInteraction={false}
                  color={[0, 0, 255]}
                />
              </div>
              <ScrollAnimationWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
                  {isRelatedProductLoading ? (
                    <ProductsSkeleton />
                  ) : (
                    <DataMapper
                      data={products}
                      Component={ProductCard}
                      emptyStateComponent={
                        <EmptyState title="No products found" />
                      }
                      loading={false}
                      getKey={(item) => item.id}
                      componentProps={(product) => ({
                        image:
                          product.imageUrls && product.imageUrls.length > 0
                            ? product.imageUrls
                            : ["/placeholder-image.jpg"],
                        productName: product.productName,
                        rate: product.rate,
                        price: product.productPrice,
                        quantity: product.quantity,
                        totalSold: product.totalSold || 0,
                        id: product.id,
                        href: `/products/${generateSlug(product.productName)}`,
                        isAdditionalProduct: true,
                        onAddProduct: handleAddProductToQuotation,
                      })}
                    />
                  )}
                </div>
              </ScrollAnimationWrapper>
            </>
          )}
        </div>
      ) : (
        <div className="h-[800px] flex flex-col">
          {isQuotationDetailLoading ? (
            <PDFSkeleton />
          ) : quotationDetail?.quotationFilePath ? (
            <div className="h-full">
              <Viewer
                fileUrl={quotationDetail?.quotationFilePath}
                defaultScale={1.5}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <TbFileText size={60} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  No PDF Document Available
                </h3>
                <p className="text-gray-500">
                  The quotation document has not been uploaded yet.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default QuotationDetailPage;
