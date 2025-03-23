"use client";

import React, { useState, useRef } from "react";
import { BorderBox } from "../BorderBox";
import { FootTypo } from "../Typography";
import { Element } from "react-scroll";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import Button from "../Buttons/Button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { FaPenFancy, FaImage } from "react-icons/fa";
import { CiSquareRemove } from "react-icons/ci";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { IoClose } from "react-icons/io5";

// Star Rating Component
const StarRating = ({ rating, onChange, editable = false }) => {
  const [hover, setHover] = useState(0);
  const totalStars = 5;

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <div
            key={index}
            className={`cursor-${editable ? "pointer" : "default"} p-1`}
            onClick={() => editable && onChange(starValue)}
            onMouseEnter={() => editable && setHover(starValue)}
            onMouseLeave={() => editable && setHover(0)}
          >
            {(hover || rating) >= starValue ? (
              <IoIosStar color="yellow" size={20} />
            ) : (
              <IoIosStarOutline size={20} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Review Item Component
const ReviewItem = ({ review }) => {
  const { rating, comment, userName, userImage, createdAt, images } = review;

  return (
    <div className="border-b dark:border-gray-700 py-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FaUser className="text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="font-semibold text-sm">{userName}</h4>
            <span className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center my-1">
            <StarRating rating={rating} />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {rating.toFixed(1)}
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            {comment}
          </p>
          
          {/* Display review images if available */}
          {images && images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((image, i) => (
                <div key={i} className="relative h-20 w-20 overflow-hidden rounded-md">
                  <Image
                    src={image.imageURL || image}
                    alt={`Review image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add Review Form Component
const AddReviewForm = ({ onSubmit, serviceId }) => {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // React Hook Form setup
  const { 
    handleSubmit, 
    control, 
    formState: { errors },
    reset
  } = useForm({
    mode: "onChange",
    defaultValues: {
      comment: ""
    }
  });

  // Create Tiptap editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Share your experience with this service...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "flex-1 w-full bg-white dark:bg-gray-800 rounded-lg border-[1px] border-black dark:border-gray-600 p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition duration-200 text-sm/6 text-black dark:text-white",
      },
    },
  });

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 3;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    // Check if total files exceed limit
    if (selectedImages.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images`);
      return;
    }

    // Filter files based on type and size
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File type not supported: ${file.name}`);
        return false;
      }
      if (file.size > maxFileSize) {
        toast.error(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    // Create preview URLs for valid files
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
    
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      // Release the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const onSubmitForm = () => {
    if (rating === 0 || !editor || editor.isEmpty) return;
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    // Extract files from selectedImages
    const files = selectedImages.map(img => img.file);
    
    onSubmit({ 
      rating, 
      comment: editor.getText(), 
      serviceId,
      images: files
    }, (progress) => {
      setUploadProgress(progress);
    })
    .then(() => {
      // Clean up all preview URLs
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setSelectedImages([]);
      setRating(0);
      editor.commands.setContent("");
      reset();
    })
    .finally(() => {
      setIsSubmitting(false);
      setUploadProgress(0);
    });
  };

  if (!session) {
    return (
      <div className="py-4 px-3 bg-gray-50 dark:bg-gray-800 rounded-md text-center">
        <FootTypo footlabel="Please sign in to leave a review" className="text-sm"/>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="py-4">
      <h3 className="font-semibold text-md mb-3">Write a Review</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Rating</label>
        <StarRating rating={rating} onChange={setRating} editable={true} />
        {rating === 0 && <p className="text-red text-xs mt-1">How do you feel ? </p>}
      </div>
      
      <div className="mb-4 h-full">
        <label className="block text-sm font-medium mb-1">Your Review</label>
        <div className={`relative border rounded-lg ${errors.comment ? "border-red" : ""}`}>
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <EditorContent 
                editor={editor} 
                className="mb-0"
              />
            )}
          />
          
          {/* Selected images preview - now inside editor area */}
          {selectedImages.length > 0 && (
            <div className="p-2 bg-transparent">
              <div className="flex flex-wrap gap-2">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <div className="h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={img.preview}
                        alt={`Selected image ${index + 1}`}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveImage(index);
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red p-1 text-white"
                    >
                      <IoClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {editor && editor.isEmpty && <p className="text-red-500 text-xs mt-1">Please write a review</p>}
      </div>
      
      {/* Image upload section */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-primary hover:text-primary-dark text-sm flex items-center gap-1"
          >
            <FaImage size={16} />
            Add Images ({selectedImages.length}/3)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>
      
      {/* Upload progress */}
      {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full mb-4">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
        </div>
      )}
      
      <Button
        type="submit"
        label={isSubmitting ? "Submitting..." : "Submit Review"}
        className="bg-primary"
        disabled={isSubmitting || rating === 0 || (editor && editor.isEmpty)}
      />
    </form>
  );
};

const ReviewSection = ({
  reviews = [],
  onAddReview,
  serviceId,
  averageRating = 0,
  totalReviews = 0,
  isLoading = false,
  label,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  

  return (
    <Element name="reviewSection">
      <BorderBox className="my-5">
        <section className="px-3 pt-3">
          <FootTypo
            footlabel={label}
            className="text-lg !mx-0 font-semibold p-3 bg-gray-50 capitalize w-full dark:bg-zinc-800"
          />

          <div className="p-4">
            {/* Summary */}
            <div className="flex items-center mb-6">
              <div className="mr-4">
                <div className="text-3xl font-bold">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={averageRating} />
                <div className="text-sm text-gray-500 mt-1">
                  {totalReviews} reviews
                </div>
              </div>

              <div className="ml-auto">
                <Button
                  icon={
                    showAddForm ? (
                      <CiSquareRemove size={20} />
                    ) : (
                      <FaPenFancy size={20} />
                    )
                  }
                  label={showAddForm ? "Cancel" : "Write a Review"}
                  className={showAddForm ? "bg-gray-500" : "bg-primary"}
                  onClick={() => setShowAddForm(!showAddForm)}
                />
              </div>
            </div>

            {/* Add Review Form */}
            {showAddForm && (
              <div className="mb-6 border-b pb-6">
                <AddReviewForm onSubmit={onAddReview} serviceId={serviceId} />
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Loading reviews...
                  </p>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <ReviewItem key={index} review={review} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </BorderBox>
      <style jsx global>{`
        .is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        
        .ProseMirror:focus {
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 80px;
          pointer-events: none;
        }
      `}</style>
    </Element>
  );
};

export default ReviewSection;
