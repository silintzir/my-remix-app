import { create } from "zustand";

interface WebsiteStore {
  contactModalOpen: boolean;
  setContactModalOpen: (open: boolean) => void;
  thankYouModalOpen: boolean;
  setThankYouModalOpen: (open: boolean) => void;
}

export const useWebsiteStore = create<WebsiteStore>()((set) => ({
  contactModalOpen: false,
  thankYouModalOpen: false,
  setContactModalOpen: (open) => {
    set((state) => ({
      ...state,
      contactModalOpen: open,
    }));
  },
  setThankYouModalOpen: (open) => {
    set((state) => ({
      ...state,
      thankYouModalOpen: open,
    }));
  },
}));
