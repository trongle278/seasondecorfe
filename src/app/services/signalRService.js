import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "@/app/lib/api/config/Axios-config";
import { getSession } from "next-auth/react";

class SignalRService {
  constructor() {
    this.connection = null;
    this.callbacks = new Map();
    this.currentUserId = null;
  }

  async startConnection(senderId) {
    try {
      if (this.connection) {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
          console.log("Already connected to SignalR with connectionId:", this.connection);
          return;
        }
        await this.stopConnection();
      }

      this.currentUserId = senderId;

      // Get the session token
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        console.error("No authentication token available");
        return;
      }

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL}/chatHub`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Add connection status logging
      this.connection.onreconnecting((error) => {
        console.log("Reconnecting due to error:", error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log("Reconnected with ID:", connectionId);
      });

      // Set up message receiving handlers before starting connection
      this.connection.on("ReceiveMessage", (message) => {
        console.log("Message received:", message);
        const callbacks = this.callbacks.get("messageReceived") || [];
        callbacks.forEach((callback) => callback(message));
      });

      this.connection.on("MessageSent", (message) => {
        console.log("Message sent confirmation:", message);
        const callbacks = this.callbacks.get("messageSent") || [];
        callbacks.forEach((callback) => callback(message));
      });

      this.connection.on("MessagesRead", (readByUserId) => {
        console.log("Messages read by user:", readByUserId);
        const callbacks = this.callbacks.get("messagesRead") || [];
        callbacks.forEach((callback) => callback(readByUserId));
      });

      // Add new handler for contact updates
      this.connection.on("ContactAdded", (contactInfo) => {
        console.log("New contact added:", contactInfo);
        const callbacks = this.callbacks.get("contactAdded") || [];
        callbacks.forEach((callback) => callback(contactInfo));
      });

      // Add handler for contacts updated
      this.connection.on("ContactsUpdated", (contacts) => {
        console.log("Contacts updated:", contacts);
        const callbacks = this.callbacks.get("contactsUpdated") || [];
        callbacks.forEach((callback) => callback(contacts));
      });

      this.connection.onclose((error) => {
        console.log("Connection closed:", error);
        this.connection = null;
        if (error) {
          // Only attempt to reconnect if there was an error
          setTimeout(() => this.startConnection(this.currentUserId), 5000);
        }
      });

      try {
        console.log("Starting SignalR connection...");
        await this.connection.start();
        console.log("SignalR Connected successfully");

        // Verify connection by checking state
        if (this.connection.state !== signalR.HubConnectionState.Connected) {
          throw new Error("Connection failed to reach Connected state");
        }
      } catch (err) {
        console.error("Error starting connection:", err);
        this.connection = null;
        throw err; // Let the caller handle the error
      }
    } catch (error) {
      console.error("SignalR Connection Error:", error);
      this.connection = null;
      throw error; // Let the caller handle the error
    }
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("SignalR Disconnected");
      } catch (error) {
        console.error("SignalR Disconnection Error:", error);
      }
      this.connection = null;
      this.currentUserId = null;
    }
  }

  // Helper method to convert File to base64
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // Get the base64 string without the data URL prefix
          const base64 = reader.result.split(",")[1] || "";
          resolve(base64);
        } catch (error) {
          reject(new Error(`Failed to convert ${file.name} to base64`));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Send message through SignalR
  async sendMessage(receiverId, message, files = [], onProgress = null) {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      throw new Error("SignalR not connected");
    }

    if (!receiverId) {
      throw new Error("Receiver ID is required");
    }

    if (!message && (!files || files.length === 0)) {
      throw new Error("Message or files are required");
    }

    // Ensure message is not null, use empty string if no message
    const messageContent = message || "";

    try {
      // Validate file sizes and types
      const maxFileSize = 5 * 1024 * 1024; // 5MB limit
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      // Validate each file
      for (const file of files) {
        if (file.size > maxFileSize) {
          throw new Error(`File ${file.name} exceeds the 5MB size limit`);
        }
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File type ${file.type} is not supported`);
        }
      }

      // Convert files to the expected format
      const totalFiles = files.length;
      const fileRequests = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const base64Content = await this.fileToBase64(file);
          fileRequests.push({
            fileName: file.name,
            base64Content: base64Content,
            contentType: file.type,
          });

          // Report progress
          if (onProgress) {
            const progress = ((i + 1) / totalFiles) * 100;
            onProgress(progress);
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          throw new Error(`Failed to process file ${file.name}`);
        }
      }

      console.log("Sending message with files:", {
        receiverId,
        messageContent,
        fileRequests,
      });

      // Send the message with files
      await this.connection.invoke(
        "SendMessage",
        receiverId,
        messageContent,
        fileRequests
      );

      // Complete progress
      if (onProgress) {
        onProgress(100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(senderId) {
    if (!this.connection?.state === signalR.HubConnectionState.Connected) {
      throw new Error("SignalR not connected");
    }

    try {
      await this.connection.invoke("MarkAsRead", senderId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  }

  // Add callback for message received
  onMessageReceived(callback) {
    if (!this.callbacks.has("messageReceived")) {
      this.callbacks.set("messageReceived", []);
    }
    this.callbacks.get("messageReceived").push(callback);
  }

  // Add callback for message sent
  onMessageSent(callback) {
    if (!this.callbacks.has("messageSent")) {
      this.callbacks.set("messageSent", []);
    }
    this.callbacks.get("messageSent").push(callback);
  }

  // Add callback for messages read
  onMessagesRead(callback) {
    if (!this.callbacks.has("messagesRead")) {
      this.callbacks.set("messagesRead", []);
    }
    this.callbacks.get("messagesRead").push(callback);
  }

  // Remove callbacks
  offMessageReceived(callback) {
    const callbacks = this.callbacks.get("messageReceived") || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  offMessageSent(callback) {
    const callbacks = this.callbacks.get("messageSent") || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  offMessagesRead(callback) {
    const callbacks = this.callbacks.get("messagesRead") || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  // Add callback for contact added
  onContactAdded(callback) {
    if (!this.callbacks.has("contactAdded")) {
      this.callbacks.set("contactAdded", []);
    }
    this.callbacks.get("contactAdded").push(callback);
  }

  // Remove callback for contact added
  offContactAdded(callback) {
    const callbacks = this.callbacks.get("contactAdded") || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  // Add callback for contacts updated
  onContactsUpdated(callback) {
    if (!this.callbacks.has("contactsUpdated")) {
      this.callbacks.set("contactsUpdated", []);
    }
    this.callbacks.get("contactsUpdated").push(callback);
  }

  // Remove callback for contacts updated
  offContactsUpdated(callback) {
    const callbacks = this.callbacks.get("contactsUpdated") || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  // Check connection state
  isConnected() {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRService = new SignalRService();
