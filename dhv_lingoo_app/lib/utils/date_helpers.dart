// Date formatting helpers for Vietnamese locale  
class DateHelpers {
  static String formatDate(DateTime d) => '//';
  static String getGreeting() {
    final h = DateTime.now().hour;
    if (h < 12) return 'Chao buoi sang';
    if (h < 18) return 'Chao buoi chieu';
    return 'Chao buoi toi';
  }
}
