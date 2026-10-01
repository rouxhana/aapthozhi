import { LanguageCode } from '../types';
import { schemeSearchService } from './schemeSearchService';
import { SchemeDatabaseRecord } from '../data/schemesDatabase';

export interface GeminiResponse {
  text: string;
  source: 'gemini-api' | 'local-dataset';
  matchedScheme?: SchemeDatabaseRecord;
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM INSTRUCTION  — AapThozhi AI v2
// Rich, empathetic, expert voice assistant for Indian women.
// Answers EVERY question fully — scheme or non-scheme.
// ─────────────────────────────────────────────────────────────────────────────
const AAPTHOZHI_SYSTEM_INSTRUCTION = `
You are "AapThozhi AI" (Your Voice. Your Language. Your Support.).
You are a warm, knowledgeable, and highly empathetic voice assistant built exclusively for Indian women and girls, especially those with limited formal education or zero digital background.

══════════════════════════════════════════════
CRITICAL LANGUAGE RULES — NON-NEGOTIABLE:
══════════════════════════════════════════════
1. Detect the EXACT language and regional dialect in the user's query — Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, Urdu, or Hinglish.
2. Reply ENTIRELY in that same detected language. NEVER switch to English if the query was in a regional language.
3. Use simple, colloquial, spoken-word sentences as if speaking warmly to a neighbour or sister (5th-grade reading level).
4. Do NOT use bureaucratic jargon, legal terms, or complex compound sentences.
5. Address the user as: அக்கா (Tamil), అక్కా (Telugu), ಅಕ್ಕಾ (Kannada), ताई (Marathi), दीदी (Hindi), দিদি (Bengali), ચેद्दी (Gujarati → use 'બહેন'), ചേchchi (Malayalam), ਭੈਣ ਜੀ (Punjabi), ଭଉਣী (Odia), বাইদেউ (Assamese), بہن (Urdu), Didi (Hinglish), Sister (English).

══════════════════════════════════════════════
HOW TO ANSWER EVERY QUESTION:
══════════════════════════════════════════════

A) GOVERNMENT SCHEME QUESTIONS (welfare, scholarship, gas, pension, savings, healthcare, maternity):
   Answer in this exact order — clearly, warmly, in the user's language:
   ① What they GET (the benefit, rupee amount, what is given)
   ② Who QUALIFIES (eligibility — age, income, caste, family type)
   ③ What DOCUMENTS to carry (Aadhaar, ration card, photo, etc.)
   ④ Which PHYSICAL PLACE to walk into (Post Office, Anganwadi, Bank, CSC Centre, Panchayat Office)
   ⑤ A warm encouragement line at the end

   If you know the official government scheme referenced in [SCHEME CONTEXT], use that exact data. Do NOT invent rupee amounts or eligibility you are not sure about. If unsure, say "Your local Anganwadi or Panchayat office will confirm the exact amount."

B) GENERAL EVERYDAY QUESTIONS (health, pregnancy, child care, nutrition, legal, financial):
   Answer warmly and helpfully. Give practical, safe, clear advice. Always suggest visiting the nearest health centre or ASHA worker if it is a medical matter. Never give specific drug dosages — always say "ask the doctor."

C) SAFETY / EMERGENCY QUESTIONS (violence, fraud, threat, OTP scam, domestic abuse):
   Respond with IMMEDIATE safety information:
   - Women Helpline: 181
   - Police Emergency: 112
   - Cybercrime Helpline: 1930 (for OTP/fraud)
   - Nearest Sakhi One-Stop Centre (free shelter + legal help)
   - Reassure warmly: "You are not alone. We are with you."
   - CRITICAL: Never share OTP, UPI PIN, or account number with anyone who calls.

D) UNKNOWN / UNCLEAR QUESTIONS:
   Never say "I don't know" without helping. Instead:
   - Try to understand the intent from context clues
   - Suggest the most relevant nearby office or resource
   - Ask a gentle follow-up question to clarify: "Can you tell me a little more so I can help better?"

══════════════════════════════════════════════
OUTPUT FORMAT RULES (important for voice/TTS):
══════════════════════════════════════════════
- Write 4-6 sentences per answer (enough to be helpful, short enough for TTS to play without lag)
- End with a warm, encouraging closing sentence
- No bullet points, lists, or asterisks (this is read aloud)
- No markdown formatting
- No English words in non-English responses (except proper nouns like scheme names)

══════════════════════════════════════════════
REMEMBER:
══════════════════════════════════════════════
- You are the ONLY assistant this woman may be able to access. Be thorough, caring, and accurate.
- Every answer should feel like a trusted elder sister or knowledgeable neighbour speaking gently.
- Government schemes are always FREE to apply. Never suggest paying any middleman.
- All scheme information links to official government portals only (.gov.in, .nic.in).
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
// In-memory conversation history for multi-turn context
// ─────────────────────────────────────────────────────────────────────────────
interface ConversationTurn {
  role: 'user' | 'model';
  parts: { text: string }[];
}

class GeminiService {
  private conversationHistory: ConversationTurn[] = [];
  private maxHistoryTurns = 6; // Keep last 6 exchanges (12 messages) for context

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

  /** Clear conversation memory (e.g. when user starts a new topic) */
  public clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Call Google Gemini API (gemini-1.5-flash) with:
   * - Multi-turn conversation history for context retention
   * - Top 3 scheme matches injected as grounded context
   * - Expanded output tokens (600) for thorough multilingual answers
   * - Lower temperature (0.3) for factual accuracy
   */
  public async generateAapThozhiResponse(
    userMessage: string,
    currentLanguage?: LanguageCode,
    sessionReset = false
  ): Promise<GeminiResponse | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    if (sessionReset) this.clearHistory();

    try {
      // ── Find up to 3 matching government schemes ──────────────────────────
      const matches = schemeSearchService.search(userMessage, { limit: 3 });
      let contextInjection = '';

      if (matches && matches.length > 0) {
        contextInjection = '\n\n[VERIFIED OFFICIAL SCHEME CONTEXT — USE THIS DATA IN YOUR ANSWER]:';
        matches.slice(0, 3).forEach((s, i) => {
          contextInjection += `
Scheme ${i + 1}:
  Name: ${s.scheme_name}
  Category: ${s.category}
  Who qualifies (Eligibility): ${s.who_is_it_for}
  Main Benefit: ${s.main_benefit}
  Documents needed: ${s.documents_needed}
  Where to apply (Physical walk-in): ${s.how_to_apply}`;
        });
      }

      // ── Add language hint to prompt ───────────────────────────────────────
      const langHint = currentLanguage
        ? `\n[USER LANGUAGE PREFERENCE: ${currentLanguage} — respond ONLY in this language]`
        : '';

      const fullUserMessage = `${userMessage}${langHint}${contextInjection}`;

      // ── Add this turn to history ──────────────────────────────────────────
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: fullUserMessage }],
      });

      // Trim history to max turns (keep recent context)
      if (this.conversationHistory.length > this.maxHistoryTurns * 2) {
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryTurns * 2);
      }

      // ── Build Gemini API request with automatic model fallback ───────────
      const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.8-flash'];
      let candidateText: string | null = null;

      for (const model of GEMINI_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: AAPTHOZHI_SYSTEM_INSTRUCTION }],
              },
              contents: this.conversationHistory,
              generationConfig: {
                temperature: 0.3,           // Factual accuracy for scheme data
                maxOutputTokens: 600,        // Enough for thorough multilingual answers
                topP: 0.85,
                topK: 40,
              },
              safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
              ],
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (text) {
              candidateText = text;
              break; // Successful response received!
            }
          } else {
            console.warn(`[GeminiService] Model ${model} returned ${response.status}, attempting fallback...`);
          }
        } catch (modelErr) {
          console.warn(`[GeminiService] Model ${model} failed, trying next fallback:`, modelErr);
        }
      }

      if (candidateText) {
        // Add model response to history for multi-turn context
        this.conversationHistory.push({
          role: 'model',
          parts: [{ text: candidateText }],
        });

        return {
          text: candidateText,
          source: 'gemini-api',
          matchedScheme: matches.length > 0 ? matches[0] : undefined,
        };
      }

      // If all models failed, remove the user turn from history so it doesn't pollute next turn
      this.conversationHistory.pop();
      return null;
    } catch (err) {
      console.warn('[GeminiService] Network or parsing error:', err);
      // Remove failed turn from history
      if (this.conversationHistory.length > 0) {
        this.conversationHistory.pop();
      }
      return null;
    }
  }

  /**
   * Quick single-shot call (no history) for suggestions / scheme lookups.
   * Uses cascading fallback across Gemini models.
   */
  public async quickAnswer(prompt: string, lang: LanguageCode = 'hi'): Promise<string | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.8-flash'];

    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: AAPTHOZHI_SYSTEM_INSTRUCTION }] },
            contents: [{ role: 'user', parts: [{ text: `${prompt}\n[RESPOND IN LANGUAGE: ${lang}]` }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 300 },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) return text;
        }
      } catch {
        // Try next model
      }
    }

    return null;
  }
}

export const geminiService = new GeminiService();
