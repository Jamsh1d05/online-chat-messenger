import { useState } from 'react';
import ChatList from '../features/chat/ChatList';
import ChatWindow from '../features/chat/ChatWindow';

interface Chat {
    id: number;
    title: string;
}

const Home = () => {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

            <ChatList
                onSelectChat={setSelectedChat}
                selectedChatId={selectedChat?.id}
            />

            {selectedChat ? (
                <ChatWindow chat={selectedChat} />
            ) : (
                <div className="flex-1 flex items-center justify-center flex-col text-muted-foreground bg-background/50 backdrop-blur-sm p-8">
                    <h2 className="text-2xl font-light mb-2">Select a chat to start messaging</h2>
                    <p className="opacity-70">Choose from your existing conversations or create a new group.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
