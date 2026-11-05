/**
 * BhashaGuru App Comprehensive Knowledge Base & Feature Registry
 * 
 * Provides 100% accurate, deeply structured knowledge of every screen, menu,
 * button, dropdown, feature, lesson, setting, and progress metric in BhashaGuru.
 * 
 * Used dynamically by the AI Coach to act as:
 * 1. Role A: BhashaGuru App Guide (App Expert explaining all features step-by-step in simple Hindi/Hinglish)
 * 2. Role B: Personal English Teacher (Gentle, encouraging spoken English coach for Hindi speakers)
 */

export interface DynamicAppContext {
  wordsCount?: number;
  baseVerbsCount?: number;
  masteredCount?: number;
  confusionCount?: number;
  toLearnCount?: number;
  activeTab?: string;
  difficulty?: string;
  darkMode?: boolean;
  streakDays?: number;
  accuracy?: number;
  voiceName?: string;
  voiceGender?: string;
  hindiRatio?: number;
  studentProfile?: any;
  isResumeSession?: boolean;
  resumeContext?: any;
}

export const BHASHAGURU_APP_REGISTRY = {
  appName: 'BhashaGuru AI English Teacher',
  tagline: 'Interactive AI English learning app for Hindi speakers',
  
  navigation: [
    {
      id: 'words',
      label: 'Words (शब्द सूची)',
      description: 'सहेजी गई शब्दावली की मुख्य सूची, जहाँ शब्दों का अर्थ, उच्चारण, V1/V2/V3 रूप, ऑडियो और ब्लर मोड उपलब्ध हैं।',
      desktopLocation: 'Top navigation bar -> "Words"',
      mobileLocation: 'Bottom navigation bar -> पहिल आइकॉन "Words" (Book icon)',
    },
    {
      id: 'daily',
      label: 'Learn (अभ्यास)',
      description: 'व्याकरण और बोलने के 5 मुख्य अभ्यास टूल्स: 10-Day Speaking Course, Vocabulary Drill, Sentence Builder, 5 Tenses Practice, और Listening & Shadowing।',
      desktopLocation: 'Top navigation bar -> "Learn (अभ्यास)"',
      mobileLocation: 'Bottom navigation bar -> दूसरा आइकॉन "Learn (अभ्यास)" (Sparkles icon)',
    },
    {
      id: 'teacher',
      label: 'AI Coach (लाइव स्पीकिंग कोच)',
      description: 'Gemini Live आवाज़ आधारित रीयल-टाइम AI टीचर, जिससे सीधे बोलकर बातचीत, अभ्यास और ऐप गाइड की मदद ले सकते हैं।',
      desktopLocation: 'Top navigation bar -> "AI Coach"',
      mobileLocation: 'Bottom navigation bar -> तीसरा आइकॉन "AI Coach" (MessageSquare icon)',
    },
    {
      id: 'dashboard',
      label: 'Progress (प्रगति डैशबोर्ड)',
      description: 'आपकी सीखने की प्रगति, स्ट्रीक डेज़, शब्दावली मास्टर स्थिति, एक्यूरेसी प्रतिशत और AI मेमोरी रिपोर्ट।',
      desktopLocation: 'Top navigation bar -> "Progress"',
      mobileLocation: 'Bottom navigation bar -> चौथा आइकॉन "Progress" (BarChart icon)',
    },
    {
      id: 'settings',
      label: 'Settings (सेटिंग्स)',
      description: 'ऐप की थीम (Dark/Light Mode), सिखाने का स्तर (Difficulty), हिंदी/English अनुपात, आवाज़ का जेंडर (Male/Female), आवाज़ पर्सोना और गति।',
      desktopLocation: 'Top navigation bar -> "Settings"',
      mobileLocation: 'Bottom navigation bar -> पाँचवाँ आइकॉन "Settings" (Gear icon)',
    },
  ],

  wordsSection: {
    title: 'Words Section (शब्दावली सूची)',
    totalDefaultWords: 659,
    baseVerbsCount: 156,
    subFeatures: [
      {
        name: 'मूल सूची क्रम (Default Order)',
        location: 'Words स्क्रीन के शीर्ष पर बायाँ ड्रॉपडाउन (मूल सूची क्रम 1–N)',
        description: 'शब्दावली को उसके मूल प्रामाणिक क्रम (#1 से #659) में प्रदर्शित करता है।',
      },
      {
        name: 'A → Z (Alphabetical Sorting)',
        location: 'Sort ड्रॉपडाउन के अंदर दूसरा विकल्प',
        description: 'अंग्रेज़ी वर्णमाला क्रम (A से Z) में शब्दों को क्रमबद्ध करता है।',
      },
      {
        name: 'Z → A (Reverse Alphabetical Sorting)',
        location: 'Sort ड्रॉपडाउन के अंदर तीसरा विकल्प',
        description: 'उल्टे वर्णमाला क्रम (Z से A) में शब्दों को प्रदर्शित करता है।',
      },
      {
        name: 'Verb (केवल क्रिया शब्द) Filter',
        location: 'Sort ड्रॉपडाउन के अंदर चौथा विकल्प (नीचे डिवाइडर के बाद)',
        description: 'पूरी शब्दावली में से केवल वास्तविक क्रियाओं (156 base verbs) को फ़िल्टर करके दिखाता है। हर क्रिया के नीचे उसके V2 (Past Simple) और V3 (Past Participle) रूप ऑटोमैटिक बॉक्स के रूप में प्रदर्शित होते हैं।',
      },
      {
        name: 'V1, V2, V3 Verb Forms (क्रिया के रूप)',
        location: 'Verb फ़िल्टर सक्रिय होने पर प्रत्येक क्रिया कार्ड के अंदर',
        description: `
• V1 (Base Form): मूल क्रिया रूप (उदा: Be, Go, Write, Eat, Play)।
• V2 (Past Simple): भूतकाल का रूप (उदा: Was/Were, Went, Wrote, Ate, Played)। बैंगनी (Violet) V2 बॉक्स में दिखता है, साथ में इसका शुद्ध उच्चारण, हिंदी अर्थ और ऑडियो बटन भी है।
• V3 (Past Participle): पूर्ण काल का रूप (उदा: Been, Gone, Written, Eaten, Played)। गुलाबी (Fuchsia) V3 बॉक्स में दिखता है, शुद्ध उच्चारण, हिंदी अर्थ और ऑडियो बटन के साथ।
• उपयोग: V1 Present Tense और Modals में, V2 Past Simple में, और V3 Present Perfect (has/have + V3) में इस्तेमाल होता है।
        `.trim(),
      },
      {
        name: 'Blur Mode (ब्लर मोड / रिवीज़न मोड)',
        location: 'Sort और Words per Page ड्रॉपडाउन के ठीक नीचे स्थित टॉगल स्विच',
        description: `
• क्या करता है: जब ब्लर मोड ON होता है, तो हर कार्ड में हिंदी उच्चारण और हिंदी अर्थ पर हल्का ब्लर (Blur) लग जाता है। अंग्रेज़ी शब्द, नंबर और बटन साफ़ दिखते हैं।
• क्यों इस्तेमाल करें: खुद का टेस्ट लेने और एक्टिव रिकॉल के लिए। अंग्रेज़ी शब्द देखकर पहले दिमाग में अर्थ सोचें।
• Tap-to-Reveal: किसी भी ब्लर किए गए उच्चारण या अर्थ पर टैप करने से वह तुरंत साफ़ (reveal) हो जाता है। दोबारा टैप करने पर वापस ब्लर हो जाता है।
        `.trim(),
      },
      {
        name: 'Category Tabs (श्रेणियाँ)',
        location: 'Words स्क्रीन के टॉप पर 4 रंगीन टैब',
        categories: [
          { id: 'to_learn', label: 'याद करना है', meaning: 'वे शब्द जो अभी सीखना शुरू किए हैं या सीख रहे हैं।' },
          { id: 'confusion', label: 'Confusion वाला', meaning: 'वे शब्द जिनमें बोलने या अर्थ समझने में भ्रम होता है और अतिरिक्त अभ्यास चाहिए।' },
          { id: 'mastered', label: 'याद हो गया', meaning: 'वे शब्द जो पूरी तरह कंठस्थ हो चुके हैं और आत्मविश्वास से बोले जा सकते हैं।' },
          { id: 'all', label: 'सभी शब्द', meaning: 'पूरी 659 शब्दावली को एक साथ देखने के लिए।' },
        ],
      },
      {
        name: 'Search Bar (खोजें)',
        location: 'टैब्स के नीचे सर्च इनपुट बॉक्स',
        description: 'अंग्रेज़ी स्पेलिंग, देवनागरी उच्चारण, हिंदी अर्थ या Verb फ़िल्टर में V2/V3 रूपों से तुरंत लाइव खोज करता है।',
      },
      {
        name: 'Words per Page Dropdown (प्रति पृष्ठ शब्द)',
        location: 'शीर्ष पर दायाँ ड्रॉपडाउन',
        options: '10, 20, 30, 50, 100 या सभी शब्द (660) प्रति पृष्ठ।',
      },
      {
        name: 'Card Actions (प्रत्येक शब्द कार्ड के बटन)',
        buttons: [
          { name: '🔊 Audio Playback', desc: 'नीला स्पीकर बटन दबाने से अंग्रेज़ी शब्द का शुद्ध उच्चारण सुनाई देता है।' },
          { name: '🎙️ उच्चारण बोलें (Speak Pronunciation)', desc: 'माइक बटन दबाकर शब्द को ज़ोर से बोलें। AI आपकी आवाज़ सुनकर तुरंत स्कोर (100% या फिर से कोशिश करें) देता है।' },
          { name: '✨ वाक्य बनाएं (Sentence Builder)', desc: 'इस शब्द से बनने वाले सरल दैनिक अंग्रेज़ी वाक्यों का अभ्यास खोलता है।' },
          { name: 'याद हो गया / Confusion / याद करना है', desc: 'शब्द को एक टैप में अपनी मनपसंद श्रेणी में ट्रांसफर करने के बटन।' },
          { name: '✏️ Edit Word', desc: 'शब्द, उच्चारण या अर्थ में बदलाव करने के लिए इनलाइन एडिटर।' },
          { name: '🗑️ Delete Word', desc: 'सूची से शब्द को हटाने का विकल्प।' },
        ],
      },
    ],
  },

  learnSection: {
    title: 'Learn Section (अभ्यास / लेसन्स)',
    subModules: [
      {
        id: 'sentence_builder',
        name: 'Sentence Builder (वाक्य बनाना सीखें)',
        description: 'अंग्रेज़ी के SVO (Subject + Verb + Object) नियम के आधार पर शब्द जोड़कर वाक्य बनाना सिखाता है। हिंदी में क्रिया अंत में आती है (उदा: "मैं चाय पीता हूँ"), लेकिन अंग्रेज़ी में क्रिया बीच में आती है (उदा: "I drink tea")।',
        features: 'Word chips जोड़कर वाक्य बनाना (Arrange Mode) या सीधे टाइप करना (Type Mode)। 3 स्तर: Beginner, Practice, Challenge।',
      },
      {
        id: 'tenses',
        name: '5 Tenses Practice (पाँच काल अभ्यास)',
        description: 'दैनिक बातचीत की 90% बातचीत इन 5 कालों से होती है:',
        tenses: [
          {
            key: 'present_simple',
            nameHi: 'सामान्य वर्तमान काल (Present Simple)',
            formula: 'Subject + V1 (s/es for He/She/It)',
            use: 'दैनिक दिनचर्या, आदतें, सार्वभौमिक सत्य (Daily routines, habits)।',
            example: 'I wake up early. / She drinks milk.',
          },
          {
            key: 'past_simple',
            nameHi: 'सामान्य भूतकाल (Past Simple)',
            formula: 'Subject + V2 (Negative: did not + V1, Question: Did + Subject + V1)',
            use: 'बीते समय में पूरा हो चुका कार्य (Completed past events)।',
            example: 'I went to school yesterday. / They played football.',
          },
          {
            key: 'future_simple',
            nameHi: 'सामान्य भविष्यत् काल (Future Simple)',
            formula: 'Subject + will + V1',
            use: 'आने वाले समय की योजना या इरादा (Future promises, decisions)।',
            example: 'I will learn English. / We will meet tomorrow.',
          },
          {
            key: 'present_continuous',
            nameHi: 'अपूर्ण वर्तमान काल (Present Continuous)',
            formula: 'Subject + is/am/are + V-ing',
            use: 'जो काम इस समय चल रहा है (Actions happening right now)।',
            example: 'I am reading a book. / They are walking.',
          },
          {
            key: 'present_perfect',
            nameHi: 'पूर्ण वर्तमान काल (Present Perfect)',
            formula: 'Subject + have/has + V3',
            use: 'जो कार्य अभी-अभी समाप्त हुआ है या जिसका असर वर्तमान में है।',
            example: 'I have finished my dinner. / She has gone home.',
          },
        ],
        specialFeature: '"मेरे शब्दों से अभ्यास (Practice with My Words)": आपकी सहेजी गई 156 क्रियाओं में से कोई भी क्रिया चुनकर इन 5 कालों में लाइव अभ्यास कर सकते हैं।',
      },
      {
        id: 'listening_shadowing',
        name: 'Listening & Shadowing (सुनो और बोलो)',
        description: 'शैडोइंग तकनीक द्वारा अंग्रेज़ी उच्चारण और सुनने की क्षमता को सुधारता है।',
        features: 'सामान्य गति (1.0x), धीमी गति (0.75x turtle), टेक्स्ट छुपाने/दिखाने का विकल्प, और माइक से अपनी आवाज़ रिकॉर्ड करके बोलने का अभ्यास।',
      },
      {
        id: '10day',
        name: '10-Day Speaking Course',
        description: '10 दिनों का चरणबद्ध स्पोकन इंग्लिश कोर्स (अभिवादन, परिचय, बाज़ार, नौकरी इंटरव्यू, यात्रा आदि)। हर दिन में 8 भाग: वोकैब, रियल बातचीत, स्पीकिंग ड्रिल, क्विज़ और AI टीचर रोलप्ले।',
      },
      {
        id: 'vocab',
        name: 'Vocabulary Drill (Spaced Repetition)',
        description: 'स्मृति विज्ञान (Spaced Repetition) के आधार पर कठिन शब्दों का दैनिक रिवीजन।',
      },
    ],
  },

  aiCoachSection: {
    title: 'AI Coach (लाइव AI टीचर)',
    description: 'BhashaGuru का मुख्य स्पीकिंग पार्टनर जो Gemini 3.8 Live API की मदद से रीयल-टाइम आवाज़ में बातचीत करता है।',
    capabilities: [
      'लाइव आवाज़ में बात करना (Real-time voice conversation)',
      'छात्र की अंग्रेज़ी गलतियों को प्यार से सुधारना और सही वाक्य बताना',
      'एक समय पर एक सवाल पूछना ताकि छात्र आसानी से उत्तर दे सके',
      'ऐप के हर फ़ीचर, बटन और मेनू की पूरी जानकारी देना',
      'नॉइज़ शील्ड मोड (Shielded / Sensitive / Tap-only) जिससे टीवी या बैकग्राउंड शोर से टीचर की बात बीच में न कटे',
      'चैट पैनल: बोले गए वाक्यों का लिखित इतिहास (Transcript) देखना और टाइप करके संदेश भेजना',
    ],
  },

  progressSection: {
    title: 'Progress Section (प्रगति डैशबोर्ड)',
    metrics: [
      { name: 'Day Streak (स्ट्रीक डेज़)', desc: 'लगातार कितने दिनों से रोज़ाना अभ्यास कर रहे हैं।' },
      { name: "Today's Vocabulary", desc: 'कुल शब्दों में से कितने शब्द सीखे (Learned), कितने याद हो गए (Mastered) और कितने बाकी (Remaining) हैं।' },
      { name: 'Overall Accuracy (सटीकता)', desc: 'प्रश्नों में सही उत्तर देने का प्रतिशत।' },
      { name: 'Pronunciation Score (उच्चारण स्कोर)', desc: 'शब्दों और वाक्यों के उच्चारण की स्पष्टता (Syllable & Clarity Index)।' },
      { name: 'Grammar & Speaking Score', desc: 'व्याकरण की शुद्धता और बोलने की निरंतरता का स्कोर।' },
      { name: 'Needs Practice (अभ्यास की ज़रूरत)', desc: 'वे शब्द जिनमें गलतियाँ हुईं, और उन्हें तुरंत "Practice Now" बटन से दोहराने की सुविधा।' },
      { name: 'AI Teacher Learning Memory', desc: 'AI टीचर द्वारा दर्ज की गई छात्र की मुख्य कमज़ोरियाँ व कठिन शब्द।' },
    ],
  },

  settingsSection: {
    title: 'Settings Section (ऐप सेटिंग्स)',
    options: [
      { name: 'App Theme (थीम चुनें)', desc: 'Dark Mode (डार्क मोड) या Light Mode (लाइट मोड) चुनें। पूरी ऐप तुरंत बदलती है।' },
      { name: 'Difficulty Level (स्तर)', desc: 'BEGINNER (शुरुआती - पूरा हिंदी सहारा), INTERMEDIATE (मध्यम - संतुलित), ADVANCED (उन्नत - अधिक अंग्रेज़ी)।' },
      { name: 'Hindi / English Explanation Ratio', desc: 'स्लाइडर (20% से 90%) - तय करता है कि AI टीचर कितनी हिंदी और कितनी अंग्रेज़ी में समझाए।' },
      { name: 'Voice Gender (आवाज़ का लिंग)', desc: 'Male Voice (पुरुष आवाज़) या Female Voice (महिला आवाज़)।' },
      { name: 'AI Teacher Voice Persona', desc: 'Puck (उत्साही मेल), Charon (शांत व धैर्यवान मेल), Fenrir (स्पष्ट मेल), Kore (गर्मजोशी वाली फीमेल), Zephyr (कोमल फीमेल)।' },
      { name: 'Voice Engine & Speed', desc: 'AI Voice (Gemini Natural) या Device Voice (System TTS)। गति: Normal (1.0x) या Slow (0.8x)।' },
      { name: 'Test Current Teacher Voice', desc: '🔊 Test Hindi Speech और 🔊 Test English Speech बटन आवाज़ का डेमो सुनने के लिए।' },
      { name: 'Preserve Spoken Audio Recordings', desc: 'रिकॉर्ड किए गए ऑडियो को सेव रखने का टॉगल (ON/OFF) और Clear History बटन।' },
    ],
  },
};

/**
 * Builds the dynamic context-aware system instruction for the AI Coach.
 * Integrates real live numbers (total words, verbs count, streak, active tab, etc.)
 */
export function buildBhashaGuruSystemInstruction(context: DynamicAppContext = {}): string {
  const wordsCount = context.wordsCount ?? 659;
  const baseVerbsCount = context.baseVerbsCount ?? 156;
  const activeTab = context.activeTab || 'words';
  const difficulty = context.difficulty || 'BEGINNER';
  const streak = context.streakDays ?? 3;
  const accuracy = context.accuracy ?? 84;
  const darkMode = context.darkMode !== false;
  const voiceGender = context.voiceGender || 'Female';
  const voiceName = context.voiceName || 'Kore';
  const hindiRatio = context.hindiRatio ?? 70;
  const student = context.studentProfile || null;
  const isResume = context.isResumeSession || false;

  return `You are "BhashaGuru" — the dedicated Personal AI English Teacher, Student Guide, and Complete App Expert for Hindi-speaking learners.

==================================================
EIGHT CONNECTED AI TEACHING CAPABILITIES (UNIFIED AS ONE BHASHAGURU):
==================================================
You are ONE warm, patient, and highly adaptive AI English Teacher combining these 8 roles seamlessly:
1. PERSONAL ENGLISH TEACHER: Guides Hindi beginners step-by-step. Uses simple Hindi/Hinglish scaffolding, short everyday English sentences, comprehensible input (i+1), and reduces speaking anxiety. Never assumes grammar jargon.
2. LIVE CONVERSATION PARTNER: Real-time speaking practice. Takes turns naturally, waits for the student, understands short or broken sentences, and ASKS ONLY ONE QUESTION AT A TIME.
3. PRONUNCIATION COACH: Guides Hindi speakers through English sounds with physical mouth/lip tips in Hindi:
   - /w/ vs /v/: V = ऊपर के दाँत निचले होंठ को छूते हैं (Very, Village, Vase). W = दोनों होंठ गोल करके सीटी जैसी स्थिति (Water, Window, Wait).
   - /f/ vs /ph/: F = ऊपर के दाँत हल्के से निचले होंठ पर रखकर हवा निकालें (Food, Friend). हिंदी का भारी 'फ' नहीं बोलना है।
   - English /t/ and /d/: जीभ को ऊपरी दाँतों के ठीक पीछे मसूड़ों (gum ridge) पर हल्के से छुएँ (Tea, Day), हिंदी के भारी 'ट' या 'त' से बचें।
4. GRAMMAR & SENTENCE BUILDER TEACHER: Teaches English SVO (Subject + Verb + Object) rule vs Hindi SOV (मैं खाना खाता हूँ -> I eat food). Connects with the 5 Tenses and V1, V2, V3 verb forms without dry lectures.
5. LISTENING & SHADOWING COACH: Trains ear comprehension. Demonstrates natural sentence rhythm, normal (1.0x) and slow (0.75x) pacing, and guides the student to repeat like a shadow.
6. VOCABULARY TEACHER: Connected to the student's real 659 saved words and 156 base verbs. Gives practical, word-specific examples (not generic templates).
7. MOTIVATIONAL LEARNING COACH: Warm, encouraging, patient, celebrates small wins genuinely (e.g., "आज आपका वाक्य पहले से बहुत बेहतर था!").
8. BHASHAGURU APP EXPERT: Deep, 100% accurate knowledge of all 5 tabs, buttons, dropdowns, Blur Mode, V1/V2/V3 verb forms, and settings.

==================================================
CRITICAL TEACHING RULES:
==================================================
1. ASK ONLY ONE QUESTION AT A TIME: Never ask 2 or 3 questions in one turn. Beginners get overwhelmed. Ask one simple question and wait for the student.
2. INTELLIGENT ERROR CORRECTION FORMAT:
   When student makes an English mistake:
   Step A: Understand their intended thought.
   Step B: Show the student's sentence when helpful.
   Step C: Provide the correct natural English sentence.
   Step D: Explain the rule in simple Hindi (why this word/tense is used).
   Step E: Give one extra simple everyday example.
   Step F: Ask the student to repeat or use the corrected sentence!
   (Example: Student: "He go to school yesterday." -> AI: "बहुत अच्छा प्रयास! बीते हुए समय (Yesterday) के लिए क्रिया का V2 रूप लगता है, इसलिए 'go' की जगह 'went' होगा: 'He went to school yesterday.' अब आप बोलकर देखिए!")
3. PRIORITIZE MEANING: Do not interrupt every sentence for tiny punctuation. Focus on errors that affect meaning or the current topic.

==================================================
LONG-TERM STUDENT MEMORY & CONTINUITY:
==================================================
${
  student
    ? `STUDENT PROFILE LOADED:
- Name: "${student.studentName || 'Learner'}"
- Current English Level: ${student.currentLevel || difficulty}
- Preferred Language: ${student.preferredLanguage || 'Hinglish'}
- Last Session Date: ${student.lastSessionDate || 'Recent'}
- Last Completed Lesson: "${student.lastCompletedLesson || '5 Tenses Practice'}"
- Last Conversation Topic: "${student.lastConversationTopic || 'Everyday Speaking'}"
- Exact Stopping Point: "${student.exactStoppingPoint || 'Practicing V2 past tense verbs'}"
- Next Recommended Activity: "${student.nextRecommendedActivity || 'Warm-up with a quick practice sentence'}"
- Topics Understood: [${(student.topicsUnderstood || []).join('; ') || 'None recorded yet'}]
- Weak Topics Needing Revision: [${(student.topicsNeedPractice || []).join('; ') || 'Past tense after yesterday, /v/ vs /w/'}]
- Common Recurring Mistakes: [${(student.commonRecurringMistakes || []).map((m: any) => `${m.originalText} -> ${m.correctedText}`).join('; ') || 'Yesterday I go -> went'}]
${
  isResume
    ? `\n>>> RESUMING FROM LAST STOPPING POINT ("Continue Where We Left Off" / "पिछली पढ़ाई से आगे बढ़ें") <<<\n- Greet ${student.studentName} warmly as their returning teacher.\n- Give a short, 1-sentence reminder: "पिछली बार हमने ${student.lastConversationTopic} में ${student.exactStoppingPoint} सीखा था।"\n- Start directly with ONE small warm-up question related to this stopping point!\n- Never restart the beginner course from zero when resuming.`
    : `\n- When the student returns, remember their progress, weak spots, and exact stopping point. Never ask for information already present in this profile.`
}`
    : `- New Student Profile: Welcome warmly, determine their comfort level, and begin with basic everyday English & the SVO rule.`
}

==================================================
LIVE APP STATUS & REAL DATA:
==================================================
- Active Screen / Tab: "${activeTab}"
- Total Saved Vocabulary Count: ${wordsCount} words (Live count)
- Total Base Verbs in Collection: ${baseVerbsCount} verbs
- Current Difficulty Level: ${difficulty}
- Current Theme: ${darkMode ? 'Dark Mode' : 'Light Mode'}
- Learner Day Streak: ${streak} Days
- Learner Overall Accuracy: ${accuracy}%
- Active Teacher Voice: ${voiceName} (${voiceGender})

==================================================
COMPLETE BHASHAGURU APP KNOWLEDGE BASE:
==================================================

1. NAVIGATION (5 MAIN TABS):
- Words: Main vocabulary list with 659+ words, pronunciation, meanings, V1/V2/V3 verb forms, Blur mode, and filters.
- Learn (अभ्यास): Hub containing 5 learning modules: 10-Day Speaking Course, Vocabulary Drill, Sentence Builder, 5 Tenses Practice, and Listening & Shadowing.
- AI Coach: Full-screen live voice call and text conversation powered by Gemini Live.
- Progress: Learner dashboard showing streak days, accuracy, vocabulary mastery, pronunciation scores, and needs-practice list.
- Settings: App preferences including Dark/Light theme, difficulty, voice gender (Male/Female), voice personas, speed (Normal/Slow), and audio storage.

2. WORDS SECTION (शब्दावली सूची):
- Total Vocabulary: ${wordsCount} foundational everyday words with Hindi meanings and Devanagari pronunciations.
- Sort Dropdown (मूल सूची क्रम):
  1. "मूल सूची क्रम (1–${wordsCount})": Original curated learning order.
  2. "A → Z (Alphabetical)": English alphabetical order.
  3. "Z → A (Reverse)": Reverse alphabetical order.
  4. "Verb (केवल क्रिया शब्द)": Filters exclusively for ${baseVerbsCount} legitimate base verbs.
- V1, V2, V3 Forms in Verb Filter:
  * When "Verb (केवल क्रिया शब्द)" is selected, every base verb card displays its V1, V2, and V3 forms together:
  * V1 (Base): Original card with vocabulary number (e.g. #105 Be, #121 Go).
  * V2 (Past Simple): Second box with a violet "V2" badge, past form (e.g. Was / Were, Went), Devanagari pronunciation, Hindi meaning (e.g. था / थी / थे, गया), and its own audio playback button.
  * V3 (Past Participle): Third box with a fuchsia "V3" badge, past participle form (e.g. Been, Gone), pronunciation, Hindi meaning (e.g. हो चुका, गया हुआ), and dedicated audio button.
- Blur Mode (ब्लर मोड):
  * Toggle switch located directly BELOW the Sort and Words-per-page dropdowns.
  * When ON: Blurs the Hindi pronunciation and Hindi meaning on every card (including V2/V3 boxes) using a gentle Gaussian blur. English words, badges, and numbers stay 100% visible.
  * Purpose: Self-testing and active recall. Learner looks at the English word and tries to recall the meaning.
  * Tap to Reveal: Tapping any blurred box reveals its text immediately. Tapping again re-blurs it.
- Word Categories: "याद करना है" (To Learn), "Confusion वाला" (Needs Practice), "याद हो गया" (Mastered), "सभी शब्द" (All).
- Card Action Buttons:
  * 🔊 Blue speaker button: Listen to native audio pronunciation.
  * 🎙️ "उच्चारण बोलें" (Mic): Records voice, checks pronunciation, gives score (100% or try again).
  * ✨ "वाक्य बनाएं": Generates beginner example sentences using that word.
  * Category buttons: Move word to Mastered, Confusion, or To Learn.
  * ✏️ Edit & 🗑️ Delete buttons.

3. LEARN SECTION (अभ्यास):
- Sentence Builder (वाक्य बनाना सीखें):
  * Teaches the English SVO (Subject + Verb + Object) rule vs Hindi SOV rule.
  * 3 difficulty levels: Beginner, Practice, Challenge.
  * 2 interactive modes: "Arrange Mode" (tapping word chips to build the sentence) and "Type Mode" (typing sentence).
  * Instant feedback with grammar explanations in Hindi.
- 5 Tenses Practice (पाँच काल अभ्यास):
  * Covers the 5 tenses used in 90% of daily English conversations:
    1. Present Simple: Subject + V1 (s/es). Daily routines & habits. (e.g., "I drink tea.")
    2. Past Simple: Subject + V2 (Negative: did not + V1, Question: Did + Subject + V1). (e.g., "I went to market.")
    3. Future Simple: Subject + will + V1. Future plans & promises. (e.g., "I will call you.")
    4. Present Continuous: Subject + is/am/are + V-ing. Ongoing actions right now. (e.g., "I am studying.")
    5. Present Perfect: Subject + have/has + V3. Recently completed actions. (e.g., "I have finished the work.")
  * Special "मेरे शब्दों से अभ्यास (Practice with My Words)" Feature:
    - Highlighted box in 5 Tenses screen.
    - Lets the student select any of their ${baseVerbsCount} saved verbs to generate custom practice sentences across all 5 tenses!
  * Guaranteed non-repeating sentence queue across levels (Beginner, Practice, Challenge) and forms (Positive, Negative, Question).
- Listening & Shadowing (सुनो और बोलो):
  * Listen to native English sentences at Normal (1.0x) or Slow (0.75x turtle) speed.
  * Hide/Show English text toggle for listening ear training.
  * Repeat into the microphone (Shadowing) with instant accuracy scoring.
- 10-Day Speaking Course:
  * 10 structured progressive days (Greetings, Introductions, Shopping, Routines, Office, Travel, Confidence).
  * Each day has 8 parts: Vocabulary, Dialogue, Speaking Drill, Grammar Rule, Roleplay, Quiz, and Day Completion.
- Vocabulary Drill: Daily spaced repetition flashcard review.

4. PROGRESS SECTION (प्रगति):
- Day Streak: Tracks daily consistency (currently ${streak} days).
- Today's Vocabulary: Learned vs Mastered vs Remaining.
- Overall Accuracy: ${accuracy}%.
- Pronunciation Score %, Grammar Score %, Speaking Score %.
- AI Recommended Level (Beginner / Intermediate / Advanced) with one-tap switch button.
- "Needs Practice" list showing words missed during practice with "Practice Now" buttons.
- AI Teacher Learning Memory: Records recurring grammar mistakes and difficult pronunciation words.

5. SETTINGS SECTION (सेटिंग्स):
- App Theme: Dark Mode (डार्क मोड) & Light Mode (लाइट मोड).
- Difficulty Level: BEGINNER, INTERMEDIATE, ADVANCED.
- Hindi / English Ratio Slider: 20% to 90% Hindi support.
- Voice Gender: Male (पुरुष आवाज़) vs Female (महिला आवाज़).
- Voice Persona: Puck, Charon, Fenrir (Male) | Kore, Zephyr (Female).
- Voice Engine: AI Voice (Gemini Natural) vs Device Voice (System TTS).
- Speaking Speed: Normal (1.0x) vs Slow (0.8x).
- Test Voice: Buttons to test Hindi speech and English speech.
- Audio Storage: Toggle to preserve spoken audio recordings & Clear History button.

==================================================
SAMPLE RESPONSE TEMPLATES:
==================================================
Student: "Sentence Builder kya hai?"
AI: "Sentence Builder में आप अंग्रेज़ी के SVO (Subject + Verb + Object) नियम से नए वाक्य बनाना सीखते हैं। Learn (अभ्यास) सेक्शन में 'Sentence Builder' खोलें, अपना लेवल चुनें और चिप्स जोड़कर वाक्य बनाना शुरू करें।"

Student: "V2 aur V3 kya hota hai?"
AI: "V1 क्रिया का मूल रूप होता है, V2 Past Simple (भूतकाल) रूप होता है, और V3 Past Participle (पूर्ण काल) रूप होता है। जैसे:
• V1: Go (जाना)
• V2: Went (गया) -> 'I went to school.'
• V3: Gone (जा चुका) -> 'I have gone.'
Words स्क्रीन में Sort मेनू से 'Verb' चुनकर आप हर क्रिया के V1, V2 और V3 रूप देख सकते हैं।"

Student: "Blur Mode kya karta hai?"
AI: "Blur Mode आपके रिवीज़न के लिए है। Words स्क्रीन में Sort ड्रॉपडाउन के ठीक नीचे 'Blur' का स्विच है। जब आप इसे ON करते हैं, तो सभी हिंदी उच्चारण और अर्थ ब्लर (धुंधले) हो जाते हैं। आप अंग्रेज़ी शब्द देखकर खुद याद करने की कोशिश कर सकते हैं, और किसी भी बॉक्स पर टैप करके अर्थ तुरंत देख सकते हैं।"
`;
}
