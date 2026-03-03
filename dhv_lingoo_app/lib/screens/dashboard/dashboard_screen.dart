import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:dhv_lingoo/config/theme.dart';
import 'package:dhv_lingoo/services/auth_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? _profile;
  List<Map<String, dynamic>> _leaderboard = [];
  List<Map<String, dynamic>> _courses = [];
  List<Map<String, dynamic>> _progress = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final client = Supabase.instance.client;
      final user = AuthService.currentUser;
      if (user == null) return;

      final profileRes =
          await client.from('profiles').select().eq('id', user.id).single();
      final leaderboardRes = await client
          .from('profiles')
          .select('id, full_name, xp, avatar_url')
          .order('xp', ascending: false)
          .limit(5);
      final coursesRes = await client
          .from('courses')
          .select('id, title, level, description')
          .order('created_at', ascending: true)
          .limit(4);

      List<dynamic> progressRes = [];
      try {
        progressRes = await client
            .from('lesson_progress')
            .select('completed_at, xp_earned, score, course_id')
            .eq('user_id', user.id)
            .eq('completed', true)
            .order('completed_at', ascending: true);
      } catch (_) {}

      if (mounted) {
        setState(() {
          _profile = profileRes;
          _leaderboard = List<Map<String, dynamic>>.from(leaderboardRes);
          _courses = List<Map<String, dynamic>>.from(coursesRes);
          _progress = List<Map<String, dynamic>>.from(progressRes);
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _loading = false;
          _error = e.toString();
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (_error != null) {
      return Scaffold(body: Center(child: Text('Lỗi: $_error')));
    }

    final name = (_profile?['full_name'] ?? 'Học viên').toString();
    final level = (_profile?['level'] ?? 'A1').toString();
    final xp = (_profile?['xp'] ?? 0) as int;
    final streak = (_profile?['streak'] ?? 0) as int;
    final levelLabel = AppTheme.levelLabels[level] ?? 'Beginner';
    final levelColors = AppTheme.levelGradients[level] ??
        [AppTheme.primary, AppTheme.primaryDark];

    return Scaffold(
      backgroundColor: AppTheme.bg,
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: CustomScrollView(
          slivers: [
            // ── App Bar ──
            SliverAppBar(
              pinned: true,
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Xin chào, $name 👋',
                      style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary)),
                  Text(levelLabel,
                      style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.textMuted)),
                ],
              ),
              actions: [
                // Level badge
                Container(
                  margin: const EdgeInsets.only(right: 16),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: levelColors),
                  ),
                  child: Text(level,
                      style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                          color: Colors.white)),
                ),
              ],
            ),

            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // ── Stat Cards ──
                  Row(
                    children: [
                      _StatCard(
                          icon: Icons.local_fire_department,
                          label: 'Streak',
                          value: '$streak ngày',
                          color: AppTheme.amber),
                      const SizedBox(width: 8),
                      _StatCard(
                          icon: Icons.star,
                          label: 'XP',
                          value: '$xp',
                          color: AppTheme.emerald),
                      const SizedBox(width: 8),
                      _StatCard(
                          icon: Icons.check_circle,
                          label: 'Đã học',
                          value: '${_progress.length}',
                          color: AppTheme.primary),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // ── Weekly Activity Chart ──
                  _SectionCard(
                    icon: Icons.bar_chart,
                    iconColor: AppTheme.primary,
                    title: 'HOẠT ĐỘNG 7 NGÀY',
                    child: SizedBox(
                      height: 160,
                      child: _WeeklyChart(progress: _progress),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // ── XP Progress Chart ──
                  _SectionCard(
                    icon: Icons.trending_up,
                    iconColor: AppTheme.emerald,
                    title: 'TIẾN TRÌNH XP',
                    trailing: Text('$xp XP',
                        style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.textPrimary)),
                    child: SizedBox(
                      height: 160,
                      child: _XPChart(progress: _progress, currentXP: xp),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // ── Courses ──
                  _SectionCard(
                    icon: Icons.menu_book,
                    iconColor: AppTheme.primary,
                    title: 'KHÓA HỌC',
                    trailing: GestureDetector(
                      onTap: () => context.go('/courses'),
                      child: Text('Xem tất cả ›',
                          style: GoogleFonts.inter(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.primary)),
                    ),
                    child: Column(
                      children: _courses.map((course) {
                        final cLevel = course['level'] ?? 'A1';
                        final cColors = AppTheme.levelGradients[cLevel] ??
                            [AppTheme.primary, AppTheme.primaryDark];
                        return InkWell(
                          onTap: () => context.go('/courses/${course['id']}'),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                vertical: 12, horizontal: 4),
                            decoration: BoxDecoration(
                                border: Border(
                                    bottom: BorderSide(
                                        color: AppTheme.border
                                            .withValues(alpha: 0.5)))),
                            child: Row(
                              children: [
                                Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                      gradient:
                                          LinearGradient(colors: cColors)),
                                  child: const Icon(Icons.menu_book,
                                      color: Colors.white, size: 20),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(course['title'] ?? '',
                                          style: GoogleFonts.inter(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w700,
                                              color: AppTheme.textPrimary)),
                                      const SizedBox(height: 2),
                                      Text(cLevel,
                                          style: GoogleFonts.inter(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w600,
                                              color: AppTheme.textMuted)),
                                    ],
                                  ),
                                ),
                                const Icon(Icons.chevron_right,
                                    size: 18, color: AppTheme.textMuted),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // ── Leaderboard ──
                  _SectionCard(
                    icon: Icons.emoji_events,
                    iconColor: AppTheme.amber,
                    title: 'BẢNG XẾP HẠNG',
                    child: Column(
                      children: _leaderboard.asMap().entries.map((entry) {
                        final i = entry.key;
                        final p = entry.value;
                        final isMe = p['id'] == AuthService.currentUser?.id;
                        return Container(
                          padding: const EdgeInsets.symmetric(
                              vertical: 10, horizontal: 4),
                          decoration: BoxDecoration(
                            color: isMe
                                ? AppTheme.primary.withValues(alpha: 0.05)
                                : null,
                            border: Border(
                                bottom: BorderSide(
                                    color: AppTheme.border
                                        .withValues(alpha: 0.5))),
                          ),
                          child: Row(
                            children: [
                              SizedBox(
                                width: 24,
                                child: Text(
                                  i == 0
                                      ? '🥇'
                                      : i == 1
                                          ? '🥈'
                                          : i == 2
                                              ? '🥉'
                                              : '${i + 1}',
                                  style: GoogleFonts.inter(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                              const SizedBox(width: 12),
                              CircleAvatar(
                                radius: 16,
                                backgroundColor: AppTheme.primary,
                                child: Text(
                                  () {
                                    final n = p['full_name'] ?? '?';
                                    return n.isNotEmpty
                                        ? n[0].toUpperCase()
                                        : '?';
                                  }(),
                                  style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  p['full_name'] ?? 'Unknown',
                                  style: GoogleFonts.inter(
                                      fontSize: 13,
                                      fontWeight: isMe
                                          ? FontWeight.w700
                                          : FontWeight.w500,
                                      color: AppTheme.textPrimary),
                                ),
                              ),
                              Text('${p['xp'] ?? 0} XP',
                                  style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                      color: AppTheme.emerald)),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 24),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Stat Card ──
class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;
  const _StatCard(
      {required this.icon,
      required this.label,
      required this.value,
      required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: color, width: 3)),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.04), blurRadius: 4)
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 18, color: color),
            const SizedBox(height: 8),
            Text(value,
                style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: AppTheme.textPrimary)),
            const SizedBox(height: 2),
            Text(label,
                style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textMuted,
                    letterSpacing: 0.5)),
          ],
        ),
      ),
    );
  }
}

// ── Section Card ──
class _SectionCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final Widget? trailing;
  final Widget child;
  const _SectionCard(
      {required this.icon,
      required this.iconColor,
      required this.title,
      this.trailing,
      required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
            child: Row(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                      color: iconColor.withValues(alpha: 0.1),
                      border:
                          Border.all(color: iconColor.withValues(alpha: 0.3))),
                  child: Icon(icon, size: 14, color: iconColor),
                ),
                const SizedBox(width: 10),
                Text(title,
                    style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                        letterSpacing: 0.5)),
                const Spacer(),
                if (trailing != null) trailing!,
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: child,
          ),
        ],
      ),
    );
  }
}

// ── Weekly Activity Chart ──
class _WeeklyChart extends StatelessWidget {
  final List<Map<String, dynamic>> progress;
  const _WeeklyChart({required this.progress});

  @override
  Widget build(BuildContext context) {
    final days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    final now = DateTime.now();
    final data = List.generate(7, (i) {
      final date = now.subtract(Duration(days: 6 - i));
      final dateStr =
          '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
      final count = progress.where((p) {
        final pDate = DateTime.tryParse(p['completed_at'] ?? '');
        if (pDate == null) return false;
        final pStr =
            '${pDate.year}-${pDate.month.toString().padLeft(2, '0')}-${pDate.day.toString().padLeft(2, '0')}';
        return pStr == dateStr;
      }).length;
      return MapEntry(days[date.weekday % 7], count.toDouble());
    });

    final maxY =
        data.fold<double>(0, (max, e) => e.value > max ? e.value : max);

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: maxY < 1 ? 5 : maxY + 1,
        barTouchData: BarTouchData(
          touchTooltipData: BarTouchTooltipData(
            getTooltipItem: (group, gi, rod, ri) => BarTooltipItem(
                '${rod.toY.toInt()} bài',
                GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Colors.white)),
          ),
        ),
        gridData: const FlGridData(show: false),
        borderData: FlBorderData(show: false),
        titlesData: FlTitlesData(
          topTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, _) {
                final idx = value.toInt();
                if (idx < 0 || idx >= data.length) return const SizedBox();
                return Text(data[idx].key,
                    style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.textMuted));
              },
            ),
          ),
        ),
        barGroups: data
            .asMap()
            .entries
            .map((e) => BarChartGroupData(
                  x: e.key,
                  barRods: [
                    BarChartRodData(
                      toY: e.value.value,
                      width: 24,
                      gradient: const LinearGradient(
                          colors: [AppTheme.primary, AppTheme.secondary],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter),
                      borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(2),
                          topRight: Radius.circular(2)),
                    ),
                  ],
                ))
            .toList(),
      ),
    );
  }
}

// ── XP Progress Chart ──
class _XPChart extends StatelessWidget {
  final List<Map<String, dynamic>> progress;
  final int currentXP;
  const _XPChart({required this.progress, required this.currentXP});

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final Map<String, int> xpByDate = {};

    for (int i = 29; i >= 0; i--) {
      final date = now.subtract(Duration(days: i));
      final key = '${date.day}/${date.month}';
      xpByDate[key] = 0;
    }

    for (final p in progress) {
      final d = DateTime.tryParse(p['completed_at'] ?? '');
      if (d == null) continue;
      final key = '${d.day}/${d.month}';
      if (xpByDate.containsKey(key)) {
        xpByDate[key] = (xpByDate[key] ?? 0) + ((p['xp_earned'] ?? 0) as int);
      }
    }

    int cumulative = currentXP - xpByDate.values.fold(0, (a, b) => a + b);
    if (cumulative < 0) cumulative = 0;

    final spots = <FlSpot>[];
    int i = 0;
    for (final entry in xpByDate.entries) {
      cumulative += entry.value;
      if (i % 5 == 0 || i == xpByDate.length - 1) {
        spots.add(FlSpot(spots.length.toDouble(), cumulative.toDouble()));
      }
      i++;
    }

    // Ensure at least 2 points for line chart
    if (spots.isEmpty) {
      spots.add(const FlSpot(0, 0));
      spots.add(FlSpot(1, currentXP.toDouble()));
    } else if (spots.length == 1) {
      spots.add(FlSpot(1, spots[0].y));
    }

    return LineChart(
      LineChartData(
        gridData: FlGridData(
            show: true,
            drawVerticalLine: false,
            horizontalInterval:
                (currentXP / 4).clamp(1, double.infinity).toDouble(),
            getDrawingHorizontalLine: (_) =>
                const FlLine(color: AppTheme.border, strokeWidth: 1)),
        borderData: FlBorderData(show: false),
        titlesData: const FlTitlesData(
            topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
            rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
            leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
            bottomTitles:
                AxisTitles(sideTitles: SideTitles(showTitles: false))),
        lineTouchData: LineTouchData(
          touchTooltipData: LineTouchTooltipData(
            getTooltipItems: (spots) => spots
                .map((s) => LineTooltipItem(
                    '${s.y.toInt()} XP',
                    GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: Colors.white)))
                .toList(),
          ),
        ),
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            color: AppTheme.emerald,
            barWidth: 2,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
                show: true,
                gradient: LinearGradient(colors: [
                  AppTheme.emerald.withValues(alpha: 0.3),
                  AppTheme.emerald.withValues(alpha: 0.0)
                ], begin: Alignment.topCenter, end: Alignment.bottomCenter)),
          ),
        ],
      ),
    );
  }
}
