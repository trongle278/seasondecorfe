"use client";

import React, { useState, useEffect } from "react";
import { useLocationModal } from "@/app/hooks/useLocationModal";
import Modal from "../Modal";
import Heading from "./components/Heading";
import Button from "../Buttons/Button";
import { FootTypo } from "../Typography";
import { getProvinces } from "vn-provinces";
import { IoIosArrowDown } from "react-icons/io";
import { useUpdateUserLocation } from "@/app/queries/user/user.query";
import { IoLocation } from "react-icons/io5";
import { useForm } from "react-hook-form";

const LocationModal = () => {
  const locationModal = useLocationModal();
  const [provinces, setProvinces] = useState([]);
  const [isOpen, setIsOpen] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
    },
  });

  // Get the current location value from form
  const selectedLocation = watch("location");

  // Use the update location API hook
  const { mutate: updateLocation, isPending: loading } =
    useUpdateUserLocation();

  useEffect(() => {
    // Get all provinces from vn-provinces
    const allProvinces = getProvinces();
    setProvinces(allProvinces);
  }, []);

  useEffect(() => {
    // Set force open when modal is opened
    if (locationModal.isOpen) {
      locationModal.setForceOpen(true);
    }
  }, [locationModal.isOpen]);

  const handleProvinceSelect = (provinceName) => {
    setValue("location", provinceName, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsOpen(false);
  };

  const onSubmit = (data) => {
    updateLocation(
      {
        location: data.location,
      },
      {
        onSuccess: (response) => {
          console.log("Location updated successfully:", response);

          localStorage.setItem("userProvince", data.location);

          locationModal.onSuccessUpdate();
        },
        onError: (error) => {
          console.error("Error updating location:", error);
        },
      }
    );
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const bodyContent = (
    <div className="flex flex-col gap-6">
      <Heading title="Welcome to SeasonDecor" center={true} />
      <FootTypo footlabel="In order to continue, please select your province" />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mt-4 relative">
          <div
            className="flex justify-between items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition"
            onClick={toggleDropdown}
          >
            <span
              className={`${selectedLocation && "flex items-center gap-2"} ${
                !selectedLocation && "text-gray-500"
              }`}
            >
              {selectedLocation && <IoLocation className="w-4 h-4" />}
              {selectedLocation || "Choose your location"}
            </span>
            <IoIosArrowDown
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isOpen && (
            <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
              {provinces.map((p) => (
                <div
                  key={p.code}
                  className="p-3 hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => handleProvinceSelect(p.name)}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}

          {errors.location && (
            <p className="text-red-500 text-sm mt-2">
              {errors.location.message}
            </p>
          )}
        </div>

        <input
          type="hidden"
          {...register("location", {
            required: "Please select your province",
          })}
        />
      </form>
    </div>
  );

  return (
    <Modal
      disabled={loading}
      isOpen={locationModal.isOpen}
      title="Select Your Province"
      onClose={locationModal.onClose}
      actionLabel="Update"
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      forceOpen={locationModal.forceOpen}
      loading={loading}
    />
  );
};

export default LocationModal;
