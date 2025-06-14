import React, { useState } from 'react';
import { Plus, Search, Settings, AlertTriangle, CheckCircle, Wrench, Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { mockEquipment } from '../../data/mockData';
import { Equipment as EquipmentType } from '../../types';
import EquipmentModal from './EquipmentModal';

const Equipment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [equipment, setEquipment] = useState(mockEquipment);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const types = [...new Set(equipment.map(eq => eq.type))];
  const statuses = ['operational', 'maintenance', 'offline', 'repair'];

  const filteredEquipment = equipment.filter(equipment => {
    const matchesSearch = 
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || equipment.status === statusFilter;
    const matchesType = !typeFilter || equipment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    const iconClass = "w-5 h-5";
    switch (status) {
      case 'operational':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'maintenance':
        return <Wrench className={`${iconClass} text-yellow-500`} />;
      case 'offline':
        return <AlertTriangle className={`${iconClass} text-red-500`} />;
      case 'repair':
        return <Settings className={`${iconClass} text-orange-500`} />;
      default:
        return <AlertTriangle className={`${iconClass} text-gray-500`} />;
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isMaintenanceDue = (nextMaintenance?: Date) => {
    if (!nextMaintenance) return false;
    const today = new Date();
    const diffTime = nextMaintenance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const handleCreateEquipment = () => {
    setSelectedEquipment(undefined);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditEquipment = (equipment: EquipmentType) => {
    setSelectedEquipment(equipment);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSaveEquipment = (equipmentData: Omit<EquipmentType, 'id'>) => {
    if (modalMode === 'create') {
      const newEquipment: EquipmentType = {
        ...equipmentData,
        id: Date.now().toString()
      };
      setEquipment(prev => [...prev, newEquipment]);
    } else if (selectedEquipment) {
      setEquipment(prev => prev.map(equipment => 
        equipment.id === selectedEquipment.id 
          ? { ...equipment, ...equipmentData }
          : equipment
      ));
    }
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      setEquipment(prev => prev.filter(equipment => equipment.id !== equipmentId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Equipment
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage production equipment
          </p>
        </div>
        <button 
          onClick={handleCreateEquipment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
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
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEquipment.map((equipment) => (
          <div
            key={equipment.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            {/* Equipment Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getStatusIcon(equipment.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {equipment.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {equipment.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(equipment.status)}`}>
                  {equipment.status.replace('_', ' ')}
                </span>
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors group">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button
                      onClick={() => handleEditEquipment(equipment)}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Equipment</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEquipment(equipment.id)}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Equipment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment Details */}
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Model:</span>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {equipment.model}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Location:</span>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {equipment.location}
                  </p>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Manufacturer:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {equipment.manufacturer}
                </p>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Serial Number:</span>
                <p className="font-mono text-xs font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {equipment.serialNumber}
                </p>
              </div>
            </div>

            {/* Efficiency */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Efficiency
                </span>
                <span className={`text-sm font-semibold ${getEfficiencyColor(equipment.efficiency)}`}>
                  {equipment.efficiency}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${equipment.efficiency}%` }}
                ></div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Operating Hours</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {equipment.operatingHours.toLocaleString()}h
                </span>
              </div>
            </div>

            {/* Maintenance Info */}
            <div className="space-y-2 mb-4">
              {equipment.lastMaintenance && (
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Last Maintenance:</span>
                  <span>{formatDate(equipment.lastMaintenance)}</span>
                </div>
              )}
              {equipment.nextMaintenance && (
                <div className={`flex items-center justify-between text-xs ${
                  isMaintenanceDue(equipment.nextMaintenance) 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Next Maintenance:</span>
                  </div>
                  <span className="font-medium">
                    {formatDate(equipment.nextMaintenance)}
                  </span>
                </div>
              )}
            </div>

            {/* Maintenance Warning */}
            {isMaintenanceDue(equipment.nextMaintenance) && (
              <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-700 dark:text-red-400 font-medium">
                    Maintenance due soon!
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                View Details
              </button>
              <button 
                onClick={() => handleEditEquipment(equipment)}
                className="flex-1 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No equipment found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || statusFilter || typeFilter 
              ? 'Try adjusting your search criteria' 
              : 'Get started by adding your first equipment'}
          </p>
        </div>
      )}

      {/* Equipment Modal */}
      <EquipmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveEquipment}
        equipment={selectedEquipment}
        mode={modalMode}
      />
    </div>
  );
};

export default Equipment;