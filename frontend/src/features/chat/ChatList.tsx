import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { MessageSquare, Users, Plus, Search, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface User {
    id: number;
    username: string;
}

interface Chat {
    id: number;
    title: string;
    is_group?: boolean;
    participants?: User[];
}

interface ChatListProps {
    onSelectChat: (chat: Chat) => void;
    selectedChatId?: number;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
    const { user: currentUser } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);

    // Data States
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Group Creation State
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

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

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users/');
            setAllUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const openGroupModal = () => {
        fetchUsers();
        setShowGroupModal(true);
        setSelectedUsers([]);
        setGroupName('');
    };

    const openSearchModal = () => {
        fetchUsers();
        setShowSearchModal(true);
        setSearchQuery('');
    };

    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length === 0) return;
        try {
            const res = await api.post('/chats/', {
                title: groupName,
                is_group: true,
                participant_ids: selectedUsers
            });
            setChats([res.data, ...chats]);
            setShowGroupModal(false);
        } catch (err) {
            alert("Failed to create group");
        }
    };

    const handleStartPrivateChat = async (targetUserId: number) => {
        try {
            // Check if chat already exists locally (optimization)
            // Ideally backend should handle "get or create" logic for 1-on-1
            // For now, just create new.
            const res = await api.post('/chats/', {
                is_group: false,
                participant_ids: [targetUserId]
            });

            // Allow duplicates for now or backend handles it? 
            // Assuming acceptable behavior.
            setChats([res.data, ...chats]);
            setShowSearchModal(false);
            onSelectChat(res.data);
        } catch (err) {
            alert("Failed to start chat");
        }
    };

    const getChatTitle = (chat: Chat) => {
        if (chat.is_group) return chat.title;
        // Find other participant
        const other = chat.participants?.find(p => p.id !== currentUser?.id);
        return other ? other.username : (chat.title || "Chat");
    };

    const filteredUsers = allUsers.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        u.id !== currentUser?.id
    );

    return (
        <div className="w-80 border-r border-border h-full flex flex-col bg-card/50 backdrop-blur-sm relative">
            {/* Header Actions */}
            <div className="p-4 border-b border-border space-y-3">
                <h2 className="font-semibold text-lg">Messages</h2>
                <div className="flex gap-2">
                    <button
                        onClick={openGroupModal}
                        className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground text-sm py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                        <Users size={16} /> New Group
                    </button>
                    <button
                        onClick={openSearchModal}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                        <UserPlus size={16} /> New Chat
                    </button>
                </div>
            </div>

            {/* Chat List */}
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
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                {chat.is_group ? <Users size={20} /> : <MessageSquare size={20} />}
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium truncate">{getChatTitle(chat)}</p>
                                <p className="text-xs text-muted-foreground truncate">Click to open</p>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Modal: Create Group */}
            {showGroupModal && (
                <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-50 p-4 flex flex-col animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Create Group</h3>
                        <button onClick={() => setShowGroupModal(false)} className="text-muted-foreground hover:text-foreground">Cancel</button>
                    </div>

                    <input
                        placeholder="Group Name"
                        className="w-full bg-secondary p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />

                    <div className="text-sm font-medium mb-2 text-muted-foreground">Select Members:</div>
                    <div className="flex-1 overflow-y-auto space-y-1 mb-4 border border-border rounded-md p-2">
                        {allUsers.filter(u => u.id !== currentUser?.id).map(u => (
                            <div
                                key={u.id}
                                onClick={() => setSelectedUsers(prev => prev.includes(u.id) ? prev.filter(i => i !== u.id) : [...prev, u.id])}
                                className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${selectedUsers.includes(u.id) ? 'bg-primary/20' : 'hover:bg-secondary'}`}
                            >
                                <span>{u.username}</span>
                                {selectedUsers.includes(u.id) && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleCreateGroup}
                        disabled={!groupName || selectedUsers.length === 0}
                        className="w-full bg-primary text-primary-foreground p-3 rounded-md disabled:opacity-50 font-medium"
                    >
                        Create Group
                    </button>
                </div>
            )}

            {/* Modal: Search User (New Chat) */}
            {showSearchModal && (
                <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-50 p-4 flex flex-col animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">New Chat</h3>
                        <button onClick={() => setShowSearchModal(false)} className="text-muted-foreground hover:text-foreground">Cancel</button>
                    </div>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <input
                            placeholder="Search users..."
                            className="w-full bg-secondary p-2 pl-9 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1">
                        {filteredUsers.map(u => (
                            <button
                                key={u.id}
                                onClick={() => handleStartPrivateChat(u.id)}
                                className="w-full text-left p-3 rounded-md hover:bg-secondary flex items-center gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                                    {u.username[0].toUpperCase()}
                                </div>
                                <span className="font-medium">{u.username}</span>
                            </button>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm mt-4">No users found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatList;
