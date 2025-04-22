"use client";

import React, { useState, useEffect } from "react";
import Container from "@/app/components/layouts/Container";
import DataMapper from "@/app/components/DataMapper";
import { useGetListQuotationForCustomer } from "@/app/queries/list/quotation.list.query";
import QuotationCard from "@/app/components/ui/card/QuotationCard";
import EmptyState from "@/app/components/EmptyState";
import { BodyTypo } from "@/app/components/ui/Typography";
import MuiBreadcrumbs from "@/app/components/ui/breadcrums/Breadcrums";
import { useRouter } from "next/navigation";
import { FormControl, InputLabel, Select, MenuItem, Skeleton } from "@mui/material";
import Button from "@/app/components/ui/Buttons/Button";
import { IoFilterOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const QuotationPage = () => {
  const router = useRouter();
  
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
    { id: "1", name: "Confirmed" },
    { id: "2", name: "Denied" }
  ];
  
  const { data: quotationsData, isLoading: isQuotationsLoading } =
    useGetListQuotationForCustomer(pagination);

  const quotations = quotationsData?.data || [];
  const totalCount = quotationsData?.totalCount || 0;
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
        <BodyTypo bodylabel="Quotation" />
      </section>
      
      <FilterSelectors />
      
      {isQuotationsLoading && quotations.length === 0 ? (
        <>
          <Skeleton animation="wave" height={20} />
          <Skeleton animation="wave" height={20} />
          <Skeleton animation="wave" height={20} />
        </>
      ) : quotations.length === 0 && !isQuotationsLoading ? (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">No Quotations Found</h2>
          <p>
            {filters.status 
              ? "No quotations match your filter criteria. Try adjusting your filters."
              : "You don't have any quotations at the moment."}
          </p>
        </div>
      ) : (
        <>
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
    </Container>
  );
};

export default QuotationPage;
