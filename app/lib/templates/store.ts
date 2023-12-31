import { create } from "zustand";

interface PdfStore {
  numPages: number;
  currentPage: number;
  sampleMode: boolean;
  setSampleMode: (sampleMode: boolean) => void;
  setNumPages: (numPages: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const useTemplateStore = create<PdfStore>((set) => ({
  numPages: 1,
  currentPage: 1,
  sampleMode: false,
  setSampleMode: (sampleMode: boolean) => {
    set((state) => ({
      ...state,
      sampleMode,
    }));
  },
  setNumPages: (numPages: number) => {
    set((state) => ({
      ...state,
      numPages,
      currentPage: state.currentPage > numPages ? 1 : state.currentPage,
    }));
  },
  nextPage: () => {
    set((state) => {
      if (state.currentPage + 1 <= state.numPages) {
        return {
          ...state,
          currentPage: state.currentPage + 1,
        };
      }
      return state;
    });
  },
  prevPage: () => {
    set((state) => {
      if (state.currentPage - 1 >= 1) {
        return {
          ...state,
          currentPage: state.currentPage - 1,
        };
      }
      return state;
    });
  },
}));
