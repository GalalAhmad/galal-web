'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (user.phone) params.append('phone', user.phone);
      if (user.email) params.append('email', user.email);

      const res = await fetch(`/api/notifications?${params.toString()}`);
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // 1 minute poll
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markAll: true,
          phone: user?.phone,
          email: user?.email,
        }),
      });
    } catch (e) {}
  };

  const markSingleRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {}
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 sm:p-2.5 rounded-full text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
        aria-label="الإشعارات"
        title="مركز الإشعارات والتنبيهات"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 w-4 h-4 bg-[#CC4E46] text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '+9' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#161F2B] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden text-right animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-[#111722] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#4E7E76]" />
              <h4 className="text-xs font-black text-slate-900 dark:text-white">الإشعارات والتحديثات</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#CC4E46]/10 text-[#CC4E46] text-[10px] font-bold">
                  {unreadCount} جديد
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-[#4E7E76] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>تحديد الكل كمقروء</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                لا توجد إشعارات جديدة حالياً
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markSingleRead(notif.id)}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer space-y-1 ${
                    !notif.isRead ? 'bg-[#EDF7F5]/50 dark:bg-[#112924]/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {notif.title}
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#4E7E76] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notif.createdAt).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {notif.link && (
                      <Link
                        href={notif.link}
                        onClick={() => setIsOpen(false)}
                        className="text-[10px] font-bold text-[#154F9C] hover:underline flex items-center gap-1"
                      >
                        <span>عرض</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#111722] text-center border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#4E7E76] transition"
            >
              الانتقال لملفي الشخصي الكامل ←
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
