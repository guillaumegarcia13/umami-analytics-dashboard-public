# Umami Analytics Dashboard

A modern, responsive analytics dashboard built with React, TypeScript, and Tailwind CSS. This project replicates the Umami analytics interface with enhanced UI components and modern design patterns.

## 🚀 Features

- **Modern UI Design** - Dark theme with responsive layout
- **Session Analytics** - Comprehensive session tracking and statistics
- **Interactive Components** - Hover effects, transitions, and smooth animations
- **Avatar System** - DiceBear Lorelei avatars for consistent user representation
- **Country Flags** - Professional SVG flags using react-country-flag
- **Icon System** - Phosphor Icons for consistent iconography
- **TypeScript** - Full type safety and IntelliSense support
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Mock Data** - Realistic data generation for development

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, PostCSS
- **Icons**: Phosphor Icons, react-country-flag
- **Avatars**: DiceBear Lorelei collection
- **Build Tool**: Vite with React plugin
- **Linting**: ESLint with TypeScript support

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/guillaumegarcia13/umami-analytics-dashboard.git
cd umami-analytics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Build

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── api/                    # API layer
│   ├── client/            # HTTP client
│   ├── config/            # API configuration
│   ├── hooks/             # React hooks for data fetching
│   └── types/             # TypeScript type definitions
├── components/            # React components
│   ├── SessionStats.tsx   # Statistics panels
│   ├── SessionsTable.tsx  # Main data table
│   ├── SessionAvatar.tsx  # DiceBear avatar component
│   ├── CountryFlag.tsx    # Country flag component
│   └── ...               # Other UI components
├── utils/                 # Utility functions
│   └── mockData.ts       # Mock data generation
└── App.tsx               # Main application component
```

## 🎨 Components

### SessionStats
Responsive statistics panels displaying:
- Total Sessions
- Active Sessions  
- Total Visits
- Total Views

### SessionsTable
Comprehensive data table with:
- User avatars (DiceBear Lorelei)
- Country flags (react-country-flag)
- Browser, OS, and device icons (Phosphor Icons)
- Responsive design with hover effects

### SessionAvatar
Consistent avatar generation using DiceBear Lorelei:
- Same session ID = same avatar
- Pastel color backgrounds
- Circular design
- SVG-based for crisp rendering

## 🔧 Configuration

### Environment Variables
Create a `.env` file based on `env.example`:

```env
VITE_UMAMI_API_URL=https://your-umami-instance.com
VITE_UMAMI_API_KEY=your-api-key
```

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configuration in `tailwind.config.js`.

### TypeScript
Strict TypeScript configuration with:
- Strict mode enabled
- Force consistent casing
- No unused variables/parameters

## 📱 Responsive Design

- **Mobile**: 2-column statistics grid
- **Desktop**: 4-column statistics grid
- **Table**: Horizontal scroll on small screens
- **Icons**: Consistent sizing across all breakpoints

## 🎯 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Consistent code formatting
- Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Umami](https://umami.is/) - Original analytics platform
- [DiceBear](https://dicebear.com/) - Avatar generation
- [Phosphor Icons](https://phosphoricons.com/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React](https://react.dev/) - UI library

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS