import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'fas fa-chart-line' },
    { name: 'Meus Bots', href: '/bots', icon: 'fas fa-robot', badge: '3' },
    { name: 'Conversas', href: '/conversations', icon: 'fas fa-comments', badge: '12' },
    { name: 'Analytics', href: '/analytics', icon: 'fas fa-chart-bar' },
  ];

  const secondaryNavigation = [
    { name: 'Configurações', href: '/settings', icon: 'fas fa-cog' },
    { name: 'API Keys', href: '/api-keys', icon: 'fas fa-key' },
    { name: 'Suporte', href: '/support', icon: 'fas fa-life-ring' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location === '/';
    }
    return location.startsWith(href);
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        
        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-bolt text-white text-lg"></i>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">EsferaZap</div>
              <div className="text-xs text-gray-500">by InsightEsfera</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className={`${
                isActive(item.href)
                  ? 'bg-primary-light text-primary-dark'
                  : 'text-gray-600 hover:bg-gray-100'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-lg`}>
                <i className={`${item.icon} mr-3`}></i>
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-primary text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </a>
            </Link>
          ))}
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>
          
          {secondaryNavigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className={`${
                isActive(item.href)
                  ? 'bg-primary-light text-primary-dark'
                  : 'text-gray-600 hover:bg-gray-100'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-lg`}>
                <i className={`${item.icon} mr-3`}></i>
                {item.name}
              </a>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Avatar do usuário" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
            <button 
              onClick={() => window.location.href = '/api/logout'}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
