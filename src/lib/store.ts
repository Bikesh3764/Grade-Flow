import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/utils/supabase/client';
import { GlobalScale } from './universities/types';

export type Course = {
  id: string;
  name: string;
  credits: number;
  grade: string;
  points?: number;
};

export type Semester = {
  id: string;
  name: string;
  courses: Course[];
  sgpa?: number;
  totalCredits?: number;
};

export type UserProfile = {
  universityId: string | null;
  regulationId: string | null;
  activeScaleId: string; // 'university-default' or global/custom scale id
  customScales: GlobalScale[];
  targetCgpa: number | null;
  semesters: Semester[];
  name: string;
  email: string;
  preferences: {
    institutionalSync: boolean;
    privacyMode: boolean;
    notifications: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'compact' | 'standard' | 'large';
  };
};

interface AppState {
  profile: UserProfile;
  setUniversity: (universityId: string, regulationId: string) => void;
  setActiveScale: (scaleId: string) => void;
  addCustomScale: (scale: GlobalScale) => void;
  removeCustomScale: (scaleId: string) => void;
  setTargetCgpa: (target: number) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPreferences: (prefs: Partial<UserProfile['preferences']>) => void;
  setDisplay: (display: Partial<UserProfile['display']>) => void;
  addSemester: (semester: Semester) => void;
  updateSemester: (id: string, semester: Partial<Semester>) => void;
  removeSemester: (id: string) => void;
  clearData: () => void;
  clearUniversity: () => void;
}

const initialState: UserProfile = {
  universityId: null,
  regulationId: null,
  activeScaleId: 'university-default',
  customScales: [],
  targetCgpa: null,
  semesters: [],
  name: "Student",
  email: "student@university.edu",
  preferences: {
    institutionalSync: true,
    privacyMode: false,
    notifications: true,
  },
  display: {
    theme: 'light',
    fontSize: 'standard',
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: initialState,
      setUniversity: (universityId, regulationId) =>
        set((state) => ({
          profile: { ...state.profile, universityId, regulationId, activeScaleId: 'university-default' },
        })),
      setActiveScale: (scaleId) =>
        set((state) => ({
          profile: { ...state.profile, activeScaleId: scaleId },
        })),
      addCustomScale: (scale) =>
        set((state) => ({
          profile: {
            ...state.profile,
            customScales: [...state.profile.customScales, scale],
          },
        })),
      removeCustomScale: (scaleId) =>
        set((state) => ({
          profile: {
            ...state.profile,
            customScales: state.profile.customScales.filter((s) => s.id !== scaleId),
          },
        })),
      setTargetCgpa: (targetCgpa) =>
        set((state) => ({
          profile: { ...state.profile, targetCgpa },
        })),
      setName: (name) =>
        set((state) => ({
          profile: { ...state.profile, name },
        })),
      setEmail: (email) =>
        set((state) => ({
          profile: { ...state.profile, email },
        })),
      setPreferences: (prefs) =>
        set((state) => ({
          profile: {
            ...state.profile,
            preferences: { ...state.profile.preferences, ...prefs },
          },
        })),
      setDisplay: (display) =>
        set((state) => ({
          profile: {
            ...state.profile,
            display: { ...state.profile.display, ...display },
          },
        })),
      addSemester: (semester) =>
        set((state) => ({
          profile: {
            ...state.profile,
            semesters: [...state.profile.semesters, semester],
          },
        })),
      updateSemester: (id, updatedFields) =>
        set((state) => ({
          profile: {
            ...state.profile,
            semesters: state.profile.semesters.map((sem) =>
              sem.id === id ? { ...sem, ...updatedFields } : sem
            ),
          },
        })),
      removeSemester: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            semesters: state.profile.semesters.filter((sem) => sem.id !== id),
          },
        })),
      clearData: () => set({ profile: initialState }),
      clearUniversity: () => set((state) => ({ profile: { ...state.profile, universityId: null, regulationId: null } })),
    }),
    {
      name: 'gradeflow-storage',
    }
  )
);

// Auto-save logic
const supabase = createClient();
let saveTimeout: NodeJS.Timeout;

useAppStore.subscribe((state, prevState) => {
  if (state.profile === prevState.profile) return;
  
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    // Check if Supabase URL is available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    
    // Sync University Preferences
    if (state.profile.universityId !== prevState.profile.universityId ||
        state.profile.regulationId !== prevState.profile.regulationId ||
        state.profile.activeScaleId !== prevState.profile.activeScaleId) {
      await supabase.from('university_preferences').upsert({
        user_id: session.user.id,
        university_id: state.profile.universityId,
        regulation_id: state.profile.regulationId,
        active_scale_id: state.profile.activeScaleId,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    }

    // Sync Semesters (We upsert them all here for simplicity, assuming IDs are UUIDs or unique strings)
    if (state.profile.semesters !== prevState.profile.semesters) {
      for (const sem of state.profile.semesters) {
        await supabase.from('semesters').upsert({
          id: sem.id,
          user_id: session.user.id,
          semester_number: parseInt(sem.name.replace(/[^0-9]/g, '') || '1'),
          sgpa: sem.sgpa,
          credits: sem.totalCredits,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      }
    }
  }, 1000);
});
