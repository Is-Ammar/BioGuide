export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'scientist' | 'engineer';
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastActive: string;
}

export interface Mission {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'planned' | 'critical';
  progress: number;
  startDate: string;
  endDate?: string;
  crew: User[];
  description: string;
  telemetry: {
    radiation: number;
    temperature: number;
    pressure: number;
    oxygen: number;
  };
  location: string;
  type: 'ISS' | 'Mars' | 'Moon' | 'Deep Space';
}

export interface DataPoint {
  timestamp: string;
  value: number;
  metric: string;
  unit: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}