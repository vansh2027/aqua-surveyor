import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationTypes: {
    waterLevel: boolean;
    pH: boolean;
    dissolvedOxygen: boolean;
    temperature: boolean;
    pollution: boolean;
  };
  thresholds: {
    waterLevel: {
      min: number;
      max: number;
    };
    pH: {
      min: number;
      max: number;
    };
    dissolvedOxygen: {
      min: number;
      max: number;
    };
  };
}

interface NotificationHistory {
  _id: string;
  type: 'email' | 'sms';
  subject: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  metadata?: {
    surveyId: string;
    alertType: string;
    threshold: 'min' | 'max';
  };
  createdAt: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch notification preferences
  const { data: preferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/notifications/preferences`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    }
  });

  // Update notification preferences
  const updatePreferences = useMutation({
    mutationFn: async (data: Partial<NotificationPreferences>) => {
      const response = await axios.put(`${API_URL}/notifications/preferences`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    }
  });

  // Fetch notification history
  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['notificationHistory'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/notifications/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    }
  });

  // Send test notification
  const sendTestNotification = async (type: 'email' | 'sms') => {
    const response = await axios.post(
      `${API_URL}/notifications/${type}`,
      {
        to: type === 'email' ? preferences?.email : preferences?.phoneNumber,
        message: 'This is a test notification from Aqua Surveyor.',
        subject: 'Test Notification'
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  };

  return {
    preferences,
    isLoadingPreferences,
    updatePreferences,
    history,
    isLoadingHistory,
    sendTestNotification
  };
}; 