import React, { useState } from "react";
import { EditorContent } from "@tiptap/react";
import { IoSend, IoClose, IoEyeSharp } from "react-icons/io5";
import { BsImage } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { GoDownload } from "react-icons/go";
import { FaFilePdf } from "react-icons/fa6";
import { LuCheck } from "react-icons/lu";
import { CgSpinner } from "react-icons/cg";
import fileDownload from "js-file-download";
import Image from "next/image";
import { BsPersonCircle } from "react-icons/bs";

const ChatView = ({
  messages = [],
  user,
  editor,
  fileInputRef,
  selectedFiles,
  isUploading,
  uploadProgress,
  handleRemoveFile,
  handleFileSelect,
  handleSendMessage,
  messagesEndRef,
  isLoading,
  selectedReceiver,
}) => {
  const [downloadingFiles, setDownloadingFiles] = useState({});

  const isImageFile = (fileName) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  const isPdfFile = (fileName) => {
    return fileName.toLowerCase().endsWith(".pdf");
  };

  const getFileIcon = (fileName) => {
    if (isPdfFile(fileName))
      return <FaFilePdf className="text-red-500" size={18} />;
    return <ImAttachment size={18} />;
  };

  const handleDownloadFile = async (fileUrl, fileName, fileId) => {
    try {
      // Set downloading state for this file
      setDownloadingFiles((prev) => ({ ...prev, [fileId]: true }));

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      // For large files, this might take some time
      const blob = await response.blob();
      fileDownload(blob, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback to direct download if fetch fails
      window.open(fileUrl, "_blank");
    } finally {
      // Clear downloading state
      setDownloadingFiles((prev) => ({ ...prev, [fileId]: false }));
    }
  };

  return (
    <>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-[160px]">
        <div className="flex flex-col p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span>Loading messages...</span>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={`${msg.id}-${msg.sentTime}`}
                className={`flex ${
                  msg.senderId === user?.id ? "justify-end" : "justify-start"
                } mb-4`}
              >
                {/* Receiver Avatar */}
                {msg.senderId !== user?.id && (
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      {selectedReceiver?.avatar ? (
                        <Image 
                          src={selectedReceiver.avatar} 
                          alt={selectedReceiver.contactName || "Contact"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <BsPersonCircle size={20} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[250px] rounded-lg p-3 break-words whitespace-pre-wrap ${
                    msg.senderId === user?.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div
                    className="text-sm prose prose-sm"
                    dangerouslySetInnerHTML={{
                      __html: msg.message,
                    }}
                  />
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.files.map((file, fileIndex) => {
                        const fileId = `${msg.id}-${file.fileId || fileIndex}`;
                        const isDownloading = downloadingFiles[fileId];

                        return (
                          <div key={fileId} className="flex flex-col gap-2">
                            {isImageFile(file.fileName) ? (
                              <div className="relative group">
                                <img
                                  src={file.fileUrl}
                                  alt={file.fileName}
                                  className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() =>
                                    window.open(file.fileUrl, "_blank")
                                  }
                                />
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  {file.fileName}
                                </div>
                              </div>
                            ) : isPdfFile(file.fileName) ? (
                              <div className="bg-white/10 p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaFilePdf
                                    className="text-red-500"
                                    size={20}
                                  />
                                  <span className="text-xs font-medium truncate max-w-[180px]">
                                    {file.fileName}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleDownloadFile(
                                        file.fileUrl,
                                        file.fileName,
                                        fileId
                                      )
                                    }
                                    disabled={isDownloading}
                                    className={`flex items-center gap-1 ${
                                      isDownloading
                                        ? "bg-gray-200 text-gray-500"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                    } text-xs py-1 px-2 rounded transition-colors`}
                                  >
                                    {isDownloading ? (
                                      <>
                                        <CgSpinner
                                          size={12}
                                          className="animate-spin"
                                        />
                                        Downloading...
                                      </>
                                    ) : (
                                      <>
                                        <GoDownload size={12} />
                                        Download
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      window.open(file.fileUrl, "_blank")
                                    }
                                    className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs py-1 px-2 rounded transition-colors"
                                  >
                                    <IoEyeSharp size={12} />
                                    View
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-white/10 rounded">
                                {getFileIcon(file.fileName)}
                                <a
                                  href={file.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs hover:underline truncate max-w-[200px]"
                                >
                                  {file.fileName}
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex flex-col items-start justify-between text-xs opacity-70 mt-2">
                    <span>
                      {new Date(msg.sentTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    {msg.senderId === user?.id && (
                      <span className="flex flex-row items-center gap-1 text-xs">
                        {msg.isRead ? (
                          <IoEyeSharp size={12} />
                        ) : (
                          <LuCheck size={12} />
                        )}
                        {msg.isRead ? "Viewed" : "Sent"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Sender Avatar */}
                {msg.senderId === user?.id && (
                  <div className="flex-shrink-0 ml-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                      {user?.avatar ? (
                        <Image 
                          src={user.avatar} 
                          alt={user.name || "You"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                          <BsPersonCircle size={20} className="text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <span>Start chatting today !</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="fixed bottom-[100px] left-[214px] right-0 bg-gray-50 border-t border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">
              {uploadProgress < 100 ? "Uploading..." : "Processing..."}
            </span>
          </div>
        </div>
      )}

      {/* File Preview */}
      {selectedFiles.length > 0 && !isUploading && (
        <div className="fixed bottom-[110px] left-[214px] right-0 bg-gray-50 border-t border-gray-200 p-3">
          <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200 group hover:border-primary transition-colors"
              >
                {isImageFile(file.name) ? (
                  <BsImage size={16} className="text-blue-500" />
                ) : isPdfFile(file.name) ? (
                  <FaFilePdf size={16} className="text-red-500" />
                ) : (
                  <ImAttachment size={16} className="text-gray-500" />
                )}
                <span className="text-xs text-gray-600 truncate max-w-[150px]">
                  {file.name}
                </span>
                <span className="text-xs text-gray-400">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  disabled={isUploading}
                >
                  <IoClose size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white absolute bottom-0 left-0 right-0 rounded-b-xl">
        <form onSubmit={handleSendMessage} className="p-4">
          <div className="flex flex-col gap-2">
            <EditorContent editor={editor} />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  multiple
                  disabled={isUploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isUploading}
                >
                  <BsImage
                    size={18}
                    className={`text-gray-500 ${
                      isUploading ? "opacity-50" : ""
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isUploading}
                >
                  <ImAttachment
                    size={18}
                    className={`text-gray-500 ${
                      isUploading ? "opacity-50" : ""
                    }`}
                  />
                </button>
              </div>
              <button
                type="submit"
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-50"
                disabled={
                  (!editor?.getText().trim() && selectedFiles.length === 0) ||
                  isUploading
                }
              >
                <IoSend size={18} className="text-primary" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatView;
