// Completion card shown when all daily cards are opened
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CompletionCardWidget extends StatelessWidget {
  final int totalXP;

  const CompletionCardWidget({super.key, required this.totalXP});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF6366F1), Color(0xFFA855F7)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: const Color(0xFF6366F1).withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, 8))],
      ),
      child: Column(children: [
        const Text('tada', style: TextStyle(fontSize: 36)),
        const SizedBox(height: 8),
        Text('All Cards Revealed!', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white)),
        const SizedBox(height: 4),
        Text('Come back tomorrow for new cards', style: GoogleFonts.inter(fontSize: 13, color: Colors.white70)),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(10)),
          child: Text('+$totalXP XP', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white)),
        ),
      ]),
    );
  }
}
