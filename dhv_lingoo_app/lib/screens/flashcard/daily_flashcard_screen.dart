// Daily Flashcard Screen - Mystery bag opening experience
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:dhv_lingoo/config/theme.dart';
import 'package:dhv_lingoo/config/flashcard_config.dart';
import 'package:dhv_lingoo/models/flashcard_model.dart';
import 'package:dhv_lingoo/utils/seed_random.dart';
import 'mystery_bag_widget.dart';
import 'flashcard_widget.dart';

class DailyFlashcardScreen extends StatefulWidget {
  const DailyFlashcardScreen({super.key});

  @override
  State<DailyFlashcardScreen> createState() => _DailyFlashcardScreenState();
}

class _DailyFlashcardScreenState extends State<DailyFlashcardScreen> {
  List<FlashcardModel> _cards = [];
  List<bool> _revealed = [false, false, false, false, false];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCards();
  }

  Future<void> _loadCards() async {
    try {
      setState(() { _loading = true; _error = null; });
      final supabase = Supabase.instance.client;
      final user = supabase.auth.currentUser;
      if (user == null) { setState(() { _error = 'Please log in'; _loading = false; }); return; }

      final today = SeedRandom.getTodayString();
      final seed = SeedRandom.getDailySeed(user.id, today);
      final rng = SeedRandom(seed);

      final response = await supabase.from('lesson_vocabularies').select('id, word, meaning, phonetic, example');
      final allWords = (response as List).map((w) => FlashcardModel.fromMap(w)).toList();

      if (allWords.isEmpty) { setState(() { _error = 'No vocabulary'; _loading = false; }); return; }

      final picked = rng.pickRandom(allWords, allWords.length < 5 ? allWords.length : 5);
      for (var card in picked) {
        card.rarity = SeedRandom(SeedRandom.getDailySeed(card.id, today)).getCardRarity();
      }

      setState(() { _cards = picked; _loading = false; });
    } catch (e) {
      setState(() { _error = 'Failed to load cards'; _loading = false; });
    }
  }

  void _revealCard(int index) {
    setState(() { _revealed[index] = true; });
  }

  @override
  Widget build(BuildContext context) {
    final openedCount = _revealed.where((r) => r).length;
    final progress = openedCount / FlashcardConfig.cardsPerDay;

    return Scaffold(
      backgroundColor: const Color(0xFFF0F1FF),
      appBar: AppBar(
        title: Text('Daily Flashcards', style: GoogleFonts.inter(fontWeight: FontWeight.w800)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _loading
        ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
        : _error != null
          ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              Text(_error!, style: GoogleFonts.inter(color: Colors.grey)),
              const SizedBox(height: 12),
              ElevatedButton(onPressed: _loadCards, child: const Text('Retry')),
            ]))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(children: [
                // Header
                const Text('open', style: TextStyle(fontSize: 36)),
                const SizedBox(height: 4),
                Text('Open your mystery bags!', style: GoogleFonts.inter(fontSize: 13, color: Colors.grey[500])),
                const SizedBox(height: 16),

                // Progress
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(children: [
                    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                      Text('$openedCount/${FlashcardConfig.cardsPerDay} opened', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.grey[600])),
                      Text(openedCount == FlashcardConfig.cardsPerDay ? 'All done!' : '${FlashcardConfig.cardsPerDay - openedCount} remaining', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.primary)),
                    ]),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(value: progress, minHeight: 8, backgroundColor: const Color(0xFFE2E8F0), valueColor: const AlwaysStoppedAnimation(AppTheme.primary)),
                    ),
                  ]),
                ),
                const SizedBox(height: 24),

                // Card grid
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 3 / 4,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: _cards.length,
                  itemBuilder: (context, i) {
                    if (_revealed[i]) {
                      return FlashcardWidget(
                        word: _cards[i].word,
                        meaning: _cards[i].meaning,
                        phonetic: _cards[i].phonetic,
                        example: _cards[i].example,
                        rarity: _cards[i].rarity,
                      );
                    }
                    return MysteryBagWidget(
                      index: i,
                      gradient: FlashcardConfig.bagGradients[i % FlashcardConfig.bagGradients.length],
                      onOpen: () => _revealCard(i),
                    );
                  },
                ),

                // Completion
                if (openedCount == FlashcardConfig.cardsPerDay) ...[
                  const SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFFA855F7)]),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(children: [
                      const Text('tada', style: TextStyle(fontSize: 36)),
                      const SizedBox(height: 8),
                      Text('All Cards Revealed!', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white)),
                      const SizedBox(height: 4),
                      Text('Come back tomorrow', style: GoogleFonts.inter(fontSize: 13, color: Colors.white70)),
                    ]),
                  ),
                ],
              ]),
            ),
    );
  }
}
