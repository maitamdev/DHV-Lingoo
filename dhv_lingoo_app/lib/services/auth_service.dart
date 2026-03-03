// Authentication service - Supabase auth wrapper for sign in/up/out and profile management
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  static SupabaseClient get _client => Supabase.instance.client;

  static User? get currentUser => _client.auth.currentUser;
  static bool get isLoggedIn => currentUser != null;

  static Stream<AuthState> get authStateChanges =>
      _client.auth.onAuthStateChange;

  // ── Sign In ──
  static Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    return await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  // ── Sign Up ──
  static Future<AuthResponse> signUp({
    required String email,
    required String password,
    String? fullName,
  }) async {
    final response = await _client.auth.signUp(
      email: email,
      password: password,
    );

    // Create profile after signup
    if (response.user != null) {
      await _client.from('profiles').upsert({
        'id': response.user!.id,
        'full_name': fullName ?? email.split('@')[0],
        'email': email,
        'level': 'A1',
        'xp': 0,
        'streak': 0,
        'longest_streak': 0,
        'daily_time': 30,
        'role': 'student',
      });
    }

    return response;
  }

  // ── Sign Out ──
  static Future<void> signOut() async {
    await _client.auth.signOut();
  }

  // ── Get Profile ──
  static Future<Map<String, dynamic>?> getProfile() async {
    final user = currentUser;
    if (user == null) return null;

    final response =
        await _client.from('profiles').select().eq('id', user.id).single();
    return response;
  }

  // ── Update Profile ──
  static Future<void> updateProfile(Map<String, dynamic> data) async {
    final user = currentUser;
    if (user == null) return;

    await _client.from('profiles').update(data).eq('id', user.id);
  }
}
