import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:dhv_lingoo/config/theme.dart';

class DashboardShell extends StatelessWidget {
  final Widget child;
  const DashboardShell({super.key, required this.child});

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    if (location == '/dashboard') return 0;
    if (location.startsWith('/courses')) return 1;
    if (location == '/dictionary') return 2;
    if (location == '/settings') return 3;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final index = _currentIndex(context);

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppTheme.border, width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: index,
          onTap: (i) {
            switch (i) {
              case 0:
                context.go('/dashboard');
                break;
              case 1:
                context.go('/courses');
                break;
              case 2:
                context.go('/dictionary');
                break;
              case 3:
                context.go('/settings');
                break;
            }
          },
          items: const [
            BottomNavigationBarItem(
                icon: Icon(Icons.dashboard_outlined),
                activeIcon: Icon(Icons.dashboard),
                label: 'Dashboard'),
            BottomNavigationBarItem(
                icon: Icon(Icons.menu_book_outlined),
                activeIcon: Icon(Icons.menu_book),
                label: 'Khóa học'),
            BottomNavigationBarItem(
                icon: Icon(Icons.translate),
                activeIcon: Icon(Icons.translate),
                label: 'Tra từ'),
            BottomNavigationBarItem(
                icon: Icon(Icons.person_outline),
                activeIcon: Icon(Icons.person),
                label: 'Cài đặt'),
          ],
        ),
      ),
    );
  }
}
