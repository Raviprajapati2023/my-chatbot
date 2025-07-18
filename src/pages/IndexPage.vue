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
    <div
      class="flex-1 overflow-y-auto px-8 py-6 w-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/50 scrollbar-thumb-rounded hover:scrollbar-thumb-gray-400/80"
    >
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
            <div
              :class="[
                'text-base leading-relaxed font-medium break-words',
                '[&_strong]:font-bold [&_em]:italic [&_code]:font-mono [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm',
                '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2',
                '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2',
                '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2',
                '[&_a]:underline',
                message.type === 'user'
                  ? '[&_code]:bg-white/20 [&_code]:text-white/90 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_a]:text-blue-200 [&_a:hover]:text-blue-100'
                  : '[&_code]:bg-gray-100 [&_h1]:text-gray-800 [&_h2]:text-gray-800 [&_h3]:text-gray-800 [&_a]:text-blue-500 [&_a:hover]:text-blue-700',
              ]"
              v-html="formatMessageText(message.text)"
            ></div>
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
                <!-- <q-btn
                  v-if="message.status === 'failed'"
                  flat
                  dense
                  size="sm"
                  icon="refresh"
                  @click="retryMessage(message.id)"
                  class="text-xs hover:bg-white/20 transition-colors"
                /> -->
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

// const retryMessage = (messageId) => {
//   chatStore.retryMessage(messageId)
// }

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatMessageText = (text) => {
  if (!text) return ''

  let formatted = text

  // Convert **bold** to <strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Convert *italic* to <em>
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Convert `code` to <code>
  formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>')

  // Convert line breaks to <br>
  formatted = formatted.replace(/\n/g, '<br>')

  // Convert numbered lists (1. 2. 3.)
  formatted = formatted.replace(
    /^(\d+\.\s)(.*$)/gm,
    '<div class="my-2"><span class="font-semibold text-blue-600">$1</span>$2</div>',
  )

  // Convert bullet points (-, *)
  formatted = formatted.replace(
    /^[-*]\s+(.*$)/gm,
    '<div class="my-2 flex items-start"><span class="text-blue-600 mr-2">•</span><span>$1</span></div>',
  )

  // Convert ### Headers
  formatted = formatted.replace(/^###\s+(.*$)/gm, '<h3>$1</h3>')

  // Convert ## Headers
  formatted = formatted.replace(/^##\s+(.*$)/gm, '<h2>$1</h2>')

  // Convert # Headers
  formatted = formatted.replace(/^#\s+(.*$)/gm, '<h1>$1</h1>')

  // Convert URLs to clickable links
  formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')

  // Add proper spacing between paragraphs
  formatted = formatted.replace(/\n\n/g, '<br><br>')

  return formatted
}
</script>
