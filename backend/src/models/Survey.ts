import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema({
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  waterLevel: {
    type: Number,
    required: true
  },
  pH: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  dissolvedOxygen: {
    type: Number,
    required: true
  },
  conductivity: {
    type: Number,
    required: true
  },
  turbidity: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
surveySchema.index({ location: '2dsphere' });

// Update the updatedAt timestamp before saving
surveySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Survey = mongoose.model('Survey', surveySchema); 