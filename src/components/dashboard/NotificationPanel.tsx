\"use client\";

import { useState } from \"react\";
import { Bell, X, Check, CheckCheck, Trash2, Trophy, Zap, BookOpen, Flame } from \"lucide-react\";

export interface Notification {
  id: string;
  type: \"achievement\" | \"xp\" | \"streak\" | \"lesson\" | \"system\";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Props {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}

const typeIcons = {
  achievement: { icon: Trophy, color: \"#f59e0b\", bg: \"#fef3c7\" },
  xp: { icon: Zap, color: \"#3b82f6\", bg: \"#dbeafe\" },
  streak: { icon: Flame, color: \"#ef4444\", bg: \"#fecaca\" },
  lesson: { icon: BookOpen, color: \"#10b981\", bg: \"#d1fae5\" },
  system: { icon: Bell, color: \"#8b5cf6\", bg: \"#ede9fe\" },
};

export default function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onDismiss }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className=\"relative\">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=\"relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition\"
      >
        <Bell className=\"w-5 h-5 text-gray-600\" />
        {unreadCount > 0 && (
          <span className=\"absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center\">
            {unreadCount > 9 ? \"9+\" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className=\"absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden\">
          <div className=\"flex items-center justify-between px-4 py-3 border-b border-gray-100\">
            <h3 className=\"text-sm font-bold text-gray-900\">Thong bao</h3>
            <div className=\"flex items-center gap-2\">
              {unreadCount > 0 && (
                <button onClick={onMarkAllRead} className=\"text-xs text-blue-500 hover:underline flex items-center gap-1\">
                  <CheckCheck className=\"w-3 h-3\" /> Doc tat ca
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className=\"w-6 h-6 flex items-center justify-center\">
                <X className=\"w-4 h-4 text-gray-400\" />
              </button>
            </div>
          </div>

          <div className=\"max-h-80 overflow-y-auto\">
            {notifications.length === 0 ? (
              <div className=\"p-6 text-center text-gray-400 text-sm\">
                Khong co thong bao nao
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => {
                const typeInfo = typeIcons[n.type];
                const Icon = typeInfo.icon;
                return (
                  <div
                    key={n.id}
                    className={\"flex gap-3 px-4 py-3 border-b border-gray-50 transition \" + (!n.read ? \"bg-blue-50/50\" : \"\")}
                    onClick={() => onMarkRead(n.id)}
                  >
                    <div
                      className=\"w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0\"
                      style={{ background: typeInfo.bg }}
                    >
                      <Icon className=\"w-4 h-4\" style={{ color: typeInfo.color }} />
                    </div>
                    <div className=\"flex-1 min-w-0\">
                      <p className={\"text-xs \" + (n.read ? \"text-gray-600\" : \"text-gray-900 font-semibold\")}>{n.title}</p>
                      <p className=\"text-[11px] text-gray-400 mt-0.5 truncate\">{n.message}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }} className=\"text-gray-300 hover:text-red-400\">
                      <Trash2 className=\"w-3.5 h-3.5\" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}