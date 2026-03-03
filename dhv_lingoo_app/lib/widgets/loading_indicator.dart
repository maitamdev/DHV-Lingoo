// Reusable loading indicator widget
import 'package:flutter/material.dart';
import 'package:dhv_lingoo/config/theme.dart';

class LoadingIndicator extends StatelessWidget {
  final String? message;
  const LoadingIndicator({super.key, this.message});
  @override
  Widget build(BuildContext context) => Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
    const CircularProgressIndicator(color: AppTheme.primary),
    if (message != null) ...[const SizedBox(height: 16), Text(message!, style: const TextStyle(color: AppTheme.textMuted))],
  ]));
}
