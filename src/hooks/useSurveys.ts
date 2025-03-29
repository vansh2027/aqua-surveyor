import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Survey {
  _id: string;
  location: {
    type: string;
    coordinates: number[];
  };
  waterLevel: number;
  pH: number;
  temperature: number;
  dissolvedOxygen: number;
  conductivity: number;
  turbidity: number;
  notes?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateSurveyData {
  location: {
    type: string;
    coordinates: number[];
  };
  waterLevel: number;
  pH: number;
  temperature: number;
  dissolvedOxygen: number;
  conductivity: number;
  turbidity: number;
  notes?: string;
}

interface UpdateSurveyData extends Partial<CreateSurveyData> {
  _id: string;
}

export const useSurveys = () => {
  const queryClient = useQueryClient();

  // Fetch all surveys
  const { data: surveys, isLoading, error } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/surveys`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    }
  });

  // Create new survey
  const createSurvey = useMutation({
    mutationFn: async (data: CreateSurveyData) => {
      const response = await axios.post(`${API_URL}/surveys`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    }
  });

  // Update survey
  const updateSurvey = useMutation({
    mutationFn: async (data: UpdateSurveyData) => {
      const response = await axios.put(`${API_URL}/surveys/${data._id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    }
  });

  // Delete survey
  const deleteSurvey = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/surveys/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    }
  });

  // Fetch surveys by location
  const getSurveysByLocation = async (lat: number, lng: number, radius: number) => {
    const response = await axios.get(
      `${API_URL}/surveys/location/${lat}/${lng}/${radius}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  };

  return {
    surveys,
    isLoading,
    error,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    getSurveysByLocation
  };
}; 