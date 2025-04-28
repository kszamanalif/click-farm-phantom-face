
// Type definitions for the Traffic Simulator app

export interface UserAgentDetails {
  browser: string;
  version: string;
  os: string;
}

export interface ClickRecord {
  timestamp: number;
  ip: string;
  userAgent: string;
  success: boolean;
}

export interface SimulationStats {
  totalClicks: number;
  successCount: number;
  errorCount: number;
  startTime?: number;
  endTime?: number;
  clickRate: number;
}
