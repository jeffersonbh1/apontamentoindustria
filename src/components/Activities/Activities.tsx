import React, { useState } from 'react';
import { Plus, Search, Calendar, User, Clock, AlertTriangle, CheckCircle, Play, Pause, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { mockActivities, mockEmployees, mockEquipment } from '../../data/mockData';
import { Activity } from '../../types';
import ActivityModal from './ActivityModal';

const Activities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [activities, setActivities] = useState(mockActivities);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const types = ['production', 'maintenance', 'quality_check', 'training'];
  const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  const priorities = ['low', 'medium', 'high', 'critical'];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || activity.status === statusFilter;
    const matchesType = !typeFilter || activity.type === typeFilter;
    const matchesPriority = !priorityFilter || activity.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    const iconClass = "w-4 h-4";
    switch (status) {
      case 'completed':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'in_progress':
        return <Play className={`${iconClass} text-blue-500`} />;
      case 'pending':
        return <Clock className={`${iconClass} text-yellow-500`} />;
      case 'cancelled':
        return <Pause className={`${iconClass} text-red-500`} />;
      default:
        return <AlertTriangle className={`${iconClass} text-gray-500`} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'production':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'maintenance':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'quality_check':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'training':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  const getEquipmentName = (equipmentId?: string) => {
    if (!equipmentId) return null;
    const equipment = mockEquipment.find(eq => eq.id === equipmentId);
    return equipment?.name || 'Unknown Equipment';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return status !== 'completed' && new Date() > dueDate;
  };

  const handleCreateActivity = () => {
    setSelectedActivity(undefined);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSaveActivity = (activityData: Omit<Activity, 'id'>) => {
    if (modalMode === 'create') {
      const newActivity: Activity = {
        ...activityData,
        id: Date.now().toString()
      };
      setActivities(prev => [...prev, newActivity]);
    } else if (selectedActivity) {
      setActivities(prev => prev.map(activity => 
        activity.id === selectedActivity.id 
          ? { ...activity, ...activityData }
          : activity
      ));
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Activities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage tasks and track progress
          </p>
        </div>
        <button 
          onClick={handleCreateActivity}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Activity</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
              isOverdue(activity.dueDate, activity.status)
                ? 'border-red-200 dark:border-red-800'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="p-6">
              {/* Activity Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      {isOverdue(activity.dueDate, activity.status) && (
                        <span className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Overdue</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {activity.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(activity.priority)}`}>
                    {activity.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(activity.type)}`}>
                    {activity.type.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status.replace('_', ' ')}
                  </span>
                  <div className="relative">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors group">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => handleEditActivity(activity)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Activity</span>
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Activity</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>
                    {activity.assignedTo.length === 1 
                      ? getEmployeeName(activity.assignedTo[0])
                      : `${activity.assignedTo.length} people`}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Due {formatDate(activity.dueDate)}</span>
                </div>
                
                {activity.equipmentId && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{getEquipmentName(activity.equipmentId)}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {activity.actualHours ? 
                      `${activity.actualHours}h / ${activity.estimatedHours}h` :
                      `${activity.estimatedHours}h estimated`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activity.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      activity.status === 'completed' 
                        ? 'bg-green-500' 
                        : activity.status === 'in_progress'
                        ? 'bg-blue-500'
                        : 'bg-gray-400'
                    }`}
                    style={{ width: `${activity.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {activity.assignedTo.slice(0, 3).map((employeeId, index) => (
                    <div
                      key={employeeId}
                      className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      title={getEmployeeName(employeeId)}
                    >
                      {getEmployeeName(employeeId).split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                  {activity.assignedTo.length > 3 && (
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium">
                      +{activity.assignedTo.length - 3}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </button>
                  <button 
                    onClick={() => handleEditActivity(activity)}
                    className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No activities found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || statusFilter || typeFilter || priorityFilter
              ? 'Try adjusting your search criteria' 
              : 'Get started by creating your first activity'}
          </p>
        </div>
      )}

      {/* Activity Modal */}
      <ActivityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveActivity}
        activity={selectedActivity}
        mode={modalMode}
      />
    </div>
  );
};

export default Activities;