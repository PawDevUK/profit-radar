# ProfitRadar 🚗💰

> A comprehensive car arbitrage intelligence platform for identifying profitable vehicles from US auctions and comparing them to international market prices.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

**ProfitRadar** is a modern Next.js application with advanced web scraping capabilities designed for professional car importers, dealership buyers, and auction aggregators. The platform automates the process of tracking Copart auctions, analyzing lot details, and calculating real-time profitability across multiple markets.

### Key Capabilities

- 📅 **Auction Calendar Tracking** - Monitor 275+ auction locations across 11 countries
- 🔍 **Smart Vehicle Search** - Filter 500,000+ vehicles by condition, location, and specifications
- 📊 **Sale List Management** - Detailed tracking of auction listings with real-time updates
- 🖼️ **Lot Details & Images** - Comprehensive vehicle information with image galleries
- 🤖 **AI-Powered Parsing** - Intelligent title parsing for accurate vehicle identification
- 💱 **Market Analysis** - Cross-market price comparison and profitability calculations
- 🔄 **Automated Scraping** - Background jobs with anti-bot detection strategies

## ✨ Features

### Core Features

- ✅ **Calendar View** - Browse monthly auction schedules with sale dates and locations
- ✅ **Sale List Browser** - View detailed auction listings with vehicle photos and specifications
- ✅ **Lot Details Page** - Comprehensive vehicle information including:
  - VIN, year, make, model, trim
  - Engine and transmission status
  - Odometer readings and condition
  - Damage assessment and title status
  - High-resolution image gallery
  - Current bid and Buy It Now prices
  - Auction countdown timers
- ✅ **Dashboard** - Platform metrics and invoice tracking
- ✅ **Inventory Search** - Advanced filtering and search capabilities
- ✅ **Otomoto Integration** - Price comparison with Polish automotive market
- ✅ **Image Proxy** - Secure image loading and caching
- ✅ **Responsive Design** - Mobile-first UI with Tailwind CSS

### Advanced Features

- 🔐 **Authentication System** - localStorage-based demo auth (production upgrade planned)
- 🗄️ **MongoDB Integration** - Persistent storage for calendar and auction data
- 🤖 **AI Title Parser** - GPT-powered vehicle title parsing with fallback regex
- 🌐 **Proxy Support** - Residential proxy configuration for bot detection avoidance
- 📸 **DOM Snapshots** - Debugging tools for scraper troubleshooting
- 🔄 **Incremental Updates** - Smart data merging for existing auction listings

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**:
  - Lucide React (icons)
  - Custom components (CollapseCard, StatCard, Navigation)
- **Font**: Roboto (Google Fonts)
- **State Management**: React hooks, SWR for data fetching

### Backend

- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes
- **Database**: MongoDB 6.21+ with Mongoose 8.21+
- **Scraping**:
  - Puppeteer 22.13+ (browser automation)
  - Playwright 1.57+ (alternative scraper)
  - Puppeteer-extra with stealth plugin (bot detection avoidance)

### DevTools

- **Build Tool**: Next.js with Turbopack
- **Package Manager**: npm/yarn
- **Type Checking**: TypeScript with strict mode
- **Linting**: ESLint with Next.js config
- **Runtime**: tsx for TypeScript execution

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- MongoDB instance (local or cloud)
- OpenAI API key (optional, for AI title parsing)
- Residential proxy (recommended for production scraping)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/ProfitRadar.git
   cd ProfitRadar
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Edit with your configuration
   nano .env.local
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open browser**

   ```
   http://localhost:3000
   ```

### Quick Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Scraping
npm run scraper          # Run CLI scraper (requires lib/cli.ts)
npm run scrape:calendar  # Scrape auction calendar
npm run scrape:sales     # Scrape sale lists
npm run scrape:all       # Run all scrapers
```

## 📁 Project Structure

```
ProfitRadar/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auctions/            # Auction data endpoints
│   │   ├── copart/              # Copart scraping APIs
│   │   │   ├── scrape-calendar/
│   │   │   ├── scrape-sale-list/
│   │   │   ├── scrape-lot-details/
│   │   │   ├── parse-title/
│   │   │   └── image-proxy/
│   │   └── otomoto/             # Otomoto integration
│   ├── calendar/                # Calendar view page
│   ├── saleListResults/         # Sale list and lot details
│   │   └── [id]/
│   │       ├── page.tsx         # Sale list page
│   │       └── lot/[lotId]/     # Lot details page
│   ├── dashboard/               # Metrics dashboard
│   ├── inventory/               # Inventory search
│   ├── howItWorks/              # Landing/info page
│   ├── components/              # Shared UI components
│   │   ├── common/              # Reusable components
│   │   ├── calendar/            # Calendar components
│   │   ├── header/              # Navigation
│   │   ├── footer/              # Footer
│   │   └── search/              # Search UI
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home (redirects)
│   └── globals.css              # Global styles
├── lib/                          # Core libraries
│   ├── scrapers/                # Web scraping modules
│   │   ├── copart/              # Copart scrapers
│   │   │   ├── calendar/        # Calendar scraper
│   │   │   ├── saleList/        # Sale list scraper
│   │   │   └── lot/             # Lot details scraper
│   │   ├── otomoto/             # Otomoto checker
│   │   ├── proxy/               # Proxy configuration
│   │   ├── test/                # Testing utilities
│   │   └── tools/               # Scraper tools
│   ├── db/                      # Database layer
│   │   ├── db.ts                # MongoDB connection & schemas
│   │   ├── models.ts            # (placeholder)
│   │   └── schema.ts            # (placeholder)
│   ├── types/                   # TypeScript definitions
│   │   ├── calendar.ts          # Calendar types
│   │   ├── saleList.ts          # Sale list types
│   │   └── lot-details.ts       # Lot details types
│   ├── ai-title-parser.ts       # AI parsing logic
│   ├── auth.ts                  # Demo authentication
│   ├── metrics.ts               # Dashboard metrics
│   ├── platforms.ts             # Platform definitions
│   └── cli.ts                   # CLI entry (pending)
├── doc/                          # Documentation
│   ├── AI_PARSER_README.md      # AI parser guide
│   ├── BUSINESS_PLAN.md         # Business strategy
│   ├── DataBase.md              # DB structure
│   ├── fetchingData.md          # Data fetching notes
│   ├── REVENUE_MODEL.md         # Revenue strategy
│   ├── Market-Value-and-Potential-Report.md
│   └── Scraper-Refresh-Report.md
├── results/                      # Scraper outputs
│   ├── auctions.json            # Consolidated auctions
│   ├── calendar_February.json   # Monthly calendar
│   └── calendar_March.json      # Monthly calendar
├── public/                       # Static assets
├── img/                          # Image exports
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
├── tailwind.config.js           # Tailwind config
├── eslint.config.mjs            # ESLint config
├── plan.md                      # Project planning
├── TIMELINE.md                  # Development timeline
└── README.md                    # This file
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB (Required for persistence)
MONGODB_URI=mongodb://localhost:27017/profit_radar
MONGODB_DB=profit_radar

# OpenAI (Optional, for AI title parsing)
OPENAI_API_KEY=sk-your-openai-key-here

# Copart Configuration
COPART_CALENDAR_URL=https://www.copart.com/calendar

# Proxy Configuration (Strongly recommended for production)
PROXY_HOST=your-proxy-host.com
PROXY_PORT=8080
PROXY_USERNAME=your-username
PROXY_PASSWORD=your-password

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### MongoDB Setup

The application uses MongoDB with Mongoose for data persistence. Schema structure:

- **CalendarMonth**: Stores monthly auction calendars
- **CalendarAuction**: Individual auction metadata
- **SaleList**: Vehicle listings with nested lot details
- **LotDetails**: Comprehensive vehicle information

See [doc/DataBase.md](doc/DataBase.md) for detailed schema documentation.

### Proxy Configuration

For production scraping, configure a residential proxy to avoid bot detection:

1. Add proxy credentials to `.env.local`
2. Configure in `lib/scrapers/proxy/proxy-config.ts`
3. Test with diagnostic tools in `lib/scrapers/test/`

See [doc/PROXY_SETUP.md](doc/PROXY_SETUP.md) for detailed setup instructions.

## 📡 API Documentation

### Auction Endpoints

#### `GET /api/auctions`

Get list of all scraped auctions.

**Query Parameters:**

- `auctionId` (optional): Filter by specific auction ID

**Response:**

```json
{
  "auctionId": "TX-HOUSTON-2026-02",
  "location": "TX - HOUSTON",
  "viewSalesLink": "https://...",
  "scrapedAt": "2026-02-03T...",
  "numberOnSale": 150,
  "cars": [/* SaleList[] */]
}
```

### Copart Scraping Endpoints

#### `POST /api/copart/scrape-calendar`

Scrape monthly auction calendar.

**Request Body:**

```json
{
  "month": "February",
  "year": 2026
}
```

#### `POST /api/copart/scrape-sale-list`

Scrape sale list for a specific auction.

**Request Body:**

```json
{
  "auctionUrl": "https://www.copart.com/...",
  "auctionId": "TX-HOUSTON-2026-02",
  "location": "TX - HOUSTON"
}
```

#### `POST /api/copart/scrape-lot-details`

Scrape detailed information for a specific lot.

**Request Body:**

```json
{
  "lotNumber": 12345678,
  "auctionId": "TX-HOUSTON-2026-02"
}
```

#### `POST /api/copart/parse-title`

Parse vehicle title using AI or regex.

**Request Body:**

```json
{
  "title": "2017 FORD TRANSIT T-150"
}
```

**Response:**

```json
{
  "year": "2017",
  "make": "Ford",
  "model": "Transit",
  "trim": "T-150",
  "bodyType": "Van"
}
```

#### `GET /api/copart/image-proxy`

Proxy images from Copart with caching.

**Query Parameters:**

- `url`: Image URL to proxy

### Otomoto Endpoints

#### `POST /api/otomoto/otomoto-checker`

Check vehicle prices on Otomoto.pl

#### `POST /api/otomoto/otomoto-listing-check`

Verify listing existence and details

See [doc/API.md](doc/API.md) for complete API reference.

## 💻 Development

### Running Locally

```bash
# Start development server
npm run dev

# In another terminal, run scrapers
npm run scraper -- --task calendar

# Build for production
npm run build

# Start production server
npm run start
```

### Type System

The project uses strict TypeScript. Key types:

- `CalendarAuction`: Auction metadata
- `SaleList`: Vehicle listing with optional details
- `LotDetails`: Comprehensive vehicle specs
- `Platform`, `Invoice`: Dashboard types

### Component Architecture

- **Pages**: Server components with async data fetching
- **Client Components**: Interactive UI marked with 'use client'
- **API Routes**: Serverless functions under `app/api/`
- **Shared Components**: Reusable UI in `app/components/`

### Scraping Strategy

1. **Calendar Scraper**: Runs monthly to fetch auction schedules
2. **Sale List Scraper**: Triggered per auction, scrapes vehicle listings
3. **Lot Details Scraper**: Fetches comprehensive data per vehicle
4. **Incremental Updates**: Smart merging of new data with existing records

## 🌐 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Add environment variables in dashboard
3. Deploy automatically on push

### Traditional Hosting

```bash
npm run build
npm run start
```

Configure reverse proxy (nginx/Apache) for production.

## 📚 Documentation

- **[Business Plan](doc/BUSINESS_PLAN.md)** - Business model and MVP roadmap
- **[Database Structure](doc/DataBase.md)** - MongoDB schema documentation
- **[AI Parser Guide](doc/AI_PARSER_README.md)** - AI-powered title parsing
- **[Revenue Model](doc/REVENUE_MODEL.md)** - Monetization strategy
- **[Market Analysis](doc/Market-Value-and-Potential-Report.md)** - Market opportunity
- **[Scraper Report](doc/Scraper-Refresh-Report.md)** - Scraping architecture
- **[Data Fetching](doc/fetchingData.md)** - API integration patterns

## 🐛 Troubleshooting

### Empty Tables (0 rows)

**Problem**: Copart scraper returns no data

**Solutions**:

1. Configure residential proxy (see [doc/PROXY_SETUP.md](doc/PROXY_SETUP.md))
2. Run diagnostics: `lib/scrapers/test/`
3. Check DOM snapshots: `lib/scrapers/tools/dom-snapshot.mjs`
4. Update selectors if Copart changed their HTML structure

### MongoDB Connection Errors

**Problem**: Cannot connect to database

**Solutions**:

1. Verify `MONGODB_URI` in `.env.local`
2. Check MongoDB server is running
3. Verify network connectivity and firewall rules
4. Use `mongodb://localhost:27017` for local development

### Proxy Detection

**Problem**: Bot detection blocks scraping

**Solutions**:

1. Use residential proxies (not datacenter)
2. Enable stealth plugin (already configured)
3. Add random delays between requests
4. Rotate user agents
5. Use headful mode for debugging

### TypeScript Errors

**Problem**: Type mismatches after updates

**Solutions**:

```bash
# Rebuild TypeScript
npm run build

# Check types
npx tsc --noEmit

# Update type definitions
npm install @types/node@latest @types/react@latest
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for public APIs
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team & Contact

- **Project Lead**: [Your Name]
- **Email**: <contact@profitradar.com>
- **Website**: <https://profitradar.com>

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Puppeteer and Playwright teams
- OpenAI for GPT API
- Tailwind CSS for styling utilities

---

**Last Updated**: March 3, 2026

Made with ❤️ by the ProfitRadar team
