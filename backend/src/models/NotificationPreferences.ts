import mongoose from 'mongoose';

const notificationPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: true
  },
  notificationTypes: {
    waterLevel: {
      type: Boolean,
      default: true
    },
    pH: {
      type: Boolean,
      default: true
    },
    dissolvedOxygen: {
      type: Boolean,
      default: true
    },
    temperature: {
      type: Boolean,
      default: true
    },
    pollution: {
      type: Boolean,
      default: true
    }
  },
  thresholds: {
    waterLevel: {
      min: {
        type: Number,
        default: 2
      },
      max: {
        type: Number,
        default: 5
      }
    },
    pH: {
      min: {
        type: Number,
        default: 6.5
      },
      max: {
        type: Number,
        default: 8.5
      }
    },
    dissolvedOxygen: {
      min: {
        type: Number,
        default: 5
      },
      max: {
        type: Number,
        default: 12
      }
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

notificationPreferencesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const NotificationPreferences = mongoose.model('NotificationPreferences', notificationPreferencesSchema); 