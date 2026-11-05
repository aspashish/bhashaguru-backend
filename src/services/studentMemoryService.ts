import {
  StudentLearningProfile,
  DEFAULT_INITIAL_STUDENT_PROFILE,
  SessionSummary,
  MistakeRecord,
} from '../types/studentProfile';
import { DifficultyLevel } from '../types/learning';
import { buildApiUrl } from '../config/appConfig';

const ACTIVE_STUDENT_KEY = 'bhashaguru_active_student_id_v1';
const PROFILES_STORAGE_PREFIX = 'bhashaguru_student_profile_';
const PROFILES_REGISTRY_KEY = 'bhashaguru_student_profiles_registry_v1';

export interface StudentMeta {
  studentId: string;
  studentName: string;
  lastActive: number;
}

class StudentMemoryService {
  private activeProfile: StudentLearningProfile | null = null;
  private listeners: Array<(profile: StudentLearningProfile) => void> = [];

  constructor() {
    this.loadActiveProfile();
  }

  /**
   * Get active student ID
   */
  public getActiveStudentId(): string {
    try {
      return localStorage.getItem(ACTIVE_STUDENT_KEY) || 'student_primary_1';
    } catch {
      return 'student_primary_1';
    }
  }

  /**
   * Set active student ID
   */
  public setActiveStudentId(id: string): void {
    try {
      localStorage.setItem(ACTIVE_STUDENT_KEY, id);
    } catch {}
    this.loadActiveProfile();
  }

  /**
   * List all stored student profiles (for multi-student isolation)
   */
  public listStudentProfiles(): StudentMeta[] {
    try {
      const raw = localStorage.getItem(PROFILES_REGISTRY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}

    const defaultList: StudentMeta[] = [
      {
        studentId: 'student_primary_1',
        studentName: 'विद्यार्थी (Learner)',
        lastActive: Date.now() - 86400000,
      },
    ];
    this.saveRegistry(defaultList);
    return defaultList;
  }

  private saveRegistry(list: StudentMeta[]): void {
    try {
      localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(list));
    } catch {}
  }

  /**
   * Load active student profile from localStorage and asynchronously sync with backend
   */
  public loadActiveProfile(): StudentLearningProfile {
    const studentId = this.getActiveStudentId();
    let loaded: StudentLearningProfile | null = null;

    try {
      const raw = localStorage.getItem(`${PROFILES_STORAGE_PREFIX}${studentId}`);
      if (raw) {
        loaded = JSON.parse(raw);
      }
    } catch {
      // fallback
    }

    if (!loaded) {
      if (studentId === 'student_primary_1') {
        loaded = { ...DEFAULT_INITIAL_STUDENT_PROFILE };
      } else {
        // Brand new student starting from scratch
        loaded = {
          ...DEFAULT_INITIAL_STUDENT_PROFILE,
          studentId,
          studentName: 'नया विद्यार्थी (New Student)',
          createdAt: Date.now(),
          lastSessionDate: new Date().toISOString().slice(0, 10),
          lastSessionTimestamp: Date.now(),
          lastCompletedLesson: 'None (शुरुआती स्तर)',
          lastConversationTopic: 'Welcome & Introduction',
          exactStoppingPoint: 'Ready for first English speaking lesson',
          nextRecommendedActivity: 'Start with simple greeting and English SVO (Subject + Verb + Object) rule',
          topicsUnderstood: [],
          topicsNeedPractice: [],
          vocabularyLearnedCount: 0,
          vocabularyConfusedCount: 0,
          vocabularyMasteredCount: 0,
          sessionHistory: [],
          commonRecurringMistakes: [],
          sentenceBuildingProgress: {
            chipsModeCompleted: 0,
            typeModeCompleted: 0,
            highestLevel: 'Beginner',
          },
          listeningAndSpeakingProgress: {
            totalSentencesShadowed: 0,
            averagePronunciationScore: 0,
            averageSpeakingScore: 0,
          },
        };
      }
      this.saveActiveProfile(loaded);
    }

    this.activeProfile = loaded;

    // Asynchronously sync from server in background if available
    this.fetchServerProfile(studentId);

    return loaded;
  }

  /**
   * Background fetch from server
   */
  private async fetchServerProfile(studentId: string): Promise<void> {
    try {
      const res = await fetch(buildApiUrl(`/api/student/profile/${encodeURIComponent(studentId)}`));
      if (res.ok) {
        const serverProfile: StudentLearningProfile = await res.json();
        if (serverProfile && serverProfile.studentId === studentId) {
          // If server profile has newer timestamp or richer history, merge safely
          if (
            !this.activeProfile ||
            serverProfile.lastSessionTimestamp >= (this.activeProfile.lastSessionTimestamp || 0)
          ) {
            this.activeProfile = serverProfile;
            try {
              localStorage.setItem(
                `${PROFILES_STORAGE_PREFIX}${studentId}`,
                JSON.stringify(serverProfile)
              );
            } catch {}
            this.notifyListeners();
          }
        }
      }
    } catch {
      // Offline or network error - keep localStorage data safely intact
    }
  }

  /**
   * Save student profile to localStorage and sync to server
   */
  public saveActiveProfile(profile: StudentLearningProfile): void {
    this.activeProfile = profile;
    try {
      localStorage.setItem(
        `${PROFILES_STORAGE_PREFIX}${profile.studentId}`,
        JSON.stringify(profile)
      );
    } catch {}

    // Update registry entry
    const registry = this.listStudentProfiles();
    const existingIndex = registry.findIndex((s) => s.studentId === profile.studentId);
    if (existingIndex >= 0) {
      registry[existingIndex].studentName = profile.studentName;
      registry[existingIndex].lastActive = profile.lastSessionTimestamp || Date.now();
    } else {
      registry.push({
        studentId: profile.studentId,
        studentName: profile.studentName,
        lastActive: profile.lastSessionTimestamp || Date.now(),
      });
    }
    this.saveRegistry(registry);

    this.notifyListeners();

    // Async sync to server
    fetch(buildApiUrl(`/api/student/profile/${encodeURIComponent(profile.studentId)}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }).catch(() => {
      // Server sync error handled gracefully
    });
  }

  /**
   * Switch to another student account
   */
  public switchStudent(studentId: string, studentName?: string): StudentLearningProfile {
    this.setActiveStudentId(studentId);
    if (studentName && this.activeProfile && this.activeProfile.studentName !== studentName) {
      this.activeProfile.studentName = studentName;
      this.saveActiveProfile(this.activeProfile);
    }
    return this.getActiveProfile();
  }

  /**
   * Create a new separate student profile
   */
  public createNewStudentProfile(studentName: string): StudentLearningProfile {
    const studentId = 'student_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    const newProfile: StudentLearningProfile = {
      ...DEFAULT_INITIAL_STUDENT_PROFILE,
      studentId,
      studentName: studentName.trim() || 'नया विद्यार्थी',
      createdAt: Date.now(),
      lastSessionDate: new Date().toISOString().slice(0, 10),
      lastSessionTimestamp: Date.now(),
      lastCompletedLesson: 'None (शुरुआती स्तर)',
      lastConversationTopic: 'Welcome & Introduction',
      exactStoppingPoint: 'Ready for first English speaking lesson',
      nextRecommendedActivity: 'Start with simple greeting and English SVO (Subject + Verb + Object) rule',
      topicsUnderstood: [],
      topicsNeedPractice: [],
      vocabularyLearnedCount: 0,
      vocabularyConfusedCount: 0,
      vocabularyMasteredCount: 0,
      sessionHistory: [],
      commonRecurringMistakes: [],
      sentenceBuildingProgress: {
        chipsModeCompleted: 0,
        typeModeCompleted: 0,
        highestLevel: 'Beginner',
      },
      listeningAndSpeakingProgress: {
        totalSentencesShadowed: 0,
        averagePronunciationScore: 0,
        averageSpeakingScore: 0,
      },
    };

    this.saveActiveProfile(newProfile);
    this.setActiveStudentId(studentId);
    return newProfile;
  }

  /**
   * Current in-memory profile
   */
  public getActiveProfile(): StudentLearningProfile {
    if (!this.activeProfile) {
      return this.loadActiveProfile();
    }
    return this.activeProfile;
  }

  /**
   * Record conclusion of a learning / speaking session
   */
  public recordSessionEnd(summary: Partial<SessionSummary>): void {
    const current = this.getActiveProfile();
    const newSummary: SessionSummary = {
      id: 'sess_' + Date.now(),
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('hi-IN', { month: 'short', day: 'numeric' }),
      topic: summary.topic || current.lastConversationTopic || 'Spoken English Practice',
      durationMinutes: summary.durationMinutes || 8,
      lessonCovered: summary.lessonCovered || current.lastCompletedLesson,
      stoppingPoint: summary.stoppingPoint || current.exactStoppingPoint,
      topicsUnderstood: summary.topicsUnderstood || current.topicsUnderstood.slice(-3),
      topicsNeedPractice: summary.topicsNeedPractice || current.topicsNeedPractice.slice(-3),
      mistakesRecorded: summary.mistakesRecorded || [],
      nextRecommendedActivity: summary.nextRecommendedActivity || current.nextRecommendedActivity,
      notesHi: summary.notesHi || 'सत्र सफलता से पूरा हुआ।',
    };

    const updatedHistory = [newSummary, ...(current.sessionHistory || [])].slice(0, 20);

    const updatedProfile: StudentLearningProfile = {
      ...current,
      lastSessionDate: new Date().toISOString().slice(0, 10),
      lastSessionTimestamp: Date.now(),
      lastCompletedLesson: newSummary.lessonCovered,
      lastConversationTopic: newSummary.topic,
      exactStoppingPoint: newSummary.stoppingPoint,
      nextRecommendedActivity: newSummary.nextRecommendedActivity,
      sessionHistory: updatedHistory,
    };

    this.saveActiveProfile(updatedProfile);
  }

  /**
   * Record a recurring grammar or usage mistake
   */
  public recordMistake(
    original: string,
    corrected: string,
    ruleHi: string,
    category: MistakeRecord['category'] = 'general'
  ): void {
    const current = this.getActiveProfile();
    const cleanOrig = original.trim();
    if (!cleanOrig) return;

    const existingIndex = current.commonRecurringMistakes.findIndex(
      (m) => m.originalText.toLowerCase() === cleanOrig.toLowerCase() || m.correctedText.toLowerCase() === corrected.toLowerCase()
    );

    let updatedMistakes = [...current.commonRecurringMistakes];

    if (existingIndex >= 0) {
      updatedMistakes[existingIndex] = {
        ...updatedMistakes[existingIndex],
        occurrenceCount: updatedMistakes[existingIndex].occurrenceCount + 1,
        timestamp: Date.now(),
        lastPracticedAt: Date.now(),
      };
    } else {
      const newRec: MistakeRecord = {
        id: 'm_' + Date.now(),
        timestamp: Date.now(),
        originalText: cleanOrig,
        correctedText: corrected,
        ruleExplanationHi: ruleHi,
        category,
        occurrenceCount: 1,
        resolved: false,
      };
      updatedMistakes.unshift(newRec);
    }

    updatedMistakes = updatedMistakes.slice(0, 30);

    // Also add to topicsNeedPractice if not present
    let updatedNeedPractice = [...current.topicsNeedPractice];
    const shortLabel = ruleHi.slice(0, 60);
    if (!updatedNeedPractice.some((t) => t.includes(shortLabel.slice(0, 20)))) {
      updatedNeedPractice.unshift(shortLabel);
      updatedNeedPractice = updatedNeedPractice.slice(0, 10);
    }

    this.saveActiveProfile({
      ...current,
      commonRecurringMistakes: updatedMistakes,
      topicsNeedPractice: updatedNeedPractice,
    });
  }

  /**
   * Formatted summary for "Continue Where We Left Off" / "पिछली पढ़ाई से आगे बढ़ें"
   */
  public getResumeContext(): {
    hasHistory: boolean;
    reminderHindi: string;
    lastTopic: string;
    lastLesson: string;
    exactStoppingPoint: string;
    nextStep: string;
    warmupPrompt: string;
  } {
    const p = this.getActiveProfile();
    const hasHistory = (p.sessionHistory && p.sessionHistory.length > 0) || p.lastCompletedLesson !== 'None (शुरुआती स्तर)';

    if (!hasHistory) {
      return {
        hasHistory: false,
        reminderHindi: 'नमस्ते! आज आपकी पहली क्लास है। हम बिल्कुल शुरुआत से आसान अंग्रेज़ी सीखेंगे।',
        lastTopic: 'Welcome & Introduction',
        lastLesson: 'Foundation Basics',
        exactStoppingPoint: 'Ready to start lesson 1',
        nextStep: 'Learn the English SVO (Subject + Verb + Object) rule with a friendly greeting',
        warmupPrompt: 'Hello! I am ready to start my first English lesson today.',
      };
    }

    const lastTopic = p.lastConversationTopic || 'Previous Speaking Lesson';
    const lastLesson = p.lastCompletedLesson || '5 Tenses Practice';
    const stoppingPoint = p.exactStoppingPoint || 'Practicing sentence structure and verb forms';
    const nextStep = p.nextRecommendedActivity || 'Warm-up with a quick practice sentence';

    const reminderHindi = `नमस्ते ${p.studentName}! पिछली क्लास में हमने "${lastTopic}" और "${lastLesson}" पर काम किया था। आपकी पिछली पढ़ाई "${stoppingPoint}" पर रुकी थी। चलिए वहीं से एक छोटे वॉर्म-अप के साथ आगे बढ़ते हैं!`;

    const warmupPrompt = `नमस्ते Teacher! Let's continue from where we left off: "${stoppingPoint}". Please give me a quick warm-up question!`;

    return {
      hasHistory: true,
      reminderHindi,
      lastTopic,
      lastLesson,
      exactStoppingPoint: stoppingPoint,
      nextStep,
      warmupPrompt,
    };
  }

  public subscribe(cb: (profile: StudentLearningProfile) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notifyListeners(): void {
    if (this.activeProfile) {
      this.listeners.forEach((l) => l(this.activeProfile!));
    }
  }
}

export const studentMemoryService = new StudentMemoryService();
