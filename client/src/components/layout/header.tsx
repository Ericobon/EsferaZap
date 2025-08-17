import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

interface HeaderProps {
  title: string;
  action?: ReactNode;
}

export default function Header({ title, action }: HeaderProps) {
  const { t } = useLanguage();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-gray-600">
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h1 className="text-2xl font-bold gradient-whatsapp text-glow">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('bots.search')}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <LanguageSelector />
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            {action}
          </div>
        </div>
      </div>
    </header>
  );
}
