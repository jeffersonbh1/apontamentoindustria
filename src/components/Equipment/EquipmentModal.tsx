import React, { useState, useEffect } from 'react';
import { X, Settings, Calendar, MapPin, Wrench, AlertTriangle } from 'lucide-react';
import { Equipment, Company } from '../../types';
import { mockCompanies } from '../../data/mockData';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: Omit<Equipment, 'id'>) => void;
  equipment?: Equipment;
  mode: 'create' | 'edit';
}

const EquipmentModal: React.FC<EquipmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  equipment,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    model: '',
    serialNumber: '',
    manufacturer: '',
    location: '',
    status: 'operational' as Equipment['status'],
    companyId: '',
    installDate: new Date().toISOString().split('T')[0],
    lastMaintenance: '',
    nextMaintenance: '',
    efficiency: 95,
    operatingHours: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const equipmentTypes = [
    'CNC Machining Center',
    'Automated Assembly',
    'Vision Inspection',
    'Conveyor System',
    'Robotic Arm',
    'Press Machine',
    'Welding Station',
    'Packaging Machine',
    'Quality Scanner',
    'Material Handler'
  ];

  const statusOptions = [
    { value: 'operational', label: 'Operational', color: 'text-green-600' },
    { value: 'maintenance', label: 'Maintenance', color: 'text-yellow-600' },
    { value: 'offline', label: 'Offline', color: 'text-red-600' },
    { value: 'repair', label: 'Repair', color: 'text-orange-600' }
  ];

  useEffect(() => {
    if (equipment && mode === 'edit') {
      setFormData({
        name: equipment.name,
        type: equipment.type,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        manufacturer: equipment.manufacturer,
        location: equipment.location,
        status: equipment.status,
        companyId: equipment.companyId,
        installDate: equipment.installDate.toISOString().split('T')[0],
        lastMaintenance: equipment.lastMaintenance ? equipment.lastMaintenance.toISOString().split('T')[0] : '',
        nextMaintenance: equipment.nextMaintenance ? equipment.nextMaintenance.toISOString().split('T')[0] : '',
        efficiency: equipment.efficiency,
        operatingHours: equipment.operatingHours
      });
    } else {
      setFormData({
        name: '',
        type: '',
        model: '',
        serialNumber: '',
        manufacturer: '',
        location: '',
        status: 'operational',
        companyId: mockCompanies[0]?.id || '',
        installDate: new Date().toISOString().split('T')[0],
        lastMaintenance: '',
        nextMaintenance: '',
        efficiency: 95,
        operatingHours: 0
      });
    }
    setErrors({});
  }, [equipment, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Equipment type is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }

    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.companyId) {
      newErrors.companyId = 'Company is required';
    }

    if (formData.efficiency < 0 || formData.efficiency > 100) {
      newErrors.efficiency = 'Efficiency must be between 0 and 100';
    }

    if (formData.operatingHours < 0) {
      newErrors.operatingHours = 'Operating hours cannot be negative';
    }

    // Validate maintenance dates
    if (formData.lastMaintenance && formData.nextMaintenance) {
      const lastDate = new Date(formData.lastMaintenance);
      const nextDate = new Date(formData.nextMaintenance);
      if (nextDate <= lastDate) {
        newErrors.nextMaintenance = 'Next maintenance date must be after last maintenance date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const equipmentData = {
        ...formData,
        installDate: new Date(formData.installDate),
        lastMaintenance: formData.lastMaintenance ? new Date(formData.lastMaintenance) : undefined,
        nextMaintenance: formData.nextMaintenance ? new Date(formData.nextMaintenance) : undefined
      };
      onSave(equipmentData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const generateSerialNumber = () => {
    const prefix = formData.type.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const serialNumber = `${prefix}${year}-${random}`;
    
    setFormData(prev => ({
      ...prev,
      serialNumber
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {mode === 'create' ? 'Add New Equipment' : 'Edit Equipment'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'create' ? 'Register new production equipment' : 'Update equipment information'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter equipment name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Equipment Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.type ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select equipment type</option>
                  {equipmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>}
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.model ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter model number"
                />
                {errors.model && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.model}</p>}
              </div>

              <div>
                <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.manufacturer ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter manufacturer name"
                />
                {errors.manufacturer && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.manufacturer}</p>}
              </div>
            </div>
          </div>

          {/* Serial Number and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Serial Number *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.serialNumber ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter serial number"
                />
                <button
                  type="button"
                  onClick={generateSerialNumber}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
                >
                  Generate
                </button>
              </div>
              {errors.serialNumber && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.serialNumber}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.location ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Production Floor A"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>}
            </div>
          </div>

          {/* Status and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company *
              </label>
              <select
                id="companyId"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.companyId ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select a company</option>
                {mockCompanies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
              {errors.companyId && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyId}</p>}
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Installation & Maintenance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="installDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Install Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    id="installDate"
                    name="installDate"
                    value={formData.installDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastMaintenance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Maintenance
                </label>
                <div className="relative">
                  <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    id="lastMaintenance"
                    name="lastMaintenance"
                    value={formData.lastMaintenance}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nextMaintenance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Next Maintenance
                </label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    id="nextMaintenance"
                    name="nextMaintenance"
                    value={formData.nextMaintenance}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                      errors.nextMaintenance ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.nextMaintenance && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nextMaintenance}</p>}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="efficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Efficiency (%)
                </label>
                <input
                  type="number"
                  id="efficiency"
                  name="efficiency"
                  value={formData.efficiency}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.efficiency ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="95"
                />
                {errors.efficiency && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.efficiency}</p>}
              </div>

              <div>
                <label htmlFor="operatingHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operating Hours
                </label>
                <input
                  type="number"
                  id="operatingHours"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    errors.operatingHours ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0"
                />
                {errors.operatingHours && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.operatingHours}</p>}
              </div>
            </div>
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
              <span>{mode === 'create' ? 'Create Equipment' : 'Update Equipment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentModal;