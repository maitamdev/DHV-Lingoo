// Flashcard rarity configuration
import 'package:flutter/material.dart';

class FlashcardConfig {
  static const int cardsPerDay = 5;

  static const Map<String, Color> rarityColors = {
    'common': Color(0xFF94A3B8),
    'uncommon': Color(0xFF22C55E),
    'rare': Color(0xFF3B82F6),
    'epic': Color(0xFFA855F7),
    'legendary': Color(0xFFF59E0B),
  };

  static const Map<String, String> rarityLabels = {
    'common': 'Common',
    'uncommon': 'Uncommon',
    'rare': 'Rare',
    'epic': 'Epic',
    'legendary': 'Legendary',
  };

  static const Map<String, String> rarityIcons = {
    'common': 'book',
    'uncommon': 'star_outline',
    'rare': 'diamond',
    'epic': 'auto_awesome',
    'legendary': 'emoji_events',
  };

  static const Map<String, int> xpPerCard = {
    'common': 2,
    'uncommon': 3,
    'rare': 5,
    'epic': 8,
    'legendary': 15,
  };

  static const List<List<Color>> bagGradients = [
    [Color(0xFF6366F1), Color(0xFF7C3AED)],
    [Color(0xFF10B981), Color(0xFF14B8A6)],
    [Color(0xFFF43F5E), Color(0xFFEC4899)],
    [Color(0xFFF59E0B), Color(0xFFF97316)],
    [Color(0xFF06B6D4), Color(0xFF3B82F6)],
  ];
}
