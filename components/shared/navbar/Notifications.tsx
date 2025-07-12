"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { getNotifications, markAllAsRead } from "@/lib/actions/notification.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const Notifications = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      if (!userId) return;
      const notifs = await getNotifications(userId);
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications(); // Initial fetch
    
    const interval = setInterval(() => {
        fetchNotifications();
    }, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(userId);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const getNotificationLink = (notification: any) => {
    return `/question/${notification.question._id}#${notification.answer?._id || ''}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-none">
        <div className="relative group transition-transform duration-300 hover:scale-110">
          <Bell className="h-6 w-6 text-emerald-700 dark:text-emerald-300 transition-all duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-200" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-20" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 w-80 glass-morphism-emerald border-emerald-200/30 dark:border-emerald-700/30 shadow-2xl animate-fade-in-up" align="end">
        <DropdownMenuLabel className="flex justify-between items-center px-4 py-2">
          <span className="font-bold text-emerald-800 dark:text-emerald-200">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-emerald-200/50 dark:bg-emerald-700/50" />
        
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification._id} asChild className={`cursor-pointer transition-colors ${
                !notification.read ? 'bg-emerald-50/50 dark:bg-emerald-900/30' : ''
              }`}>
                <Link href={getNotificationLink(notification)}>
                  <div className="flex items-start gap-3 p-2">
                    <img src={notification.trigger.picture} alt="triggerer" className="h-10 w-10 rounded-full" />
                    <div className="flex flex-col">
                      <p className="text-sm text-emerald-800 dark:text-emerald-200 line-clamp-2">
                        <span className="font-semibold">{notification.trigger.name}</span>
                        {notification.type === 'new_answer' ? ' answered your question: ' : ' replied to an answer on: '}
                        <span className="font-semibold italic">"{notification.question.title}"</span>
                      </p>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-emerald-700 dark:text-emerald-300">
              You have no new notifications.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications; 