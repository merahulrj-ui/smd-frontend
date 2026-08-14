"use client";
import dynamic from 'next/dynamic';

const JayantiChatbot = dynamic(() => import('@/components/JayantiChatbot'), { ssr: false });

export default function JayantiChatbotWrapper() {
  return <JayantiChatbot />;
}
