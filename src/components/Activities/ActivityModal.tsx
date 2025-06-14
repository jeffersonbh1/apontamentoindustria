import React, { useState, useEffect } from 'react';
import { X, Activity, Calendar, User, AlertTriangle, Settings } from 'lucide-react';
import { Activity as ActivityType, Employee, Equipment } from '../../types';
import { mockEmployees, mockEquipment, mockCompanies } from '../../data/mockData';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<ActivityType, 'id'>) => void;
  activity?: ActivityType;
  mode: 'create' | 'edit';
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  activity,
  mode
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'production' as ActivityType['type'],
    status: 'pending' as ActivityType['status'],
    priority: 'medium' as ActivityType['priority'],
    assignedTo: [] as string[],
    equipmentId: '',
    companyId: '',
    startDate: new Date().toISOString().slice(0, 16),
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    progress: 0,
    estimatedHours: 8,
    actualHours: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const activityTypes = [
    { value: 'production', label: 'Production', icon: Activity },
    { value: 'maintenance', label: 'Maintenance', icon: Settings },
    { value: 'quality_check', label: 'Quality Check', icon: AlertTriangle },
    { value: 'training', label: 'Training', icon: User }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'in_progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-gray-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
  ];

  useEffect(() => {
    if (activity && mode === 'edit') {
      setFormData({
        title: activity.title,
        description: activity.description,
        type: activity.type,
        status: activity.status,
        priority: activity.priority,
        assignedTo: [...activity.assignedTo],
        equipmentId: activity.equipmentId || '',
        companyId: activity.companyId,
        startDate: activity.startDate.toISOString().slice(0, 16),
        dueDate: activity.dueDate.toISOString().slice(0, 16),
        progress: activity.progress,
        estimatedHours: activity.estimatedHours,
        actualHours: activity.actualHours || 0
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'production',
        status: 'pending',
        priority: 'medium',
        assignedTo: [],
        equipmentId: '',
        companyId: mockCompanies[0]?.id || '',
        startDate: new Date().toISOString().slice(0, 16),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        progress: 0,
        estimatedHours: 8,
        actualHours: 0
      });
    }
    setErrors({});
  }, [activity, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Activity title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.assignedTo.length === 0) {
      newErrors.assignedTo = 'At least one employee must be assigned';
    }

    if (!formData.companyId) {
      newErrors.companyId = 'Company is required';
    }

    if (formData.estimatedHours <= 0) {
      newErrors.estimatedHours = 'Estimated hours must be greater than 0';
    }

    if (formData.actualHours < 0) {
      newErrors.actualHours = 'Actual hours cannot be negative';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const dueDate = new Date(formData.dueDate);
    if (dueDate <= startDate) {
      newErrors.dueDate = 'Due date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const activityData = {
        ...formData,
        startDate: new Date(formData.startDate),
        dueDate: new Date(formData.dueDate),
        equipmentId: formData.equipmentId || undefined,
        actualHours: formData.actualHours || undefined,
        completedDate: formData.status === 'completed' ? new Date() : undefined
      };
      onSave(activityData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmployeeToggle = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(employeeId)
        ? prev.assignedTo.filter(id => id !== employeeId)
        : [...prev.assignedTo, employeeId]
    }));
    
    if (errors.assignedTo) {
      setErrors(prev => ({ ...prev, assignedTo: '' }));
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {mode === 'create' ? 'Create New Activity' : 'Edit Activity'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'create' ? 'Create a new task or activity' : 'Update activity information'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activity Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.title ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter activity title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-none ${
                    errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter detailed description of the activity"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Activity Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {priorityOptions.map(priority => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="progress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Progress (%)
                </label>
                <input
                  type="number"
                  id="progress"
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.progress ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0"
                />
                {errors.progress && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.progress}</p>}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date & Time
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date & Time
                </label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="datetime-local"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                      errors.dueDate ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.dueDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate}</p>}
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Hours *
              </label>
              <input
                type="number"
                id="estimatedHours"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                min="0.5"
                step="0.5"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                  errors.estimatedHours ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="8"
              />
              {errors.estimatedHours && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.estimatedHours}</p>}
            </div>

            <div>
              <label htmlFor="actualHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Actual Hours
              </label>
              <input
                type="number"
                id="actualHours"
                name="actualHours"
                value={formData.actualHours}
                onChange={handleChange}
                min="0"
                step="0.5"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                  errors.actualHours ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="0"
              />
              {errors.actualHours && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.actualHours}</p>}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label htmlFor="equipmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Related Equipment (Optional)
            </label>
            <select
              id="equipmentId"
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">No equipment selected</option>
              {mockEquipment.map(equipment => (
                <option key={equipment.id} value={equipment.id}>
                  {equipment.name} - {equipment.location}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Employees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assigned Employees *
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {mockEmployees.map(employee => (
                  <label
                    key={employee.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignedTo.includes(employee.id)}
                      onChange={() => handleEmployeeToggle(employee.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {employee.role} - {employee.department}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {errors.assignedTo && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.assignedTo}</p>}
            
            {/* Selected employees summary */}
            {formData.assignedTo.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Selected: {formData.assignedTo.map(id => getEmployeeName(id)).join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>{mode === 'create' ? 'Create Activity' : 'Update Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;