import { LanguageCode } from '../types';
import { voiceDetectionService } from './voiceDetectionService';
import { schemeSearchService } from './schemeSearchService';
import { SchemeDatabaseRecord } from '../data/schemesDatabase';

export interface AapThozhiAIResponse {
  detectedLanguage: LanguageCode;
  languageName: string;
  responseText: string;
  audioText: string;
  matchedScheme?: SchemeDatabaseRecord;
  actionCategory?: 'scheme' | 'health' | 'safety' | 'general';
}

/**
 * AapThozhi AI (Your Voice. Your Language. Your Support.)
 * Empathetic natural voice assistant for women and girls.
 * Adheres strictly to:
 * 1. Responding ONLY in the detected user's regional language.
 * 2. Colloquial spoken 5th-grade styling without jargon.
 * 3. Exact 3-4 sentence structure for fast, zero-buffer TTS playback.
 * 4. Stating Benefits, Eligibility, and Physical office for schemes.
 */
class AapThozhiAIService {
  /**
   * Main AI response handler
   */
  public generateResponse(
    userQuery: string,
    preferredLang?: LanguageCode
  ): AapThozhiAIResponse {
    const cleanQuery = (userQuery || '').trim();

    // 1. Detect exact language and regional script
    const detection = voiceDetectionService.classifyLanguageFromText(cleanQuery, preferredLang || 'ta');
    const lang = detection.detectedLang;

    // 2. Check for matching welfare/educational scheme
    const matchedSchemes = schemeSearchService.search(cleanQuery, { limit: 3 });
    const topScheme = matchedSchemes && matchedSchemes.length > 0 ? matchedSchemes[0] : null;

    // Is it a specific scheme match?
    const isSchemeQuery = this.checkIsSchemeQuery(cleanQuery, topScheme);

    if (isSchemeQuery && topScheme) {
      const schemeReply = this.generateSchemeReply(topScheme, lang);
      return {
        detectedLanguage: lang,
        languageName: detection.scriptName,
        responseText: schemeReply,
        audioText: schemeReply,
        matchedScheme: topScheme,
        actionCategory: 'scheme',
      };
    }

    // 3. General Inquiries (Health, Legal, Safety, Household calculations)
    const generalReply = this.generateGeneralReply(cleanQuery, lang);
    return {
      detectedLanguage: lang,
      languageName: detection.scriptName,
      responseText: generalReply.text,
      audioText: generalReply.text,
      actionCategory: generalReply.category,
    };
  }

  private checkIsSchemeQuery(query: string, topScheme: SchemeDatabaseRecord | null): boolean {
    if (!topScheme) return false;
    const q = query.toLowerCase();
    const schemeWords = [
      'scheme', 'yojana', 'pension', 'scholarship', 'gas', 'cylinder', 'sewing',
      'sukanya', 'ssy', 'ujjwala', 'pragati', 'matru', 'vandana', 'silai', 'ayushman',
      'card', 'money', 'help', 'grant', 'allowance', 'benefit', 'apply', 'form',
      // Vernacular triggers
      'திட்டம்', 'உதவித்தொகை', 'பணம்', 'பள்ளி',
      'పథకం', 'సహాయం', 'డబ్బు', 'చదువు', 'పింఛను',
      'योजना', 'मदत', 'पैसे', 'शाळा', 'शिक्षण', 'पेन्शन',
      'योजना', 'सहायता', 'पैसे', 'छात्रवृत्ति', 'पेंशन',
      'ಯೋಜನೆ', 'ಸಹಾಯ', 'ಹಣ', 'ವಿದ್ಯಾರ್ಥಿವೇತನ',
    ];
    return schemeWords.some((w) => q.includes(w));
  }

  /**
   * Generates a 3-sentence colloquial scheme response:
   * 1. What they get (Benefits)
   * 2. Who qualifies (Eligibility)
   * 3. Where to walk into (Physical office)
   */
  private generateSchemeReply(scheme: SchemeDatabaseRecord, lang: LanguageCode): string {
    const sName = scheme.scheme_name;
    const sBenefit = scheme.main_benefit;
    const sWho = scheme.who_is_it_for;
    const sOffice = scheme.how_to_apply;

    switch (lang) {
      case 'ta':
        return `அக்கா, உங்கள் ${sName} பற்றிய தகவல் இதோ. இதில் உங்களுக்கு ${sBenefit} கிடைக்கும். இது ${sWho} பெண்களுக்கு உரியது. நீங்கள் நேரில் ${sOffice} சென்று எளிதாக விண்ணப்பிக்கலாம்.`;

      case 'te':
        return `అక్కా, మీ ${sName} గురించి పూర్తి వివరాలు ఇక్కడ ఉన్నాయి. ఇందులో మీకు ${sBenefit} నేరుగా అందుతుంది. ఇది ముఖ్యంగా ${sWho} కోసం కేటాయించారు. మీరు మీ సమీపంలోని ${sOffice} వెళ్ళి దరఖాస్తు చేసుకోవచ్చు.`;

      case 'kn':
        return `ಅಕ್ಕಾ, ನಿಮ್ಮ ${sName} ಕುರಿತ ಸರಳ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ. ಇದರಲ್ಲಿ ನಿಮಗೆ ${sBenefit} ಸೌಲಭ್ಯ ಸಿಗುತ್ತದೆ. ಇದು ${sWho} ಮಹಿಳೆಯರಿಗೆ ಅನ್ವಯಿಸುತ್ತದೆ. ನೀವು ನೇರವಾಗಿ ನಿಮ್ಮ ಸಮೀಪದ ${sOffice} ಭೇಟಿ ನೀಡಿ ಅರ್ಜಿ ಪಡೆಯಬಹುದು.`;

      case 'mr':
        return `ताई, ${sName} बाबतची माहिती अशी आहे. या योजनेतून तुम्हाला ${sBenefit} लाभ थेट मिळेल. ही योजना विशेषतः ${sWho} यांच्यासाठी आहे. तुम्ही जवळच्या ${sOffice} मध्ये जाऊन सहज अर्ज भरू शकता.`;

      case 'hi':
        return `दीदी, ${sName} की पूरी जानकारी यहाँ है। इसमें आपको ${sBenefit} का सीधा लाभ मिलता है। यह योजना विशेष रूप से ${sWho} के लिए बनाई गई है। आप अपने नज़दीकी ${sOffice} जाकर इसका फॉर्म आसानी से भर सकती हैं।`;

      case 'bn':
        return `দিদি, আপনার ${sName} প্রকল্পের তথ্য এখানে রয়েছে। এতে আপনি ${sBenefit} সরাসরি সুবিধা পাবেন। এটি মূলত ${sWho} জন্য তৈরি। আপনি কাছের ${sOffice} গিয়ে সহজেই আবেদন জমা দিতে পারেন।`;

      case 'gu':
        return `બહેન, ${sName} ની માહિતી અહીં છે. આમાં તમને ${sBenefit} સીધો લાભ મળે છે. આ યોજના ખાસ કરીને ${sWho} માટે છે. તમે નજીકના ${sOffice} ખાતે રૂબરૂ જઈને ફોર્મ ભરી શકો છો.`;

      case 'ml':
        return `ചേച്ചീ, ${sName} പദ്ധതി വിവരങ്ങൾ ഇതാ. ഇതിലൂടെ നിങ്ങൾക്ക് ${sBenefit} സഹായം ലഭിക്കും. ഇത് ${sWho} ആളുകൾക്കുള്ളതാണ്. അടുത്തുള്ള ${sOffice} നേരിട്ട് പോയി അപേക്ഷ നൽകാം.`;

      case 'pa':
        return `ਭੈਣ ਜੀ, ${sName} ਦੀ ਸਾਰੀ ਜਾਣਕਾਰੀ ਇੱਥੇ ਹੈ। ਇਸ ਵਿੱਚ ਤੁਹਾਨੂੰ ${sBenefit} ਦਾ ਸਿੱਧਾ ਲਾਭ ਮਿਲਦਾ ਹੈ। ਇਹ ਖਾਸ ਤੌਰ 'ਤੇ ${sWho} ਲਈ ਹੈ। ਤੁਸੀਂ ਨੇੜਲੇ ${sOffice} ਜਾ ਕੇ ਆਸਾਨੀ ਨਾਲ ਅਰਜ਼ੀ ਦੇ ਸਕਦੇ ਹੋ।`;

      case 'od':
        return `ଭଉଣୀ, ${sName} ବିଷୟରେ ସୂଚନା ଏଠାରେ ଅଛି। ଏଥିରେ ଆପଣଙ୍କୁ ${sBenefit} ସହାୟତା ମିଳିବ। ଏହା ବିଶେଷକରି ${sWho} ପାଇଁ ଉଦ୍ଦିଷ୍ଟ। ଆପଣ ପାଖ ${sOffice} କୁ ଯାଇ ସହଜରେ ଆବେଦନ କରିପାରିବେ।`;

      case 'as':
        return `বাইদেউ, ${sName} আঁচনিৰ বিষয়ে তথ্য ইয়াত আছে। ইয়াত আপুনি ${sBenefit} সুবিধা লাভ কৰিব। এইটো বিশেষকৈ ${sWho} বাবে তৈয়াৰ কৰা। আপুনি ওচৰৰ ${sOffice} লৈ গৈ সহজে আবেদন কৰিব পাৰিব।`;

      case 'ur':
        return `بہن، ${sName} کی تفصیلات یہ ہیں۔ اس میں آپ کو ${sBenefit} کا فائدہ ملتا ہے۔ یہ خاص طور پر ${sWho} کے لیے ہے۔ آپ قریبی ${sOffice} جا کر آسانی سے فارم جمع کرا سکتی ہیں۔`;

      case 'hinglish':
        return `Didi, ${sName} ki jaankari yeh hai. Isme aapko ${sBenefit} ka direct benefit milta hai. Yeh scheme khaaskar ${sWho} ke liye hai. Aap apne paas ke ${sOffice} jaakar aasaani se apply kar sakti hain.`;

      case 'en':
      default:
        return `Sister, here are the details for ${sName}. You will receive ${sBenefit}. This scheme is meant for ${sWho}. You can walk into your nearest ${sOffice} to apply easily.`;
    }
  }

  /**
   * Generates empathetic 3-4 sentence responses for everyday non-scheme inquiries:
   * Health & pregnancy, legal/safety support, household money, child care.
   */
  private generateGeneralReply(
    query: string,
    lang: LanguageCode
  ): { text: string; category: 'health' | 'safety' | 'general' } {
    const q = query.toLowerCase();

    // Safety / Emergency inquiry
    if (
      q.includes('help') || q.includes('danger') || q.includes('violence') ||
      q.includes('police') || q.includes('abuse') || q.includes('fraud') ||
      q.includes('ஆபத்து') || q.includes('உதவி') || q.includes('ప్రమాదం') ||
      q.includes('मदत') || q.includes('धोका') || q.includes('खतरा')
    ) {
      const safetyReplies: Record<LanguageCode, string> = {
        ta: 'அக்கா, பயப்பட வேண்டாம், நாங்கள் உங்களுடன் இருக்கிறோம். உடனே 181 பெண்கள் உதவி எண்ணை அல்லது 112 அவசர எண்ணை அழைக்கவும். உங்கள் பகுதியில் உள்ள சகி மகளிர் மையத்தில் இலவச பாதுகாப்பு மற்றும் சட்ட உதவி கிடைக்கும். எந்த காரணத்திற்காகவும் யாருக்கும் பணம் அல்லது ஓடிபி கொடுக்காதீர்கள்.',
        te: 'అక్కా, అస్సలు భయపడవద్దు, మీకు అండగా మేమున్నాము. తక్షణ సహాయం కోసం 181 మహిళా హెల్ప్‌లైన్ లేదా 112 నంబర్‌కు కాల్ చేయండి. మీ మండలంలోని సఖి కేంద్రంలో ఉచిత రక్షణ మరియు న్యాయ సహాయం లభిస్తుంది. ఎవరికీ ఎలాంటి ఓటీపీ లేదా లంచం ఇవ్వకండి.',
        kn: 'ಅಕ್ಕಾ, ಆತಂಕ ಪಡಬೇಡಿ, ನಿಮ್ಮ ರಕ್ಷಣೆಗೆ ನಾವಿದ್ದೇವೆ. ತಕ್ಷಣವೇ 181 ಮಹಿಳಾ ಸಹಾಯವಾಣಿ ಅಥವಾ 112 ತುರ್ತು ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ. ನಿಮ್ಮ ತಾಲೂಕಿನ ಸಖಿ ಕೇಂದ್ರದಲ್ಲಿ ಉಚಿತ ರಕ್ಷಣೆ ಮತ್ತು ಕಾನೂನು ಸಲಹೆ ಸಿಗುತ್ತದೆ. ಯಾರಿಗೂ ಒಟಿಪಿ ಅಥವಾ ಹಣ ನೀಡಬೇಡಿ.',
        mr: 'ताई, अजिबात घाबरू नका, आम्ही तुमच्या पाठीशी आहोत. तात्काळ मदतीसाठी १८१ महिला हेल्पलाइन किंवा ११२ नंबरवर फोन करा. तुमच्या भागातील सखी केंद्रामध्ये मोफत कायदेशीर मदत आणि आसरा मिळतो. कोणालाही ओटीपी किंवा पैसे देऊ नका.',
        hi: 'दीदी, बिल्कुल मत घबराइए, हम आपके साथ हैं। तुरंत 181 महिला हेल्पलाइन या 112 आपातकालीन नंबर पर कॉल करें। आपके नज़दीकी सखी वन-स्टॉप सेंटर पर मुफ़्त सुरक्षा और कानूनी सलाह मिलती है। किसी को भी ओटीपी या पैसे मत दीजिए।',
        bn: 'দিদি, ভয় পাবেন না, আমরা আপনার পাশে আছি। অবিলম্বে ১৮১ মহিলা হেল্পলাইন বা ১১২ নম্বরে ফোন করুন। আপনার এলাকার সখী সেন্টারে বিনামূল্যে সুরক্ষা ও আইনি সাহায্য পাওয়া যায়। কাউকে ওটিপি বা টাকা দেবেন না।',
        gu: 'બહેન, ગભરાશો નહીં, અમે તમારી સાથે છીએ. તાત્કાલિક ૧૮૧ મહિલા હેલ્પલાઇન અથવા ૧૧૨ પર કોલ કરો. તમારી નજીકના સખી સેન્ટરમાં મફત રક્ષણ અને કાનૂની સહાય મળે છે. કોઈને ઓટીપી કે પૈસા આપશો નહીં.',
        ml: 'ചേച്ചീ, ഒട്ടും പേടിക്കരുത്, ഞങ്ങൾ ഒപ്പമുണ്ട്. ഉടൻ തന്നെ 181 വനിതാ ഹെൽപ്പ്‌ലൈനിലോ 112 ലോ വിളിക്കുക. നിങ്ങളുടെ പ്രദേശത്തെ സഖി വൺ സ്റ്റോപ്പ് സെന്ററിൽ സൗജന്യ നിയമസഹായം ലഭിക്കും. ആർക്കും ഒടിപി നൽകരുത്.',
        pa: "ਭੈਣ ਜੀ, ਘਬਰਾਓ ਨਾ, ਅਸੀਂ ਤੁਹਾਡੇ ਨਾਲ ਹਾਂ। ਤੁਰੰਤ 181 ਮਹਿਲਾ ਹੈਲਪਲਾਈਨ ਜਾਂ 112 ਨੰਬਰ 'ਤੇ ਫੋਨ ਕਰੋ। ਤੁਹਾਡੇ ਇਲਾਕੇ ਦੇ ਸਖੀ ਸੈਂਟਰ ਵਿੱਚ ਮੁਫ਼ਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ ਮਿਲਦੀ ਹੈ। ਕਿਸੇ ਨੂੰ ਵੀ ਓਟੀਪੀ ਜਾਂ ਪੈਸੇ ਨਾ ਦਿਓ।",
        od: 'ଭଉଣୀ, ଆଦୌ ଡରନ୍ତୁ ନାହିଁ, ଆମେ ଆପଣଙ୍କ ସହିତ ଅଛୁ। ତୁରନ୍ତ ୧୮୧ ମହିଳା ହେଲ୍ପଲାଇନ କିମ୍ବା ୧୧୨ କୁ କଲ୍ କରନ୍ତୁ। ନିକଟସ୍ଥ ସଖୀ କେନ୍ଦ୍ରରେ ମାଗଣା ଆଇନଗତ ସହାୟତା ମିଳିବ। କାହାକୁ ଓଟିପି ଦିଅନ୍ତୁ ନାହିଁ।',
        as: 'বাইদেউ, ভয় নকৰিব, আমি আপোনাৰ লগত আছো। লগে লগে ১৮১ মহিলা হেল্পলাইন বা ১১২ নম্বৰত কল কৰক। আপোনাৰ ওচৰৰ সখী কেন্দ্ৰত বিনামূলীয়া সুৰক্ষা আৰু আইনী সাহায্য পোৱা যায়। কাকো অ’টিপি নিদিব।',
        ur: 'بہن، گھبرائیے مت، ہم آپ کے ساتھ ہیں۔ فوری مدد کے لیے 181 خواتین ہیلپ لائن یا 112 پر کال کریں۔ آپ کے قریبی سکھی سینٹر پر مفت قانونی مدد اور تحفظ فراہم کیا جاتا ہے۔ کسی کو او ٹی پی مت بتائیں۔',
        hinglish: 'Didi, bilkul ghabrayein mat, hum aapke saath hain. Turant 181 women helpline ya 112 emergency par call karein. Aapke area ke Sakhi One-Stop Centre par free legal aur shelter help milti hai. Kisi ko bhi OTP ya paise na dein.',
        en: 'Sister, do not be afraid, we are right here with you. Immediately call the 181 Women Helpline or 112 emergency number. You can get free legal guidance and safe shelter at your nearest Sakhi Centre. Never share your OTP or pay any money to anyone.',
      };
      return { text: safetyReplies[lang] || safetyReplies.en, category: 'safety' };
    }

    // Health / Pregnancy / Child advice
    if (
      q.includes('health') || q.includes('doctor') || q.includes('baby') ||
      q.includes('pregnant') || q.includes('medicine') || q.includes('fever') ||
      q.includes('உடல்நலம்') || q.includes('கர்ப்பம்') || q.includes('ஆரோக்கியம்') ||
      q.includes('ఆరోగ్యం') || q.includes('గర్భం') || q.includes('आरोग्य') ||
      q.includes('गरोदर') || q.includes('स्वास्थ्य') || q.includes('बीमार')
    ) {
      const healthReplies: Record<LanguageCode, string> = {
        ta: 'அக்கா, உங்கள் உடல்நலனை கவனித்துக் கொள்வது மிக முக்கியம். உங்கள் பகுதியில் உள்ள அங்கன்வாடி அல்லது ஆரம்ப சுகாதார நிலையத்திற்கு நேரில் செல்லுங்கள். அங்கு ஆஷா தமக்கை உங்களுக்கு இலவச மருத்துவ பரிசோதனை மற்றும் மாத்திரைகள் தருவார். சுத்தமான காய்ச்சிய நீரைக் குடித்து போதுமான ஓய்வு எடுங்கள்.',
        te: 'అక్కా, మీ ఆరోగ్యం చాలా ముఖ్యం, జాగ్రత్తగా ఉండండి. మీ ఊరి ప్రాథమిక ఆరోగ్య కేంద్రం లేదా అంగన్‌వాడీకి వెళ్లండి. అక్కడ ఆశా కార్యకర్త మీకు ఉచితంగా మందులు మరియు పరీక్షలు చేయిస్తారు. కాచి చల్లార్చిన నీరు తాగి మంచి పౌష్టికాహారం తీసుకోండి.',
        kn: 'ಅಕ್ಕಾ, ನಿಮ್ಮ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಕಾಳಜಿ ವಹಿಸಿ. ನಿಮ್ಮ ಹಳ್ಳಿಯ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಅಥವಾ ಅಂಗನವಾಡಿಗೆ ಭೇಟಿ ನೀಡಿ. ಅಲ್ಲಿ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ನಿಮಗೆ ಉಚಿತ ತಪಾಸಣೆ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶ ಮಾತ್ರೆಗಳನ್ನು ನೀಡುತ್ತಾರೆ. ಶುದ್ಧ ಕಾಯಿಸಿದ ನೀರನ್ನು ಕುಡಿಯಿರಿ ಮತ್ತು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.',
        mr: 'ताई, तुमच्या तब्येतीची काळजी घेणे सर्वात महत्त्वाचे आहे. तुमच्या गावातील प्राथमिक आरोग्य केंद्र किंवा अंगणवाडीत जा. तिथे आशा ताई तुम्हाला मोफत तपासणी आणि औषधे देतील. उकळलेले पाणी प्या आणि भरपूर विश्रांती घ्या.',
        hi: 'दीदी, अपनी सेहत का पूरा ध्यान रखिए। अपने गाँव के प्राथमिक स्वास्थ्य केंद्र या आँगनवाड़ी केंद्र पर ज़रूर जाएँ। वहाँ आशा दीदी आपकी मुफ़्त जाँच करेंगी और ज़रूरी दवाइयाँ देंगी। उबला हुआ पानी पीजिए और पौष्टिक आहार लीजिए।',
        bn: 'দিদি, আপনার স্বাস্থ্যের যত্ন নেওয়া খুব দরকার। আপনার এলাকার প্রাথমিক স্বাস্থ্যকেন্দ্র বা অঙ্গনওয়াড়িতে যান। সেখানে আশা দিদি বিনামূল্যে পরীক্ষা ও প্রয়োজনীয় ওষুধ দেবেন। সবসময় ফোটানো জল খাবেন এবং বিশ্রাম নেবেন।',
        gu: 'બહેન, તમારા સ્વાસ્થ્યનું ધ્યાન રાખો. ગામના પ્રાથમિક આરોગ્ય કેન્દ્ર અથવા આંગણવાડી કેન્દ્રની મુલાકાત લો. ત્યાં આશા બહેન તમારી મફત તપાસ કરશે અને દવાઓ આપશે. ઉકાળેલું પાણી પીવો અને પૌષ્ટિક આહાર લો.',
        ml: 'ചേച്ചീ, സ്വന്തം ആരോഗ്യം പ്രത്യേകം ശ്രദ്ധിക്കണം. അടുത്തുള്ള പ്രാഥമിക ആരോഗ്യ കേന്ദ്രത്തിലോ അങ്കണവാടിയിലോ പോകുക. ആശാ പ്രവർത്തക സൗജന്യ പരിശോധനയും മരുന്നുകളും തരും. തിളപ്പിച്ചാറിയ വെള്ളം കുടിക്കുകയും വിശ്രമിക്കുകയും ചെയ്യുക.',
        pa: 'ਭੈਣ ਜੀ, ਆਪਣੀ ਸਿਹਤ ਦਾ ਖਾਸ ਖਿਆਲ ਰੱਖੋ। ਪਿੰਡ ਦੇ ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਜਾਂ ਆਂਗਣਵਾੜੀ ਸੈਂਟਰ ਜਾਓ। ਉੱਥੇ ਆਸ਼ਾ ਵਰਕਰ ਤੁਹਾਡੀ ਮੁਫ਼ਤ ਜਾਂਚ ਕਰੇਗੀ ਅਤੇ ਲੋੜੀਂਦੀਆਂ ਦਵਾਈਆਂ ਦੇਵੇਗੀ। ਉਬਲਿਆ ਹੋਇਆ ਪਾਣੀ ਪੀਓ ਅਤੇ ਆਰਾਮ ਕਰੋ।',
        od: 'ଭଉଣୀ, ନିଜ ସ୍ୱାସ୍ଥ୍ୟର ଉପଯୁକ୍ତ ଯତ୍ନ ନିଅନ୍ତୁ। ପାଖ ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର କିମ୍ବା ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ରକୁ ଯାଆନ୍ତୁ। ସେଠାରେ ଆଶା ଦିଦି ମାଗଣାରେ ଯାଞ୍ଚ କରି ଔଷଧ ଦେବେ। ଫୁଟା ପାଣି ପିଅନ୍ତୁ ଏବଂ ବିଶ୍ରାମ ନିଅନ୍ତୁ।',
        as: 'বাইদেউ, স্বাস্থ্যৰ যত্ন লোৱাটো বৰ প্ৰয়োজন। ওচৰৰ প্ৰাথমিক স্বাস্থ্য কেন্দ্ৰ বা অংগনৱাড়ী কেন্দ্ৰলৈ যাওক। তাত আশা বাইদেউৱে বিনামূলীয়া পৰীক্ষা আৰু দৰব দিব। উতলোৱা পানী খাব আৰু জিৰণি ল’ব।',
        ur: 'بہن، اپنی صحت کا خاص خیال رکھیں۔ اپنے قریبی بنیادی مرکزِ صحت یا آنگن واڑی تشریف لے جائیں۔ وہاں آشا آپ کا مفت معائنہ کر کے دوائیں دیں گی۔ ابلا ہوا پانی پئیں اور آرام کریں۔',
        hinglish: 'Didi, apni sehat ka poora dhyan rakhiye. Apne paas ke Primary Health Centre ya Anganwadi zaroor jayein. Wahan ASHA didi aapka free checkup karke dawai dengi. Ubla hua paani pijiye aur araam karein.',
        en: 'Sister, taking care of your health is the most important thing. Please visit your local Primary Health Centre or Anganwadi. The ASHA sister there will check you for free and give you proper medicines. Drink clean boiled water and take good rest.',
      };
      return { text: healthReplies[lang] || healthReplies.en, category: 'health' };
    }

    // General Household / Friendly Chat
    const generalReplies: Record<LanguageCode, string> = {
      ta: 'வணக்கம் அக்கா, நான் ஆப்தோழி. உங்கள் வீட்டின் முன்னேற்றத்திற்கும் குழந்தைகளின் எதிர்காலத்திற்கும் உதவ நான் எப்போதும் தயாராக உள்ளேன். நீங்கள் எந்த தயக்கமும் இல்லாமல் உங்கள் தேவையை சொல்லலாம். உங்கள் நலனே எங்கள் நோக்கம்.',
      te: 'నమస్కారం అక్కా, నేను మీ ఆప్తదోళిని. మీ కుటుంబ క్షేమానికి, పిల్లల ఉజ్వల భవిష్యత్తుకు మార్గదర్శనం చేయడమే నా ధ్యేయం. మీకు ఏ సహాయం కావాలన్నా సంకోచం లేకుండా అడగండి. మీ హక్కులను పొందడంలో మీకు తోడుగా ఉంటాను.',
      kn: 'ನಮಸ್ಕಾರ ಅಕ್ಕಾ, ನಾನು ನಿಮ್ಮ ಆಪ್ತತೋಳಿ. ನಿಮ್ಮ ಕುಟುಂಬದ ನೆಮ್ಮದಿ ಮತ್ತು ಮಕ್ಕಳ ಉಜ್ವಲ ಭವಿಷ್ಯಕ್ಕೆ ನೆರವಾಗಲು ನಾನಿದ್ದೇನೆ. ನಿಮಗೆ ಯಾವುದೇ ಸಹಾಯ ಬೇಕಿದ್ದರೂ ಧೈರ್ಯವಾಗಿ ಕೇಳಿ. ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಲುಪಿಸಲು ನಾನು ಸದಾ ಸಿದ್ಧ.',
      mr: 'नमस्ते ताई, मी तुमची आप्थोळी मैत्रीण आहे. तुमच्या कुटुंबाच्या कल्याणासाठी आणि मुलांच्या चांगल्या भविष्यासाठी मी नेहमी सोबत आहे. तुम्हाला कोणतीही अडचण किंवा मदत हवी असेल तर हक्काने विचारा. तुमची काळजी घेणे हेच माझे काम आहे.',
      hi: 'नमस्ते दीदी, मैं आपकी आप्थोझी सखी हूँ। आपके परिवार की तरक्की और बच्चों के अच्छे भविष्य में मदद के लिए मैं हमेशा हाज़िर हूँ। बेझिझक अपनी बात कहिए, हम मिलकर समाधान निकालेंगे। आपका हक, आपका सम्मान हमारी पहली प्राथमिकता है।',
      bn: 'নমস্কার দিদি, আমি আপনার আপথোঝি বান্ধবী। আপনার সংসারের উন্নতি এবং সন্তানদের সুন্দর ভবিষ্যতের জন্য আমি সবসময় পাশে আছি। দ্বিধা না করে আপনার মনের কথা বলুন। আপনার অধিকার বুঝে নিতে আমি সাহায্য করব।',
      gu: 'નમસ્તે બહેન, હું તમારી આપ્થોઝી સખી છું. તમારા પરિવારની સુખાકારી અને બાળકોના ભવિષ્ય માટે હું હંમેશાં તમારી સાથે છું. કોઈ પણ સંકોચ વિના તમારી વાત કહો. તમારો હક તમને અપાવવો એ જ મારો સંકલ્પ છે.',
      ml: 'നമസ്കാരം ചേച്ചീ, ഞാൻ നിങ്ങളുടെ ആപ്തോഴി കൂട്ടുകാരിയാണ്. കുടുംബത്തിന്റെ സുരക്ഷിതത്വത്തിനും മക്കളുടെ നല്ല ഭാവിക്കും സഹായിക്കാൻ ഞാനുണ്ട്. എന്ത് കാര്യവും മടിക്കാതെ എന്നോട് ചോദിക്കാം. നിങ്ങളുടെ അവകാശങ്ങൾ നേടിയെടുക്കാൻ ഞാൻ കൂടെയുണ്ട്.',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਭੈਣ ਜੀ, ਮੈਂ ਤੁਹਾਡੀ ਆਪਥੋਜ਼ੀ ਸਹੇਲੀ ਹਾਂ। ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਦੀ ਖੁਸ਼ਹਾਲੀ ਅਤੇ ਬੱਚਿਆਂ ਦੇ ਭਵਿੱਖ ਲਈ ਮੈਂ ਹਮੇਸ਼ਾ ਤਿਆਰ ਹਾਂ। ਬਿਨਾਂ ਝਿਜਕ ਆਪਣੀ ਗੱਲ ਦੱਸੋ। ਤੁਹਾਡੇ ਹੱਕ ਤੁਹਾਨੂੰ ਦਿਵਾਉਣਾ ਹੀ ਸਾਡਾ ਫ਼ਰਜ਼ ਹੈ।',
      od: 'ନମସ୍କାର ଭଉଣୀ, ମୁଁ ଆପଣଙ୍କ ଆପଥୋଜି ସାଥୀ। ପରିବାରର ଉନ୍ନତି ଓ ପିଲାମାନଙ୍କ ଭବିଷ୍ୟତ ପାଇଁ ମୁଁ ସବୁବେଳେ ଆପଣଙ୍କ ସହ ଅଛି। ନିଃସଙ୍କୋଚରେ ଆପଣଙ୍କ ଆବଶ୍ୟକତା ଜଣାନ୍ତୁ। ଆପଣଙ୍କ ଅଧିକାର ଆପଣଙ୍କୁ ମିଳିବା ହିଁ ଆମ ଲକ୍ଷ୍ୟ।',
      as: 'নমস্কাৰ বাইদেউ, মই আপোনাৰ আপথোজী বান্ধৱী। আপোনাৰ পৰিয়ালৰ মঙ্গল আৰু সন্তানৰ ভৱিষ্যতৰ বাবে মই সদায় সহায় কৰিম। নিঃসংকোচে আপোনাৰ মনৰ কথা কওক। আপোনাৰ অধিকাৰ পোৱাত মই সদায় লগ দিম।',
      ur: 'السلام علیکم بہن، میں آپ کی آپ تھوزی دوست ہوں۔ آپ کے گھرانے کی بہتری اور بچوں کے روشن مستقبل کے لیے میں ہمیشہ حاضر ہوں۔ بلا جھجھک اپنی ضرورت بتائیں، ہم مل کر حل تلاش کریں گے۔',
      hinglish: 'Namaste Didi, main aapki AapThozhi sakhi hoon. Aapke parivaar ki tarakki aur bachhon ke bright future ke liye main hamesha aapke saath hoon. Bina kisi hichkichahat ke apni baat batayein. Aapka haq aapko dilana hamara maqsad hai.',
      en: 'Namaste sister, I am your AapThozhi companion. I am always by your side to support your family well-being and your children’s bright future. Please feel completely free to speak to me about anything you need.',
    };
    return { text: generalReplies[lang] || generalReplies.en, category: 'general' };
  }
}

export const aapThozhiAIService = new AapThozhiAIService();
