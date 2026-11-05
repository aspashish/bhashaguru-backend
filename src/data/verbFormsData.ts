/**
 * Pre-compiled, verified V1, V2, V3 Verb Forms for BhashaGuru
 * Covers all genuine base verbs in the BhashaGuru 659 vocabulary database.
 * 
 * Auto-generated with handcrafted irregular forms, phonetic Devanagari pronunciations,
 * and contextual Hindi meanings.
 */

import { VocabularyWord } from '../types/learning';
import { isLegitimateVerb } from '../utils/verbConjugationEngine';

export interface VerbFormDetail {
  form: string;
  phoneticHindi: string;
  hindiMeaning: string;
}

export interface VerbFullForms {
  baseWord: string;
  v1: VerbFormDetail;
  v2: VerbFormDetail;
  v3: VerbFormDetail;
  isIrregular: boolean;
  notes?: string;
  needsReview?: boolean;
}

export const VERB_FORMS_DICTIONARY: Record<string, VerbFullForms> = {
  "be": {
    "baseWord": "Be",
    "v1": {
      "form": "Be",
      "phoneticHindi": "बी",
      "hindiMeaning": "होना"
    },
    "v2": {
      "form": "Was / Were",
      "phoneticHindi": "वॉज़ / वर",
      "hindiMeaning": "था / थी / थे"
    },
    "v3": {
      "form": "Been",
      "phoneticHindi": "बीन",
      "hindiMeaning": "हो चुका / रहा हुआ"
    },
    "isIrregular": true,
    "notes": "Singular (I/he/she): was; Plural (we/you/they): were"
  },
  "have": {
    "baseWord": "Have",
    "v1": {
      "form": "Have",
      "phoneticHindi": "हैव",
      "hindiMeaning": "पास होना"
    },
    "v2": {
      "form": "Had",
      "phoneticHindi": "हैड",
      "hindiMeaning": "था / थी / थे / पास था"
    },
    "v3": {
      "form": "Had",
      "phoneticHindi": "हैड",
      "hindiMeaning": "रखा हुआ / पास हो चुका"
    },
    "isIrregular": true
  },
  "do": {
    "baseWord": "Do",
    "v1": {
      "form": "Do",
      "phoneticHindi": "डू",
      "hindiMeaning": "करना"
    },
    "v2": {
      "form": "Did",
      "phoneticHindi": "डिड",
      "hindiMeaning": "किया"
    },
    "v3": {
      "form": "Done",
      "phoneticHindi": "डन",
      "hindiMeaning": "किया हुआ / हो चुका"
    },
    "isIrregular": true
  },
  "say": {
    "baseWord": "Say",
    "v1": {
      "form": "Say",
      "phoneticHindi": "से",
      "hindiMeaning": "कहना"
    },
    "v2": {
      "form": "Said",
      "phoneticHindi": "सेड",
      "hindiMeaning": "कहा"
    },
    "v3": {
      "form": "Said",
      "phoneticHindi": "सेड",
      "hindiMeaning": "कहा हुआ / कह चुका"
    },
    "isIrregular": true
  },
  "get": {
    "baseWord": "Get",
    "v1": {
      "form": "Get",
      "phoneticHindi": "गेट",
      "hindiMeaning": "पाना"
    },
    "v2": {
      "form": "Got",
      "phoneticHindi": "गॉट",
      "hindiMeaning": "पाया / मिला"
    },
    "v3": {
      "form": "Got / Gotten",
      "phoneticHindi": "गॉट / गॉटन",
      "hindiMeaning": "पाया हुआ / मिला हुआ"
    },
    "isIrregular": true,
    "notes": "Gotten (American English) / Got (British English)"
  },
  "make": {
    "baseWord": "Make",
    "v1": {
      "form": "Make",
      "phoneticHindi": "मेक",
      "hindiMeaning": "बनाना"
    },
    "v2": {
      "form": "Made",
      "phoneticHindi": "मेड",
      "hindiMeaning": "बनाया"
    },
    "v3": {
      "form": "Made",
      "phoneticHindi": "मेड",
      "hindiMeaning": "बनाया हुआ / बन चुका"
    },
    "isIrregular": true
  },
  "go": {
    "baseWord": "Go",
    "v1": {
      "form": "Go",
      "phoneticHindi": "गो",
      "hindiMeaning": "जाना"
    },
    "v2": {
      "form": "Went",
      "phoneticHindi": "वेंट",
      "hindiMeaning": "गया / गई / गए"
    },
    "v3": {
      "form": "Gone",
      "phoneticHindi": "गॉन",
      "hindiMeaning": "जा चुका / गया हुआ"
    },
    "isIrregular": true
  },
  "know": {
    "baseWord": "Know",
    "v1": {
      "form": "Know",
      "phoneticHindi": "नो",
      "hindiMeaning": "जानना"
    },
    "v2": {
      "form": "Knew",
      "phoneticHindi": "न्यू",
      "hindiMeaning": "जाना / पता था"
    },
    "v3": {
      "form": "Known",
      "phoneticHindi": "नोन",
      "hindiMeaning": "जाना हुआ / परिचित"
    },
    "isIrregular": true
  },
  "take": {
    "baseWord": "Take",
    "v1": {
      "form": "Take",
      "phoneticHindi": "टेक",
      "hindiMeaning": "लेना"
    },
    "v2": {
      "form": "Took",
      "phoneticHindi": "टुक",
      "hindiMeaning": "लिया"
    },
    "v3": {
      "form": "Taken",
      "phoneticHindi": "टेकन",
      "hindiMeaning": "लिया हुआ / ले चुका"
    },
    "isIrregular": true
  },
  "see": {
    "baseWord": "See",
    "v1": {
      "form": "See",
      "phoneticHindi": "सी",
      "hindiMeaning": "देखना"
    },
    "v2": {
      "form": "Saw",
      "phoneticHindi": "सॉ",
      "hindiMeaning": "देखा"
    },
    "v3": {
      "form": "Seen",
      "phoneticHindi": "सीन",
      "hindiMeaning": "देखा हुआ / देख चुका"
    },
    "isIrregular": true
  },
  "come": {
    "baseWord": "Come",
    "v1": {
      "form": "Come",
      "phoneticHindi": "कम",
      "hindiMeaning": "आना"
    },
    "v2": {
      "form": "Came",
      "phoneticHindi": "केम",
      "hindiMeaning": "आया"
    },
    "v3": {
      "form": "Come",
      "phoneticHindi": "कम",
      "hindiMeaning": "आया हुआ / आ चुका"
    },
    "isIrregular": true
  },
  "think": {
    "baseWord": "Think",
    "v1": {
      "form": "Think",
      "phoneticHindi": "थिंक",
      "hindiMeaning": "सोचना"
    },
    "v2": {
      "form": "Thought",
      "phoneticHindi": "थॉट",
      "hindiMeaning": "सोचा"
    },
    "v3": {
      "form": "Thought",
      "phoneticHindi": "थॉट",
      "hindiMeaning": "सोचा हुआ / सोच चुका"
    },
    "isIrregular": true
  },
  "look": {
    "baseWord": "Look",
    "v1": {
      "form": "Look",
      "phoneticHindi": "लुक",
      "hindiMeaning": "देखना"
    },
    "v2": {
      "form": "Looked",
      "phoneticHindi": "लुक्ड",
      "hindiMeaning": "देखना"
    },
    "v3": {
      "form": "Looked",
      "phoneticHindi": "लुक्ड",
      "hindiMeaning": "देखना हुआ / देखन चुका"
    },
    "isIrregular": false
  },
  "want": {
    "baseWord": "Want",
    "v1": {
      "form": "Want",
      "phoneticHindi": "वांट",
      "hindiMeaning": "चाहना"
    },
    "v2": {
      "form": "Wanted",
      "phoneticHindi": "वांटेड",
      "hindiMeaning": "चाहना"
    },
    "v3": {
      "form": "Wanted",
      "phoneticHindi": "वांटेड",
      "hindiMeaning": "चाहना हुआ / चाहन चुका"
    },
    "isIrregular": false
  },
  "give": {
    "baseWord": "Give",
    "v1": {
      "form": "Give",
      "phoneticHindi": "गिव",
      "hindiMeaning": "देना"
    },
    "v2": {
      "form": "Gave",
      "phoneticHindi": "गेव",
      "hindiMeaning": "दिया"
    },
    "v3": {
      "form": "Given",
      "phoneticHindi": "गिवन",
      "hindiMeaning": "दिया हुआ / दे चुका"
    },
    "isIrregular": true
  },
  "use": {
    "baseWord": "Use",
    "v1": {
      "form": "Use",
      "phoneticHindi": "यूज़",
      "hindiMeaning": "उपयोग करना"
    },
    "v2": {
      "form": "Used",
      "phoneticHindi": "यूज़्ड",
      "hindiMeaning": "उपयोग किया"
    },
    "v3": {
      "form": "Used",
      "phoneticHindi": "यूज़्ड",
      "hindiMeaning": "उपयोग किया हुआ"
    },
    "isIrregular": false
  },
  "find": {
    "baseWord": "Find",
    "v1": {
      "form": "Find",
      "phoneticHindi": "फाइंड",
      "hindiMeaning": "ढूँढना"
    },
    "v2": {
      "form": "Found",
      "phoneticHindi": "फाउंड",
      "hindiMeaning": "पाया / ढूँढा"
    },
    "v3": {
      "form": "Found",
      "phoneticHindi": "फाउंड",
      "hindiMeaning": "पाया हुआ / ढूँढा हुआ"
    },
    "isIrregular": true
  },
  "tell": {
    "baseWord": "Tell",
    "v1": {
      "form": "Tell",
      "phoneticHindi": "टेल",
      "hindiMeaning": "बताना"
    },
    "v2": {
      "form": "Told",
      "phoneticHindi": "टोल्ड",
      "hindiMeaning": "बताया / कहा"
    },
    "v3": {
      "form": "Told",
      "phoneticHindi": "टोल्ड",
      "hindiMeaning": "बताया हुआ / कह चुका"
    },
    "isIrregular": true
  },
  "ask": {
    "baseWord": "Ask",
    "v1": {
      "form": "Ask",
      "phoneticHindi": "आस्क",
      "hindiMeaning": "पूछना"
    },
    "v2": {
      "form": "Asked",
      "phoneticHindi": "आस्क्ड",
      "hindiMeaning": "पूछना"
    },
    "v3": {
      "form": "Asked",
      "phoneticHindi": "आस्क्ड",
      "hindiMeaning": "पूछना हुआ / पूछन चुका"
    },
    "isIrregular": false
  },
  "work": {
    "baseWord": "Work",
    "v1": {
      "form": "Work",
      "phoneticHindi": "वर्क",
      "hindiMeaning": "काम करना"
    },
    "v2": {
      "form": "Worked",
      "phoneticHindi": "वर्क्ड",
      "hindiMeaning": "काम किया"
    },
    "v3": {
      "form": "Worked",
      "phoneticHindi": "वर्क्ड",
      "hindiMeaning": "काम किया हुआ"
    },
    "isIrregular": false
  },
  "seem": {
    "baseWord": "Seem",
    "v1": {
      "form": "Seem",
      "phoneticHindi": "सीम",
      "hindiMeaning": "प्रतीत होना"
    },
    "v2": {
      "form": "Seemed",
      "phoneticHindi": "सीम्ड",
      "hindiMeaning": "प्रतीत हुआ"
    },
    "v3": {
      "form": "Seemed",
      "phoneticHindi": "सीम्ड",
      "hindiMeaning": "प्रतीत हो चुका"
    },
    "isIrregular": false
  },
  "feel": {
    "baseWord": "Feel",
    "v1": {
      "form": "Feel",
      "phoneticHindi": "फील",
      "hindiMeaning": "महसूस करना"
    },
    "v2": {
      "form": "Felt",
      "phoneticHindi": "फेल्ट",
      "hindiMeaning": "महसूस किया"
    },
    "v3": {
      "form": "Felt",
      "phoneticHindi": "फेल्ट",
      "hindiMeaning": "महसूस किया हुआ"
    },
    "isIrregular": true
  },
  "try": {
    "baseWord": "Try",
    "v1": {
      "form": "Try",
      "phoneticHindi": "ट्राई",
      "hindiMeaning": "कोशिश करना"
    },
    "v2": {
      "form": "Tried",
      "phoneticHindi": "ट्राई्ड",
      "hindiMeaning": "कोशिश किया"
    },
    "v3": {
      "form": "Tried",
      "phoneticHindi": "ट्राई्ड",
      "hindiMeaning": "कोशिश किया हुआ"
    },
    "isIrregular": false
  },
  "leave": {
    "baseWord": "Leave",
    "v1": {
      "form": "Leave",
      "phoneticHindi": "लीव",
      "hindiMeaning": "छोड़ना"
    },
    "v2": {
      "form": "Left",
      "phoneticHindi": "लेफ्ट",
      "hindiMeaning": "छोड़ा / रवाना हुआ"
    },
    "v3": {
      "form": "Left",
      "phoneticHindi": "लेफ्ट",
      "hindiMeaning": "छूटा हुआ / रवाना हो चुका"
    },
    "isIrregular": true
  },
  "call": {
    "baseWord": "Call",
    "v1": {
      "form": "Call",
      "phoneticHindi": "कॉल",
      "hindiMeaning": "बुलाना"
    },
    "v2": {
      "form": "Called",
      "phoneticHindi": "कॉल्ड",
      "hindiMeaning": "बुलाना"
    },
    "v3": {
      "form": "Called",
      "phoneticHindi": "कॉल्ड",
      "hindiMeaning": "बुलाना हुआ / बुलान चुका"
    },
    "isIrregular": false
  },
  "keep": {
    "baseWord": "Keep",
    "v1": {
      "form": "Keep",
      "phoneticHindi": "कीप",
      "hindiMeaning": "रखना"
    },
    "v2": {
      "form": "Kept",
      "phoneticHindi": "केप्ट",
      "hindiMeaning": "रखा / जारी रखा"
    },
    "v3": {
      "form": "Kept",
      "phoneticHindi": "केप्ट",
      "hindiMeaning": "रखा हुआ"
    },
    "isIrregular": true
  },
  "provide": {
    "baseWord": "Provide",
    "v1": {
      "form": "Provide",
      "phoneticHindi": "प्रोवाइड",
      "hindiMeaning": "प्रदान करना"
    },
    "v2": {
      "form": "Provided",
      "phoneticHindi": "प्रोवाइडेड",
      "hindiMeaning": "प्रदान किया"
    },
    "v3": {
      "form": "Provided",
      "phoneticHindi": "प्रोवाइडेड",
      "hindiMeaning": "प्रदान किया हुआ"
    },
    "isIrregular": false
  },
  "hold": {
    "baseWord": "Hold",
    "v1": {
      "form": "Hold",
      "phoneticHindi": "होल्ड",
      "hindiMeaning": "पकड़ना"
    },
    "v2": {
      "form": "Held",
      "phoneticHindi": "हेल्ड",
      "hindiMeaning": "पकड़ा / आयोजित किया"
    },
    "v3": {
      "form": "Held",
      "phoneticHindi": "हेल्ड",
      "hindiMeaning": "पकड़ा हुआ / आयोजित"
    },
    "isIrregular": true
  },
  "turn": {
    "baseWord": "Turn",
    "v1": {
      "form": "Turn",
      "phoneticHindi": "टर्न",
      "hindiMeaning": "मुड़ना"
    },
    "v2": {
      "form": "Turned",
      "phoneticHindi": "टर्न्ड",
      "hindiMeaning": "मुड़ना"
    },
    "v3": {
      "form": "Turned",
      "phoneticHindi": "टर्न्ड",
      "hindiMeaning": "मुड़ना हुआ / मुड़न चुका"
    },
    "isIrregular": false
  },
  "follow": {
    "baseWord": "Follow",
    "v1": {
      "form": "Follow",
      "phoneticHindi": "फॉलो",
      "hindiMeaning": "पालन करना"
    },
    "v2": {
      "form": "Followed",
      "phoneticHindi": "फॉलो्ड",
      "hindiMeaning": "पालन किया"
    },
    "v3": {
      "form": "Followed",
      "phoneticHindi": "फॉलो्ड",
      "hindiMeaning": "पालन किया हुआ"
    },
    "isIrregular": false
  },
  "begin": {
    "baseWord": "Begin",
    "v1": {
      "form": "Begin",
      "phoneticHindi": "बिगिन",
      "hindiMeaning": "शुरू करना"
    },
    "v2": {
      "form": "Began",
      "phoneticHindi": "बिगैन",
      "hindiMeaning": "शुरू किया"
    },
    "v3": {
      "form": "Begun",
      "phoneticHindi": "बिगन्",
      "hindiMeaning": "शुरू हुआ / शुरू कर चुका"
    },
    "isIrregular": true
  },
  "bring": {
    "baseWord": "Bring",
    "v1": {
      "form": "Bring",
      "phoneticHindi": "ब्रिंग",
      "hindiMeaning": "लाना"
    },
    "v2": {
      "form": "Brought",
      "phoneticHindi": "ब्रॉट",
      "hindiMeaning": "लाया"
    },
    "v3": {
      "form": "Brought",
      "phoneticHindi": "ब्रॉट",
      "hindiMeaning": "लाया हुआ / ला चुका"
    },
    "isIrregular": true
  },
  "like": {
    "baseWord": "Like",
    "v1": {
      "form": "Like",
      "phoneticHindi": "लाइक",
      "hindiMeaning": "पसंद करना"
    },
    "v2": {
      "form": "Liked",
      "phoneticHindi": "लाइक्ड",
      "hindiMeaning": "पसंद किया"
    },
    "v3": {
      "form": "Liked",
      "phoneticHindi": "लाइक्ड",
      "hindiMeaning": "पसंद किया हुआ"
    },
    "isIrregular": false
  },
  "help": {
    "baseWord": "Help",
    "v1": {
      "form": "Help",
      "phoneticHindi": "हेल्प",
      "hindiMeaning": "मदद करना"
    },
    "v2": {
      "form": "Helped",
      "phoneticHindi": "हेल्प्ड",
      "hindiMeaning": "मदद किया"
    },
    "v3": {
      "form": "Helped",
      "phoneticHindi": "हेल्प्ड",
      "hindiMeaning": "मदद किया हुआ"
    },
    "isIrregular": false
  },
  "start": {
    "baseWord": "Start",
    "v1": {
      "form": "Start",
      "phoneticHindi": "स्टार्ट",
      "hindiMeaning": "शुरू करना"
    },
    "v2": {
      "form": "Started",
      "phoneticHindi": "स्टार्टेड",
      "hindiMeaning": "शुरू किया"
    },
    "v3": {
      "form": "Started",
      "phoneticHindi": "स्टार्टेड",
      "hindiMeaning": "शुरू किया हुआ"
    },
    "isIrregular": false
  },
  "run": {
    "baseWord": "Run",
    "v1": {
      "form": "Run",
      "phoneticHindi": "रन",
      "hindiMeaning": "दौड़ना"
    },
    "v2": {
      "form": "Ran",
      "phoneticHindi": "रैन",
      "hindiMeaning": "दौड़ा"
    },
    "v3": {
      "form": "Run",
      "phoneticHindi": "रन",
      "hindiMeaning": "दौड़ा हुआ / दौड़ चुका"
    },
    "isIrregular": true
  },
  "write": {
    "baseWord": "Write",
    "v1": {
      "form": "Write",
      "phoneticHindi": "राइट",
      "hindiMeaning": "लिखना"
    },
    "v2": {
      "form": "Wrote",
      "phoneticHindi": "रोट",
      "hindiMeaning": "लिखा"
    },
    "v3": {
      "form": "Written",
      "phoneticHindi": "रिटन",
      "hindiMeaning": "लिखा हुआ / लिख चुका"
    },
    "isIrregular": true
  },
  "set": {
    "baseWord": "Set",
    "v1": {
      "form": "Set",
      "phoneticHindi": "सेट",
      "hindiMeaning": "स्थापित करना"
    },
    "v2": {
      "form": "Set",
      "phoneticHindi": "सेट",
      "hindiMeaning": "स्थापित किया / तय किया"
    },
    "v3": {
      "form": "Set",
      "phoneticHindi": "सेट",
      "hindiMeaning": "स्थापित / तय किया हुआ"
    },
    "isIrregular": true
  },
  "move": {
    "baseWord": "Move",
    "v1": {
      "form": "Move",
      "phoneticHindi": "मूव",
      "hindiMeaning": "हिलना"
    },
    "v2": {
      "form": "Moved",
      "phoneticHindi": "मूव्ड",
      "hindiMeaning": "हिलना"
    },
    "v3": {
      "form": "Moved",
      "phoneticHindi": "मूव्ड",
      "hindiMeaning": "हिलना हुआ / हिलन चुका"
    },
    "isIrregular": false
  },
  "play": {
    "baseWord": "Play",
    "v1": {
      "form": "Play",
      "phoneticHindi": "प्ले",
      "hindiMeaning": "खेलना"
    },
    "v2": {
      "form": "Played",
      "phoneticHindi": "प्ले्ड",
      "hindiMeaning": "खेलना"
    },
    "v3": {
      "form": "Played",
      "phoneticHindi": "प्ले्ड",
      "hindiMeaning": "खेलना हुआ / खेलन चुका"
    },
    "isIrregular": false
  },
  "pay": {
    "baseWord": "Pay",
    "v1": {
      "form": "Pay",
      "phoneticHindi": "पे",
      "hindiMeaning": "भुगतान करना"
    },
    "v2": {
      "form": "Paid",
      "phoneticHindi": "पेड",
      "hindiMeaning": "चुकाया / भुगतान किया"
    },
    "v3": {
      "form": "Paid",
      "phoneticHindi": "पेड",
      "hindiMeaning": "चुकाया हुआ / प्रदत्त"
    },
    "isIrregular": true
  },
  "hear": {
    "baseWord": "Hear",
    "v1": {
      "form": "Hear",
      "phoneticHindi": "हियर",
      "hindiMeaning": "सुनना"
    },
    "v2": {
      "form": "Heard",
      "phoneticHindi": "हर्ड",
      "hindiMeaning": "सुना"
    },
    "v3": {
      "form": "Heard",
      "phoneticHindi": "हर्ड",
      "hindiMeaning": "सुना हुआ / सुन चुका"
    },
    "isIrregular": true
  },
  "include": {
    "baseWord": "Include",
    "v1": {
      "form": "Include",
      "phoneticHindi": "इंक्लूड",
      "hindiMeaning": "शामिल करना"
    },
    "v2": {
      "form": "Included",
      "phoneticHindi": "इंक्लूडेड",
      "hindiMeaning": "शामिल किया"
    },
    "v3": {
      "form": "Included",
      "phoneticHindi": "इंक्लूडेड",
      "hindiMeaning": "शामिल किया हुआ"
    },
    "isIrregular": false
  },
  "believe": {
    "baseWord": "Believe",
    "v1": {
      "form": "Believe",
      "phoneticHindi": "बिलीव",
      "hindiMeaning": "विश्वास करना"
    },
    "v2": {
      "form": "Believed",
      "phoneticHindi": "बिलीव्ड",
      "hindiMeaning": "विश्वास किया"
    },
    "v3": {
      "form": "Believed",
      "phoneticHindi": "बिलीव्ड",
      "hindiMeaning": "विश्वास किया हुआ"
    },
    "isIrregular": false
  },
  "allow": {
    "baseWord": "Allow",
    "v1": {
      "form": "Allow",
      "phoneticHindi": "अलाउ",
      "hindiMeaning": "अनुमति देना"
    },
    "v2": {
      "form": "Allowed",
      "phoneticHindi": "अलाउ्ड",
      "hindiMeaning": "अनुमति दिया"
    },
    "v3": {
      "form": "Allowed",
      "phoneticHindi": "अलाउ्ड",
      "hindiMeaning": "अनुमति दिया हुआ"
    },
    "isIrregular": false
  },
  "meet": {
    "baseWord": "Meet",
    "v1": {
      "form": "Meet",
      "phoneticHindi": "मीट",
      "hindiMeaning": "मिलना"
    },
    "v2": {
      "form": "Met",
      "phoneticHindi": "मेट",
      "hindiMeaning": "मिला / मुलाकात की"
    },
    "v3": {
      "form": "Met",
      "phoneticHindi": "मेट",
      "hindiMeaning": "मिला हुआ / भेंट हो चुकी"
    },
    "isIrregular": true
  },
  "lead": {
    "baseWord": "Lead",
    "v1": {
      "form": "Lead",
      "phoneticHindi": "लीड",
      "hindiMeaning": "नेतृत्व करना"
    },
    "v2": {
      "form": "Led",
      "phoneticHindi": "लेड",
      "hindiMeaning": "नेतृत्व किया / आगे बढ़ाया"
    },
    "v3": {
      "form": "Led",
      "phoneticHindi": "लेड",
      "hindiMeaning": "नेतृत्व किया हुआ"
    },
    "isIrregular": true
  },
  "live": {
    "baseWord": "Live",
    "v1": {
      "form": "Live",
      "phoneticHindi": "लिव",
      "hindiMeaning": "जीना / रहना"
    },
    "v2": {
      "form": "Lived",
      "phoneticHindi": "लिव्ड",
      "hindiMeaning": "जीना / रहना"
    },
    "v3": {
      "form": "Lived",
      "phoneticHindi": "लिव्ड",
      "hindiMeaning": "जीना / रहना हुआ / जीना / रहन चुका"
    },
    "isIrregular": false
  },
  "stand": {
    "baseWord": "Stand",
    "v1": {
      "form": "Stand",
      "phoneticHindi": "स्टैंड",
      "hindiMeaning": "खड़ा होना"
    },
    "v2": {
      "form": "Stood",
      "phoneticHindi": "स्टुड",
      "hindiMeaning": "खड़ा हुआ"
    },
    "v3": {
      "form": "Stood",
      "phoneticHindi": "स्टुड",
      "hindiMeaning": "खड़ा रहा हुआ"
    },
    "isIrregular": true
  },
  "happen": {
    "baseWord": "Happen",
    "v1": {
      "form": "Happen",
      "phoneticHindi": "हैपन",
      "hindiMeaning": "घटित होना"
    },
    "v2": {
      "form": "Happened",
      "phoneticHindi": "हैपन्ड",
      "hindiMeaning": "घटित हुआ"
    },
    "v3": {
      "form": "Happened",
      "phoneticHindi": "हैपन्ड",
      "hindiMeaning": "घटित हो चुका"
    },
    "isIrregular": false
  },
  "carry": {
    "baseWord": "Carry",
    "v1": {
      "form": "Carry",
      "phoneticHindi": "कैरी",
      "hindiMeaning": "ले जाना"
    },
    "v2": {
      "form": "Carried",
      "phoneticHindi": "कैरी्ड",
      "hindiMeaning": "ले जाना"
    },
    "v3": {
      "form": "Carried",
      "phoneticHindi": "कैरी्ड",
      "hindiMeaning": "ले जाना हुआ / ले जान चुका"
    },
    "isIrregular": false
  },
  "talk": {
    "baseWord": "Talk",
    "v1": {
      "form": "Talk",
      "phoneticHindi": "टॉक",
      "hindiMeaning": "बात करना"
    },
    "v2": {
      "form": "Talked",
      "phoneticHindi": "टॉक्ड",
      "hindiMeaning": "बात किया"
    },
    "v3": {
      "form": "Talked",
      "phoneticHindi": "टॉक्ड",
      "hindiMeaning": "बात किया हुआ"
    },
    "isIrregular": false
  },
  "appear": {
    "baseWord": "Appear",
    "v1": {
      "form": "Appear",
      "phoneticHindi": "अपीयर",
      "hindiMeaning": "प्रकट होना"
    },
    "v2": {
      "form": "Appeared",
      "phoneticHindi": "अपीयर्ड",
      "hindiMeaning": "प्रकट हुआ"
    },
    "v3": {
      "form": "Appeared",
      "phoneticHindi": "अपीयर्ड",
      "hindiMeaning": "प्रकट हो चुका"
    },
    "isIrregular": false
  },
  "produce": {
    "baseWord": "Produce",
    "v1": {
      "form": "Produce",
      "phoneticHindi": "प्रोड्यूस",
      "hindiMeaning": "उत्पादन करना"
    },
    "v2": {
      "form": "Produced",
      "phoneticHindi": "प्रोड्यूस्ड",
      "hindiMeaning": "उत्पादन किया"
    },
    "v3": {
      "form": "Produced",
      "phoneticHindi": "प्रोड्यूस्ड",
      "hindiMeaning": "उत्पादन किया हुआ"
    },
    "isIrregular": false
  },
  "sit": {
    "baseWord": "Sit",
    "v1": {
      "form": "Sit",
      "phoneticHindi": "सिट",
      "hindiMeaning": "बैठना"
    },
    "v2": {
      "form": "Sat",
      "phoneticHindi": "सैट",
      "hindiMeaning": "बैठा"
    },
    "v3": {
      "form": "Sat",
      "phoneticHindi": "सैट",
      "hindiMeaning": "बैठा हुआ"
    },
    "isIrregular": true
  },
  "offer": {
    "baseWord": "Offer",
    "v1": {
      "form": "Offer",
      "phoneticHindi": "ऑफर",
      "hindiMeaning": "प्रस्ताव देना"
    },
    "v2": {
      "form": "Offered",
      "phoneticHindi": "ऑफर्ड",
      "hindiMeaning": "प्रस्ताव दिया"
    },
    "v3": {
      "form": "Offered",
      "phoneticHindi": "ऑफर्ड",
      "hindiMeaning": "प्रस्ताव दिया हुआ"
    },
    "isIrregular": false
  },
  "consider": {
    "baseWord": "Consider",
    "v1": {
      "form": "Consider",
      "phoneticHindi": "कंसीडर",
      "hindiMeaning": "विचार करना"
    },
    "v2": {
      "form": "Considered",
      "phoneticHindi": "कंसीडर्ड",
      "hindiMeaning": "विचार किया"
    },
    "v3": {
      "form": "Considered",
      "phoneticHindi": "कंसीडर्ड",
      "hindiMeaning": "विचार किया हुआ"
    },
    "isIrregular": false
  },
  "expect": {
    "baseWord": "Expect",
    "v1": {
      "form": "Expect",
      "phoneticHindi": "एक्सपेक्ट",
      "hindiMeaning": "उम्मीद करना"
    },
    "v2": {
      "form": "Expected",
      "phoneticHindi": "एक्सपेक्टेड",
      "hindiMeaning": "उम्मीद किया"
    },
    "v3": {
      "form": "Expected",
      "phoneticHindi": "एक्सपेक्टेड",
      "hindiMeaning": "उम्मीद किया हुआ"
    },
    "isIrregular": false
  },
  "suggest": {
    "baseWord": "Suggest",
    "v1": {
      "form": "Suggest",
      "phoneticHindi": "सजेस्ट",
      "hindiMeaning": "सुझाव देना"
    },
    "v2": {
      "form": "Suggested",
      "phoneticHindi": "सजेस्टेड",
      "hindiMeaning": "सुझाव दिया"
    },
    "v3": {
      "form": "Suggested",
      "phoneticHindi": "सजेस्टेड",
      "hindiMeaning": "सुझाव दिया हुआ"
    },
    "isIrregular": false
  },
  "let": {
    "baseWord": "Let",
    "v1": {
      "form": "Let",
      "phoneticHindi": "लेट",
      "hindiMeaning": "करने देना"
    },
    "v2": {
      "form": "Let",
      "phoneticHindi": "लेट",
      "hindiMeaning": "करने दिया / अनुमति दी"
    },
    "v3": {
      "form": "Let",
      "phoneticHindi": "लेट",
      "hindiMeaning": "करने दिया हुआ"
    },
    "isIrregular": true
  },
  "read": {
    "baseWord": "Read",
    "v1": {
      "form": "Read",
      "phoneticHindi": "रीड",
      "hindiMeaning": "पढ़ना"
    },
    "v2": {
      "form": "Read",
      "phoneticHindi": "रेड",
      "hindiMeaning": "पढ़ा"
    },
    "v3": {
      "form": "Read",
      "phoneticHindi": "रेड",
      "hindiMeaning": "पढ़ा हुआ / पढ़ चुका"
    },
    "isIrregular": true,
    "notes": "Pronounced as \"red\" in past and participle forms"
  },
  "require": {
    "baseWord": "Require",
    "v1": {
      "form": "Require",
      "phoneticHindi": "रिक्वायर",
      "hindiMeaning": "आवश्यकता होना"
    },
    "v2": {
      "form": "Required",
      "phoneticHindi": "रिक्वायर्ड",
      "hindiMeaning": "आवश्यकता हुआ"
    },
    "v3": {
      "form": "Required",
      "phoneticHindi": "रिक्वायर्ड",
      "hindiMeaning": "आवश्यकता हो चुका"
    },
    "isIrregular": false
  },
  "continue": {
    "baseWord": "Continue",
    "v1": {
      "form": "Continue",
      "phoneticHindi": "कंटिन्यू",
      "hindiMeaning": "जारी रखना"
    },
    "v2": {
      "form": "Continued",
      "phoneticHindi": "कंटिन्यू्ड",
      "hindiMeaning": "जारी रखना"
    },
    "v3": {
      "form": "Continued",
      "phoneticHindi": "कंटिन्यू्ड",
      "hindiMeaning": "जारी रखना हुआ / जारी रखन चुका"
    },
    "isIrregular": false
  },
  "lose": {
    "baseWord": "Lose",
    "v1": {
      "form": "Lose",
      "phoneticHindi": "लूज़",
      "hindiMeaning": "खोना"
    },
    "v2": {
      "form": "Lost",
      "phoneticHindi": "लॉस्ट",
      "hindiMeaning": "खोया / गंवाया / हारा"
    },
    "v3": {
      "form": "Lost",
      "phoneticHindi": "लॉस्ट",
      "hindiMeaning": "खोया हुआ / गुम हो चुका"
    },
    "isIrregular": true
  },
  "add": {
    "baseWord": "Add",
    "v1": {
      "form": "Add",
      "phoneticHindi": "ऐड",
      "hindiMeaning": "जोड़ना"
    },
    "v2": {
      "form": "Added",
      "phoneticHindi": "ऐडेड",
      "hindiMeaning": "जोड़ना"
    },
    "v3": {
      "form": "Added",
      "phoneticHindi": "ऐडेड",
      "hindiMeaning": "जोड़ना हुआ / जोड़न चुका"
    },
    "isIrregular": false
  },
  "change": {
    "baseWord": "Change",
    "v1": {
      "form": "Change",
      "phoneticHindi": "चेंज",
      "hindiMeaning": "बदलना"
    },
    "v2": {
      "form": "Changed",
      "phoneticHindi": "चेंज्ड",
      "hindiMeaning": "बदलना"
    },
    "v3": {
      "form": "Changed",
      "phoneticHindi": "चेंज्ड",
      "hindiMeaning": "बदलना हुआ / बदलन चुका"
    },
    "isIrregular": false
  },
  "fall": {
    "baseWord": "Fall",
    "v1": {
      "form": "Fall",
      "phoneticHindi": "फॉल",
      "hindiMeaning": "गिरना"
    },
    "v2": {
      "form": "Fell",
      "phoneticHindi": "फेल",
      "hindiMeaning": "गिरा"
    },
    "v3": {
      "form": "Fallen",
      "phoneticHindi": "फॉलन",
      "hindiMeaning": "गिरा हुआ / गिर चुका"
    },
    "isIrregular": true
  },
  "remain": {
    "baseWord": "Remain",
    "v1": {
      "form": "Remain",
      "phoneticHindi": "रिमेन",
      "hindiMeaning": "शेष रहना"
    },
    "v2": {
      "form": "Remained",
      "phoneticHindi": "रिमेन्ड",
      "hindiMeaning": "शेष रहना"
    },
    "v3": {
      "form": "Remained",
      "phoneticHindi": "रिमेन्ड",
      "hindiMeaning": "शेष रहना हुआ / शेष रहन चुका"
    },
    "isIrregular": false
  },
  "remember": {
    "baseWord": "Remember",
    "v1": {
      "form": "Remember",
      "phoneticHindi": "रिमेंबर",
      "hindiMeaning": "याद रखना"
    },
    "v2": {
      "form": "Remembered",
      "phoneticHindi": "रिमेंबर्ड",
      "hindiMeaning": "याद रखना"
    },
    "v3": {
      "form": "Remembered",
      "phoneticHindi": "रिमेंबर्ड",
      "hindiMeaning": "याद रखना हुआ / याद रखन चुका"
    },
    "isIrregular": false
  },
  "buy": {
    "baseWord": "Buy",
    "v1": {
      "form": "Buy",
      "phoneticHindi": "बाय",
      "hindiMeaning": "खरीदना"
    },
    "v2": {
      "form": "Bought",
      "phoneticHindi": "बॉट",
      "hindiMeaning": "खरीदा"
    },
    "v3": {
      "form": "Bought",
      "phoneticHindi": "बॉट",
      "hindiMeaning": "खरीदा हुआ / खरीद चुका"
    },
    "isIrregular": true
  },
  "speak": {
    "baseWord": "Speak",
    "v1": {
      "form": "Speak",
      "phoneticHindi": "स्पीक",
      "hindiMeaning": "बोलना"
    },
    "v2": {
      "form": "Spoke",
      "phoneticHindi": "स्पोक",
      "hindiMeaning": "बोला"
    },
    "v3": {
      "form": "Spoken",
      "phoneticHindi": "स्पोकन",
      "hindiMeaning": "बोला हुआ / बोल चुका"
    },
    "isIrregular": true
  },
  "stop": {
    "baseWord": "Stop",
    "v1": {
      "form": "Stop",
      "phoneticHindi": "स्टॉप",
      "hindiMeaning": "रुकना"
    },
    "v2": {
      "form": "Stopped",
      "phoneticHindi": "स्टॉप्ड",
      "hindiMeaning": "रुकना"
    },
    "v3": {
      "form": "Stopped",
      "phoneticHindi": "स्टॉप्ड",
      "hindiMeaning": "रुकना हुआ / रुकन चुका"
    },
    "isIrregular": false
  },
  "send": {
    "baseWord": "Send",
    "v1": {
      "form": "Send",
      "phoneticHindi": "सेंड",
      "hindiMeaning": "भेजना"
    },
    "v2": {
      "form": "Sent",
      "phoneticHindi": "सेंट",
      "hindiMeaning": "भेजा"
    },
    "v3": {
      "form": "Sent",
      "phoneticHindi": "सेंट",
      "hindiMeaning": "भेजा हुआ / प्रेषित"
    },
    "isIrregular": true
  },
  "receive": {
    "baseWord": "Receive",
    "v1": {
      "form": "Receive",
      "phoneticHindi": "रिसीव",
      "hindiMeaning": "प्राप्त करना"
    },
    "v2": {
      "form": "Received",
      "phoneticHindi": "रिसीव्ड",
      "hindiMeaning": "प्राप्त किया"
    },
    "v3": {
      "form": "Received",
      "phoneticHindi": "रिसीव्ड",
      "hindiMeaning": "प्राप्त किया हुआ"
    },
    "isIrregular": false
  },
  "decide": {
    "baseWord": "Decide",
    "v1": {
      "form": "Decide",
      "phoneticHindi": "डिसाइड",
      "hindiMeaning": "निर्णय लेना"
    },
    "v2": {
      "form": "Decided",
      "phoneticHindi": "डिसाइडेड",
      "hindiMeaning": "निर्णय लेना"
    },
    "v3": {
      "form": "Decided",
      "phoneticHindi": "डिसाइडेड",
      "hindiMeaning": "निर्णय लेना हुआ / निर्णय लेन चुका"
    },
    "isIrregular": false
  },
  "win": {
    "baseWord": "Win",
    "v1": {
      "form": "Win",
      "phoneticHindi": "विन",
      "hindiMeaning": "जीतना"
    },
    "v2": {
      "form": "Won",
      "phoneticHindi": "वन",
      "hindiMeaning": "जीता"
    },
    "v3": {
      "form": "Won",
      "phoneticHindi": "वन",
      "hindiMeaning": "जीता हुआ / जीत चुका"
    },
    "isIrregular": true
  },
  "understand": {
    "baseWord": "Understand",
    "v1": {
      "form": "Understand",
      "phoneticHindi": "अंडरस्टैंड",
      "hindiMeaning": "समझना"
    },
    "v2": {
      "form": "Understood",
      "phoneticHindi": "अंडरस्टुड",
      "hindiMeaning": "समझा"
    },
    "v3": {
      "form": "Understood",
      "phoneticHindi": "अंडरस्टुड",
      "hindiMeaning": "समझा हुआ / समझ चुका"
    },
    "isIrregular": true
  },
  "describe": {
    "baseWord": "Describe",
    "v1": {
      "form": "Describe",
      "phoneticHindi": "डिस्क्राइब",
      "hindiMeaning": "वर्णन करना"
    },
    "v2": {
      "form": "Described",
      "phoneticHindi": "डिस्क्राइब्ड",
      "hindiMeaning": "वर्णन किया"
    },
    "v3": {
      "form": "Described",
      "phoneticHindi": "डिस्क्राइब्ड",
      "hindiMeaning": "वर्णन किया हुआ"
    },
    "isIrregular": false
  },
  "develop": {
    "baseWord": "Develop",
    "v1": {
      "form": "Develop",
      "phoneticHindi": "डेवलप",
      "hindiMeaning": "विकसित करना"
    },
    "v2": {
      "form": "Developed",
      "phoneticHindi": "डेवलप्ड",
      "hindiMeaning": "विकसित किया"
    },
    "v3": {
      "form": "Developed",
      "phoneticHindi": "डेवलप्ड",
      "hindiMeaning": "विकसित किया हुआ"
    },
    "isIrregular": false
  },
  "agree": {
    "baseWord": "Agree",
    "v1": {
      "form": "Agree",
      "phoneticHindi": "अग्री",
      "hindiMeaning": "सहमत होना"
    },
    "v2": {
      "form": "Agreed",
      "phoneticHindi": "अग्री्ड",
      "hindiMeaning": "सहमत हुआ"
    },
    "v3": {
      "form": "Agreed",
      "phoneticHindi": "अग्री्ड",
      "hindiMeaning": "सहमत हो चुका"
    },
    "isIrregular": false
  },
  "open": {
    "baseWord": "Open",
    "v1": {
      "form": "Open",
      "phoneticHindi": "ओपन",
      "hindiMeaning": "खोलना"
    },
    "v2": {
      "form": "Opened",
      "phoneticHindi": "ओपन्ड",
      "hindiMeaning": "खोलना"
    },
    "v3": {
      "form": "Opened",
      "phoneticHindi": "ओपन्ड",
      "hindiMeaning": "खोलना हुआ / खोलन चुका"
    },
    "isIrregular": false
  },
  "close": {
    "baseWord": "Close",
    "v1": {
      "form": "Close",
      "phoneticHindi": "क्लोज़",
      "hindiMeaning": "बंद करना"
    },
    "v2": {
      "form": "Closed",
      "phoneticHindi": "क्लोज़्ड",
      "hindiMeaning": "बंद किया"
    },
    "v3": {
      "form": "Closed",
      "phoneticHindi": "क्लोज़्ड",
      "hindiMeaning": "बंद किया हुआ"
    },
    "isIrregular": false
  },
  "reach": {
    "baseWord": "Reach",
    "v1": {
      "form": "Reach",
      "phoneticHindi": "रीच",
      "hindiMeaning": "पहुँचना"
    },
    "v2": {
      "form": "Reached",
      "phoneticHindi": "रीच्ड",
      "hindiMeaning": "पहुँचना"
    },
    "v3": {
      "form": "Reached",
      "phoneticHindi": "रीच्ड",
      "hindiMeaning": "पहुँचना हुआ / पहुँचन चुका"
    },
    "isIrregular": false
  },
  "build": {
    "baseWord": "Build",
    "v1": {
      "form": "Build",
      "phoneticHindi": "बिल्ड",
      "hindiMeaning": "बनाना"
    },
    "v2": {
      "form": "Built",
      "phoneticHindi": "बिल्ट",
      "hindiMeaning": "बनाया / निर्माण किया"
    },
    "v3": {
      "form": "Built",
      "phoneticHindi": "बिल्ट",
      "hindiMeaning": "बना हुआ / निर्मित"
    },
    "isIrregular": true
  },
  "involve": {
    "baseWord": "Involve",
    "v1": {
      "form": "Involve",
      "phoneticHindi": "इन्वॉल्व",
      "hindiMeaning": "शामिल करना"
    },
    "v2": {
      "form": "Involved",
      "phoneticHindi": "इन्वॉल्व्ड",
      "hindiMeaning": "शामिल किया"
    },
    "v3": {
      "form": "Involved",
      "phoneticHindi": "इन्वॉल्व्ड",
      "hindiMeaning": "शामिल किया हुआ"
    },
    "isIrregular": false
  },
  "spend": {
    "baseWord": "Spend",
    "v1": {
      "form": "Spend",
      "phoneticHindi": "स्पेंड",
      "hindiMeaning": "खर्च करना"
    },
    "v2": {
      "form": "Spent",
      "phoneticHindi": "स्पेंट",
      "hindiMeaning": "खर्च किया / बिताया"
    },
    "v3": {
      "form": "Spent",
      "phoneticHindi": "स्पेंट",
      "hindiMeaning": "खर्च हुआ / बीता हुआ"
    },
    "isIrregular": true
  },
  "return": {
    "baseWord": "Return",
    "v1": {
      "form": "Return",
      "phoneticHindi": "रिटर्न",
      "hindiMeaning": "लौटना"
    },
    "v2": {
      "form": "Returned",
      "phoneticHindi": "रिटर्न्ड",
      "hindiMeaning": "लौटना"
    },
    "v3": {
      "form": "Returned",
      "phoneticHindi": "रिटर्न्ड",
      "hindiMeaning": "लौटना हुआ / लौटन चुका"
    },
    "isIrregular": false
  },
  "draw": {
    "baseWord": "Draw",
    "v1": {
      "form": "Draw",
      "phoneticHindi": "ड्रॉ",
      "hindiMeaning": "चित्र खींचना"
    },
    "v2": {
      "form": "Drew",
      "phoneticHindi": "ड्रू",
      "hindiMeaning": "चित्र बनाया / खींचा"
    },
    "v3": {
      "form": "Drawn",
      "phoneticHindi": "ड्रॉन",
      "hindiMeaning": "चित्र बनाया हुआ / खींचा हुआ"
    },
    "isIrregular": true
  },
  "die": {
    "baseWord": "Die",
    "v1": {
      "form": "Die",
      "phoneticHindi": "डाई",
      "hindiMeaning": "मरना"
    },
    "v2": {
      "form": "Died",
      "phoneticHindi": "डाई्ड",
      "hindiMeaning": "मरना"
    },
    "v3": {
      "form": "Died",
      "phoneticHindi": "डाई्ड",
      "hindiMeaning": "मरना हुआ / मरन चुका"
    },
    "isIrregular": false
  },
  "hope": {
    "baseWord": "Hope",
    "v1": {
      "form": "Hope",
      "phoneticHindi": "होप",
      "hindiMeaning": "आशा करना"
    },
    "v2": {
      "form": "Hoped",
      "phoneticHindi": "होप्ड",
      "hindiMeaning": "आशा किया"
    },
    "v3": {
      "form": "Hoped",
      "phoneticHindi": "होप्ड",
      "hindiMeaning": "आशा किया हुआ"
    },
    "isIrregular": false
  },
  "create": {
    "baseWord": "Create",
    "v1": {
      "form": "Create",
      "phoneticHindi": "क्रिएट",
      "hindiMeaning": "निर्माण करना"
    },
    "v2": {
      "form": "Created",
      "phoneticHindi": "क्रिएटेड",
      "hindiMeaning": "निर्माण किया"
    },
    "v3": {
      "form": "Created",
      "phoneticHindi": "क्रिएटेड",
      "hindiMeaning": "निर्माण किया हुआ"
    },
    "isIrregular": false
  },
  "walk": {
    "baseWord": "Walk",
    "v1": {
      "form": "Walk",
      "phoneticHindi": "वॉक",
      "hindiMeaning": "चलना"
    },
    "v2": {
      "form": "Walked",
      "phoneticHindi": "वॉक्ड",
      "hindiMeaning": "चलना"
    },
    "v3": {
      "form": "Walked",
      "phoneticHindi": "वॉक्ड",
      "hindiMeaning": "चलना हुआ / चलन चुका"
    },
    "isIrregular": false
  },
  "sell": {
    "baseWord": "Sell",
    "v1": {
      "form": "Sell",
      "phoneticHindi": "सेल",
      "hindiMeaning": "बेचना"
    },
    "v2": {
      "form": "Sold",
      "phoneticHindi": "सोल्ड",
      "hindiMeaning": "बेचा"
    },
    "v3": {
      "form": "Sold",
      "phoneticHindi": "सोल्ड",
      "hindiMeaning": "बेचा हुआ / बिक चुका"
    },
    "isIrregular": true
  },
  "wait": {
    "baseWord": "Wait",
    "v1": {
      "form": "Wait",
      "phoneticHindi": "वेट",
      "hindiMeaning": "इंतज़ार करना"
    },
    "v2": {
      "form": "Waited",
      "phoneticHindi": "वेटेड",
      "hindiMeaning": "इंतज़ार किया"
    },
    "v3": {
      "form": "Waited",
      "phoneticHindi": "वेटेड",
      "hindiMeaning": "इंतज़ार किया हुआ"
    },
    "isIrregular": false
  },
  "cause": {
    "baseWord": "Cause",
    "v1": {
      "form": "Cause",
      "phoneticHindi": "कॉज़",
      "hindiMeaning": "कारण होना"
    },
    "v2": {
      "form": "Caused",
      "phoneticHindi": "कॉज़्ड",
      "hindiMeaning": "कारण हुआ"
    },
    "v3": {
      "form": "Caused",
      "phoneticHindi": "कॉज़्ड",
      "hindiMeaning": "कारण हो चुका"
    },
    "isIrregular": false
  },
  "pass": {
    "baseWord": "Pass",
    "v1": {
      "form": "Pass",
      "phoneticHindi": "पास",
      "hindiMeaning": "गुजरना"
    },
    "v2": {
      "form": "Passed",
      "phoneticHindi": "पास्ड",
      "hindiMeaning": "गुजरना"
    },
    "v3": {
      "form": "Passed",
      "phoneticHindi": "पास्ड",
      "hindiMeaning": "गुजरना हुआ / गुजरन चुका"
    },
    "isIrregular": false
  },
  "lie": {
    "baseWord": "Lie",
    "v1": {
      "form": "Lie",
      "phoneticHindi": "लाई",
      "hindiMeaning": "झूठ बोलना"
    },
    "v2": {
      "form": "Lied",
      "phoneticHindi": "लाइड",
      "hindiMeaning": "झूठ बोला"
    },
    "v3": {
      "form": "Lied",
      "phoneticHindi": "लाइड",
      "hindiMeaning": "झूठ बोला हुआ"
    },
    "isIrregular": true,
    "notes": "Lie (tell untruth) -> lied -> lied. (Recline: lay -> lain)"
  },
  "accept": {
    "baseWord": "Accept",
    "v1": {
      "form": "Accept",
      "phoneticHindi": "एक्सेप्ट",
      "hindiMeaning": "स्वीकार करना"
    },
    "v2": {
      "form": "Accepted",
      "phoneticHindi": "एक्सेप्टेड",
      "hindiMeaning": "स्वीकार किया"
    },
    "v3": {
      "form": "Accepted",
      "phoneticHindi": "एक्सेप्टेड",
      "hindiMeaning": "स्वीकार किया हुआ"
    },
    "isIrregular": false
  },
  "watch": {
    "baseWord": "Watch",
    "v1": {
      "form": "Watch",
      "phoneticHindi": "वॉच",
      "hindiMeaning": "देखना"
    },
    "v2": {
      "form": "Watched",
      "phoneticHindi": "वॉच्ड",
      "hindiMeaning": "देखना"
    },
    "v3": {
      "form": "Watched",
      "phoneticHindi": "वॉच्ड",
      "hindiMeaning": "देखना हुआ / देखन चुका"
    },
    "isIrregular": false
  },
  "raise": {
    "baseWord": "Raise",
    "v1": {
      "form": "Raise",
      "phoneticHindi": "रेज़",
      "hindiMeaning": "उठाना"
    },
    "v2": {
      "form": "Raised",
      "phoneticHindi": "रेज़्ड",
      "hindiMeaning": "उठाना"
    },
    "v3": {
      "form": "Raised",
      "phoneticHindi": "रेज़्ड",
      "hindiMeaning": "उठाना हुआ / उठान चुका"
    },
    "isIrregular": false
  },
  "apply": {
    "baseWord": "Apply",
    "v1": {
      "form": "Apply",
      "phoneticHindi": "अप्लाई",
      "hindiMeaning": "लागू करना"
    },
    "v2": {
      "form": "Applied",
      "phoneticHindi": "अप्लाई्ड",
      "hindiMeaning": "लागू किया"
    },
    "v3": {
      "form": "Applied",
      "phoneticHindi": "अप्लाई्ड",
      "hindiMeaning": "लागू किया हुआ"
    },
    "isIrregular": false
  },
  "break": {
    "baseWord": "Break",
    "v1": {
      "form": "Break",
      "phoneticHindi": "ब्रेक",
      "hindiMeaning": "तोड़ना"
    },
    "v2": {
      "form": "Broke",
      "phoneticHindi": "ब्रोक",
      "hindiMeaning": "तोड़ा / टूटा"
    },
    "v3": {
      "form": "Broken",
      "phoneticHindi": "ब्रोकन",
      "hindiMeaning": "टूटा हुआ / तोड़ चुका"
    },
    "isIrregular": true
  },
  "explain": {
    "baseWord": "Explain",
    "v1": {
      "form": "Explain",
      "phoneticHindi": "एक्सप्लेन",
      "hindiMeaning": "समझाना"
    },
    "v2": {
      "form": "Explained",
      "phoneticHindi": "एक्सप्लेन्ड",
      "hindiMeaning": "समझाना"
    },
    "v3": {
      "form": "Explained",
      "phoneticHindi": "एक्सप्लेन्ड",
      "hindiMeaning": "समझाना हुआ / समझान चुका"
    },
    "isIrregular": false
  },
  "learn": {
    "baseWord": "Learn",
    "v1": {
      "form": "Learn",
      "phoneticHindi": "लर्न",
      "hindiMeaning": "सीखना"
    },
    "v2": {
      "form": "Learned / Learnt",
      "phoneticHindi": "लर्न्ड",
      "hindiMeaning": "सीखा"
    },
    "v3": {
      "form": "Learned / Learnt",
      "phoneticHindi": "लर्न्ड",
      "hindiMeaning": "सीखा हुआ / सीख चुका"
    },
    "isIrregular": true,
    "notes": "Learned (US) / Learnt (UK)"
  },
  "increase": {
    "baseWord": "Increase",
    "v1": {
      "form": "Increase",
      "phoneticHindi": "इंक्रीज़",
      "hindiMeaning": "बढ़ाना"
    },
    "v2": {
      "form": "Increased",
      "phoneticHindi": "इंक्रीज़्ड",
      "hindiMeaning": "बढ़ाना"
    },
    "v3": {
      "form": "Increased",
      "phoneticHindi": "इंक्रीज़्ड",
      "hindiMeaning": "बढ़ाना हुआ / बढ़ान चुका"
    },
    "isIrregular": false
  },
  "cover": {
    "baseWord": "Cover",
    "v1": {
      "form": "Cover",
      "phoneticHindi": "कवर",
      "hindiMeaning": "ढंकना"
    },
    "v2": {
      "form": "Covered",
      "phoneticHindi": "कवर्ड",
      "hindiMeaning": "ढंकना"
    },
    "v3": {
      "form": "Covered",
      "phoneticHindi": "कवर्ड",
      "hindiMeaning": "ढंकना हुआ / ढंकन चुका"
    },
    "isIrregular": false
  },
  "grow": {
    "baseWord": "Grow",
    "v1": {
      "form": "Grow",
      "phoneticHindi": "ग्रो",
      "hindiMeaning": "बढ़ना"
    },
    "v2": {
      "form": "Grew",
      "phoneticHindi": "ग्रू",
      "hindiMeaning": "बढ़ा / विकसित हुआ / उगा"
    },
    "v3": {
      "form": "Grown",
      "phoneticHindi": "ग्रोन",
      "hindiMeaning": "बढ़ा हुआ / उगा हुआ"
    },
    "isIrregular": true
  },
  "claim": {
    "baseWord": "Claim",
    "v1": {
      "form": "Claim",
      "phoneticHindi": "क्लेम",
      "hindiMeaning": "दावा करना"
    },
    "v2": {
      "form": "Claimed",
      "phoneticHindi": "क्लेम्ड",
      "hindiMeaning": "दावा किया"
    },
    "v3": {
      "form": "Claimed",
      "phoneticHindi": "क्लेम्ड",
      "hindiMeaning": "दावा किया हुआ"
    },
    "isIrregular": false
  },
  "report": {
    "baseWord": "Report",
    "v1": {
      "form": "Report",
      "phoneticHindi": "रिपोर्ट",
      "hindiMeaning": "सूचित करना"
    },
    "v2": {
      "form": "Reported",
      "phoneticHindi": "रिपोर्टेड",
      "hindiMeaning": "सूचित किया"
    },
    "v3": {
      "form": "Reported",
      "phoneticHindi": "रिपोर्टेड",
      "hindiMeaning": "सूचित किया हुआ"
    },
    "isIrregular": false
  },
  "cut": {
    "baseWord": "Cut",
    "v1": {
      "form": "Cut",
      "phoneticHindi": "कट",
      "hindiMeaning": "काटना"
    },
    "v2": {
      "form": "Cut",
      "phoneticHindi": "कट",
      "hindiMeaning": "काटा"
    },
    "v3": {
      "form": "Cut",
      "phoneticHindi": "कट",
      "hindiMeaning": "कटा हुआ / काट चुका"
    },
    "isIrregular": true
  },
  "cry": {
    "baseWord": "Cry",
    "v1": {
      "form": "Cry",
      "phoneticHindi": "क्राय",
      "hindiMeaning": "रोना"
    },
    "v2": {
      "form": "Cried",
      "phoneticHindi": "क्राय्ड",
      "hindiMeaning": "रोना"
    },
    "v3": {
      "form": "Cried",
      "phoneticHindi": "क्राय्ड",
      "hindiMeaning": "रोना हुआ / रोन चुका"
    },
    "isIrregular": false
  },
  "cost": {
    "baseWord": "Cost",
    "v1": {
      "form": "Cost",
      "phoneticHindi": "कॉस्ट",
      "hindiMeaning": "कीमत होना"
    },
    "v2": {
      "form": "Cost",
      "phoneticHindi": "कॉस्ट",
      "hindiMeaning": "कीमत पड़ी / लागत आई"
    },
    "v3": {
      "form": "Cost",
      "phoneticHindi": "कॉस्ट",
      "hindiMeaning": "लागत लगा हुआ"
    },
    "isIrregular": true
  },
  "clean": {
    "baseWord": "Clean",
    "v1": {
      "form": "Clean",
      "phoneticHindi": "क्लीन",
      "hindiMeaning": "साफ करना"
    },
    "v2": {
      "form": "Cleaned",
      "phoneticHindi": "क्लीन्ड",
      "hindiMeaning": "साफ किया"
    },
    "v3": {
      "form": "Cleaned",
      "phoneticHindi": "क्लीन्ड",
      "hindiMeaning": "साफ किया हुआ"
    },
    "isIrregular": false
  },
  "cook": {
    "baseWord": "Cook",
    "v1": {
      "form": "Cook",
      "phoneticHindi": "कुक",
      "hindiMeaning": "खाना बनाना"
    },
    "v2": {
      "form": "Cooked",
      "phoneticHindi": "कुक्ड",
      "hindiMeaning": "खाना बनाना"
    },
    "v3": {
      "form": "Cooked",
      "phoneticHindi": "कुक्ड",
      "hindiMeaning": "खाना बनाना हुआ / खाना बनान चुका"
    },
    "isIrregular": false
  },
  "eat": {
    "baseWord": "Eat",
    "v1": {
      "form": "Eat",
      "phoneticHindi": "ईट",
      "hindiMeaning": "खाना"
    },
    "v2": {
      "form": "Ate",
      "phoneticHindi": "एट",
      "hindiMeaning": "खाया"
    },
    "v3": {
      "form": "Eaten",
      "phoneticHindi": "ईटन",
      "hindiMeaning": "खाया हुआ / खा चुका"
    },
    "isIrregular": true
  },
  "drink": {
    "baseWord": "Drink",
    "v1": {
      "form": "Drink",
      "phoneticHindi": "ड्रिंक",
      "hindiMeaning": "पीना"
    },
    "v2": {
      "form": "Drank",
      "phoneticHindi": "ड्रैंक",
      "hindiMeaning": "पिया"
    },
    "v3": {
      "form": "Drunk",
      "phoneticHindi": "ड्रंक",
      "hindiMeaning": "पिया हुआ / पी चुका"
    },
    "isIrregular": true
  },
  "smile": {
    "baseWord": "Smile",
    "v1": {
      "form": "Smile",
      "phoneticHindi": "स्माइल",
      "hindiMeaning": "मुस्कुराना"
    },
    "v2": {
      "form": "Smiled",
      "phoneticHindi": "स्माइल्ड",
      "hindiMeaning": "मुस्कुराना"
    },
    "v3": {
      "form": "Smiled",
      "phoneticHindi": "स्माइल्ड",
      "hindiMeaning": "मुस्कुराना हुआ / मुस्कुरान चुका"
    },
    "isIrregular": false
  },
  "laugh": {
    "baseWord": "Laugh",
    "v1": {
      "form": "Laugh",
      "phoneticHindi": "लाफ",
      "hindiMeaning": "हँसना"
    },
    "v2": {
      "form": "Laughed",
      "phoneticHindi": "लाफ्ड",
      "hindiMeaning": "हँसना"
    },
    "v3": {
      "form": "Laughed",
      "phoneticHindi": "लाफ्ड",
      "hindiMeaning": "हँसना हुआ / हँसन चुका"
    },
    "isIrregular": false
  },
  "sleep": {
    "baseWord": "Sleep",
    "v1": {
      "form": "Sleep",
      "phoneticHindi": "स्लीप",
      "hindiMeaning": "सोना"
    },
    "v2": {
      "form": "Slept",
      "phoneticHindi": "स्लेप्ट",
      "hindiMeaning": "सोया"
    },
    "v3": {
      "form": "Slept",
      "phoneticHindi": "स्लेप्ट",
      "hindiMeaning": "सोया हुआ"
    },
    "isIrregular": true
  },
  "teach": {
    "baseWord": "Teach",
    "v1": {
      "form": "Teach",
      "phoneticHindi": "टीच",
      "hindiMeaning": "पढ़ाना"
    },
    "v2": {
      "form": "Taught",
      "phoneticHindi": "टॉट",
      "hindiMeaning": "पढ़ाया / सिखाया"
    },
    "v3": {
      "form": "Taught",
      "phoneticHindi": "टॉट",
      "hindiMeaning": "पढ़ाया हुआ / सिखा चुका"
    },
    "isIrregular": true
  },
  "catch": {
    "baseWord": "Catch",
    "v1": {
      "form": "Catch",
      "phoneticHindi": "कैच",
      "hindiMeaning": "पकड़ना"
    },
    "v2": {
      "form": "Caught",
      "phoneticHindi": "कॉट",
      "hindiMeaning": "पकड़ा"
    },
    "v3": {
      "form": "Caught",
      "phoneticHindi": "कॉट",
      "hindiMeaning": "पकड़ा हुआ / पकड़ चुका"
    },
    "isIrregular": true
  },
  "drive": {
    "baseWord": "Drive",
    "v1": {
      "form": "Drive",
      "phoneticHindi": "ड्राइव",
      "hindiMeaning": "गाड़ी चलाना"
    },
    "v2": {
      "form": "Drove",
      "phoneticHindi": "ड्रोव",
      "hindiMeaning": "गाड़ी चलाई"
    },
    "v3": {
      "form": "Driven",
      "phoneticHindi": "ड्रिवन",
      "hindiMeaning": "चलाया हुआ / चला चुका"
    },
    "isIrregular": true
  },
  "finish": {
    "baseWord": "Finish",
    "v1": {
      "form": "Finish",
      "phoneticHindi": "फिनिश",
      "hindiMeaning": "समाप्त करना"
    },
    "v2": {
      "form": "Finished",
      "phoneticHindi": "फिनिश्ड",
      "hindiMeaning": "समाप्त किया"
    },
    "v3": {
      "form": "Finished",
      "phoneticHindi": "फिनिश्ड",
      "hindiMeaning": "समाप्त किया हुआ"
    },
    "isIrregular": false
  },
  "fix": {
    "baseWord": "Fix",
    "v1": {
      "form": "Fix",
      "phoneticHindi": "फिक्स",
      "hindiMeaning": "ठीक करना"
    },
    "v2": {
      "form": "Fixxed",
      "phoneticHindi": "फिक्स्ड",
      "hindiMeaning": "ठीक किया"
    },
    "v3": {
      "form": "Fixxed",
      "phoneticHindi": "फिक्स्ड",
      "hindiMeaning": "ठीक किया हुआ"
    },
    "isIrregular": false
  },
  "jump": {
    "baseWord": "Jump",
    "v1": {
      "form": "Jump",
      "phoneticHindi": "जम्प",
      "hindiMeaning": "कूदना"
    },
    "v2": {
      "form": "Jumped",
      "phoneticHindi": "जम्प्ड",
      "hindiMeaning": "कूदना"
    },
    "v3": {
      "form": "Jumped",
      "phoneticHindi": "जम्प्ड",
      "hindiMeaning": "कूदना हुआ / कूदन चुका"
    },
    "isIrregular": false
  },
  "push": {
    "baseWord": "Push",
    "v1": {
      "form": "Push",
      "phoneticHindi": "पुश",
      "hindiMeaning": "धक्का देना"
    },
    "v2": {
      "form": "Pushed",
      "phoneticHindi": "पुश्ड",
      "hindiMeaning": "धक्का दिया"
    },
    "v3": {
      "form": "Pushed",
      "phoneticHindi": "पुश्ड",
      "hindiMeaning": "धक्का दिया हुआ"
    },
    "isIrregular": false
  },
  "pull": {
    "baseWord": "Pull",
    "v1": {
      "form": "Pull",
      "phoneticHindi": "पुल",
      "hindiMeaning": "खींचना"
    },
    "v2": {
      "form": "Pulled",
      "phoneticHindi": "पुल्ड",
      "hindiMeaning": "खींचना"
    },
    "v3": {
      "form": "Pulled",
      "phoneticHindi": "पुल्ड",
      "hindiMeaning": "खींचना हुआ / खींचन चुका"
    },
    "isIrregular": false
  },
  "save": {
    "baseWord": "Save",
    "v1": {
      "form": "Save",
      "phoneticHindi": "सेव",
      "hindiMeaning": "बचाना"
    },
    "v2": {
      "form": "Saved",
      "phoneticHindi": "सेव्ड",
      "hindiMeaning": "बचाना"
    },
    "v3": {
      "form": "Saved",
      "phoneticHindi": "सेव्ड",
      "hindiMeaning": "बचाना हुआ / बचान चुका"
    },
    "isIrregular": false
  },
  "share": {
    "baseWord": "Share",
    "v1": {
      "form": "Share",
      "phoneticHindi": "शेयर",
      "hindiMeaning": "साझा करना"
    },
    "v2": {
      "form": "Shared",
      "phoneticHindi": "शेयर्ड",
      "hindiMeaning": "साझा किया"
    },
    "v3": {
      "form": "Shared",
      "phoneticHindi": "शेयर्ड",
      "hindiMeaning": "साझा किया हुआ"
    },
    "isIrregular": false
  },
  "travel": {
    "baseWord": "Travel",
    "v1": {
      "form": "Travel",
      "phoneticHindi": "ट्रैवल",
      "hindiMeaning": "यात्रा करना"
    },
    "v2": {
      "form": "Travelled",
      "phoneticHindi": "ट्रैवल्ड",
      "hindiMeaning": "यात्रा किया"
    },
    "v3": {
      "form": "Travelled",
      "phoneticHindi": "ट्रैवल्ड",
      "hindiMeaning": "यात्रा किया हुआ"
    },
    "isIrregular": false
  },
  "become": {
    "baseWord": "Become",
    "v1": {
      "form": "Become",
      "phoneticHindi": "बिकम",
      "hindiMeaning": "बनना"
    },
    "v2": {
      "form": "Became",
      "phoneticHindi": "बिकेम",
      "hindiMeaning": "बना / हुआ"
    },
    "v3": {
      "form": "Become",
      "phoneticHindi": "बिकम",
      "hindiMeaning": "बना हुआ / हो चुका"
    },
    "isIrregular": true
  },
  "choose": {
    "baseWord": "Choose",
    "v1": {
      "form": "Choose",
      "phoneticHindi": "चूज़",
      "hindiMeaning": "चुनना"
    },
    "v2": {
      "form": "Chose",
      "phoneticHindi": "चोज़",
      "hindiMeaning": "चुना"
    },
    "v3": {
      "form": "Chosen",
      "phoneticHindi": "चोज़न",
      "hindiMeaning": "चुना हुआ / चयन कर चुका"
    },
    "isIrregular": true
  },
  "complete": {
    "baseWord": "Complete",
    "v1": {
      "form": "Complete",
      "phoneticHindi": "कंप्लीट",
      "hindiMeaning": "पूरा करना"
    },
    "v2": {
      "form": "Completed",
      "phoneticHindi": "कंप्लीटेड",
      "hindiMeaning": "पूरा किया"
    },
    "v3": {
      "form": "Completed",
      "phoneticHindi": "कंप्लीटेड",
      "hindiMeaning": "पूरा किया हुआ"
    },
    "isIrregular": false
  },
  "forget": {
    "baseWord": "Forget",
    "v1": {
      "form": "Forget",
      "phoneticHindi": "फॉरगेट",
      "hindiMeaning": "भूलना"
    },
    "v2": {
      "form": "Forgot",
      "phoneticHindi": "फॉरगॉट",
      "hindiMeaning": "भूल गया"
    },
    "v3": {
      "form": "Forgotten",
      "phoneticHindi": "फॉरगॉटन",
      "hindiMeaning": "भूला हुआ / विस्मृत"
    },
    "isIrregular": true
  },
  "improve": {
    "baseWord": "Improve",
    "v1": {
      "form": "Improve",
      "phoneticHindi": "इम्प्रूव",
      "hindiMeaning": "सुधारना"
    },
    "v2": {
      "form": "Improved",
      "phoneticHindi": "इम्प्रूव्ड",
      "hindiMeaning": "सुधारना"
    },
    "v3": {
      "form": "Improved",
      "phoneticHindi": "इम्प्रूव्ड",
      "hindiMeaning": "सुधारना हुआ / सुधारन चुका"
    },
    "isIrregular": false
  },
  "listen": {
    "baseWord": "Listen",
    "v1": {
      "form": "Listen",
      "phoneticHindi": "लिसन",
      "hindiMeaning": "सुनना"
    },
    "v2": {
      "form": "Listened",
      "phoneticHindi": "लिसन्ड",
      "hindiMeaning": "सुनना"
    },
    "v3": {
      "form": "Listened",
      "phoneticHindi": "लिसन्ड",
      "hindiMeaning": "सुनना हुआ / सुनन चुका"
    },
    "isIrregular": false
  },
  "study": {
    "baseWord": "Study",
    "v1": {
      "form": "Study",
      "phoneticHindi": "स्टडी",
      "hindiMeaning": "पढ़ाई करना"
    },
    "v2": {
      "form": "Studied",
      "phoneticHindi": "स्टडी्ड",
      "hindiMeaning": "पढ़ाई किया"
    },
    "v3": {
      "form": "Studied",
      "phoneticHindi": "स्टडी्ड",
      "hindiMeaning": "पढ़ाई किया हुआ"
    },
    "isIrregular": false
  },
  "knock": {
    "baseWord": "Knock",
    "v1": {
      "form": "Knock",
      "phoneticHindi": "नॉक",
      "hindiMeaning": "खटखटाना"
    },
    "v2": {
      "form": "Knocked",
      "phoneticHindi": "नॉक्ड",
      "hindiMeaning": "खटखटाना"
    },
    "v3": {
      "form": "Knocked",
      "phoneticHindi": "नॉक्ड",
      "hindiMeaning": "खटखटाना हुआ / खटखटान चुका"
    },
    "isIrregular": false
  },
  "kill": {
    "baseWord": "Kill",
    "v1": {
      "form": "Kill",
      "phoneticHindi": "किल",
      "hindiMeaning": "मार डालना"
    },
    "v2": {
      "form": "Killed",
      "phoneticHindi": "किल्ड",
      "hindiMeaning": "मार डालना"
    },
    "v3": {
      "form": "Killed",
      "phoneticHindi": "किल्ड",
      "hindiMeaning": "मार डालना हुआ / मार डालन चुका"
    },
    "isIrregular": false
  },
  "lift": {
    "baseWord": "Lift",
    "v1": {
      "form": "Lift",
      "phoneticHindi": "लिफ्ट",
      "hindiMeaning": "उठाना"
    },
    "v2": {
      "form": "Lifted",
      "phoneticHindi": "लिफ्टेड",
      "hindiMeaning": "उठाना"
    },
    "v3": {
      "form": "Lifted",
      "phoneticHindi": "लिफ्टेड",
      "hindiMeaning": "उठाना हुआ / उठान चुका"
    },
    "isIrregular": false
  },
  "match": {
    "baseWord": "Match",
    "v1": {
      "form": "Match",
      "phoneticHindi": "मैच",
      "hindiMeaning": "मुकाबला करना"
    },
    "v2": {
      "form": "Matched",
      "phoneticHindi": "मैच्ड",
      "hindiMeaning": "मुकाबला किया"
    },
    "v3": {
      "form": "Matched",
      "phoneticHindi": "मैच्ड",
      "hindiMeaning": "मुकाबला किया हुआ"
    },
    "isIrregular": false
  },
  "obey": {
    "baseWord": "Obey",
    "v1": {
      "form": "Obey",
      "phoneticHindi": "ओबे",
      "hindiMeaning": "आज्ञा मानना"
    },
    "v2": {
      "form": "Obeyed",
      "phoneticHindi": "ओबे्ड",
      "hindiMeaning": "आज्ञा मानना"
    },
    "v3": {
      "form": "Obeyed",
      "phoneticHindi": "ओबे्ड",
      "hindiMeaning": "आज्ञा मानना हुआ / आज्ञा मानन चुका"
    },
    "isIrregular": false
  },
  "paint": {
    "baseWord": "Paint",
    "v1": {
      "form": "Paint",
      "phoneticHindi": "पेंट",
      "hindiMeaning": "रंग करना"
    },
    "v2": {
      "form": "Painted",
      "phoneticHindi": "पेंटेड",
      "hindiMeaning": "रंग किया"
    },
    "v3": {
      "form": "Painted",
      "phoneticHindi": "पेंटेड",
      "hindiMeaning": "रंग किया हुआ"
    },
    "isIrregular": false
  },
  "pick": {
    "baseWord": "Pick",
    "v1": {
      "form": "Pick",
      "phoneticHindi": "पिक",
      "hindiMeaning": "उठाना"
    },
    "v2": {
      "form": "Picked",
      "phoneticHindi": "पिक्ड",
      "hindiMeaning": "उठाना"
    },
    "v3": {
      "form": "Picked",
      "phoneticHindi": "पिक्ड",
      "hindiMeaning": "उठाना हुआ / उठान चुका"
    },
    "isIrregular": false
  },
  "quarrel": {
    "baseWord": "Quarrel",
    "v1": {
      "form": "Quarrel",
      "phoneticHindi": "क्वॉरेल",
      "hindiMeaning": "झगड़ा करना"
    },
    "v2": {
      "form": "Quarrelled",
      "phoneticHindi": "क्वॉरेल्ड",
      "hindiMeaning": "झगड़ा किया"
    },
    "v3": {
      "form": "Quarrelled",
      "phoneticHindi": "क्वॉरेल्ड",
      "hindiMeaning": "झगड़ा किया हुआ"
    },
    "isIrregular": false
  },
  "quote": {
    "baseWord": "Quote",
    "v1": {
      "form": "Quote",
      "phoneticHindi": "कोट",
      "hindiMeaning": "उद्धरण देना"
    },
    "v2": {
      "form": "Quoted",
      "phoneticHindi": "कोटेड",
      "hindiMeaning": "उद्धरण दिया"
    },
    "v3": {
      "form": "Quoted",
      "phoneticHindi": "कोटेड",
      "hindiMeaning": "उद्धरण दिया हुआ"
    },
    "isIrregular": false
  },
  "rise": {
    "baseWord": "Rise",
    "v1": {
      "form": "Rise",
      "phoneticHindi": "राइज़",
      "hindiMeaning": "उठना"
    },
    "v2": {
      "form": "Rose",
      "phoneticHindi": "रोज़",
      "hindiMeaning": "उठा / बढ़ा / उदित हुआ"
    },
    "v3": {
      "form": "Risen",
      "phoneticHindi": "रिज़न",
      "hindiMeaning": "उठा हुआ / उदित हुआ"
    },
    "isIrregular": true
  },
  "ring": {
    "baseWord": "Ring",
    "v1": {
      "form": "Ring",
      "phoneticHindi": "रिंग",
      "hindiMeaning": "घंटी बजाना"
    },
    "v2": {
      "form": "Rang",
      "phoneticHindi": "रैंग",
      "hindiMeaning": "घंटी बजी / बजाई"
    },
    "v3": {
      "form": "Rung",
      "phoneticHindi": "रंग",
      "hindiMeaning": "बजी हुई / बजा चुका"
    },
    "isIrregular": true
  },
  "wash": {
    "baseWord": "Wash",
    "v1": {
      "form": "Wash",
      "phoneticHindi": "वॉश",
      "hindiMeaning": "धोना"
    },
    "v2": {
      "form": "Washed",
      "phoneticHindi": "वॉश्ड",
      "hindiMeaning": "धोना"
    },
    "v3": {
      "form": "Washed",
      "phoneticHindi": "वॉश्ड",
      "hindiMeaning": "धोना हुआ / धोन चुका"
    },
    "isIrregular": false
  },
  "abandon": {
    "baseWord": "Abandon",
    "v1": {
      "form": "Abandon",
      "phoneticHindi": "अबैंडन",
      "hindiMeaning": "त्याग देना"
    },
    "v2": {
      "form": "Abandoned",
      "phoneticHindi": "अबैंडन्ड",
      "hindiMeaning": "त्याग दिया"
    },
    "v3": {
      "form": "Abandoned",
      "phoneticHindi": "अबैंडन्ड",
      "hindiMeaning": "त्याग दिया हुआ"
    },
    "isIrregular": false
  },
  "benefit": {
    "baseWord": "Benefit",
    "v1": {
      "form": "Benefit",
      "phoneticHindi": "बेनिफिट",
      "hindiMeaning": "लाभ होना"
    },
    "v2": {
      "form": "Benefited",
      "phoneticHindi": "बेनिफिटेड",
      "hindiMeaning": "लाभ हुआ"
    },
    "v3": {
      "form": "Benefited",
      "phoneticHindi": "बेनिफिटेड",
      "hindiMeaning": "लाभ हो चुका"
    },
    "isIrregular": false
  },
  "dedicate": {
    "baseWord": "Dedicate",
    "v1": {
      "form": "Dedicate",
      "phoneticHindi": "डेडिकेट",
      "hindiMeaning": "समर्पित करना"
    },
    "v2": {
      "form": "Dedicated",
      "phoneticHindi": "डेडिकेटेड",
      "hindiMeaning": "समर्पित किया"
    },
    "v3": {
      "form": "Dedicated",
      "phoneticHindi": "डेडिकेटेड",
      "hindiMeaning": "समर्पित किया हुआ"
    },
    "isIrregular": false
  },
  "encourage": {
    "baseWord": "Encourage",
    "v1": {
      "form": "Encourage",
      "phoneticHindi": "एन्करेज",
      "hindiMeaning": "प्रोत्साहित करना"
    },
    "v2": {
      "form": "Encouraged",
      "phoneticHindi": "एन्करेज्ड",
      "hindiMeaning": "प्रोत्साहित किया"
    },
    "v3": {
      "form": "Encouraged",
      "phoneticHindi": "एन्करेज्ड",
      "hindiMeaning": "प्रोत्साहित किया हुआ"
    },
    "isIrregular": false
  },
  "identify": {
    "baseWord": "Identify",
    "v1": {
      "form": "Identify",
      "phoneticHindi": "आइडेंटिफाई",
      "hindiMeaning": "पहचानना"
    },
    "v2": {
      "form": "Identified",
      "phoneticHindi": "आइडेंटिफाई्ड",
      "hindiMeaning": "पहचानना"
    },
    "v3": {
      "form": "Identified",
      "phoneticHindi": "आइडेंटिफाई्ड",
      "hindiMeaning": "पहचानना हुआ / पहचानन चुका"
    },
    "isIrregular": false
  },
  "maintain": {
    "baseWord": "Maintain",
    "v1": {
      "form": "Maintain",
      "phoneticHindi": "मेंटेन",
      "hindiMeaning": "बनाए रखना"
    },
    "v2": {
      "form": "Maintained",
      "phoneticHindi": "मेंटेन्ड",
      "hindiMeaning": "बनाए रखना"
    },
    "v3": {
      "form": "Maintained",
      "phoneticHindi": "मेंटेन्ड",
      "hindiMeaning": "बनाए रखना हुआ / बनाए रखन चुका"
    },
    "isIrregular": false
  },
  "reduce": {
    "baseWord": "Reduce",
    "v1": {
      "form": "Reduce",
      "phoneticHindi": "रिड्यूस",
      "hindiMeaning": "कम करना"
    },
    "v2": {
      "form": "Reduced",
      "phoneticHindi": "रिड्यूस्ड",
      "hindiMeaning": "कम किया"
    },
    "v3": {
      "form": "Reduced",
      "phoneticHindi": "रिड्यूस्ड",
      "hindiMeaning": "कम किया हुआ"
    },
    "isIrregular": false
  }
};

/**
 * Retrieves full V1, V2, V3 forms for any vocabulary word.
 * If pre-compiled in VERB_FORMS_DICTIONARY, returns pristine entry.
 * If a custom imported word, dynamically generates accurate forms.
 */
export function getFullVerbForms(word: VocabularyWord): VerbFullForms {
  if (!word || !word.word) {
    return {
      baseWord: '',
      v1: { form: '', phoneticHindi: '', hindiMeaning: '' },
      v2: { form: '', phoneticHindi: '', hindiMeaning: '' },
      v3: { form: '', phoneticHindi: '', hindiMeaning: '' },
      isIrregular: false,
    };
  }

  const wl = word.word.toLowerCase().trim();
  const existing = VERB_FORMS_DICTIONARY[wl];
  if (existing) {
    return {
      ...existing,
      v1: {
        form: word.word,
        phoneticHindi: word.phoneticHindi || existing.v1.phoneticHindi,
        hindiMeaning: word.hindiMeaning || existing.v1.hindiMeaning,
      },
    };
  }

  // Dynamic fallback for custom imported verbs
  const isE = wl.endsWith('e');
  const past = isE ? `${word.word}d` : `${word.word}ed`;
  const baseMeaning = word.hindiMeaning || '';
  let pastMeaning = `${baseMeaning} (किया)`;
  let partMeaning = `${baseMeaning} (किया हुआ)`;
  if (baseMeaning.endsWith('ना')) {
    const stem = baseMeaning.slice(0, -1);
    pastMeaning = `${stem}ा`;
    partMeaning = `${stem}ा हुआ`;
  }

  return {
    baseWord: word.word,
    v1: {
      form: word.word,
      phoneticHindi: word.phoneticHindi || word.word,
      hindiMeaning: baseMeaning,
    },
    v2: {
      form: past,
      phoneticHindi: word.phoneticHindi ? `${word.phoneticHindi}्ड` : past,
      hindiMeaning: pastMeaning,
    },
    v3: {
      form: past,
      phoneticHindi: word.phoneticHindi ? `${word.phoneticHindi}्ड` : past,
      hindiMeaning: partMeaning,
    },
    isIrregular: false,
    needsReview: true,
  };
}

/**
 * Checks if a vocabulary word is a genuine base verb (V1)
 * and not an inflected past/participle form like 'Said'.
 */
export function isBaseVerb(word: VocabularyWord, overrides?: Record<string, boolean> | unknown): boolean {
  if (!word || !word.word) return false;
  if (!isLegitimateVerb(word, overrides)) return false;
  const wl = word.word.toLowerCase().trim();
  // Filter out inflected forms that belong under their base verb
  if (wl === 'said') return false;
  return true;
}
