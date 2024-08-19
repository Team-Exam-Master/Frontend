import { create } from "zustand";

const useMessage = create((set) => ({
  messages: [], // 초기 메시지 상태

  // 메시지 배열 자체를 바꾸는 함수
  setMessages: (newMessages) => set({ messages: newMessages }),

  // 메시지에 새 메시지를 추가하는 함수
  addMessage: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
  // 모든 메시지를 제거하는 함수
  removeAllMessage: () => set({ messages: [] }),
}));

export default useMessage;
