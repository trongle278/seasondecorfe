"use client";

import { BorderBox } from "../BorderBox";
import { FootTypo } from "../Typography";
import { MdOutlineEdit } from "react-icons/md";
import Image from "next/image";
import { Textarea } from "@headlessui/react";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { formatDate } from "@/app/helpers";

const TrackingCard = ({ note, task, imageUrls, createdAt, editClick, removeClick }) => {
  return (
    <BorderBox className="font-semibold relative">
      <div className="flex items-center gap-3 absolute top-0 right-5 ">
        <button
          onClick={editClick}
          className="flex justify-between items-center gap-2  bg-action text-white p-2 rounded-lg hover:bg-gray-200 hover:text-black"
        >
          <MdOutlineEdit />
          Edit Tracking
        </button>
        <button
          onClick={removeClick}
          className="flex justify-between items-center gap-2 bg-red text-white p-2 rounded-lg hover:bg-gray-200 hover:text-black"
        >
          <MdOutlinePlaylistRemove />
          Remove Tracking
        </button>
      </div>

      <span className="flex items-center gap-3 absolute top-[-27] left-5 bg-action-contrast dark:bg-transparent ">
        {formatDate(createdAt)}
      </span>

      {/* Task Section */}
      <div className="flex flex-col mb-6 rounded-lg mt-12">
        <FootTypo footlabel="Task" className="text-lg" />
        <Textarea
          as="textarea"
          name="task"
          value={task}
          className="mt-4 block w-full resize-none rounded-2xl bg-gray-100 dark:bg-gray-700
      border border-transparent py-3 px-4  text-gray-800 dark:text-white
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
      transition duration-300 whitespace-pre-wrap shadow-sm"
          placeholder="No task available"
          rows={2}
          disabled
          readOnly
        />
      </div>

      {/* Note Section */}
      <div className="flex flex-col mb-6 rounded-lg">
        <FootTypo footlabel="Note" className="text-lg" />
        <Textarea
          as="textarea"
          name="note"
          value={note}
          className="mt-4 block w-full resize-none rounded-2xl bg-gray-100 dark:bg-gray-700
      border border-transparent py-3 px-4  text-gray-800 dark:text-white
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white
      transition duration-300 whitespace-pre-wrap shadow-sm"
          placeholder="No notes available"
          rows={5}
          disabled
          readOnly
        />
      </div>

      {/* Images Gallery */}
      <div>
        <FootTypo footlabel="Images by provider" className="text-lg" />
        <div className="mt-2">
          {Array.isArray(imageUrls) && imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageUrls.map((image, index) => {
                return (
                  <div
                    key={index}
                    className="aspect-auto rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`Progress image ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                      unoptimized={false}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <FootTypo
                footlabel="No images available."
                className="text-gray-500"
              />
            </div>
          )}
        </div>
      </div>
    </BorderBox>
  );
};

export default TrackingCard;
