import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  BarChart3, 
  Globe, 
  Pause, 
  Play, 
  RefreshCcw, 
  Zap, 
  CheckCircle2, 
  XCircle,
  Link as LinkIcon,
  AlertTriangle
} from "lucide-react";
import TrafficVisualizer from "@/components/TrafficVisualizer";
import IPRotationLog from "@/components/IPRotationLog";
import StatisticsPanel from "@/components/StatisticsPanel";
import { isValidUrl, generateRandomIP } from "@/lib/traffic-utils";

const Index = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [clickRate, setClickRate] = useState(200); // Changed default to 200
  const [totalClicks, setTotalClicks] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [currentIP, setCurrentIP] = useState('');
  const [ipHistory, setIpHistory] = useState<string[]>([]);
  const [useProxies, setUseProxies] = useState(true);
  const [useAgentRotation, setUseAgentRotation] = useState(true);
  const intervalRef = useRef<number | null>(null);
  
  const isUrlValid = url ? isValidUrl(url) : false;
  
  const toggleSimulation = () => {
    if (isRunning) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };
  
  const startSimulation = () => {
    if (!isUrlValid) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL to start the simulator.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    toast({
      title: "Simulation Started",
      description: `Traffic simulator is now running for ${url}`,
    });
    
    const clickIntervalMs = 60000 / clickRate;
    
    intervalRef.current = window.setInterval(() => {
      setTotalClicks(prev => prev + 1);
      setSessionTime(prev => prev + (clickIntervalMs / 1000));
      
      const newIP = generateRandomIP();
      setCurrentIP(newIP);
      setIpHistory(prev => [newIP, ...prev].slice(0, 100));
      
      const isSuccess = Math.random() > 0.05;
      if (isSuccess) {
        setSuccessCount(prev => prev + 1);
      } else {
        setErrorCount(prev => prev + 1);
      }
    }, clickIntervalMs);
  };
  
  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    toast({
      title: "Simulation Stopped",
      description: `Traffic simulator has been paused after ${totalClicks} clicks.`,
    });
  };
  
  const resetStats = () => {
    setTotalClicks(0);
    setSessionTime(0);
    setErrorCount(0);
    setSuccessCount(0);
    setIpHistory([]);
    toast({
      title: "Statistics Reset",
      description: "All traffic statistics have been reset to zero.",
    });
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs}s`;
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Web Traffic Simulator
          </h1>
          <p className="text-slate-400 mt-2">
            Simulate web traffic with automatic IP rotation (Educational Demo)
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2" size={20} /> Control Panel
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure and manage traffic simulation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Target URL</Label>
                  <div className="flex">
                    <Input 
                      id="url"
                      placeholder="https://example.com/campaign-link" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  {url && !isUrlValid && (
                    <p className="text-red-400 text-sm flex items-center mt-1">
                      <AlertTriangle size={14} className="mr-1" /> Invalid URL format
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Click Rate: {clickRate} per minute</Label>
                  </div>
                  <Slider 
                    defaultValue={[200]} 
                    min={10}
                    max={200}
                    step={10}
                    onValueChange={(values) => setClickRate(values[0])}
                    className="py-4"
                    disabled={isRunning}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="useProxies" 
                      checked={useProxies} 
                      onCheckedChange={setUseProxies}
                      disabled={isRunning}
                    />
                    <Label htmlFor="useProxies">IP Rotation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="useAgentRotation" 
                      checked={useAgentRotation} 
                      onCheckedChange={setUseAgentRotation}
                      disabled={isRunning}
                    />
                    <Label htmlFor="useAgentRotation">User Agent Rotation</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Button 
                  className={`w-full flex items-center justify-center ${
                    isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                  onClick={toggleSimulation}
                  disabled={!url}
                >
                  {isRunning ? (
                    <>
                      <Pause className="mr-2" size={18} /> Stop Simulation
                    </>
                  ) : (
                    <>
                      <Play className="mr-2" size={18} /> Start Simulation
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={resetStats}
                >
                  <RefreshCcw className="mr-2" size={16} /> Reset Statistics
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status</span>
                  {isRunning ? (
                    <Badge className="bg-emerald-600">Running</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-600">Idle</Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Current IP</span>
                  <span className="font-mono text-sm bg-slate-900 px-2 py-1 rounded">
                    {currentIP || 'Not active'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Session Time</span>
                  <span>{formatTime(sessionTime)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Clicks</span>
                  <div className="flex items-center">
                    <Zap size={16} className="mr-1 text-amber-400" />
                    <span>{totalClicks.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2" size={20} /> Traffic Visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] relative">
                <TrafficVisualizer 
                  isActive={isRunning} 
                  clickRate={clickRate} 
                  totalClicks={totalClicks}
                />
              </CardContent>
            </Card>
            
            <Tabs defaultValue="statistics">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="statistics" className="data-[state=active]:bg-slate-600">
                  <BarChart3 className="mr-2" size={16} /> Statistics
                </TabsTrigger>
                <TabsTrigger value="ips" className="data-[state=active]:bg-slate-600">
                  <Globe className="mr-2" size={16} /> IP Log
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="statistics">
                <Card className="border-slate-700 bg-slate-800 mt-0">
                  <CardContent className="pt-6">
                    <StatisticsPanel 
                      totalClicks={totalClicks} 
                      successCount={successCount}
                      errorCount={errorCount}
                      clickRate={clickRate}
                      sessionTime={sessionTime}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ips">
                <Card className="border-slate-700 bg-slate-800 mt-0">
                  <CardContent className="pt-6">
                    <IPRotationLog ipHistory={ipHistory} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="bg-amber-900/40 border border-amber-800/60 rounded-md p-4 text-amber-200">
              <div className="flex items-start">
                <AlertTriangle className="mr-2 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-medium text-amber-100">Educational Simulation Only</h4>
                  <p className="text-sm">
                    This application only simulates traffic patterns and does not actually generate real website clicks
                    or traffic. No actual requests are sent to the target URL. IP addresses shown are randomly generated
                    for demonstration purposes only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
