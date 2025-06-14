import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { mockProductionMetrics } from '../../data/mockData';

const MetricsCards: React.FC = () => {
  const metrics = mockProductionMetrics;

  const cards = [
    {
      title: 'Total Production',
      value: metrics.totalProduction.toLocaleString(),
      unit: 'units',
      change: '+12.5%',
      isPositive: true,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Overall Efficiency',
      value: metrics.efficiency.toFixed(1),
      unit: '%',
      change: '+2.3%',
      isPositive: true,
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Quality Score',
      value: metrics.qualityScore.toFixed(1),
      unit: '%',
      change: '+0.8%',
      isPositive: true,
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      title: 'Downtime',
      value: metrics.downtime.toFixed(1),
      unit: '%',
      change: '-0.5%',
      isPositive: true,
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      title: 'Active Equipment',
      value: metrics.activeEquipment.toString(),
      unit: 'machines',
      change: '+1',
      isPositive: true,
      icon: Activity,
      color: 'purple'
    },
    {
      title: 'Pending Tasks',
      value: metrics.pendingTasks.toString(),
      unit: 'tasks',
      change: '-3',
      isPositive: true,
      icon: Clock,
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      green: 'bg-green-500 text-green-600 bg-green-50 dark:bg-green-900/20',
      emerald: 'bg-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-900/20',
      yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const colorClasses = getColorClasses(card.color).split(' ');
        const iconBg = colorClasses[0];
        const textColor = colorClasses[1];
        const cardBg = colorClasses.slice(2).join(' ');

        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${cardBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${textColor}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                card.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {card.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">{card.change}</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {card.unit}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {card.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;