// Flashcard data model for daily mystery bags
class FlashcardModel {
  final String id;
  final String word;
  final String meaning;
  final String? phonetic;
  final String? example;
  final String rarity;
  bool isRevealed;

  FlashcardModel({
    required this.id,
    required this.word,
    required this.meaning,
    this.phonetic,
    this.example,
    this.rarity = 'common',
    this.isRevealed = false,
  });

  factory FlashcardModel.fromMap(Map<String, dynamic> m) {
    return FlashcardModel(
      id: m['id']?.toString() ?? '',
      word: m['word']?.toString() ?? '',
      meaning: m['meaning']?.toString() ?? '',
      phonetic: m['phonetic']?.toString(),
      example: m['example']?.toString(),
    );
  }
}
