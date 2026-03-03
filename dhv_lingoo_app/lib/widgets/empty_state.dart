// Empty state widget
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:dhv_lingoo/config/theme.dart';

class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? subtitle;
  const EmptyState({super.key, required this.icon, required this.title, this.subtitle});
  @override
  Widget build(BuildContext context) => Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
    Icon(icon, size: 64, color: AppTheme.textMuted),
    const SizedBox(height: 16),
    Text(title, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700)),
    if (subtitle != null) ...[const SizedBox(height: 8), Text(subtitle!, style: GoogleFonts.inter(fontSize: 14, color: AppTheme.textMuted))],
  ]));
}
