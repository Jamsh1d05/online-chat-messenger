import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface MessageBubbleProps {
    isMe: boolean;
    content: string;
    senderName?: string;
    timestamp?: string; // or Date
}

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ isMe, content, senderName, timestamp }) => {
    return (
        <div className={cn("flex w-full mb-4", isMe ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "max-w-[70%] p-4 rounded-2xl shadow-sm",
                    isMe
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-secondary text-secondary-foreground rounded-tl-none"
                )}
            >
                {!isMe && senderName && (
                    <p className="text-xs font-semibold mb-1 opacity-70">{senderName}</p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                {timestamp && (
                    <p className="text-[10px] mt-1 opacity-50 text-right">
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
