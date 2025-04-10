"use client";

import * as React from "react";
import { useState } from "react";
import DataMapper from "@/app/components/DataMapper";
import EmptyState from "@/app/components/EmptyState";
import { useGetDecorServiceListByProvider } from "@/app/queries/list/service.list.query";
import ServiceCard from "@/app/components/ui/card/ServiceCard";
import { Skeleton } from "@mui/material";
import { generateSlug } from "@/app/helpers";

const ServicesTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = React.useState({
    pageIndex: 1,
    pageSize: 10,
    subLocation: "",
    decorCategory: "",
    sortBy: "",
    descending: false,
    productName: "",
    minPrice: "",
    maxPrice: "",
  });

  const { data, isLoading, error, refetch } =
    useGetDecorServiceListByProvider(pagination);

  const services = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize) || 1;

  return (
    <div className=" relative">
      <DataMapper
        data={services}
        Component={ServiceCard}
        emptyStateComponent={<EmptyState title="No services found" />}
        loading={isLoading}
        getKey={(item) => item.id}
        componentProps={(service) => ({
          style: service.style,
          description: service.description,
          images: service.images,
          id: service.id,
          seasons: service.seasons,
          category: service.categoryName,
          province: service.sublocation,
          isAvailable: service.status,
          href: `/booking/${generateSlug(service.style)}`,
        })}
        pageSize={pagination.pageSize}
        currentPage={currentPage}
        enforcePagination={true}
      />
    </div>
  );
};

export default ServicesTab;
