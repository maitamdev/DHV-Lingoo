// String extension utilities
extension StringExtension on String {
  String get capitalize => isEmpty ? '' : this[0].toUpperCase() + substring(1);
  String truncateTo(int maxLength) => length <= maxLength ? this : substring(0, maxLength - 3) + '...';
  bool get isValidEmail => RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(this);
}
