import { useEffect } from 'react';
import { signalRService } from '@/app/services/signalRService';
import { useUser } from '@/app/providers/userprovider';

export const useSignalR = () => {
  const { user } = useUser();

  useEffect(() => {
    // Start connection when user is logged in
    if (user?.id) {
      signalRService.startConnection(user.id);

      // Cleanup on unmount or user logout
      return () => {
        signalRService.stopConnection();
      };
    }
  }, [user?.id]); // Only reconnect if user ID changes

  return signalRService;
}; 