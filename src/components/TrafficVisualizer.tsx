
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TrafficVisualizerProps {
  isActive: boolean;
  clickRate: number;
  totalClicks: number;
}

interface TrafficPoint {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

const TrafficVisualizer = ({ isActive, clickRate, totalClicks }: TrafficVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<TrafficPoint[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize dimensions when component mounts
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Add new points while active
  useEffect(() => {
    if (!isActive || dimensions.width === 0) return;
    
    const interval = setInterval(() => {
      const targetX = dimensions.width * 0.8;
      
      // Add a new point
      setPoints(prev => {
        const newPoint: TrafficPoint = {
          id: Math.random(),
          x: 0,
          y: Math.random() * dimensions.height,
          size: 2 + Math.random() * 3,
          opacity: 0.5 + Math.random() * 0.5,
          color: Math.random() > 0.9 ? '#60a5fa' : Math.random() > 0.5 ? '#34d399' : '#818cf8'
        };
        
        // Update existing points
        const updatedPoints = prev.map(point => ({
          ...point,
          x: point.x + (targetX - point.x) * 0.05 // Move towards target
        }));
        
        // Remove points that are close to the target
        const filteredPoints = updatedPoints.filter(p => p.x < targetX - 5);
        
        return [...filteredPoints, newPoint].slice(-150); // Limit number of points
      });
    }, 60000 / (clickRate * 3)); // Generate more points than the click rate for visual effect
    
    return () => clearInterval(interval);
  }, [isActive, dimensions, clickRate]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-full h-full relative overflow-hidden rounded-md",
        "border border-slate-700 bg-slate-900 transition-opacity duration-300",
        !isActive && "opacity-70"
      )}
    >
      {/* Target area */}
      <div className="absolute right-12 top-0 bottom-0 w-[80px] border-l border-dashed border-slate-700 flex items-center justify-center">
        <div className="h-32 w-32 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500/40 to-blue-500/40"></div>
          </div>
        </div>
      </div>
      
      {/* Points */}
      {points.map(point => (
        <div
          key={point.id}
          className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: point.x,
            top: point.y,
            width: point.size,
            height: point.size,
            backgroundColor: point.color,
            opacity: point.opacity,
            boxShadow: `0 0 ${point.size * 2}px ${point.color}`
          }}
        />
      ))}
      
      {/* Overlay when inactive */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-900/20">
          {totalClicks > 0 ? "Simulation Paused" : "Start Simulation to Visualize Traffic"}
        </div>
      )}
    </div>
  );
};

export default TrafficVisualizer;
