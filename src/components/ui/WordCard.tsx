'use client';
import { Volume2, Star, Brain } from 'lucide-react';

interface Props {
  word: string;
  phonetic?: string;
  meaning: string;
  example?: string;
  isFavorite?: boolean;
  onSpeak?: () => void;
  onToggleFavorite?: () => void;
}

export default function WordCard({ word, phonetic, meaning, example, isFavorite, onSpeak, onToggleFavorite }: Props) {
  return (
    <div className='flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition'>
      <div className='w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0'>
        <Brain className='w-5 h-5 text-purple-500' />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='font-bold text-gray-900'>{word}</span>
          {phonetic && <span className='text-xs text-gray-400 italic'>{phonetic}</span>}
        </div>
        <p className='text-sm text-indigo-600 font-medium'>{meaning}</p>
        {example && <p className='text-xs text-gray-400 truncate mt-0.5'>{example}</p>}
      </div>
      <div className='flex gap-1.5'>
        {onSpeak && (
          <button onClick={onSpeak} className='w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 transition'>
            <Volume2 className='w-3.5 h-3.5' />
          </button>
        )}
        {onToggleFavorite && (
          <button onClick={onToggleFavorite} className='w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center transition'
            style={isFavorite ? { color: '#f59e0b', borderColor: '#f59e0b' } : { color: '#94a3b8' }}>
            <Star className='w-3.5 h-3.5' />
          </button>
        )}
      </div>
    </div>
  );
}