// Seeded random number generator for consistent daily cards
class SeedRandom {
  int _seed;

  SeedRandom(this._seed);

  double next() {
    _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
    return _seed / 0x7fffffff;
  }

  static int hashString(String str) {
    int hash = 0;
    for (int i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.codeUnitAt(i);
      hash = hash & 0x7fffffff;
    }
    return hash.abs();
  }

  static int getDailySeed(String userId, String date) {
    return hashString('$userId:$date');
  }

  static String getTodayString() {
    final now = DateTime.now();
    return '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
  }

  List<T> pickRandom<T>(List<T> items, int count) {
    final shuffled = List<T>.from(items);
    for (int i = shuffled.length - 1; i > 0; i--) {
      final j = (next() * (i + 1)).floor();
      final temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled.take(count).toList();
  }

  String getCardRarity() {
    final roll = next();
    if (roll < 0.05) return 'legendary';
    if (roll < 0.15) return 'epic';
    if (roll < 0.30) return 'rare';
    if (roll < 0.55) return 'uncommon';
    return 'common';
  }
}
