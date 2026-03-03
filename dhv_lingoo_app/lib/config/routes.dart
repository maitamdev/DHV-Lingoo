import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:dhv_lingoo/services/auth_service.dart';
import 'package:dhv_lingoo/screens/auth/login_screen.dart';
import 'package:dhv_lingoo/screens/auth/register_screen.dart';
import 'package:dhv_lingoo/screens/dashboard/dashboard_shell.dart';
import 'package:dhv_lingoo/screens/dashboard/dashboard_screen.dart';
import 'package:dhv_lingoo/screens/courses/courses_screen.dart';
import 'package:dhv_lingoo/screens/courses/course_detail_screen.dart';
import 'package:dhv_lingoo/screens/courses/lesson_viewer_screen.dart';
import 'package:dhv_lingoo/screens/dictionary/dictionary_screen.dart';
import 'package:dhv_lingoo/screens/settings/settings_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final router = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/dashboard',
  redirect: (context, state) {
    final isLoggedIn = AuthService.isLoggedIn;
    final isAuthRoute = state.matchedLocation == '/login' ||
        state.matchedLocation == '/register';

    if (!isLoggedIn && !isAuthRoute) return '/login';
    if (isLoggedIn && isAuthRoute) return '/dashboard';
    return null;
  },
  routes: [
    // ── Auth ──
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),

    // ── Dashboard Shell ──
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (_, __, child) => DashboardShell(child: child),
      routes: [
        GoRoute(
            path: '/dashboard', builder: (_, __) => const DashboardScreen()),
        GoRoute(path: '/courses', builder: (_, __) => const CoursesScreen()),
        GoRoute(
          path: '/courses/:id',
          builder: (_, state) =>
              CourseDetailScreen(courseId: state.pathParameters['id']!),
        ),
        GoRoute(
            path: '/dictionary', builder: (_, __) => const DictionaryScreen()),
        GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
      ],
    ),

    // ── Lesson Viewer (full screen, outside shell) ──
    GoRoute(
      path: '/lesson/:id',
      builder: (_, state) =>
          LessonViewerScreen(lessonId: state.pathParameters['id']!),
    ),
  ],
);
