"use client";
import { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

const ImageUpload = ({ onImageChange, resetImage, required }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();

      reader.onload = () => {
        setSelectedImage(reader.result);
        onImageChange(file);
        setErrorMessage(""); // Clear any previous error messages
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage("Please select a valid image file (png, jpg, jpeg)");
    }
  };

  return (
    <div className="z-9 top-0 h-full flex">
      <div className="extraOutline bg-transparent w-max bg-whtie m-auto rounded-lg">
        <div
          className="file_upload p-5 relative border-4 border-dotted"
          style={{ width: "200px" }}
        >
          {selectedImage ? (
            <div className="">
              <img
                src={selectedImage}
                alt="Selected Image"
                style={{ maxWidth: "100%" }}
              />
            </div>
          ) : (
            <div className="input_field flex flex-col w-max mx-auto text-center">
              <label className="flex flex-col items-center">
                <input
                  className="text-sm cursor-pointer w-full hidden"
                  type="file"
                  onChange={handleImageChange}
                  multiple
                />
                <MdOutlineFileUpload size={30} />
                <div className="text-sm bg-primary text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500 w-full">
                  Select Images
                  <br />
                  (0/5)
                </div>
              </label>
            </div>
          )}
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
