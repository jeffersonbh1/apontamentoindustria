import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MetricsCards from './MetricsCards';
import ProductionChart from './ProductionChart';
import EfficiencyChart from './EfficiencyChart';
import RecentActivities from './RecentActivities';
import EquipmentStatus from './EquipmentStatus';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening in your production facility today.
        </p>
      </div>

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionChart />
        <EfficiencyChart />
      </div>

      {/* Activities and Equipment Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <EquipmentStatus />
      </div>
    </div>
  );
};

export default Dashboard;