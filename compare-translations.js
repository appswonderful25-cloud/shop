const fs = require('fs');

const content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// Extract English keys
const enMatches = content.match(/"([^"]+)":\s*"([^"]*)"/g) || [];
const enKeys = new Set(enMatches.map(m => m.match(/"([^"]+)":/)[1]));

// Extract Arabic keys (find the Arabic section first)
const arSection = content.substring(content.indexOf('const ar:'));
const arMatches = arSection.match(/"([^"]+)":\s*"([^"]*)"/g) || [];
const arKeys = new Set(arMatches.map(m => m.match(/"([^"]+)":/)[1]));

// Find missing keys
const missingInArabic = [...enKeys].filter(key => !arKeys.has(key));
const extraInArabic = [...arKeys].filter(key => !enKeys.has(key));

console.log('Total English keys:', enKeys.size);
console.log('Total Arabic keys:', arKeys.size);
console.log('Missing in Arabic:', missingInArabic.length);
console.log('Extra in Arabic:', extraInArabic.length);

if (missingInArabic.length > 0) {
  console.log('\nMissing keys in Arabic:');
  missingInArabic.forEach(key => console.log(`  - ${key}`));
}

if (extraInArabic.length > 0) {
  console.log('\nExtra keys in Arabic:');
  extraInArabic.forEach(key => console.log(`  - ${key}`));
}

// Save missing keys to file
if (missingInArabic.length > 0) {
  fs.writeFileSync('missing-translations.txt', missingInArabic.join('\n'));
  console.log('\nMissing keys saved to missing-translations.txt');
}