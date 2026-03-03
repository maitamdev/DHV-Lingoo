import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:dhv_lingoo/config/theme.dart';
import 'package:dhv_lingoo/services/auth_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  Map<String, dynamic>? _profile;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final profile = await AuthService.getProfile();
    if (mounted)
      setState(() {
        _profile = profile;
        _loading = false;
      });
  }

  Future<void> _signOut() async {
    await AuthService.signOut();
    if (mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    if (_loading)
      return const Scaffold(body: Center(child: CircularProgressIndicator()));

    final name = _profile?['full_name'] ?? 'Học viên';
    final email = AuthService.currentUser?.email ?? '';
    final level = _profile?['level'] ?? 'A1';
    final xp = _profile?['xp'] ?? 0;
    final streak = _profile?['streak'] ?? 0;

    return Scaffold(
      backgroundColor: AppTheme.bg,
      appBar: AppBar(title: const Text('Cài đặt')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: AppTheme.border),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 32,
                  backgroundColor: AppTheme.primary,
                  child: Text(name.isNotEmpty ? name[0].toUpperCase() : '?',
                      style: GoogleFonts.inter(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: Colors.white)),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name,
                          style: GoogleFonts.inter(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textPrimary)),
                      const SizedBox(height: 2),
                      Text(email,
                          style: GoogleFonts.inter(
                              fontSize: 12, color: AppTheme.textMuted)),
                      const SizedBox(height: 8),
                      Row(children: [
                        _MiniStat(
                            icon: Icons.star,
                            value: '$xp XP',
                            color: AppTheme.emerald),
                        const SizedBox(width: 12),
                        _MiniStat(
                            icon: Icons.local_fire_department,
                            value: '$streak ngày',
                            color: AppTheme.amber),
                        const SizedBox(width: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                                colors: AppTheme.levelGradients[level] ??
                                    [AppTheme.primary, AppTheme.primaryDark]),
                          ),
                          child: Text(level,
                              style: GoogleFonts.inter(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white)),
                        ),
                      ]),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Menu items
          _SettingsTile(
              icon: Icons.person_outline,
              title: 'Thông tin cá nhân',
              onTap: () {}),
          _SettingsTile(
              icon: Icons.notifications_outlined,
              title: 'Thông báo',
              onTap: () {}),
          _SettingsTile(
              icon: Icons.palette_outlined, title: 'Giao diện', onTap: () {}),
          _SettingsTile(
              icon: Icons.info_outline, title: 'Về ứng dụng', onTap: () {}),

          const SizedBox(height: 24),

          // Sign out
          SizedBox(
            width: double.infinity,
            height: 48,
            child: OutlinedButton.icon(
              onPressed: _signOut,
              icon: const Icon(Icons.logout, color: AppTheme.rose),
              label: Text('Đăng xuất',
                  style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.rose)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppTheme.rose),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(0)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final IconData icon;
  final String value;
  final Color color;
  const _MiniStat(
      {required this.icon, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 3),
        Text(value,
            style: GoogleFonts.inter(
                fontSize: 11, fontWeight: FontWeight.w700, color: color)),
      ],
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  const _SettingsTile(
      {required this.icon, required this.title, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        margin: const EdgeInsets.only(bottom: 1),
        decoration: BoxDecoration(
            color: Colors.white, border: Border.all(color: AppTheme.border)),
        child: Row(
          children: [
            Icon(icon, size: 20, color: AppTheme.textSecondary),
            const SizedBox(width: 14),
            Expanded(
                child: Text(title,
                    style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: AppTheme.textPrimary))),
            const Icon(Icons.chevron_right,
                size: 18, color: AppTheme.textMuted),
          ],
        ),
      ),
    );
  }
}
