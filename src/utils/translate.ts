// Translation cache: memory (fastest) → sessionStorage → localStorage (persistent)
const memoryCache = new Map<string, string>();

/**
 * Preload all translation cache entries from localStorage into memory cache.
 * Call this on app startup so that subsequent readCache() calls are instant.
 */
export function preloadTranslationCache(): void {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('t_')) {
        const val = localStorage.getItem(key);
        if (val) memoryCache.set(key, val);
      }
    }
  } catch { /* ignore */ }
}

/**
 * Synchronously get a cached translation. Returns null if not cached.
 * Use this to show instant cached results without waiting for API.
 */
export function getCachedTranslation(text: string, targetLang: string): string | null {
  if (!text || targetLang === 'en') return text;
  const key = getCacheKey(text, targetLang);
  return readCache(key);
}


// Simple hash to shorten localStorage keys
function shortHash(str: string): string {
  let h = 0;
  for (let i = 0; i < Math.min(str.length, 200); i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function getCacheKey(text: string, targetLang: string): string {
  return `t_${targetLang}_${shortHash(text)}`;
}

function readCache(key: string): string | null {
  if (memoryCache.has(key)) return memoryCache.get(key)!;
  try {
    const s = sessionStorage.getItem(key);
    if (s) { memoryCache.set(key, s); return s; }
  } catch { /* ignore */ }
  try {
    const l = localStorage.getItem(key);
    if (l) { memoryCache.set(key, l); return l; }
  } catch { /* ignore */ }
  return null;
}

function writeCache(key: string, value: string): void {
  memoryCache.set(key, value);
  try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'en') return text;

  const key = getCacheKey(text, targetLang);
  const cached = readCache(key);
  if (cached) return cached;

  // Fetch with timeout (10 seconds max)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ q: text }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) return text;
    const data = await response.json();

    if (data && data[0]) {
      const translated = data[0]
        .filter((segment: any) => segment && segment[0])
        .map((segment: any) => segment[0])
        .join('');

      if (translated) {
        writeCache(key, translated);
        return translated;
      }
    }
    return text;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === 'AbortError') {
      console.warn('Translation timed out, using original text');
    } else {
      console.warn('Translation error:', error?.message);
    }
    return text;
  }
}

/**
 * Batch-translates an array of strings in a single request.
 * Falls back to individual requests if splitting fails.
 */
export async function batchTranslate(texts: string[], targetLang: string): Promise<string[]> {
  if (!texts.length || targetLang === 'en') return texts;

  // Check if all are already cached
  const keys = texts.map(t => getCacheKey(t, targetLang));
  const cached = keys.map(k => readCache(k));
  if (cached.every(v => v !== null)) {
    return cached as string[];
  }

  const delimiter = " [|||] ";
  const combinedText = texts.join(delimiter);

  try {
    const translatedCombined = await translateText(combinedText, targetLang);
    const parts = translatedCombined.split(/[\[\s]*\|\|\|[\]\s]*/);
    const results = parts.map(p => p.trim()).filter(p => p.length > 0);

    if (results.length === texts.length) {
      // Cache each individual result
      results.forEach((r, i) => {
        if (r && texts[i]) writeCache(keys[i], r);
      });
      return results;
    }

    // Fallback: individual requests (use cached where available)
    console.warn("Batch split mismatch, falling back to individual requests");
    return Promise.all(texts.map(t => translateText(t, targetLang)));
  } catch (e) {
    console.warn("Batch translation failed, falling back");
    return Promise.all(texts.map(t => translateText(t, targetLang)));
  }
}

export async function translateObject(obj: any, targetLang: string): Promise<any> {
  if (!obj || targetLang === 'en') return obj;

  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, targetLang)));
  }

  if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj);
    const results = await Promise.all(
      keys.map(key => translateObject(obj[key], targetLang))
    );
    const translatedObj: any = {};
    keys.forEach((key, i) => { translatedObj[key] = results[i]; });
    return translatedObj;
  }

  if (typeof obj === 'string') {
    return translateText(obj, targetLang);
  }

  return obj;
}

export async function translateDossier(dossier: any, targetLang: string): Promise<any> {
  if (!dossier || targetLang === 'en') return dossier;

  const fieldsToTranslate = [
    'executive_summary', 'introduction', 'simple_explanation', 'technical_deep_dive',
    'attack_workflow', 'application_architecture', 'root_cause_analysis', 'impact_analysis',
    'cvss_analysis', 'cvss_educational', 'cwe_mapping', 'cwe_educational', 'cve_references',
    'cve_educational', 'mitre_mapping', 'mitre_educational', 'detection_methodologies',
    'manual_checklist', 'prevention_strategy', 'industry_impact', 'automated_tools',
    'developer_mistakes', 'bug_bounty_example', 'comparison_table', 'key_takeaways',
    'strategic_conclusion', 'code_examples', 'ptes_mapping', 'osstmm_analysis', 'where_to_test'
  ];

  // Filter only fields that exist in the dossier
  const presentFields = fieldsToTranslate.filter(f => dossier[f] !== undefined);

  // Translate ALL fields in parallel — was sequential before (massive bottleneck)
  const translations = await Promise.all(
    presentFields.map(field => translateObject(dossier[field], targetLang))
  );

  const translatedDossier = { ...dossier };
  presentFields.forEach((field, i) => {
    translatedDossier[field] = translations[i];
  });

  return translatedDossier;
}
