// Dictionary and translation types

export interface DictionaryEntry {
    word: string;
    phonetic: string;
    meanings: DictionaryMeaning[];
    audio_url: string | null;
    source: 'dictionary' | 'ai';
}

export interface DictionaryMeaning {
    partOfSpeech: string;
    definitions: DictionaryDefinition[];
    synonyms: string[];
}

export interface DictionaryDefinition {
    meaning: string;
    meaning_vi: string;
    example: string | null;
}

export interface TranslationResult {
    original: string;
    translated: string;
    from: 'en' | 'vi';
    to: 'en' | 'vi';
}
