import mongoose from 'mongoose';

const notificationHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'sms'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'sent'
  },
  error: {
    type: String
  },
  metadata: {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey'
    },
    alertType: {
      type: String,
      enum: ['waterLevel', 'pH', 'dissolvedOxygen', 'temperature', 'pollution']
    },
    threshold: {
      type: String,
      enum: ['min', 'max']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for querying user's notification history
notificationHistorySchema.index({ user: 1, createdAt: -1 });

export const NotificationHistory = mongoose.model('NotificationHistory', notificationHistorySchema); 