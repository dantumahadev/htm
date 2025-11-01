
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useLocalization } from '../hooks/useLocalization';
import type { Conversation, ChatMessage } from '../types';

const ChatPage: React.FC = () => {
    const { 
        currentUser, 
        conversations, 
        sendMessage,
        startChatWith,
        clearStartChat,
        createOrSelectConversation,
        t 
    } = useContext(AppContext)!;
    
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (startChatWith) {
            const newConvId = createOrSelectConversation(startChatWith);
            if (newConvId) {
                setSelectedConversationId(newConvId);
            }
            clearStartChat();
        } else if (!selectedConversationId && conversations.length > 0) {
            setSelectedConversationId(conversations[0].id);
        }
    }, [startChatWith, createOrSelectConversation, clearStartChat, conversations, selectedConversationId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [selectedConversationId, conversations]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversationId) {
            sendMessage(selectedConversationId, newMessage);
            setNewMessage('');
        }
    };

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    const ConversationItem: React.FC<{ conv: Conversation }> = ({ conv }) => {
        const otherParticipantId = conv.participantIds.find(id => id !== currentUser?.id)!;
        const otherParticipant = conv.participants[otherParticipantId];
        const lastMessage = conv.messages[conv.messages.length - 1];

        return (
            <button
                onClick={() => setSelectedConversationId(conv.id)}
                className={`w-full text-left p-4 rounded-lg flex items-center gap-4 transition-colors ${
                    selectedConversationId === conv.id ? 'bg-teal-50 dark:bg-teal-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
            >
                <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold">{otherParticipant.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{lastMessage ? lastMessage.text : 'No messages yet'}</p>
                </div>
            </button>
        );
    };

    const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
        const isCurrentUser = msg.senderId === currentUser?.id;
        return (
            <div className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-md p-4 rounded-2xl mt-1 ${
                        isCurrentUser
                            ? 'bg-teal-600 text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-bl-none'
                    }`}>
                        <p>{msg.text}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh_-_120px)] flex flex-col">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full overflow-hidden">
                {/* Conversation List */}
                <div className="col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex flex-col p-4">
                    <h3 className="text-2xl font-bold p-4">{t('chat.title')}</h3>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {conversations.length > 0 ? (
                            conversations.map(conv => <ConversationItem key={conv.id} conv={conv} />)
                        ) : (
                            <div className="text-center p-8 text-slate-500">
                                <p>{t('chat.noConversations')}</p>
                                <p className="text-sm mt-2">{t('chat.startPrompt')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message View */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex flex-col p-0">
                    {selectedConversation ? (
                        <>
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4">
                                <img src={selectedConversation.participants[selectedConversation.participantIds.find(id => id !== currentUser?.id)!].avatar} alt="" className="w-10 h-10 rounded-full" />
                                <h3 className="font-bold text-lg">{selectedConversation.participants[selectedConversation.participantIds.find(id => id !== currentUser?.id)!].name}</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {selectedConversation.messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 border-t border-slate-200 bg-white dark:bg-slate-800 rounded-b-2xl">
                                <form onSubmit={handleSendMessage} className="relative flex items-center">
                                    <input 
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={t('chat.inputPlaceholder')}
                                        className="w-full p-4 pr-16 border-slate-200 bg-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition dark:bg-slate-700 dark:border-slate-600 dark:focus:bg-slate-700"
                                    />
                                    <button type="submit" className="absolute right-2 p-3 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition-transform transform hover:scale-105" aria-label="Send message">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>{t('chat.placeholder')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
