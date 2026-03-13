// AI Chat page — full Lingoo conversation interface
import type { Metadata } from 'next';
import ChatClient from './ChatClient';

export const metadata: Metadata = {
  title: 'Lingoo Chat AI | DHV-Lingoo',
  description: 'Trò chuyện với Lingoo AI để luyện tiếng Anh',
};

export default function ChatPage() {
  return <ChatClient />;
}
