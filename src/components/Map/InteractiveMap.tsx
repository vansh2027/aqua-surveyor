
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface WaterBody {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'lake' | 'river' | 'pond' | 'wetland';
  status: 'good' | 'moderate' | 'poor';
  lastUpdated: string;
}

interface InteractiveMapProps {
  className?: string;
}

const InteractiveMap = ({ className }: InteractiveMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Sample data
  const waterBodies: WaterBody[] = [
    {
      id: '1',
      name: 'Yamuna River',
      coordinates: [28.613939, 77.209021],
      type: 'river',
      status: 'moderate',
      lastUpdated: '2023-10-15',
    },
    {
      id: '2',
      name: 'Najafgarh Lake',
      coordinates: [28.570180, 76.979801],
      type: 'lake',
      status: 'poor',
      lastUpdated: '2023-10-12',
    },
    {
      id: '3',
      name: 'Sanjay Lake',
      coordinates: [28.607900, 77.304456],
      type: 'lake',
      status: 'good',
      lastUpdated: '2023-10-18',
    },
    {
      id: '4',
      name: 'Bhalswa Lake',
      coordinates: [28.735596, 77.162293],
      type: 'lake',
      status: 'moderate',
      lastUpdated: '2023-10-14',
    },
    {
      id: '5',
      name: 'Okhla Bird Sanctuary',
      coordinates: [28.568649, 77.301880],
      type: 'wetland',
      status: 'good',
      lastUpdated: '2023-10-17',
    },
  ];

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize the map
      mapRef.current = L.map(mapContainerRef.current).setView([28.613939, 77.209021], 11);

      // Add the tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add markers for water bodies
      waterBodies.forEach((waterBody) => {
        const statusColor = 
          waterBody.status === 'good' ? '#10b981' : 
          waterBody.status === 'moderate' ? '#f59e0b' : 
          '#ef4444';

        const marker = L.circleMarker(waterBody.coordinates, {
          radius: 10,
          fillColor: statusColor,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(mapRef.current!);

        // Add pulse effect
        const pulseIcon = L.divIcon({
          html: `<div class="pulse-icon" style="background-color: ${statusColor}"></div>`,
          className: 'pulse-icon-wrapper',
          iconSize: [20, 20],
        });

        L.marker(waterBody.coordinates, { icon: pulseIcon }).addTo(mapRef.current!);

        // Add popup
        marker.bindPopup(`
          <div class="text-sm">
            <h3 class="font-semibold">${waterBody.name}</h3>
            <p>Type: ${waterBody.type.charAt(0).toUpperCase() + waterBody.type.slice(1)}</p>
            <p>Status: ${waterBody.status.charAt(0).toUpperCase() + waterBody.status.slice(1)}</p>
            <p>Last updated: ${new Date(waterBody.lastUpdated).toLocaleDateString()}</p>
            <a href="#" class="text-blue-500 hover:underline">View details</a>
          </div>
        `);

        // Add click event
        marker.on('click', () => {
          mapRef.current?.flyTo(waterBody.coordinates, 13, {
            duration: 1.5,
            easeLinearity: 0.25,
          });
        });
      });

      // Add custom CSS for pulse effect
      const style = document.createElement('style');
      style.innerHTML = `
        .pulse-icon-wrapper {
          background: transparent;
        }
        .pulse-icon {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          position: relative;
        }
        .pulse-icon:before {
          content: '';
          position: absolute;
          width: 300%;
          height: 300%;
          left: -100%;
          top: -100%;
          background-color: inherit;
          border-radius: 50%;
          animation: pulse-animation 2s infinite;
          opacity: 0.7;
        }
        @keyframes pulse-animation {
          0% {
            transform: scale(0.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      className={cn("glass-card overflow-hidden", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Delhi Water Bodies</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-xs text-gray-600">Good</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
            <span className="text-xs text-gray-600">Moderate</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-xs text-gray-600">Poor</span>
          </div>
        </div>
      </div>
      <div ref={mapContainerRef} className="w-full h-[400px] z-0" />
    </motion.div>
  );
};

export default InteractiveMap;
