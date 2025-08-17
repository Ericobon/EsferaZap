import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

const languages = [
  { code: 'pt' as Language, name: 'Português', flag: '🇧🇷' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (lang: Language) => {
    console.log('🌍 Language selector clicked:', lang);
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 border">
          <Globe className="h-4 w-4 mr-1" />
          <span className="text-xs">
            {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer ${
              language === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : ''
            }`}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{lang.name}</span>
              <span className="text-xs text-gray-500">{lang.code.toUpperCase()}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}