
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Repeat, CheckCircle2 } from "lucide-react";

interface IPRotationLogProps {
  ipHistory: string[];
}

const IPRotationLog = ({ ipHistory }: IPRotationLogProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-lg flex items-center">
          <Repeat className="mr-2" size={18} /> IP Rotation Log
        </h3>
        <span className="text-sm text-slate-400">{ipHistory.length} entries</span>
      </div>
      
      {ipHistory.length === 0 ? (
        <div className="bg-slate-900/50 rounded-md p-6 text-center text-slate-400">
          No IP rotation history yet. Start the simulation to begin tracking.
        </div>
      ) : (
        <ScrollArea className="h-[300px] rounded-md border border-slate-700">
          <div className="p-4 space-y-2">
            {ipHistory.map((ip, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded ${
                  index === 0 ? 'bg-blue-900/20 border border-blue-800/40' : 'border-b border-slate-700/50'
                }`}
              >
                <div className="flex items-center">
                  {index === 0 && (
                    <span className="mr-2 bg-blue-600/25 text-blue-400 text-xs px-1.5 py-0.5 rounded">
                      Current
                    </span>
                  )}
                  <code className="font-mono text-sm">{ip}</code>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="text-green-500" size={14} />
                  <span className="text-xs text-slate-400 ml-1">
                    {index === 0 ? 'Active' : `${index} click${index === 1 ? '' : 's'} ago`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      
      <div className="text-xs text-slate-400 italic">
        Note: All IP addresses shown are simulated for demonstration purposes.
      </div>
    </div>
  );
};

export default IPRotationLog;
