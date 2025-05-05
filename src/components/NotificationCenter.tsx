import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, Check, Settings, Calendar, FileText, MessageCircle, Info, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotifications } from '../hooks/useNotifications';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  action_url?: string;
  type_id?: string;
  metadata?: Record<string, any>;
}

interface NotificationType {
  id: string;
  code: string;
  name: string;
  icon: string;
  color: string;
  priority: number;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, loading, notificationTypes, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fermer le dropdown quand on clique en dehors
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
    
    setIsOpen(false);
  }, [markAsRead]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`;
    } else if (isYesterday(date)) {
      return `Hier à ${format(date, 'HH:mm', { locale: fr })}`;
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE à HH:mm', { locale: fr });
    } else {
      return format(date, 'dd MMMM yyyy', { locale: fr });
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.type_id && notificationTypes[notification.type_id]) {
      const type = notificationTypes[notification.type_id];
      switch (type.icon) {
        case 'file-text': return <FileText className="w-5 h-5" />;
        case 'calendar': return <Calendar className="w-5 h-5" />;
        case 'calendar-check': return <Calendar className="w-5 h-5" />;
        case 'message-circle': return <MessageCircle className="w-5 h-5" />;
        case 'alert-circle': return <AlertCircle className="w-5 h-5" />;
        case 'info': return <Info className="w-5 h-5" />;
        case 'check-circle': return <Check className="w-5 h-5" />;
        default: return <Bell className="w-5 h-5" />;
      }
    }

    // Fallback basé sur le type
    switch (notification.type) {
      case 'success': return <Check className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'info':
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (notification: Notification) => {
    if (notification.type_id && notificationTypes[notification.type_id]) {
      const type = notificationTypes[notification.type_id];
      switch (type.color) {
        case 'blue': return 'text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
        case 'green': return 'text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300';
        case 'orange': return 'text-orange-500 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
        case 'red': return 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300';
        case 'gray': return 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
        default: return 'text-primary bg-primary/10 dark:bg-primary/20 dark:text-primary-light';
      }
    }

    // Fallback basé sur le type
    switch (notification.type) {
      case 'success': return 'text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'warning': return 'text-orange-500 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
      case 'error': return 'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'info':
      default: return 'text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-white transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Vous n'avez pas de notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-3 ${getNotificationColor(notification)}`}>
                        {getNotificationIcon(notification)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <a
              href="/espace-client?tab=notifications"
              className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Gérer les préférences de notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;