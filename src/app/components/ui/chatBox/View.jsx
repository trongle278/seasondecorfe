import React from "react";
import { EditorContent } from "@tiptap/react";
import { IoSend, IoClose, IoEyeSharp } from "react-icons/io5";
import { BsImage } from "react-icons/bs";
import { AiOutlineFileGif } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import { FaCheckDouble } from "react-icons/fa6";

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
}) => {
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
                <div
                  className={`max-w-[250px] rounded-lg p-3 break-words whitespace-pre-wrap ${
                    msg.senderId === user?.id
                      ? "bg-primary"
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
                      {msg.files.map((file, fileIndex) => (
                        <div
                          key={`${msg.id}-${file.fileId || fileIndex}`}
                          className="flex items-center gap-2 p-2 bg-white/10 rounded"
                        >
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs hover:underline truncate max-w-[200px]"
                          >
                            {file.fileName}
                          </a>
                        </div>
                      ))}
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
                          <FaCheckDouble size={12} />
                        )}
                        {msg.isRead ? "Viewed" : "Sent"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <span>No messages to display.</span>
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
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isUploading}
                >
                  <AiOutlineFileGif
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
