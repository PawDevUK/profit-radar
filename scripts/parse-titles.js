import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse car title to extract year, make, and model
 */
function parseTitleToYearMakeModel(title) {
    if (!title || typeof title !== 'string') {
        return { year: '', make: '', model: '' };
    }

    const parts = title.trim().split(/\s+/);

    // parts[0] is usually the year (4 digits)
    // parts[1] is usually the make
    // parts[2] is usually the model
    const year = parts.length > 0 && /^\d{4}$/.test(parts[0]) ? parts[0] : '';
    const make = parts.length > 1 ? parts[1].toUpperCase() : '';
    const model = parts.length > 2 ? parts[2].toUpperCase() : '';

    return { year, make, model };
}

// Read the JSON file
const filePath = path.join(__dirname, '..', 'results', 'copart_first_page_detailed_2026-01-28.json');
const content = fs.readFileSync(filePath, 'utf-8');
const cars = JSON.parse(content);

// Parse each car's title and update year, make, model
const updatedCars = cars.map((car) => {
    const { year, make, model } = parseTitleToYearMakeModel(car.title);
    return {
        ...car,
        year: year || car.year,
        make: make || car.make,
        model: model || car.model,
    };
});

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(updatedCars, null, '\t'), 'utf-8');
console.log(`✓ Updated ${updatedCars.length} cars with parsed title data`);
console.log('\nExample:');
updatedCars.slice(0, 2).forEach((car) => {
    console.log(`  Title: ${car.title}`);
    console.log(`  → Year: ${car.year}, Make: ${car.make}, Model: ${car.model}\n`);
});
