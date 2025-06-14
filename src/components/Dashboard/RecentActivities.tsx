import React from 'react';
import { Clock, User, AlertTriangle, CheckCircle, Play } from 'lucide-react';
import { mockActivities, mockEmployees } from '../../data/mockData';

const RecentActivities: React.FC = () => {
  const recentActivities = mockActivities.slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Recent Activities
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Latest tasks and operations
          </p>
        </div>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(activity.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.title}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(activity.priority)}`}>
                  {activity.priority}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {activity.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{getEmployeeName(activity.assignedTo[0])}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(activity.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${activity.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">{activity.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;