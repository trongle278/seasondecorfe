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
import { useGetListContact } from "@/app/queries/list/contact.query";
import { useGetHistoryChat } from "@/app/queries/chat/history.query";
import { useSendMessage } from "@/app/queries/chat/send.message.quey";
import { useQueryClient } from "@tanstack/react-query";

const ChatBox = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useChatBox();
  const { selectedProvider, setSelectedProvider, addMessage, getConversation } =
    useChat();

  const fileInputRef = React.useRef(null);
  const messagesEndRef = React.useRef(null);
  const [editors, setEditors] = React.useState({});

  const { data: contactList, isLoading: contactLoading } = useGetListContact();

  const sendMessageMutation = useSendMessage();
  const { data: chatHistory, isLoading: historyLoading } = useGetHistoryChat(
    user?.providerVerified ? user.id : selectedProvider?.contactId
  );

  const queryClient = useQueryClient();

  // Create a single editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Type a message...",
        emptyEditorClass: "is-editor-empty",
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

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [selectedProvider, scrollToBottom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!editor?.getText().trim()) return;

    const htmlContent = editor.getHTML();
    const formData = new FormData();

    if (user?.providerVerified) {
      // If user is a provider, use the ID from the current chat
      if (chatHistory && chatHistory.length > 0) {
        const receiverId = chatHistory[0].senderId === user.id 
          ? chatHistory[0].receiverId 
          : chatHistory[0].senderId;
        formData.append("ReceiverId", receiverId);
      }
    } else {
      // For regular users, use the selected provider's ID
      if (!selectedProvider) return;
      formData.append("ReceiverId", selectedProvider.contactId);
    }

    formData.append("Message", htmlContent);
    formData.append("Files", "");
    formData.append("files", "");

    // Send message to the API
    sendMessageMutation.mutate(formData, {
      onSuccess: () => {
        editor.commands.setContent("");
        if (user?.providerVerified) {
          queryClient.invalidateQueries(["get_history_chat", user.id]);
        } else {
          queryClient.invalidateQueries(["get_history_chat", selectedProvider.contactId]);
        }
        scrollToBottom();
      },
      onError: (error) => {
        console.error("Error sending message:", error);
      },
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    
    if (user?.providerVerified) {
      // If user is a provider, use the ID from the current chat
      if (chatHistory && chatHistory.length > 0) {
        const receiverId = chatHistory[0].senderId === user.id 
          ? chatHistory[0].receiverId 
          : chatHistory[0].senderId;
        formData.append("ReceiverId", receiverId);
      }
    } else {
      // For regular users, use the selected provider's ID
      if (!selectedProvider) return;
      formData.append("ReceiverId", selectedProvider.contactId);
    }

    formData.append("Message", "");
    formData.append("Files", file);
    formData.append("files", file);

    // Send file message
    sendMessageMutation.mutate(formData, {
      onSuccess: () => {
        if (user?.providerVerified) {
          queryClient.invalidateQueries(["get_history_chat", user.id]);
        } else {
          queryClient.invalidateQueries(["get_history_chat", selectedProvider.contactId]);
        }
        scrollToBottom();
      },
      onError: (error) => {
        console.error("Error sending file:", error);
      },
    });
  };

  const [currentMessages, setCurrentMessages] = React.useState([]);

  React.useEffect(() => {
    if (user?.providerVerified && selectedProvider) {
      // Filter messages for selected customer when chat history updates
      const customerMessages = chatHistory?.filter(
        msg => msg.senderId === selectedProvider.contactId || msg.receiverId === selectedProvider.contactId
      );
      setCurrentMessages(customerMessages || []);
    } else {
      // For customers, use all chat history
      setCurrentMessages(chatHistory || []);
    }
  }, [chatHistory, selectedProvider, user]);

  const handleNavigate = () => {
    onClose();
    router.push("/authen/login");
  };

  const handleChatClick = (contact) => {
    if (contact) {
      setSelectedProvider(contact);
      // If provider, filter messages for selected customer
      if (user?.providerVerified) {
        const customerMessages = chatHistory?.filter(
          msg => msg.senderId === contact.contactId || msg.receiverId === contact.contactId
        );
        setCurrentMessages(customerMessages || []);
      }
    }
    onOpen();
  };

  React.useEffect(() => {
    console.log(chatHistory);
  }, [chatHistory]);

  React.useEffect(() => {
    if (!selectedProvider && contactList && contactList.length > 0) {
      // Automatically select the first provider if none is selected
      setSelectedProvider(contactList[0]);
    }
  }, [contactList, selectedProvider]);

  React.useEffect(() => {
    if (isOpen) {
      // Fetch chat history when the chat box is opened
      if (user?.providerVerified) {
        // For providers, fetch all chat history
        queryClient.invalidateQueries(["get_history_chat", user.id]);
      } else if (selectedProvider) {
        // For customers, fetch chat with selected provider
        queryClient.invalidateQueries(["get_history_chat", selectedProvider.contactId]);
      }
    }
  }, [isOpen, selectedProvider, queryClient, user]);

  // Save editor content when switching providers
  React.useEffect(() => {
    if (selectedProvider && editor) {
      // Save current editor content for the previous provider
      setEditors((prev) => ({
        ...prev,
        [selectedProvider.id]: editor.getHTML(),
      }));

      // Load content for the current provider
      const savedContent = editors[selectedProvider.id] || "";
      editor.commands.setContent(savedContent);
    }
  }, [selectedProvider, editor]);

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
            onClick={() => handleChatClick(null)}
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
            <div className="flex flex-col bg-white rounded-2xl shadow-xl w-[642px] h-[678px]">
              <div className="flex items-start justify-between p-4 bg-primary rounded-t-lg">
                <h3 className="font-semibold">
                  {user
                    ? selectedProvider
                      ? `Chat with [ ${selectedProvider.contactName} ]`
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
                  {/* Contact List - Show customers for providers, providers for customers */}
                  {user?.providerVerified ? (
                    // For providers, show list of customers who have messaged
                    <div className="w-1/3 border-r overflow-y-auto">
                      {contactLoading ? (
                        <div>Loading contacts..</div>
                      ) : (
                        chatHistory?.map((chat) => {
                          const customerId = chat.senderId === user.id ? chat.receiverId : chat.senderId;
                          const customerName = chat.senderName === user.name ? chat.receiverName : chat.senderName;
                          return (
                            <div
                              key={customerId}
                              onClick={() => handleChatClick({ contactId: customerId, contactName: customerName })}
                              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-300 transition-colors ${
                                selectedProvider?.contactId === customerId ? "bg-gray-300" : ""
                              }`}
                            >
                              <div className="relative">
                                <Avatar userImg={chat.avatar} w={32} h={32} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{customerName}</h4>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    // For customers, show provider list as before
                    contactList && contactList.length > 0 && (
                      <div className="w-1/3 border-r overflow-y-auto">
                        {contactLoading ? (
                          <div>Loading contacts..</div>
                        ) : (
                          contactList.map((contact) => (
                            <div
                              key={contact.contactId}
                              onClick={() => handleChatClick(contact)}
                              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-300 transition-colors ${
                                selectedProvider?.contactId === contact.contactId ? "bg-gray-300" : ""
                              }`}
                            >
                              <div className="relative">
                                <Avatar userImg={contact.avatar} w={32} h={32} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{contact.contactName}</h4>
                              </div>
                              {contact.unreadCount > 0 && (
                                <span className="bg-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {contact.unreadCount}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )
                  )}

                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col h-full">
                    {user?.providerVerified ? (
                      <>
                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto mb-[160px]">
                          <div className="flex flex-col p-4">
                            {historyLoading ? (
                              <div className="flex items-center justify-center h-full">
                                <span>Loading messages...</span>
                              </div>
                            ) : currentMessages.length > 0 ? (
                              currentMessages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex ${
                                    msg.senderId === user?.id
                                      ? "justify-end"
                                      : "justify-start"
                                  } mb-4`}
                                >
                                  <div
                                    className={`max-w-[70%] rounded-lg p-3 ${
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
                                    <span className="text-xs opacity-70">
                                      {new Date(msg.sentTime).toLocaleTimeString()}
                                    </span>
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
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept="image/*,.pdf,.doc,.docx"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                  >
                                    <BsImage size={18} className="text-gray-500" />
                                  </button>
                                  <button
                                    type="button"
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                  >
                                    <AiOutlineFileGif size={18} className="text-gray-500" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                  >
                                    <ImAttachment size={18} className="text-gray-500" />
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
                        </div>
                      </>
                    ) : selectedProvider ? (
                      // Existing customer chat view
                      <>
                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto mb-[160px]">
                          <div className="flex flex-col p-4">
                            {historyLoading ? (
                              <div className="flex items-center justify-center h-full">
                                <span>Loading messages...</span>
                              </div>
                            ) : selectedProvider && currentMessages.length > 0 ? (
                              currentMessages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex ${
                                    msg.senderId === user?.id
                                      ? "justify-end"
                                      : "justify-start"
                                  } mb-4`}
                                >
                                  <div
                                    className={`max-w-[70%] rounded-lg p-3 ${
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
                                    <span className="text-xs opacity-70">
                                      {new Date(msg.sentTime).toLocaleTimeString()}
                                    </span>
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

                        {/* Input Area */}
                        <div className="border-t bg-white absolute bottom-0 left-0 right-0 rounded-b-xl">
                          <form onSubmit={handleSendMessage} className="p-4">
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
                                    <BsImage size={18} className="text-gray-500" />
                                  </button>
                                  <button
                                    type="button"
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                  >
                                    <AiOutlineFileGif size={18} className="text-gray-500" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                  >
                                    <ImAttachment size={18} className="text-gray-500" />
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
                        </div>
                      </>
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
