// stores/chatStore.js
import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [],
    }),

    actions: {
        async sendMessage(text) {
            if (!text.trim()) return;

            this.messages.push({ role: 'User', text });

            try {
                const response = await api.post('/chat', { message: text });
                this.messages.push({ role: 'Gemini', text: response.data.reply });
            } catch (err) {
                console.error(err)
                this.messages.push({ role: 'Gemini', text: '⚠️ Error: Unable to get response.' });
            }
        },
    },
});
