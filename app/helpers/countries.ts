export const countryMap: Record<string, { flag: string; name: string }> = {
    'US': { flag: '🇺🇸', name: 'United States' },
    'CA': { flag: '🇨🇦', name: 'Canada' },
    'GB': { flag: '🇬🇧', name: 'United Kingdom' },
    'DE': { flag: '🇩🇪', name: 'Germany' },
    'FR': { flag: '🇫🇷', name: 'France' },
    'IT': { flag: '🇮🇹', name: 'Italy' },
    'ES': { flag: '🇪🇸', name: 'Spain' },
    'AU': { flag: '🇦🇺', name: 'Australia' },
    'JP': { flag: '🇯🇵', name: 'Japan' },
    'CN': { flag: '🇨🇳', name: 'China' },
    'IN': { flag: '🇮🇳', name: 'India' },
    'BR': { flag: '🇧🇷', name: 'Brazil' },
    'MX': { flag: '🇲🇽', name: 'Mexico' },
    'RU': { flag: '🇷🇺', name: 'Russia' },
    'ZA': { flag: '🇿🇦', name: 'South Africa' },
};

export const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
        'us': '🇺🇸',
        'gb': '🇬🇧',
        'de': '🇩🇪',
        'fr': '🇫🇷',
        'ca': '🇨🇦',
        'au': '🇦🇺',
        'jp': '🇯🇵',
        'br': '🇧🇷',
        'in': '🇮🇳',
        'cn': '🇨🇳'
    };
    return flags[countryCode.toLowerCase()] || '🌍';
};


export const getCountryName = (countryCode?: string) => {
    const countries: Record<string, string> = {
        'us': '🇺🇸 United States',
        'gb': '🇬🇧 United Kingdom',
        'de': '🇩🇪 Germany',
        'fr': '🇫🇷 France',
        'ca': '🇨🇦 Canada',
        'au': '🇦🇺 Australia',
        'jp': '🇯🇵 Japan',
        'br': '🇧🇷 Brazil',
        'in': '🇮🇳 India',
        'cn': '🇨🇳 China'
    };
    return countries[countryCode?.toLowerCase() || ''] || `🌍 ${countryCode?.toUpperCase()}`;
};

export const countryLabels: Record<string, string> = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'CA': 'Canada',
    'AU': 'Australia',
    'JP': 'Japan',
    'CN': 'China',
    'IN': 'India',
    'BR': 'Brazil',
    'RU': 'Russia',
    'ZA': 'South Africa',
    'KR': 'South Korea',
    'MX': 'Mexico',
    'IT': 'Italy',
    'ES': 'Spain',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
};