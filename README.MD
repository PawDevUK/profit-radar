# Profit Radar

A comprehensive financial management and analytics platform for tracking and optimizing business profitability, with an interactive web dashboard for browsing and analyzing auction listings.

## 📋 Overview

This project consists of multiple tools and a web application:

**Web Application (Next.js):**

- Interactive dashboard for viewing sales and auctions
- Calendar view of upcoming sales with detailed information
- Browsable catalog of cars available in each sale
- Detailed lot pages with comprehensive vehicle information
- Real-time bidding and "Buy It Now" interface

**Backend Tools:**

- Scraping car auction listings from Copart
- Enriching car data with market prices from multiple countries
- Generating interactive HTML reports with price comparisons
- Researching market values across European markets

## 🚀 Quick Start

### Web Application (Next.js)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

**Features:**

- **Dashboard**: Overview of sales and auctions
- **Calendar Page** (`/calendar`): View upcoming sales across California locations
- **Sale Results** (`/saleListResults/[id]`): Browse cars available in each sale
- **Lot Details** (`/saleListResults/[id]/lot/[lotId]`): Comprehensive vehicle information with bidding interface

### Backend Tools (Node.js)

Backend tools for scraping and enriching auction data:

```
scraper/
├── scraper.js                      # Main Copart auction scraper
├── market_price_enricher.js        # Automated market price scraper
├── market_research_helper.js       # Generate research links and templates
├── fetch_single_car.js            # Fetch market data for individual cars
├── generate_html_with_prices.js   # Create HTML reports with price displays
├── package.json                    # Node.js dependencies
├── config.example.js              # Configuration example
└── results/                        # Output directory
    ├── auction_ncs_central_YYYY-MM-DD.json              # Raw auction data
    ├── auction_ncs_central_YYYY-MM-DD_enriched.json     # Data with market prices
    ├── auction_ncs_central_YYYY-MM-DD_with_research_links.json  # With research URLs
    └── auction_ncs_central_YYYY-MM-DD_research_report.html      # Interactive report
```

---

## 📱 Web Application Pages

### Calendar Page (`/calendar`)

Displays all upcoming sales across California locations in a table format.

**Features:**

- Sale name and date
- Number of lots available
- "Buy It Now" opportunities count
- Good deals indicator
- Current and next sale status
- Click any row to view cars for that sale

**Data:**

- 4 California locations: Hayward, Sacramento, San Diego, San Jose
- Live update of auction status

### Sale List Results (`/saleListResults/[id]`)

Browse all cars available in a specific sale.

**Features:**

- Table view of all vehicles
- Lot information and vehicle details
- Condition status (Excellent, Good, Fair)
- Number of bids placed
- Click any car to view full details
- Back navigation to sales calendar

### Lot Details Page (`/saleListResults/[id]/lot/[lotId]`)

Comprehensive view of a specific vehicle with all details.

**Sections:**

- **Sticky Header**: Quick access to current bid and navigation
- **Vehicle Images**: Image gallery placeholder
- **Lot Information**: Lot #, VIN, Lane/Item, Title code
- **Vehicle Details**: Year, Make, Model, Body Type, Color, Transmission, Odometer, Damage
- **Vehicle Report**: Engine start verification, Transmission check
- **Highlights**: Special features and conditions
- **Notes**: Detailed description and condition notes
- **Sale Information**: Sale date, minimum/current bid, Buy It Now price
- **Action Buttons**: Place Bid, Buy It Now, Add to Watchlist
- **Legal Disclaimer**: Binding bid terms

---

## 🔧 Backend Tools & Usage

### 1. Copart Scraper

Scrapes car listings from Copart auction site.

```bash
node scraper.js
```

**Output:** `results/auction_ncs_central_YYYY-MM-DD.json`

**Features:**

- Scrapes auction locations and sale dates
- Extracts car details (make, model, year, price, damage)
- Collects images and detail links
- Saves both JSON and HTML formats

Attempts to automatically fetch market prices using browser automation.

```bash
node market_price_enricher.js
```

**Output:** `results/auction_ncs_central_YYYY-MM-DD_enriched.json`

**Features:**

- Uses Puppeteer for bot detection avoidance
- Searches Poland (Otomoto.pl)
- Searches Germany (Mobile.de)
- Searches Ukraine (Auto.ria)
- Adds average prices and car counts

**Note:** May encounter website anti-bot protection. For best results, use the manual research helper.

### 3. Market Research Helper (Recommended)

Generates research links and templates for manual data entry.

```bash
node market_research_helper.js
```

**Outputs:**

- `results/auction_ncs_central_YYYY-MM-DD_with_research_links.json`
- `results/auction_ncs_central_YYYY-MM-DD_research_report.html`

**Features:**

- Creates clickable links to all market research sites
- Generates structured data templates
- Produces interactive HTML report
- Perfect for manual research workflow

### 4. Fetch Single Car Data

Fetches market data for a specific car (useful for testing or updating individual entries).

```bash
node fetch_single_car.js
```

**Features:**

- Targets specific lot number
- Uses full browser rendering
- Updates enriched JSON file

### 5. Generate HTML Report with Prices

Creates a beautiful interactive HTML report displaying all market prices.

```bash
node generate_html_with_prices.js
```

**Output:** `results/auction_ncs_central_YYYY-MM-DD_research_report.html`

**Features:**

- Visual price cards for each country
- Price comparison indicators (good deal vs. above market)
- Sample prices display
- Total similar cars count
- Direct links to research sites
- Responsive design

## 📊 Data Structure

### Car Object (Enriched)

```jsonunt
Direct links to research sites
Responsive design
📊 Data Structure
Car Object (Enriched)
{
  "lotNumber": "99970785",
  "title": "2019 ford transit refrigerated",
  "price": "$29,850",
  "damage": "Front End",
  "odometer": "54",
  "year": "2019",
  "make": "ford",
  "model": "transit refrigerated",
  "vin": "",
  "imageUrl": "https://...",
  "detailsLink": "https://...",
  "market_data": {
    "poland": {
      "average_price_pln": 89500,
      "count": 127,
      "sample_prices_pln": [95000, 87000, 92000, 85000, 88000]
    },
    "germany": {
      "average_price_eur": 21800,
      "count": 342,
      "sample_prices_eur": [22500, 21000, 23000, 20500, 22200]
    },
    "ukraine": {
      "average_price_uah": 1107000,
      "average_price_usd": 27000,
      "count": 45,
      "sample_prices_usd": [28000, 26500, 27500, 26000, 28500]
    },
    "total_similar_cars_available": 514
  }
}
```

## 🌍 Market Research Sites

### Poland

- **Otomoto.pl** - Largest Polish car marketplace
- **Allegro** - General marketplace with car listings

### Germany

- **Mobile.de** - Leading German car marketplace
- **AutoScout24** - Major European car platform

### Ukraine

- **Auto.ria** - Ukraine's biggest car marketplace

## 🎯 Workflow

### Recommended Process

1. **Scrape auction data**

   ```bash
   node scraper.js
   ```

2. **Generate research helper**

   ```bash
   node market_research_helper.js
   ```

3. **Open HTML report**
   - Open `results/*_research_report.html` in browser
Click links to research each car
Manually fill prices in JSON file
Generate final report with prices

node generate_html_with_prices.js
View results

Open updated results/*_research_report.html
See price comparisons and deal indicators
Alternative: Automated (Less Reliable)
Scrape auction data

node scraper.js
Run automated enricher

node market_price_enricher.js
Note: May fail due to anti-bot protection

Generate HTML report

node generate_html_with_prices.js
💡 Tips
For Better Scraping Results
Run during off-peak hours

- Use residential IP/VPN if blocked
- Add delays between requests
- Consider using proxy services for production

### For Manual Research

- Open multiple tabs to research cars in parallel
- Use browser's built-in translation for foreign sites
- Note any special features or conditions
- Document unusual pricing in the notes field

### Price Conversion Reference

- **PLN to USD**: ÷ 4.1 (approx)
- **EUR to USD**: × 1.09 (approx)
- **UAH to USD**: ÷ 41 (approx)

## ⚙️ Configuration

Copy `config.example.js` to `config.js` and customize:

```javascript
module.exports = {
    headless: false,        // Show browser window
    timeout: 60000,         // Page load timeout
    delay: 2000,           // Delay between requests
    outputDir: './results' // Output directory
};
```

## 🐛 Troubleshooting

### Scraper Issues

**Problem: Browser doesn't launch**

```bash
# Install Chromium manually
npx puppeteer browsers install chrome
```

**Problem: Timeout errors**

- Increase timeout in config
- Check internet connection
- Try non-headless mode to debug

### Market Data Issues

**Problem: Getting 403/404 errors**

- Websites have anti-bot protection
- Use manual research helper instead
- Consider using authenticated sessions

**Problem: No prices found**

- HTML structure may have changed
- Check selectors in code
- Update parsing logic if needed

## 📝 Notes

- **Legal**: Ensure web scraping complies with site's Terms of Service
Rate Limiting: Be respectful to servers, add delays
Data Accuracy: Always verify prices manually for important decisions
Currency Rates: Update conversion rates periodically
🔄 Updates
To update dependencies:

npm update
📧 Support
For issues or questions, review the code comments or create an issue in the repository.

📄 License
ISC License - See package.json for details

Last Updated: January 19, 2026
