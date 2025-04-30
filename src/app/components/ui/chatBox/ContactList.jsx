import React from "react";
import Avatar from "../Avatar/Avatar";
import { stripHtmlTags } from "@/app/helpers";

const ContactList = ({
  user,
  contactLoading,
  contactList,
  selectedReceiver,
  handleChatClick,
}) => {
  return (
    <div className="w-1/3 border-r overflow-y-auto">
      <div className="p-3 bg-gray-50 border-b">
        <h3 className="text-sm font-semibold">
          {user?.providerVerified ? "Customer Messages" : "Available Providers"}
        </h3>
      </div>
      {contactLoading ? (
        <div className="p-4 text-center">
          {user?.providerVerified
            ? "Loading customer list..."
            : "Loading providers..."}
        </div>
      ) : contactList && contactList.length > 0 ? (
        contactList.map((contact) => (
          <div
            key={contact.contactId}
            onClick={() => handleChatClick(contact)}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
              selectedReceiver?.contactId === contact.contactId
                ? "bg-gray-100"
                : ""
            }`}
          >
            <div className="relative">
              <Avatar userImg={contact.avatar} w={32} h={32} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm truncate max-w-[70px]">
                {contact.contactName}
              </h4>
              <p className="text-xs text-gray-500 truncate max-w-[50px]">
                {contact.lastMessageSenderId === user?.id ? "You: " : ""}
                {stripHtmlTags(contact.message)}
              </p>
            </div>
            <div className="text-xs flex flex-row items-center gap-2">
              <div>{contact.lastMessageTime}</div>
              {contact.unreadCount > 0 && (
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">
          {user?.providerVerified
            ? "No customers available"
            : "No providers available"}
        </div>
      )}
    </div>
  );
};

export default ContactList;
