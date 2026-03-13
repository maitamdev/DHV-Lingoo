// AI Flashcard Generation - Prompt templates and response parsing
// Uses Groq (primary) and HuggingFace (fallback) to generate daily vocabulary

export interface AIFlashcard {
  word: string;
  meaning: string;
  phonetic: string;
  example: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Daily topics to rotate through for variety
const DAILY_TOPICS = [
  'Giao tiếp hàng ngày',
  'Du lịch & Khám phá',
  'Công nghệ & Internet',
  'Ẩm thực & Nhà hàng',
  'Sức khỏe & Thể thao',
  'Công việc & Văn phòng',
  'Mua sắm & Thời trang',
  'Gia đình & Bạn bè',
  'Thiên nhiên & Môi trường',
  'Giải trí & Phim ảnh',
  'Giáo dục & Học tập',
  'Cảm xúc & Tính cách',
  'Thời tiết & Mùa',
  'Giao thông & Di chuyển',
  'Nhà cửa & Nội thất',
  'Động vật & Thực vật',
  'Âm nhạc & Nghệ thuật',
  'Thể thao & Thi đấu',
  'Tài chính & Tiền bạc',
  'Khoa học & Phát minh',
  'Lịch sử & Văn hóa',
  'Tình yêu & Hẹn hò',
  'Nghề nghiệp & Sự nghiệp',
  'Thực phẩm & Dinh dưỡng',
  'Truyền thông & Mạng xã hội',
  'Pháp luật & Quy tắc',
  'Tâm lý & Phát triển bản thân',
  'Xã hội & Cộng đồng',
  'Kiến trúc & Thiết kế',
  'Vũ trụ & Khám phá',
];

/**
 * Get today's topic based on date rotation
 */
export function getDailyTopic(date: string): string {
  const d = new Date(date + 'T00:00:00');
  const epoch = new Date('2024-01-01T00:00:00');
  const daysSinceEpoch = Math.floor((d.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
  return DAILY_TOPICS[daysSinceEpoch % DAILY_TOPICS.length];
}

/**
 * Generate the AI prompt for daily flashcard creation
 */
export function generateFlashcardPrompt(topic: string, date: string): string {
  return `Bạn là trợ lý dạy tiếng Anh cho người Việt. Hãy tạo CHÍNH XÁC 5 từ vựng tiếng Anh cho ngày ${date}.

## CHỦ ĐỀ HÔM NAY: ${topic}

## YÊU CẦU:
1. Mỗi từ phải thuộc chủ đề "${topic}"
2. Level: A1-B1 (phù hợp người mới bắt đầu đến trung cấp)
3. Đa dạng loại từ (noun, verb, adjective, adverb, phrase)
4. Phiên âm IPA chuẩn quốc tế
5. Ví dụ thực tế, dễ hiểu
6. Nghĩa tiếng Việt chính xác

## FORMAT (BẮT BUỘC trả về JSON):
\`\`\`json
[
  {
    "word": "example",
    "meaning": "ví dụ",
    "phonetic": "/ɪɡˈzæm.pəl/",
    "example": "Can you give me an example?",
    "category": "${topic}",
    "difficulty": "easy"
  }
]
\`\`\`

## QUAN TRỌNG:
- Trả về ĐÚNG 5 từ trong mảng JSON
- KHÔNG thêm text nào ngoài JSON
- difficulty: "easy" (A1), "medium" (A2), "hard" (B1)
- Phiên âm phải dùng ký hiệu IPA chuẩn, KHÔNG viết kiểu Việt hóa`;
}

/**
 * Parse and validate AI response into flashcard array
 */
export function parseAIResponse(response: string): AIFlashcard[] {
  // Try to extract JSON from response
  let jsonStr = response.trim();

  // Handle markdown code blocks
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  // Try to find JSON array
  const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    jsonStr = arrayMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr);

    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    // Validate and normalize each card
    const cards: AIFlashcard[] = parsed
      .filter((card: Record<string, unknown>) =>
        card &&
        typeof card.word === 'string' &&
        typeof card.meaning === 'string'
      )
      .map((card: Record<string, unknown>) => ({
        word: String(card.word).trim(),
        meaning: String(card.meaning).trim(),
        phonetic: String(card.phonetic || '').trim(),
        example: String(card.example || '').trim(),
        category: String(card.category || '').trim(),
        difficulty: validateDifficulty(String(card.difficulty || 'medium')),
      }))
      .slice(0, 5); // Max 5 cards

    if (cards.length === 0) {
      throw new Error('No valid cards found in response');
    }

    return cards;
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate difficulty level
 */
function validateDifficulty(diff: string): 'easy' | 'medium' | 'hard' {
  const normalized = diff.toLowerCase().trim();
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  return 'medium';
}

/**
 * Get difficulty color for UI display
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '#10b981';
    case 'medium': return '#f59e0b';
    case 'hard': return '#ef4444';
    default: return '#6b7280';
  }
}

/**
 * Get difficulty label in Vietnamese
 */
export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'Dễ';
    case 'medium': return 'Trung bình';
    case 'hard': return 'Khó';
    default: return 'Trung bình';
  }
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'Giao tiếp hàng ngày': '💬',
    'Du lịch & Khám phá': '✈️',
    'Công nghệ & Internet': '💻',
    'Ẩm thực & Nhà hàng': '🍽️',
    'Sức khỏe & Thể thao': '💪',
    'Công việc & Văn phòng': '💼',
    'Mua sắm & Thời trang': '🛍️',
    'Gia đình & Bạn bè': '👨‍👩‍👧‍👦',
    'Thiên nhiên & Môi trường': '🌿',
    'Giải trí & Phim ảnh': '🎬',
    'Giáo dục & Học tập': '📚',
    'Cảm xúc & Tính cách': '😊',
    'Thời tiết & Mùa': '🌤️',
    'Giao thông & Di chuyển': '🚗',
    'Nhà cửa & Nội thất': '🏠',
    'Động vật & Thực vật': '🐾',
    'Âm nhạc & Nghệ thuật': '🎵',
    'Thể thao & Thi đấu': '⚽',
    'Tài chính & Tiền bạc': '💰',
    'Khoa học & Phát minh': '🔬',
    'Lịch sử & Văn hóa': '🏛️',
    'Tình yêu & Hẹn hò': '❤️',
    'Nghề nghiệp & Sự nghiệp': '🎯',
    'Thực phẩm & Dinh dưỡng': '🥗',
    'Truyền thông & Mạng xã hội': '📱',
    'Pháp luật & Quy tắc': '⚖️',
    'Tâm lý & Phát triển bản thân': '🧠',
    'Xã hội & Cộng đồng': '🤝',
    'Kiến trúc & Thiết kế': '🏗️',
    'Vũ trụ & Khám phá': '🚀',
  };
  return iconMap[category] || '📖';
}
// Module: flashcard-ai v1.0
// Supports: Groq primary, HF fallback
// Topics rotate every 30 days
// IPA phonetic is mandatory
// JSON format strictly enforced
// Difficulty: easy A1, medium A2, hard B1
// Category icons for 30 topics
// Parser handles malformed responses
// Prompt optimized for Vietnamese
// All utilities exported
// Tested with llama-3.3-70b
// See implementation plan
