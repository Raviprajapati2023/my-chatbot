<template>
  <q-page class="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header with clear button -->
    <div
      class="flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50"
      v-if="hasMessages"
    >
      <div class="flex items-center space-x-3">
        <img src="/faviconcopy.webp" alt="Logo" class="w-8 h-8 rounded-lg" />
        <div class="text-base font-medium text-gray-700">{{ messageCount }} messages</div>
      </div>
      <q-btn
        flat
        dense
        icon="clear_all"
        label="Clear Chat"
        @click="clearMessages"
        class="text-gray-600 hover:text-gray-800 transition-colors"
      />
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto px-8 py-6 w-full">
      <div class="max-w-6xl mx-auto">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['mb-8', message.type === 'user' ? 'flex justify-end' : 'flex justify-start']"
      >
        <div
          :class="[
            'max-w-[75%] p-5 rounded-3xl relative shadow-sm',
            message.type === 'user'
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-200/50',
            message.status === 'failed' ? 'opacity-70' : '',
          ]"
        >
          <div class="text-base leading-relaxed font-medium message-content" v-html="formatMessageText(message.text)"></div>
          <div class="flex items-center justify-between mt-3">
            <div class="text-xs opacity-70 font-medium">{{ formatTime(message.timestamp) }}</div>

            <!-- Message Status -->
            <div class="flex items-center space-x-2">
              <q-icon
                v-if="message.status === 'failed'"
                name="error"
                size="14px"
                class="text-red-500"
              />
              <q-btn
                v-if="message.status === 'failed'"
                flat
                dense
                size="sm"
                icon="refresh"
                @click="retryMessage(message.id)"
                class="text-xs hover:bg-white/20 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex justify-start mb-8">
        <div class="bg-white p-5 rounded-3xl rounded-bl-md shadow-sm border border-gray-200/50">
          <div class="flex space-x-1">
            <div class="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              class="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 0.1s"
            ></div>
            <div
              class="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 0.2s"
            ></div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="text-center text-red-600 text-base mb-6 bg-red-50 p-4 rounded-xl border border-red-200"
      >
        {{ error }}
      </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6">
      <div class="max-w-6xl mx-auto">
        <q-input
          v-model="newMessage"
          placeholder="Type your message..."
          outlined
          class="w-full text-base"
          @keydown.enter="sendMessage"
          :loading="isLoading"
          :disable="isProcessing"
          input-style="font-size: 16px; padding: 16px 20px;"
          bg-color="white"
        >
          <template v-slot:append>
            <q-btn
              icon="send"
              flat
              round
              size="md"
              @click="sendMessage"
              :disabled="!newMessage.trim() || isProcessing"
              class="text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
/* Custom scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}

.message-content {
  word-wrap: break-word;
  word-break: break-word;
}

.message-content :deep(strong) {
  font-weight: 700;
}

.message-content :deep(em) {
  font-style: italic;
}

.message-content :deep(code) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}

.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.message-content :deep(h1) {
  font-size: 1.5rem;
  font-weight: 700;
}

.message-content :deep(h2) {
  font-size: 1.25rem;
  font-weight: 700;
}

.message-content :deep(h3) {
  font-size: 1.125rem;
  font-weight: 700;
}

.message-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.message-content :deep(a:hover) {
  color: #1d4ed8;
}

/* For user messages (white text), adjust colors */
.bg-gradient-to-br .message-content :deep(code) {
  background-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

.bg-gradient-to-br .message-content :deep(h1),
.bg-gradient-to-br .message-content :deep(h2),
.bg-gradient-to-br .message-content :deep(h3) {
  color: white;
}

.bg-gradient-to-br .message-content :deep(a) {
  color: #bfdbfe;
}

.bg-gradient-to-br .message-content :deep(a:hover) {
  color: #dbeafe;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from 'stores/chatStore'

const chatStore = useChatStore()
const newMessage = ref('')

// Store state
const messages = computed(() => chatStore.messages)
const isLoading = computed(() => chatStore.isLoading)
const isTyping = computed(() => chatStore.isTyping)
const error = computed(() => chatStore.error)

// Store getters
const messageCount = computed(() => chatStore.messageCount)
const hasMessages = computed(() => chatStore.hasMessages)
const isProcessing = computed(() => chatStore.isProcessing)

// Actions
const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const messageText = newMessage.value
  newMessage.value = ''

  await chatStore.sendMessage(messageText)
}

const clearMessages = () => {
  chatStore.clearMessages()
}

const retryMessage = (messageId) => {
  chatStore.retryMessage(messageId)
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatMessageText = (text) => {
  if (!text) return ''
  
  let formatted = text
  
  // Convert **bold** to <strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
  
  // Convert *italic* to <em>
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
  
  // Convert `code` to <code>
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
  
  // Convert line breaks to <br>
  formatted = formatted.replace(/\n/g, '<br>')
  
  // Convert numbered lists (1. 2. 3.)
  formatted = formatted.replace(/^(\d+\.\s)(.*$)/gm, '<div class="my-2"><span class="font-semibold text-blue-600">$1</span>$2</div>')
  
  // Convert bullet points (-, *)
  formatted = formatted.replace(/^[-*]\s+(.*$)/gm, '<div class="my-2 flex items-start"><span class="text-blue-600 mr-2">•</span><span>$1</span></div>')
  
  // Convert ### Headers
  formatted = formatted.replace(/^###\s+(.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-800">$1</h3>')
  
  // Convert ## Headers
  formatted = formatted.replace(/^##\s+(.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2 text-gray-800">$1</h2>')
  
  // Convert # Headers
  formatted = formatted.replace(/^#\s+(.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-800">$1</h1>')
  
  // Convert URLs to clickable links
  formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-500 hover:text-blue-700 underline">$1</a>')
  
  // Add proper spacing between paragraphs
  formatted = formatted.replace(/\n\n/g, '<br><br>')
  
  return formatted
}
</script>
