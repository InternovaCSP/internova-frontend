import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState(null);
    const connectionStartedRef = useRef(false);

    const fetchNotifications = useCallback(async (page = 1, pageSize = 10) => {
        setLoading(true);
        try {
            const response = await notificationService.getNotifications(page, pageSize);
            setNotifications(response.data.items);
            setUnreadCount(response.data.unreadCount);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED' || error.message === 'Request aborted') {
                return;
            }
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // SignalR Connection Setup
    useEffect(() => {
        const token = localStorage.getItem('internova_token');
        if (!token || connectionStartedRef.current) return;

        const newConnection = new HubConnectionBuilder()
            .withUrl('/api/hubs/notifications', {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(newConnection);
        connectionStartedRef.current = true;

        return () => {
            if (newConnection) {
                newConnection.stop();
                connectionStartedRef.current = false;
            }
        };
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to Notification Hub');
                    
                    connection.on('ReceiveNotification', (notification) => {
                        setNotifications(prev => [notification, ...prev].slice(0, 20)); // Keep first 20 in state
                        setUnreadCount(prev => prev + 1);
                        setTotalCount(prev => prev + 1);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    // Initial fetch
    useEffect(() => {
        const token = localStorage.getItem('internova_token');
        if (token) {
            fetchNotifications();
        }
    }, [fetchNotifications]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            totalCount,
            loading,
            fetchNotifications,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
