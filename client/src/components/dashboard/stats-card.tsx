interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  trend?: string;
  trendLabel?: string;
  isPositive?: boolean;
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconColor,
  iconBg,
  trend,
  trendLabel,
  isPositive = true,
  loading = false
}: StatsCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex items-center mt-4">
            <div className="h-3 bg-gray-200 rounded w-12 mr-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold gradient-whatsapp">{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          <i className={`${icon} ${iconColor} text-xl`}></i>
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            <i className={`fas ${isPositive ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
            {trend}
          </span>
          {trendLabel && (
            <span className="text-gray-600 text-sm ml-1">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
