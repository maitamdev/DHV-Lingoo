// XP and level calculation utilities
class XPUtils {
  static const levelThresholds = {'A1':0,'A2':500,'B1':1500,'B2':3000,'C1':5000,'C2':8000};
  static String getLevelFromXP(int xp) {
    if (xp >= 8000) return 'C2';
    if (xp >= 5000) return 'C1';
    if (xp >= 3000) return 'B2';
    if (xp >= 1500) return 'B1';
    if (xp >= 500) return 'A2';
    return 'A1';
  }
  static String formatXP(int xp) {
    if (xp >= 1000) return (xp / 1000).toStringAsFixed(1) + 'K';
    return xp.toString();
  }
}
