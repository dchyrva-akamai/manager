import React from 'react';

export interface Message {
  content: string;
  id: string;
  role: 'assistant' | 'user';
}

export interface ModelPlaygroundContextValue {
  inputValue: string;
  isLoading: boolean;
  messages: Message[];
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export const ModelPlaygroundContext =
  React.createContext<ModelPlaygroundContextValue>({
    inputValue: '',
    isLoading: false,
    messages: [],
    onInputChange: () => undefined,
    onSend: () => undefined,
  });
