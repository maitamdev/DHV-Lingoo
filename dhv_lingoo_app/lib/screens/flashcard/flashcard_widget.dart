// Flashcard widget with 3D flip animation
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:dhv_lingoo/config/flashcard_config.dart';

class FlashcardWidget extends StatefulWidget {
  final String word;
  final String meaning;
  final String? phonetic;
  final String? example;
  final String rarity;

  const FlashcardWidget({
    super.key,
    required this.word,
    required this.meaning,
    this.phonetic,
    this.example,
    this.rarity = 'common',
  });

  @override
  State<FlashcardWidget> createState() => _FlashcardWidgetState();
}

class _FlashcardWidgetState extends State<FlashcardWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _showFront = true;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _flip() {
    if (_controller.isAnimating) return;
    if (_showFront) {
      _controller.forward();
    } else {
      _controller.reverse();
    }
    _showFront = !_showFront;
  }

  @override
  Widget build(BuildContext context) {
    final color = FlashcardConfig.rarityColors[widget.rarity] ?? const Color(0xFF94A3B8);
    final label = FlashcardConfig.rarityLabels[widget.rarity] ?? 'Common';

    return GestureDetector(
      onTap: _flip,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          final angle = _controller.value * pi;
          final showBack = angle > pi / 2;

          return Transform(
            alignment: Alignment.center,
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001)
              ..rotateY(angle),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: color, width: 2),
                boxShadow: [
                  BoxShadow(color: color.withValues(alpha: 0.15), blurRadius: 12, offset: const Offset(0, 4)),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: showBack
                  ? Transform(
                      alignment: Alignment.center,
                      transform: Matrix4.identity()..rotateY(pi),
                      child: _buildBack(color, label),
                    )
                  : _buildFront(color, label),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFront(Color color, String label) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(label, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: color)),
        ),
        const SizedBox(height: 12),
        Text(widget.word, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900), textAlign: TextAlign.center),
        if (widget.phonetic != null) ...[
          const SizedBox(height: 4),
          Text(widget.phonetic!, style: TextStyle(fontSize: 12, color: Colors.grey[400])),
        ],
        const Spacer(),
        Text('TAP TO FLIP', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.grey[300], letterSpacing: 1)),
      ],
    );
  }

  Widget _buildBack(Color color, String label) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
          child: Text(label, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: color)),
        ),
        const SizedBox(height: 12),
        Text(widget.meaning, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800), textAlign: TextAlign.center),
        if (widget.example != null) ...[
          const SizedBox(height: 10),
          Text(widget.example!, style: TextStyle(fontSize: 11, color: Colors.grey[500], fontStyle: FontStyle.italic), textAlign: TextAlign.center),
        ],
        const Spacer(),
        Text('TAP TO FLIP BACK', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.grey[300], letterSpacing: 1)),
      ],
    );
  }
}
