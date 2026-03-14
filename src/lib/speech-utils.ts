/**
 * Web Speech API wrapper for text-to-speech
 */
export function speak(text: string, options?: { rate?: number; lang?: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      reject(new Error('Speech synthesis not available'));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'en-US';
    utterance.rate = options?.rate || 0.8;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}