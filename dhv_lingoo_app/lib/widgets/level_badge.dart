// Level badge widget
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:dhv_lingoo/config/theme.dart';
class LevelBadge extends StatelessWidget {
  final String level;
  final double fontSize;
  const LevelBadge({super.key, required this.level, this.fontSize = 11});
  @override
  Widget build(BuildContext context) {
    final colors = AppTheme.levelGradients[level] ?? [AppTheme.primary, AppTheme.primaryDark];
    return Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(gradient: LinearGradient(colors: colors)),
      child: Text(level, style: GoogleFonts.inter(fontSize: fontSize, fontWeight: FontWeight.w900, color: Colors.white)));
  }
}
