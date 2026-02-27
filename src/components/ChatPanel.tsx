'use client';

import { useState, useEffect, useRef } from 'react';
import { getChatMessages, sendChatMessage, ChatMessage } from '@/lib/chatStore';

const PLAYER_ID = 'p1';
const COACH_ID = 'c1';

export default function ChatPanel({ recipientName }: { recipientName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [unread, setUnread] = useState(0);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Load and sync messages
    const loadMessages = () => {
        setMessages(getChatMessages(PLAYER_ID, COACH_ID));
    };

    useEffect(() => {
        loadMessages();

        // Listen for messages from coach (cross-tab via storage event)
        const onStorage = (e: StorageEvent) => {
            if (e.key === `chat_${PLAYER_ID}_${COACH_ID}`) {
                loadMessages();
                if (!isOpen) setUnread(prev => prev + 1);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [isOpen]);

    // Reset unread and scroll when opened
    useEffect(() => {
        if (isOpen) {
            setUnread(0);
            loadMessages();
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }
    }, [isOpen]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (isOpen) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendChatMessage(PLAYER_ID, COACH_ID, 'player', input.trim());
        setInput('');
        loadMessages();
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            {isOpen ? (
                <div className="card" style={{ width: '360px', height: '470px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                    {/* Header */}
                    <div style={{ padding: '1rem 1.25rem', background: 'var(--primary-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700, color: '#fff' }}>💬 Chat with {recipientName}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Messages are live across tabs</div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-color)' }}>
                        {messages.length === 0 && (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2rem' }}>
                                No messages yet. Say hello! 👋
                            </div>
                        )}
                        {messages.map(m => (
                            <div key={m.id} style={{ alignSelf: m.sender === 'player' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                <div style={{
                                    background: m.sender === 'player' ? 'var(--primary-color)' : 'var(--surface-color)',
                                    color: m.sender === 'player' ? '#fff' : 'var(--text-color)',
                                    padding: '0.65rem 0.875rem',
                                    borderRadius: '14px',
                                    borderBottomRightRadius: m.sender === 'player' ? 0 : '14px',
                                    borderBottomLeftRadius: m.sender === 'coach' ? 0 : '14px',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                }}>
                                    {m.text}
                                </div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '3px', textAlign: m.sender === 'player' ? 'right' : 'left' }}>
                                    {m.sender === 'coach' ? recipientName : 'You'} · {m.time}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={send} style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', background: 'var(--surface-color)' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type a message..."
                            autoFocus
                            style={{ flex: 1, padding: '0.6rem 0.875rem', borderRadius: '999px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', fontSize: '0.875rem', outline: 'none' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem' }}>Send</button>
                    </form>
                </div>
            ) : (
                <button
                    className="btn btn-primary"
                    style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, fontSize: '1.5rem', boxShadow: '0 4px 20px rgba(255,69,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
                    onClick={() => setIsOpen(true)}
                >
                    💬
                    {unread > 0 && (
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--danger-color)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {unread}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}
