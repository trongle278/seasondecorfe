"use client";

import { useState, useEffect, useRef } from "react";
import { getProvinces, getDistricts } from "vn-provinces";
import DropdownSelect from "@/app/components/ui/Select/DropdownSelect";

const ProvinceDistrictWardSelect = ({
  onChange,
  defaultProvince,
  defaultDistrict,
  combineAsString = false,
  setValue,
  register,
}) => {
  const provinces = getProvinces();
  const [selectedProvince, setSelectedProvince] = useState(
    defaultProvince || "Select province"
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    defaultDistrict || "Select district"
  );
  const [districts, setDistricts] = useState([]);
  const allDistricts = getDistricts();
  
  // Use ref to track previous values to prevent unnecessary updates
  const prevValues = useRef({ province: null, district: null });
  const isInitialMount = useRef(true);

  // Effect for combined string mode (for service creation)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update if we're in combined mode and values have changed
    if (combineAsString && 
        selectedProvince && 
        selectedProvince !== "Select province" &&
        (prevValues.current.province !== selectedProvince || 
         prevValues.current.district !== selectedDistrict)) {
      
      // Create combined location string
      const locationString = selectedDistrict && selectedDistrict !== "Select district"
        ? `${selectedProvince}, ${selectedDistrict}`
        : selectedProvince;
      
      prevValues.current = { 
        province: selectedProvince, 
        district: selectedDistrict 
      };
      
      // If using react-hook-form
      if (setValue) {
        setValue("province", locationString);
      }
      
      // Call onChange with the combined string
      if (onChange) {
        onChange(locationString);
      }
      
      console.log("Combined location:", locationString);
    }
  }, [combineAsString, selectedProvince, selectedDistrict, onChange, setValue]);

  // Effect to update districts when province changes
  useEffect(() => {
    if (selectedProvince && selectedProvince !== "Select province") {
      const provinceObj = provinces.find((p) => p.name === selectedProvince);
      if (!provinceObj) return;

      const filteredDistricts = allDistricts.filter(
        (d) => d.provinceCode === provinceObj.code
      );
      
      setDistricts(filteredDistricts);
      
      // Only reset district if it's not the initial mount
      if (!isInitialMount.current) {
        setSelectedDistrict("");
      }
    } else {
      setDistricts([]);
    }
  }, [selectedProvince, provinces, allDistricts]);

  // Effect to handle default values
  useEffect(() => {
    let shouldUpdateDistricts = false;
    
    if (defaultProvince && defaultProvince !== selectedProvince) {
      setSelectedProvince(defaultProvince);
      shouldUpdateDistricts = true;
    }
    
    if (shouldUpdateDistricts) {
      const provinceObj = provinces.find((p) => p.name === defaultProvince);
      if (provinceObj) {
        const filteredDistricts = allDistricts.filter(
          (d) => d.provinceCode === provinceObj.code
        );
        setDistricts(filteredDistricts);
      }
    }
    
    if (defaultDistrict && defaultDistrict !== selectedDistrict) {
      setSelectedDistrict(defaultDistrict);
    }
  }, [defaultProvince, defaultDistrict, provinces, allDistricts]);

  const handleProvinceChange = (provinceName) => {
    if (provinceName === selectedProvince) return;
    
    console.log("Selected Province:", provinceName);
    setSelectedProvince(provinceName);
    
    // District will be reset in the useEffect

    // Only call onChange with separate values if not in combined string mode
    if (!combineAsString) {
      onChange?.({ province: provinceName, district: "" });
    }
  };

  const handleDistrictChange = (districtName) => {
    if (districtName === selectedDistrict) return;
    
    console.log("Selected District:", districtName);
    setSelectedDistrict(districtName);

    // Only call onChange with separate values if not in combined string mode
    if (!combineAsString) {
      onChange?.({
        province: selectedProvince,
        district: districtName,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <DropdownSelect
        label="Province"
        options={provinces.map((p) => ({ id: p.code, name: p.name }))}
        value={selectedProvince || ""}
        onChange={handleProvinceChange}
        lisboxClassName="mt-14"
      />

      <DropdownSelect
        label="District"
        options={districts.map((d) => ({ id: d.code, name: d.name }))}
        value={selectedDistrict || ""}
        onChange={handleDistrictChange}
        disabled={!selectedProvince || selectedProvince === "Select province"}
        lisboxClassName="mt-14"
      />

      {register && combineAsString && (
        <input 
          type="hidden" 
          {...register("province")} 
          value={selectedProvince && selectedDistrict && selectedProvince !== "Select province" && selectedDistrict !== "Select district" 
            ? `${selectedProvince}, ${selectedDistrict}` 
            : (selectedProvince !== "Select province" ? selectedProvince : "")}
        />
      )}
    </div>
  );
};

export default ProvinceDistrictWardSelect;
