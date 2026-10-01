import { SCHEMES_DATABASE, SchemeDatabaseRecord } from '../data/schemesDatabase';
import { LanguageCode } from '../types';

// Multilingual keywords dictionary for mapping queries in Telugu, Tamil, Kannada, Marathi, Hindi, etc.
const MULTILINGUAL_SEARCH_MAP: Record<string, string[]> = {
  gas: [
    'gas', 'cylinder', 'stove', 'cooking', 'kitchen', 'fuel', 'chulha', 'ujjwala',
    // Hindi / Hinglish
    'gas', 'chulha', 'rasoi', 'silinder', 'गैस', 'चूल्हा',
    // Telugu
    'gas', 'poyyi', 'vantagadi', 'గ్యాస్', 'పొయ్యి',
    // Tamil
    'gas', 'aduppu', 'samayal', 'எரிவாயு', 'அடுப்பு',
    // Kannada
    'ole', 'aduge', 'ಸಿಲಿಂಡರ್', 'ಅಡುಗೆ',
    // Marathi
    'shegdi', 'swayampak', 'गॅस', 'शेगडी',
  ],
  sewing: [
    'sewing', 'machine', 'stitching', 'tailor', 'clothes', 'earn', 'silai',
    // Hindi
    'silai', 'darzi', 'kapda', 'सिलाई', 'मशीन', 'दर्जी',
    // Telugu
    'kuttumashinu', 'kuttadam', 'battalu', 'కుట్టుమిషన్', 'కుట్టు',
    // Tamil
    'thayyal', 'thayyal iyanthiram', 'thuni', 'தையல்', 'தையல் இயந்திரம்',
    // Kannada
    'holige', 'holige yanthra', 'ಬಟ್ಟೆ', 'ಹೊಲಿಗೆ',
    // Marathi
    'shivan', 'shivan yantra', 'कपाडे', 'शिलाई', 'शिलाई मशीन',
  ],
  education: [
    'education', 'scholarship', 'school', 'college', 'student', 'study', 'books', 'fees', 'degree', 'engineering', 'pragati',
    // Hindi
    'padhai', 'shiksha', 'chhatravritti', 'beti', 'kanya', 'पढ़ाई', 'शिक्षा', 'छात्रवृत्ति',
    // Telugu
    'chaduvu', 'pathashala', 'vidyarthi', 'ammaayi', 'fees', 'చదువు', 'పాఠశాల', 'విద్యార్థి',
    // Tamil
    'kalvi', 'padipu', 'palli', 'kalluri', 'udavithogai', 'magal', 'கல்வி', 'படிப்பு', 'பள்ளி',
    // Kannada
    'shikshana', 'shaale', 'vidyarthivethana', 'magalu', 'ಶಿಕ್ಷಣ', 'ಶಾಲೆ', 'ವಿದ್ಯಾರ್ಥಿವೇತನ',
    // Marathi
    'shikshan', 'shala', 'shishyavrutti', 'mulgi', 'शिक्षण', 'शाळा', 'शिष्यवृत्ती',
  ],
  maternity: [
    'pregnant', 'baby', 'mother', 'health', 'hospital', 'delivery', 'maternity', 'pmmvy', 'nutrition', 'poshan',
    // Hindi
    'garbh', 'prasuti', 'maa', 'bachha', 'shishu', 'गर्भावस्था', 'प्रसूति', 'माता',
    // Telugu
    'garbhavathi', 'prasavam', 'thalli', 'bidda', 'గర్భవతి', 'ప్రసవం', 'తల్లి',
    // Tamil
    'karppam', 'thaai', 'kuzhandhai', 'மகப்பேறு', 'கர்ப்பிணி', 'தாய்',
    // Kannada
    'garbhini', 'taayi', 'magu', 'ಗರ್ಭಿಣಿ', 'ತಾಯಿ', 'ಮಗು',
    // Marathi
    'garbhodar', 'aai', 'baal', 'prasuti', 'गरोदर', 'आई', 'बाळ',
  ],
  savings: [
    'savings', 'bank', 'marriage', 'money', 'child', 'sukanya', 'daughter', 'ssy', 'interest',
    // Hindi
    'bachat', 'khata', 'shadi', 'paise', 'बचत', 'खाता', 'शादी', 'रुपये',
    // Telugu
    'podupu', 'pelli', 'dabbu', 'ఖాతా', 'పొదుపు', 'పెళ్లి',
    // Tamil
    'semipu', 'thirumanam', 'panam', 'சேமிப்பு', 'திருமணம்', 'வங்கி',
    // Kannada
    'ulithaya', 'maduve', 'hana', 'ಉಳಿತಾಯ', 'ಮದುವೆ', 'ಖಾತೆ',
    // Marathi
    'bachat', 'lagna', 'paise', 'बचत', 'लग्न', 'बँक',
  ],
  pension: [
    'pension', 'elderly', 'senior', 'old age', 'widow', 'destitute', 'retirement',
    // Hindi
    'pension', 'vriddha', 'vidhwa', 'buzurg', 'पेंशन', 'वृद्धावस्था', 'विधवा',
    // Telugu
    'pinchanu', 'vruddhulu', 'vidhava', 'పింఛను', 'వృద్ధులు',
    // Tamil
    'oivuthiyam', 'muthiyor', 'kaimpen', 'ஓய்வூதியம்', 'முதியோர்',
    // Kannada
    'pension', 'vruddha', 'vidhava', 'ಪಿಂಚಣಿ', 'ವೃದ್ಧಾಪ್ಯ',
    // Marathi
    'nivruttivetan', 'vruddha', 'पेन्शन', 'निवृत्तिवेतन',
  ],
  health: [
    'health', 'medical', 'hospital', 'treatment', 'ayushman', 'card', 'medicine', 'doctor',
    // Hindi
    'swasthya', 'ilaj', 'dawa', 'aspatal', 'स्वास्थ्य', 'इलाज', 'दवा', 'अस्पताल',
    // Telugu
    'aarogya', 'vaidyam', 'asupathri', 'ఆరోగ్యం', 'వైద్యం', 'ఆసుపత్రి',
    // Tamil
    'maruthuva', 'sugadharam', 'maruthuvamanai', 'மருத்துவம்', 'சுகாதாரம்',
    // Kannada
    'aarogya', 'vaidya', 'aaspathre', 'ಆರೋಗ್ಯ', 'ವೈದ್ಯಕೀಯ',
    // Marathi
    'arogya', 'aushadh', 'rugnalaya', 'आरोग्य', 'औषध',
  ],
};

export class SchemeSearchService {
  private database: SchemeDatabaseRecord[] = SCHEMES_DATABASE;

  /**
   * Search database according to user request
   * Supports voice transcripts, keyword searches, category filters, and state filters.
   */
  public search(
    userRequest: string,
    options?: {
      category?: string;
      state?: string;
      limit?: number;
    }
  ): SchemeDatabaseRecord[] {
    const { category, state, limit = 12 } = options || {};

    if (!userRequest || userRequest.trim() === '') {
      let filtered = [...this.database];
      if (category && category !== 'All') {
        filtered = filtered.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (state && state !== 'All') {
        filtered = filtered.filter((s) => (s.state || '').toLowerCase().includes(state.toLowerCase()) || s.state === 'Central');
      }
      return filtered.slice(0, limit);
    }

    const cleanInput = userRequest.trim().toLowerCase();
    const queryWords = cleanInput.split(/\s+/).filter((w) => w.length > 1);

    // Expand search terms using multilingual synonyms
    const expandedConcepts = new Set<string>();
    for (const [conceptKey, synList] of Object.entries(MULTILINGUAL_SEARCH_MAP)) {
      for (const word of queryWords) {
        if (synList.some((syn) => word.includes(syn) || syn.includes(word))) {
          expandedConcepts.add(conceptKey);
          break;
        }
      }
    }

    const scored = this.database.map((scheme) => {
      let score = 0;
      const sName = scheme.scheme_name.toLowerCase();
      const sCat = scheme.category.toLowerCase();
      const sBenefit = scheme.main_benefit.toLowerCase();
      const sWho = scheme.who_is_it_for.toLowerCase();
      const sKeywords = (scheme.keywords || []).map((k) => k.toLowerCase());
      const sState = (scheme.state || '').toLowerCase();

      // State matching bonus
      if (state && state !== 'All') {
        if (sState.includes(state.toLowerCase())) score += 5;
        else if (sState === 'central') score += 2;
        else score -= 3;
      }

      // Category matching bonus
      if (category && category !== 'All') {
        if (sCat.includes(category.toLowerCase())) score += 8;
      }

      // Direct word matches
      for (const word of queryWords) {
        if (sName.includes(word)) score += 12;
        if (sKeywords.some((k) => k.includes(word))) score += 8;
        if (sBenefit.includes(word)) score += 5;
        if (sWho.includes(word)) score += 4;
      }

      // Concept / Synonym matches
      for (const concept of expandedConcepts) {
        if (sKeywords.includes(concept) || sCat.includes(concept) || sName.includes(concept)) {
          score += 10;
        }
        if (sBenefit.includes(concept) || sWho.includes(concept)) {
          score += 6;
        }
      }

      // Bonus for priority core schemes when matching
      if (scheme.id <= 5 && score > 0) {
        score += 4;
      }

      return { scheme, score };
    });

    const matches = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.scheme);

    // If no direct matches, return user core schemes + top database schemes
    if (matches.length === 0) {
      return this.database.slice(0, limit);
    }

    return matches.slice(0, limit);
  }

  public getById(id: number | string): SchemeDatabaseRecord | undefined {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    return this.database.find((s) => s.id === numId || String(s.id) === String(id));
  }

  public getAll(): SchemeDatabaseRecord[] {
    return this.database;
  }

  public getCategories(): string[] {
    const catSet = new Set<string>();
    this.database.forEach((s) => {
      if (s.category) catSet.add(s.category);
    });
    return Array.from(catSet);
  }

  public generateVoiceSummary(scheme: SchemeDatabaseRecord, langCode: LanguageCode = 'en'): string {
    return `${scheme.scheme_name}. For: ${scheme.who_is_it_for}. Main benefit: ${scheme.main_benefit}. How to apply: ${scheme.how_to_apply}.`;
  }
}

export const schemeSearchService = new SchemeSearchService();
