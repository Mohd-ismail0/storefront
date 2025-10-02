'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Globe, ChevronDown } from 'lucide-react';
import { locales, localeConfig } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LocaleSwitcherProps {
  currentLocale: string;
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Replace the current locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace the locale segment
    const newPath = segments.join('/');
    
    router.push(newPath);
  };

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className={cn(
          'appearance-none bg-transparent border border-neutral-300 rounded-lg px-3 py-2 pr-8',
          'text-sm font-medium text-neutral-700 hover:text-neutral-900',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'cursor-pointer transition-colors duration-200',
          'min-w-[120px]'
        )}
        aria-label="Select language"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeConfig[locale].flag} {localeConfig[locale].name}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-neutral-500" />
      </div>
    </div>
  );
}