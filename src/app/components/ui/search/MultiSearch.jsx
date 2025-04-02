"use client";

import * as React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FootTypo } from "../Typography";
import Divider from "@mui/material/Divider";
import { GiCalendarHalfYear} from "react-icons/gi";
import SearchModal from "./SearchModal";
import { MdCategory } from "react-icons/md";
import { locations } from "@/app/constant/province";
import { categories } from "@/app/constant/decorCategories";
import { seasons } from "@/app/constant/season";
import { useSearchDecorService } from "@/app/queries/service/service.query";
import { IoIosClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { getDistricts } from "vn-provinces";

export const MultiSearch = ({ onSearch, onSearchResults }) => {
  const router = useRouter();
  const [activeModal, setActiveModal] = React.useState(null);
  const [selectedValues, setSelectedValues] = React.useState({
    sublocation: "",
    category: "",
    season: ""
  });
  const [searchParams, setSearchParams] = React.useState(null);
  const [districtSuggestions, setDistrictSuggestions] = React.useState([]);
  
  // Get user location from Redux
  const userLocation = useSelector((state) => state.users.userLocation);
  
  // Refs for each search section
  const locationRef = React.useRef(null);
  const categoryRef = React.useRef(null);
  const seasonRef = React.useRef(null);
  
  // Query for search results
  const { data: searchResults, isLoading, error } = useSearchDecorService(searchParams);

  React.useEffect(() => {
    if (userLocation && userLocation.code) {
      try {
        const allDistricts = getDistricts();
        
        const provinceDistricts = allDistricts.filter(
          district => district.provinceCode === userLocation.code
        );
        
        const formattedDistricts = provinceDistricts.map(district => ({
          id: district.code,
          label: district.name,
          value: district.name,
          description: `District in ${userLocation.province}`
        }));
        
        // Set district suggestions
        setDistrictSuggestions(formattedDistricts);
        
        console.log(`Loaded ${formattedDistricts.length} districts for province: ${userLocation.province} (${userLocation.code})`);
      } catch (error) {
        console.error("Error loading districts:", error);
      }
    } else {
      setDistrictSuggestions([]);
    }
  }, [userLocation]);

  // Effect to check and handle empty userLocation values
  React.useEffect(() => {
    if (!userLocation || !userLocation.province) {
      setDistrictSuggestions([]);
    }
  }, [userLocation]);

  // Effect to handle search results
  React.useEffect(() => {
    if (!isLoading) {
      if (onSearchResults) {
        onSearchResults(searchResults);
      }
    }
  }, [searchResults, isLoading, onSearchResults]);

  const handleOpenModal = (type) => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleSearch = (label, type, value) => {
    // For season type, handle multiple selections
    if (type === 'season') {
      // If multiple seasons are selected, join them with commas
      const seasonLabel = Array.isArray(value) ? value.join(', ') : label;
      setSelectedValues({
        ...selectedValues,
        [type]: seasonLabel,
      });
    } else {
      // For other types, use the label directly
      setSelectedValues({
        ...selectedValues,
        [type]: label,
      });
    }
    handleCloseModal();
  };

  const performSearch = () => {
    // Create API search parameters
    const apiParams = {};
    let hasAnyParam = false;
    
    // Process selected values for API
    if (selectedValues.sublocation && selectedValues.sublocation !== "All") {
      // Check if searching by district or province
      if (districtSuggestions.length > 0 && districtSuggestions.some(d => d.label === selectedValues.sublocation)) {
        // If it's a district, use it as Sublocation
        apiParams.Sublocation = selectedValues.sublocation;
      } else {
        // Otherwise use province
        apiParams.Province = selectedValues.sublocation;
      }
      hasAnyParam = true;
    }
    
    if (selectedValues.category && selectedValues.category !== "All") {
      apiParams.CategoryName = selectedValues.category;
      hasAnyParam = true;
    }
    
    if (selectedValues.season && selectedValues.season !== "All") {
      // Split the season string if it contains multiple seasons
      const seasonArray = selectedValues.season.split(',').map(s => s.trim());
      apiParams.SeasonNames = seasonArray;
      hasAnyParam = true;
    }
    
    console.log("Search parameters:", apiParams);
    
    // Set search parameters for API
    setSearchParams(hasAnyParam ? apiParams : null);
    
    // If onSearch callback is provided
    if (onSearch) {
      onSearch(selectedValues);
    }
  };

  const resetSearch = () => {
    // Reset all selected values
    setSelectedValues({
      sublocation: "",
      category: "",
      season: ""
    });
    // Reset search parameters
    setSearchParams(null);
    // Clear the active modal if any
    setActiveModal(null);
    
    // Notify parent components
    if (onSearchResults) {
      onSearchResults(null);
    }
    if (onSearch) {
      onSearch({});
    }
  };

  // Get the current anchor ref based on active modal
  const getCurrentAnchorRef = () => {
    switch (activeModal) {
      case 'sublocation': return locationRef.current;
      case 'category': return categoryRef.current;
      case 'season': return seasonRef.current;
      default: return null;
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto dark:text-black">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-full shadow-md border border-gray-200 overflow-hidden">
        <Divider orientation="vertical" variant="middle" flexItem/>
        <div 
          ref={locationRef}
          className="flex-1 w-full md:w-auto relative cursor-pointer hover:bg-gray-100 hover:rounded-full"
          onClick={() => handleOpenModal('sublocation')}
        >
          <div className="p-4 flex items-center">
            <div className="mr-3">
              <FaMapMarkerAlt size={20} />
            </div>
            <div>
              <FootTypo 
                footlabel={userLocation && userLocation.province ? `Where in ${userLocation.province}` : "Where"} 
                className="text-sm font-semibold" 
              />
              <FootTypo
                footlabel={selectedValues.sublocation || (districtSuggestions.length > 0 ? "Search by district" : "Search by location")}
                className="text-sm"
              />
            </div>
          </div>
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div 
          ref={categoryRef}
          className="flex-1 w-full md:w-auto relative cursor-pointer hover:bg-gray-100 hover:rounded-full"
          onClick={() => handleOpenModal('category')}
        >
          <div className="p-4 flex items-center">
            <div className="mr-3">
              <MdCategory size={20} />
            </div>
            <div>
              <FootTypo
                footlabel="Category"
                className="text-sm font-semibold"
              />
              <FootTypo
                footlabel={selectedValues.category || "Search by category"}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <Divider orientation="vertical" variant="middle" flexItem />
        <div 
          ref={seasonRef}
          className="flex-1 w-full md:w-auto relative cursor-pointer hover:bg-gray-100 hover:rounded-full"
          onClick={() => handleOpenModal('season')}
        >
          <div className="p-4 flex items-center">
            <div className="mr-3">
              <GiCalendarHalfYear size={20} />
            </div>
            <div>
              <FootTypo
                footlabel="Season"
                className="text-sm font-semibold"
              />
              <FootTypo
                footlabel={selectedValues.season || "Search by season"}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center p-2 md:pr-3 gap-2">
          {(selectedValues.sublocation || selectedValues.category || selectedValues.season) && (
            <button
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={resetSearch}
              title="Clear all"
            >
              <IoIosClose size={20}/>
            </button>
          )}
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-3 flex items-center justify-center focus:outline-none transition duration-200"
            onClick={performSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <IoSearchOutline size={24} />
            )}
          </button>
        </div>
      </div>

      <SearchModal
        isOpen={activeModal === 'sublocation'}
        onClose={handleCloseModal}
        searchType="sublocation"
        onSearch={(label, type) => handleSearch(label, 'sublocation')}
        suggestions={districtSuggestions.length > 0 ? districtSuggestions : locations}
        title={districtSuggestions.length > 0 ? (userLocation && userLocation.province ? `Districts in ${userLocation.province}` : "Districts") : "Search by Location"}
        icon={FaMapMarkerAlt}
        anchorEl={getCurrentAnchorRef()}
      />

      <SearchModal
        isOpen={activeModal === 'category'}
        onClose={handleCloseModal}
        searchType="category"
        onSearch={handleSearch}
        suggestions={categories}
        title="Search by Category"
        icon={MdCategory}
        anchorEl={getCurrentAnchorRef()}
      />

      <SearchModal
        isOpen={activeModal === 'season'}
        onClose={handleCloseModal}
        searchType="season"
        onSearch={handleSearch}
        suggestions={seasons}
        title="Search by Season"
        icon={GiCalendarHalfYear}
        anchorEl={getCurrentAnchorRef()}
      />
    </div>
  );
};