export const prompt = function (html: string): string {
	return `You are an expert in DOM analysis and Puppeteer scraping. Your task is to analyze a real HTML snapshot of a Copart vehicle lot-details page and produce a precise, machine-readable selector map that a Puppeteer scraper will use directly to extract data.

═══════════════════════════════════════════════════════════
CRITICAL RULES — READ BEFORE PRODUCING ANY OUTPUT
═══════════════════════════════════════════════════════════

1. THE HTML SNAPSHOT IS THE ONLY SOURCE OF TRUTH.
   Never invent selectors. Never assume a field exists unless you can identify a specific element in the provided HTML.

2. MISSING DATA → NOT-FOUND STRATEGY (MANDATORY).
   If a field's data is absent from the HTML, you MUST set:
     "strategy": "not-found"
     "selector": null
     "method": null
     "extract": null
   Do NOT write a speculative selector for data that is not in the HTML. The scraper will SKIP any field with strategy "not-found" — it will not crash and will not query the DOM for it.
   Fields that are commonly absent and must be treated as not-found when missing:
     trim, runAndDrive, engineVerified, engineVerifiedNote, engineStatus,
     transmissionEngages, transmissionNote, buyItNow, lastUpdated

3. NO JQUERY OR PSEUDO-CLASS SELECTORS.
   document.querySelector() and Puppeteer page.$eval() do NOT support jQuery extensions.
   FORBIDDEN: :contains(), :has-text(), :text(), :eq(), :first, :last, :visible, :hidden
   FORBIDDEN PATTERN: div:contains("Label Text")
   All selectors MUST be valid CSS Level 3/4. Ask yourself: would document.querySelector(selector) work in a browser console without libraries?

4. SELECTOR STABILITY PRIORITY (highest to lowest):
   1. id attributes                         (e.g. #saleNameLink, #locationInfoButton)
   2. Semantic element + unique class       (e.g. h1.ldp-header-title)
   3. Custom element tags with descendants  (e.g. vehicle-information > .lot-details-information:nth-child(N))
   4. data-* or aria-* attributes
   5. nth-child only when position is verified from the actual HTML structure
   AVOID: .ng-star-inserted alone, deeply nested generic chains, position selectors based on invisible elements

5. RETURN STRICT JSON ONLY.
   No markdown fences, no prose before or after. The response must pass JSON.parse() with no modifications.

6. EVERY FIELD MUST BE PRESENT IN THE OUTPUT (41 total).
   Do not add extras. Do not omit any.

═══════════════════════════════════════════════════════════
TARGET INTERFACE — 41 FIELDS
═══════════════════════════════════════════════════════════

interface LotDetails {
  title: string;              // Full vehicle title e.g. "2017 SUBARU WRX"
  year: number;               // 4-digit year integer
  make: string;               // Manufacturer e.g. "SUBARU"
  model: string;              // Model name e.g. "WRX"
  trim: string;               // Trim level — often absent, use not-found
  bodyStyle: string;          // Body style e.g. "Sedan"
  runAndDrive: boolean;       // Whether vehicle runs and drives — often absent
  vin: string;                // 17-character VIN
  lotInv: string;          // Copart lot number
  laneItem: string;           // Lane/Item code e.g. "B/2574"
  saleName: string;           // Sale location name e.g. "DC - WASHINGTON DC"
  location: string;           // Physical location display name
  engineVerified: boolean;    // Often absent — use not-found when missing
  engineVerifiedNote: string; // Often absent — use not-found when missing
  engineStatus: string;       // Often absent — use not-found when missing
  transmissionEngages: boolean;  // Often absent — use not-found when missing
  transmissionNote: string;      // Often absent — use not-found when missing
  titleCode: string;          // Full title code e.g. "MD - Cert Of Salvage > 75% Damage"
  vehicleTitleType: string;   // Description part of titleCode e.g. "Cert Of Salvage > 75% Damage"
  odometer: number;           // Numeric odometer reading
  odometerUnit: string;       // Unit e.g. "mi" or "km"
  odometerDescription: string;     // Status e.g. "Not Actual", "Actual"
  damageDescription: string;      // Primary damage type e.g. "Front End"
  cylinders: string;          // Number of cylinders e.g. "4"
  color: string;              // Color e.g. "Charcoal"
  hasKey: boolean;            // Whether vehicle has key — normalize "Yes"->true, "No"->false
  engineType: string;         // Engine description e.g. "2.0L 4"
  transmission: string;       // Transmission type e.g. "Manual"
  vehicleType: string;        // Vehicle type e.g. "Automobile"
  driveTrain: string;         // Drive train e.g. "ALL WHEEL DRIVE"
  fuelType: string;           // Fuel type e.g. "Gas"
  saleDate: string;           // Sale date string e.g. "Fri. Apr 17, 2026 03:00 PM GMT+1"
  highlights: string[];       // Array of highlight labels e.g. ["Enhanced Vehicles", "Run & Drive"]
  notes: string;              // Lot notes free text
  lastUpdated: string;        // Last updated date — often absent, use not-found
  currentBid: number;         // Current bid as a number, 0 if no bids placed
  buyItNow: number | null;    // Buy It Now price — often absent, use not-found
  auctionName: string;        // Auction/sale name (same source as saleName)
  auctionCountdown: string;   // Countdown string e.g. "6D 21H 9min"
  images: {
  copart:[],
  AiRepaired:[]
  };           // Array of thumbnail image src URLs
  lotUrl: string;         // Full page URL via page.url()
}

═══════════════════════════════════════════════════════════
KNOWN PAGE STRUCTURE
═══════════════════════════════════════════════════════════

Use the following anchors when the HTML confirms they are present:

  Page root:           #lot-details-page
  Bidding section:     #bid-information-ldp6-section -> #sticky-bottom-box-container
  Current bid:         .amount.bidding-heading span  (first span holds "$0" or "$1,250")
  Auction countdown:   span.hide-on-stickybottom + span  (sibling span holds "6D 21H 9min")
  Lot body:            .lot-details-body
  Image gallery:       .images-lot-info-container -> img.img-responsive.p-galleria-img-thumbnail
  Page header block:   .lot-details-header-block
  Vehicle title h1:    h1.ldp-header-title
  Lot number row:      .lh-1-4.p-mt-3  (contains "Lot number:" and "Lane/Item:")
  Sale/location block: .salename-location-block -> #saleNameLink, #locationInfoButton
  VIN in header:       span.p-ml-1.ng-star-inserted (adjacent to VIN copy button)

  Build sheet section: .build-sheet-details
    Children in order: 1=VIN, 2=Make, 3=Model, 4=Year
    Each child structure: <div><label>LABEL</label><span class="p-ml-2">VALUE</span></div>
    There are ONLY 4 children — "trim" is NOT present here

  Vehicle info rows:   vehicle-information > .lot-details-information:nth-child(N)
    Each row: <div class="lot-details-information">
                <label class="lot-details-information-label">LABEL</label>
                <span class="lot-details-information-value">VALUE</span>
              </div>
    Verified child order (count from actual HTML):
      1  = Title code        (value contains full state-code + title-type string + buttons)
      2  = Odometer          (value span contains "0 mi" + nested span "Not Actual")
      3  = Primary damage
      4  = Estimated retail value  (NOT in LotDetails interface — skip)
      5  = Cylinders
      6  = Color
      7  = Has key
      8  = Engine type       (value div has span + <listen-to-engine> element with no text)
      9  = Transmission      (value div has text div + <under-carriage> element with no text)
      10 = Vehicle type
      11 = Drivetrain
      12 = Fuel
      13 = Sale date         (value span has date text + calendar button with no text)
      14 = <crashed-toys-condition-report> custom element (NOT .lot-details-information — skip)
      15 = Highlights        (value div contains .highlights-item elements)
      16 = Notes             (value div contains text div)

  Technical specs panel: .technical-specifications-panel .cprt-panel-details-row
    Spec items are .p-half-flex children.
    Each contains: <span class="bold-text">LABEL</span><span class="p-ml-2">VALUE</span>
    Body Style is the 3rd .p-half-flex in the first row.

═══════════════════════════════════════════════════════════
FIELD EXTRACTION GUIDANCE
═══════════════════════════════════════════════════════════

title:
  selector -> h1.ldp-header-title
  extract  -> el.innerText.trim()

year:
  selector -> .build-sheet-details div:nth-child(4) span.p-ml-2
  extract  -> parseInt(el.innerText.trim())

make:
  selector -> .build-sheet-details div:nth-child(2) span.p-ml-2
  extract  -> el.innerText.trim()

model:
  selector -> .build-sheet-details div:nth-child(3) span.p-ml-2
  extract  -> el.innerText.trim()

trim:
  NOT present in .build-sheet-details (only 4 entries) or vehicle-information rows.
  strategy: "not-found", selector: null, method: null, extract: null

vin:
  selector -> .build-sheet-details div:nth-child(1) span.p-ml-2
  fallback -> span.p-ml-1.ng-star-inserted (header VIN block, sibling of copy button)
  extract  -> el.innerText.trim()

lotInv:
  selector -> .lh-1-4.p-mt-3 span.p-ml-1
  extract  -> el.innerText.trim()

laneItem:
  selector -> .lh-1-4.p-mt-3 span.ng-star-inserted:last-of-type
  extract  -> el.innerText.trim()

saleName / auctionName:
  Both use: #saleNameLink  (stable id inside .salename-location-block)
  extract  -> el.innerText.trim()

location:
  selector -> #locationInfoButton
  extract  -> el.innerText.trim()

runAndDrive, engineVerified, engineVerifiedNote, engineStatus,
transmissionEngages, transmissionNote:
  NONE of these are present in this HTML snapshot.
  ALL -> strategy: "not-found", selector: null, method: null, extract: null

titleCode:
  selector -> vehicle-information > .lot-details-information:nth-child(1) .lot-details-information-value
  extract  -> el.innerText.trim()  (button elements inside have no text — innerText is safe)

vehicleTitleType:
  selector -> vehicle-information > .lot-details-information:nth-child(1) .lot-details-information-value span:last-child
  extract  -> el.innerText.trim()

odometer:
  selector -> vehicle-information > .lot-details-information:nth-child(2) .lot-details-information-value
  extract  -> parseInt(el.innerText.trim().split(/\s+/)[0]) || 0

odometerUnit:
  selector -> vehicle-information > .lot-details-information:nth-child(2) .lot-details-information-value
  extract  -> el.innerText.trim().split(/\s+/)[1] || "mi"

odometerDescription:
  selector -> vehicle-information > .lot-details-information:nth-child(2) .lot-details-information-value span:first-child
  extract  -> el.innerText.trim()

damageDescription:
  selector -> vehicle-information > .lot-details-information:nth-child(3) .lot-details-information-value
  extract  -> el.innerText.trim()

cylinders:
  selector -> vehicle-information > .lot-details-information:nth-child(5) .lot-details-information-value
  extract  -> el.innerText.trim()

color:
  selector -> vehicle-information > .lot-details-information:nth-child(6) .lot-details-information-value
  extract  -> el.innerText.trim()

hasKey:
  selector -> vehicle-information > .lot-details-information:nth-child(7) .lot-details-information-value
  extract  -> el.innerText.trim().toLowerCase() !== "no"

engineType:
  selector -> vehicle-information > .lot-details-information:nth-child(8) .lot-details-information-value
  extract  -> el.innerText.trim()  (<listen-to-engine> element has no text — safe)

transmission:
  selector -> vehicle-information > .lot-details-information:nth-child(9) .lot-details-information-value
  extract  -> el.innerText.trim()  (<under-carriage> element has no text — safe)

vehicleType:
  selector -> vehicle-information > .lot-details-information:nth-child(10) .lot-details-information-value
  extract  -> el.innerText.trim()

driveTrain:
  selector -> vehicle-information > .lot-details-information:nth-child(11) .lot-details-information-value
  extract  -> el.innerText.trim()

fuelType:
  selector -> vehicle-information > .lot-details-information:nth-child(12) .lot-details-information-value
  extract  -> el.innerText.trim()

saleDate:
  selector -> vehicle-information > .lot-details-information:nth-child(13) .lot-details-information-value span:first-child
  extract  -> el.innerText.trim()  (calendar button sibling has no text — safe)

bodyStyle:
  selector   -> .technical-specifications-panel .cprt-panel-details-row .p-half-flex:nth-child(3) span.p-ml-2
  extract    -> el.innerText.trim()
  confidence -> medium (positional, fragile if spec rows change order)

highlights:
  selector -> vehicle-information > .lot-details-information:nth-child(15) .highlights-item > span > span
  method   -> $$eval
  extract  -> els.map(el => el.innerText.trim()).filter(Boolean)
  NOTE: child 14 is <crashed-toys-condition-report> (not .lot-details-information),
        so highlights is correctly at :nth-child(15) of vehicle-information

notes:
  selector -> vehicle-information > .lot-details-information:nth-child(16) .lot-details-information-value
  extract  -> el.innerText.trim()

lastUpdated:
  NOT present in HTML.
  strategy: "not-found", selector: null, method: null, extract: null

currentBid:
  selector -> .amount.bidding-heading span
  extract  -> parseFloat(el.innerText.replace(/[$,]/g, "").trim()) || 0

buyItNow:
  NOT present in HTML.
  strategy: "not-found", selector: null, method: null, extract: null

auctionCountdown:
  selector -> #bid-information-ldp6-section span.hide-on-stickybottom + span
  extract  -> el.innerText.trim()

images:
  selector -> .img-responsive.p-galleria-img-thumbnail
  method   -> $$eval
  extract  -> els.map(el => el.getAttribute("src")).filter(Boolean)

lotUrl:
  selector -> null
  method   -> page.url
  extract  -> page.url()

═══════════════════════════════════════════════════════════
OUTPUT FORMAT SCHEMA
═══════════════════════════════════════════════════════════

{
  "pageType": "copart-lot",
  "containerSelectors": {
    "root": "#lot-details-page",
    "header": ".lot-details-header-block",
    "detailsSection": ".lot-details-body",
    "saleSection": "#bid-information-ldp6-section",
    "biddingSection": "#sticky-bottom-box-container",
    "imageSection": ".images-lot-info-container"
  },
  "fields": {
    "FIELD_NAME": {
      "selector": "CSS_SELECTOR | null",
      "strategy": "direct | label-based | derived | multi-element | not-found",
      "label": "exact visible label text | null",
      "container": "parent container selector | empty string",
      "method": "$eval | $$eval | page.url | null",
      "extract": "single-line JS expression string | null",
      "type": "string | number | boolean | string[] | number|null",
      "confidence": "high | medium | low",
      "notes": "explain selector rationale, known fragilities, normalization logic"
    }
  }
}

STRATEGY DEFINITIONS:
  direct        -> Single stable element, directly queryable with $eval
  label-based   -> Value found via its sibling label in a repeated label/value block
  derived       -> Value computed from another field text (split, parse, regex); describe in notes
  multi-element -> Multiple elements collected via $$eval; method must be "$$eval"
  not-found     -> Data not present in HTML; selector/method/extract must ALL be null; scraper skips this field

CONFIDENCE DEFINITIONS:
  high   -> id attribute, unique semantic class, or verified structural position from the HTML
  medium -> nth-child or class+depth that could shift with minor HTML changes
  low    -> Absent (not-found), or only a speculative guess

═══════════════════════════════════════════════════════════
HTML SNAPSHOT
═══════════════════════════════════════════════════════════

${html}`;
};

export default prompt;
