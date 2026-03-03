// Rarity badge widget for flashcards
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:dhv_lingoo/config/flashcard_config.dart';

class RarityBadgeWidget extends StatelessWidget {
  final String rarity;

  const RarityBadgeWidget({super.key, required this.rarity});

  @override
  Widget build(BuildContext context) {
    final color = FlashcardConfig.rarityColors[rarity] ?? const Color(0xFF94A3B8);
    final label = FlashcardConfig.rarityLabels[rarity] ?? 'Common';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: color, letterSpacing: 0.5),
      ),
    );
  }
}
