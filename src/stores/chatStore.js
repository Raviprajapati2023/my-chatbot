import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { ENDPOINTS } from 'src/services/endpoint'

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [],
        isLoading: false,
        isTyping: false,
        currentConversationId: null,
        error: null
    }),

    getters: {
        messageCount: (state) => state.messages.length,
        lastMessage: (state) => state.messages[state.messages.length - 1],
        hasMessages: (state) => state.messages.length > 0,
        isProcessing: (state) => state.isLoading || state.isTyping
    },

    actions: {
        async sendMessage(text) {
            if (!text.trim()) return

            this.error = null

            // Add user message
            const userMessage = {
                id: Date.now(),
                text: text.trim(),
                type: 'user',
                timestamp: new Date(),
                status: 'sent'
            }

            this.messages.push(userMessage)
            this.isLoading = true

            try {
                // Show typing indicator
                this.isTyping = true

                console.log('Sending message:', text)

                const response = await api.post(ENDPOINTS.CHAT, {
                    message: text,
                    conversationId: this.currentConversationId
                })

                console.log('API Response:', response)

                // Handle successful response
                if (response && response.reply) {
                    const botMessage = {
                        id: Date.now() + 1,
                        text: response.reply,
                        type: 'bot',
                        timestamp: new Date(),
                        status: 'received'
                    }

                    this.messages.push(botMessage)

                    // Update conversation ID if provided
                    if (response.conversationId) {
                        this.currentConversationId = response.conversationId
                    }
                } else {
                    console.log('No reply in response:', response)
                    throw new Error('No reply received from server')
                }
            } catch (error) {
                console.error('Chat error:', error)
                
                // Update the user message status
                userMessage.status = 'failed'
                
                // Set error message
                this.error = error?.error || error?.message || 'Failed to send message'
                
                // Add error message to chat
                const errorMessage = {
                    id: Date.now() + 1,
                    text: `Error: ${this.error}`,
                    type: 'bot',
                    timestamp: new Date(),
                    status: 'error'
                }
                this.messages.push(errorMessage)
            } finally {
                this.isLoading = false
                this.isTyping = false
            }
        },

        clearMessages() {
            this.messages = []
            this.currentConversationId = null
            this.error = null
        },

        removeMessage(messageId) {
            const index = this.messages.findIndex(msg => msg.id === messageId)
            if (index > -1) {
                this.messages.splice(index, 1)
            }
        },

        retryMessage(messageId) {
            const message = this.messages.find(msg => msg.id === messageId)
            if (message && message.type === 'user') {
                this.sendMessage(message.text)
            }
        },

        markAsRead() {
            this.messages.forEach(msg => {
                if (msg.type === 'bot' && msg.status === 'received') {
                    msg.status = 'read'
                }
            })
        },

        addTypingIndicator() {
            this.isTyping = true
        },

        removeTypingIndicator() {
            this.isTyping = false
        }
    }
})
