import express from 'express';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { User } from '../models/User';
import { Survey } from '../models/Survey';
import { NotificationPreferences } from '../models/NotificationPreferences';
import { NotificationHistory } from '../models/NotificationHistory';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Get notification preferences
router.get('/preferences', async (req, res, next) => {
  try {
    const preferences = await NotificationPreferences.findOne({ user: req.user.userId });
    if (!preferences) {
      // Create default preferences if none exist
      const defaultPreferences = await NotificationPreferences.create({
        user: req.user.userId
      });
      return res.json(defaultPreferences);
    }
    res.json(preferences);
  } catch (error) {
    next(error);
  }
});

// Update notification preferences
router.put('/preferences', async (req, res, next) => {
  try {
    const preferences = await NotificationPreferences.findOneAndUpdate(
      { user: req.user.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!preferences) {
      throw new AppError('Notification preferences not found', 404);
    }
    res.json(preferences);
  } catch (error) {
    next(error);
  }
});

// Get notification history
router.get('/history', async (req, res, next) => {
  try {
    const history = await NotificationHistory.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

// Send email notification
router.post('/email', async (req, res, next) => {
  try {
    const { to, subject, text, html } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
    
    // Record notification in history
    await NotificationHistory.create({
      user: req.user.userId,
      type: 'email',
      subject,
      message: text,
      status: 'sent'
    });

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    // Record failed notification
    await NotificationHistory.create({
      user: req.user.userId,
      type: 'email',
      subject: req.body.subject,
      message: req.body.text,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    next(error);
  }
});

// Send SMS notification
router.post('/sms', async (req, res, next) => {
  try {
    const { to, message } = req.body;

    await twilioClient.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    // Record notification in history
    await NotificationHistory.create({
      user: req.user.userId,
      type: 'sms',
      subject: 'SMS Notification',
      message,
      status: 'sent'
    });

    res.json({ message: 'SMS sent successfully' });
  } catch (error) {
    // Record failed notification
    await NotificationHistory.create({
      user: req.user.userId,
      type: 'sms',
      subject: 'SMS Notification',
      message: req.body.message,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    next(error);
  }
});

// Check water levels and send alerts
router.post('/check-levels', async (req, res, next) => {
  try {
    const { surveyId } = req.body;
    const survey = await Survey.findById(surveyId);
    
    if (!survey) {
      throw new AppError('Survey not found', 404);
    }

    const preferences = await NotificationPreferences.findOne({ user: survey.createdBy });
    if (!preferences) {
      throw new AppError('Notification preferences not found', 404);
    }

    const alerts = [];
    const thresholds = preferences.thresholds;

    // Check water level
    if (preferences.notificationTypes.waterLevel) {
      if (survey.waterLevel < thresholds.waterLevel.min) {
        alerts.push({
          type: 'waterLevel',
          threshold: 'min',
          message: 'Low water level alert'
        });
      } else if (survey.waterLevel > thresholds.waterLevel.max) {
        alerts.push({
          type: 'waterLevel',
          threshold: 'max',
          message: 'High water level alert'
        });
      }
    }

    // Check pH
    if (preferences.notificationTypes.pH) {
      if (survey.pH < thresholds.pH.min) {
        alerts.push({
          type: 'pH',
          threshold: 'min',
          message: 'Low pH alert'
        });
      } else if (survey.pH > thresholds.pH.max) {
        alerts.push({
          type: 'pH',
          threshold: 'max',
          message: 'High pH alert'
        });
      }
    }

    // Check dissolved oxygen
    if (preferences.notificationTypes.dissolvedOxygen) {
      if (survey.dissolvedOxygen < thresholds.dissolvedOxygen.min) {
        alerts.push({
          type: 'dissolvedOxygen',
          threshold: 'min',
          message: 'Low dissolved oxygen alert'
        });
      } else if (survey.dissolvedOxygen > thresholds.dissolvedOxygen.max) {
        alerts.push({
          type: 'dissolvedOxygen',
          threshold: 'max',
          message: 'High dissolved oxygen alert'
        });
      }
    }

    // Send notifications if there are alerts
    if (alerts.length > 0) {
      const user = await User.findById(survey.createdBy);
      if (user) {
        const alertMessage = alerts.map(alert => alert.message).join(', ');
        
        // Send email if enabled
        if (preferences.emailNotifications) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Water Quality Alert',
            text: `Alerts for survey at location ${survey.location.coordinates}: ${alertMessage}`
          });

          // Record email notification
          await NotificationHistory.create({
            user: user._id,
            type: 'email',
            subject: 'Water Quality Alert',
            message: alertMessage,
            status: 'sent',
            metadata: {
              surveyId: survey._id,
              alertType: alerts[0].type,
              threshold: alerts[0].threshold
            }
          });
        }

        // Send SMS if enabled and phone number is available
        if (preferences.smsNotifications && user.phoneNumber) {
          await twilioClient.messages.create({
            body: `Water Quality Alert: ${alertMessage}`,
            to: user.phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER
          });

          // Record SMS notification
          await NotificationHistory.create({
            user: user._id,
            type: 'sms',
            subject: 'Water Quality Alert',
            message: alertMessage,
            status: 'sent',
            metadata: {
              surveyId: survey._id,
              alertType: alerts[0].type,
              threshold: alerts[0].threshold
            }
          });
        }
      }
    }

    res.json({ alerts });
  } catch (error) {
    next(error);
  }
});

export const notificationRouter = router; 