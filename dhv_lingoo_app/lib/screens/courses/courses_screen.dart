// Courses listing - displays all available courses with level badges
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:dhv_lingoo/config/theme.dart';

class CoursesScreen extends StatefulWidget {
  const CoursesScreen({super.key});

  @override
  State<CoursesScreen> createState() => _CoursesScreenState();
}

class _CoursesScreenState extends State<CoursesScreen> {
  List<Map<String, dynamic>> _courses = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadCourses();
  }

  Future<void> _loadCourses() async {
    try {
      final res = await Supabase.instance.client
          .from('courses')
          .select('id, title, level, description')
          .order('title');
      if (mounted)
        setState(() {
          _courses = List<Map<String, dynamic>>.from(res);
          _loading = false;
        });
    } catch (e) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bg,
      appBar: AppBar(title: const Text('Khóa học')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadCourses,
              child: _courses.isEmpty
                  ? Center(
                      child: Text('Chưa có khóa học nào',
                          style: GoogleFonts.inter(color: AppTheme.textMuted)))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _courses.length,
                      itemBuilder: (context, i) {
                        final c = _courses[i];
                        final level = c['level'] ?? 'A1';
                        final colors = AppTheme.levelGradients[level] ??
                            [AppTheme.primary, AppTheme.primaryDark];
                        return InkWell(
                          onTap: () => context.go('/courses/${c['id']}'),
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            decoration: BoxDecoration(
                                color: Colors.white,
                                border: Border.all(color: AppTheme.border)),
                            child: Row(
                              children: [
                                Container(
                                  width: 80,
                                  height: 80,
                                  decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                          colors: colors,
                                          begin: Alignment.topLeft,
                                          end: Alignment.bottomRight)),
                                  child: const Icon(Icons.menu_book,
                                      color: Colors.white, size: 32),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 14),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(c['title'] ?? '',
                                            style: GoogleFonts.inter(
                                                fontSize: 15,
                                                fontWeight: FontWeight.w700,
                                                color: AppTheme.textPrimary)),
                                        const SizedBox(height: 4),
                                        Row(children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                                gradient: LinearGradient(
                                                    colors: colors)),
                                            child: Text(level,
                                                style: GoogleFonts.inter(
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.w800,
                                                    color: Colors.white)),
                                          ),
                                          const SizedBox(width: 8),
                                          Expanded(
                                              child: Text(
                                                  c['description'] ?? '',
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                  style: GoogleFonts.inter(
                                                      fontSize: 11,
                                                      color:
                                                          AppTheme.textMuted))),
                                        ]),
                                      ],
                                    ),
                                  ),
                                ),
                                const Padding(
                                  padding: EdgeInsets.only(right: 12),
                                  child: Icon(Icons.chevron_right,
                                      color: AppTheme.textMuted, size: 20),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
