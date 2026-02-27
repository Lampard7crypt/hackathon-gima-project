// Shared real-time chat store backed by localStorage.
// Uses the `storage` event to propagate messages across browser tabs.

export interface ChatMessage {
    id: number;
    sender: 'coach' | 'player';
    text: string;
    time: string;
}

const chatKey = (playerId: string, coachId: string) => `chat_${playerId}_${coachId}`;

export function getChatMessages(playerId: string, coachId: string): ChatMessage[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(chatKey(playerId, coachId)) || '[]');
    } catch {
        return [];
    }
}

export function sendChatMessage(
    playerId: string,
    coachId: string,
    sender: 'coach' | 'player',
    text: string
) {
    if (typeof window === 'undefined') return;
    const messages = getChatMessages(playerId, coachId);
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messages.push({ id: Date.now(), sender, text, time });
    localStorage.setItem(chatKey(playerId, coachId), JSON.stringify(messages));
    // Dispatch a custom event so same-tab listeners also pick it up
    window.dispatchEvent(new StorageEvent('storage', {
        key: chatKey(playerId, coachId),
        newValue: JSON.stringify(messages),
    }));
}
