import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { createMarkup } from "@/app/helpers";
import Typography from "@mui/material/Typography";
import { formatDistanceToNow } from "date-fns";
import {
  IoNotificationsSharp,
  IoCheckmarkDoneSharp,
  IoLogInOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { useUser } from "@/app/providers/userprovider";
import { useGetNotifications } from "@/app/queries/list/notification.list.query";
import { notificationService } from "@/app/services/notificationService";
import { CircularProgress, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../Buttons/Button";

export default function Notifcation({ isOpen, toggleDrawer }) {
  const router = useRouter();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: notifications, isLoading, refetch } = useGetNotifications();
  const [readingId, setReadingId] = React.useState(null);
  const [isConnecting, setIsConnecting] = React.useState(false);

  // Initialize SignalR connection when component mounts and user is authenticated
  React.useEffect(() => {
    const initializeConnection = async () => {
      if (!user?.id || notificationService.isConnected()) return;
      
      try {
        setIsConnecting(true);
        await notificationService.startConnection(user.id);
      } catch (error) {
        // Connection error is handled internally in notificationService
      } finally {
        setIsConnecting(false);
      }
    };

    if (user?.id) {
      initializeConnection();
    }

    // Cleanup on unmount
    return () => {
      // Don't disconnect on component unmount as other components may need the connection
    };
  }, [user?.id]);

  React.useEffect(() => {
    if (!user?.id || !isOpen) return;

    // Make sure we have the latest notifications when drawer opens
    refetch();
  }, [isOpen, refetch, user?.id]);

  // Set up notification event listeners
  React.useEffect(() => {
    if (!user?.id) return;

    // Listen for notification read events
    const handleNotificationRead = (notificationId) => {
      queryClient.invalidateQueries(["notifications"]);
    };

    // Listen for all notifications read events
    const handleAllNotificationsRead = () => {
      queryClient.invalidateQueries(["notifications"]);
    };

    // Listen for new notifications to update the cache
    const handleNewNotification = () => {
      // Just refresh notifications list without showing toast (toast is handled in Header.jsx)
      queryClient.invalidateQueries(["notifications"]);
    };

    // Register listeners
    notificationService.onNotificationReceived(handleNewNotification);
    notificationService.onNotificationRead(handleNotificationRead);
    notificationService.onNotificationsUpdated(handleAllNotificationsRead);

    // Cleanup listeners
    return () => {
      notificationService.offNotificationReceived(handleNewNotification);
      notificationService.offNotificationRead(handleNotificationRead);
      notificationService.offNotificationsUpdated(handleAllNotificationsRead);
    };
  }, [user?.id, queryClient]);

  const ensureConnection = async () => {
    if (!user?.id) return false;

    if (!notificationService.isConnected()) {
      try {
        setIsConnecting(true);
        await notificationService.startConnection(user.id);
        setIsConnecting(false);
        return true;
      } catch (error) {
        console.error("Failed to establish SignalR connection:", error);
        setIsConnecting(false);
        return false;
      }
    }

    return true;
  };

  const markAsRead = async (notificationId) => {
    try {
      if (!user?.id) return; // Skip if not logged in

      setReadingId(notificationId);

      // Ensure connection before attempting to use SignalR
      const isConnected = await ensureConnection();

      if (isConnected) {
        // Use the new SignalR method to mark as read
        await notificationService.markAsRead(notificationId);
      } else {
        // Fallback to REST API if SignalR connection failed
        await notificationService.markNotificationAsRead(notificationId);
      }

      // Note: we don't need to invalidate the cache here as the SignalR event will trigger it
      // But we'll keep this as a fallback just in case
      queryClient.invalidateQueries(["notifications"]);

      setReadingId(null);
    } catch (error) {
      console.error("Error marking notification as read:", error);

      // Fallback to REST API if SignalR failed
      try {
        await notificationService.markNotificationAsRead(notificationId);
        queryClient.invalidateQueries(["notifications"]);
      } catch (fallbackError) {
        console.error("Fallback REST API also failed:", fallbackError);
      }

      setReadingId(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!user?.id) return; // Skip if not logged in

      setReadingId("all");

      // Ensure connection before attempting to use SignalR
      const isConnected = await ensureConnection();

      if (isConnected) {
        // Use the new SignalR method to mark all as read
        await notificationService.markAllAsRead();
      } else {
        // Fallback to REST API if SignalR connection failed
        await notificationService.markAllNotificationsAsRead();
      }

      // Note: we don't need to invalidate the cache here as the SignalR event will trigger it
      // But we'll keep this as a fallback just in case
      queryClient.invalidateQueries(["notifications"]);

      setReadingId(null);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);

      // Fallback to REST API if SignalR failed
      try {
        await notificationService.markAllNotificationsAsRead();
        queryClient.invalidateQueries(["notifications"]);
      } catch (fallbackError) {
        console.error("Fallback REST API also failed:", fallbackError);
      }

      setReadingId(null);
    }
  };

  const handleNotificationClick = (notification) => {
    // Skip if not logged in
    if (!user?.id) {
      router.push("/authen/login");
      toggleDrawer(false)();
      return;
    }

    // Mark as read first
    markAsRead(notification.id);
  };

  // Function to handle Link component click
  const handleLinkClick = (e, notificationId) => {
    // Mark notification as read when clicking on a link
    markAsRead(notificationId);
  };

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  // Login prompt for guest users
  const guestContent = (
    <Box sx={{ width: 550 }} role="presentation" overflow="scroll">
      <Box className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <Typography variant="h6" className="font-semibold">
          Notifications
        </Typography>
      </Box>

      <Box className="flex flex-col justify-center items-center p-8 text-center h-[300px] space-y-4">
        <IoNotificationsSharp
          size={60}
          className="text-gray-300 dark:text-gray-700"
        />
        <Typography
          variant="body1"
          component="div"
          className="text-gray-500 dark:text-gray-400 text-lg"
        >
          Please log in to view your notifications
        </Typography>
        <Button
          icon={<IoLogInOutline />}
          label="Log In"
          onClick={() => {
            router.push("/authen/login");
            toggleDrawer(false)();
          }}
          className="mt-4 px-6 py-2"
        />
      </Box>
    </Box>
  );

  // Function to render the notification content that will be used in both Link and ListItemButton
  const renderNotificationContent = (notification) => (
    <div className="flex items-start w-full">
      <div className="flex-shrink-0 mr-4 mt-1">
        <IoNotificationsSharp className="text-blue-500" size={24} />
      </div>
      <div className="flex-grow">
        <Typography
          variant="body1"
          component="div"
          className={`${
            notification.isRead ? "font-normal" : "font-semibold"
          } mb-1`}
        >
          {notification.title}
        </Typography>

        <div
          className="text-gray-600 dark:text-gray-400 text-sm mb-2"
          dangerouslySetInnerHTML={createMarkup(notification.content)}
        />

        <div className="flex items-center text-xs text-gray-500">
          <IoTimeOutline className="mr-1" />
          {formatTimeAgo(notification.notifiedAt)}
        </div>
      </div>

      {!notification.isRead && (
        <div className="ml-2 flex-shrink-0">
          {readingId === notification.id ? (
            <CircularProgress size={10} />
          ) : (
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          )}
        </div>
      )}
    </div>
  );

  const notificationsList = (
    <Box sx={{ width: 550 }} role="presentation">
      <Paper elevation={0} className="sticky top-0 z-10 bg-white">
        <Box className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <Typography variant="h6" className="font-semibold flex items-center">
            <IoNotificationsSharp className="mr-2" size={22} />
            Notifications
            {isConnecting && <CircularProgress size={16} className="ml-2" />}
          </Typography>
          {notifications?.length > 0 && (
            <Button
              label="Mark all as read"
              onClick={markAllAsRead}
              disabled={readingId === "all" || isConnecting}
              className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              icon={
                readingId === "all" ? (
                  <CircularProgress size={16} />
                ) : (
                  <IoCheckmarkDoneSharp />
                )
              }
            />
          )}
        </Box>
      </Paper>

      {isLoading || isConnecting ? (
        <Box className="flex justify-center items-center p-8 min-h-[200px]">
          <CircularProgress size={32} />
        </Box>
      ) : notifications?.length > 0 ? (
        <List sx={{ pt: 0 }} className="max-h-[80vh] overflow-y-auto">
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              disablePadding
              component="div"
              className={
                notification.isRead
                  ? "bg-gray-50 border-b border-gray-100"
                  : "bg-white border-b border-gray-100"
              }
            >
              {notification.url ? (
                // For notifications with URL, use a div wrapper with onClick handler
                <div
                  className="w-full cursor-pointer"
                  onClick={(e) => {
                    handleLinkClick(e, notification.id);
                    toggleDrawer(false)();
                    // Mark as read and close drawer first, then navigate
                    setTimeout(() => {
                      router.push(notification.url);
                    }, 100);
                  }}
                >
                  <ListItemButton className="transition-all hover:bg-gray-100 py-4 w-full">
                    {renderNotificationContent(notification)}
                  </ListItemButton>
                </div>
              ) : (
                <ListItemButton
                  onClick={() => handleNotificationClick(notification)}
                  className="transition-all hover:bg-gray-100 py-4"
                >
                  {renderNotificationContent(notification)}
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Box className="flex flex-col justify-center items-center p-8 text-center min-h-[300px]">
          <IoNotificationsSharp
            size={60}
            className="text-gray-300 dark:text-gray-700 mb-4"
          />
          <Typography
            variant="body1"
            component="div"
            className="text-gray-500 dark:text-gray-400 text-lg"
          >
            No notifications yet
          </Typography>
          <Typography
            variant="body2"
            component="div"
            className="text-gray-400 dark:text-gray-500 mt-2"
          >
            We'll notify you when something important happens
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          borderRadius: { xs: "0", sm: "12px 0 0 12px" },
        },
      }}
    >
      {!user ? guestContent : notificationsList}
    </Drawer>
  );
}
