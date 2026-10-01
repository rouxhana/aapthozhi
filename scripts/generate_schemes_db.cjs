const fs = require('fs');
const path = require('path');

// 1. User provided 5 priority core schemes
const userCoreSchemes = [
  {
    id: 1,
    scheme_name: "Sukanya Samriddhi Yojana (SSY)",
    category: "Savings & Education",
    who_is_it_for: "Girls under 10 years old (through their parents)",
    main_benefit: "A safe government bank account with high interest to save money for your daughter's college or marriage.",
    documents_needed: "Girl's Birth Certificate, Parent's Aadhaar Card, Photo",
    how_to_apply: "Go to any nearby Post Office or Government Bank and ask for the Sukanya Form.",
    keywords: ["savings", "bank", "marriage", "money", "child", "post office", "sukanya", "daughter", "beti", "girl", "chaduvu", "ammaayi", "magal", "mulgi"]
  },
  {
    id: 2,
    scheme_name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    category: "Household Help",
    who_is_it_for: "Women from poor households (BPL families)",
    main_benefit: "Free gas cylinder connection and first refill stove for safe and clean cooking without wood smoke.",
    documents_needed: "Ration Card (BPL), Aadhaar Card, Bank Account",
    how_to_apply: "Go to your nearest local Gas Agency counter.",
    keywords: ["gas", "cylinder", "stove", "cooking", "kitchen", "free", "ujjwala", "lpg", "smoke", "chulha", "fuel", "bpl", "ration card"]
  },
  {
    id: 3,
    scheme_name: "AICTE Pragati Scholarship",
    category: "College & Education",
    who_is_it_for: "Girls entering first year of college for Engineering or Diploma courses",
    main_benefit: "₹50,000 every year directly in your bank account to pay for college fees and books.",
    documents_needed: "College Admission Letter, Family Income Certificate, 10th/12th Marksheet",
    how_to_apply: "Ask your college office or apply on the National Scholarship Portal (NSP).",
    keywords: ["college", "scholarship", "fees", "degree", "diploma", "engineering", "pragati", "study", "books", "aicte", "university", "higher education"]
  },
  {
    id: 4,
    scheme_name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    category: "Motherhood & Health",
    who_is_it_for: "Pregnant women or mothers having their first child",
    main_benefit: "₹5,000 sent to your bank account in parts to buy healthy food and medicine during pregnancy.",
    documents_needed: "Mother's Aadhaar Card, Pregnancy Card (MCP Card), Bank Passbook",
    how_to_apply: "Visit the nearest government Anganwadi Centre or Asha Worker.",
    keywords: ["pregnant", "baby", "mother", "health", "hospital", "delivery", "matru vandana", "pmmvy", "nutrition", "anganwadi", "asha", "poshan", "thalli", "aai"]
  },
  {
    id: 5,
    scheme_name: "Free Sewing Machine Scheme (Silai Machine Yojana)",
    category: "Jobs & Business",
    who_is_it_for: "Working-class women aged between 20 and 40 years old",
    main_benefit: "Free sewing machine or money to buy one, so you can earn money by stitching clothes at home.",
    documents_needed: "Aadhaar Card, Income Certificate, Age Proof",
    how_to_apply: "Fill a paper form at your local Block Office or Panchayat Office.",
    keywords: ["sewing", "tailor", "machine", "stitching", "clothes", "earn", "silai", "darzi", "kapde", "self employed", "home business", "panchayat", "block office"]
  }
];

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
const headers = rows[0];
const colMap = {};
headers.forEach((h, idx) => {
  colMap[h] = idx;
});

const allSchemes = [...userCoreSchemes];
let nextId = 6;

// Key search keywords for extracting rich schemes
const PRIORITY_TERMS = [
  'ayushman', 'health', 'pension', 'old age', 'widow', 'awas', 'housing', 'kisan', 'farmer',
  'mudra', 'loan', 'stand up', 'mahila', 'ration', 'food', 'disability', 'handicapped',
  'scholarship', 'shiksha', 'kanya', 'balika', 'poshan', 'roshni', 'livelihood', 'training'
];

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  if (!row || row.length < 5) continue;

  const rawName = cleanText(row[colMap['name']]);
  if (!rawName || rawName.length < 4) continue;

  // Check if name or category matches priority citizen welfare terms
  const lowerName = rawName.toLowerCase();
  const lowerCat = cleanText(row[colMap['category']]).toLowerCase();
  const combined = lowerName + ' ' + lowerCat;

  const matchesPriority = PRIORITY_TERMS.some(t => combined.includes(t));
  if (!matchesPriority && allSchemes.length > 300) continue;

  // Avoid exact duplicates with userCoreSchemes
  if (allSchemes.some(s => s.scheme_name.toLowerCase().includes(lowerName.slice(0, 20)))) {
    continue;
  }

  const category = cleanText(row[colMap['category']]) || 'Government Welfare';
  const who_is_it_for = cleanText(row[colMap['eligibility_text']]) || cleanText(row[colMap['beneficiary_type']]) || 'Eligible Citizens';
  const main_benefit = cleanText(row[colMap['benefits']]) || cleanText(row[colMap['description']]);
  const documents_needed = cleanText(row[colMap['documents_required']]) || 'Aadhaar Card, Bank Passbook, Ration Card';
  const how_to_apply = cleanText(row[colMap['application_process']]) || 'Apply at nearest CSC Kendra or official government portal.';
  const state = cleanText(row[colMap['state']]) || 'Central';
  const official_url = row[colMap['official_url']] || row[colMap['apply_url']] || '';

  // Generate smart keywords
  const keywordsSet = new Set([
    state.toLowerCase(),
    ...category.toLowerCase().split(/[&,\s]+/).filter(w => w.length > 3),
    ...rawName.toLowerCase().split(/[&,\s\-()]+/).filter(w => w.length > 3)
  ]);

  allSchemes.push({
    id: nextId++,
    scheme_name: rawName,
    category: category.split(',')[0].trim(),
    who_is_it_for: who_is_it_for.slice(0, 180) + (who_is_it_for.length > 180 ? '...' : ''),
    main_benefit: main_benefit.slice(0, 220) + (main_benefit.length > 220 ? '...' : ''),
    documents_needed: documents_needed.slice(0, 150) + (documents_needed.length > 150 ? '...' : ''),
    how_to_apply: how_to_apply.slice(0, 150) + (how_to_apply.length > 150 ? '...' : ''),
    keywords: Array.from(keywordsSet).slice(0, 10),
    state: state,
    official_url: official_url
  });

  if (allSchemes.length >= 250) break; // Curate top 250 high-impact schemes for super-fast client performance
}

console.log(`Total database schemes compiled: ${allSchemes.length}`);

// Write JSON file for static access
fs.writeFileSync(
  path.join('public', 'data', 'schemesDatabase.json'),
  JSON.stringify(allSchemes, null, 2),
  'utf8'
);

// Write TypeScript file for direct typed importing
const tsFileContent = `// Indian Government Schemes Dataset 2025 (Hugging Face / SmartDuke Technologies)
// Imported & structured for AapThozhi multilingual citizen matching

export interface SchemeDatabaseRecord {
  id: number;
  scheme_name: string;
  category: string;
  who_is_it_for: string;
  main_benefit: string;
  documents_needed: string;
  how_to_apply: string;
  keywords: string[];
  state?: string;
  official_url?: string;
}

export const SCHEMES_DATABASE: SchemeDatabaseRecord[] = ${JSON.stringify(allSchemes, null, 2)};
`;

fs.writeFileSync(path.join('src', 'data', 'schemesDatabase.ts'), tsFileContent, 'utf8');
console.log('Successfully wrote src/data/schemesDatabase.ts and public/data/schemesDatabase.json');
