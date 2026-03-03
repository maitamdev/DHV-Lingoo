// Error display widget with retry
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:dhv_lingoo/config/theme.dart';

class ErrorDisplay extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;
  const ErrorDisplay({super.key, required this.message, this.onRetry});
  @override
  Widget build(BuildContext context) => Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
    const Icon(Icons.error_outline, size: 48, color: AppTheme.rose),
    const SizedBox(height: 12),
    Text(message, style: GoogleFonts.inter(fontSize: 13, color: AppTheme.textMuted), textAlign: TextAlign.center),
    if (onRetry != null) ...[const SizedBox(height: 16), ElevatedButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh), label: const Text('Thu lai'))],
  ]));
}
