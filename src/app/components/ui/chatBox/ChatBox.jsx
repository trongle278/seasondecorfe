"use client";

import * as React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import useChatBox from "@/app/hooks/useChatBox";
import useChat from "@/app/hooks/useChat";
import { FcSms } from "react-icons/fc";
import { FootTypo } from "../Typography";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { BsImage } from "react-icons/bs";
import { AiOutlineFileGif } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import Avatar from "../Avatar/Avatar";
import { useUser } from "@/app/providers/userprovider";
import { FaLock } from "react-icons/fa";
import Button from "../Buttons/Button";
import { MdOutlineLogin } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";

const ChatBox = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useChatBox();
  const {
    providers,
    selectedProvider,
    setSelectedProvider,
    addMessage,
    getConversation,
  } = useChat();

  const fileInputRef = React.useRef(null);
  const messagesEndRef = React.useRef(null);
  const [editors, setEditors] = React.useState({});

  // Create a single editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Type a message...",
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "flex-1 w-full focus:outline-none text-sm overflow-y-auto break-words whitespace-pre-wrap min-h-[40px] max-h-[120px] prose prose-sm p-2",
      },
    },
  });

  // Save editor content when switching providers
  React.useEffect(() => {
    if (selectedProvider && editor) {
      // Save current editor content for the previous provider
      setEditors(prev => ({
        ...prev,
        [selectedProvider.id]: editor.getHTML()
      }));

      // Load content for the current provider
      const savedContent = editors[selectedProvider.id] || "";
      editor.commands.setContent(savedContent);
    }
  }, [selectedProvider, editor]);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [selectedProvider, scrollToBottom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (editor && editor.getText().trim() && selectedProvider) {
      const htmlContent = editor.getHTML();
      addMessage(selectedProvider.id, {
        text: htmlContent,
        sender: "user",
        type: "html",
      });
      editor.commands.setContent("");
      scrollToBottom();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && selectedProvider) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (file.type.startsWith("image/")) {
          editor?.commands.setImage({ src: e.target?.result });
        } else {
          addMessage(selectedProvider.id, {
            text: file.name,
            sender: "user",
            type: "file",
            fileUrl: e.target?.result,
            fileName: file.name,
          });
          scrollToBottom();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentMessages = selectedProvider
    ? getConversation(selectedProvider.id)
    : [];

  const handleNavigate = () => {
    onClose();
    router.push("/authen/login");
  };

  if (pathname === "/authen/login" || pathname === "/authen/signup") {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99998]"
          onClick={onClose}
        />
      )}
      <div className="fixed bottom-4 right-14 z-[99999] dark:text-black">
        {!isOpen && (
          <button
            onClick={onOpen}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg hover:bg-primary-dark transition-all duration-300"
          >
            <IoChatboxEllipsesOutline size={24} />
          </button>
        )}

        <div
          className={`transition-all duration-300 ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          {isOpen && (
            <div className="flex flex-col bg-white rounded-2xl shadow-xl w-[642px] h-[582px]">
              <div className="flex items-start justify-between p-4 bg-primary rounded-t-lg">
                <h3 className="font-semibold">
                  {user
                    ? selectedProvider
                      ? `Chat with ${selectedProvider.name}`
                      : "Chat"
                    : "Chat"}
                </h3>
                <button
                  onClick={onClose}
                  className="hover:text-gray-200 transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {user ? (
                <div className="w-full h-full flex flex-row">
                  {/* Provider List */}
                  <div className="w-1/3 border-r overflow-y-auto">
                    {providers.map((provider) => (
                      <div
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider)}
                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedProvider?.id === provider.id
                            ? "bg-gray-100"
                            : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar
                            src={provider.avatar}
                            alt={provider.name}
                            w={32}
                            h={32}
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              provider.status === "Online"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {provider.name}
                          </h4>
                          <p className="text-xs">
                            {provider.status}
                          </p>
                        </div>
                        {provider.unreadCount > 0 && (
                          <span className="bg-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {provider.unreadCount}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col h-full">
                    {selectedProvider ? (
                      <>
                        <div className="flex-1 p-4 overflow-y-auto">
                          {currentMessages.map((msg, index) => (
                            <div
                              key={msg.id || index}
                              className={`flex ${
                                msg.sender === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              } mb-4`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  msg.sender === "user"
                                    ? "bg-primary"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {msg.type === "html" ? (
                                  <div
                                    className="text-sm prose prose-sm"
                                    dangerouslySetInnerHTML={{
                                      __html: msg.text,
                                    }}
                                  />
                                ) : msg.type === "file" ? (
                                  <div className="flex items-center gap-2">
                                    <ImAttachment />
                                    <a
                                      href={msg.fileUrl}
                                      download={msg.fileName}
                                      className="text-sm underline"
                                    >
                                      {msg.fileName}
                                    </a>
                                  </div>
                                ) : (
                                  <p className="text-sm">{msg.text}</p>
                                )}
                                <span className="text-xs opacity-70">
                                  {new Date(msg.time).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form
                          onSubmit={handleSendMessage}
                          className="p-4 border-t"
                        >
                          <div className="flex flex-col gap-2">
                            {selectedProvider && <EditorContent editor={editor} />}
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleFileUpload}
                                  className="hidden"
                                  accept="image/*,.pdf,.doc,.docx"
                                />
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <BsImage
                                    size={18}
                                    className="text-gray-500"
                                  />
                                </button>
                                <button
                                  type="button"
                                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <AiOutlineFileGif
                                    size={18}
                                    className="text-gray-500"
                                  />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <ImAttachment
                                    size={18}
                                    className="text-gray-500"
                                  />
                                </button>
                              </div>
                              <button
                                type="submit"
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                disabled={!editor?.getText().trim()}
                              >
                                <IoSend size={18} className="text-primary" />
                              </button>
                            </div>
                          </div>
                        </form>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <FcSms size={40} />
                        <FootTypo
                          footlabel="Select a provider to start chatting"
                          className="!m-0 font-semibold text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <FaLock size={48} className="text-gray-400" />
                  <FootTypo
                    footlabel="Please login to access the chat"
                    className="!m-0 font-semibold text-lg text-gray-600"
                  />
                  <FootTypo
                    footlabel="You need to be logged in to chat with our providers"
                    className="!m-0 font-semibold text-sm text-gray-600"
                  />
                  <Button
                    label="Login"
                    onClick={handleNavigate}
                    icon={<MdOutlineLogin />}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default ChatBox;
