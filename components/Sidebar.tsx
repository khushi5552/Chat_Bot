'use client';

import { Plus, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Chat } from '@/types/chat';
import { formatDistanceToNow, isToday, isYesterday, format, subDays } from 'date-fns';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string | null) => void;
  onNewChat: () => void;
  refreshChats: () => void;
}

const formatChatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  if (isToday(date)) return format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday';
  const dayBeforeYesterday = subDays(now, 2);
  if (format(date, 'yyyy-MM-dd') === format(dayBeforeYesterday, 'yyyy-MM-dd'))
    return 'Day before yesterday';
  if (date.getFullYear() === now.getFullYear()) return format(date, 'MMM d');
  return format(date, 'MMM d, yyyy');
};

export default function Sidebar({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  refreshChats,
}: SidebarProps) {
  const handleDelete = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${chatId}`, {
      method: 'DELETE',
    });
    onChatSelect(null);
    refreshChats();
  };

  const handleRename = async (chatId: string) => {
    const newTitle = prompt('Enter new chat title:');
    if (!newTitle) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${chatId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    refreshChats();
  };

  return (
    <div className="w-64 bg-gray-900 text-gray-300 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <Button
          onClick={onNewChat}
          className="w-full bg-transparent border border-indigo-600 hover:bg-indigo-700 text-indigo-400 hover:text-white transition-colors duration-200"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors flex items-start space-x-2 group ${
                currentChatId === chat.id
                  ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-500/40'
                  : 'text-gray-400 hover:bg-indigo-600 hover:text-white'
              }`}
            >
              <MessageSquare className="h-5 w-5 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate">{chat.title}</span>
                  <div className="flex space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition">
                    <Pencil
                      className="h-4 w-4 text-gray-400 hover:text-yellow-400 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRename(chat.id);
                      }}
                    />
                    <Trash2
                      className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(chat.id);
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatChatTime(chat.updated_at)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 text-center text-xs text-gray-500">
        Local ChatBot App
      </div>
    </div>
  );
}
