import tr from './dictionaries/tr.json';
import en from './dictionaries/en.json';

const dictionaries = { tr, en };

export type Locale = 'tr' | 'en';
export type Dictionary = typeof tr;
export type DictionaryKeys = keyof Dictionary;

export function getDictionary(locale: Locale): Dictionary {
  // Defensive fallback
  return dictionaries[locale] || dictionaries['tr'];
}
