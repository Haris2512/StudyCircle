import { useState, useEffect, useRef } from 'react';
import { socketService } from '../../../utils/socket';
import { groupsApi } from '../../../api/groups.api';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../common/Button';
import { Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  studyGroupId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    role: string;
    level: number;
  };
}

interface GroupChatProps {
  groupId: string;
}

export function GroupChat({ groupId }: GroupChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load historical messages
    const loadMessages = async () => {
      try {
        const res = await groupsApi.getGroupChats(groupId);
        setMessages(res.data || []);
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();

    // Setup Socket
    socketService.connect();
    socketService.joinGroup(groupId);

    socketService.onNewMessage((message: ChatMessage) => {
      if (message.studyGroupId === groupId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketService.leaveGroup(groupId);
      socketService.offNewMessage();
      // Only disconnect if leaving page, handled globally usually, but safe to just leave group
    };
  }, [groupId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    socketService.sendMessage(groupId, user.id, newMessage.trim());
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Belum ada pesan. Mulai obrolan sekarang!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${
                  isMe ? 'items-end self-end ml-auto' : 'items-start'
                }`}
              >
                {!isMe && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1 flex items-center gap-1">
                    {msg.user.fullName}
                    <span className="px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[10px] font-bold">
                      Lv.{msg.user.level}
                    </span>
                  </span>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isMe
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mx-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-dark-bg hover:from-primary-400 hover:to-secondary-pink transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(203,166,247,0.4)]"
          aria-label="Kirim pesan"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
