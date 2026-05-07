import { createChatCompletion } from '@linode/api-v4';
import React, { useState } from 'react';

import { getExtraPresets, isMSWEnabled } from 'src/dev-tools/utils';

import { type Message, ModelPlaygroundContext } from './ModelPlaygroundContext';

// Placeholder model/provider until these are selectable from the Tuning sidebar.
const MOCK_MODEL = 'gemma-4-31b';
const MOCK_PROVIDER = 'google';

interface Props {
  children: React.ReactNode;
}

export const ModelPlaygroundProvider = ({ children }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      content: trimmed,
      id: crypto.randomUUID(),
      role: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (
      !isMSWEnabled ||
      !getExtraPresets().includes('inferencePlatform:chat-completions')
    ) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await createChatCompletion({
        messages: [...messages, userMessage].map(({ content, role }) => ({
          content,
          role,
        })),
        model: MOCK_MODEL,
        provider: MOCK_PROVIDER,
      });
      const assistantContent = response.choices[0]?.message.content ?? '';
      setMessages((prev) => [
        ...prev,
        {
          content: assistantContent,
          id: crypto.randomUUID(),
          role: 'assistant',
        },
      ]);
    } catch {
      // No response when MSW is not active or the API is unavailable.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModelPlaygroundContext.Provider
      value={{
        inputValue,
        isLoading,
        messages,
        onInputChange: setInputValue,
        onSend,
      }}
    >
      {children}
    </ModelPlaygroundContext.Provider>
  );
};
