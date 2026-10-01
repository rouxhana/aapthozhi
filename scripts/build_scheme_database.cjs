const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.trim());
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  return rows;
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/,1/g, '₹')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

console.log('Reading schemes_hf.csv...');
const csvData = fs.readFileSync('schemes_hf.csv', 'utf8');
const rows = parseCSV(csvData);
console.log(`Parsed ${rows.length} rows.`);

const headers = rows[0];
const colMap = {};
headers.forEach((h, idx) => {
  colMap[h] = idx;
});

const schemes = [];

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || r.length < 5) continue;

  const slug = r[colMap['slug']] || `scheme-${i}`;
  const name = cleanText(r[colMap['name']]);
  const description = cleanText(r[colMap['description']]);
  if (!name || name.length < 3) continue;

  const ministry = cleanText(r[colMap['ministry']]);
  const department = cleanText(r[colMap['department']]);
  const state = cleanText(r[colMap['state']]) || 'Central';
  const category = cleanText(r[colMap['category']]) || 'General Welfare';
  const beneficiaryType = cleanText(r[colMap['beneficiary_type']]) || 'Citizen';
  const benefits = cleanText(r[colMap['benefits']]);
  const eligibilityText = cleanText(r[colMap['eligibility_text']]);
  const applicationProcess = cleanText(r[colMap['application_process']]);
  const documentsRequired = cleanText(r[colMap['documents_required']]);
  const applyUrl = r[colMap['apply_url']] || '';
  const officialUrl = r[colMap['official_url']] || '';
  const genderRaw = cleanText(r[colMap['eligibility_gender']]).toLowerCase();
  
  let gender = 'all';
  if (genderRaw.includes('female') && !genderRaw.includes('male')) gender = 'female';
  else if (genderRaw.includes('male') && !genderRaw.includes('female')) gender = 'male';

  const ageMin = parseFloat(r[colMap['eligibility_age_min']]) || undefined;
  const ageMax = parseFloat(r[colMap['eligibility_age_max']]) || undefined;

  // Determine top category mapping
  let standardCategory = 'social';
  const catLower = category.toLowerCase() + ' ' + name.toLowerCase();
  if (catLower.includes('education') || catLower.includes('learning') || catLower.includes('scholarship') || catLower.includes('vidya') || catLower.includes('student')) {
    standardCategory = 'education';
  } else if (catLower.includes('matern') || catLower.includes('child') || catLower.includes('pregnant') || catLower.includes('kanya') || catLower.includes('sukanya') || catLower.includes('girl')) {
    standardCategory = 'maternity';
  } else if (catLower.includes('pension') || catLower.includes('elderly') || catLower.includes('senior') || catLower.includes('old age') || catLower.includes('widow')) {
    standardCategory = 'pension';
  } else if (catLower.includes('health') || catLower.includes('medical') || catLower.includes('wellness') || catLower.includes('ayushman') || catLower.includes('hospital') || catLower.includes('arogya')) {
    standardCategory = 'health';
  } else if (catLower.includes('skill') || catLower.includes('employment') || catLower.includes('livelihood') || catLower.includes('training') || catLower.includes('job')) {
    standardCategory = 'skills';
  } else if (catLower.includes('agriculture') || catLower.includes('farmer') || catLower.includes('krishi') || catLower.includes('kisan') || catLower.includes('rural')) {
    standardCategory = 'agriculture';
  } else if (catLower.includes('business') || catLower.includes('msme') || catLower.includes('entrepreneur') || catLower.includes('mudra') || catLower.includes('loan')) {
    standardCategory = 'business';
  }

  schemes.push({
    id: slug,
    name,
    description: description.slice(0, 300) + (description.length > 300 ? '...' : ''),
    ministry,
    department,
    state,
    category,
    standardCategory,
    beneficiaryType,
    benefits: benefits.slice(0, 400),
    eligibilityText: eligibilityText.slice(0, 400),
    applicationProcess: applicationProcess.slice(0, 300),
    documentsRequired: documentsRequired.slice(0, 300),
    applyUrl,
    officialUrl,
    eligibilityAgeMin: ageMin,
    eligibilityAgeMax: ageMax,
    eligibilityGender: gender,
  });
}

console.log(`Processed ${schemes.length} valid schemes.`);

// Ensure public/data directory exists
const publicDataDir = path.join('public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// 1. Write full scheme database to public/data/schemes_database_2025.json
const fullDbPath = path.join(publicDataDir, 'schemes_database_2025.json');
fs.writeFileSync(fullDbPath, JSON.stringify(schemes), 'utf8');
const stat = fs.statSync(fullDbPath);
console.log(`Wrote full database to ${fullDbPath} (${(stat.size / (1024 * 1024)).toFixed(2)} MB).`);

// 2. Select top 80 curated representative schemes across all categories and states for instant bundling
const curated = schemes.filter(s => {
  const isFemale = s.eligibilityGender === 'female' || s.name.toLowerCase().includes('girl') || s.name.toLowerCase().includes('woman') || s.name.toLowerCase().includes('kanya') || s.name.toLowerCase().includes('sukanya') || s.name.toLowerCase().includes('mahila');
  const isCoreCategory = ['education', 'maternity', 'pension', 'health', 'skills'].includes(s.standardCategory);
  return isFemale || isCoreCategory;
}).slice(0, 80);

const curatedTsContent = `// Auto-generated curated high-priority schemes from Hugging Face Indian Government Schemes 2025 Dataset
export interface CuratedGovScheme {
  id: string;
  name: string;
  description: string;
  ministry: string;
  state: string;
  category: string;
  standardCategory: 'education' | 'maternity' | 'pension' | 'health' | 'skills' | 'agriculture' | 'business' | 'social';
  beneficiaryType: string;
  benefits: string;
  eligibilityText: string;
  documentsRequired: string;
  applyUrl: string;
  officialUrl: string;
  eligibilityGender: 'female' | 'male' | 'all';
}

export const CURATED_SCHEMES_2025: CuratedGovScheme[] = ${JSON.stringify(curated, null, 2)};
`;

fs.writeFileSync(path.join('src', 'data', 'curatedSchemes.ts'), curatedTsContent, 'utf8');
console.log(`Wrote ${curated.length} curated schemes to src/data/curatedSchemes.ts`);
