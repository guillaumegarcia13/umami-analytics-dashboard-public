# Data Mode Configuration

This project supports two data modes: **Mock Data** and **Real API Data**.

## Available NPM Scripts

### Development Scripts
- `npm run dev:mock` - Run development server with mock data
- `npm run dev:real` - Run development server with real API data
- `npm run dev` - Default development server (uses mock data by default)

### Build Scripts
- `npm run build:mock` - Build for production with mock data
- `npm run build:real` - Build for production with real API data
- `npm run build` - Default build (uses mock data by default)

## How It Works

The application uses the `VITE_USE_MOCK_DATA` environment variable to determine which data source to use:

- `VITE_USE_MOCK_DATA=true` → Uses mock data from `src/utils/mockData.ts`
- `VITE_USE_MOCK_DATA=false` → Uses real API calls via `src/api/client`

## Environment Variables

### Option 1: Create a `.env` file (Recommended)
Create a `.env` file in the project root:

```bash
# Umami Analytics Dashboard Environment Variables
VITE_UMAMI_API_URL=https://api.umami.is/v1
VITE_UMAMI_API_KEY=your_actual_api_key_here
VITE_UMAMI_WEBSITE_ID=your_actual_website_id_here
VITE_USE_MOCK_DATA=false
```

**Note:** The `.env` file is automatically loaded by Vite and should be added to `.gitignore` to keep your secrets secure.

### Option 2: Set environment variables in your shell
```bash
# For Windows (Command Prompt)
set VITE_UMAMI_API_URL=https://api.umami.is/v1
set VITE_UMAMI_API_KEY=your_api_key_here
set VITE_UMAMI_WEBSITE_ID=your_website_id_here
set VITE_USE_MOCK_DATA=false
npm run dev:real

# For Windows (PowerShell)
$env:VITE_UMAMI_API_URL="https://api.umami.is/v1"
$env:VITE_UMAMI_API_KEY="your_api_key_here"
$env:VITE_UMAMI_WEBSITE_ID="your_website_id_here"
$env:VITE_USE_MOCK_DATA="false"
npm run dev:real

# For Linux/Mac
export VITE_UMAMI_API_URL=https://api.umami.is/v1
export VITE_UMAMI_API_KEY=your_api_key_here
export VITE_UMAMI_WEBSITE_ID=your_website_id_here
export VITE_USE_MOCK_DATA=false
npm run dev:real
```

## Switching Between Modes

### For Development

**Use Mock Data:**
```bash
npm run dev:mock
```

**Use Real API Data:**
```bash
npm run dev:real
```

### For Production

**Build with Mock Data:**
```bash
npm run build:mock
```

**Build with Real API Data:**
```bash
npm run build:real
```

## Mock Data Features

When using mock data (`dev:mock`), the application will:

- Use predefined session data from `src/utils/mockData.ts`
- Generate additional random sessions for pagination
- Simulate loading delays (500ms)
- Show realistic browser, OS, device, and location data
- Display sample analytics without requiring a real Umami API

## Real API Features

When using real API data (`dev:real`), the application will:

- Make actual HTTP requests to your Umami API
- Use your configured `VITE_UMAMI_API_URL`, `VITE_UMAMI_API_KEY`, and `VITE_UMAMI_WEBSITE_ID`
- Display real analytics data from your Umami instance
- Require a properly configured Umami API endpoint
- API requests will follow the format: `https://api.umami.is/v1/websites/{WEBSITE_ID}/stats?startAt={epoch_timestamp}&endAt={epoch_timestamp}`
- Authentication uses the `x-umami-api-key` header (not standard Bearer token)
- Date parameters must be epoch timestamps (milliseconds since Unix epoch), not date strings

## Configuration Files

- `src/config/environment.ts` - Environment configuration and helpers
- `src/utils/mockData.ts` - Mock data definitions and generators
- `src/api/hooks/useSessions.ts` - Updated to support both data modes
- `env.example` - Environment variables template

## Current Implementation

Currently, only the **sessions data** supports both mock and real modes. Other API hooks (`useWebsites`, `useEvents`, `useAuth`) are configured to use the real API directly.

To extend mock data support to other features, update the respective hooks to check `shouldUseMockData()` from `src/config/environment.ts`.
