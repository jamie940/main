import create from 'zustand';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
