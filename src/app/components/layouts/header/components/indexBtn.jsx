"use client";

import * as React from "react";
import { IoNotificationsSharp } from "react-icons/io5";
import { IconButton, Badge } from "@mui/material";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useGetListCart } from "@/app/queries/list/cart.query";
import { useUser } from "@/app/providers/userprovider";
import { ClipLoader } from "react-spinners";
import useSearchModal from "@/app/hooks/useSearchModal";
import { IoSearchSharp } from "react-icons/io5";
import { useGetNotifications } from "@/app/queries/list/notification.list.query";
import { notificationService } from "@/app/services/notificationService";
import { useQueryClient } from "@tanstack/react-query";

export const CartBtn = ({ cartClick }) => {
  const { user } = useUser();
  const { data: cartData, isLoading } = useGetListCart(user?.id);


  const cartItemCount = cartData?.totalItem || 0;

  if (!user) {
    return (
      <div className="relative">
        <IconButton className="dark:hover:bg-zinc-700" onClick={cartClick}>
          <MdOutlineShoppingCart size={20} className="dark:text-white" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className="relative">
      <IconButton className="dark:hover:bg-zinc-700" onClick={cartClick}>
        <Badge
          badgeContent={isLoading ? <ClipLoader size={10} /> : cartItemCount}
          color="error"
          overlap="circular"
          max={99}
        >
          <MdOutlineShoppingCart size={20} className="dark:text-white" />
        </Badge>
      </IconButton>
    </div>
  );
};

export const NotificationBtn = ({ toggleDrawer, isDrawerOpen }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useGetNotifications();
  
  // State for real-time notifications
  const [realtimeUnread, setRealtimeUnread] = React.useState(0);
  const [hasNewNotification, setHasNewNotification] = React.useState(false);
  
  // Setup notification service listeners
  React.useEffect(() => {
    if (!user?.id) return;
    
    // Setup notification received handler
    const handleNewNotification = (notification) => {
      // Update unread count and visual indicator
      setRealtimeUnread(prev => prev + 1);
      setHasNewNotification(true);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message || notification.content,
          icon: '/logo.png'
        });
      }
      
      // Refresh notifications list in cache
      queryClient.invalidateQueries(['notifications']);
    };
    
    // Register handler
    notificationService.onNotificationReceived(handleNewNotification);
    
    // Cleanup on unmount
    return () => {
      notificationService.offNotificationReceived(handleNewNotification);
    };
  }, [user?.id, queryClient]);
  
  // Reset new notification indicator when drawer is opened
  React.useEffect(() => {
    if (isDrawerOpen) {
      setHasNewNotification(false);
      setRealtimeUnread(0);
    }
  }, [isDrawerOpen]);
  
  // Count unread notifications
  const unreadCount = React.useMemo(() => {
    const baseCount = notifications && Array.isArray(notifications) 
      ? notifications.filter(notif => !notif.isRead).length 
      : 0;
    return baseCount + realtimeUnread;
  }, [notifications, realtimeUnread]);

  return (
    <div className="relative">
      <IconButton
        className={`dark:hover:bg-zinc-700 ${hasNewNotification ? 'animate-pulse' : ''}`}
        onClick={toggleDrawer(true)} 
      >
        <Badge
          badgeContent={isLoading ? <ClipLoader size={10} /> : unreadCount}
          color="error"
          overlap="circular"
          max={99}
        >
          <IoNotificationsSharp 
            size={20} 
            className={`dark:text-white ${hasNewNotification ? 'text-primary' : ''}`} 
          />
        </Badge>
      </IconButton>
    </div>
  );
};

export const SearchBtn = ({ searchClick }) => {
  const searchModal = useSearchModal();
  return (
    <div className="relative">
      <IconButton
        className="dark:hover:bg-zinc-700"
        onClick={searchModal.onOpen}
      >
        <IoSearchSharp size={20} className="dark:text-white" />
      </IconButton>
    </div>
  );
};
