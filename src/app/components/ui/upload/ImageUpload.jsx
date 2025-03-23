"use client";
import { useState, useEffect } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import Image from "next/image";

const ImageUpload = ({ onImageChange, existingImages = [], onExistingImagesChange, resetImage, required, className }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [displayImages, setDisplayImages] = useState([]);

  // Initialize displayImages with existingImages if provided
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setDisplayImages([...existingImages]);
    }
  }, [existingImages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    // Validate selected images
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length + displayImages.length > 5) {
      setErrorMessage("You can upload up to 5 images only.");
      return;
    }

    if (validFiles.length > 0) {
      const imagePromises = validFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file, preview: reader.result, isNew: true });
          reader.readAsDataURL(file);
        });
      });
  
      Promise.all(imagePromises).then((newImages) => {
        const updatedNewImages = [...selectedImages, ...newImages];
        setSelectedImages(updatedNewImages);
        
        // Update the combined display images
        const updatedDisplayImages = [...displayImages, ...newImages];
        setDisplayImages(updatedDisplayImages);
        
        // Notify parent about new image files
        onImageChange(updatedNewImages.map((img) => img.file));
        setErrorMessage("");
      });
    } else {
      setErrorMessage("Please select valid image files (png, jpg, jpeg)");
    }
  };

  const removeImage = (index) => {
    const imageToRemove = displayImages[index];
    
    // Remove from the appropriate array
    if (imageToRemove.isExisting) {
      // It's an existing image
      const updatedExistingImages = existingImages.filter(img => img.id !== imageToRemove.id);
      
      // Notify parent component about removed existing image
      if (onExistingImagesChange) {
        onExistingImagesChange(updatedExistingImages);
      }
    } else {
      // It's a new image
      const updatedSelectedImages = selectedImages.filter((_, i) => 
        selectedImages.findIndex(img => img.preview === imageToRemove.preview) !== i
      );
      setSelectedImages(updatedSelectedImages);
      onImageChange(updatedSelectedImages.map((img) => img.file));
    }
    
    // Update the display list
    const updatedDisplayImages = displayImages.filter((_, i) => i !== index);
    setDisplayImages(updatedDisplayImages);
  };

  return (
    <div className="z-9 top-0 h-full flex">
      <div className="extraOutline bg-transparent w-max m-auto rounded-lg">
        <div
          className="file_upload p-5 relative border-4 border-dotted"
          style={{ width: "600px" }}
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
                Select Images ({displayImages.length}/5)
              </div>
            </label>
          </div>

          {/* Display All Images (Existing + New) */}
          <div className="mt-4 flex flex-wrap gap-3 justify-start">
            {displayImages.map((image, index) => (
              <div
                key={index}
                className="relative rounded-md overflow-hidden border border-gray-300 shadow-md"
                style={{ width: "100px", height: "100px" }} 
              >
                <Image
                  src={image.isExisting ? image.url : image.preview}
                  alt={`Image ${index}`}
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
