import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:dhv_lingoo/config/theme.dart';

class CourseDetailScreen extends StatefulWidget {
  final String courseId;
  const CourseDetailScreen({super.key, required this.courseId});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  Map<String, dynamic>? _course;
  List<Map<String, dynamic>> _lessons = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final client = Supabase.instance.client;
    final courseRes = await client
        .from('courses')
        .select()
        .eq('id', widget.courseId)
        .single();
    final lessonsRes = await client
        .from('lessons')
        .select('id, title, order_index, description')
        .eq('course_id', widget.courseId)
        .order('order_index');

    if (mounted) {
      setState(() {
        _course = courseRes;
        _lessons = List<Map<String, dynamic>>.from(lessonsRes);
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading)
      return const Scaffold(body: Center(child: CircularProgressIndicator()));

    final level = _course?['level'] ?? 'A1';
    final colors = AppTheme.levelGradients[level] ??
        [AppTheme.primary, AppTheme.primaryDark];

    return Scaffold(
      backgroundColor: AppTheme.bg,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 160,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(_course?['title'] ?? '',
                  style: GoogleFonts.inter(
                      fontSize: 16, fontWeight: FontWeight.w800)),
              background: Container(
                decoration: BoxDecoration(
                    gradient: LinearGradient(
                        colors: colors,
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight)),
                child: Center(
                    child: Icon(Icons.menu_book,
                        size: 60, color: Colors.white.withValues(alpha: 0.3))),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                if (_course?['description'] != null)
                  Container(
                    padding: const EdgeInsets.all(14),
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: AppTheme.border)),
                    child: Text(_course!['description'],
                        style: GoogleFonts.inter(
                            fontSize: 13,
                            color: AppTheme.textSecondary,
                            height: 1.5)),
                  ),
                Text('BÀI HỌC (${_lessons.length})',
                    style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textMuted,
                        letterSpacing: 0.5)),
                const SizedBox(height: 12),
                ..._lessons.asMap().entries.map((entry) {
                  final i = entry.key;
                  final lesson = entry.value;
                  return InkWell(
                    onTap: () => context.push('/lesson/${lesson['id']}'),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: AppTheme.border)),
                      child: Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(colors: colors),
                              borderRadius: BorderRadius.circular(18),
                            ),
                            child: Center(
                                child: Text('${i + 1}',
                                    style: GoogleFonts.inter(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w900,
                                        color: Colors.white))),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(lesson['title'] ?? 'Bài ${i + 1}',
                                    style: GoogleFonts.inter(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: AppTheme.textPrimary)),
                                if (lesson['description'] != null)
                                  Text(lesson['description'],
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: GoogleFonts.inter(
                                          fontSize: 11,
                                          color: AppTheme.textMuted)),
                              ],
                            ),
                          ),
                          const Icon(Icons.play_circle_outline,
                              color: AppTheme.primary, size: 24),
                        ],
                      ),
                    ),
                  );
                }),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}
