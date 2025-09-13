// Composant pour afficher le drapeau du pays avec react-country-flag

import ReactCountryFlag from 'react-country-flag';

interface CountryFlagProps {
  country: string;
}

export function CountryFlag({ country }: CountryFlagProps) {
  // Mapping des noms de pays vers les codes ISO
  const countryCodeMap: Record<string, string> = {
    'France': 'FR',
    'United States': 'US',
    'Germany': 'DE',
    'United Kingdom': 'GB',
    'Spain': 'ES',
    'Italy': 'IT',
    'Canada': 'CA',
    'Australia': 'AU',
    'Japan': 'JP',
    'China': 'CN',
    'Brazil': 'BR',
    'India': 'IN',
    'Russia': 'RU',
    'Mexico': 'MX',
    'Netherlands': 'NL',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Switzerland': 'CH',
    'Austria': 'AT',
    'Belgium': 'BE',
    'Poland': 'PL',
    'Czech Republic': 'CZ',
    'Hungary': 'HU',
    'Portugal': 'PT',
    'Greece': 'GR',
    'Turkey': 'TR',
    'South Korea': 'KR',
    'Thailand': 'TH',
    'Singapore': 'SG',
    'Malaysia': 'MY',
    'Indonesia': 'ID',
    'Philippines': 'PH',
    'Vietnam': 'VN',
    'South Africa': 'ZA',
    'Egypt': 'EG',
    'Nigeria': 'NG',
    'Kenya': 'KE',
    'Morocco': 'MA',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'Uruguay': 'UY',
    'Paraguay': 'PY',
    'Bolivia': 'BO',
    'Ecuador': 'EC',
  };

  const countryCode = countryCodeMap[country] || 'UN';

  return (
    <ReactCountryFlag
      countryCode={countryCode}
      svg
      style={{
        width: '1rem',
        height: '1rem',
      }}
      title={country}
    />
  );
}
