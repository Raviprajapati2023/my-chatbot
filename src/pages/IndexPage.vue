<template>
  <q-page class="h-screen flex flex-col bg-white">
    <div class="flex-1 overflow-y-auto px-6 py-4 max-w-4xl mx-auto w-full">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['mb-6', message.type === 'user' ? 'flex justify-end' : 'flex justify-start']"
      >
        <div
          :class="[
            'max-w-[70%] p-4 rounded-2xl',
            message.type === 'user'
              ? 'bg-blue-500 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm',
          ]"
        >
          <div class="text-sm leading-relaxed">{{ message.text }}</div>
          <div class="text-xs opacity-70 mt-1">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 p-4">
      <div class="max-w-4xl mx-auto">
        <q-input
          v-model="newMessage"
          placeholder="Message Custom..."
          outlined
          dense
          class="w-full"
          @keydown.enter="sendMessage"
        >
          <template v-slot:append>
            <q-btn
              icon="send"
              flat
              round
              @click="sendMessage"
              :disabled="!newMessage.trim()"
              class="text-blue-500"
            />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useChatStore } from 'stores/chatStore'
const chatStore = useChatStore()
const messages = ref([
  {
    id: 1,
    text: "Hello! I'm Custom, your AI assistant. How can I help you today?",
    type: 'bot',
    timestamp: new Date(),
  },
])

const newMessage = ref('')

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage = {
    id: Date.now(),
    text: newMessage.value,
    type: 'user',
    timestamp: new Date(),
  }

  messages.value.push(userMessage)
  newMessage.value = ''

  setTimeout(() => {
    const botMessage = {
      id: Date.now() + 1,
      text: "I'm a Custom chatbot. I'll echo your message: " + userMessage.text,
      type: 'bot',
      timestamp: new Date(),
    }
    messages.value.push(botMessage)
  }, 1000)
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
