import { Skeleton } from "@mui/material";

const DataMapper = ({
  data,
  Component,
  componentProps = () => ({}),
  getKey,
  loading,
  emptyStateComponent,
  // Pagination props
  pageSize,
  currentPage = 1,
  enforcePagination = false,
  // Mode control
  accumulativeMode = false, // When true, displays all items from multiple pages
}) => {
  if (loading) {
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
    </>
  );
};

export default DataMapper;
