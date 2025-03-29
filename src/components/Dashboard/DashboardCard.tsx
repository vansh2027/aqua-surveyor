
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className 
}: DashboardCardProps) => {
  return (
    <motion.div 
      className={cn(
        "glass-card p-6 overflow-hidden",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900">{value}</h3>
          
          {trend && (
            <div className="mt-2 flex items-center">
              <div 
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full", 
                  trend.positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}
              >
                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
              <span className="ml-2 text-xs text-gray-500">{trend.label}</span>
            </div>
          )}
          
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-full bg-aqua-50">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
