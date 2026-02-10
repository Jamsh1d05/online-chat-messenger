import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { MessageSquare, Users, Plus } from 'lucide-react';

interface Chat {
    id: number;
    title: string;
    is_group?: boolean;
}

interface ChatListProps {
    onSelectChat: (chat: Chat) => void;
    selectedChatId?: number;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await api.get('/chats/');
            setChats(res.data);
        } catch (error) {
            console.error("Failed to fetch chats", error);
        } finally {
            setLoading(false);
        }
    };

    const createGroup = async () => {
        // Simple prompt for now, usually a modal
        const title = prompt("Enter Group Name:");
        if (!title) return;
        try {
            const res = await api.post('/chats/', { title });
            setChats([res.data, ...chats]);
        } catch (err) {
            alert("Failed to create chat");
        }
    };

    return (
        <div className="w-80 border-r border-border h-full flex flex-col bg-card/50 backdrop-blur-sm">
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h2 className="font-semibold text-lg">Messages</h2>
                <button onClick={createGroup} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {loading ? (
                    <div className="text-center text-muted-foreground p-4">Loading...</div>
                ) : chats.length === 0 ? (
                    <div className="text-center text-muted-foreground p-4">No chats yet. Start one!</div>
                ) : (
                    chats.map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => onSelectChat(chat)}
                            className={`w-full text-left p-3 rounded-xl transition-all hover:bg-secondary/50 flex items-center gap-3 ${selectedChatId === chat.id ? 'bg-secondary ring-1 ring-border' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {chat.is_group ? <Users size={20} /> : <MessageSquare size={20} />}
                            </div>
                            <div>
                                <p className="font-medium truncate">{chat.title || `Chat #${chat.id}`}</p>
                                <p className="text-xs text-muted-foreground truncate">Click to open</p>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;
