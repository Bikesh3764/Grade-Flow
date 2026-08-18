import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  activeScaleId: string;
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

function createInitialState(): UserProfile {
  return {
    universityId: null,
    regulationId: null,
    activeScaleId: 'university-default',
    customScales: [],
    targetCgpa: null,
    semesters: [],
    name: 'Student',
    email: 'student@university.edu',
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
}

function migrateProfile(profile: Partial<UserProfile> | undefined): UserProfile {
  const defaults = createInitialState();
  return {
    ...defaults,
    ...profile,
    customScales: Array.isArray(profile?.customScales) ? profile.customScales : [],
    semesters: Array.isArray(profile?.semesters) ? profile.semesters : [],
    preferences: {
      ...defaults.preferences,
      ...(profile?.preferences ?? {}),
    },
    display: {
      ...defaults.display,
      ...(profile?.display ?? {}),
    },
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: createInitialState(),
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
            customScales: [...state.profile.customScales.filter((s) => s.id !== scale.id), scale],
          },
        })),
      removeCustomScale: (scaleId) =>
        set((state) => ({
          profile: {
            ...state.profile,
            activeScaleId: state.profile.activeScaleId === scaleId ? 'university-default' : state.profile.activeScaleId,
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
      clearData: () => set({ profile: createInitialState() }),
      clearUniversity: () => set((state) => ({
        profile: {
          ...state.profile,
          universityId: null,
          regulationId: null,
          activeScaleId: 'university-default',
        },
      })),
    }),
    {
      name: 'gradeflow-storage',
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as { profile?: Partial<UserProfile> } | undefined;
        return { profile: migrateProfile(state?.profile) };
      },
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
