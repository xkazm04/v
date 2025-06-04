interface CountrySection {
  code: string;
  name: string;
  flag: string;
  href: string;
  count?: number;
  isDefault?: boolean;
}



export const COUNTRY_SECTIONS: CountrySection[] = [
  { 
    code: 'worldwide', 
    name: 'Worldwide', 
    flag: '🌍', 
    href: '/?country=worldwide',
    isDefault: true,
    count: 1234
  },
  { 
    code: 'US', 
    name: 'United States', 
    flag: '🇺🇸', 
    href: '/?country=US',
    count: 456
  },
  { 
    code: 'GB', 
    name: 'United Kingdom', 
    flag: '🇬🇧', 
    href: '/?country=GB',
    count: 123
  },
  { 
    code: 'CA', 
    name: 'Canada', 
    flag: '🇨🇦', 
    href: '/?country=CA',
    count: 89
  },
  { 
    code: 'AU', 
    name: 'Australia', 
    flag: '🇦🇺', 
    href: '/?country=AU',
    count: 67
  },
  { 
    code: 'DE', 
    name: 'Germany', 
    flag: '🇩🇪', 
    href: '/?country=DE',
    count: 145
  },
  { 
    code: 'FR', 
    name: 'France', 
    flag: '🇫🇷', 
    href: '/?country=FR',
    count: 98
  },
];