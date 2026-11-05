import { DifficultyLevel } from './learning';

export interface SessionSummary {
  id: string;
  timestamp: number;
  dateStr: string;
  topic: string;
  durationMinutes: number;
  lessonCovered: string;
  stoppingPoint: string;
  topicsUnderstood: string[];
  topicsNeedPractice: string[];
  mistakesRecorded: string[];
  nextRecommendedActivity: string;
  notesHi: string;
}

export interface MistakeRecord {
  id: string;
  timestamp: number;
  originalText: string;
  correctedText: string;
  ruleExplanationHi: string;
  category: 'past_tense' | 'svo_order' | 'verb_form' | 'pronunciation' | 'vocabulary' | 'general';
  occurrenceCount: number;
  lastPracticedAt?: number;
  resolved: boolean;
}

export interface PronunciationDifficultyRecord {
  sound: string; // e.g. '/v/ vs /w/', '/f/ vs /ph/', '/t/ vs /d/'
  exampleWords: string[];
  explanationHi: string;
  attemptsCount: number;
  successCount: number;
  lastScore: number;
}

export interface StudentLearningProfile {
  studentId: string;
  studentName: string;
  avatarSeed?: string;
  currentLevel: DifficultyLevel;
  preferredLanguage: 'hindi' | 'hinglish' | 'english';
  createdAt: number;
  lastSessionDate: string;
  lastSessionTimestamp: number;
  
  // Stopping point and continuity
  lastCompletedLesson: string;
  lastConversationTopic: string;
  exactStoppingPoint: string;
  nextRecommendedActivity: string;
  
  // Progress tracking
  topicsUnderstood: string[];
  topicsNeedPractice: string[];
  
  // Vocabulary tracking
  vocabularyLearnedCount: number;
  vocabularyConfusedCount: number;
  vocabularyMasteredCount: number;
  
  // Grammar & Tenses progress
  grammarAndTenseProgress: {
    presentSimple: 'not_started' | 'learning' | 'mastered';
    pastSimple: 'not_started' | 'learning' | 'mastered';
    futureSimple: 'not_started' | 'learning' | 'mastered';
    presentContinuous: 'not_started' | 'learning' | 'mastered';
    presentPerfect: 'not_started' | 'learning' | 'mastered';
    svoRule: 'not_started' | 'learning' | 'mastered';
  };
  
  // Sentence building & shadowing progress
  sentenceBuildingProgress: {
    chipsModeCompleted: number;
    typeModeCompleted: number;
    highestLevel: 'Beginner' | 'Practice' | 'Challenge';
  };
  
  listeningAndSpeakingProgress: {
    totalSentencesShadowed: number;
    averagePronunciationScore: number;
    averageSpeakingScore: number;
  };
  
  // Difficulties & Recurring Mistakes
  pronunciationDifficulties: PronunciationDifficultyRecord[];
  commonRecurringMistakes: MistakeRecord[];
  
  // History of completed sessions
  sessionHistory: SessionSummary[];
}

export const DEFAULT_INITIAL_STUDENT_PROFILE: StudentLearningProfile = {
  studentId: 'student_primary_1',
  studentName: 'विद्यार्थी (Learner)',
  currentLevel: DifficultyLevel.BEGINNER,
  preferredLanguage: 'hinglish',
  createdAt: Date.now() - 3 * 86400000,
  lastSessionDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
  lastSessionTimestamp: Date.now() - 86400000,
  
  lastCompletedLesson: '5 Tenses Practice (Past Simple V2)',
  lastConversationTopic: 'Shopping & Borrowing Items',
  exactStoppingPoint: 'Practicing V2 past tense forms (went, bought, borrowed) in everyday sentences',
  nextRecommendedActivity: 'Warm-up with 2 Past Simple V2 sentences using your saved verbs, then practice asking politely',
  
  topicsUnderstood: [
    'English SVO (Subject + Verb + Object) sentence structure',
    'Present Simple daily habits (I drink tea / He drinks tea)',
    'Verb forms V1, V2, V3 concept',
  ],
  topicsNeedPractice: [
    'Past tense after "yesterday" (using went instead of go)',
    'Pronouncing /v/ vs /w/ cleanly (Vase vs Water)',
    'Using "borrow" vs "take" correctly',
  ],
  
  vocabularyLearnedCount: 42,
  vocabularyConfusedCount: 8,
  vocabularyMasteredCount: 34,
  
  grammarAndTenseProgress: {
    presentSimple: 'mastered',
    pastSimple: 'learning',
    futureSimple: 'not_started',
    presentContinuous: 'not_started',
    presentPerfect: 'not_started',
    svoRule: 'mastered',
  },
  
  sentenceBuildingProgress: {
    chipsModeCompleted: 14,
    typeModeCompleted: 6,
    highestLevel: 'Practice',
  },
  
  listeningAndSpeakingProgress: {
    totalSentencesShadowed: 18,
    averagePronunciationScore: 82,
    averageSpeakingScore: 84,
  },
  
  pronunciationDifficulties: [
    {
      sound: '/v/ vs /w/',
      exampleWords: ['very', 'water', 'village', 'window'],
      explanationHi: 'English में V बोलते समय ऊपर के दाँत निचले होंठ पर रखें (Very)। W में दोनों होंठों को गोल करें (Water)।',
      attemptsCount: 6,
      successCount: 4,
      lastScore: 78,
    },
    {
      sound: '/f/ vs /ph/',
      exampleWords: ['food', 'phone', 'first', 'friend'],
      explanationHi: 'F और Ph में हिंदी के भारी "फ" की तरह हवा का झटका नहीं देना है, बस ऊपर के दाँत निचले होंठ से छूकर हल्की हवा निकालनी है।',
      attemptsCount: 4,
      successCount: 3,
      lastScore: 82,
    },
  ],
  
  commonRecurringMistakes: [
    {
      id: 'm1',
      timestamp: Date.now() - 86400000,
      originalText: 'Yesterday I go to market.',
      correctedText: 'Yesterday I went to the market.',
      ruleExplanationHi: 'Yesterday बीते समय की बात करता है, इसलिए go की जगह क्रिया का Past रूप (V2) went लगेगा।',
      category: 'past_tense',
      occurrenceCount: 3,
      resolved: false,
    },
    {
      id: 'm2',
      timestamp: Date.now() - 172800000,
      originalText: 'Can I take your book for one day?',
      correctedText: 'Can I borrow your book for one day?',
      ruleExplanationHi: 'जब हम किसी से कोई चीज़ वापस लौटाने के लिए लेते हैं, तो take के बजाय borrow (उधार लेना) बोलना ज़्यादा स्वाभाविक है।',
      category: 'vocabulary',
      occurrenceCount: 2,
      resolved: false,
    },
  ],
  
  sessionHistory: [
    {
      id: 'sess_1',
      timestamp: Date.now() - 86400000,
      dateStr: new Date(Date.now() - 86400000).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric' }),
      topic: 'Past Simple & Everyday Verbs',
      durationMinutes: 14,
      lessonCovered: '5 Tenses Practice - Past Simple (V2)',
      stoppingPoint: 'Practicing V2 past tense forms (went, bought, borrowed) in everyday sentences',
      topicsUnderstood: ['V2 verb forms went, saw, bought'],
      topicsNeedPractice: ['Remembering went instead of go after yesterday'],
      mistakesRecorded: ['Yesterday I go -> Yesterday I went'],
      nextRecommendedActivity: 'Warm-up with 2 Past Simple V2 sentences using your saved verbs, then practice asking politely',
      notesHi: 'छात्र ने V2 के नियम को समझा। Yesterday वाले वाक्यों में 2 बार अभ्यास की आवश्यकता है।',
    },
  ],
};
