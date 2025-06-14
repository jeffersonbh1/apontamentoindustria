import React, { useState } from 'react';
import { Plus, Search, Building2, Users, Mail, Phone, MapPin, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { mockCompanies } from '../../data/mockData';
import { Company } from '../../types';
import CompanyModal from './CompanyModal';

const Companies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState(mockCompanies);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCompany = () => {
    setSelectedCompany(undefined);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSaveCompany = (companyData: Omit<Company, 'id' | 'createdAt'>) => {
    if (modalMode === 'create') {
      const newCompany: Company = {
        ...companyData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      setCompanies(prev => [...prev, newCompany]);
    } else if (selectedCompany) {
      setCompanies(prev => prev.map(company => 
        company.id === selectedCompany.id 
          ? { ...company, ...companyData }
          : company
      ));
    }
  };

  const handleDeleteCompany = (companyId: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setCompanies(prev => prev.filter(company => company.id !== companyId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Companies
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage company information and settings
          </p>
        </div>
        <button
          onClick={handleCreateCompany}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Company</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            {/* Company Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {company.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    company.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {company.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                  <MoreVertical className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => handleEditCompany(company)}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Company</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Company</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {company.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{company.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{company.address}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>{company.employeeCount} employees</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Since {new Date(company.createdAt).getFullYear()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 mt-4">
              <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                View Details
              </button>
              <button 
                onClick={() => handleEditCompany(company)}
                className="flex-1 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No companies found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first company'}
          </p>
        </div>
      )}

      {/* Company Modal */}
      <CompanyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCompany}
        company={selectedCompany}
        mode={modalMode}
      />
    </div>
  );
};

export default Companies;