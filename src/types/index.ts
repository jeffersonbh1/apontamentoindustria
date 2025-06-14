export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  companyId: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  isActive: boolean;
  employeeCount: number;
  createdAt: Date;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  companyId: string;
  managerId?: string;
  skills: string[];
  isActive: boolean;
  hireDate: Date;
  performance: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  location: string;
  status: 'operational' | 'maintenance' | 'offline' | 'repair';
  companyId: string;
  installDate: Date;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  efficiency: number;
  operatingHours: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'production' | 'maintenance' | 'quality_check' | 'training';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string[];
  equipmentId?: string;
  companyId: string;
  startDate: Date;
  dueDate: Date;
  completedDate?: Date;
  progress: number;
  estimatedHours: number;
  actualHours?: number;
}

export interface ProductionMetrics {
  totalProduction: number;
  efficiency: number;
  qualityScore: number;
  downtime: number;
  activeEquipment: number;
  completedTasks: number;
  pendingTasks: number;
  overdueeTasks: number;
}

export interface ChartData {
  name: string;
  value: number;
  efficiency?: number;
  production?: number;
  quality?: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  loading: boolean;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}