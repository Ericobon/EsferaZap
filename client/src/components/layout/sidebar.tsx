import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import type { User } from "@shared/schema";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      name: 'Meus Bots', 
      href: '/bots', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ), 
      badge: '3' 
    },
    { 
      name: 'Conversas', 
      href: '/conversations', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ), 
      badge: '12' 
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  const secondaryNavigation = [
    { 
      name: 'Configurações', 
      href: '/settings', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      name: 'API Keys', 
      href: '/api-keys', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
    },
    { 
      name: 'Suporte', 
      href: '/support', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 11-9.5 9.5A9.5 9.5 0 0112 2.5z" />
        </svg>
      )
    },
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
            {/* Network Sphere Logo */}
            <div className="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <svg 
                className="w-10 h-10" 
                viewBox="0 0 60 60" 
                fill="none"
              >
                {/* Main sphere structure with connected nodes */}
                {/* Large central nodes */}
                <circle cx="30" cy="25" r="4" fill="url(#gradient1)" />
                <circle cx="20" cy="35" r="3.5" fill="url(#gradient2)" />
                <circle cx="40" cy="35" r="3.5" fill="url(#gradient3)" />
                
                {/* Medium nodes */}
                <circle cx="15" cy="20" r="2.5" fill="url(#gradient4)" />
                <circle cx="45" cy="20" r="2.5" fill="url(#gradient5)" />
                <circle cx="25" cy="45" r="2.5" fill="url(#gradient6)" />
                <circle cx="35" cy="45" r="2.5" fill="url(#gradient7)" />
                
                {/* Small peripheral nodes */}
                <circle cx="10" cy="30" r="2" fill="url(#gradient8)" />
                <circle cx="50" cy="30" r="2" fill="url(#gradient9)" />
                <circle cx="30" cy="10" r="2" fill="url(#gradient10)" />
                <circle cx="30" cy="50" r="2" fill="url(#gradient11)" />
                <circle cx="42" cy="15" r="1.5" fill="url(#gradient12)" />
                <circle cx="18" cy="15" r="1.5" fill="url(#gradient13)" />
                
                {/* Connection lines */}
                <line x1="30" y1="25" x2="20" y2="35" stroke="url(#lineGradient)" strokeWidth="1.5" opacity="0.8" />
                <line x1="30" y1="25" x2="40" y2="35" stroke="url(#lineGradient)" strokeWidth="1.5" opacity="0.8" />
                <line x1="30" y1="25" x2="15" y2="20" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
                <line x1="30" y1="25" x2="45" y2="20" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
                <line x1="20" y1="35" x2="25" y2="45" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
                <line x1="40" y1="35" x2="35" y2="45" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
                <line x1="15" y1="20" x2="10" y2="30" stroke="url(#lineGradient)" strokeWidth="0.8" opacity="0.5" />
                <line x1="45" y1="20" x2="50" y2="30" stroke="url(#lineGradient)" strokeWidth="0.8" opacity="0.5" />
                <line x1="30" y1="25" x2="30" y2="10" stroke="url(#lineGradient)" strokeWidth="0.8" opacity="0.5" />
                <line x1="25" y1="45" x2="30" y2="50" stroke="url(#lineGradient)" strokeWidth="0.8" opacity="0.5" />
                <line x1="35" y1="45" x2="30" y2="50" stroke="url(#lineGradient)" strokeWidth="0.8" opacity="0.5" />
                <line x1="45" y1="20" x2="42" y2="15" stroke="url(#lineGradient)" strokeWidth="0.5" opacity="0.4" />
                <line x1="15" y1="20" x2="18" y2="15" stroke="url(#lineGradient)" strokeWidth="0.5" opacity="0.4" />
                
                {/* Gradients for nodes */}
                <defs>
                  <radialGradient id="gradient1" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </radialGradient>
                  <radialGradient id="gradient2" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </radialGradient>
                  <radialGradient id="gradient3" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#10B981" />
                  </radialGradient>
                  <radialGradient id="gradient4" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </radialGradient>
                  <radialGradient id="gradient5" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </radialGradient>
                  <radialGradient id="gradient6" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                  </radialGradient>
                  <radialGradient id="gradient7" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </radialGradient>
                  <radialGradient id="gradient8" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </radialGradient>
                  <radialGradient id="gradient9" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </radialGradient>
                  <radialGradient id="gradient10" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#9333EA" />
                  </radialGradient>
                  <radialGradient id="gradient11" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </radialGradient>
                  <radialGradient id="gradient12" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#DB2777" />
                  </radialGradient>
                  <radialGradient id="gradient13" cx="0.3" cy="0.3">
                    <stop offset="0%" stopColor="#0891B2" />
                    <stop offset="100%" stopColor="#0E7490" />
                  </radialGradient>
                  
                  {/* Gradient for connection lines */}
                  <linearGradient id="lineGradient">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#E0E7FF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
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
                <div className="mr-3">{item.icon}</div>
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
                <div className="mr-3">{item.icon}</div>
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
