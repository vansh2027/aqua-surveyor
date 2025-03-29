
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface FormData {
  location: string;
  waterBody: string;
  phLevel: string;
  temperature: string;
  dissolvedOxygen: string;
  turbidity: string;
  observations: string;
  name: string;
  email: string;
  coordinates: {
    lat: string;
    lng: string;
  };
}

interface SurveyFormProps {
  className?: string;
}

const SurveyForm = ({ className }: SurveyFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    location: '',
    waterBody: '',
    phLevel: '',
    temperature: '',
    dissolvedOxygen: '',
    turbidity: '',
    observations: '',
    name: '',
    email: '',
    coordinates: {
      lat: '',
      lng: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof FormData] as Record<string, unknown>,
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', formData);
      
      toast({
        title: "Survey Submitted",
        description: "Thank you for your contribution to water monitoring!",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        location: '',
        waterBody: '',
        phLevel: '',
        temperature: '',
        dissolvedOxygen: '',
        turbidity: '',
        observations: '',
        name: '',
        email: '',
        coordinates: {
          lat: '',
          lng: ''
        }
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your survey. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:border-transparent transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <motion.div 
      className={cn("glass-card", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit Water Survey</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className={labelClasses}>Location Area</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g., North Delhi"
                required
              />
            </div>
            
            <div>
              <label htmlFor="waterBody" className={labelClasses}>Water Body Name</label>
              <input
                type="text"
                id="waterBody"
                name="waterBody"
                value={formData.waterBody}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g., Yamuna River"
                required
              />
            </div>
            
            <div>
              <label htmlFor="coordinates.lat" className={labelClasses}>Latitude</label>
              <input
                type="text"
                id="coordinates.lat"
                name="coordinates.lat"
                value={formData.coordinates.lat}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g., 28.6139"
              />
            </div>
            
            <div>
              <label htmlFor="coordinates.lng" className={labelClasses}>Longitude</label>
              <input
                type="text"
                id="coordinates.lng"
                name="coordinates.lng"
                value={formData.coordinates.lng}
                onChange={handleChange}
                className={inputClasses}
                placeholder="e.g., 77.2090"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Water Quality Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phLevel" className={labelClasses}>pH Level</label>
                <input
                  type="number"
                  id="phLevel"
                  name="phLevel"
                  value={formData.phLevel}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="14"
                  className={inputClasses}
                  placeholder="e.g., 7.2"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="temperature" className={labelClasses}>Temperature (°C)</label>
                <input
                  type="number"
                  id="temperature"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  step="0.1"
                  className={inputClasses}
                  placeholder="e.g., 25.5"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="dissolvedOxygen" className={labelClasses}>Dissolved Oxygen (mg/L)</label>
                <input
                  type="number"
                  id="dissolvedOxygen"
                  name="dissolvedOxygen"
                  value={formData.dissolvedOxygen}
                  onChange={handleChange}
                  step="0.1"
                  className={inputClasses}
                  placeholder="e.g., 8.5"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="turbidity" className={labelClasses}>Turbidity (NTU)</label>
                <input
                  type="number"
                  id="turbidity"
                  name="turbidity"
                  value={formData.turbidity}
                  onChange={handleChange}
                  step="0.1"
                  className={inputClasses}
                  placeholder="e.g., 5.2"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="observations" className={labelClasses}>Observations</label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows={4}
                className={inputClasses}
                placeholder="Describe any visual observations, odors, debris, etc."
              ></textarea>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Observer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className={labelClasses}>Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className={labelClasses}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Your email address"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <motion.button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-aqua-500 to-aqua-600 text-white font-medium rounded-md shadow-sm button-glow disabled:opacity-70"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SurveyForm;
