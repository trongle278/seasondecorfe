"use client";

import { useState, useEffect } from "react";
import { getProvinces, getDistricts } from "vn-provinces";
import DropdownSelect from "@/app/components/ui/Select/DropdownSelect";

const ProvinceDistrictWardSelect = ({
  onChange,
  defaultProvince,
  defaultDistrict,
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

  useEffect(() => {
    if (selectedProvince) {
      console.log("Fetching districts for province:", selectedProvince);

      // **Manually filter districts by province name**
      const provinceObj = provinces.find((p) => p.name === selectedProvince);
      if (!provinceObj) return;

      const filteredDistricts = allDistricts.filter(
        (d) => d.provinceCode === provinceObj.code
      );
      console.log("Filtered districts:", filteredDistricts);

      setDistricts(filteredDistricts);
      setSelectedDistrict("");
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (defaultProvince) {
      setSelectedProvince(defaultProvince);

     
      const provinceObj = provinces.find((p) => p.name === defaultProvince);
      if (provinceObj) {
        const filteredDistricts = allDistricts.filter(
          (d) => d.provinceCode === provinceObj.code
        );
        setDistricts(filteredDistricts);

        if (!filteredDistricts.some((d) => d.name === defaultDistrict)) {
          setSelectedDistrict("");
        }
      }
    }
    if (defaultDistrict) {
      setSelectedDistrict(defaultDistrict);
    }
  }, [defaultProvince, defaultDistrict]);

  const handleProvinceChange = (provinceName) => {
    console.log("Selected Province:", provinceName);
    setSelectedProvince(provinceName);
    setSelectedDistrict("");

    onChange?.({ province: provinceName, district: "" });
  };

  const handleDistrictChange = (districtName) => {
    console.log("Selected District:", districtName);
    setSelectedDistrict(districtName);

    // Send to API as a string
    onChange?.({
      province: selectedProvince,
      district: districtName,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Province Dropdown */}
      <DropdownSelect
        label="Province"
        options={provinces.map((p) => ({ id: p.code, name: p.name }))}
        value={selectedProvince || ""}
        onChange={handleProvinceChange}
      />

      {/* District Dropdown */}
      <DropdownSelect
        label="District"
        options={districts.map((d) => ({ id: d.code, name: d.name }))}
        value={selectedDistrict || ""}
        onChange={handleDistrictChange}
        disabled={!selectedProvince}
      />
    </div>
  );
};

export default ProvinceDistrictWardSelect;
