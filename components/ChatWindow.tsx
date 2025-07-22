'use client';

import { Send, Square, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import MessageBubble from '@/components/MessageBubble';
import { Message } from '@/types/chat';
import { useState, useEffect, useRef } from 'react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  onSendMessage: (message: string) => void;
  onStopGeneration: () => void;
}

export default function ChatWindow({
  messages,
  isLoading,
  isStreaming,
  onSendMessage,
  onStopGeneration,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isEmpty && !isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-2xl font-semibold mb-2">
                How can I help you today?
              </div>
              <div className="text-sm">
                Start a conversation by typing a message below.
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Typing indicator */}
            {isStreaming && (
              <div className="flex items-start space-x-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-indigo-300" />
                </div>
                <div className="max-w-2xl">
                  <div className="rounded-lg px-4 py-2 bg-indigo-900 text-indigo-300">
                    <div className="text-sm leading-6 italic animate-pulse">
                      Typing<span className="animate-bounce">...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-indigo-700 bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="resize-none min-h-[44px] max-h-32 bg-gray-800 text-gray-100 border border-indigo-600 focus:border-indigo-400"
                rows={1}
                disabled={isStreaming}
              />
            </div>
            <div className="flex space-x-2">
              {isStreaming ? (
                <Button
                  type="button"
                  onClick={onStopGeneration}
                  size="sm"
                  className="
                    h-11
                    border-indigo-600 text-indigo-600
                    hover:bg-indigo-600 hover:text-white
                    active:bg-indigo-800
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                    transition-colors duration-200
                  "
                >
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="
                  h-11 px-4
                  bg-indigo-600 text-white
                  hover:bg-indigo-800
                  active:bg-indigo-900
                  focus:ring-indigo-500
                  transition-colors duration-200
                  "
                >
                  <Send className="h-5 w-5" />
                </Button>

              )}
            </div>
          </form>
          <div className="text-xs text-gray-400 text-center mt-2">
            Press Enter to send, Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
