import { Skeleton } from "@mui/material";
import React from "react";
import Button2 from "@/app/components/ui/Buttons/Button2";

const DataMapper = ({
  data,
  Component,
  componentProps = () => ({}),
  getKey,
  loading,
  isLoading,
  emptyStateComponent,
  // Pagination props
  pageSize,
  currentPage = 1,
  enforcePagination = false,
  onLoadMore = () => {},
  hasMoreData = false,
  // Mode control
  accumulativeMode = false, // When true, displays all items from multiple pages
}) => {
  // Check for loading from either prop
  const isLoadingData = loading || isLoading;

  if (isLoadingData) {
    return (
      <>
        <div className="flex flex-col">
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </div>
      </>
    );
  }

  if (!data || data.length === 0) {
    return emptyStateComponent;
  }

  // Determine which items to render based on mode and pagination settings
  let itemsToRender = data;

  // Client-side pagination - only used when accumulativeMode is false
  if (!accumulativeMode && enforcePagination && pageSize) {
    // For strict pagination, slice the data based on current page and page size
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    itemsToRender = data.slice(startIndex, endIndex);
  }

  // In accumulative mode, use all data provided (no client-side pagination)
  // This assumes the parent component is managing the accumulated data

  return (
    <>
      {itemsToRender.map((item) => (
        <Component key={getKey(item)} {...item} {...componentProps(item)} />
      ))}

      {/* Load More Button */}
      {enforcePagination && hasMoreData && (
        <div className="w-full flex justify-center mt-6 mb-4">
          <Button2
            onClick={onLoadMore}
            label="Show More"
            loading={isLoadingData}
          />
        </div>
      )}
    </>
  );
};

export default DataMapper;
