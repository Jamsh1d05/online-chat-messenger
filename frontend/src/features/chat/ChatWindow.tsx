import React, { useEffect, useState, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MessageBubble from './MessageBubble';
import api from '../../services/api';

interface Chat {
    id: number;
    title: string;
}

interface Message {
    id?: number;
    chat_id: number;
    from_user: number;
    sender_id?: number; // Backend schema has sender_id, WS might have from_user. Normalizing...
    content?: string; // Backend schema
    message?: string; // WS schema
    created_at?: string;
}

interface ChatWindowProps {
    chat: Chat;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat }) => {
    const { token, user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);


    // WebSocket URL: ws://host/ws/chat?token=...
    const socketUrl = `ws://localhost:8000/ws/chat?token=${token}`;

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: (_closeEvent) => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });

    // Fetch history when chat changes
    useEffect(() => {
        if (chat.id) {
            setLoadingHistory(true);
            api.get(`/chats/${chat.id}`)
                .then(res => {
                    // res.data.messages contains history
                    // Need to normalize keys if needed
                    const history = res.data.messages.map((m: any) => ({
                        ...m,
                        message: m.content, // Map content to message for unified display
                        from_user: m.sender_id
                    }));
                    setMessages(history);
                })
                .catch(err => console.error(err))
                .finally(() => setLoadingHistory(false));
        }
    }, [chat.id]);

    const [loadingHistory, setLoadingHistory] = useState(false);

    // Handle incoming WS messages
    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const data = JSON.parse(lastMessage.data);
                // Check if message belongs to current chat
                if (data.chat_id === chat.id) {
                    setMessages((prev) => [...prev, data]);
                }
            } catch (e) {
                console.error("Parse error", e);
            }
        }
    }, [lastMessage, chat.id]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Send via WebSocket
        // Format: { chat_id: int, message: str }
        const payload = {
            chat_id: chat.id,
            message: input
        };
        sendMessage(JSON.stringify(payload));
        setInput('');
        // Optimistic update? No, wait for echo or just rely on WS echo
        // The WS implementation broadcasts to all participants including sender.
        // So we just wait for it to come back in 'lastMessage'
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-background/50 backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 border-b border-border bg-card/50">
                <h3 className="font-bold text-lg">{chat.title || `Chat #${chat.id}`}</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {loadingHistory && <p className="text-center text-muted-foreground">Loading history...</p>}

                {messages.map((msg, idx) => {
                    const content = msg.message || msg.content || "";
                    // Use from_user (WS) or sender_id (API)
                    const senderId = msg.from_user || msg.sender_id;
                    const isMe = senderId === user?.id;

                    return (
                        <MessageBubble
                            key={idx}
                            content={content}
                            isMe={isMe}
                            timestamp={msg.created_at}
                            // We don't have sender username here easily without another lookup 
                            // or modifying backend to send username.
                            // For now, omit or use ID.
                            senderName={!isMe ? `User ${senderId}` : undefined}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-secondary rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                        type="submit"
                        disabled={readyState !== ReadyState.OPEN}
                        className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
