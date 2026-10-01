import { SchemeInfo, DocumentItem, LanguageCode } from '../types';
import { CURATED_SCHEMES_2025, CuratedGovScheme } from '../data/curatedSchemes';
import { SCHEMES_DATA } from '../data/schemes';

export interface SchemeQueryOptions {
  query?: string;
  category?: string;
  state?: string;
  gender?: 'female' | 'male' | 'all';
  limit?: number;
  language?: LanguageCode;
}

// Multilingual phonetic and native synonym dictionary
const MULTILINGUAL_SYNONYMS: Record<string, string[]> = {
  education: [
    'education', 'scholarship', 'school', 'college', 'student', 'study', 'books', 'vidya',
    // Telugu
    'chaduvu', 'pathashala', 'vidyarthi', 'vidyanidhi', 'ammavodi', 'చదువు', 'పాఠశాల', 'విద్యార్థి',
    // Tamil
    'kalvi', 'padipu', 'palli', 'kalluri', 'udavithogai', 'கல்வி', 'படிப்பு', 'பள்ளி',
    // Kannada
    'shikshana', 'shaale', 'vidyarthivethana', 'odhu', 'ಶಿಕ್ಷಣ', 'ಶಾಲೆ', 'ವಿದ್ಯಾರ್ಥಿವೇತನ',
    // Marathi
    'shikshan', 'shala', 'shishyavrutti', 'shikshanasathi', 'शिक्षण', 'शाळा', 'शिष्यवृत्ती',
    // Hindi
    'padhai', 'shiksha', 'chhatravritti', 'vidyalaya', 'पढ़ाई', 'शिक्षा', 'छात्रवृत्ति',
  ],
  maternity: [
    'maternity', 'pregnant', 'mother', 'child', 'girl', 'baby', 'delivery', 'kanya', 'sukanya',
    // Telugu
    'ammaayi', 'prasavam', 'thalli', 'bidda', 'ammayi', 'అమ్మాయి', 'తల్లి', 'బిడ్డ',
    // Tamil
    'magal', 'thaai', 'pen', 'kuzhandhai', 'magalir', 'மகள்', 'தாய்', 'பெண்', 'குழந்தை',
    // Kannada
    'magalu', 'taayi', 'hennu', 'makkalu', 'ಮಗಳು', 'ತಾಯಿ', 'ಹೆಣ್ಣು', 'ಮಕ್ಕಳು',
    // Marathi
    'mulgi', 'aai', 'kanya', 'prasuti', 'mulisathi', 'मुलगी', 'आई', 'कन्या', 'प्रसूती',
    // Hindi
    'beti', 'kanya', 'prasuti', 'maa', 'shishu', 'बेटी', 'कन्या', 'प्रसूति', 'माँ',
  ],
  pension: [
    'pension', 'elderly', 'senior', 'old age', 'widow', 'destitute', 'retirement',
    // Telugu
    'pinchanu', 'vruddhulu', 'vidhavalu', 'పింఛను', 'వృద్ధులు', 'విధవ',
    // Tamil
    'muthiyor', 'oivuthiyam', 'kaimpen', 'ஓய்வூதியம்', 'முதியோர்', 'கைம்பெண்',
    // Kannada
    'pension', 'vruddha', 'vidhava', 'ಪಿಂಚಣಿ', 'ವೃದ್ಧಾಪ್ಯ',
    // Marathi
    'nivruttivetan', 'vruddha', 'vidhwa', 'पेन्शन', 'निवृत्तिवेतन', 'वृद्ध', 'विधवा',
    // Hindi
    'pension', 'vriddha', 'vidhwa', 'buzurg', 'पेंशन', 'वृद्धावस्था', 'विधवा', 'बुजुर्ग',
  ],
  health: [
    'health', 'medical', 'hospital', 'treatment', 'ayushman', 'medicine', 'doctor', 'card',
    // Telugu
    'aarogya', 'vaidyam', 'asupathri', 'ఆరోగ్యం', 'వైద్యం', 'ఆసుపత్రి',
    // Tamil
    'maruthuva', 'sugadharam', 'maruthuvamanai', 'மருத்துவம்', 'சுகாதாரம்', 'மருத்துவமனை',
    // Kannada
    'aarogya', 'vaidya', 'aaspathre', 'ಆರೋಗ್ಯ', 'ವೈದ್ಯಕೀಯ', 'ಆಸ್ಪತ್ರೆ',
    // Marathi
    'arogya', 'aushadh', 'rugnalaya', 'आरोग्य', 'औषध', 'रुग्णालय',
    // Hindi
    'swasthya', 'ilaj', 'dawa', 'aspatal', 'स्वास्थ्य', 'इलाज', 'दवा', 'अस्पताल',
  ],
  agriculture: [
    'agriculture', 'farmer', 'kisan', 'krishi', 'crop', 'soil', 'irrigation', 'seeds',
    // Telugu
    'rythu', 'vyavasayam', 'panta', 'రైతు', 'వ్యవసాయం', 'పంట',
    // Tamil
    'vivasaayam', 'vivasaayi', 'payir', 'விவசாயம்', 'விவசாயி', 'பயிர்',
    // Kannada
    'krishi', 'raitha', 'bele', 'ಕೃಷಿ', 'ರೈತ', 'ಬೆಳೆ',
    // Marathi
    'shetkari', 'sheti', 'pik', 'शेतकरी', 'शेती', 'पीक',
    // Hindi
    'kisan', 'kheti', 'fasal', 'किसान', 'खेती', 'फसल',
  ],
  skills: [
    'skill', 'employment', 'job', 'training', 'livelihood', 'rojar', 'work',
    // Telugu
    'nipunyatha', 'udyogam', 'shikshana', 'నైపుణ్యం', 'ఉద్యోగం',
    // Tamil
    'thiran', 'velai', 'payirchi', 'திறன்', 'வேலைவாய்ப்பு', 'பயிற்சி',
    // Kannada
    'koushalya', 'udyoga', 'ತರಬೇತಿ', 'ಕೌಶಲ್ಯ', 'ಉದ್ಯೋಗ',
    // Marathi
    'kaushalya', 'rojgar', 'prashikshan', 'कौशल्य', 'रोजगार', 'प्रशिक्षण',
    // Hindi
    'kaushal', 'rojgar', 'prashikshan', 'naukri', 'कौशल', 'रोजगार', 'प्रशिक्षण',
  ],
};

class SchemeDatabaseService {
  private allSchemes: SchemeInfo[] = [];
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  constructor() {
    // Immediately seed with curated and baseline schemes
    this.seedBaselineSchemes();
    // Then attempt background loading of the full 4,693 scheme database
    this.loadFullDatabase();
  }

  private seedBaselineSchemes() {
    const convertedCurated: SchemeInfo[] = CURATED_SCHEMES_2025.map((c) => this.curatedToSchemeInfo(c));
    this.allSchemes = [...SCHEMES_DATA, ...convertedCurated];
  }

  private async loadFullDatabase(): Promise<void> {
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      try {
        if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
          const res = await fetch('/data/schemes_database_2025.json');
          if (res.ok) {
            const rawList: any[] = await res.json();
            const convertedList: SchemeInfo[] = rawList.map((r) => this.rawRecordToSchemeInfo(r));
            // Merge deduplicating by id
            const existingIds = new Set(SCHEMES_DATA.map((s) => s.id));
            const newOnes = convertedList.filter((s) => !existingIds.has(s.id));
            this.allSchemes = [...SCHEMES_DATA, ...newOnes];
            this.isLoaded = true;
            console.log(`[SchemeDatabaseService] Successfully imported ${this.allSchemes.length} schemes into database.`);
          }
        }
      } catch (err) {
        console.warn('[SchemeDatabaseService] Offline or fallback mode. Using bundled schemes.', err);
      }
    })();

    return this.loadPromise;
  }

  private curatedToSchemeInfo(c: CuratedGovScheme): SchemeInfo {
    const docs = this.generateDocumentList(c.documentsRequired);
    const category = (c.standardCategory || 'social') as SchemeInfo['category'];

    return {
      id: c.id,
      category,
      title: c.name,
      description: c.description || c.benefits,
      tagline: `${c.state} • ${c.ministry || c.category}`,
      benefits: c.benefits ? c.benefits.split('. ').filter(Boolean).slice(0, 3) : ['Financial and welfare support from Government.'],
      eligibility: c.eligibilityText ? c.eligibilityText.split('. ').filter(Boolean).slice(0, 3) : ['Eligible Indian citizens per scheme guidelines.'],
      documents: docs,
      officialUrl: c.officialUrl || c.applyUrl || 'https://www.myscheme.gov.in',
      officialPortalName: c.state === 'Central' ? 'National Government Portal' : `${c.state} State Portal`,
      offlineCenterTypes: ['seva-kendra', 'anganwadi', 'csc'],
      whatToSayText: `I am applying for ${c.name}. Here are my identity and required documents. Please guide me with the application form.`,
      slowExplanationSteps: [
        {
          stepNumber: 1,
          title: 'Check Eligibility',
          description: `Confirm you meet criteria for ${c.name}.`,
          icon: '✅',
        },
        {
          stepNumber: 2,
          title: 'Collect Documents',
          description: 'Keep your Aadhaar card, bank passbook, and study/income certificates ready.',
          icon: '📁',
        },
        {
          stepNumber: 3,
          title: 'Visit Nearest Centre or Apply Online',
          description: 'Submit your form at Seva Kendra / CSC or online via official portal.',
          icon: '🏢',
        },
      ],
    };
  }

  private rawRecordToSchemeInfo(r: any): SchemeInfo {
    const docs = this.generateDocumentList(r.documentsRequired);
    const category = (r.standardCategory || 'social') as SchemeInfo['category'];

    return {
      id: r.id,
      category,
      title: r.name,
      description: r.description || r.benefits || '',
      tagline: `${r.state || 'India'} • ${r.ministry || r.category}`,
      benefits: r.benefits ? r.benefits.split('. ').filter(Boolean).slice(0, 3) : ['Direct Government financial/welfare support.'],
      eligibility: r.eligibilityText ? r.eligibilityText.split('. ').filter(Boolean).slice(0, 3) : ['Eligible as per department criteria.'],
      documents: docs,
      officialUrl: r.officialUrl || r.applyUrl || 'https://www.myscheme.gov.in',
      officialPortalName: r.state === 'Central' ? 'Government of India Portal' : `${r.state} Portal`,
      offlineCenterTypes: ['seva-kendra', 'anganwadi', 'csc'],
      whatToSayText: `I want to apply for ${r.name}. I have brought my documents. Please help me submit.`,
      slowExplanationSteps: [
        {
          stepNumber: 1,
          title: 'Document Verification',
          description: 'Carry Aadhaar, ration card, and bank account passbook.',
          icon: '📁',
        },
        {
          stepNumber: 2,
          title: 'Application Submission',
          description: 'Submit application online or at your ward Seva Kendra / CSC centre.',
          icon: '🏢',
        },
        {
          stepNumber: 3,
          title: 'Track Acknowledgment',
          description: 'Collect your receipt acknowledgment slip with reference number.',
          icon: '📄',
        },
      ],
    };
  }

  private generateDocumentList(docsRaw?: string): DocumentItem[] {
    const list: DocumentItem[] = [];
    const text = (docsRaw || '').toLowerCase();

    list.push({
      id: 'doc-aadhaar',
      name: 'Aadhaar Card',
      description: 'Proof of identity with current photo & name',
      iconType: 'id-card',
      isRequired: true,
      helpTip: 'Ensure name matches bank account.',
    });

    list.push({
      id: 'doc-bank',
      name: 'Bank Passbook',
      description: 'Account linked with Aadhaar for direct benefit transfer (DBT)',
      iconType: 'bank-passbook',
      isRequired: true,
      helpTip: 'First page showing account number and IFSC code.',
    });

    if (text.includes('study') || text.includes('bonafide') || text.includes('marks') || text.includes('education') || text.includes('school')) {
      list.push({
        id: 'doc-study',
        name: 'Bonafide / Study Certificate',
        description: 'Issued by current school or college principal',
        iconType: 'certificate',
        isRequired: true,
        helpTip: 'Must have seal and signature of institution.',
      });
    }

    if (text.includes('income') || text.includes('salary') || text.includes('bpl')) {
      list.push({
        id: 'doc-income',
        name: 'Income Certificate / Ration Card',
        description: 'Proof of household annual income or BPL / Antyodaya card',
        iconType: 'certificate',
        isRequired: false,
        helpTip: 'Can be obtained from Taluk office or Gram Panchayat.',
      });
    }

    if (text.includes('photo') || list.length < 3) {
      list.push({
        id: 'doc-photo',
        name: 'Passport Size Photographs (2)',
        description: 'Recent color photos of applicant',
        iconType: 'photo',
        isRequired: true,
        helpTip: 'Keep 2 extra copies for office records.',
      });
    }

    return list;
  }

  /**
   * Search and filter schemes according to user request
   */
  public querySchemes(options: SchemeQueryOptions = {}): SchemeInfo[] {
    const { query, category, state, gender, limit = 24 } = options;

    let results = [...this.allSchemes];

    // Filter by State if specified
    if (state && state !== 'all') {
      const lowerState = state.toLowerCase();
      results = results.filter((s) => {
        const sTag = (s.tagline || '').toLowerCase();
        return sTag.includes(lowerState) || sTag.includes('central') || lowerState.includes('tamil') && sTag.includes('tamil');
      });
    }

    // Filter by Category if specified
    if (category && category !== 'all') {
      results = results.filter((s) => s.category === category);
    }

    // Query text match with multilingual synonym expansion
    if (query && query.trim() !== '') {
      const cleanQ = query.trim().toLowerCase();
      const queryTokens = cleanQ.split(/\s+/).filter(Boolean);

      // Check which concept categories the user's query maps to
      const matchedCategories: string[] = [];
      for (const [catName, synonyms] of Object.entries(MULTILINGUAL_SYNONYMS)) {
        for (const token of queryTokens) {
          if (synonyms.some((syn) => token.includes(syn) || syn.includes(token))) {
            matchedCategories.push(catName);
            break;
          }
        }
      }

      results = results
        .map((scheme) => {
          let score = 0;
          const sTitle = scheme.title.toLowerCase();
          const sDesc = scheme.description.toLowerCase();
          const sTag = scheme.tagline.toLowerCase();

          // Direct token match
          for (const token of queryTokens) {
            if (sTitle.includes(token)) score += 10;
            else if (sDesc.includes(token)) score += 4;
            else if (sTag.includes(token)) score += 3;
          }

          // Synonym category boost
          if (matchedCategories.includes(scheme.category)) {
            score += 8;
          }

          // Women / Girl priority boost for AapThozhi target audience
          if (
            sTitle.includes('girl') ||
            sTitle.includes('woman') ||
            sTitle.includes('women') ||
            sTitle.includes('mahila') ||
            sTitle.includes('kanya') ||
            sTitle.includes('daughter') ||
            sTitle.includes('sukanya')
          ) {
            score += 6;
          }

          return { scheme, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.scheme);
    }

    // If query resulted in no matches, provide high-priority baseline schemes
    if (results.length === 0) {
      results = this.allSchemes.slice(0, limit);
    }

    return results.slice(0, limit);
  }

  public getSchemeById(id: string): SchemeInfo | undefined {
    return this.allSchemes.find((s) => s.id === id);
  }

  public getTotalCount(): number {
    return this.allSchemes.length;
  }

  public isFullyLoaded(): boolean {
    return this.isLoaded;
  }
}

export const schemeDatabaseService = new SchemeDatabaseService();
