# AI Title Parser

AI-powered car title parser that accurately extracts year, make, model, trim, and body type from vehicle titles.

## Features

✅ **Accurate Parsing**: Uses OpenAI GPT-3.5 to understand car nomenclature
✅ **Trim Separation**: Correctly identifies trim levels (EX, LT, T-150, etc.)
✅ **Body Type Detection**: Recognizes vehicle types (Sedan, SUV, Van, Truck)
✅ **Fallback Parser**: Works without AI using regex patterns
✅ **Batch Processing**: Parse multiple titles with rate limiting

## Setup

### 1. Get OpenAI API Key

1. Go to <https://platform.openai.com/api-keys>
2. Create a new API key
3. Add to your `.env.local`:

```env
OPENAI_API_KEY=sk-...your-key-here
```

### 2. Install Dependencies

No additional dependencies needed - uses native `fetch`.

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
 { lotNumber: '12345', title: '2017 ford transit t-150', price: '$10,000' },
 { lotNumber: '12346', title: '2020 kia telluride ex', price: '$25,000' },
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

## Fallback Behavior

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

## Future Enhancements

- [ ] Cache parsed results to avoid re-parsing
- [ ] Support for other languages (Spanish, German, etc.)
- [ ] Integration with car database APIs for validation
- [ ] Custom model support (Claude, Llama, etc.)
- [ ] Batch API endpoint for async processing
