const fs = require('fs');

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
        i++; // skip next quote
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

const fileContent = fs.readFileSync('schemes_hf.csv', 'utf8');
const rows = parseCSV(fileContent);

console.log('Total parsed rows (including header):', rows.length);
const headers = rows[0];
console.log('Headers:', headers);

const categoryCounts = {};
const stateCounts = {};
let femaleCount = 0;

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const state = row[5] || 'Unknown';
  const cat = row[6] || 'General';
  const gender = row[16] || 'all';

  stateCounts[state] = (stateCounts[state] || 0) + 1;
  cat.split(',').forEach(c => {
    const trimmed = c.trim();
    if (trimmed) categoryCounts[trimmed] = (categoryCounts[trimmed] || 0) + 1;
  });
  if (gender.toLowerCase().includes('female') || row[1].toLowerCase().includes('girl') || row[1].toLowerCase().includes('woman') || row[1].toLowerCase().includes('women') || row[1].toLowerCase().includes('mahila') || row[1].toLowerCase().includes('kanya')) {
    femaleCount++;
  }
}

console.log('Women / Girl centric schemes:', femaleCount);
console.log('Top Categories:', Object.entries(categoryCounts).sort((a,b) => b[1] - a[1]).slice(0, 10));
console.log('Top States:', Object.entries(stateCounts).sort((a,b) => b[1] - a[1]).slice(0, 10));
