"use client";

import React, { useState } from "react";
import DataMapper from "@/app/components/DataMapper";
import ProductCard from "@/app/components/ui/card/ProductCard";
import EmptyState from "@/app/components/EmptyState";
import { useGetListProduct } from "@/app/queries/list/product.list.query";
import {
  Skeleton,
  Typography,
  Box,
  Button,
  TextField,
  Divider,
  Paper,
  Stack,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { generateSlug } from "@/app/helpers";
import Container from "@/app/components/layouts/Container";

const ListProductPage = () => {
  const [filterParams, setFilterParams] = useState({
    pageIndex: 1,
    pageSize: 10,
    minPrice: null,
    maxPrice: null,
    sortBy: "productPrice",
    descending: true,
  });

  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [sortValue, setSortValue] = useState("default");

  // Fetch products with filter params
  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetListProduct(filterParams);
  const products = productsData?.data || [];

  // Handle price input changes
  const handleMinPriceChange = (event) => {
    const value = event.target.value;
    setMinPriceInput(value);
  };

  const handleMaxPriceChange = (event) => {
    const value = event.target.value;
    setMaxPriceInput(value);
  };

  // Apply price filter
  const applyPriceFilter = () => {
    const min = minPriceInput !== "" ? parseInt(minPriceInput) : null;
    const max = maxPriceInput !== "" ? parseInt(maxPriceInput) : null;

    setFilterParams((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  // Handle sorting change
  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortValue(value);

    if (value === "priceHighToLow") {
      setFilterParams((prev) => ({
        ...prev,
        sortBy: "productPrice",
        descending: true,
      }));
    } else if (value === "priceLowToHigh") {
      setFilterParams((prev) => ({
        ...prev,
        sortBy: "productPrice",
        descending: false,
      }));
    } else if (value === "popularity") {
      setFilterParams((prev) => ({
        ...prev,
        sortBy: "totalSold",
        descending: true,
      }));
    } else {
      setFilterParams((prev) => ({
        ...prev,
        sortBy: "productPrice",
        descending: true,
      }));
    }
  };

  return (
    <Container>
      <div className="min-h-screen pt-5">
        <div className="flex container rounded-lg">
          {/* Sidebar Filters */}
          <div className="flex-shrink-0 w-[250px] mr-6">
            <Paper elevation={0} sx={{ p: 2, border: "1px solid #eee" , borderRadius: "10px" }} className="dark:bg-transparent dark:text-white">
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Filters
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Sort Options */}
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Sort By
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={sortValue}
                    onChange={handleSortChange}
                    displayEmpty
                    MenuProps={{
                      disableScrollLock: true,
                    }}
                    className="dark:bg-white"
                  >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="priceHighToLow">
                      Price: High to Low
                    </MenuItem>
                    <MenuItem value="priceLowToHigh">
                      Price: Low to High
                    </MenuItem>
                    <MenuItem value="popularity">Popularity</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Price Range Filter */}
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Price Range
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Min Price"
                    size="small"
                    fullWidth
                    value={minPriceInput}
                    onChange={handleMinPriceChange}
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    className="dark:bg-white"
                  />
                  <TextField
                    label="Max Price"
                    size="small"
                    fullWidth
                    value={maxPriceInput}
                    onChange={handleMaxPriceChange}
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    className="dark:bg-white"
                  />
                  <Button
                    variant="contained"
                    onClick={applyPriceFilter}
                    sx={{
                      bgcolor: "#FF385C",
                      "&:hover": { bgcolor: "#e02e4e" },
                      textTransform: "none",
                    }}
                  >
                    Apply Filter
                  </Button>
                </Stack>
              </Box>

              {filterParams.minPrice || filterParams.maxPrice ? (
                <Box mb={2}>
                  <Typography variant="body2" color="primary" fontWeight={500}>
                    Active Filters:
                  </Typography>
                  <Box
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {filterParams.minPrice && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          bgcolor: "#f5f5f5",
                          borderRadius: 1,
                          fontSize: 14,
                        }}
                      >
                        Min: {filterParams.minPrice}đ
                      </Box>
                    )}
                    {filterParams.maxPrice && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          bgcolor: "#f5f5f5",
                          borderRadius: 1,
                          fontSize: 14,
                        }}
                      >
                        Max: {filterParams.maxPrice}đ
                      </Box>
                    )}
                  </Box>
                  <Button
                    size="small"
                    onClick={() => {
                      setFilterParams((prev) => ({
                        ...prev,
                        minPrice: null,
                        maxPrice: null,
                      }));
                      setMinPriceInput("");
                      setMaxPriceInput("");
                    }}
                    sx={{ mt: 1, textTransform: "none", fontSize: 12 }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              ) : null}
            </Paper>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <Typography variant="body1">Loading products...</Typography>
            ) : products.length === 0 ? (
              <EmptyState title="No products found" />
            ) : (
              <div>
                <Typography variant="body2" color="text.secondary" mb={2} className="dark:text-white">
                  Showing {products.length} results
                </Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  <DataMapper
                    data={products}
                    Component={ProductCard}
                    emptyStateComponent={
                      <EmptyState title="No products found" />
                    }
                    loading={isLoading}
                    getKey={(item) => item.id}
                    componentProps={(product) => ({
                      image: product.imageUrls?.[0] || (
                        <Skeleton animation="wave" />
                      ),
                      productName: product.productName,
                      rate: product.rate,
                      price: product.productPrice,
                      quantity: product.quantity,
                      totalSold: product.totalSold,
                      id: product.id,
                      href: `/products/${generateSlug(product.productName)}`,
                      isAdditionalProduct: false,
                    })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListProductPage;
