import express from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import { buildBhashaGuruSystemInstruction, BHASHAGURU_APP_REGISTRY } from './src/data/bhashaguruAppKnowledge';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistent student learning memory storage directory (configurable for Render persistent disk)
const STUDENTS_DIR = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR)
  : path.join(__dirname, '.data', 'students');

try {
  if (!fs.existsSync(STUDENTS_DIR)) {
    fs.mkdirSync(STUDENTS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[Students Storage Dir Note]:', e);
}

function getStudentProfilePath(studentId: string): string {
  const safeId = studentId.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(STUDENTS_DIR, `${safeId}.json`);
}

/**
 * Resolves the active AI API key from environment variables.
 * Accepts AI_API_KEY (Render standard) or GEMINI_API_KEY (AI Studio standard).
 */
export function getEffectiveApiKey(): string | null {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '*****') {
    return null;
  }
  return apiKey;
}

const app = express();

// Production-ready CORS for Android Capacitor & Render Web clients
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));

// Health Check Endpoints for Render, uptime monitors, and Android connectivity tests
app.get(['/health', '/api/health'], (_req, res) => {
  const hasKey = !!getEffectiveApiKey();
  res.json({
    status: 'ok',
    app: 'BhashaGuru AI English Teacher',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiConfigured: hasKey,
    environment: process.env.NODE_ENV || 'development',
    serverUptimeSeconds: Math.floor(process.uptime()),
  });
});

function getAiClient() {
  const apiKey = getEffectiveApiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// Resilient Quota Management & Multi-Model Orchestration
// ----------------------------------------------------
let textQuotaCooldownUntil = 0;
let ttsQuotaCooldownUntil = 0;

function isQuotaError(err: any): boolean {
  if (!err) return false;
  const msg = typeof err === 'string' ? err : String(err.message || err.status || '');
  return (
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('Quota exceeded') ||
    msg.includes('rate-limit') ||
    err?.status === 'RESOURCE_EXHAUSTED' ||
    err?.code === 429
  );
}

async function generateContentWithFallback(
  ai: GoogleGenAI | null,
  requestConfig: any,
  preferredModels: string[] = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest']
): Promise<any | null> {
  if (!ai) return null;

  for (const model of preferredModels) {
    try {
      const response = await ai.models.generateContent({
        ...requestConfig,
        model,
      });
      return response;
    } catch (err: any) {
      // If one model is on rate limit, continue to next candidate
      console.warn(`[AI Pipeline] Model ${model} encountered issue, trying fallback model...`);
    }
  }

  return null;
}

function extractJsonFromText(rawText: string | undefined): any {
  if (!rawText) return null;
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(trimmed.substring(firstBrace, lastBrace + 1));
      } catch {
        // ignore
      }
    }
    const firstBracket = trimmed.indexOf('[');
    const lastBracket = trimmed.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(trimmed.substring(firstBracket, lastBracket + 1));
      } catch {
        // ignore
      }
    }
  }
  return null;
}

// ----------------------------------------------------
// High-Fidelity Server-Side Semantic Pedagogical Engine
// ----------------------------------------------------

interface ServerSemanticBreakdown {
  word: string;
  partOfSpeech: string;
  primaryHindiMeaning: string;
  phoneticHindi: string;
  pronunciationTipHindi?: string;
  situationContext: string;
  primaryExampleEn: string;
  primaryExampleHi: string;
  whyUsedHindi: string;
  secondaryUsage?: {
    hasSecondaryMeaning: boolean;
    secondaryMeaningHindi?: string;
    secondaryContext?: string;
    secondaryExampleEn?: string;
    secondaryExampleHi?: string;
    secondaryWhyUsedHindi?: string;
  };
  difficultyLevel?: string;
  practicalTip?: string;
}

const CURATED_SERVER_WORDS: Record<string, Partial<ServerSemanticBreakdown>> = {
  borrow: {
    partOfSpeech: 'Verb (क्रिया)',
    primaryHindiMeaning: 'उधार लेना / कुछ समय के लिए मांगना',
    phoneticHindi: 'बॉ-रो',
    pronunciationTipHindi: 'शुरुआत में "बॉ" बोलें और अंत में "रो" — "बॉ-रो"। "बोरो" न बोलें।',
    situationContext: 'Weather & Rainy Day (बारिश व मौसम)',
    primaryExampleEn: "Can I borrow your umbrella? It's raining outside.",
    primaryExampleHi: 'क्या मैं आपकी छतरी ले सकता हूँ? बाहर बारिश हो रही है।',
    whyUsedHindi: 'यहाँ borrow का अर्थ किसी से कोई चीज़ कुछ समय के लिए मांगना और उपयोग के बाद लौटाना है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'ऋण लेना / पैसे उधार लेना',
      secondaryContext: 'Financial Need (पैसों की आवश्यकता)',
      secondaryExampleEn: 'He had to borrow money from his friend to pay the fees.',
      secondaryExampleHi: 'फीस भरने के लिए उसे अपने दोस्त से पैसे उधार लेने पड़े।',
      secondaryWhyUsedHindi: 'वस्तुओं के साथ-साथ वित्तीय सहायता मांगने पर भी borrow का उपयोग होता है।',
    },
    practicalTip: 'ध्यान दें: "Borrow" का मतलब किसी से उधार लेना है, जबकि किसी को उधार देने को "Lend" कहते हैं।',
  },
  exhausted: {
    partOfSpeech: 'Adjective (विशेषण)',
    primaryHindiMeaning: 'बहुत थका हुआ / पूरी तरह थका हुआ',
    phoneticHindi: 'एग्ज़ॉस्टेड',
    pronunciationTipHindi: '"एग-ज़ॉ-स्टेड" बोलें। "x" की आवाज़ "ग्ज़" जैसी निकलती है।',
    situationContext: 'Work & Long Shift (दिनभर की कड़ी मेहनत)',
    primaryExampleEn: 'After working all day, she was completely exhausted.',
    primaryExampleHi: 'दिनभर काम करने के बाद, वह पूरी तरह थक चुकी थी।',
    whyUsedHindi: 'यहाँ exhausted का मतलब सिर्फ साधारण "tired" नहीं बल्कि ऊर्जा पूरी तरह समाप्त होना (अत्यधिक थका हुआ) है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'संसाधन या विकल्प समाप्त होना',
      secondaryContext: 'Resources & Solutions (विकल्प खत्म होना)',
      secondaryExampleEn: 'We have exhausted all other options and must decide now.',
      secondaryExampleHi: 'हमने बाकी सभी विकल्पों को परख लिया है और वे समाप्त हो चुके हैं।',
      secondaryWhyUsedHindi: 'जब प्रयास, संसाधन या धैर्य खत्म हो जाए, तब भी exhausted का प्रयोग किया जाता है।',
    },
    practicalTip: 'यदि आप बहुत अधिक थके हैं, तो "I am very tired" के स्थान पर "I am exhausted!" बोलना अधिक स्वाभाविक है।',
  },
  watch: {
    partOfSpeech: 'Verb / Noun (क्रिया व संज्ञा)',
    primaryHindiMeaning: 'ध्यान से देखना (स्क्रीन / खेल / दृश्य)',
    phoneticHindi: 'वॉच',
    pronunciationTipHindi: 'होंठों को हल्का गोल करके "वॉ-च" बोलें।',
    situationContext: 'Entertainment & Sports (मनोरंजन व मैच)',
    primaryExampleEn: 'I watched an exciting cricket match last night.',
    primaryExampleHi: 'मैंने कल रात एक रोमांचक क्रिकेट मैच देखा।',
    whyUsedHindi: 'जब किसी गतिशील चीज़ या गतिविधि को ध्यानपूर्वक कुछ समय तक देखा जाता है, तो "watch" कहते हैं (see या look नहीं)।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'हाथ की घड़ी (कलाई घड़ी)',
      secondaryContext: 'Everyday Device (समय व घड़ी)',
      secondaryExampleEn: 'My watch stopped working this morning.',
      secondaryExampleHi: 'आज सुबह मेरी कलाई घड़ी बंद हो गई।',
      secondaryWhyUsedHindi: 'संज्ञा (Noun) के रूप में "watch" का अर्थ हाथ पर बाँधने वाली घड़ी होता है।',
    },
    practicalTip: '"See" सामान्य नज़र पड़ने के लिए, "Look at" किसी स्थिर चीज़ की ओर देखने के लिए, और "Watch" चलती-फिरती चीज़ को ध्यान से देखने के लिए आता है।',
  },
  patient: {
    partOfSpeech: 'Adjective / Noun (विशेषण व संज्ञा)',
    primaryHindiMeaning: 'धैर्यवान / सहनशील (सब्र रखने वाला)',
    phoneticHindi: 'पेशेंट',
    pronunciationTipHindi: '"पे-शेंट" बोलें। बीच में "श" की आवाज़ आती है, "स" नहीं।',
    situationContext: 'Waiting & Daily Life (प्रतीक्षा व धैर्य)',
    primaryExampleEn: 'Please be patient; the doctor will see you in a few minutes.',
    primaryExampleHi: 'कृपया थोड़ा धैर्य रखें; डॉक्टर कुछ ही मिनटों में आपको देखेंगे।',
    whyUsedHindi: 'यहाँ patient का उपयोग किसी को शांत और संयमित रहकर प्रतीक्षा करने के लिए कहने में हुआ है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'मरीज़ / बीमार व्यक्ति',
      secondaryContext: 'Hospital & Healthcare (अस्पताल व स्वास्थ्य)',
      secondaryExampleEn: 'The doctor spent thirty minutes examining each patient.',
      secondaryExampleHi: 'डॉक्टर ने प्रत्येक मरीज़ की जाँच में तीस मिनट का समय दिया।',
      secondaryWhyUsedHindi: 'संज्ञा (Noun) के रूप में "patient" का अर्थ अस्पताल में इलाज करा रहा मरीज़ होता है।',
    },
    practicalTip: '"Be patient with yourself while learning English" — अंग्रेज़ी सीखते समय अपने प्रति धैर्यवान रहें।',
  },
  them: {
    partOfSpeech: 'Pronoun (कर्म कारक सर्वनाम - Object Pronoun)',
    primaryHindiMeaning: 'उन्हें / उनको / उनसे',
    phoneticHindi: 'देम',
    pronunciationTipHindi: 'नरम "द" (voiced th sound) से "देम" बोलें।',
    situationContext: 'Friends & Dinner (घर पर भोजन व आमंत्रण)',
    primaryExampleEn: 'I invited them to our home for dinner tonight.',
    primaryExampleHi: 'मैंने आज रात उन्हें अपने घर रात के खाने पर आमंत्रित किया है।',
    whyUsedHindi: 'जब वाक्य में एक से अधिक लोगों को क्रिया का लक्ष्य (object) बनाया जाता है, तो "they" के स्थान पर "them" आता है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'किसी को निर्देश या सामान सौंपना',
      secondaryContext: 'Handing Over Items (सामान या चाबी सौंपना)',
      secondaryExampleEn: 'Could you please give them these house keys?',
      secondaryExampleHi: 'क्या आप कृपया उन्हें घर की ये चाबियाँ दे सकते हैं?',
      secondaryWhyUsedHindi: 'किसी अन्य व्यक्ति को कुछ सौंपने का अनुरोध करते समय "them" सहज अभिव्यक्ति है।',
    },
    practicalTip: 'वाक्य की शुरुआत में Subject के रूप में "They" और अंत में Object के रूप में "Them" आता है।',
  },
  book: {
    partOfSpeech: 'Noun / Verb (संज्ञा व क्रिया)',
    primaryHindiMeaning: 'किताब / पुस्तक',
    phoneticHindi: 'बुक',
    pronunciationTipHindi: 'छोटा "उ" बोलें — "बुक"।',
    situationContext: 'Reading & Study (पढ़ाई और ज्ञान)',
    primaryExampleEn: 'I am reading an interesting book about ancient history.',
    primaryExampleHi: 'मैं प्राचीन इतिहास के बारे में एक दिलचस्प किताब पढ़ रहा हूँ।',
    whyUsedHindi: 'संज्ञा के रूप में यह किसी मुद्रित पुस्तक या ग्रंथ को दर्शाता है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'आरक्षित करना / सीट या टिकट बुक करना',
      secondaryContext: 'Travel Booking (यात्रा टिकट)',
      secondaryExampleEn: 'We should book our train tickets before the festival begins.',
      secondaryExampleHi: 'त्यौहार शुरू होने से पहले हमें ट्रेन के टिकट बुक कर लेने चाहिए।',
      secondaryWhyUsedHindi: 'क्रिया (Verb) के रूप में "book" का मतलब किसी सीट, होटल या सेवा को पहले से रिज़र्व करना होता है।',
    },
    practicalTip: '"Book a ticket" और "Read a book" — दोनों में संदर्भ से अर्थ तुरंत स्पष्ट हो जाता है।',
  },
  light: {
    partOfSpeech: 'Noun / Adjective (संज्ञा व विशेषण)',
    primaryHindiMeaning: 'रोशनी / प्रकाश',
    phoneticHindi: 'लाइट',
    pronunciationTipHindi: '"ला-इट" — "t" को स्पष्ट रखें।',
    situationContext: 'Home & Room (कमरे की बत्ती)',
    primaryExampleEn: 'Could you please turn on the light in the hallway?',
    primaryExampleHi: 'क्या आप कृपया दालान (हॉल) की बत्ती जला सकते हैं?',
    whyUsedHindi: 'यहाँ light कमरे के प्रकाश या विद्युत बल्ब को दर्शाती है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'हल्का (वज़न में कम)',
      secondaryContext: 'Luggage & Weight (सामान का वज़न)',
      secondaryExampleEn: 'This travel backpack is very light and easy to carry.',
      secondaryExampleHi: 'यह यात्रा बैग बहुत हल्का और उठाने में आसान है।',
      secondaryWhyUsedHindi: 'विशेषण (Adjective) के रूप में heavy (भारी) का विलोम शब्द light (हल्का) होता है।',
    },
  },
  beautiful: {
    partOfSpeech: 'Adjective (विशेषण)',
    primaryHindiMeaning: 'सुंदर / मनमोहक',
    phoneticHindi: 'ब्यूटीफुल',
    pronunciationTipHindi: '"ब्यू-टी-फुल" — तीन स्पष्ट हिस्सों में बोलें।',
    situationContext: 'Nature & Sunset (प्रकृति और सूर्यास्त)',
    primaryExampleEn: 'The sunset over the mountain looked breathtakingly beautiful.',
    primaryExampleHi: 'पहाड़ों के ऊपर सूर्यास्त का नज़ारा बेहद खूबसूरत लग रहा था।',
    whyUsedHindi: 'जब कोई दृश्य, व्यक्ति या रचना आँखों को अत्यंत आकर्षित करे, तब beautiful का उपयोग होता है।',
  },
  careful: {
    partOfSpeech: 'Adjective (विशेषण)',
    primaryHindiMeaning: 'सावधान / सतर्क',
    phoneticHindi: 'केयरफुल',
    pronunciationTipHindi: '"के-यर-फुल" बोलें।',
    situationContext: 'Safety & Driving (सड़क सुरक्षा व ड्राइविंग)',
    primaryExampleEn: 'Please be careful while driving on the wet road.',
    primaryExampleHi: 'कृपया गीली सड़क पर गाड़ी चलाते समय सावधान रहें।',
    whyUsedHindi: 'यहाँ दुर्घटना या गलती से बचने के लिए सतर्कता बरतने की सलाह दी गई है।',
  },
  decide: {
    partOfSpeech: 'Verb (क्रिया)',
    primaryHindiMeaning: 'तय करना / निर्णय लेना',
    phoneticHindi: 'डिसाइड',
    pronunciationTipHindi: '"डि-सा-इड" — अंत में स्पष्ट "ड" बोलें।',
    situationContext: 'Career & Planning (करियर व योजना)',
    primaryExampleEn: 'Take your time to decide which career path suits you best.',
    primaryExampleHi: 'यह तय करने के लिए थोड़ा समय लें कि कौन सा करियर आपके लिए सबसे उपयुक्त है।',
    whyUsedHindi: 'कई विकल्पों में से किसी एक को चुनने का संकल्प लेने के लिए decide कहते हैं।',
  },
  experience: {
    partOfSpeech: 'Noun & Verb (संज्ञा व क्रिया)',
    primaryHindiMeaning: 'अनुभव / तजुर्बा',
    phoneticHindi: 'एक्सपीरियंस',
    pronunciationTipHindi: '"इक्स-पी-रि-अंस" चार ध्वनियों में धाराप्रवाह बोलें।',
    situationContext: 'Work Interview (नौकरी व साक्षात्कार)',
    primaryExampleEn: 'She has five years of practical experience in digital marketing.',
    primaryExampleHi: 'उनके पास डिजिटल मार्केटिंग में पाँच साल का व्यावहारिक अनुभव है।',
    whyUsedHindi: 'कार्यक्षेत्र में वर्षों के दौरान सीखे गए हुनर और ज्ञान को experience कहा जाता है।',
  },
  without: {
    partOfSpeech: 'Preposition (संबंधबोधक अव्यय - के बिना)',
    primaryHindiMeaning: 'के बिना / बिना',
    phoneticHindi: 'विदाउट',
    pronunciationTipHindi: '"वि-दा-उट" बोलें (wɪðˈaʊt)। शुरुआत में "वि" और अंत में स्पष्ट "आउट"।',
    situationContext: 'Daily Habit & Routine (दैनिक दिनचर्या व आदत)',
    primaryExampleEn: 'I cannot start my morning without a hot cup of tea.',
    primaryExampleHi: 'मैं एक कप गर्म चाय के बिना अपनी सुबह शुरू नहीं कर सकता।',
    whyUsedHindi: 'यहाँ "without" सुबह की चाय की अनुपस्थिति (के बिना) को स्वाभाविक रूप से दर्शा रहा है।',
    secondaryUsage: {
      hasSecondaryMeaning: true,
      secondaryMeaningHindi: 'नियम या अनुमति के बिना',
      secondaryContext: 'Office Application (दस्तावेज़ व नियम)',
      secondaryExampleEn: 'Please do not submit your application without checking the documents.',
      secondaryExampleHi: 'कृपया दस्तावेज़ों की जाँच किए बिना अपना आवेदन जमा न करें।',
      secondaryWhyUsedHindi: 'किसी शर्त या जाँच के पूरे न होने की स्थिति में "without" का उपयोग हुआ है।',
    },
    practicalTip: '"Without" के बाद हमेशा कोई Noun (जैसे without sugar) या क्रिया का ing रूप (जैसे without asking) आता है।',
  },
};

function generateServerSemanticBreakdown(
  word: string,
  hintMeaning?: string,
  difficulty: string = 'BEGINNER',
  contextTheme?: string
): ServerSemanticBreakdown {
  const clean = word.trim().toLowerCase();
  const curated = CURATED_SERVER_WORDS[clean];

  if (curated && curated.primaryExampleEn) {
    return {
      word: clean,
      partOfSpeech: curated.partOfSpeech || 'Word (शब्द)',
      primaryHindiMeaning: hintMeaning || curated.primaryHindiMeaning || `"${clean}" का अर्थ`,
      phoneticHindi: curated.phoneticHindi || clean,
      pronunciationTipHindi: curated.pronunciationTipHindi,
      situationContext: curated.situationContext || 'Daily Practical Usage',
      primaryExampleEn: curated.primaryExampleEn,
      primaryExampleHi: curated.primaryExampleHi || `"${clean}" का व्यावहारिक वाक्य`,
      whyUsedHindi: curated.whyUsedHindi || `यहाँ "${clean}" का प्रयोग परिस्थिति को स्वाभाविक रूप से व्यक्त करने के लिए हुआ है।`,
      difficultyLevel: difficulty,
      secondaryUsage: curated.secondaryUsage,
      practicalTip: curated.practicalTip,
    };
  }

  // Heuristic semantic classifier for any unlisted vocabulary word
  let pos = 'Word (शब्द)';
  let context = 'Daily Communication';
  let enSentence = '';
  let hiSentence = '';
  let whyUsed = '';

  if (clean === 'without') {
    pos = 'Preposition (संबंधबोधक अव्यय - के बिना)';
    context = 'Daily Habit & Routine (दैनिक आदत)';
    enSentence = 'I cannot start my morning without a hot cup of tea.';
    hiSentence = 'मैं एक कप गर्म चाय के बिना अपनी सुबह शुरू नहीं कर सकता।';
    whyUsed = 'यहाँ "without" किसी वस्तु या व्यक्ति की अनुपस्थिति को दर्शाता है।';
  } else if (['with', 'about', 'between', 'among', 'under', 'over', 'through', 'before', 'after', 'during'].includes(clean)) {
    pos = 'Preposition (संबंधबोधक अव्यय)';
    context = 'Direction & Relation (स्थान व संबंध)';
    enSentence = `Please double-check everything ${clean} leaving for your journey.`;
    hiSentence = `अपनी यात्रा पर जाने से पहले कृपया हर चीज़ की दोबारा जाँच कर लें।`;
    whyUsed = `यहाँ "${clean}" दो बातों के बीच का संबंध सटीक रूप से जोड़ता है।`;
  } else if (['because', 'although', 'unless', 'since', 'while'].includes(clean)) {
    pos = 'Conjunction (संयोजक - वाक्य जोड़ने वाला)';
    context = 'Reason & Context (कारण व स्थिति)';
    enSentence = `We arrived comfortably on time ${clean} we left home early.`;
    hiSentence = `हम आराम से समय पर पहुँच गए क्योंकि हम घर से जल्दी निकले थे।`;
    whyUsed = `यहाँ "${clean}" कारण और परिणाम को स्वाभाविक रूप से जोड़ता है।`;
  } else if (['run', 'walk', 'jump', 'cook', 'drive', 'swim', 'eat', 'drink', 'write', 'read', 'speak', 'help', 'learn', 'watch', 'borrow', 'listen'].includes(clean)) {
    pos = 'Verb (क्रिया - Action)';
    context = 'Morning Routine & Daily Life (दैनिक जीवन)';
    enSentence = `She prefers to ${clean} around the park before the morning rush begins.`;
    hiSentence = `सुबह की भीड़ शुरू होने से पहले वह पार्क के आसपास ${clean} करना पसंद करती है।`;
    whyUsed = `यहाँ "${clean}" एक नियमित शारीरिक गतिविधि या क्रिया को स्वाभाविक रूप से दर्शा रहा है।`;
  } else if (clean.endsWith('ing')) {
    pos = 'Continuous Verb / Gerund (क्रिया रूप)';
    context = 'Ongoing Activity (वर्तमान गतिविधि)';
    enSentence = `We spent the entire afternoon ${clean} together as a team.`;
    hiSentence = `हमने पूरी दोपहर एक साथ मिलकर इस काम में बिताई।`;
    whyUsed = `यहाँ "${clean}" चल रहे कार्य की निरंतरता को व्यक्त कर रहा है।`;
  } else if (['happy', 'sad', 'angry', 'excited', 'nervous', 'calm', 'proud', 'tired', 'busy', 'kind', 'exhausted'].includes(clean)) {
    pos = 'Adjective (भाववाचक विशेषण)';
    context = 'Emotions & Feelings (भावनाएँ व मनःस्थिति)';
    enSentence = `Hearing the encouraging news made everyone feel genuinely ${clean}.`;
    hiSentence = `उत्साहवर्धक खबर सुनकर हर किसी ने मन से ${clean} महसूस किया।`;
    whyUsed = `यहाँ "${clean}" व्यक्ति की आंतरिक मानसिक स्थिति और भावना को सटीक रूप से बयां करता है।`;
  } else if (clean.endsWith('ly') || ['always', 'never', 'often', 'sometimes', 'already'].includes(clean)) {
    pos = 'Adverb (क्रिया विशेषण)';
    context = 'Manner & Instructions (निर्देश व कार्यशैली)';
    enSentence = `Please communicate the instructions ${clean} so that everyone stays aligned.`;
    hiSentence = `कृपया निर्देशों को ${clean} साझा करें ताकि सभी को सब कुछ स्पष्ट रहे।`;
    whyUsed = `यहाँ "${clean}" कार्य करने के तरीके और स्पष्टता की व्याख्या कर रहा है।`;
  } else {
    pos = 'Word / Concept (शब्द व अवधारणा)';
    context = 'Practical Situation (व्यावहारिक स्थिति)';
    enSentence = `I made sure to complete the ${clean} before submitting the final documents.`;
    hiSentence = `अंतिम दस्तावेज़ जमा करने से पहले मैंने इसे पूरा करना सुनिश्चित किया।`;
    whyUsed = `यहाँ "${clean}" बातचीत के मुख्य विषय को स्पष्ट रूप से इंगित कर रहा है।`;
  }

  return {
    word: clean,
    partOfSpeech: pos,
    primaryHindiMeaning: hintMeaning || `"${clean}"`,
    phoneticHindi: clean,
    pronunciationTipHindi: `इस शब्द ("${clean}") को स्पष्टता से बिना जल्दबाज़ी के बोलें।`,
    situationContext: contextTheme || context,
    primaryExampleEn: enSentence,
    primaryExampleHi: hiSentence,
    whyUsedHindi: whyUsed,
    difficultyLevel: difficulty,
    practicalTip: `किसी शब्द को केवल याद करने के बजाय इस तरह के पूरे वाक्य में बोलकर अभ्यास करें।`,
  };
}

function generateServerWordExamples(word: string, _difficulty: string = 'BEGINNER', hintMeaning?: string) {
  const clean = (word || '').trim().toLowerCase();
  const breakdown = generateServerSemanticBreakdown(clean, hintMeaning);

  const secondEx = breakdown.secondaryUsage?.secondaryExampleEn ||
    (clean === 'without'
      ? 'Please do not submit your application without checking the documents.'
      : `We found a practical way to manage this in our everyday routine.`);
  const secondHi = breakdown.secondaryUsage?.secondaryExampleHi ||
    (clean === 'without'
      ? 'कृपया दस्तावेज़ों की जाँच किए बिना अपना आवेदन जमा न करें।'
      : 'हमने अपनी दैनिक दिनचर्या में इसे प्रबंधित करने का व्यावहारिक तरीका पाया।');

  const thirdEx = clean === 'without'
    ? 'Can you spend an entire day without using your smartphone?'
    : `Could you share a realistic example using "${clean}" from your daily experience?`;
  const thirdHi = clean === 'without'
    ? 'क्या आप अपने स्मार्टफोन के उपयोग के बिना पूरा दिन बिता सकते हैं?'
    : `दैनिक बातचीत में "${clean}" का संवादात्मक व स्वाभाविक प्रयोग`;

  return [
    {
      english: breakdown.primaryExampleEn,
      hindiTranslation: breakdown.primaryExampleHi,
      categoryLabel: breakdown.situationContext,
    },
    {
      english: secondEx,
      hindiTranslation: secondHi,
      categoryLabel: 'Real-Life Conversation',
    },
    {
      english: thirdEx,
      hindiTranslation: thirdHi,
      categoryLabel: 'Practical Question',
    },
  ];
}

function evaluateServerAnswerLocally(
  word: string,
  _hindiMeaning: string,
  questionType: string,
  _questionPrompt: string,
  expectedAnswer: string,
  userAnswer: string,
  _difficulty: string,
  _hindiRatio: number,
  _isSpoken: boolean
) {
  const cleanUser = userAnswer.trim();
  const lower = cleanUser.toLowerCase();
  const targetWord = (word || '').toLowerCase();

  // 1. Tense mismatch detection (e.g. yesterday + present tense)
  if (/yesterday/i.test(lower) && /\b(am go|is go|go|goes|borrow|decide)\b/i.test(lower) && !/\b(did|didn't|wanted|went|borrowed|decided)\b/i.test(lower)) {
    const corrected = cleanUser
      .replace(/\bam go\b/i, 'went')
      .replace(/\bgo\b/i, 'went');
    return {
      status: 'NEEDS_CORRECTION',
      isAccepted: false,
      requiresRetry: true,
      feedbackHindi: 'अच्छी कोशिश! लेकिन यहाँ past tense चाहिए क्योंकि आपने बीते हुए समय (yesterday) की बात की है।',
      correctedSentence: corrected !== cleanUser ? corrected : expectedAnswer,
      primaryErrorCategory: 'TENSE',
      errorHighlightWrong: cleanUser,
      errorHighlightRight: corrected !== cleanUser ? corrected : expectedAnswer,
      grammarScore: 65,
      pronunciationScore: 82,
      pronunciationTipHindi: 'बीते समय के लिए क्रिया के दूसरे रूप (V2 जैसे went, borrowed) का प्रयोग करें।',
      spokenTeacherResponse: `अच्छी कोशिश! लेकिन बीते हुए समय के लिए past tense आएगा। सही sentence है: ${corrected !== cleanUser ? corrected : expectedAnswer}.`,
    };
  }

  // 2. Vocabulary mismatch (e.g. borrow vs take)
  if (targetWord === 'borrow' && /\btake\b/i.test(lower) && !/\bborrow\b/i.test(lower)) {
    return {
      status: 'NEEDS_CORRECTION',
      isAccepted: false,
      requiresRetry: true,
      feedbackHindi: 'आपने यहाँ "take" का इस्तेमाल किया है, लेकिन किसी से कुछ समय के लिए कोई चीज़ उधार लेने के लिए "borrow" सही शब्द है।',
      correctedSentence: expectedAnswer || "Can I borrow your umbrella?",
      primaryErrorCategory: 'VOCABULARY',
      errorHighlightWrong: 'take',
      errorHighlightRight: 'borrow',
      grammarScore: 70,
      pronunciationScore: 84,
      pronunciationTipHindi: '"बॉ-रो" बोलें।',
      spokenTeacherResponse: "यहाँ उधार लेने के लिए 'borrow' सही शब्द है।",
    };
  }

  // 3. Fill in the blank match
  if (questionType === 'FILL_IN_THE_BLANK' && lower.includes(targetWord)) {
    return {
      status: 'CORRECT_NATURAL',
      isAccepted: true,
      requiresRetry: false,
      feedbackHindi: `बहुत बढ़िया! "${word}" बिल्कुल सही जवाब है।`,
      correctedSentence: cleanUser,
      primaryErrorCategory: 'NONE',
      errorHighlightWrong: '',
      errorHighlightRight: word,
      grammarScore: 98,
      pronunciationScore: 92,
      pronunciationTipHindi: '',
      spokenTeacherResponse: `Excellent! "${word}" बिल्कुल सही उत्तर है।`,
    };
  }

  // 4. Default acceptable match
  if (lower.includes(targetWord) && cleanUser.split(/\s+/).length >= 2) {
    return {
      status: 'CORRECT_NATURAL',
      isAccepted: true,
      requiresRetry: false,
      feedbackHindi: `शानदार! आपका वाक्य व्याकरण और अर्थ के हिसाब से बिल्कुल स्वाभाविक है।`,
      correctedSentence: cleanUser,
      primaryErrorCategory: 'NONE',
      errorHighlightWrong: '',
      errorHighlightRight: '',
      grammarScore: 95,
      pronunciationScore: 90,
      pronunciationTipHindi: '',
      spokenTeacherResponse: `बहुत अच्छा! आपने "${word}" का बहुत सटीक उपयोग किया है।`,
    };
  }

  return {
    status: 'CORRECT_ALT',
    isAccepted: true,
    requiresRetry: false,
    feedbackHindi: `अच्छी कोशिश! आपका वाक्य समझ में आ रहा है।`,
    correctedSentence: cleanUser,
    primaryErrorCategory: 'NONE',
    errorHighlightWrong: '',
    errorHighlightRight: '',
    grammarScore: 88,
    pronunciationScore: 85,
    pronunciationTipHindi: '',
    spokenTeacherResponse: 'Good job! आपने सही तरीके से उत्तर दिया है।',
  };
}

function generateServerTeacherConversation(
  loadedWords: string[] = [],
  _learnedWords: string[] = [],
  _missedWords: string[] = [],
  _commonMistakes: string[] = [],
  scenarioTopic: string = 'Daily Life',
  _difficulty: string = 'BEGINNER',
  _hindiRatio: number = 70,
  _messages: any[] = [],
  userMessage: string = ''
) {
  const sampleWord = loadedWords[0] || 'borrow';
  if (!userMessage) {
    return {
      teacherReplyHindiAndEn: `नमस्ते! I am your AI English Speaking Coach. आज हम "${scenarioTopic}" स्थिति में बातचीत करेंगे। आप मुझसे कोई भी सवाल पूछ सकते हैं या अंग्रेजी में बोलकर अभ्यास कर सकते हैं। Shall we start?`,
      englishPromptOrExample: `Hello! I am ready to practice speaking English.`,
      targetWordsUsed: [sampleWord],
      hadMistake: false,
      userOriginalSentence: '',
      correctedEnglishSentence: '',
      mistakeExplanationHindi: '',
      askToRepeatCorrection: false,
      grammarScore: 90,
      speakingScore: 90,
    };
  }

  const clean = userMessage.trim();
  const lower = clean.toLowerCase();

  // ----------------------------------------------------
  // CONTINUITY & LONG-TERM MEMORY (Continue Where We Left Off)
  // ----------------------------------------------------
  if (/\b(continue where we left off|left off|पिछली पढ़ाई|पिछली क्लास|पुराना सत्र|resume|पिछले पाठ|continue from last)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `नमस्ते! पिछली क्लास में हमने "5 Tenses Practice - Past Simple (V2)" सीखा था और आपकी पढ़ाई "क्रिया के V2 रूप (went, bought, saw) के उपयोग" पर रुकी थी।\n\nचलिए वहीं से एक छोटे वॉर्म-अप से शुरू करते हैं:\n'Yesterday, I ____ (buy) fresh vegetables from the market.'\n\nयहाँ खाली जगह में 'buy' का कौन सा Past V2 रूप आएगा?`,
      englishPromptOrExample: `Yesterday, I bought fresh vegetables from the market.`,
      targetWordsUsed: ['buy'],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'बीते समय (Yesterday) के लिए क्रिया का V2 रूप (Bought) इस्तेमाल होता है।',
      askToRepeatCorrection: false,
      grammarScore: 96,
      speakingScore: 94,
    };
  }

  // ----------------------------------------------------
  // PRONUNCIATION COACH FOR HINDI-SPEAKING H побеДHurdles
  // ----------------------------------------------------
  if (/\b(v and w|v vs w|w vs v|pronounce v|pronounce w|उच्चारण v|उच्चारण w)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `English में 'V' और 'W' का उच्चारण बहुत अलग है:\n• 'V' बोलते समय ऊपर के दाँत हल्के से निचले होंठ को छूते हैं (जैसे Very, Village, Vase)।\n• 'W' बोलते समय दोनों होंठों को आगे गोल (circle) करते हैं, दाँत होंठ को नहीं छूते (जैसे Water, Window, Wait)।\n\nअब आप दोनों शब्दों को बोलकर अभ्यास करें: "Very" और "Water". बोलिए!`,
      englishPromptOrExample: `Very good water.`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'V में दाँत होंठ पर लगते हैं, W में होंठ गोल होते हैं।',
      askToRepeatCorrection: false,
      grammarScore: 97,
      speakingScore: 95,
    };
  }

  if (/\b(f and ph|f vs ph|pronounce f|pronounce ph|उच्चारण f)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `English में 'F' और 'Ph' (Food, Friend, Phone) बोलते समय ऊपर के दाँत हल्के से निचले होंठ पर रखकर हवा बाहर निकालें। हिंदी के भारी 'फ' की तरह दोनों होंठों को दबाकर झटका नहीं देना है!\n\nअब आप इसे बोलकर देखिए: "Fresh food for my friend."`,
      englishPromptOrExample: `Fresh food for my friend.`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'F और Ph में ऊपरी दाँत निचले होंठ से छूकर हल्की हवा निकलती है।',
      askToRepeatCorrection: false,
      grammarScore: 96,
      speakingScore: 94,
    };
  }

  if (/\b(pronounce t|pronounce d|t and d|उच्चारण t|उच्चारण d)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `English का 'T' और 'D' हिंदी के भारी 'ट' या दाँत वाले 'त' से अलग होता है।\nअपनी जीभ की नोक को ऊपर के दाँतों के ठीक पीछे मसूड़ों (gum ridge) पर हल्के से छूकर छोड़ें (Tea, Today, Day, Doctor)।\n\nअब आप यह वाक्य बोलकर देखिए: "Today is a beautiful day."`,
      englishPromptOrExample: `Today is a beautiful day.`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'T और D में जीभ मसूड़ों (alveolar ridge) पर लगती है।',
      askToRepeatCorrection: false,
      grammarScore: 96,
      speakingScore: 94,
    };
  }

  // ----------------------------------------------------
  // APP EXPERT & GUIDE QUERIES (BhashaGuru Deep Knowledge)
  // ----------------------------------------------------

  // A. Blur Mode
  if (/\b(blur|blur mode|धुंधला|धुंधलापन|रिविजन मोड)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `Blur Mode (धुंधला मोड) Words स्क्रीन पर मूल सूची क्रम और 30 प्रति पृष्ठ ड्रॉपडाउन के ठीक नीचे स्थित है। जब आप "Blur" बटन दबाते हैं, तो सभी वोकैबुलरी कार्ड्स के हिंदी उच्चारण और हिंदी अर्थ पर हल्का ब्लर लग जाता है, जबकि अंग्रेजी शब्द बिल्कुल साफ दिखता है। इससे आप खुद का टेस्ट ले सकते हैं कि आपको शब्द का अर्थ याद है या नहीं। किसी भी कार्ड पर टैप करके आप तुरंत उसका छुपा हुआ अर्थ देख सकते हैं!`,
      englishPromptOrExample: `Blur Mode is a great revision tool to test your memory!`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'Blur Mode से Active Recall मजबूत होता है, जिससे शब्द हमेशा के लिए याद हो जाते हैं।',
      askToRepeatCorrection: false,
      grammarScore: 95,
      speakingScore: 92,
    };
  }

  // B. Verb Filter and V1, V2, V3 Verb Forms
  if (/\b(verb|verbs|verb filter|v1|v2|v3|क्रिया|क्रिया शब्द|verb forms)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `BhashaGuru में Verb Filter का उपयोग करने के लिए "Words" स्क्रीन के ऊपर "मूल सूची क्रम" ड्रॉपडाउन पर टैप करें और "Verb (केवल क्रिया शब्द)" चुनें। यह कुल 659 शब्दों में से 156 मुख्य क्रियाओं (Base Verbs) को फ़िल्टर करता है। इसमें हर क्रिया के मुख्य कार्ड के नीचे V2 (Past Simple) और V3 (Past Participle) के दो अलग बॉक्स उनके हिंदी उच्चारण और अर्थ के साथ दिखाए जाते हैं, जैसे Be -> Was/Were (V2) -> Been (V3)!`,
      englishPromptOrExample: `Verbs are action words. In English, learning V1, V2, and V3 forms is essential for tenses!`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'V1 = Present (Go), V2 = Past Simple (Went), V3 = Past Participle (Gone)।',
      askToRepeatCorrection: false,
      grammarScore: 96,
      speakingScore: 94,
    };
  }

  // C. Sentence Builder & SVO Grammar Rule
  if (/\b(sentence builder|svo|वाक्य निर्माण|sentence banana|subject verb object)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `Sentence Builder (वाक्य निर्माण) "Learn" (दैनिक पाठ) टैब में उपलब्ध है। यह अंग्रेजी का सबसे महत्वपूर्ण नियम "SVO" (Subject + Verb + Object) सिखाता है। हिंदी में हम "मैं (S) खाना (O) खाता हूँ (V)" बोलते हैं, लेकिन अंग्रेजी में "I (S) eat (V) food (O)" बोला जाता है। इसमें दो मोड्स हैं: "Chips Mode" (टुकड़ों को क्रम में जोड़ना) और "Type Mode" (सीधे टाइप करना), तथा 3 लेवल्स (Beginner, Intermediate, Advanced) हैं।`,
      englishPromptOrExample: `In English, always remember the order: Subject + Verb + Object.`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'अंग्रेजी में क्रिया (Verb) हमेशा कर्म (Object) से पहले आती है।',
      askToRepeatCorrection: false,
      grammarScore: 96,
      speakingScore: 94,
    };
  }

  // D. 5 Tenses Practice & "Practice with My Words"
  if (/\b(5 tenses|five tenses|tense|tenses|5 काल|काल अभ्यास|practice with my words|मेरे शब्दों से अभ्यास)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `5 Tenses Practice "Learn" टैब में है। इसमें 5 सबसे जरूरी काल सिखाए जाते हैं:\n1. Present Simple (I speak / He speaks)\n2. Past Simple (I spoke - इसमें V2 का प्रयोग होता है)\n3. Future Simple (I will speak)\n4. Present Continuous (I am speaking)\n5. Present Perfect (I have spoken - इसमें V3 का प्रयोग होता है)\n\nविशेष सुविधा: इसमें "मेरे शब्दों से अभ्यास" (Practice with My Words) बटन है, जिससे आप अपने सेव किए गए 156 क्रिया शब्दों को चुनकर सीधे काल का अभ्यास कर सकते हैं!`,
      englishPromptOrExample: `Tenses are the backbone of spoken English fluency.`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'Past Simple में हमेशा क्रिया का V2 रूप और Present Perfect में Has/Have के साथ V3 रूप लगता है।',
      askToRepeatCorrection: false,
      grammarScore: 97,
      speakingScore: 95,
    };
  }

  // E. Words Section, Vocabulary Count & Sorting
  if (/\b(words screen|words section|kitne words|vocabulary count|kul shabd|kitne shabd|कुल शब्द|कितने शब्द|659|sorting|sort dropdown|मूल सूची क्रम)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `BhashaGuru के Words सेक्शन में कुल 659 प्रामाणिक वोकैबुलरी शब्द हैं। आप इन्हें "मूल सूची क्रम (1–659)", "A → Z", "Z → A", या "Verb (केवल क्रिया शब्द)" में सॉर्ट कर सकते हैं। प्रति पृष्ठ 10 से 660 तक शब्द देख सकते हैं। हर कार्ड में देवनागरी उच्चारण, हिंदी अर्थ, अमेरिकी उच्चारण ऑडियो (स्पीकर आइकन), उच्चारण जाँच (माइक), और सेंटेंस बिल्डर बटन मौजूद है!`,
      englishPromptOrExample: `You have 659 saved vocabulary words ready for daily practice.`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'नियमित रूप से 10-20 शब्दों का रिवीजन करने से वोकैबुलरी बहुत तेजी से बढ़ती है।',
      askToRepeatCorrection: false,
      grammarScore: 95,
      speakingScore: 92,
    };
  }

  // F. Listening & Shadowing Studio
  if (/\b(listening|shadowing|शैडोइंग|सुनना और दोहराना|audio speed|hide english|अंग्रेजी छुपाएं)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `Listening & Shadowing Studio "Learn" सेक्शन में है। "Shadowing" का मतलब है किसी नेटिव स्पीकर की आवाज़ सुनकर ठीक उसी समय उसके पीछे-पीछे बोलना (जैसे परछाईं)। इसमें दो ऑडियो स्पीड हैं: 1.0x (सामान्य) और 0.75x (धीमी)। इसमें "Hide English" (आँख का आइकन) टॉगल भी है, जिससे आप केवल सुनकर समझने की शक्ति बढ़ा सकते हैं और फिर माइक दबाकर अपना उच्चारण मिला सकते हैं!`,
      englishPromptOrExample: `Shadowing trains your tongue muscles and brain for natural English rhythm!`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'शैडोइंग तकनीक से बोलने की हिचकिचाहट और उच्चारण दोष पूरी तरह दूर होते हैं।',
      askToRepeatCorrection: false,
      grammarScore: 96,
      speakingScore: 94,
    };
  }

  // G. 10-Day Speaking Course
  if (/\b(10 day|speaking course|१० दिन|10-day|दस दिन का कोर्स|कोर्स)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `10-Day Speaking Course "Learn" टैब में एक सुनियोजित पाठ्यक्रम है। यह Day 1 (अपना परिचय) से शुरू होकर Day 2 (दैनिक दिनचर्या), कार्यक्षेत्र (Workplace), खरीदारी, यात्रा, डॉक्टर के पास बातचीत से होते हुए Day 10 (आत्मविश्वास से बातचीत) तक ले जाता है। हर दिन स्पष्ट वाक्य पैटर्न और हिंदी मार्गदर्शन मिलता है!`,
      englishPromptOrExample: `Step by step, day by day, you will build conversational confidence!`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'प्रतिदिन केवल एक पाठ पूरा करने से 10 दिनों में बुनियादी बातचीत में आत्मविश्वास आ जाता है।',
      askToRepeatCorrection: false,
      grammarScore: 95,
      speakingScore: 92,
    };
  }

  // H. Settings & Theme
  if (/\b(settings|dark mode|light mode|theme|voice|voice gender|hindi ratio|speed|सेटिंग्स|डार्क मोड|थीम)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `Settings (सेटिंग्स) नीचे दिए गए बॉटम नेविगेशन बार के अंतिम विकल्प में है। यहाँ आप निम्न सेटिंग्स बदल सकते हैं:\n1. Theme: Dark Mode या Light Mode (यह स्थायी रूप से सेव रहता है)\n2. Difficulty: Beginner, Intermediate, या Advanced\n3. Hindi Ratio Slider: आपको कितनी हिंदी सहायता चाहिए (0% से 100% तक)\n4. Voice & Persona: Male / Female आवाज़ और 5 AI पर्सोना (Puck, Charon, Fenrir, Kore, Zephyr)\n5. Speaking Speed: Normal (1.0x) या Slow (0.8x)\n6. TTS Engine: Cloud AI या Browser Native!`,
      englishPromptOrExample: `You can customize your learning experience anytime in the Settings screen!`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'Settings से आप अपनी गति और स्तर के अनुसार BhashaGuru को ढाल सकते हैं।',
      askToRepeatCorrection: false,
      grammarScore: 96,
      speakingScore: 94,
    };
  }

  // I. Progress & Streak
  if (/\b(progress|streak|accuracy|score|प्रगति|दिनों का सिलसिला|एक्यूरेसी)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `Progress (प्रगति) टैब बॉटम बार में चौथे नंबर पर है। यहाँ आप अपनी सीखने की प्रगति देख सकते हैं:\n- Day Streak: आप लगातार कितने दिनों से सीख रहे हैं।\n- Overall Accuracy % और Pronunciation Score %।\n- याद हो चुके शब्द ("याद हो गया") और दोहराने योग्य शब्द ("Confusion")।\n- AI Mistake Memory: आपकी पुरानी व्याकरण या उच्चारण की गलतियों का विश्लेषण, ताकि आप उन पर दोबारा काम कर सकें!`,
      englishPromptOrExample: `Consistent daily practice is the true secret to English mastery.`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'अपनी प्रगति को नियमित देखना आत्मविश्वास और निरंतरता बनाए रखता है।',
      askToRepeatCorrection: false,
      grammarScore: 95,
      speakingScore: 92,
    };
  }

  // J. AI Coach / Teacher Identity & Dual Roles
  if (/\b(who are you|aap kaun ho|tum kaun ho|ai coach|ai teacher|bhashaguru|आप कौन हैं)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `नमस्ते! I am BhashaGuru, आपकी पर्सनल AI इंग्लिश स्पीकिंग कोच और स्टूडेंट गाइड! मेरी दोहरी भूमिका (Dual Roles) है:\n1. App Guide: मैं BhashaGuru ऐप के हर फ़ीचर, बटन, स्क्रीन और सेटिंग को विस्तार से समझा सकती हूँ।\n2. English Teacher: आप मुझसे लाइव बोलकर या चैट करके अंग्रेजी सीख सकते हैं, मैं आपकी गलतियों को बड़े प्यार से सुधारती हूँ और आसान हिंदी में नियम समझाती हूँ। आप मुझसे ऐप के बारे में कुछ भी पूछ सकते हैं या अंग्रेजी में बात शुरू कर सकते हैं!`,
      englishPromptOrExample: `I am your personal English tutor and guide. How can I help you today?`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'BhashaGuru आपके साथ 24x7 एक धैर्यवान शिक्षक की तरह अभ्यास करने के लिए उपलब्ध है।',
      askToRepeatCorrection: false,
      grammarScore: 98,
      speakingScore: 96,
    };
  }

  // 1. Student asking translation or meaning
  if (/\b(how do i say|how to say|kaise bolte|kya bolte|in english)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `ज़रूर! इस तरह की बात कहने के लिए आप बोल सकते हैं: "Could you please explain that to me?" या "How do I express this naturally?"। आप इसे एक बार बोलकर देखिए!`,
      englishPromptOrExample: `Could you please explain this to me?`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'स्वाभाविक अंग्रेजी में विनम्रता के लिए "Could you please..." का प्रयोग सबसे अच्छा होता है।',
      askToRepeatCorrection: false,
      grammarScore: 90,
      speakingScore: 90,
    };
  }

  // 2. Student asking "what does ... mean"
  if (/\b(what does .* mean|meaning of|ka matlab)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `बहुत अच्छा सवाल! जब हम किसी शब्द का अर्थ जानना चाहते हैं, तो उसका संदर्भ समझना बहुत उपयोगी होता है। उदाहरण के लिए, "borrow" का मतलब होता है "उधार लेना या कुछ समय के लिए किसी चीज़ को उपयोग करना"। आप इस शब्द से एक वाक्य बनाकर बोलेंगे?`,
      englishPromptOrExample: `Can I borrow your notebook for one day?`,
      targetWordsUsed: ['borrow'],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'नए शब्द सीखने के बाद तुरंत उससे एक वाक्य बोलना याद रखने का सबसे पक्का तरीका है।',
      askToRepeatCorrection: false,
      grammarScore: 92,
      speakingScore: 90,
    };
  }

  // 3. Student asking "why went instead of go" or grammar question
  if (/\b(why.*went|went.*instead.*go|past tense)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `बहुत बढ़िया सवाल! "Go" वर्तमान काल (Present) के लिए इस्तेमाल होता है जैसे "I go every day"। लेकिन जब काम बीते समय (Yesterday, Last week) में हो चुका हो, तो क्रिया का दूसरा रूप (Past V2) "Went" इस्तेमाल किया जाता है। जैसे: "Yesterday, I went to the market."`,
      englishPromptOrExample: `Yesterday, I went to the market.`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: 'बीते समय के वाक्यों में हमेशा V2 (Went, Saw, Bought, Met) का उपयोग होता है।',
      askToRepeatCorrection: false,
      grammarScore: 95,
      speakingScore: 92,
    };
  }

  // 4. Student asking for examples
  if (/\b(example|examples|aur example|ek aur)\b/i.test(lower)) {
    return {
      teacherReplyHindiAndEn: `यहाँ दो बहुत व्यावहारिक उदाहरण हैं:\n1. "I went to Delhi last Sunday." (मैं पिछले रविवार दिल्ली गया था।)\n2. "She bought fresh vegetables yesterday." (उसने कल ताज़ी सब्ज़ियाँ खरीदीं।)\n\nअब आप बताइए, कल आपने क्या किया था?`,
      englishPromptOrExample: `Yesterday, I met my colleagues after work.`,
      targetWordsUsed: [],
      hadMistake: false,
      userOriginalSentence: clean,
      correctedEnglishSentence: '',
      mistakeExplanationHindi: '',
      askToRepeatCorrection: false,
      grammarScore: 92,
      speakingScore: 92,
    };
  }

  // 5. Grammar mistake: Yesterday + go/see/buy/take
  if (/yesterday/i.test(lower) && /\b(go|see|buy|take|borrow)\b/i.test(lower)) {
    const corrected = clean
      .replace(/\bi go\b/i, 'I went')
      .replace(/\bi see\b/i, 'I saw')
      .replace(/\bi buy\b/i, 'I bought')
      .replace(/\bi take\b/i, 'I took')
      .replace(/\bi borrow\b/i, 'I borrowed')
      .replace(/\bto market\b/i, 'to the market');

    return {
      teacherReplyHindiAndEn: `Good try! A more natural and correct sentence is: "${corrected}".\n\nबीते हुए समय (Yesterday) के लिए "go" की जगह past form "went" का इस्तेमाल होगा। अब बताइए, वहाँ आपने क्या किया?`,
      englishPromptOrExample: corrected,
      targetWordsUsed: [],
      hadMistake: true,
      userOriginalSentence: clean,
      correctedEnglishSentence: corrected,
      mistakeExplanationHindi: 'Yesterday बीते हुए समय को बताता है, इसलिए यहाँ क्रिया का Past रूप (V2) इस्तेमाल होगा।',
      askToRepeatCorrection: true,
      grammarScore: 72,
      speakingScore: 78,
    };
  }

  // 6. Grammar mistake: "I am agree"
  if (/\bi am agree\b/i.test(lower)) {
    const corrected = clean.replace(/\bi am agree\b/i, 'I agree');
    return {
      teacherReplyHindiAndEn: `अच्छी कोशिश! English में "agree" खुद एक क्रिया (Verb) है, इसलिए "I am agree" के बजाय सीधे "I agree" कहा जाता है। सही वाक्य है: "${corrected}".`,
      englishPromptOrExample: corrected,
      targetWordsUsed: [],
      hadMistake: true,
      userOriginalSentence: clean,
      correctedEnglishSentence: corrected,
      mistakeExplanationHindi: '"Agree" एक Verb है, इसलिए इसके पहले "am" नहीं लगता।',
      askToRepeatCorrection: true,
      grammarScore: 75,
      speakingScore: 80,
    };
  }

  // 7. Grammar mistake: "He don't know"
  if (/\b(he|she|it) don't\b/i.test(lower)) {
    const corrected = clean.replace(/\bdon't\b/i, "doesn't");
    return {
      teacherReplyHindiAndEn: `Good effort! ध्यान दें कि He / She / It के साथ "don't" नहीं, बल्कि "doesn't" का प्रयोग होता है। सही वाक्य है: "${corrected}".`,
      englishPromptOrExample: corrected,
      targetWordsUsed: [],
      hadMistake: true,
      userOriginalSentence: clean,
      correctedEnglishSentence: corrected,
      mistakeExplanationHindi: 'तीसरे व्यक्ति एकवचन (He/She) के साथ doesn\'t का प्रयोग होता है।',
      askToRepeatCorrection: true,
      grammarScore: 76,
      speakingScore: 82,
    };
  }

  // 8. Default correct & natural English
  const isGoodLength = clean.split(/\s+/).length >= 3;
  return {
    teacherReplyHindiAndEn: `Wonderful! आपका वाक्य बिल्कुल स्वाभाविक और सही है। You spoke clearly! इसी तरह आत्मविश्वास से बात करते रहें। Can you tell me a little more about this?`,
    englishPromptOrExample: `That sounds very interesting! Tell me more about it.`,
    targetWordsUsed: loadedWords.filter((w) => lower.includes(w.toLowerCase())),
    hadMistake: false,
    userOriginalSentence: clean,
    correctedEnglishSentence: '',
    mistakeExplanationHindi: '',
    askToRepeatCorrection: false,
    grammarScore: isGoodLength ? 95 : 88,
    speakingScore: isGoodLength ? 94 : 86,
  };
}

// ----------------------------------------------------
// Express API Routes
// ----------------------------------------------------

// 1. Enrich words
app.post('/api/ai/enrich-words', async (req, res) => {
  try {
    const { words, difficulty = 'BEGINNER' } = req.body;
    if (!Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Words array is required' });
    }

    const ai = getAiClient();
    const targetWords = words.slice(0, 25);

    if (ai && Date.now() >= textQuotaCooldownUntil) {
      const prompt = `You are a friendly, expert English teacher for Hindi speakers ("BhashaGuru").
Difficulty level: ${difficulty}.
For each of the following English words, generate beginner-friendly, natural, practical learning data:
Words: ${targetWords.join(', ')}

For each word provide:
- word: exact English word (lowercase)
- hindiMeaning: clear Hindi meaning in Devanagari (e.g. "उधार लेना")
- phoneticHindi: how to pronounce the English word written in Hindi Devanagari script (e.g. "बॉ-रो" for borrow)
- pronunciationTipHindi: a warm, simple tip in Hindi on how to pronounce it accurately
- usageExplanationHindi: a natural 1-sentence explanation in Hindi of when and how to use this word
- simpleSentence: a short, natural everyday English sentence using the word
- realLifeSentence: a realistic, practical situation sentence in English using the word
- questionPromptEn: a natural English question using the word
- questionTypeA_HindiToEn: a natural Hindi sentence using the concept that the student must translate into English using this word
- questionTypeB_FillBlank: an English sentence with "_____" where this word belongs
- questionTypeC_SituationHindi: a realistic situation described in natural Hindi (asking the student what they would say in English using this word)
- questionTypeD_MeaningHindi: a question in Hindi asking what this word means or how to use it`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                hindiMeaning: { type: Type.STRING },
                phoneticHindi: { type: Type.STRING },
                pronunciationTipHindi: { type: Type.STRING },
                usageExplanationHindi: { type: Type.STRING },
                simpleSentence: { type: Type.STRING },
                realLifeSentence: { type: Type.STRING },
                questionPromptEn: { type: Type.STRING },
                questionTypeA_HindiToEn: { type: Type.STRING },
                questionTypeB_FillBlank: { type: Type.STRING },
                questionTypeC_SituationHindi: { type: Type.STRING },
                questionTypeD_MeaningHindi: { type: Type.STRING },
              },
              required: [
                'word',
                'hindiMeaning',
                'phoneticHindi',
                'pronunciationTipHindi',
                'usageExplanationHindi',
                'simpleSentence',
                'realLifeSentence',
                'questionPromptEn',
                'questionTypeA_HindiToEn',
                'questionTypeB_FillBlank',
                'questionTypeC_SituationHindi',
                'questionTypeD_MeaningHindi',
              ],
            },
          },
        },
      });

      if (response && response.text) {
        const enriched = extractJsonFromText(response.text);
        if (Array.isArray(enriched) && enriched.length > 0) {
          return res.json({ enriched });
        }
      }
    }

    // High-quality server fallback
    const enriched = targetWords.map((w: string) => {
      const breakdown = generateServerSemanticBreakdown(w, undefined, difficulty);
      return {
        word: w.toLowerCase().trim(),
        hindiMeaning: breakdown.primaryHindiMeaning,
        phoneticHindi: breakdown.phoneticHindi,
        pronunciationTipHindi: breakdown.pronunciationTipHindi || `स्पष्टता से उच्चारण करें।`,
        usageExplanationHindi: breakdown.whyUsedHindi,
        simpleSentence: breakdown.primaryExampleEn,
        realLifeSentence: breakdown.secondaryUsage?.secondaryExampleEn || breakdown.primaryExampleEn,
        questionPromptEn: `When do you naturally use the word "${w}"?`,
        questionTypeA_HindiToEn: breakdown.primaryExampleHi,
        questionTypeB_FillBlank: `Please _____ this word in a natural sentence.`,
        questionTypeC_SituationHindi: `${breakdown.situationContext}: आप इस स्थिति में English में क्या कहेंगे?`,
        questionTypeD_MeaningHindi: `"${w}" का क्या अर्थ होता है?`,
      };
    });

    return res.json({ enriched, fallback: true });
  } catch (err: any) {
    return res.json({ enriched: [], fallback: true });
  }
});

// 1.5. Dynamic word examples generator
app.post('/api/ai/generate-examples', async (req, res) => {
  try {
    const { word, hindiMeaning, difficulty = 'BEGINNER' } = req.body;
    if (!word) return res.status(400).json({ error: 'Word is required' });

    const cleanWord = word.trim();
    const ai = getAiClient();

    if (ai && Date.now() >= textQuotaCooldownUntil) {
      const prompt = `You are an expert bilingual English-Hindi teacher.
Generate 3 distinct, authentic, natural, everyday English example sentences using the word "${cleanWord}" (Hindi meaning: "${hindiMeaning || ''}").
Learner difficulty: ${difficulty}.
CRITICAL REQUIREMENT: Do NOT generate robotic template sentences. Generate real-world conversational sentences.
Provide:
1. Daily life sentence (simple) with Hindi translation.
2. Conversation / request sentence with Hindi translation.
3. Workplace / social scenario sentence with Hindi translation.`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              examples: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    english: { type: Type.STRING },
                    hindiTranslation: { type: Type.STRING },
                    categoryLabel: { type: Type.STRING },
                  },
                  required: ['english', 'hindiTranslation', 'categoryLabel'],
                },
              },
            },
            required: ['examples'],
          },
        },
      });

      if (response && response.text) {
        const parsed = extractJsonFromText(response.text);
        if (parsed && Array.isArray(parsed.examples) && parsed.examples.length > 0) {
          return res.json(parsed);
        }
      }
    }

    // High-quality server fallback
    const fallbackExamples = generateServerWordExamples(cleanWord, difficulty, hindiMeaning);
    return res.json({ examples: fallbackExamples, fallback: true });
  } catch (err: any) {
    const fallbackExamples = generateServerWordExamples(req.body?.word || 'word', req.body?.difficulty || 'BEGINNER');
    return res.json({ examples: fallbackExamples, fallback: true });
  }
});

// 1.6. Deep Semantic Word Context & Real Usage Breakdown
app.post('/api/ai/word-context-breakdown', async (req, res) => {
  try {
    const { word, hindiMeaning, difficulty = 'BEGINNER', contextTheme } = req.body;
    if (!word || !word.trim()) return res.status(400).json({ error: 'Word is required' });

    const cleanWord = word.trim();
    const ai = getAiClient();

    if (ai && Date.now() >= textQuotaCooldownUntil) {
      const prompt = `You are a world-class English teacher helping Hindi speakers understand and speak English naturally.
The student has selected the vocabulary word: "${cleanWord}" (User hint: "${hindiMeaning || ''}").
Learner level: ${difficulty}.
${contextTheme ? `Desired context or situation: "${contextTheme}".` : ''}

CRITICAL ANTI-TEMPLATE PEDAGOGICAL RULE:
- NEVER output generic template sentences like "I [WORD] every day", "I like to [WORD]", "This is a [WORD]", "The [WORD] is good".
- Understand:
  1. The actual meaning and part of speech of "${cleanWord}".
  2. The natural, common real-life situation where native English speakers naturally use this word.
  3. Tailor the sentence naturally to the learner's level (${difficulty}).
  4. Provide a clear Hindi explanation of WHY "${cleanWord}" is used in this specific situation.
  5. Check if "${cleanWord}" has another common second meaning. If yes, provide that second meaning and a distinct natural example!

Return JSON matching the schema.`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              partOfSpeech: { type: Type.STRING },
              primaryHindiMeaning: { type: Type.STRING },
              phoneticHindi: { type: Type.STRING },
              pronunciationTipHindi: { type: Type.STRING },
              situationContext: { type: Type.STRING },
              primaryExampleEn: { type: Type.STRING },
              primaryExampleHi: { type: Type.STRING },
              whyUsedHindi: { type: Type.STRING },
              secondaryUsage: {
                type: Type.OBJECT,
                properties: {
                  hasSecondaryMeaning: { type: Type.BOOLEAN },
                  secondaryMeaningHindi: { type: Type.STRING },
                  secondaryContext: { type: Type.STRING },
                  secondaryExampleEn: { type: Type.STRING },
                  secondaryExampleHi: { type: Type.STRING },
                  secondaryWhyUsedHindi: { type: Type.STRING },
                },
                required: ['hasSecondaryMeaning'],
              },
              practicalTip: { type: Type.STRING },
            },
            required: [
              'word',
              'partOfSpeech',
              'primaryHindiMeaning',
              'phoneticHindi',
              'situationContext',
              'primaryExampleEn',
              'primaryExampleHi',
              'whyUsedHindi',
            ],
          },
        },
      });

      if (response && response.text) {
        const parsed = extractJsonFromText(response.text);
        if (parsed && parsed.word && parsed.primaryExampleEn) {
          return res.json(parsed);
        }
      }
    }

    // High-quality server semantic fallback
    const fallbackBreakdown = generateServerSemanticBreakdown(cleanWord, hindiMeaning, difficulty, contextTheme);
    return res.json(fallbackBreakdown);
  } catch (err: any) {
    const fallbackBreakdown = generateServerSemanticBreakdown(req.body?.word || 'word', req.body?.hindiMeaning);
    return res.json(fallbackBreakdown);
  }
});

// 2. Evaluate answer
app.post('/api/ai/evaluate-answer', async (req, res) => {
  try {
    const {
      word,
      hindiMeaning,
      questionType,
      questionPrompt,
      expectedAnswer,
      userAnswer,
      difficulty = 'BEGINNER',
      hindiRatio = 70,
      isSpoken = false,
    } = req.body;

    const ai = getAiClient();

    if (ai && Date.now() >= textQuotaCooldownUntil) {
      const prompt = `You are a patient, encouraging human-like English teacher for Hindi speakers.
Learner Difficulty Level: ${difficulty}
Hindi Explanation Ratio: ${hindiRatio}% Hindi
Target Vocabulary Word: "${word}" (Meaning: ${hindiMeaning})
Question Type: ${questionType}
Question Asked: "${questionPrompt}"
Expected Answer: "${expectedAnswer}"
Learner's Actual Answer: "${userAnswer}"

Return JSON matching the schema.`;

      const response = await generateContentWithFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              isAccepted: { type: Type.BOOLEAN },
              requiresRetry: { type: Type.BOOLEAN },
              feedbackHindi: { type: Type.STRING },
              correctedSentence: { type: Type.STRING },
              primaryErrorCategory: { type: Type.STRING },
              errorHighlightWrong: { type: Type.STRING },
              errorHighlightRight: { type: Type.STRING },
              grammarScore: { type: Type.INTEGER },
              pronunciationScore: { type: Type.INTEGER },
              pronunciationTipHindi: { type: Type.STRING },
              spokenTeacherResponse: { type: Type.STRING },
            },
            required: [
              'status',
              'isAccepted',
              'requiresRetry',
              'feedbackHindi',
              'correctedSentence',
              'primaryErrorCategory',
              'grammarScore',
              'pronunciationScore',
              'spokenTeacherResponse',
            ],
          },
        },
      });

      if (response && response.text) {
        const parsed = extractJsonFromText(response.text);
        if (parsed && parsed.status) {
          return res.json(parsed);
        }
      }
    }

    // High-quality local evaluator fallback
    const localEval = evaluateServerAnswerLocally(
      word,
      hindiMeaning,
      questionType,
      questionPrompt,
      expectedAnswer,
      userAnswer,
      difficulty,
      hindiRatio,
      isSpoken
    );
    return res.json(localEval);
  } catch (err: any) {
    const localEval = evaluateServerAnswerLocally(
      req.body?.word || '',
      req.body?.hindiMeaning || '',
      req.body?.questionType || '',
      req.body?.questionPrompt || '',
      req.body?.expectedAnswer || '',
      req.body?.userAnswer || '',
      req.body?.difficulty || 'BEGINNER',
      70,
      false
    );
    return res.json(localEval);
  }
});

// 3. Pronunciation checker
app.post('/api/ai/check-pronunciation', async (req, res) => {
  try {
    const { targetText = '', spokenTranscript = '', word = '', phoneticHindi = '' } = req.body;
    const ai = getAiClient();

    if (ai && Date.now() >= textQuotaCooldownUntil) {
      const response = await generateContentWithFallback(ai, {
        contents: `Analyze pronunciation. Target: "${targetText}" (word: "${word}", phonetic: "${phoneticHindi}"). Spoken: "${spokenTranscript}". Return JSON with status, score, syllableBreakdownEn, syllableBreakdownHi, feedbackHindi, focusSound.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              score: { type: Type.INTEGER },
              syllableBreakdownEn: { type: Type.STRING },
              syllableBreakdownHi: { type: Type.STRING },
              feedbackHindi: { type: Type.STRING },
              focusSound: { type: Type.STRING },
            },
            required: ['status', 'score', 'syllableBreakdownEn', 'syllableBreakdownHi', 'feedbackHindi', 'focusSound'],
          },
        },
      });

      if (response && response.text) {
        const parsed = extractJsonFromText(response.text);
        if (parsed && parsed.status) {
          return res.json(parsed);
        }
      }
    }

    // Local pronunciation fallback
    const targetClean = targetText.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const spokenClean = spokenTranscript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const matches = targetClean === spokenClean || (targetClean && spokenClean.includes(targetClean));

    return res.json({
      status: matches ? 'CORRECT' : 'NEEDS_PRACTICE',
      score: matches ? 95 : 75,
      syllableBreakdownEn: word || targetText,
      syllableBreakdownHi: phoneticHindi || word || targetText,
      feedbackHindi: matches
        ? 'बहुत बढ़िया उच्चारण! हर ध्वनि स्पष्ट और स्वाभाविक है।'
        : `उच्चारण पर थोड़ा और ध्यान दें। "${phoneticHindi || word}" को आराम से बोलें।`,
      focusSound: word || targetText,
      fallback: true,
    });
  } catch (err: any) {
    return res.json({
      status: 'CORRECT',
      score: 85,
      syllableBreakdownEn: req.body?.word || '',
      syllableBreakdownHi: req.body?.phoneticHindi || '',
      feedbackHindi: 'अच्छा प्रयास!',
      focusSound: '',
      fallback: true,
    });
  }
});

// 4. Natural Conversation Mode
app.post('/api/ai/teacher-conversation', async (req, res) => {
  try {
    const {
      loadedWords = [],
      learnedWords = [],
      missedWords = [],
      commonMistakes = [],
      scenarioTopic = 'Daily Life',
      difficulty = 'BEGINNER',
      hindiRatio = 70,
      messages = [],
      userMessage = '',
      appContext = null,
    } = req.body;

    const ai = getAiClient();

    if (ai && Date.now() >= textQuotaCooldownUntil) {
      const systemInstruction = buildBhashaGuruSystemInstruction(appContext);

      const historyText = messages
        .slice(-8)
        .map((m: any) => `${m.role === 'teacher' ? 'AI Teacher' : 'Learner'}: ${m.content}`)
        .join('\n');

      const contents = userMessage
        ? `Conversation History:\n${historyText}\n\nLearner Message: "${userMessage}"\n\nEvaluate and reply as BhashaGuru (as App Guide if student asked about BhashaGuru app/features/buttons/settings, or as English Teacher if practicing speaking/grammar) in JSON.`
        : `Start a new interactive session for topic "${scenarioTopic}". Greet warmly as BhashaGuru in Hindi and English, introduce how you can help (both with English speaking and answering any questions about the BhashaGuru app), and ask an opening question to get started.`;

      const response = await generateContentWithFallback(ai, {
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              teacherReplyHindiAndEn: { type: Type.STRING },
              englishPromptOrExample: { type: Type.STRING },
              targetWordsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
              hadMistake: { type: Type.BOOLEAN },
              userOriginalSentence: { type: Type.STRING },
              correctedEnglishSentence: { type: Type.STRING },
              mistakeExplanationHindi: { type: Type.STRING },
              askToRepeatCorrection: { type: Type.BOOLEAN },
              grammarScore: { type: Type.INTEGER },
              speakingScore: { type: Type.INTEGER },
            },
            required: [
              'teacherReplyHindiAndEn',
              'englishPromptOrExample',
              'targetWordsUsed',
              'hadMistake',
              'correctedEnglishSentence',
              'mistakeExplanationHindi',
              'askToRepeatCorrection',
              'grammarScore',
              'speakingScore',
            ],
          },
        },
      });

      if (response && response.text) {
        const parsed = extractJsonFromText(response.text);
        if (parsed && parsed.teacherReplyHindiAndEn) {
          return res.json(parsed);
        }
      }
    }

    // High-quality conversational fallback
    const convFallback = generateServerTeacherConversation(
      loadedWords,
      learnedWords,
      missedWords,
      commonMistakes,
      scenarioTopic,
      difficulty,
      hindiRatio,
      messages,
      userMessage
    );
  } catch (err: any) {
    console.error('[teacher-conversation error]:', err?.message || err);
    const convFallback = generateServerTeacherConversation(
      req.body?.loadedWords || [],
      req.body?.learnedWords || [],
      req.body?.missedWords || [],
      req.body?.commonMistakes || [],
      req.body?.scenarioTopic || 'Daily Life',
      req.body?.difficulty || 'BEGINNER',
      req.body?.hindiRatio ?? 70,
      req.body?.messages || [],
      req.body?.userMessage || ''
    );
    return res.json(convFallback);
  }
});

// Simple in-memory audio cache for TTS responses
const ttsAudioCache = new Map<string, { audioBase64: string; mimeType: string }>();
const MAX_TTS_CACHE_ITEMS = 200;

// 5. Modular TTS Endpoint
app.post('/api/ai/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore', voiceGender = 'Female', speed = 'normal' } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });

    const cleanText = text.trim();
    const cacheKey = `${voiceGender}_${voiceName}_${speed}_${cleanText}`;

    // Return cached audio if available
    if (ttsAudioCache.has(cacheKey)) {
      const cached = ttsAudioCache.get(cacheKey)!;
      return res.json({
        audioBase64: cached.audioBase64,
        mimeType: cached.mimeType,
        provider: 'gemini-tts-cached',
        voiceUsed: voiceName,
        genderUsed: voiceGender,
      });
    }

    // If quota cooldown is currently active, immediately inform client to use browser speech
    if (Date.now() < ttsQuotaCooldownUntil) {
      return res.json({
        fallback: true,
        quotaExceeded: true,
        provider: 'browser-speech',
        message: 'TTS cooldown active, using browser speech synthesis',
      });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        fallback: true,
        provider: 'browser-speech',
        message: 'AI client not initialized, using browser speech synthesis',
      });
    }

    let selectedVoice = voiceName;
    const maleVoices = ['Puck', 'Charon', 'Fenrir'];
    const femaleVoices = ['Kore', 'Zephyr'];

    if (voiceGender === 'Male') {
      if (!maleVoices.includes(selectedVoice)) {
        selectedVoice = 'Puck';
      }
    } else {
      if (!femaleVoices.includes(selectedVoice)) {
        selectedVoice = 'Kore';
      }
    }

    const styleInstruction = speed === 'slow'
      ? `Speak slowly, clearly, and patiently like a warm bilingual ${voiceGender} Hindi-English teacher.`
      : `Speak naturally, warmly, and clearly like a friendly bilingual ${voiceGender} Hindi-English teacher.`;

    const ttsModels = ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'];
    let base64Audio: string | undefined;

    for (const modelCandidate of ttsModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelCandidate,
          contents: [
            {
              role: 'user',
              parts: [{ text: cleanText, speechMetadata: { style: styleInstruction } } as any],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: selectedVoice,
                },
              },
            },
          },
        });

        base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) break;
      } catch (genErr: any) {
        if (isQuotaError(genErr)) {
          ttsQuotaCooldownUntil = Date.now() + 15 * 60 * 1000;
          break;
        }
      }
    }

    if (!base64Audio) {
      return res.json({
        fallback: true,
        quotaExceeded: Date.now() < ttsQuotaCooldownUntil,
        provider: 'browser-speech',
        message: 'TTS generation falling back to browser speech synthesis',
      });
    }

    if (ttsAudioCache.size >= MAX_TTS_CACHE_ITEMS) {
      const firstKey = ttsAudioCache.keys().next().value;
      if (firstKey) ttsAudioCache.delete(firstKey);
    }
    ttsAudioCache.set(cacheKey, { audioBase64: base64Audio, mimeType: 'audio/wav' });

    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      provider: 'gemini-tts',
      voiceUsed: selectedVoice,
      genderUsed: voiceGender,
    });
  } catch {
    return res.json({
      fallback: true,
      provider: 'browser-speech',
    });
  }
});

// 6. Modular STT Endpoint
app.post('/api/ai/stt', async (req, res) => {
  const startTime = Date.now();
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) return res.status(400).json({ error: 'Audio data is required' });

    let cleanAudioBase64 = String(audioBase64 || '').trim();
    if (cleanAudioBase64.includes(',')) {
      cleanAudioBase64 = cleanAudioBase64.substring(cleanAudioBase64.indexOf(',') + 1).trim();
    }
    cleanAudioBase64 = cleanAudioBase64.replace(/\s+/g, '');
    if (cleanAudioBase64.length < 300) {
      return res.json({
        transcript: '',
        fallback: true,
        provider: 'web-speech',
        elapsedMs: Date.now() - startTime,
      });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        transcript: '',
        fallback: true,
        provider: 'web-speech',
        elapsedMs: Date.now() - startTime,
      });
    }

    let cleanMimeType = 'audio/webm';
    if (cleanAudioBase64.startsWith('UklGR')) {
      cleanMimeType = 'audio/wav';
    } else if (cleanAudioBase64.startsWith('GkXf')) {
      cleanMimeType = 'audio/webm';
    } else if (mimeType) {
      const baseMime = mimeType.split(';')[0].trim().toLowerCase();
      if (baseMime.includes('wav')) cleanMimeType = 'audio/wav';
      else if (baseMime.includes('mp4') || baseMime.includes('m4a')) cleanMimeType = 'audio/mp4';
      else if (baseMime.includes('ogg')) cleanMimeType = 'audio/ogg';
      else if (baseMime.includes('webm')) cleanMimeType = 'audio/webm';
      else cleanMimeType = baseMime || 'audio/webm';
    }

    // gemini-3.5-transcribe is the primary dedicated audio transcription model.
    // Multimodal flash models serve as reliable fallbacks.
    const sttModels = [
      'gemini-3.5-transcribe',
      'gemini-3.8-flash',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
    ];

    for (const model of sttModels) {
      try {
        let response: any;
        const callPromise = (async () => {
          if (model === 'gemini-3.5-transcribe') {
            return await ai.models.generateContent({
              model: 'gemini-3.5-transcribe',
              contents: {
                parts: [
                  { inlineData: { mimeType: cleanMimeType, data: cleanAudioBase64 } },
                  { text: 'Transcribe this audio.' },
                ],
              },
            });
          } else {
            return await ai.models.generateContent({
              model,
              contents: [
                { inlineData: { mimeType: cleanMimeType, data: cleanAudioBase64 } },
                {
                  text: 'Transcribe the spoken audio in English or Hindi accurately. Return ONLY the spoken words, with no explanations, no quotes, and no metadata. If the audio is only silence, return [SILENCE].',
                },
              ],
            });
          }
        })();

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('STT model call timeout')), 4500)
        );

        response = await Promise.race([callPromise, timeoutPromise]);

        let rawTranscript = response?.text?.trim() || '';
        if (!rawTranscript && response?.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if ((part as any).audioTranscription?.text) {
              rawTranscript += (part as any).audioTranscription.text + ' ';
            } else if (part.text) {
              rawTranscript += part.text + ' ';
            }
          }
          rawTranscript = rawTranscript.trim();
        }

        if (
          rawTranscript.includes('[SILENCE]') ||
          rawTranscript === '00:00' ||
          rawTranscript.toLowerCase().includes('no audio')
        ) {
          rawTranscript = '';
        }

        if (rawTranscript) {
          return res.json({
            transcript: rawTranscript,
            provider: model,
            elapsedMs: Date.now() - startTime,
            success: true,
          });
        }
      } catch (err: any) {
        // Quiet fallback to next candidate without breaking client flow
      }
    }

    return res.json({
      transcript: '',
      fallback: true,
      provider: 'web-speech',
      elapsedMs: Date.now() - startTime,
    });
  } catch {
    return res.json({
      transcript: '',
      fallback: true,
      provider: 'web-speech',
      elapsedMs: Date.now() - startTime,
    });
  }
});

// 7. Audio & Speech Diagnostics Endpoint
app.get('/api/ai/audio-diagnostics', (_req, res) => {
  const isTtsCooldownActive = Date.now() < ttsQuotaCooldownUntil;
  const isTextCooldownActive = Date.now() < textQuotaCooldownUntil;
  return res.json({
    aiConfigured: !!getEffectiveApiKey(),
    ttsQuotaExceeded: isTtsCooldownActive,
    textQuotaExceeded: isTextCooldownActive,
    ttsQuotaCooldownUntil,
    textQuotaCooldownUntil,
    cachedAudioCount: ttsAudioCache.size,
    ttsModelsSupported: ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'],
    sttModelsSupported: ['gemini-3.5-transcribe', 'gemini-3.8-flash'],
    serverTimestamp: Date.now(),
  });
});

// 8. Gemini Live API Status & Capability Endpoint
app.get('/api/live/status', (_req, res) => {
  const isConfigured = !!getEffectiveApiKey();
  return res.json({
    supported: true,
    configured: isConfigured,
    model: 'gemini-3.8-live',
    voice: 'Kore',
    sampleRates: {
      inputMicPcm: 16000,
      outputPlaybackPcm: 24000,
    },
    features: [
      'continuous_voice_activity_detection',
      'real_time_bidi_audio',
      'interruption_barge_in',
      'input_transcription',
      'output_transcription',
    ],
  });
});

// 9. Persistent Student Learning Profile Endpoints
app.get('/api/student/profile/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const filePath = getStudentProfilePath(studentId);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.status(404).json({ error: 'Student profile not found' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/student/profile/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const filePath = getStudentProfilePath(studentId);
    const profile = req.body;
    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({ error: 'Invalid profile data' });
    }
    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), 'utf-8');
    return res.json({ success: true, studentId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Gemini Live API Real-Time Audio WebSocket Bridge
// ----------------------------------------------------
function setupGeminiLiveWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    // Prevent unhandled socket errors from crashing the process
    socket.on('error', (err) => {
      // Raw TCP socket closed or reset before upgrade completed
      console.warn('[WS Raw Socket Handled]:', err?.message || 'socket error');
    });

    try {
      const parsedUrl = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
      if (parsedUrl.pathname === '/api/live' || parsedUrl.pathname === '/live') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        // Non-live websocket requests (e.g. any other upgrade) should be cleanly terminated
        socket.destroy();
      }
    } catch (err: any) {
      console.warn('[WS Upgrade Handled]:', err?.message || 'upgrade error');
      try {
        socket.destroy();
      } catch {}
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[Gemini Live] Client connected to live session bridge');

    let isClosed = false;
    let isSessionClosing = false;
    let activeLiveSession: any = null;
    let sessionStarted = false;
    let autoStartTimer: NodeJS.Timeout | null = null;

    // Safe sender that avoids ws library unhandled senderOnError calls
    const safeSend = (payload: any) => {
      if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;
      try {
        const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
        clientWs.send(data, (err) => {
          // Providing an error callback prevents ws from invoking unhandled senderOnError
          if (err) {
            // Client socket closed or errored
          }
        });
      } catch (_e) {
        // Suppress synchronous send error
      }
    };

    const closeLiveSession = () => {
      isClosed = true;
      if (autoStartTimer) {
        clearTimeout(autoStartTimer);
        autoStartTimer = null;
      }
      if (activeLiveSession && !isSessionClosing) {
        isSessionClosing = true;
        try {
          activeLiveSession.close();
        } catch (_e) {}
        activeLiveSession = null;
      }
    };

    const apiKey = getEffectiveApiKey();
    if (!apiKey) {
      safeSend({
        type: 'error',
        message: 'AI_API_KEY is not configured on the server. Please add your API key in Render environment variables.',
      });
      try {
        clientWs.close();
      } catch {}
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const startLiveSession = (initData?: {
      topic?: string;
      scenarioLabel?: string;
      difficulty?: string;
      starterPrompt?: string;
      learnerName?: string;
      appContext?: any;
    }) => {
      if (sessionStarted || isClosed) return;
      sessionStarted = true;

      if (autoStartTimer) {
        clearTimeout(autoStartTimer);
        autoStartTimer = null;
      }

      const scenarioLabel = initData?.scenarioLabel || initData?.topic || 'Daily Conversation Fluency';
      const starterPrompt = initData?.starterPrompt || '';
      const chosenVoice = initData?.appContext?.voiceName || 'Kore';

      const systemPrompt = buildBhashaGuruSystemInstruction(initData?.appContext);

      const isAppGuide = initData?.topic === 'app_guide_expert' || scenarioLabel.includes('App Guide');
      const isResume = !!initData?.appContext?.isResumeSession;
      const studentName = initData?.appContext?.studentProfile?.studentName || 'Learner';
      const stoppingPoint = initData?.appContext?.studentProfile?.exactStoppingPoint || 'previous lesson';
      const lastTopic = initData?.appContext?.studentProfile?.lastConversationTopic || 'speaking practice';

      const openingGreeting = isResume
        ? `[SYSTEM_EVENT: The learner tapped "Continue Where We Left Off" / "पिछली पढ़ाई से आगे बढ़ें". Please greet ${studentName} warmly as BhashaGuru, their personal English teacher. Remind them in one short friendly Hindi/Hinglish sentence of their previous topic ("${lastTopic}") and where they stopped ("${stoppingPoint}"), and immediately ask ONE simple warm-up question related to this stopping point to get them speaking!]`
        : starterPrompt
        ? `[SYSTEM_EVENT: The learner tapped Start Call. Topic: "${scenarioLabel}". Starter context: "${starterPrompt}". Please greet the learner warmly in Hindi and English as BhashaGuru (both English Teacher and App Guide), welcome them to this speaking session, and ask ONE opening question to get them talking or answer their app question!]`
        : isAppGuide
        ? `[SYSTEM_EVENT: The learner opened "App Guide & Questions". Greet the learner warmly in Hindi and English as BhashaGuru: "नमस्ते! I am BhashaGuru, आपकी AI इंग्लिश कोच और स्टूडेंट गाइड। आप BhashaGuru ऐप के किसी भी फ़ीचर, बटन, स्क्रीन, या इंग्लिश स्पीकिंग के बारे में मुझसे पूछ सकते हैं। How can I help you today?"]`
        : `[SYSTEM_EVENT: The learner tapped Start Call. Practice Topic: "${scenarioLabel}". Please greet the learner warmly in Hindi and English as BhashaGuru (e.g. "नमस्ते! Welcome to our live speaking session."), introduce the topic briefly, and ask ONE engaging opening question to start!]`;

      let greetingTriggered = false;
      const sendGreetingOnce = (sess: any) => {
        if (greetingTriggered || isClosed || isSessionClosing || !sess) return;
        greetingTriggered = true;
        try {
          sess.sendClientContent({
            turns: [{
              role: 'user',
              parts: [{ text: openingGreeting }],
            }],
            turnComplete: true,
          });
        } catch (err: any) {
          console.warn('[Gemini Live] Initial greeting trigger error:', err?.message || err);
        }
      };

      safeSend({
        type: 'status',
        status: 'connecting',
        message: 'Connecting to Gemini Live API...',
      });

      try {
        const sessionPromise = ai.live.connect({
          model: 'gemini-3.8-live',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: chosenVoice },
              },
            },
            inputAudioTranscription: {
              languageCodes: ['en-IN', 'hi-IN', 'en-US'],
              mode: 'VERBATIM' as any,
            },
            outputAudioTranscription: {},
            systemInstruction: systemPrompt,
          },
          callbacks: {
            onopen: () => {
              console.log('[Gemini Live] Connected upstream to Gemini Live');
              safeSend({ type: 'status', status: 'connected' });
            },
            onmessage: (msg: any) => {
              if (isClosed || isSessionClosing) return;

              if (msg.setupComplete) {
                console.log('[Gemini Live] Setup complete, ready for interaction');
                safeSend({ type: 'status', status: 'ready' });

                if (activeLiveSession) {
                  sendGreetingOnce(activeLiveSession);
                }
              }

              if (msg.serverContent) {
                // 1. Audio chunks from teacher (24kHz PCM base64)
                const parts = msg.serverContent.modelTurn?.parts || [];
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    safeSend({
                      type: 'audio',
                      audio: part.inlineData.data,
                    });
                  }
                  if (part.text && !msg.serverContent.outputTranscription?.text) {
                    safeSend({
                      type: 'transcript',
                      role: 'teacher',
                      text: part.text,
                      isFinal: false,
                    });
                  }
                }

                // 2. Output Transcription of teacher speech
                if (msg.serverContent.outputTranscription?.text) {
                  safeSend({
                    type: 'transcript',
                    role: 'teacher',
                    text: msg.serverContent.outputTranscription.text,
                    isFinal: !!msg.serverContent.outputTranscription.finished,
                  });
                }

                // 3. Input Transcription of learner speech (both interim and final chunks)
                const learnerInputText =
                  msg.serverContent.inputTranscription?.text ||
                  msg.serverContent.interimInputTranscription?.text;
                if (learnerInputText) {
                  safeSend({
                    type: 'transcript',
                    role: 'learner',
                    text: learnerInputText,
                    isFinal: !!(
                      msg.serverContent.inputTranscription?.finished ||
                      msg.serverContent.turnComplete
                    ),
                  });
                }

                // 4. Interruption detected
                if (msg.serverContent.interrupted) {
                  console.log('[Gemini Live] Model interrupted by learner');
                  safeSend({ type: 'interrupted' });
                }

                // 5. Turn Complete
                if (msg.serverContent.turnComplete) {
                  safeSend({ type: 'turnComplete' });
                }
              }
            },
            onerror: (err: any) => {
              const errMsg = err?.message || (err?.error && err.error.message) || 'Gemini Live session notification';
              console.warn('[Gemini Live Notice]:', errMsg);
              safeSend({
                type: 'error',
                message: errMsg,
              });
            },
            onclose: (e: any) => {
              console.log('[Gemini Live] Upstream session closed with code:', e?.code || 1000);
              safeSend({ type: 'closed' });
              closeLiveSession();
            },
          },
        });

        sessionPromise
          .then((sess: any) => {
            if (isClosed || isSessionClosing) {
              try { sess.close(); } catch {}
              return;
            }
            activeLiveSession = sess;
            sendGreetingOnce(sess);
          })
          .catch((err: any) => {
            console.warn('[Gemini Live Connect Notice]:', err?.message || err);
            safeSend({
              type: 'error',
              message: err?.message || 'Failed to establish Gemini Live connection.',
            });
            closeLiveSession();
          });
      } catch (err: any) {
        console.warn('[Gemini Live Init Notice]:', err?.message || err);
        safeSend({
          type: 'error',
          message: err?.message || 'Failed to initialize Gemini Live.',
        });
        closeLiveSession();
      }
    };

    clientWs.on('message', (rawData: any) => {
      if (isClosed || isSessionClosing) return;

      try {
        const text = typeof rawData === 'string' ? rawData : rawData.toString();
        const msg = JSON.parse(text);

        if (msg.type === 'init') {
          startLiveSession(msg);
        } else if (msg.type === 'audio' && msg.audio) {
          if (!sessionStarted) {
            startLiveSession();
          }
          if (activeLiveSession && !isClosed && !isSessionClosing) {
            try {
              activeLiveSession.sendRealtimeInput({
                audio: {
                  data: msg.audio,
                  mimeType: 'audio/pcm;rate=16000',
                },
              });
            } catch (err: any) {
              // Ignore transient buffer drop
            }
          }
        } else if (msg.type === 'text' && msg.text) {
          if (!sessionStarted) {
            startLiveSession();
          }
          if (activeLiveSession && !isClosed && !isSessionClosing) {
            try {
              activeLiveSession.sendClientContent({
                turns: [{
                  role: 'user',
                  parts: [{ text: msg.text }],
                }],
                turnComplete: true,
              });
            } catch (err: any) {
              console.warn('[Gemini Live] Send text notice:', err?.message || err);
            }
          }
        } else if (msg.type === 'close') {
          closeLiveSession();
        }
      } catch (e: any) {
        console.warn('[WS Parse Notice]:', e?.message || e);
      }
    });

    clientWs.on('close', () => {
      closeLiveSession();
    });

    clientWs.on('error', (err: any) => {
      console.warn('[WS Client Notice]:', err?.message || 'client socket closed');
      closeLiveSession();
    });

    // Auto-start session if no explicit init message received within 500ms
    autoStartTimer = setTimeout(() => {
      if (!sessionStarted && !isClosed && clientWs.readyState === WebSocket.OPEN) {
        startLiveSession();
      }
    }, 500);
  });
}

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const httpServer = http.createServer(app);
  setupGeminiLiveWebSocket(httpServer);

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`BhashaGuru server running with Gemini Live API on http://0.0.0.0:${PORT}`);
  });
}

startServer();
