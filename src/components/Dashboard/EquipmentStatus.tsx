import React from 'react';
import { Settings, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import { mockEquipment } from '../../data/mockData';

const EquipmentStatus: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-yellow-500" />;
      case 'offline':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'repair':
        return <Settings className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'offline':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'repair':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-600 dark:text-green-400';
    if (efficiency >= 85) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Equipment Status
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time equipment monitoring
          </p>
        </div>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockEquipment.map((equipment) => (
          <div
            key={equipment.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {getStatusIcon(equipment.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {equipment.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {equipment.location}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {equipment.operatingHours.toLocaleString()}h
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className={`text-sm font-medium ${getEfficiencyColor(equipment.efficiency)}`}>
                  {equipment.efficiency}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Efficiency
                </div>
              </div>
              
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(equipment.status)}`}>
                {equipment.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {mockEquipment.filter(eq => eq.status === 'operational').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Operational
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
              {mockEquipment.filter(eq => eq.status === 'maintenance').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Maintenance
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
              {mockEquipment.filter(eq => eq.status === 'offline').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Offline
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {Math.round(mockEquipment.reduce((acc, eq) => acc + eq.efficiency, 0) / mockEquipment.length)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Avg Efficiency
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentStatus;