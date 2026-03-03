// Dashboard stat card widget
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:dhv_lingoo/config/theme.dart';
class StatCard extends StatelessWidget {
  final IconData icon; final String label; final String value; final Color color;
  const StatCard({super.key, required this.icon, required this.label, required this.value, required this.color});
  @override
  Widget build(BuildContext context) => Expanded(child: Container(padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: color, width: 3))),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Icon(icon, size: 18, color: color), const SizedBox(height: 8),
      Text(value, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
      const SizedBox(height: 2),
      Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.textMuted)),
    ])));
}
