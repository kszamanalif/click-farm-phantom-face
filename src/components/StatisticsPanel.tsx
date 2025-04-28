
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, Zap } from "lucide-react";

interface StatisticsPanelProps {
  totalClicks: number;
  successCount: number;
  errorCount: number;
  clickRate: number;
  sessionTime: number;
}

const StatisticsPanel = ({ 
  totalClicks, 
  successCount, 
  errorCount,
  clickRate,
  sessionTime
}: StatisticsPanelProps) => {
  // Calculate statistics
  const successRate = totalClicks > 0 ? (successCount / totalClicks) * 100 : 0;
  const errorRate = totalClicks > 0 ? (errorCount / totalClicks) * 100 : 0;
  
  // Data for pie chart
  const pieData = [
    { name: 'Success', value: successCount, color: '#10b981' },
    { name: 'Error', value: errorCount, color: '#ef4444' }
  ].filter(item => item.value > 0);
  
  // Data for bar chart
  const getProxiedBarData = () => {
    const minutes = Math.ceil(sessionTime / 60);
    const data = [];
    
    for (let i = 0; i < Math.min(minutes, 10); i++) {
      // Generate simulated bar data based on click rate
      const estimatedClicks = Math.floor(clickRate * ((i === minutes - 1) ? (sessionTime % 60) / 60 : 1));
      data.push({
        name: `${i + 1}m`,
        clicks: i < minutes - 1 ? estimatedClicks : 
          (sessionTime % 60 === 0 ? estimatedClicks : Math.floor(estimatedClicks * ((sessionTime % 60) / 60))),
      });
    }
    
    return data.length > 0 ? data : [{ name: '1m', clicks: 0 }];
  };
  
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700/50">
          <div className="flex justify-between items-start">
            <h4 className="text-slate-400 text-sm">Total Clicks</h4>
            <Zap className="text-amber-400" size={18} />
          </div>
          <p className="text-2xl font-bold mt-2">{totalClicks.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700/50">
          <div className="flex justify-between items-start">
            <h4 className="text-slate-400 text-sm">Success Rate</h4>
            <CheckCircle2 className="text-emerald-500" size={18} />
          </div>
          <p className="text-2xl font-bold mt-2">{successRate.toFixed(1)}%</p>
        </div>
        
        <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700/50">
          <div className="flex justify-between items-start">
            <h4 className="text-slate-400 text-sm">Click Rate</h4>
            <Zap className="text-blue-400" size={18} />
          </div>
          <p className="text-2xl font-bold mt-2">{clickRate}/min</p>
        </div>
        
        <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700/50">
          <div className="flex justify-between items-start">
            <h4 className="text-slate-400 text-sm">Elapsed Time</h4>
            <Clock className="text-purple-400" size={18} />
          </div>
          <p className="text-2xl font-bold mt-2">
            {Math.floor(sessionTime / 60)}m {Math.floor(sessionTime % 60)}s
          </p>
        </div>
      </div>
      
      {/* Progress bars */}
      <div className="space-y-4 bg-slate-900/50 p-4 rounded-md border border-slate-700/50">
        <div className="space-y-1">
          <div className="flex justify-between">
            <div className="flex items-center">
              <CheckCircle2 className="text-emerald-500 mr-1.5" size={14} />
              <span className="text-sm">Success Rate</span>
            </div>
            <span className="text-sm">{successCount} clicks ({successRate.toFixed(1)}%)</span>
          </div>
          <Progress value={successRate} className="h-2 bg-slate-700" indicatorClassName="bg-emerald-500" />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <div className="flex items-center">
              <XCircle className="text-red-500 mr-1.5" size={14} />
              <span className="text-sm">Error Rate</span>
            </div>
            <span className="text-sm">{errorCount} clicks ({errorRate.toFixed(1)}%)</span>
          </div>
          <Progress value={errorRate} className="h-2 bg-slate-700" indicatorClassName="bg-red-500" />
        </div>
      </div>
      
      {/* Charts */}
      {totalClicks > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traffic over time */}
          <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700/50">
            <h4 className="text-sm font-medium mb-4">Traffic Over Time</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getProxiedBarData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Success/Error distribution */}
          <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700/50">
            <h4 className="text-sm font-medium mb-4">Success/Error Distribution</h4>
            <div className="h-[200px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                      itemStyle={{ color: '#e2e8f0' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No data available yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {totalClicks === 0 && (
        <div className="bg-slate-900/50 p-6 rounded-md border border-slate-700/50 text-center text-slate-400">
          Start the simulation to generate statistics data
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel;
