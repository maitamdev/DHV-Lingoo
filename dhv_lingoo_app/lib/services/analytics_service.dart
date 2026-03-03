class AnalyticsService { static void logEvent(String name, [Map<String,dynamic>? p]) {} static void logScreenView(String s) { logEvent('screen_view', {'screen': s}); } }
