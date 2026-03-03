import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:dhv_lingoo/config/theme.dart';
import 'package:dhv_lingoo/services/auth_service.dart';

class LessonViewerScreen extends StatefulWidget {
  final String lessonId;
  const LessonViewerScreen({super.key, required this.lessonId});

  @override
  State<LessonViewerScreen> createState() => _LessonViewerScreenState();
}

class _LessonViewerScreenState extends State<LessonViewerScreen> {
  Map<String, dynamic>? _lesson;
  List<Map<String, dynamic>> _vocab = [];
  bool _loading = true;
  bool _completed = false;
  final FlutterTts _tts = FlutterTts();

  @override
  void initState() {
    super.initState();
    _tts.setLanguage('en-US');
    _tts.setSpeechRate(0.4);
    _loadLesson();
  }

  Future<void> _loadLesson() async {
    try {
      final client = Supabase.instance.client;

      Map<String, dynamic>? lessonRes;
      try {
        lessonRes = await client
            .from('lessons')
            .select('*, courses(title, level)')
            .eq('id', widget.lessonId)
            .single();
      } catch (_) {
        lessonRes = await client
            .from('lessons')
            .select()
            .eq('id', widget.lessonId)
            .single();
      }

      List<dynamic> vocabRes = [];
      try {
        vocabRes = await client
            .from('lesson_vocabularies')
            .select()
            .eq('lesson_id', widget.lessonId);
      } catch (_) {}

      if (mounted) {
        setState(() {
          _lesson = lessonRes;
          _vocab = List<Map<String, dynamic>>.from(vocabRes);
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _completeLesson() async {
    try {
      final user = AuthService.currentUser;
      if (user == null) return;

      final client = Supabase.instance.client;
      final xp = 10 + (_vocab.length * 2);

      await client.from('lesson_progress').upsert({
        'user_id': user.id,
        'lesson_id': widget.lessonId,
        'course_id': _lesson?['course_id'],
        'completed': true,
        'score': 100,
        'xp_earned': xp,
        'completed_at': DateTime.now().toIso8601String(),
      });

      // Update profile XP
      try {
        final profile = await client
            .from('profiles')
            .select('xp')
            .eq('id', user.id)
            .single();
        final currentXp = (profile['xp'] ?? 0) as int;
        await client
            .from('profiles')
            .update({'xp': currentXp + xp}).eq('id', user.id);
      } catch (_) {}

      if (mounted) setState(() => _completed = true);
    } catch (_) {
      if (mounted) setState(() => _completed = true);
    }
  }

  @override
  void dispose() {
    _tts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading)
      return const Scaffold(body: Center(child: CircularProgressIndicator()));

    final courseData = _lesson?['courses'];
    final courseTitle = courseData is Map ? courseData['title'] ?? '' : '';

    return Scaffold(
      backgroundColor: AppTheme.bg,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_lesson?['title'] ?? '',
                style: GoogleFonts.inter(
                    fontSize: 15, fontWeight: FontWeight.w700)),
            Text(courseTitle,
                style:
                    GoogleFonts.inter(fontSize: 11, color: AppTheme.textMuted)),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Lesson content
          if (_lesson?['content'] != null)
            Container(
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: AppTheme.border)),
              child: Text(_lesson!['content'],
                  style: GoogleFonts.inter(
                      fontSize: 14, color: AppTheme.textPrimary, height: 1.6)),
            ),

          // Vocabulary
          if (_vocab.isNotEmpty) ...[
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text('TỪ VỰNG (${_vocab.length})',
                  style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.textMuted,
                      letterSpacing: 0.5)),
            ),
            ..._vocab.map((v) => Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.border)),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(children: [
                              Text(v['word'] ?? '',
                                  style: GoogleFonts.inter(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w800,
                                      color: AppTheme.textPrimary)),
                              if (v['phonetic'] != null) ...[
                                const SizedBox(width: 8),
                                Text(v['phonetic'],
                                    style: GoogleFonts.inter(
                                        fontSize: 12,
                                        color: AppTheme.secondary,
                                        fontStyle: FontStyle.italic)),
                              ],
                            ]),
                            const SizedBox(height: 4),
                            Text(v['meaning'] ?? '',
                                style: GoogleFonts.inter(
                                    fontSize: 13,
                                    color: AppTheme.textSecondary)),
                            if (v['example'] != null) ...[
                              const SizedBox(height: 6),
                              Text('"${v['example']}"',
                                  style: GoogleFonts.inter(
                                      fontSize: 12,
                                      color: AppTheme.textMuted,
                                      fontStyle: FontStyle.italic)),
                            ],
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.volume_up,
                            color: AppTheme.primary),
                        onPressed: () => _tts.speak(v['word'] ?? ''),
                      ),
                    ],
                  ),
                )),
          ],

          const SizedBox(height: 24),

          // Complete button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton.icon(
              onPressed: _completed ? null : _completeLesson,
              icon: Icon(_completed ? Icons.check_circle : Icons.check,
                  color: Colors.white),
              label: Text(
                _completed ? 'Đã hoàn thành! 🎉' : 'Hoàn thành bài học',
                style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    _completed ? AppTheme.emerald : AppTheme.primary,
                disabledBackgroundColor: AppTheme.emerald,
                disabledForegroundColor: Colors.white,
              ),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
