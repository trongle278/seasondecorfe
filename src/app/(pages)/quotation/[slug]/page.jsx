"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import { useParams } from "next/navigation";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { useGetQuotationDetailByCustomerId } from "@/app/queries/quotation/quotation.query";
import Spinner from "@/app/components/Spinner";
import { BorderBox } from "@/app/components/ui/BorderBox";
import { FootTypo } from "@/app/components/ui/Typography";
import { formatDate, formatCurrency } from "@/app/helpers";
import Button from "@/app/components/ui/Buttons/Button";
import DataTable from "@/app/components/ui/table/DataTable";
import { TbLayoutList, TbFileText } from "react-icons/tb";
import { FaCheck, FaTimes } from "react-icons/fa6";
import { Divider } from "@mui/material";
import { IoIosRemove } from "react-icons/io";
import useInfoModal from "@/app/hooks/useInfoModal";
import { useConfirmQuotation } from "@/app/queries/quotation/quotation.query";
import StatusChip from "@/app/components/ui/statusChip/StatusChip";
import { PiSealWarning } from "react-icons/pi";

const QuotationDetailPage = () => {
  const params = useParams();
  const slug = params.slug;
  const [activeTab, setActiveTab] = useState("details");
  const [processedMaterials, setProcessedMaterials] = useState([]);
  const [processedTasks, setProcessedTasks] = useState([]);
  const infoModal = useInfoModal();
  const { mutate: confirmQuotation, isPending: isConfirming } =
    useConfirmQuotation();

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { data: quotationDetail, isLoading: isQuotationDetailLoading } =
    useGetQuotationDetailByCustomerId(slug);

  const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === "object") return Object.values(data);
    return [];
  };

  useEffect(() => {
    if (quotationDetail) {
      const materials = normalizeArray(quotationDetail.materials);
      const tasks = normalizeArray(quotationDetail.constructionTasks);

      setProcessedMaterials(materials);
      setProcessedTasks(tasks);
    }
  }, [quotationDetail]);

  if (isQuotationDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
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

  return (
    <Container>
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
                <StatusChip status={quotationDetail?.status} isQuotation={true} />
              </div>
              {quotationDetail?.status === 1 && (
                <div className="flex flex-row gap-2 items-center mt-3">
                  <PiSealWarning size={20} />
                  <FootTypo footlabel="The provider is preparing the contract" className="!m-0 text-sm underline" />
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
                  className="!m-0 text-lg font-bold text-primary"
                  icon={<FaCheck size={20} />}
                  onClick={handleAcceptQuotation}
                />
                <Divider orientation="vertical" flexItem />
                <Button
                  label="Reject Quotation"
                  className="!m-0 text-lg font-bold bg-red"
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

          {/* Construction Tasks Section */}
          <BorderBox>
            <h2 className="text-xl font-semibold mb-4">Construction Tasks</h2>
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
        </div>
      ) : (
        <div className="h-[800px] flex flex-col"> 
          {quotationDetail?.quotationFilePath ? (
            <div className="h-full">
              <iframe
                src={quotationDetail.quotationFilePath}
                className="w-full h-full rounded-md border-0"
                title="Quotation PDF"
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
