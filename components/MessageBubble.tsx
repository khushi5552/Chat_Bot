'use client';

import { User, Bot } from 'lucide-react';
import { Message } from '@/types/chat';
import { formatDistanceToNow, isToday, isYesterday, format, subDays } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }

  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'h:mm a')}`;
  }

  const dayBeforeYesterday = subDays(now, 2);
  if (format(date, 'yyyy-MM-dd') === format(dayBeforeYesterday, 'yyyy-MM-dd')) {
    return `Day before yesterday ${format(date, 'h:mm a')}`;
  }

  if (date.getFullYear() === now.getFullYear()) {
    return format(date, 'MMM d, h:mm a');
  }

  return format(date, 'MMM d, yyyy h:mm a');
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">
          <Bot className="h-5 w-5 text-indigo-300" />
        </div>
      )}

      <div className={`max-w-2xl ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-4 py-2 shadow-sm ${
            isUser
              ? 'bg-indigo-600 text-white ml-auto shadow-indigo-500/40'
              : 'bg-gray-700 text-gray-200 shadow-gray-600'
          }`}
        >
          <div className="text-sm leading-6 whitespace-pre-wrap">
            {message.content}
          </div>
        </div>

        <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatMessageTime(message.timestamp)}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-indigo-300" />
        </div>
      )}
    </div>
  );
}
