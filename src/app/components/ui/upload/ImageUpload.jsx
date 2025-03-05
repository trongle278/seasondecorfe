"use client";
import { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import Image from "next/image";

const ImageUpload = ({ onImageChange, resetImage, required, className }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    // Validate selected images
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length + selectedImages.length > 5) {
      setErrorMessage("You can upload up to 5 images only.");
      return;
    }

    if (validFiles.length > 0) {
      const imagePromises = validFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file, preview: reader.result });
          reader.readAsDataURL(file);
        });
      });
  
      Promise.all(imagePromises).then((newImages) => {
        const updatedImages = [...selectedImages, ...newImages];
  
        setSelectedImages(updatedImages); 
        onImageChange(updatedImages.map((img) => img.file)); 
        setErrorMessage(""); 
      });
    } else {
      setErrorMessage("Please select valid image files (png, jpg, jpeg)");
    }
  };

  const removeImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    onImageChange(updatedImages.map((img) => img.file));
  };

  return (
    <div className="z-9 top-0 h-full flex">
      <div className="extraOutline bg-transparent w-max m-auto rounded-lg">
        <div
          className="file_upload p-5 relative border-4 border-dotted"
          style={{ width: "300px" }}
        >
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
                Select Images ({selectedImages.length}/5)
              </div>
            </label>
          </div>

          {/* Display Selected Images */}
          <div className="mt-4 flex flex-wrap gap-3 justify-start">
            {selectedImages.map((image, index) => (
              <div
                key={index}
                className="relative rounded-md overflow-hidden border border-gray-300 shadow-md"
                style={{ width: "100px", height: "100px" }} 
              >
                <Image
                  src={image.preview}
                  alt={`Selected Image ${index}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover rounded-md"
                  priority                
                />
                <button
                  className="absolute top-1 right-1 bg-red text-white text-xs px-2 py-1 rounded-full shadow-md"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
