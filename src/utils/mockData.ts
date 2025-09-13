// Données de test pour reproduire l'interface Umami

export interface MockSession {
  id: string;
  sessionId: string;
  visits: number;
  views: number;
  country: string;
  city: string;
  browser: string;
  os: string;
  device: string;
  lastSeen: string;
  avatarColor: string;
}

export const mockSessions: MockSession[] = [
  {
    id: '1',
    sessionId: 'sess_001',
    visits: 3,
    views: 9,
    country: 'France',
    city: 'Paris',
    browser: 'Chrome',
    os: 'Windows 10/11',
    device: 'Laptop',
    lastSeen: '2024-09-13T22:55:52Z',
    avatarColor: 'bg-green-500',
  },
  {
    id: '2',
    sessionId: 'sess_002',
    visits: 1,
    views: 2,
    country: 'France',
    city: 'Paris',
    browser: 'iOS',
    os: 'iOS',
    device: 'Mobile',
    lastSeen: '2024-09-13T22:43:19Z',
    avatarColor: 'bg-pink-500',
  },
  {
    id: '3',
    sessionId: 'sess_003',
    visits: 2,
    views: 13,
    country: 'France',
    city: 'Paris',
    browser: 'Chrome',
    os: 'Android',
    device: 'Mobile',
    lastSeen: '2024-09-13T22:07:28Z',
    avatarColor: 'bg-blue-500',
  },
  {
    id: '4',
    sessionId: 'sess_004',
    visits: 1,
    views: 2,
    country: 'France',
    city: 'Châtillon',
    browser: 'iOS',
    os: 'iOS',
    device: 'Mobile',
    lastSeen: '2024-09-13T19:35:02Z',
    avatarColor: 'bg-blue-400',
  },
  {
    id: '5',
    sessionId: 'sess_005',
    visits: 3,
    views: 29,
    country: 'France',
    city: 'Paris',
    browser: 'Chrome',
    os: 'Android',
    device: 'Mobile',
    lastSeen: '2024-09-13T17:48:53Z',
    avatarColor: 'bg-gray-500',
  },
  {
    id: '6',
    sessionId: 'sess_006',
    visits: 2,
    views: 40,
    country: 'France',
    city: 'Paris',
    browser: 'iOS',
    os: 'iOS',
    device: 'Mobile',
    lastSeen: '2024-09-13T17:21:25Z',
    avatarColor: 'bg-purple-500',
  },
];

export function generateMockSessions(count: number = 6): MockSession[] {
  const countries = [
    'France', 'United States', 'Germany', 'United Kingdom', 'Spain', 'Italy',
    'Canada', 'Australia', 'Japan', 'China', 'Brazil', 'India', 'Russia',
    'Mexico', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Switzerland', 'Austria', 'Belgium', 'Poland', 'Czech Republic', 'Hungary',
    'Portugal', 'Greece', 'Turkey', 'South Korea', 'Thailand', 'Singapore',
    'Malaysia', 'Indonesia', 'Philippines', 'Vietnam', 'South Africa', 'Egypt',
    'Nigeria', 'Kenya', 'Morocco', 'Argentina', 'Chile', 'Colombia', 'Peru'
  ];
  const cities = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Châtillon',
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
    'Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart',
    'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds',
    'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga',
    'Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa',
    'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton',
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast',
    'Tokyo', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe',
    'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou',
    'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte',
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
    'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod'
  ];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'iOS', 'Opera', 'Brave'];
  const operatingSystems = ['Windows 10/11', 'macOS', 'Linux', 'iOS', 'Android', 'Windows 7', 'Ubuntu'];
  const devices = ['Laptop', 'Mobile', 'Tablet', 'Desktop', 'Watch', 'TV'];
  const avatarColors = ['bg-green-500', 'bg-pink-500', 'bg-blue-500', 'bg-purple-500', 'bg-gray-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500', 'bg-cyan-500', 'bg-emerald-500'];

  return Array.from({ length: count }, (_, index) => {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    // Générer une date aléatoire dans les dernières 24h
    const now = new Date();
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const lastSeen = new Date(now.getTime() - (randomHours * 60 + randomMinutes) * 60 * 1000);

    return {
      id: `mock_${index + 1}`,
      sessionId: `sess_${String(index + 1).padStart(3, '0')}`,
      visits: Math.floor(Math.random() * 5) + 1,
      views: Math.floor(Math.random() * 50) + 1,
      country,
      city,
      browser,
      os,
      device,
      lastSeen: lastSeen.toISOString(),
      avatarColor,
    };
  });
}
