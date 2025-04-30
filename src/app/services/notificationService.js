import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "@/app/lib/api/config/Axios-config";
import { getSession } from "next-auth/react";

class NotificationService {
  constructor() {
    this.connection = null;
    this.callbacks = new Map();
    this.currentUserId = null;
  }

  async startConnection(userId) {
    try {
      if (this.connection) {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
          console.log("Already connected to NotificationHub with connectionId:", this.connection);
          return;
        }
        
        if (this.connection.state === signalR.HubConnectionState.Connecting ||
            this.connection.state === signalR.HubConnectionState.Reconnecting) {
          console.log("Connection is already in the process of connecting");
          return;
        }
        
        await this.stopConnection();
      }

      this.currentUserId = userId;

      // Get the session token
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        console.error("No authentication token available for notification hub");
        return;
      }

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL}/notificationHub`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Add connection status logging
      this.connection.onreconnecting((error) => {
        console.log("Notification hub reconnecting due to error:", error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log("Notification hub reconnected with ID:", connectionId);
      });

      // Set up notification receiving handler - this matches the backend method ReceiveNotification
      this.connection.on("ReceiveNotification", (notification) => {
        const callbacks = this.callbacks.get("notificationReceived") || [];
        callbacks.forEach((callback) => callback({
          id: notification.id,
          title: notification.title,
          message: notification.content,
          content: notification.content,
          notifiedAt: notification.notifiedAt,
          type: notification.type,
          isRead: false,
          url: notification.url,
          orderId: notification.orderId,
          bookingId: notification.bookingId
        }));
      });

      // Add handler for NotificationMarkedAsRead event
      this.connection.on("NotificationMarkedAsRead", (notificationId) => {
        //console.log("Notification marked as read:", notificationId);
        const callbacks = this.callbacks.get("notificationRead") || [];
        callbacks.forEach((callback) => callback(notificationId));
      });

      // Add handler for AllNotificationsMarkedAsRead event
      this.connection.on("AllNotificationsMarkedAsRead", () => {
        //console.log("All notifications marked as read");
        const callbacks = this.callbacks.get("notificationsUpdated") || [];
        callbacks.forEach((callback) => callback());
      });

      this.connection.onclose((error) => {
        console.log("Notification hub connection closed:", error);
        this.connection = null;
        if (error) {
          // Only attempt to reconnect if there was an error
          setTimeout(() => this.startConnection(this.currentUserId), 5000);
        }
      });

      try {
        console.log("Starting NotificationHub connection...");
        await this.connection.start();
        console.log("NotificationHub Connected successfully");

        // Wait a small amount of time to ensure connection is fully established
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify connection by checking state
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
          throw new Error("NotificationHub connection failed to reach Connected state");
        }
      } catch (err) {
        console.error("Error starting NotificationHub connection:", err);
        this.connection = null;
        throw err;
      }
    } catch (error) {
      console.error("NotificationHub Connection Error:", error);
      this.connection = null;
      throw error;
    }
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("NotificationHub Disconnected");
      } catch (error) {
        console.error("NotificationHub Disconnection Error:", error);
      }
      this.connection = null;
      this.currentUserId = null;
    }
  }

  // Mark notification as read using SignalR method
  async markAsRead(notificationId) {
    try {
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        throw new Error("SignalR connection not established");
      }

      await this.connection.invoke("MarkAsRead", notificationId);
      return true;
    } catch (error) {
      console.error("Error marking notification as read via SignalR:", error);
      // Fallback to REST API if SignalR fails
      return this.markNotificationAsRead(notificationId);
    }
  }

  // Mark all notifications as read using SignalR method
  async markAllAsRead() {
    try {
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        throw new Error("SignalR connection not established");
      }

      await this.connection.invoke("MarkAllAsRead");
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read via SignalR:", error);
      // Fallback to REST API if SignalR fails
      return this.markAllNotificationsAsRead();
    }
  }

  // Legacy REST API method - kept for backwards compatibility and fallback
  async markNotificationAsRead(notificationId) {
    try {
      // Get the session token
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.statusText}`);
      }

      // Notify subscribers about notification read event
      const callbacks = this.callbacks.get("notificationRead") || [];
      callbacks.forEach((callback) => callback(notificationId));
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Legacy REST API method - kept for backwards compatibility and fallback
  async markAllNotificationsAsRead() {
    try {
      // Get the session token
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`${BASE_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
      }

      // Notify subscribers about notifications updated event
      const callbacks = this.callbacks.get("notificationsUpdated") || [];
      callbacks.forEach((callback) => callback());
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Method to send a notification via SignalR
  async sendNotification(notification) {
    try {
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        throw new Error("SignalR connection not established");
      }

      await this.connection.invoke("SendNotification", notification);
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  // Add callback for notification received
  onNotificationReceived(callback) {
    if (!this.callbacks.has("notificationReceived")) {
      this.callbacks.set("notificationReceived", []);
    }
    this.callbacks.get("notificationReceived").push(callback);
  }

  // Remove callback for notification received
  offNotificationReceived(callback) {
    const callbacks = this.callbacks.get("notificationReceived") || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  // Add callback for notification read
  onNotificationRead(callback) {
    if (!this.callbacks.has("notificationRead")) {
      this.callbacks.set("notificationRead", []);
    }
    this.callbacks.get("notificationRead").push(callback);
  }

  // Remove callback for notification read
  offNotificationRead(callback) {
    const callbacks = this.callbacks.get("notificationRead") || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  // Add callback for notifications updated
  onNotificationsUpdated(callback) {
    if (!this.callbacks.has("notificationsUpdated")) {
      this.callbacks.set("notificationsUpdated", []);
    }
    this.callbacks.get("notificationsUpdated").push(callback);
  }

  // Remove callback for notifications updated
  offNotificationsUpdated(callback) {
    const callbacks = this.callbacks.get("notificationsUpdated") || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  // Check connection state
  isConnected() {
    return this.connection && this.connection.state === signalR.HubConnectionState.Connected;
  }
}

export const notificationService = new NotificationService();
