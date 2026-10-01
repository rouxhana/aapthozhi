import { LanguageCode } from '../types';
import { schemeSearchService } from './schemeSearchService';
import { SchemeDatabaseRecord } from '../data/schemesDatabase';

export interface GeminiResponse {
  text: string;
  source: 'gemini-api' | 'local-dataset';
  matchedScheme?: SchemeDatabaseRecord;
}

const AAPTHOZHI_SYSTEM_INSTRUCTION = `You are "AapThozhi AI" (Your Voice. Your Language. Your Support.), a highly empathetic, natural voice assistant built specifically for Indian women and girls with limited formal education or zero digital background.

CRITICAL RULES FOR ALL RESPONSES (NON-NEGOTIABLE):
1. Identify the exact language and regional dialect used by the user in their query (e.g., Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, Urdu, Hinglish).
2. You MUST write your entire response ONLY in that detected native language. Never reply in English if the query was in a regional Indian language.
3. Use simple, colloquial, spoken-word styling (5th-grade reading level). Do not use academic terms, complex sentences, or official bureaucratic jargon.
4. SCHEME INQUIRIES: If the query matches an Indian welfare or educational scheme, state clearly:
   - What they get (Benefits)
   - Who qualifies (Eligibility)
   - What physical place they must walk into to apply (e.g., Post Office, Anganwadi Centre, Panchayat Office, Bank).
5. GENERAL INQUIRIES: If the user asks general everyday questions (health advice, pregnancy, legal support, household calculations, child care), answer comprehensively and reliably in their native language. Keep it warm, clear, and reassuring.
6. OUTPUT STRUCTURE: Format the response to be highly readable for Text-To-Speech synthesis engines. Keep responses under 4 sentences total so the audio does not time out or buffer.`;

class GeminiService {
  /**
   * Retrieves the Gemini API Key from:
   * 1. Vite Environment Variable (VITE_GEMINI_API_KEY in .env)
   * 2. Browser LocalStorage (fallback for live demo settings)
   */
  public getApiKey(): string {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey && envKey.trim() !== '' && !envKey.includes('your_key_here')) {
      return envKey.trim();
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aapthozhi_gemini_api_key');
      if (stored && stored.trim() !== '') {
        return stored.trim();
      }
    }
    return '';
  }

  public setApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aapthozhi_gemini_api_key', key.trim());
    }
  }

  public isAvailable(): boolean {
    return this.getApiKey().length > 0;
  }

  /**
   * Call Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)
   */
  public async generateAapThozhiResponse(
    userMessage: string,
    currentLanguage?: LanguageCode
  ): Promise<GeminiResponse | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    try {
      // Find relevant government schemes to inject as grounded context
      const matches = schemeSearchService.search(userMessage, { limit: 2 });
      let contextInjection = '';

      if (matches && matches.length > 0) {
        const s = matches[0];
        contextInjection = `\n\n[OFFICIAL INDIAN SCHEME CONTEXT FOR REFERENCE]:
Scheme Name: ${s.scheme_name}
Category: ${s.category}
Who is it for (Eligibility): ${s.who_is_it_for}
Main Benefit: ${s.main_benefit}
Documents Needed: ${s.documents_needed}
How to Apply (Physical Walk-in Office): ${s.how_to_apply}`;
      }

      const promptWithContext = `${userMessage}${contextInjection}`;

      // Call Google Gemini API endpoint
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: AAPTHOZHI_SYSTEM_INSTRUCTION }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: promptWithContext }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 250,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('[GeminiService] API call failed:', response.status, errorData);
        return null;
      }

      const data = await response.json();
      const candidateText =
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (candidateText) {
        return {
          text: candidateText,
          source: 'gemini-api',
          matchedScheme: matches.length > 0 ? matches[0] : undefined,
        };
      }

      return null;
    } catch (err) {
      console.warn('[GeminiService] Network or parsing error:', err);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
