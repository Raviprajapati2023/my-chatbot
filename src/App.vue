<template>
  <router-view />
</template>

<script setup>
import { useMeta } from 'quasar'

useMeta({
  title: 'iR Chatbot - Intelligent AI Assistant',
  meta: {
    description: { content: 'Experience the future of AI conversation with iR Chatbot. Get intelligent responses, creative assistance, and seamless interaction powered by advanced AI technology.' },
    keywords: { content: 'AI chatbot, artificial intelligence, conversation, assistant, iR, smart chat, AI technology' },
    author: { content: 'Ravi Prajapati' },
    
    // Open Graph meta tags for social sharing
    'og:title': { content: 'iR Chatbot - Intelligent AI Assistant' },
    'og:description': { content: 'Experience the future of AI conversation with iR Chatbot. Get intelligent responses, creative assistance, and seamless interaction powered by advanced AI technology.' },
    'og:image': { content: '/faviconcopy.webp' },
    'og:url': { content: window?.location?.href || '' },
    'og:type': { content: 'website' },
    'og:site_name': { content: 'iR Chatbot' },
    
    // Twitter Card meta tags
    'twitter:card': { content: 'summary_large_image' },
    'twitter:title': { content: 'iR Chatbot - Intelligent AI Assistant' },
    'twitter:description': { content: 'Experience the future of AI conversation with iR Chatbot. Get intelligent responses, creative assistance, and seamless interaction.' },
    'twitter:image': { content: '/faviconcopy.webp' },
    
    // Additional meta tags
    'theme-color': { content: '#3b82f6' },
    'mobile-web-app-capable': { content: 'yes' },
    'apple-mobile-web-app-capable': { content: 'yes' },
    'apple-mobile-web-app-status-bar-style': { content: 'default' },
    'apple-mobile-web-app-title': { content: 'iR Chatbot' }
  },
  link: {
    icon: { href: '/faviconcopy.webp', type: 'image/webp' },
    'apple-touch-icon': { href: '/faviconcopy.webp' }
  }
})
</script>
