'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
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
          'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
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
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
    </div>
  );
}