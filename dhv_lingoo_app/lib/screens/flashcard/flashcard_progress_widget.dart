// Progress bar for daily flashcard opening
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:dhv_lingoo/config/theme.dart';
import 'package:dhv_lingoo/config/flashcard_config.dart';

class FlashcardProgressWidget extends StatelessWidget {
  final int opened;

  const FlashcardProgressWidget({super.key, required this.opened});

  @override
  Widget build(BuildContext context) {
    final progress = opened / FlashcardConfig.cardsPerDay;
    final done = opened == FlashcardConfig.cardsPerDay;

    return Column(children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text('$opened/${FlashcardConfig.cardsPerDay} opened',
          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.grey[600])),
        Text(done ? 'All done!' : '${FlashcardConfig.cardsPerDay - opened} remaining',
          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: done ? AppTheme.emerald : AppTheme.primary)),
      ]),
      const SizedBox(height: 6),
      ClipRRect(
        borderRadius: BorderRadius.circular(4),
        child: LinearProgressIndicator(
          value: progress,
          minHeight: 8,
          backgroundColor: const Color(0xFFE2E8F0),
          valueColor: const AlwaysStoppedAnimation(AppTheme.primary),
        ),
      ),
    ]);
  }
}
