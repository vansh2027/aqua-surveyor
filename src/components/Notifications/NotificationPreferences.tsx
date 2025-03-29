import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const NotificationPreferences = () => {
  const { preferences, isLoading, updatePreferences, sendTestNotification } = useNotifications();
  const { toast } = useToast();

  const handleToggle = async (field: string, value: boolean) => {
    try {
      await updatePreferences.mutateAsync({ [field]: value });
      toast({
        title: 'Preferences Updated',
        description: 'Your notification preferences have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences.',
        variant: 'destructive',
      });
    }
  };

  const handleThresholdChange = async (type: string, threshold: 'min' | 'max', value: number) => {
    try {
      await updatePreferences.mutateAsync({
        thresholds: {
          ...preferences?.thresholds,
          [type]: {
            ...preferences?.thresholds[type],
            [threshold]: value
          }
        }
      });
      toast({
        title: 'Threshold Updated',
        description: 'The threshold has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update threshold.',
        variant: 'destructive',
      });
    }
  };

  const handleTestNotification = async (type: 'email' | 'sms') => {
    try {
      await sendTestNotification(type);
      toast({
        title: 'Test Notification Sent',
        description: `A test ${type.toUpperCase()} notification has been sent.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to send test ${type.toUpperCase()} notification.`,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aqua-500"></div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={preferences?.emailNotifications}
              onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
            <Switch
              id="sms-notifications"
              checked={preferences?.smsNotifications}
              onCheckedChange={(checked) => handleToggle('smsNotifications', checked)}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Types</h3>
        <div className="space-y-4">
          {Object.entries(preferences?.notificationTypes || {}).map(([type, enabled]) => (
            <div key={type} className="flex items-center justify-between">
              <Label htmlFor={`${type}-alerts`}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Alerts
              </Label>
              <Switch
                id={`${type}-alerts`}
                checked={enabled}
                onCheckedChange={(checked) => 
                  handleToggle('notificationTypes', {
                    ...preferences?.notificationTypes,
                    [type]: checked
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thresholds</h3>
        <div className="space-y-6">
          {Object.entries(preferences?.thresholds || {}).map(([type, thresholds]) => (
            <div key={type} className="space-y-4">
              <h4 className="font-medium text-gray-900">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${type}-min`}>Minimum</Label>
                  <Input
                    id={`${type}-min`}
                    type="number"
                    value={thresholds.min}
                    onChange={(e) => handleThresholdChange(type, 'min', parseFloat(e.target.value))}
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor={`${type}-max`}>Maximum</Label>
                  <Input
                    id={`${type}-max`}
                    type="number"
                    value={thresholds.max}
                    onChange={(e) => handleThresholdChange(type, 'max', parseFloat(e.target.value))}
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={() => handleTestNotification('email')}
          disabled={!preferences?.emailNotifications}
        >
          Send Test Email
        </Button>
        <Button
          onClick={() => handleTestNotification('sms')}
          disabled={!preferences?.smsNotifications}
        >
          Send Test SMS
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences; 