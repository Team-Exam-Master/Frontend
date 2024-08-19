import { create } from "zustand";

const useHistory = create((set) => ({
  selectedHistoryId: "",
  histories: [],

  setSelectedHistoryId: (newHistoryId) =>
    set({ selectedHistoryId: newHistoryId }),

  addHistory: (newHistory) =>
    set((state) => ({
      histories: [...state.histories, newHistory],
    })),

  setHistories: (newHistories) => set({ histories: newHistories }),

  deleteHistory: (historyId) =>
    set((state) => ({
      histories: state.histories.filter(
        (history) => history.historyId !== historyId
      ),
    })),
}));

export default useHistory;
