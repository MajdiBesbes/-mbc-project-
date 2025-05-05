import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';

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

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notificationTypes, setNotificationTypes] = useState<Record<string, NotificationType>>({});
  const { user } = useAuth();

  const fetchNotificationTypes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notification_types')
        .select('*');

      if (error) throw error;

      const typesMap: Record<string, NotificationType> = {};
      data?.forEach(type => {
        typesMap[type.id] = type;
      });
      
      setNotificationTypes(typesMap);
    } catch (error) {
      console.error('Erreur lors du chargement des types de notifications:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    const success = await notificationService.markAsRead(notificationId);
    
    if (success) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    return success;
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return false;
    
    const success = await notificationService.markAllAsRead(user.id);
    
    if (success) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    }
    
    return success;
  }, [user]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    const success = await notificationService.deleteNotification(notificationId);
    
    if (success) {
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
    
    return success;
  }, [notifications]);

  const deleteAllReadNotifications = useCallback(async () => {
    if (!user) return false;
    
    const success = await notificationService.deleteAllReadNotifications(user.id);
    
    if (success) {
      setNotifications(prev => prev.filter(n => !n.read));
    }
    
    return success;
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotificationTypes();
      fetchNotifications();
      
      // Abonnement aux nouvelles notifications
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, payload => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotificationTypes, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    notificationTypes,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllReadNotifications,
    refresh: fetchNotifications
  };
};