import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import type { User } from "@shared/schema";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Meus Bots', href: '/bots', icon: '🤖', badge: '3' },
    { name: 'Conversas', href: '/conversations', icon: '💬', badge: '12' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ];

  const secondaryNavigation = [
    { name: 'Configurações', href: '/settings', icon: '⚙️' },
    { name: 'API Keys', href: '/api-keys', icon: '🔑' },
    { name: 'Suporte', href: '/support', icon: '🆘' },
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
          <div className="flex items-center space-x-3">
            {/* Professional clean icon with gradient colors */}
            <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
              <svg 
                className="w-6 h-6 text-white" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <circle cx="9" cy="10" r="1"/>
                <circle cx="15" cy="10" r="1"/>
                <path d="M9 14c0-1 1-2 3-2s3 1 3 2"/>
              </svg>
              {/* Connection indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-purple-400 rounded-full animate-pulse border border-white shadow-sm">
              </div>
            </div>
            <div>
              <div className="text-xl font-bold gradient-whatsapp text-glow">
                EsferaZap
              </div>
              <div className="text-xs text-gray-500 font-medium">by InsightEsfera</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <div className={`${
                isActive(item.href)
                  ? 'bg-primary-light text-primary-dark'
                  : 'text-gray-600 hover:bg-gray-100'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors`}>
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-gradient-to-r from-green-500 to-purple-500 text-white text-xs rounded-full px-2 py-1">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>
          
          {secondaryNavigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <div className={`${
                isActive(item.href)
                  ? 'bg-primary-light text-primary-dark'
                  : 'text-gray-600 hover:bg-gray-100'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors`}>
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </div>
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
