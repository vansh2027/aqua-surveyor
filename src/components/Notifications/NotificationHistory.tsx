import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { format } from 'date-fns';
import { Mail, MessageSquare, CheckCircle2, XCircle, Clock } from 'lucide-react';

const NotificationHistory = () => {
  const { history, isLoading } = useNotifications();

  if (isLoading) {
    return (
      <div className="glass-card p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aqua-500"></div>
      </div>
    );
  }

  if (!history?.length) {
    return (
      <div className="glass-card p-6 flex items-center justify-center">
        <p className="text-gray-500">No notification history available</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-aqua-500" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-aqua-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification History</h3>
      <div className="space-y-4">
        {history.map((notification) => (
          <div
            key={notification._id}
            className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
          >
            <div className="flex-shrink-0">
              {getTypeIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {notification.subject}
                </p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(notification.status)}
                  <span className="text-xs text-gray-500">
                    {format(new Date(notification.createdAt), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {notification.message}
              </p>
              {notification.error && (
                <p className="mt-1 text-xs text-red-500">
                  Error: {notification.error}
                </p>
              )}
              {notification.metadata && (
                <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                  <span>
                    Alert Type: {notification.metadata.alertType}
                  </span>
                  <span>•</span>
                  <span>
                    Threshold: {notification.metadata.threshold}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationHistory; 