import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { useSurveys } from '@/hooks/useSurveys';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

interface WaterQualityChartProps {
  className?: string;
}

const WaterQualityChart = ({ className }: WaterQualityChartProps) => {
  const { surveys, isLoading } = useSurveys();

  // Process data for the chart
  const chartData = React.useMemo(() => {
    if (!surveys) return null;

    // Sort surveys by date
    const sortedSurveys = [...surveys].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Get the last 12 surveys
    const recentSurveys = sortedSurveys.slice(-12);

    return {
      labels: recentSurveys.map(survey => 
        format(new Date(survey.createdAt), 'MMM d')
      ),
      datasets: [
        {
          label: 'pH Level',
          data: recentSurveys.map(survey => survey.pH),
          borderColor: 'rgb(14, 165, 233)', // aqua-500
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(14, 165, 233)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
        },
        {
          label: 'Dissolved Oxygen (mg/L)',
          data: recentSurveys.map(survey => survey.dissolvedOxygen),
          borderColor: 'rgb(56, 189, 248)', // aqua-400
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(56, 189, 248)',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
        },
      ],
    };
  }, [surveys]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0c4a6e',
        bodyColor: '#0c4a6e',
        borderColor: 'rgba(14, 165, 233, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        titleFont: {
          family: "'Inter', sans-serif",
          weight: 'bold',
        },
        padding: 12,
        boxPadding: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className={`${className} glass-card p-6 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aqua-500"></div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className={`${className} glass-card p-6 flex items-center justify-center`}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className={`${className} glass-card p-6`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Quality Trends</h3>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WaterQualityChart;
