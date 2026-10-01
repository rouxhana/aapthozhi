# AapThozhi (ஆப்தோழி / आपथोझी)
### *Aapki Bhasha. Aapka Haq. AapThozhi.*
> **"AapThozhi is a voice-first, icon-first, multilingual support companion that helps women access essential services through the language they already speak."**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com)

---

## 🌸 Product Name & Brand Meaning

**AapThozhi** (*"Aap"* in Hindi/Urdu = Respectful "You"; *"Thozhi"* in Tamil = "Female Friend / Companion") translates to:
> **"Your Trusted Female Friend."**

AapThozhi is designed to feel like a patient, trustworthy, privacy-aware, and supportive sister for Indian women navigating government welfare schemes, maternal healthcare grants, daughter education stipends, senior pensions, and skill development opportunities.

* **Primary Tagline:** *"Aapki Bhasha. Aapka Haq. AapThozhi."*
* **English Tagline:** *"Your voice. Your language. Your support."*
* **Core Product Promise:** A woman should not need to know English, read complex legal forms, memorize government scheme acronyms, or master smartphone menus before receiving help.

AapThozhi moves her from:
$$\text{“My problem”} \longrightarrow \text{“Relevant support”} \longrightarrow \text{“Documents needed”} \longrightarrow \text{“Official link or nearby offline help”} \longrightarrow \text{“One safe next step.”}$$

---

## 🎯 Problem Statement

Over 350 million women across India face formidable barriers when attempting to access essential public welfare and social security entitlements:
1. **Language Barrier:** Government portals and forms are predominantly in formal English or bureaucratic state registers full of complex administrative jargon.
2. **Digital Literacy Gap:** Complex nested menus, captcha codes, and confusing input fields intimidate first-time smartphone users.
3. **Information Fragmentation:** Schemes like *Beti Padhao*, *Matru Vandana*, and *Old Age Pensions* are spread across disjointed portals with conflicting document requirements.
4. **Fraud & Middlemen Exploitation:** Unscrupulous touts often demand extortionate commissions or steal sensitive credentials (OTP, UPI PINs, Passwords) under the guise of "application assistance".

---

## 💡 Solution Overview

AapThozhi re-imagines civic tech through an **empathetic, voice-guided, icon-first companion** engineered specifically for women with low digital literacy:

```
┌────────────────────────────────────────────────────────┐
│               AapThozhi User Experience                │
└────────────────────────────────────────────────────────┘
                           │
       1. Spoken Voice in ANY Indian Language
                           ▼
          [ Language Detective Engine ]
        (Zero default language bias; automatic detection)
                           │
                           ▼
          [ Regional Language Assist (GPS) ]
        (Privacy-first consent; nearby centre discovery)
                           │
                           ▼
          [ Voice-Guided Login / Guest Mode ]
                           │
                           ▼
                 [ Home Screen & Hero ]
      (4 Core Cards: Education, Maternity, Pension, Health)
                           │
                           ▼
          [ Scheme Action Card & Document Checklist ]
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      [ Route A: Online ]       [ Route B: Offline ]
   - Verified gov.in link    - 5-step visual roadmap
   - Anti-fraud warning      - Local help centres (Anganwadi/CSC)
   - Preparation list        - "What to say when you go" Card
```

---

## ♿ Accessibility Approach: *“Dekho, Suno, Karo”*

**“Dekho, Suno, Karo” (See it. Hear it. Do it.)** is the core design philosophy of AapThozhi:
* **Dekho (See it):** Every action is anchored by a recognizable, high-contrast visual illustration (e.g., student with school bag, mother with baby, walking stick, medical cross). Color is never the sole indicator of meaning.
* **Suno (Hear it):** Every heading, input box, scheme benefit, document requirement, and notification features an interactive speaker button. On click, voice synthesis speaks clearly in the user's selected native language.
* **Karo (Do it):** The interface limits choices to **one simple decision at a time**, eliminating confusing multi-column forms and cognitive overload.

---

## 🌟 Key Features

### 1. Mandatory First Screen: Language Detective
Before encountering login prompts, sign-up forms, or complex menus, the user lands directly on the **Language Detective screen**:
* Large glowing central microphone with pulsating sound waves.
* **No forced default language** (neither English nor Hindi).
* Spoken voice input is instantly transcribed and analyzed to detect native language and dialect.
* **High Confidence Confirmation Card:** Displays detected language name in native script (e.g., *தமிழ்*, *हिन्दी*, *বাংলা*, *తెలుగు*) with an option to continue, change, or speak again.
* **Low Confidence Recovery Flow:** If speech is unclear, it presents the top 3 likely languages with audio sample buttons rather than guessing incorrectly.
* **Judge/Developer Voice Demo Drawer:** Discreet evaluator drawer enabling quick testing of preset spoken inputs across all 14 supported languages.

### 2. Regional Language Assist & GPS Consent
* Appears immediately after language confirmation.
* Optional, approximate location permission only.
* Never used to force or decide a user's language.
* Helps discover nearby physical public facilitation centres (Anganwadis, Seva Sahayata Kendras, Gram Panchayats, CSCs) and surfaces regional languages spoken in that state.
* Clear reassurance: *"No problem. You can still continue without location access."*

### 3. Voice-Guided Login & Guest Access
* Simple 2-step journey (`Step 1 of 2`).
* 10-digit mobile number input with numeric keypad optimization.
* **Continue as Guest option:** Allows immediate exploration of all welfare schemes without creating an account.
* **Anti-Fraud Security Architecture:** Clear warnings that AapThozhi will **never** request ATM PINs, UPI PINs, or bank passwords.

### 4. Interactive Voice Chat & Confusion Recovery
* Conversational interface with conversational bubble cards.
* **"Change what I said":** Allows the user to correct misrecognized speech with a single tap.
* **"Say that again":** Immediate replay of the assistant's previous explanation.
* **"Explain slowly" 🐢:** Breaks the explanation down into bite-sized single steps with large icons and reduces audio playback speed to 0.75x for effortless comprehension.

### 5. Two Equal Next-Step Routes
For every welfare scheme, AapThozhi offers two equal, prominent routes:
* **Route A: Online Route:**
  * Verified official portal links (e.g., `scholarships.gov.in`, `pmmvy.wcd.gov.in`).
  * Pre-application readiness checklist.
  * Safe redirection confirmation modal with zero credentials harvesting.
* **Route B: Offline Route:**
  * Visual 5-step plan: *1. Where to go*, *2. Who can help*, *3. What to carry*, *4. What to say*, *5. When to check again*.
  * Directory of nearby centres with walking/auto distances, working hours, and phone numbers.

### 6. Standout Feature: "What to Say When You Go" Card
* Generates a tailored, culturally respectful script in the user's native language.
* Actions available at the counter:
  * 🔊 **Play Aloud:** Plays the spoken request through the phone speaker directly at the enquiry desk.
  * 🔲 **Full-Screen Card:** Displays huge, high-contrast lettering so the user can simply show their screen to the clerk.
  * 📲 **Share & Copy:** Allows sending the exact query to a family member or community helper.

### 7. "Point and Ask" Document Camera Scanner
* A visual document guidance tool.
* Explains papers such as Aadhaar, Bank Passbooks, School Bonafide Certificates, and official letters.
* Informs the user whether each document is needed for her current welfare goal.

### 8. Trusted Helper Network & Privacy Controls
* Allows sharing only the approved next step with an ASHA worker, Sakhi SHG leader, or family member.
* **Private Mode:** Completely turns off conversation history logging.
* Single-touch history and saved plans deletion.

---

## 🇮🇳 Supported Languages (14 Languages & Dialects)

AapThozhi includes native translations and voice synthesis across:
1. **Tamil (தமிழ்)** — *உங்கள் குரல். உங்கள் உரிமை. ஆப்தோழி.*
2. **Hindi (हिन्दी)** — *आपकी भाषा। आपका हक। आपथोझी।*
3. **Bengali (বাংলা)** — *আপনার ভাষা। আপনার অধিকার। আপথোঝি।*
4. **Telugu (తెలుగు)** — *మీ భాష. మీ హక్కు. ఆప్తొళి.*
5. **Marathi (मराठी)** — *तुमची भाषा. तुमचा हक्क. आपथोझी.*
6. **Kannada (ಕನ್ನಡ)** — *ನಿಮ್ಮ ಭಾಷೆ. ನಿಮ್ಮ ಹಕ್ಕು. ಆಪ್ತೋಝಿ.*
7. **Gujarati (ગુજરાતી)** — *તમારી ભાષા. તમારો હક. આપથોઝી.*
8. **Malayalam (മലയാളം)** — *നിങ്ങളുടെ ഭാഷ. നിങ്ങളുടെ അവകാശം. ആപ്തോഴി.*
9. **Punjabi (ਪੰਜਾਬੀ)** — *ਤੁਹਾਡੀ ਭਾਸ਼ਾ। ਤੁਹਾਡਾ ਹੱਕ। ਆਪਥੋਜ਼ੀ।*
10. **Odia (ଓଡ଼ିଆ)** — *ଆପଣଙ୍କ ଭାଷା। ଆପଣଙ୍କ ଅଧିକାର। ଆପଥୋଝି।*
11. **Assamese (অসমীয়া)** — *আপোনাৰ ভাষা। আপোনাৰ অধিকাৰ। আপথোঝি।*
12. **Urdu (اردو)** — *آپ کی زبان۔ آپ کا حق۔ آپ تھوزی۔*
13. **Hinglish** — *Aapki Bhasha. Aapka Haq. AapThozhi.*
14. **English** — *Your voice. Your language. Your support.*

---

## 🎨 Visual Design System

* **Midnight Blue Base:** `#0B1026`
* **Deep Navy Surfaces:** `#0D1333`
* **Card Elevation:** `#131A3B` / `#161F48`
* **Amethyst Accent:** `#9B5DE5`
* **Lilac Pink Accent:** `#F3A6C8`
* **Soft Amethyst:** `#C9A7FF`
* **Success Green:** `#45C27C`
* **Safety Coral:** `#EF6A7B`
* **Muted Text:** `#B7BDD3`
* **Typography:** Google Fonts *Outfit* paired with *Noto Sans* for Devanagari, Tamil, Bengali, Telugu, Kannada, and Gurmukhi scripts.

---

## 🛠 Tech Stack

* **Frontend Framework:** React 19 + TypeScript
* **Build Tool:** Vite 6
* **Styling:** Tailwind CSS v4 with custom theme tokens
* **Icons:** Lucide React
* **Speech Synthesis:** Web Speech API (`window.speechSynthesis`) with visual sound-wave fallback
* **Delight & Animations:** Canvas Confetti + Custom CSS soundwave animations
* **Local State & Persistence:** Browser LocalStorage API (zero backend tracking for privacy)

---

## 🚀 Local Setup Instructions

### Prerequisites
* Node.js (v18 or higher recommended)
* npm (v9 or higher)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rouxhana/aapthozhi.git
   cd aapthozhi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to: `http://localhost:5173/`

4. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 📱 Interactive Demo Walkthrough (For Hackathon Judges)

Follow this 2-minute journey to test the complete application:
1. **Land on Screen 1 (Language Detective):** Tap the large pulsing microphone or open *Demo voice examples* at the bottom and choose **Tamil (தமிழ்)** or **Hindi (हिन्दी)**.
2. **Observe Language Detection:** View the high-confidence confirmation card with native script and audio readout. Tap **"Yes, continue"**.
3. **Regional Language Assist:** Choose **"Allow location"** to view nearby state recommendations (e.g., Chennai / Tamil Nadu) and tap **"Continue to Secure Login"**.
4. **Secure Login:** Click the handy *Use demo phone number* shortcut, tap **"Get OTP Code"**, tap *Auto-fill Demo OTP (4826)*, and tap **"Verify & Continue"**.
5. **Notification Tutorial:** Listen to a sample audio update and tap **"Continue to Home"**.
6. **Home Dashboard:** Tap the **"Education"** card (or tap the central mic and select *"I need help for my daughter's education"*).
7. **Scheme Action Card:** Inspect the required documents checklist. Tap the **"Explain slowly" 🐢** button to experience bite-sized steps with slower voice delivery.
8. **Explore Next Routes:**
   * Select **Route A (Online):** Review the preparation checklist and anti-fraud warning.
   * Select **Route B (Offline):** Explore the 5-step visual roadmap, select **Seva Sahayata Kendra**, and tap **"Show this request"**.
9. **Counter Message Card:** Try **"Play Aloud"** or **"Show Full-Screen"** designed for counter desks.
10. **Save Plan & Test Notifications:** Tap **"Save plan for later"** to see celebration confetti. Then open the **Notification Bell** in the top bar to hear your saved plan read aloud!
11. **Switch Languages Live:** Click the globe icon in the header, select **Hindi** or **Bengali**, and watch all interface labels update instantly.

---

## 🛡 Privacy & Safety Principles

1. **No Sensitive Data Retention:** AapThozhi does not collect or store Aadhaar OTPs, bank passwords, or financial credentials.
2. **Approximate Location Only:** Location permissions are used strictly to calculate approximate travel distance to public helpdesks and prioritize regional speech dictionaries.
3. **Zero Tracking:** All state and preferences are stored in the user's local browser memory.
4. **Transparent Prototype Disclaimer:** All scheme guidelines are clearly designated as prototype assistance, encouraging users to verify eligibility with official government centres.

---

## 🔮 Future Roadmap

* **On-Device Whisper/STT Model:** Integrating small offline multilingual speech models for zero-connectivity rural environments.
* **Direct ASHA Worker Tele-Voice Handoff:** Connecting women directly with verified local community workers via IVR voice bridges.
* **DigiLocker Integration:** Secure, consent-based document verification via official open APIs.
* **WhatsApp Assistance Bot:** Complementary WhatsApp voice-note companion for non-smartphone users.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
