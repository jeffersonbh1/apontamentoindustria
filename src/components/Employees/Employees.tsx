import React, { useState } from 'react';
import { Plus, Search, User, Mail, Phone, Building2, Award, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { mockEmployees, mockCompanies } from '../../data/mockData';
import { Employee } from '../../types';
import EmployeeModal from './EmployeeModal';

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [employees, setEmployees] = useState(mockEmployees);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const departments = [...new Set(employees.map(emp => emp.department))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const getCompanyName = (companyId: string) => {
    const company = mockCompanies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600 dark:text-green-400';
    if (performance >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleCreateEmployee = () => {
    setSelectedEmployee(undefined);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSaveEmployee = (employeeData: Omit<Employee, 'id'>) => {
    if (modalMode === 'create') {
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString()
      };
      setEmployees(prev => [...prev, newEmployee]);
    } else if (selectedEmployee) {
      setEmployees(prev => prev.map(employee => 
        employee.id === selectedEmployee.id 
          ? { ...employee, ...employeeData }
          : employee
      ));
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(employee => employee.id !== employeeId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employees
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage employee information and performance
          </p>
        </div>
        <button 
          onClick={handleCreateEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            {/* Employee Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {employee.role}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                  <MoreVertical className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Employee</span>
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Employee</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Building2 className="w-4 h-4" />
                <span>{employee.department}</span>
              </div>
            </div>

            {/* Performance */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Performance
                </span>
                <span className={`text-sm font-semibold ${getPerformanceColor(employee.performance)}`}>
                  {employee.performance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${employee.performance}%` }}
                ></div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills
              </h4>
              <div className="flex flex-wrap gap-1">
                {employee.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {employee.skills.length > 3 && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 text-xs rounded-full">
                    +{employee.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mb-4">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {getCompanyName(employee.companyId)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Company
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(employee.hireDate).getFullYear()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Hired
                </div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${employee.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Status
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                View Profile
              </button>
              <button 
                onClick={() => handleEditEmployee(employee)}
                className="flex-1 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No employees found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || departmentFilter ? 'Try adjusting your search criteria' : 'Get started by adding your first employee'}
          </p>
        </div>
      )}

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
        mode={modalMode}
      />
    </div>
  );
};

export default Employees;