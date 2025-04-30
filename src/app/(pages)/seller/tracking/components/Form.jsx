"use client";

import React from "react";
import Button from "@/app/components/ui/Buttons/Button";
import { LuPencil, LuImage, LuSend, LuSave } from "react-icons/lu";
import { MdNotes } from "react-icons/md";
import { Field, Textarea } from "@headlessui/react";
import { FootTypo } from "@/app/components/ui/Typography";
import Image from "next/image";
import { BiTask } from "react-icons/bi";
import { useForm, Controller } from "react-hook-form";

const TrackingForm = ({
  onSubmit,
  defaultValues = { task: "", note: "" },
  images,
  handleImageUpload,
  removeImage,
  isPending,
  isEdit = false,
}) => {
  const { 
    control, 
    handleSubmit,
    formState: { errors } 
  } = useForm({
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center mb-2">
          <BiTask className="text-primary mr-2" size={20} />
          <FootTypo footlabel="Task" className="font-medium text-lg" />
        </div>
        <Controller
          name="task"
          control={control}
          rules={{ required: "Task is required" }}
          render={({ field }) => (
            <Field>
              <Textarea
                id="task"
                {...field}
                placeholder="Your Task"
                className={`
                  mt-3 block w-full resize-none rounded-lg border-[1px] 
                  ${errors.task ? 'border-red' : 'border-black dark:border-gray-600'} 
                  py-1.5 px-3 text-sm/6 
                  bg-white dark:bg-gray-800 text-black dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
                  transition duration-200
                `}
                rows={2}
              />
              {errors.task && (
                <p className="mt-1 text-sm text-red">{errors.task.message}</p>
              )}
            </Field>
          )}
        />
      </div>

      {/* Note Section */}
      <div className="space-y-2">
        <div className="flex items-center mb-2">
          <MdNotes className="text-primary mr-2" size={20} />
          <FootTypo
            footlabel="Progress Notes"
            className="font-medium text-lg"
          />
        </div>
        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <Field>
              <Textarea
                id="note"
                {...field}
                placeholder="Notes about the service"
                className={`
                  mt-3 block w-full resize-none rounded-lg border-[1px] 
                  border-black dark:border-gray-600 py-1.5 px-3 text-sm/6 
                  bg-white dark:bg-gray-800 text-black dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
                  transition duration-200
                `}
                rows={7}
              />
            </Field>
          )}
        />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <div className="flex items-center mb-2">
          <LuImage className="text-primary mr-2" size={20} />
          <FootTypo
            footlabel="Progress Images"
            className="font-medium text-lg"
          />
          <span className="text-sm text-gray-500 ml-2">
            ({images.length}/5 images)
          </span>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image.preview}
                  alt={`Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="h-50 w-full object-cover rounded-lg border border-gray-200"
                  unoptimized={false}
                />

                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div className="flex items-center justify-center w-full">
          <label
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 ${
              images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <LuImage className="text-gray-400 mb-2" size={32} />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG or JPEG (MAX. 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={images.length >= 5}
            />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-start">
        <Button
          type="submit"
          label={isEdit ? "Update Tracking" : "Add Tracking"}
          icon={isEdit ? <LuSave /> : <LuSend />}
          className="bg-primary text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all shadow-md"
          isLoading={isPending}
          disabled={isPending}
        />
      </div>
    </form>
  );
};

export default TrackingForm;
