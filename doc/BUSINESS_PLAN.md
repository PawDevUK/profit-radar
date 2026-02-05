# ProfitRadar: Business Plan & MVP Roadmap

## Executive Summary

**ProfitRadar** is a car arbitrage intelligence platform that enables importers to identify profitable vehicles from US auctions (Copart, IAA) and compare them to international market prices. The platform calculates real-time profitability across multiple countries, helping users make data-driven import decisions.

**Business Model**: SaaS with market-specific websites (e.g., Importek.pl for Poland)

---

## 1. Market Opportunity

### Market Size
- **US Auto Auction Market**: ~3.5M vehicles annually through Copart/IAA
- **International Car Importers**: Thousands in Poland, Germany, UK, Czech Republic, Netherlands actively sourcing from US auctions
- **Current Problem**: Manual process = time-consuming, error-prone, missed opportunities

### Target Users
- **Primary**: Professional car importers (1-10 vehicles/month)
- **Secondary**: Dealership buyers, auction aggregators
- **Tertiary**: Individual importers (hobbyists)

### Value Proposition
- **Fast Decision Making**: 30-second profitability check vs. 10-minute manual calculation
- **Better Margins**: Data-driven selection = higher profit deals
- **Risk Reduction**: Market data integration = accurate cost prediction
- **Competitive Edge**: Real-time alerts before competitors see deals

---

## 2. ProfitRadar MVP (USA Platform)

### Objective
Create the core engine that:
1. Scrapes Copart auctions in real-time
2. Stores comprehensive lot data (images, specs, VIN, damage assessment)
3. Provides API/UI for market-specific platforms to consume data

### Features (MVP Phase 1)

#### 2.1 Data Collection Layer
- ✅ **Calendar Scraper**: Monthly Copart auctions (DONE)
- ✅ **Sale List Scraper**: Individual auction listings (DONE)
- ✅ **Lot Details Scraper**: Images, VIN, specs, damage (DONE)
- 🔄 **Enhance Data**:
  - Market value estimation (Kelley Blue Book API, NADA Guides)
  - Damage assessment categorization
  - Parts availability analysis
  - Insurance/salvage title risk scoring

#### 2.2 Data Storage
- ✅ Consolidated `auctions.json` structure (DONE)
- 🔄 **Upgrade to Database** (PostgreSQL):
  ```
  - auctions table
  - lots table (cars)
  - lot_images table
  - market_data table (integration points)
  - user_comparisons table (for logged-in users)
  ```

#### 2.3 Core API
```
GET /api/auctions - List all auctions
GET /api/auctions/{id} - Auction details with all lots
GET /api/lots/{id} - Specific lot with images, specs
GET /api/lots/{id}/market-value - Market price estimates
POST /api/lots/{id}/compare - Compare to market prices
```

#### 2.4 Admin Dashboard
- Monitor scraper health
- View error logs
- Auction statistics
- Data quality metrics

### Technical Stack
```
Frontend:
- Next.js 13+ (existing)
- TypeScript (existing)
- Tailwind CSS (existing)

Backend:
- Node.js + Express (for API)
- PostgreSQL (data persistence)
- Redis (caching, job queue)
- Bull (background jobs for scraping)

Infrastructure:
- Vercel (deployment)
- Railway/Render (PostgreSQL)
- Scheduled scraping jobs (cron)
```

### MVP Timeline & Effort
1. **Week 1**: Database schema design & migration
2. **Week 2**: API endpoints development
3. **Week 3**: Enhance scrapers (market value, risk scoring)
4. **Week 4**: Admin dashboard, monitoring
5. **Week 5**: Testing, deployment, documentation

---

## 3. Importek MVP (Poland Market Platform)

### Objective
Country-specific market platform that:
1. Consumes ProfitRadar API for auction data
2. Integrates Polish car market data
3. Calculates profitability for importing to Poland
4. Provides user accounts, saved searches, alerts

### Features (MVP Phase 1)

#### 3.1 Polish Market Integration
**Data Sources**:
- OtomotoAPI (largest Polish car portal)
- AutodnaAPI (market analytics)
- ManualPricing (competitor analysis)
- Polish tax/import fee calculator

**What we extract**:
- Similar car market prices in Poland
- Historical price trends
- Demand/popularity metrics
- Regional price variations (Warsaw vs. provincial)

#### 3.2 Profitability Calculator
```
Profit = Polish Market Price - Total Import Cost

Total Import Cost = 
  + Copart Hammer Price
  + Copart Buyer Fee (13%)
  + Shipping to Port ($800-1200)
  + Ocean Freight USA→Poland ($1500-2500)
  + Polish Customs Duty (10%)
  + Polish VAT (23%)
  + Port Fees & Clearance ($300-500)
  + Registration & Insurance (estimated)
  - Damage Deduction (risk assessment)
  
Risk Multiplier = 0.7-1.0 (based on damage type)
Realistic Profit = (Profit × Risk Multiplier) - 10% contingency
```

#### 3.3 Features
- **Search & Filter**: By make, model, year, damage, price range
- **Profitability View**: 
  - Real-time profit calculation
  - Profit margin %
  - Days to ROI (based on market turnover)
  - Risk rating
- **Lot Details**:
  - Full images from Copart
  - Market comparison (Polish prices for same model)
  - Import logistics info
  - VIN decode (history check integration)
- **User Accounts**:
  - Save favorites
  - Price alerts (email/SMS)
  - Comparison lists
  - Search history
- **Export Reports**:
  - PDF report for financing institutions
  - Cost breakdown
  - Market analysis
  - Shipping logistics timeline

#### 3.4 Monetization (Future)
- **Freemium**: Limited alerts (5/month free, then paid)
- **Pro Subscription**: $9.99/month (unlimited alerts, saved lists, export reports)
- **Premium**: $29.99/month (priority alerts, API access, white-label option)
- **Enterprise**: Custom pricing (fleet importers, dealerships)

### Technical Stack
```
Frontend:
- Next.js 13+ (market page, dashboard)
- TypeScript
- Tailwind CSS + custom styling (Polish branding)
- React Query (data fetching)
- Zustand (state management)

Backend:
- ProfitRadar API (consumed)
- Supabase/Firebase (user auth)
- Stripe (payments)
- SendGrid (email alerts)
- Twilio (SMS alerts)
- External APIs:
  - OtomotoAPI
  - AutodnaAPI
  - VIN decoder API (carDomain)
  - UPS/FedEx shipping API

Infrastructure:
- Vercel (Next.js deployment)
- Supabase (Postgres + Auth)
- Stripe webhooks
```

### Importek MVP Timeline
1. **Week 1-2**: Design UI/UX, set up project structure
2. **Week 3**: Polish market API integrations
3. **Week 4**: Profitability calculator logic
4. **Week 5**: User authentication (Supabase)
5. **Week 6**: Alerts & notifications system
6. **Week 7**: Testing, refinement, deployment
7. **Week 8**: Marketing prep, beta users

---

## 4. Detailed Implementation Roadmap

### Phase 1: ProfitRadar MVP (4-5 weeks)
```
Week 1: Database & API Foundation
├── PostgreSQL schema design
├── Prisma ORM setup
├── Basic CRUD endpoints
└── Deployment setup

Week 2: Data Enhancement
├── Market value APIs (KBB, NADA)
├── Enhanced scraper output
├── Data enrichment pipeline
└── API v1.0 complete

Week 3: Monitoring & Admin
├── Admin dashboard
├── Error tracking (Sentry)
├── Health monitoring
└── Scraper job management

Week 4: Testing & Documentation
├── Unit tests
├── Integration tests
├── API documentation (Swagger)
└── Deployment & go-live
```

### Phase 2: Importek MVP (7-8 weeks)
```
Week 1-2: Project Setup & Design
├── Market research (Polish importers)
├── UI/UX design
├── Technical architecture
└── API specifications

Week 3: Core Features
├── Auction listing page
├── Search & filters
├── Profitability calculator
└── Lot detail page

Week 4: User System
├── Supabase auth setup
├── User dashboard
├── Saved lists
└── Profile settings

Week 5: Alerts & Notifications
├── Alert logic
├── Email integration (SendGrid)
├── SMS alerts (Twilio)
└── User preferences

Week 6: Polish Market Integration
├── OtomotoAPI integration
├── Price comparison
├── Demand metrics
└── Regional analysis

Week 7: Testing & Polish
├── End-to-end testing
├── Performance optimization
├── Bug fixes
└── User feedback iteration

Week 8: Launch Prep
├── Marketing materials
├── Beta user recruitment
├── Documentation
└── Production deployment
```

---

## 5. Success Metrics (MVP)

### ProfitRadar KPIs
- Scraper uptime: >95%
- Data freshness: <1 hour delay
- API response time: <200ms
- Auction coverage: 100% of target markets
- Data accuracy: >98%

### Importek KPIs (First 3 months)
- Beta users: 50-100
- Daily active users: 20+
- Conversion to paid: 15%+
- Average session time: >5 min
- User satisfaction: 4.5+/5 stars

---

## 6. Competitive Landscape

### Direct Competitors
- **Autotager**: US auction aggregator (no international focus)
- **Copart/IAA Direct**: Official platforms (limited features)

### Indirect Competitors
- **Manual spreadsheets**: Current user method
- **Facebook groups**: Information sharing

### Competitive Advantage
1. **Automated profitability**: Saves 10+ min per vehicle
2. **Multi-country expansion**: Can scale to 5+ markets
3. **Integrated market data**: Not just auctions, but market prices
4. **Risk assessment**: Damage analysis + local market knowledge
5. **User network**: Importers learning from each other

---

## 7. Revenue Projections (Year 1)

### Conservative Scenario
- 500 active users in Poland
- 10% conversion to Pro ($9.99/month)
- 50 Enterprise customers ($200/month)

**Monthly Revenue**: (500 × 0.1 × $9.99) + (50 × $200) = **$10,495**
**Annual Revenue**: **~$120K**

### Optimistic Scenario
- 2,000 active users in Poland
- 20% conversion to Pro
- 200 Enterprise customers

**Monthly Revenue**: (2000 × 0.2 × $9.99) + (200 × $200) = **$43,980**
**Annual Revenue**: **~$530K**

---

## 8. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **CAPTCHA blocking** | High | Rotating proxies, request throttling, proxy service |
| **Copart API changes** | Medium | Monitor changes, version API, fallback scrapers |
| **Market saturation** | Medium | Expand to 5+ countries, add unique features |
| **User acquisition** | Medium | Partner with importers, Facebook ads, SEO |
| **Payment/legal (Poland)** | Low | Consult lawyer, GDPR compliance, proper T&Cs |
| **Data accuracy** | Medium | Validation logic, user feedback loop, manual reviews |

---

## 9. Go-to-Market Strategy

### Phase 1: Beta Launch (Month 2-3)
1. Recruit 30-50 beta users from Polish importer communities
2. Gather feedback, iterate
3. Fix critical bugs
4. Build testimonials

### Phase 2: Soft Launch (Month 4)
1. Launch Importek.pl publicly
2. SEO optimization (target "kopart do polski", "import aut z usa")
3. Content marketing (blog about car imports)
4. Facebook group engagement

### Phase 3: Paid Marketing (Month 5+)
1. Google Ads (high-intent keywords)
2. Facebook Ads (targeting importers)
3. Partner affiliates (logistics companies, dealerships)
4. Email marketing (users → Pro conversion)

---

## 10. Next Steps (Immediate Actions)

### This Week
1. ✅ Finalize ProfitRadar MVP scope
2. ⬜ Create database schema design
3. ⬜ Set up PostgreSQL & Prisma
4. ⬜ Plan API endpoints

### Next 2 Weeks
1. ⬜ Build API endpoints
2. ⬜ Enhance scraper with market value data
3. ⬜ Create admin dashboard
4. ⬜ Deploy ProfitRadar v1.0

### Following Week
1. ⬜ Start Importek project
2. ⬜ Polish market research
3. ⬜ UI/UX design
4. ⬜ API integrations (OtomotoAPI, VIN decoder)

---

## 11. Resources Needed

### Development (Existing)
- Your dev skills ✓

### Infrastructure Costs (Estimated)
| Service | Cost/Month | Purpose |
|---------|-----------|---------|
| PostgreSQL (Railway) | $20 | Data storage |
| Vercel Pro | $20 | Hosting, CI/CD |
| Redis (Upstash) | $10 | Caching, job queue |
| Email (SendGrid) | $10 | Alerts, notifications |
| APIs (OtomotoAPI, etc) | $50-100 | Market data |
| VPS/Proxy (anti-CAPTCHA) | $30-50 | Scraping infrastructure |
| **Total** | **$140-190** | Monthly |

### Optional (Scale later)
- SMS service (Twilio): $0.01-0.05 per message
- Payment processor (Stripe): 2.9% + $0.30 per transaction
- Monitoring (Sentry): $0-25/month

---

## Conclusion

**ProfitRadar** is a viable 2-sided marketplace play with clear market opportunity. The MVP is achievable in 4-5 weeks with existing tech stack. **Importek** follows as proof-of-concept for international expansion.

**Key Success Factors**:
1. Reliable scraping (solve CAPTCHA issue)
2. Accurate profitability math
3. User acquisition from importer community
4. Rapid iteration based on feedback
5. Expand to 3-5 countries within 6 months

**Estimated Timeline to First Revenue**: 3-4 months (Importek launch)

---

**Ready to build? Let's start with ProfitRadar Phase 1! 🚀**
