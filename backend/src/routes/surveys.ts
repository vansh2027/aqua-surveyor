import express from 'express';
import { Survey } from '../models/Survey';
import { Request, Response } from 'express';

const router = express.Router();

// Get all surveys
router.get('/', async (req: Request, res: Response) => {
  try {
    const surveys = await Survey.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys', error });
  }
});

// Get survey by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const survey = await Survey.findById(req.params.id)
      .populate('createdBy', 'name email');
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching survey', error });
  }
});

// Create new survey
router.post('/', async (req: Request, res: Response) => {
  try {
    const survey = new Survey({
      ...req.body,
      createdBy: req.user.userId
    });
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error creating survey', error });
  }
});

// Update survey
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Check if user is authorized to update
    if (survey.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this survey' });
    }

    Object.assign(survey, req.body);
    await survey.save();
    res.json(survey);
  } catch (error) {
    res.status(500).json({ message: 'Error updating survey', error });
  }
});

// Delete survey
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Check if user is authorized to delete
    if (survey.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this survey' });
    }

    await survey.remove();
    res.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting survey', error });
  }
});

// Get surveys by location (within radius)
router.get('/location/:lat/:lng/:radius', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.params;
    const surveys = await Survey.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      }
    }).populate('createdBy', 'name email');
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching surveys by location', error });
  }
});

export const surveyRouter = router; 