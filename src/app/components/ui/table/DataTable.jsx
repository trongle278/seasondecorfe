"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState, useEffect, useRef } from "react";
import Button from "../Buttons/Button";
import { Skeleton } from "@mui/material";

const DataTable = ({
  data,
  columns,
  isLoading,
  showPagination = true,
  pageSize,
  initialPageIndex = "",
  manualPagination = false,
  manualSorting = true,
  pageCount = 0,
  onPaginationChange,
  onSortingChange,
  totalCount = 0,
}) => {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: initialPageIndex,
    pageSize,
  });
  
  const isInitialMount = useRef(true);

  // Update local pagination state when pageSize or initialPageIndex props change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      pageSize,
      pageIndex: initialPageIndex,
    }));
  }, [pageSize, initialPageIndex]);

  // Notify parent component about sorting changes only if manual sorting is enabled
  useEffect(() => {
    if (onSortingChange && manualSorting && !isInitialMount.current) {
      onSortingChange(sorting);
    }
  }, [sorting, onSortingChange, manualSorting]);

  // Notify parent component about pagination changes
  useEffect(() => {
    // Skip the initial render to prevent unnecessary API calls
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (onPaginationChange) {
      console.log("Table pagination changed:", pagination);
      
      const apiPageIndex = pagination.pageIndex === 0 ? 1 : pagination.pageIndex + 1;
      
      console.log("Converting to API pageIndex:", apiPageIndex);
      
      onPaginationChange({
        ...pagination,
        pageIndex: apiPageIndex,
      });
    }
  }, [pagination, onPaginationChange]);

  // Calculate if pagination should be shown
  const shouldShowPagination = showPagination && (
    (manualPagination && (pageCount > 1 || totalCount > pagination.pageSize)) || 
    (!manualPagination && table.getPageCount() > 1)
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // Always include sorted model for client-side sorting
    manualPagination,
    manualSorting,
    pageCount: manualPagination ? pageCount : undefined,
  });

  // Debug function for pagination buttons
  const handlePageChange = (action) => {
    
    if (action === 'first') table.setPageIndex(0);
    if (action === 'previous') table.previousPage();
    if (action === 'next') table.nextPage();
    if (action === 'last') table.setPageIndex(table.getPageCount() - 1);
    
    console.log("After:", table.getState().pagination);
  };

  return (
    <div className="overflow-x-auto rounded-lg w-full">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "asc" ? (
                        <span className="ml-1">↑</span>
                      ) : (
                        <span className="ml-1">↓</span>
                      )
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: pagination.pageSize }).map((_, index) => (
              <tr key={index}>
                <td colSpan={columns.length} className="px-6 py-4">
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="100%"
                    height={40}
                  />
                </td>
              </tr>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No data found
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {shouldShowPagination && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={() => handlePageChange('first')}
              disabled={!table.getCanPreviousPage() || isLoading}
              className=" disabled:opacity-50"
              label="First"
            />
            <Button
              onClick={() => handlePageChange('previous')}
              disabled={!table.getCanPreviousPage() || isLoading}
              className=" disabled:opacity-50"
              label="Previous"
            />
            <Button
              onClick={() => handlePageChange('next')}
              disabled={!table.getCanNextPage() || isLoading}
              className=" disabled:opacity-50"
              label="Next"
            />
            <Button
              onClick={() => handlePageChange('last')}
              disabled={!table.getCanNextPage() || isLoading}
              className=" disabled:opacity-50"
              label="Last"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {manualPagination ? pageCount : table.getPageCount()}
              </strong>
            </span>
            {totalCount > 0 && (
              <span className="flex items-center gap-1">
                <div>Total:</div>
                <strong>{totalCount} items</strong>
              </span>
            )}
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border rounded px-2 py-1"
              disabled={isLoading}
            >
              {[1, 2, 3, 5, 10, 20, 30, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
