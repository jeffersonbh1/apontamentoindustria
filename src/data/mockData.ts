import { User, Company, Employee, Equipment, Activity, ProductionMetrics, ChartData } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@company.com',
    firstName: 'John',
    lastName: 'Admin',
    role: 'admin',
    companyId: '1',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isActive: true,
    lastLogin: new Date('2024-01-15T08:30:00'),
    createdAt: new Date('2023-01-01T00:00:00')
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@company.com',
    firstName: 'Sarah',
    lastName: 'Manager',
    role: 'manager',
    companyId: '1',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isActive: true,
    lastLogin: new Date('2024-01-15T09:15:00'),
    createdAt: new Date('2023-02-01T00:00:00')
  },
  {
    id: '3',
    username: 'operator',
    email: 'operator@company.com',
    firstName: 'Mike',
    lastName: 'Operator',
    role: 'operator',
    companyId: '1',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isActive: true,
    lastLogin: new Date('2024-01-15T07:00:00'),
    createdAt: new Date('2023-03-01T00:00:00')
  }
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechManufacturing Corp',
    description: 'Leading manufacturer of precision components',
    address: '123 Industrial Blvd, Manufacturing City, MC 12345',
    phone: '(555) 123-4567',
    email: 'contact@techmanufacturing.com',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    isActive: true,
    employeeCount: 250,
    createdAt: new Date('2020-01-01T00:00:00')
  },
  {
    id: '2',
    name: 'Precision Parts Ltd',
    description: 'Specializing in automotive components',
    address: '456 Factory Ave, Industrial Park, IP 67890',
    phone: '(555) 987-6543',
    email: 'info@precisionparts.com',
    isActive: true,
    employeeCount: 150,
    createdAt: new Date('2019-06-01T00:00:00')
  }
];

export const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@company.com',
    phone: '(555) 111-2222',
    role: 'Production Supervisor',
    department: 'Manufacturing',
    companyId: '1',
    skills: ['Quality Control', 'Process Optimization', 'Team Leadership'],
    isActive: true,
    hireDate: new Date('2022-03-15T00:00:00'),
    performance: 92
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@company.com',
    phone: '(555) 333-4444',
    role: 'Machine Operator',
    department: 'Production',
    companyId: '1',
    skills: ['CNC Operation', 'Quality Inspection', 'Preventive Maintenance'],
    isActive: true,
    hireDate: new Date('2021-08-20T00:00:00'),
    performance: 88
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@company.com',
    phone: '(555) 555-6666',
    role: 'Quality Inspector',
    department: 'Quality Assurance',
    companyId: '1',
    skills: ['Statistical Analysis', 'ISO Standards', 'Documentation'],
    isActive: true,
    hireDate: new Date('2023-01-10T00:00:00'),
    performance: 95
  }
];

export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'CNC Machine #1',
    type: 'CNC Machining Center',
    model: 'HMC-500',
    serialNumber: 'HMC500-2021-001',
    manufacturer: 'Precision Tools Inc',
    location: 'Production Floor A',
    status: 'operational',
    companyId: '1',
    installDate: new Date('2021-06-15T00:00:00'),
    lastMaintenance: new Date('2024-01-10T00:00:00'),
    nextMaintenance: new Date('2024-04-10T00:00:00'),
    efficiency: 94,
    operatingHours: 2850
  },
  {
    id: '2',
    name: 'Assembly Line #2',
    type: 'Automated Assembly',
    model: 'AL-2000X',
    serialNumber: 'AL2000X-2022-003',
    manufacturer: 'AutoLine Systems',
    location: 'Assembly Hall B',
    status: 'maintenance',
    companyId: '1',
    installDate: new Date('2022-02-20T00:00:00'),
    lastMaintenance: new Date('2024-01-14T00:00:00'),
    nextMaintenance: new Date('2024-02-14T00:00:00'),
    efficiency: 87,
    operatingHours: 1920
  },
  {
    id: '3',
    name: 'Quality Scanner #1',
    type: 'Vision Inspection',
    model: 'VS-Pro-300',
    serialNumber: 'VSP300-2023-005',
    manufacturer: 'VisionTech Ltd',
    location: 'Quality Control',
    status: 'operational',
    companyId: '1',
    installDate: new Date('2023-03-10T00:00:00'),
    lastMaintenance: new Date('2024-01-05T00:00:00'),
    nextMaintenance: new Date('2024-07-05T00:00:00'),
    efficiency: 98,
    operatingHours: 1450
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Production Run - Widget Series A',
    description: 'Manufacturing 500 units of Widget Series A according to specifications',
    type: 'production',
    status: 'in_progress',
    priority: 'high',
    assignedTo: ['1', '2'],
    equipmentId: '1',
    companyId: '1',
    startDate: new Date('2024-01-15T08:00:00'),
    dueDate: new Date('2024-01-17T17:00:00'),
    progress: 65,
    estimatedHours: 24,
    actualHours: 16
  },
  {
    id: '2',
    title: 'Preventive Maintenance - Assembly Line',
    description: 'Scheduled maintenance including lubrication, belt inspection, and calibration',
    type: 'maintenance',
    status: 'completed',
    priority: 'medium',
    assignedTo: ['2'],
    equipmentId: '2',
    companyId: '1',
    startDate: new Date('2024-01-14T06:00:00'),
    dueDate: new Date('2024-01-14T14:00:00'),
    completedDate: new Date('2024-01-14T13:30:00'),
    progress: 100,
    estimatedHours: 8,
    actualHours: 7.5
  },
  {
    id: '3',
    title: 'Quality Inspection - Batch #2024-001',
    description: 'Complete quality inspection of batch #2024-001 including dimensional checks',
    type: 'quality_check',
    status: 'pending',
    priority: 'critical',
    assignedTo: ['3'],
    companyId: '1',
    startDate: new Date('2024-01-16T09:00:00'),
    dueDate: new Date('2024-01-16T12:00:00'),
    progress: 0,
    estimatedHours: 3
  },
  {
    id: '4',
    title: 'Operator Training - New Safety Protocols',
    description: 'Training session on updated safety protocols and emergency procedures',
    type: 'training',
    status: 'in_progress',
    priority: 'high',
    assignedTo: ['1', '2', '3'],
    companyId: '1',
    startDate: new Date('2024-01-15T14:00:00'),
    dueDate: new Date('2024-01-15T16:00:00'),
    progress: 75,
    estimatedHours: 2,
    actualHours: 1.5
  }
];

export const mockProductionMetrics: ProductionMetrics = {
  totalProduction: 1247,
  efficiency: 92.4,
  qualityScore: 98.7,
  downtime: 2.3,
  activeEquipment: 12,
  completedTasks: 23,
  pendingTasks: 8,
  overdueeTasks: 2
};

export const mockChartData: ChartData[] = [
  { name: 'Jan', production: 980, efficiency: 89, quality: 96 },
  { name: 'Feb', production: 1120, efficiency: 91, quality: 97 },
  { name: 'Mar', production: 1050, efficiency: 88, quality: 95 },
  { name: 'Apr', production: 1300, efficiency: 94, quality: 98 },
  { name: 'May', production: 1180, efficiency: 90, quality: 97 },
  { name: 'Jun', production: 1400, efficiency: 93, quality: 99 },
  { name: 'Jul', production: 1350, efficiency: 95, quality: 98 }
];

export const mockEfficiencyData: ChartData[] = [
  { name: 'Production', value: 92.4 },
  { name: 'Quality', value: 98.7 },
  { name: 'Equipment', value: 89.2 },
  { name: 'Personnel', value: 91.8 }
];