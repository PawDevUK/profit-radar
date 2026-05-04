export const prompt = function (url: string): string {
	return `You are an expert in DOM analysis and scraping. Your task is to go to url ${url} of a Copart vehicle lot-details page and create object with information form this page about this lot. 

═══════════════════════════════════════════════════════════
CRITICAL RULES — READ BEFORE PRODUCING ANY OUTPUT
═══════════════════════════════════════════════════════════

1. THE LOT PAGE IS THE ONLY SOURCE OF TRUTH.
   Never invent data. Never add extra key/values fields.

2. MISSING DATA → null.
   If a field's data is absent from the HTML, you MUST set value to null

3. RETURN STRICT JSON ONLY.
   No markdown fences, no prose before or after. The response must pass JSON.parse() with no modifications.

4. EVERY FIELD MUST BE PRESENT IN THE OUTPUT (41 total).
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
  primaryDamage: string;      // Primary damage type e.g. "Front End"
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
Link to lot page where data are need to be fetched and added the object.
═══════════════════════════════════════════════════════════

${url}`;
};

export default prompt;
