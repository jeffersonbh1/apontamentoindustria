import React, { useState } from 'react';
import { Download, Calendar, Filter, BarChart3, TrendingUp, FileText, Printer } from 'lucide-react';
import ProductionChart from '../Dashboard/ProductionChart';
import EfficiencyChart from '../Dashboard/EfficiencyChart';
import { mockProductionMetrics, mockChartData } from '../../data/mockData';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('last_30_days');
  const [reportType, setReportType] = useState('production');

  const reportTypes = [
    { value: 'production', label: 'Production Report', icon: BarChart3 },
    { value: 'efficiency', label: 'Efficiency Report', icon: TrendingUp },
    { value: 'maintenance', label: 'Maintenance Report', icon: FileText },
    { value: 'quality', label: 'Quality Report', icon: FileText }
  ];

  const dateRanges = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const exportFormats = ['PDF', 'Excel', 'CSV'];

  const handleExport = (format: string) => {
    // Simulate export functionality
    console.log(`Exporting ${reportType} report as ${format}`);
    // In a real application, this would trigger the actual export
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate comprehensive reports and analyze performance data
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Printer className="w-5 h-5" />
            <span>Print</span>
          </button>
          <div className="relative">
            <select
              onChange={(e) => handleExport(e.target.value)}
              className="appearance-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 pr-8 rounded-lg transition-colors cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>Export</option>
              {exportFormats.map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
            <Download className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">All Departments</option>
              <option value="production">Production</option>
              <option value="quality">Quality Assurance</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Production</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockProductionMetrics.totalProduction.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">+12.5% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockProductionMetrics.efficiency}%
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">+2.3% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quality Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockProductionMetrics.qualityScore}%
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">+0.8% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Downtime</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockProductionMetrics.downtime}%
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">-0.5% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionChart />
        <EfficiencyChart />
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Performance Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monthly breakdown of key performance indicators
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Production
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockChartData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {data.name} 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {data.production?.toLocaleString()} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {data.efficiency}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {data.quality}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">+5.2%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Report Summary
        </h3>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Based on the data from the selected period, here are the key insights:
          </p>
          <ul className="text-gray-600 dark:text-gray-400 space-y-2">
            <li>• Production output has increased by 12.5% compared to the previous period</li>
            <li>• Overall efficiency improved by 2.3%, indicating better resource utilization</li>
            <li>• Quality scores remain consistently high at 98.7%, exceeding target benchmarks</li>
            <li>• Equipment downtime reduced by 0.5%, contributing to improved productivity</li>
            <li>• Maintenance activities completed on schedule with 95% adherence rate</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            <strong>Recommendations:</strong> Continue current optimization strategies and consider 
            expanding successful practices to other production lines. Monitor equipment performance 
            closely to maintain low downtime rates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;