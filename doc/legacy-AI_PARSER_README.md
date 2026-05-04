# AI Title Parser

> **Note:** This document describes the title parser implemented in `lib/ai-title-parser.ts`. The parser calls OpenAI's API directly via `fetch`. The project also has `@ai-sdk/xai` installed for xAI/Grok access, used separately in other AI features.

AI-powered car title parser that extracts year, make, model, trim, and body type from raw Copart lot titles.

## Features

- **AI Parsing**: Calls OpenAI `gpt-3.5-turbo` to understand car nomenclature
- **Trim Separation**: Correctly identifies trim levels (EX, LT, T-150, XLT, etc.)
- **Body Type Detection**: Recognises vehicle types (Sedan, SUV, Van, Truck)
- **Fallback Parser**: Regex-based fallback when `OPENAI_API_KEY` is not set
- **Batch Processing**: Parse multiple titles with rate limiting
- **Car Data Enhancement**: Accepts full car objects and enriches them with parsed fields

## Setup

Add to `.env.local`:

```env
OPENAI_API_KEY=sk-...your-key-here
```

No additional npm dependencies needed — uses native `fetch`.

## Usage

### Single Title Parsing

```typescript
import { parseCarTitleWithAI } from '@/lib/ai-title-parser';

const parsed = await parseCarTitleWithAI('2017 ford transit t-150');

console.log(parsed);
// Output:
// {
//   year: "2017",
//   make: "Ford",
//   model: "Transit",
//   trim: "T-150",
//   bodyType: "Van",
//   rawTitle: "2017 ford transit t-150"
// }
```

### Batch Title Parsing

```typescript
import { batchParseCarTitles } from '@/lib/ai-title-parser';

const titles = [
 '2017 ford transit t-150',
 '2020 kia telluride ex',
 '2014 FORD E150 UTILITY / SERVICE VAN',
];

const results = await batchParseCarTitles(titles);
```

### Enhance Car Data

```typescript
import { enhanceCarDataWithAIParsing } from '@/lib/ai-title-parser';

const cars = [
 { lotInv: '12345', title: '2017 ford transit t-150', price: '$10,000' },
 { lotInv: '12346', title: '2020 kia telluride ex', price: '$25,000' },
];

const enhanced = await enhanceCarDataWithAIParsing(cars);

// Each car now has accurate year, make, model, trim, bodyType fields
```

### API Endpoint

```bash
# Parse single title
curl -X POST http://localhost:3000/api/parse-title \
  -H "Content-Type: application/json" \
  -d '{"title":"2017 ford transit t-150"}'

# Parse multiple titles
curl -X POST http://localhost:3000/api/parse-title \
  -H "Content-Type: application/json" \
  -d '{"titles":["2017 ford transit t-150","2020 kia telluride ex"]}'

# Enhance car data
curl -X POST http://localhost:3000/api/parse-title \
  -H "Content-Type: application/json" \
  -d '{"cars":[{"title":"2017 ford transit t-150","price":"$10,000"}]}'
```

## Testing

```bash
# Test the AI parser with sample titles
npx tsx lib/scrapers/test/test-ai-parser.ts
```

## Examples

| Input Title | Year | Make | Model | Trim | Body Type |
|-------------|------|------|-------|------|-----------|
| `2017 ford transit t-150` | 2017 | Ford | Transit | T-150 | Van |
| `2020 kia telluride ex` | 2020 | Kia | Telluride | EX | SUV |
| `2014 FORD E150 UTILITY / SERVICE VAN` | 2014 | Ford | E-150 | - | Van |
| `2019 CHEVROLET SILVERADO 1500 LT CREW CAB` | 2019 | Chevrolet | Silverado 1500 | LT | Truck |
| `2021 BMW 3 SERIES 330i xDrive` | 2021 | BMW | 3 Series | 330i xDrive | Sedan |
| `2023 ford f350 super duty` | 2023 | Ford | F-350 Super Duty | - | Truck |

## Integration with Scraper

### Option 1: Post-processing

After scraping, enhance the data:

```typescript
import { enhanceCarDataWithAIParsing } from '@/lib/ai-title-parser';

// After scraping
const scrapedCars = await scraper.scrapeAuctionCars();

// Enhance with AI parsing
const enhancedCars = await enhanceCarDataWithAIParsing(scrapedCars);

// Save enhanced data
fs.writeFileSync('results.json', JSON.stringify(enhancedCars, null, 2));
```

### Option 2: Real-time parsing

Parse as you scrape:

```typescript
import { parseCarTitleWithAI } from '@/lib/ai-title-parser';

// In your scraper
for (const car of cars) {
 const parsed = await parseCarTitleWithAI(car.title);
 
 car.year = parsed.year;
 car.make = parsed.make;
 car.model = parsed.model;
 car.trim = parsed.trim;
 car.bodyType = parsed.bodyType;
}
```

## Cost Considerations

### OpenAI Pricing (GPT-3.5-turbo)

- Input: $0.50 / 1M tokens
- Output: $1.50 / 1M tokens

### Typical Usage

- Average tokens per title: ~100 input + 50 output = 150 tokens
- Cost per title: ~$0.000075 (less than 0.01 cents)
- 1000 titles: ~$0.075 (7.5 cents)
- 10,000 titles: ~$0.75 (75 cents)

**Very affordable for this use case!**

## Fallback Behaviour

If OpenAI API is unavailable or `OPENAI_API_KEY` is not set, the parser falls back to regex-based parsing:

- Still extracts year, make, model
- Identifies common trim patterns (EX, LT, XLT, etc.)
- Detects body types (Sedan, SUV, Van, Truck)
- Less accurate but functional

## Rate Limiting

The batch parser includes automatic rate limiting:

- 100ms delay between requests (default)
- Configurable via `delayMs` parameter
- Prevents API throttling

```typescript
// Custom delay (500ms between requests)
const results = await batchParseCarTitles(titles, 500);
```

## Troubleshooting

### "OPENAI_API_KEY not set"

Add your API key to `.env.local`:

```env
OPENAI_API_KEY=sk-...
```

### API rate limit errors

Increase the delay between requests:

```typescript
await batchParseCarTitles(titles, 500); // 500ms delay
```

### Parsing inaccuracies

The AI is very accurate, but if you encounter issues:

1. Check the input title format
2. Report edge cases for prompt improvement
3. Use fallback parser for non-critical data
