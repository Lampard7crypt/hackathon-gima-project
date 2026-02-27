'use client';

import { useState } from 'react';

export default function ChatPanel({ recipientName }: { recipientName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'them', text: 'Hey, I reviewed your recent game tape. Great work on the assists!', time: '10:00 AM' }
    ]);
    const [input, setInput] = useState('');

    const send = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), sender: 'me', text: input, time: 'Now' }]);
        setInput('');
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            {isOpen ? (
                <div className="card" style={{ width: '350px', height: '450px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', background: 'var(--surface-color-light)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 600 }}>Chat with {recipientName}</div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
                    </div>

                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map(m => (
                            <div key={m.id} style={{ alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                <div style={{
                                    background: m.sender === 'me' ? 'var(--primary-color)' : 'var(--surface-color-light)',
                                    color: m.sender === 'me' ? '#fff' : 'var(--text-color)',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    borderBottomRightRadius: m.sender === 'me' ? 0 : '12px',
                                    borderBottomLeftRadius: m.sender === 'them' ? 0 : '12px',
                                }}>
                                    {m.text}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: m.sender === 'me' ? 'right' : 'left' }}>
                                    {m.time}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={send} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type a message..."
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Send</button>
                    </form>
                </div>
            ) : (
                <button
                    className="btn btn-primary"
                    style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, fontSize: '1.5rem', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    onClick={() => setIsOpen(true)}
                >
                    💬
                </button>
            )}
        </div>
    );
}
