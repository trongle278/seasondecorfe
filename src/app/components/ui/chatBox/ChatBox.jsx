"use client";

import * as React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import useChatBox from "@/app/hooks/useChatBox";
import useChat from "@/app/hooks/useChat";
import { FootTypo } from "../Typography";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useUser } from "@/app/providers/userprovider";
import { FaLock } from "react-icons/fa";
import Button from "../Buttons/Button";
import { MdOutlineLogin } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import { useGetListContact } from "@/app/queries/list/contact.query";
import { useGetHistoryChat } from "@/app/queries/chat/history.query";
import { useQueryClient } from "@tanstack/react-query";
import { signalRService } from "@/app/services/signalRService";
import { toast } from "sonner";
import ChatView from './View';
import ContactList from './ContactList';

const ChatBox = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useChatBox();
  const { selectedProvider, setSelectedProvider } = useChat();
  const [currentMessages, setCurrentMessages] = React.useState([]);

  const fileInputRef = React.useRef(null);
  const messagesEndRef = React.useRef(null);
  const [editors, setEditors] = React.useState({});

  const { data: contactList, isLoading: contactLoading } = useGetListContact();
  const { data: chatHistory, isLoading: historyLoading } = useGetHistoryChat(
    selectedProvider?.contactId 
  );

  const queryClient = useQueryClient();

  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const maxTotalFiles = 5;
    
    console.log('Files selected:', files); // Debug log
    
    // Check if total files exceed limit
    if (selectedFiles.length + files.length > maxTotalFiles) {
      toast.error(`You can only upload up to ${maxTotalFiles} files at a time`);
      return;
    }

    // Preview files before adding them
    const newFiles = files.filter(file => {
      // Check if file is already selected
      const isDuplicate = selectedFiles.some(
        existingFile => existingFile.name === file.name && existingFile.size === file.size
      );
      if (isDuplicate) {
        toast.error(`File ${file.name} is already selected`);
        return false;
      }
      return true;
    });

    console.log('New files to add:', newFiles); // Debug log
    setSelectedFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles];
      console.log('Updated selected files:', updatedFiles); // Debug log
      return updatedFiles;
    });
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, []);

  // Update messages when chat history changes
  React.useEffect(() => {
    if (user?.providerVerified && selectedProvider) {
      // Filter messages for selected customer when chat history updates
      const customerMessages = chatHistory?.filter(
        (msg) =>
          msg.senderId === selectedProvider.contactId ||
          msg.receiverId === selectedProvider.contactId
      );
      setCurrentMessages(customerMessages || []);
    } else {
      // For customers, use all chat history
      setCurrentMessages(chatHistory || []);
    }
  }, [chatHistory, selectedProvider, user]);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);


  React.useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, scrollToBottom]);

  // Add SignalR connection management
  React.useEffect(() => {
    let connectionAttempts = 0;
    const maxAttempts = 3;

    const connectToSignalR = async () => {
      if (!user?.id || !isOpen) return;

      try {
        await signalRService.startConnection(user.id);
        connectionAttempts = 0;

        // Set up message listener for real-time updates
        const handleNewMessage = async (message, isReceived = false) => {
          console.log("New message received:", message, "isReceived:", isReceived);
          
          // Update current conversation if message belongs to it
          if (selectedProvider && (
            (message.senderId === selectedProvider.contactId && message.receiverId === user.id) ||
            (message.senderId === user.id && message.receiverId === selectedProvider.contactId)
          )) {
            setCurrentMessages(prev => {
              const messageExists = prev.some(msg => msg.id === message.id);
              if (messageExists) return prev;
              return [...prev, message];
            });
            
            if (isReceived && message.receiverId === user.id) {
              signalRService.markMessagesAsRead(message.senderId).catch(console.error);
            }
            
            setTimeout(scrollToBottom, 100);
          }

          // Force refresh contact list when receiving a new message
          if (isReceived) {
            await queryClient.invalidateQueries({
              queryKey: ["get_list_contact"],
              refetchType: "active",
            });

            // Call UpdateContacts on the server to ensure contact list is up to date
            try {
              await signalRService.connection.invoke("UpdateContacts");
            } catch (error) {
              console.error("Error updating contacts:", error);
            }
          }

          // Update chat history cache
          queryClient.setQueryData(["get_history_chat", selectedProvider?.contactId], (oldData) => {
            if (!oldData) return [message];
            const messageExists = oldData.some(msg => msg.id === message.id);
            if (messageExists) return oldData;
            return [...oldData, message];
          });
        };

        // Set up separate handlers for receive and sent messages
        signalRService.onMessageReceived((message) => handleNewMessage(message, true));
        signalRService.onMessageSent((message) => handleNewMessage(message, false));

        // Set up messages read listener
        const handleMessagesRead = (readByUserId) => {
          setCurrentMessages(prev => 
            prev.map(msg => 
              msg.receiverId === readByUserId ? { ...msg, isRead: true } : msg
            )
          );

          queryClient.setQueryData(["get_list_contact"], (oldData) => {
            if (!oldData) return oldData;
            return oldData.map(contact => {
              if (contact.contactId === readByUserId) {
                return {
                  ...contact,
                  unreadCount: 0
                };
              }
              return contact;
            });
          });
        };

        // Set up contacts updated listener
        const handleContactsUpdated = (contacts) => {
          console.log("Contacts updated:", contacts);
          // Directly set the new contacts data
          queryClient.setQueryData(["get_list_contact"], contacts);
        };

        signalRService.onMessagesRead(handleMessagesRead);
        signalRService.onContactsUpdated(handleContactsUpdated);

        return () => {
          signalRService.offMessageReceived(handleNewMessage);
          signalRService.offMessageSent(handleNewMessage);
          signalRService.offMessagesRead(handleMessagesRead);
          signalRService.offContactsUpdated(handleContactsUpdated);
          signalRService.stopConnection();
        };

      } catch (error) {
        console.error('Failed to connect to SignalR:', error);
        connectionAttempts++;
        
        if (connectionAttempts < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 10000);
          toast.error(`Connection failed. Retrying in ${delay/1000} seconds...`);
          setTimeout(connectToSignalR, delay);
        } else {
          toast.error('Unable to establish chat connection. Please try again later.');
        }
      }
    };

    connectToSignalR();
  }, [user?.id, isOpen, selectedProvider?.contactId, queryClient, scrollToBottom]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!editor?.getText().trim() && selectedFiles.length === 0) || !selectedProvider || !user?.id) return;

    try {
      if (!signalRService.isConnected()) {
        await signalRService.startConnection(user.id);
        if (!signalRService.isConnected()) {
          throw new Error("Unable to establish chat connection");
        }
      }

      const htmlContent = editor?.getText().trim() ? editor.getHTML() : "Shared files";
      
      try {
        setIsUploading(true);
        await signalRService.sendMessage(
          selectedProvider.contactId, 
          htmlContent, 
          selectedFiles,
          (progress) => {
            setUploadProgress(progress);
          }
        );

        // Update contact list immediately after sending message
        queryClient.setQueryData(["get_list_contact"], (oldData) => {
          if (!oldData) return [selectedProvider];
          
          // Check if the contact already exists
          const contactExists = oldData.some(contact => contact.contactId === selectedProvider.contactId);
          
          if (!contactExists) {
            // Add new contact to the list
            return [{
              ...selectedProvider,
              message: htmlContent,
              lastMessageSenderId: user.id,
              unreadCount: 0
            }, ...oldData];
          }
          
          // Update existing contact
          return oldData.map(contact => {
            if (contact.contactId === selectedProvider.contactId) {
              return {
                ...contact,
                message: htmlContent,
                lastMessageSenderId: user.id,
                unreadCount: 0
              };
            }
            return contact;
          });
        });

        editor?.commands.setContent("");
        setSelectedFiles([]); // Clear selected files after sending
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
      } catch (error) {
        if (error.message.includes("size limit") || error.message.includes("not supported")) {
          toast.error(error.message);
        } else {
          throw error;
        }
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error.message === "Unable to establish chat connection"
          ? "Unable to connect to chat. Please try again."
          : "Failed to send message. Please try again."
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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
          (msg) =>
            msg.senderId === contact.contactId ||
            msg.receiverId === contact.contactId
        );
        setCurrentMessages(customerMessages || []);
      }
    }
    onOpen();
  };

  React.useEffect(() => {
    if (!selectedProvider && contactList && contactList.length > 0) {
      // Automatically select the first provider if none is selected
      setSelectedProvider(contactList[0]);
    }
  }, [contactList, selectedProvider]);

  // Consolidated query invalidation effect
  React.useEffect(() => {
    if (isOpen && selectedProvider?.contactId) {
      // Only fetch chat history for the current conversation
      queryClient.invalidateQueries({
        queryKey: ["get_history_chat", selectedProvider.contactId],
        exact: true
      });
    }
  }, [isOpen, selectedProvider?.contactId, queryClient]);

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

  // Add debug logs
  React.useEffect(() => {
    console.log('Selected Provider:', selectedProvider);
    console.log('Chat History:', chatHistory);
    console.log('History Loading:', historyLoading);
  }, [selectedProvider, chatHistory, historyLoading]);

  // Add an effect to maintain scroll position when loading older messages
  React.useEffect(() => {
    const messageContainer = document.querySelector('.overflow-y-auto');
    if (messageContainer) {
      const isScrolledToBottom = 
        messageContainer.scrollHeight - messageContainer.scrollTop === messageContainer.clientHeight;
      
      if (isScrolledToBottom) {
        scrollToBottom();
      }
    }
  }, [currentMessages, scrollToBottom]);

  if (pathname === "/authen/login" || pathname === "/authen/signup") {
    return null;
  }

  const renderChatContent = () => {
    if (!user) {
      return (
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
      );
    }

    return (
      <div className="w-full h-full flex flex-row">
        <ContactList 
          user={user}
          contactLoading={contactLoading}
          contactList={contactList}
          selectedProvider={selectedProvider}
          handleChatClick={handleChatClick}
        />

        <div className="flex-1 flex flex-col h-full">
          {selectedProvider ? (
            <ChatView
              messages={currentMessages}
              user={user}
              editor={editor}
              fileInputRef={fileInputRef}
              selectedFiles={selectedFiles}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              handleRemoveFile={handleRemoveFile}
              handleFileSelect={handleFileSelect}
              handleSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
              isLoading={historyLoading}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span>Select a {user?.providerVerified ? "customer" : "provider"} to start chatting</span>
            </div>
          )}
        </div>
      </div>
    );
  };

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
              {renderChatContent()}
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
