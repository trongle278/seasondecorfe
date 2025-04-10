"use client";

import React, { useState } from "react";
import Container from "@/app/components/layouts/Container";
import DataMapper from "@/app/components/DataMapper";
import { useGetListQuotationForCustomer } from "@/app/queries/list/quotation";
import QuotationCard from "@/app/components/ui/card/QuotationCard";
import EmptyState from "@/app/components/EmptyState";
import { BodyTypo } from "@/app/components/ui/Typography";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { useRouter } from "next/navigation";

const QuotationPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const router = useRouter();
  
  const { data: quotationsData, isLoading: isQuotationsLoading } =
    useGetListQuotationForCustomer({
      pageIndex: currentPage,
      pageSize: pageSize,
    });

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


  const quotations = quotationsData?.data || [];

  return (
    <Container>
      <MuiBreadcrumbs />
      <section className="flex flex-row justify-between items-center my-5">
        <BodyTypo bodylabel="Quotation" />
      </section>
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
          isContractExist: item.isContractExisted,
          serviceName: item.style,
          viewContract: () => {router.push(`/quotation/view-contract/${item.quotationCode}`)},
          onClick: () => {
            router.push(`/quotation/${item.quotationCode}`);
          },
        })}
      />
    </Container>
  );
};

export default QuotationPage;
