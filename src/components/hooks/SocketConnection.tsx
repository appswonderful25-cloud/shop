'use client';
import { useEffect, createContext, useState, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socketContext = createContext<{ socket: Socket | null; connected: boolean }>({ socket: null, connected: false });

export default function SocketConnection({ token, children }: { token: string; children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!token) return;

        let socketCon: Socket | null = null;

        try {
            const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:1337";

            socketCon = io(socketUrl, {
                withCredentials: true,
                transports: ["websocket", "polling"],
                auth: { token: "" },
                reconnection: true,
                reconnectionAttempts: 3,
                reconnectionDelay: 2000,
                timeout: 5000,
            });

            socketCon.on('connect', () => {
                setConnected(true);
            });

            socketCon.on('disconnect', () => {
                setConnected(false);
            });

            socketCon.on('connect_error', () => {
                setConnected(false);
            });

            setSocket(socketCon);
        } catch {
            setConnected(false);
        }

        return () => {
            if (socketCon) {
                socketCon.disconnect();
            }
        };
    }, [token]);

    return <socketContext.Provider value={{ socket, connected }}>{children}</socketContext.Provider>;
}

export const useSocket = () => useContext(socketContext);