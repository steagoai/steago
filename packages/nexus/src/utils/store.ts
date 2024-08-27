import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// PlatformStore type
interface PlatformStore {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearWorkspaceSession: () => void;
  chatNewThreads: Record<string, { createdAt: number }>;
  setChatNewThread: (newThreadUUID: string) => void;
  removeChatNewThread: (threadUUID: string) => void;
  cleanUpStaleNewThreads: (seconds: number) => void;
}

export const usePlatformStore = create<PlatformStore>()(
  persist(
    immer((set) => ({
      // Auth tokens
      accessToken: null,
      refreshToken: null,
      setAccessToken: (accessToken: string) =>
        set((state: PlatformStore) => {
          state.accessToken = accessToken;
        }),
      setRefreshToken: (refreshToken: string) =>
        set((state: PlatformStore) => {
          state.refreshToken = refreshToken;
        }),
      clearWorkspaceSession: () =>
        set((state: PlatformStore) => {
          state.accessToken = null;
          state.refreshToken = null;
        }),
      // Chat threads
      chatNewThreads: {},
      setChatNewThread: (newThreadUUID: string) =>
        set((state: PlatformStore) => {
          state.chatNewThreads[newThreadUUID] = {
            createdAt: Date.now(),
          };
        }),
      removeChatNewThread: (threadUUID: string) =>
        set((state: PlatformStore) => {
          delete state.chatNewThreads[threadUUID];
        }),
      cleanUpStaleNewThreads: (seconds: number) =>
        set((state: PlatformStore) => {
          const now = Date.now();
          Object.keys(state.chatNewThreads).forEach((threadUUID) => {
            if (
              now - state.chatNewThreads[threadUUID].createdAt >
              seconds * 1000
            ) {
              console.debug(`Cleaning up stale new thread -> ${threadUUID}`);
              delete state.chatNewThreads[threadUUID];
            }
          });
        }),
    })),
    {
      name: 'steago.platform.store', // name of the item in the storage (must be unique)
    }
  )
);

interface PlatformSessionStore {
  currentWorkspaceUUID: string | null;
  setCurrentWorkspaceUUID: (workspaceUUID: string | null) => void;
  clearWorkspaceSession: () => void;
}

export const usePlatformSessionStore = create<PlatformSessionStore>()(
  immer((set, get) => ({
    currentWorkspaceUUID: null,
    setCurrentWorkspaceUUID: (workspaceUUID: string | null) => {
      if (workspaceUUID) {
        set((state) => {
          state.currentWorkspaceUUID = workspaceUUID;
        });
      }
    },
    clearWorkspaceSession: () => {
      set((state) => {
        state.currentWorkspaceUUID = null;
      });
    },
  }))
);
