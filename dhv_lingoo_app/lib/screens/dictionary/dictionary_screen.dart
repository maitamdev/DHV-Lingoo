// Dictionary screen - Free Dictionary API lookup with phonetics and TTS
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:dhv_lingoo/config/theme.dart';

class DictionaryScreen extends StatefulWidget {
  const DictionaryScreen({super.key});

  @override
  State<DictionaryScreen> createState() => _DictionaryScreenState();
}

class _DictionaryScreenState extends State<DictionaryScreen> {
  final _controller = TextEditingController();
  final _tts = FlutterTts();
  bool _loading = false;
  Map<String, dynamic>? _result;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tts.setLanguage('en-US');
    _tts.setSpeechRate(0.4);
  }

  Future<void> _lookup(String word) async {
    if (word.trim().isEmpty) return;
    setState(() {
      _loading = true;
      _result = null;
      _error = null;
    });

    try {
      final res = await http.get(Uri.parse(
          'https://api.dictionaryapi.dev/api/v2/entries/en/${Uri.encodeComponent(word.trim().toLowerCase())}'));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is List && data.isNotEmpty) {
          setState(() => _result = data[0]);
        }
      } else {
        setState(() => _error = 'Không tìm thấy từ "$word"');
      }
    } catch (e) {
      setState(() => _error = 'Lỗi kết nối');
    }

    setState(() => _loading = false);
  }

  @override
  void dispose() {
    _controller.dispose();
    _tts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bg,
      appBar: AppBar(title: const Text('Tra từ điển')),
      body: Column(
        children: [
          // Search bar
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Nhập từ tiếng Anh...',
                      prefixIcon: const Icon(Icons.search, size: 20),
                      suffixIcon: _controller.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, size: 18),
                              onPressed: () {
                                _controller.clear();
                                setState(() {
                                  _result = null;
                                  _error = null;
                                });
                              })
                          : null,
                    ),
                    onSubmitted: _lookup,
                    onChanged: (_) => setState(() {}),
                  ),
                ),
                const SizedBox(width: 10),
                SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed:
                        _loading ? null : () => _lookup(_controller.text),
                    style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.secondary),
                    child: _loading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: Colors.white))
                        : const Icon(Icons.search, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),

          // Quick suggestions
          if (_result == null && _error == null && !_loading)
            Container(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  'accomplish',
                  'resilient',
                  'algorithm',
                  'sustainable',
                  'ephemeral'
                ]
                    .map(
                      (w) => ActionChip(
                        label: Text(w,
                            style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.secondary)),
                        backgroundColor:
                            AppTheme.secondary.withValues(alpha: 0.1),
                        side: BorderSide(
                            color: AppTheme.secondary.withValues(alpha: 0.3)),
                        onPressed: () {
                          _controller.text = w;
                          _lookup(w);
                        },
                      ),
                    )
                    .toList(),
              ),
            ),

          // Results
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(
                        child: Text(_error!,
                            style:
                                GoogleFonts.inter(color: AppTheme.textMuted)))
                    : _result != null
                        ? _buildResult()
                        : Center(
                            child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.translate,
                                  size: 60,
                                  color: AppTheme.textMuted
                                      .withValues(alpha: 0.3)),
                              const SizedBox(height: 12),
                              Text('Nhập từ để tra cứu',
                                  style: GoogleFonts.inter(
                                      color: AppTheme.textMuted)),
                            ],
                          )),
          ),
        ],
      ),
    );
  }

  Widget _buildResult() {
    final word = _result!['word'] ?? '';
    final phonetic = _result!['phonetic'] ?? '';
    final meanings = _result!['meanings'] as List? ?? [];
    final audioUrl = (_result!['phonetics'] as List?)?.firstWhere(
        (p) => (p['audio'] ?? '').toString().isNotEmpty,
        orElse: () => null)?['audio'];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Word header
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [
              AppTheme.secondary.withValues(alpha: 0.08),
              Colors.purple.withValues(alpha: 0.05)
            ]),
            border: Border.all(color: AppTheme.border),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(word,
                        style: GoogleFonts.inter(
                            fontSize: 26,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.textPrimary)),
                    if (phonetic.isNotEmpty)
                      Text(phonetic,
                          style: GoogleFonts.inter(
                              fontSize: 14,
                              color: AppTheme.secondary,
                              fontStyle: FontStyle.italic)),
                  ],
                ),
              ),
              FloatingActionButton.small(
                heroTag: 'speak',
                backgroundColor: AppTheme.secondary.withValues(alpha: 0.15),
                elevation: 0,
                onPressed: () {
                  if (audioUrl != null && audioUrl.isNotEmpty) {
                    // Could use audioplayers but TTS is simpler
                  }
                  _tts.speak(word);
                },
                child: const Icon(Icons.volume_up, color: AppTheme.secondary),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Meanings
        ...meanings.map<Widget>((m) {
          final pos = m['partOfSpeech'] ?? '';
          final defs = (m['definitions'] as List?) ?? [];
          final synonyms = (m['synonyms'] as List?)?.take(5).toList() ?? [];

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: AppTheme.border)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  color: AppTheme.secondary.withValues(alpha: 0.1),
                  child: Text(pos.toUpperCase(),
                      style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.secondary,
                          letterSpacing: 0.5)),
                ),
                const SizedBox(height: 10),
                ...defs.take(3).toList().asMap().entries.map((e) {
                  final def = e.value;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                            width: 3,
                            height: 14,
                            margin: const EdgeInsets.only(top: 3, right: 10),
                            color: AppTheme.secondary.withValues(alpha: 0.5)),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${e.key + 1}. ${def['definition'] ?? ''}',
                                  style: GoogleFonts.inter(
                                      fontSize: 13,
                                      color: AppTheme.textPrimary)),
                              if (def['example'] != null)
                                Padding(
                                  padding: const EdgeInsets.only(top: 4),
                                  child: Text('"${def['example']}"',
                                      style: GoogleFonts.inter(
                                          fontSize: 12,
                                          color: AppTheme.textMuted,
                                          fontStyle: FontStyle.italic)),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }),
                if (synonyms.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: [
                      Text('syn: ',
                          style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textMuted)),
                      ...synonyms.map((s) => GestureDetector(
                            onTap: () {
                              _controller.text = s.toString();
                              _lookup(s.toString());
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppTheme.emerald.withValues(alpha: 0.1),
                                border: Border.all(
                                    color: AppTheme.emerald
                                        .withValues(alpha: 0.3)),
                              ),
                              child: Text(s.toString(),
                                  style: GoogleFonts.inter(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                      color: AppTheme.emerald)),
                            ),
                          )),
                    ],
                  ),
                ],
              ],
            ),
          );
        }),
      ],
    );
  }
}
