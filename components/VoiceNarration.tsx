import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Volume2,
  Pause,
  Play,
  Globe,
  Square,
  Speaker,
  BookOpen,
  FlaskConical,
  SkipForward,
  SkipBack,
} from "lucide-react";
import { useLanguage } from '../src/context/LanguageContext';
import { translateText } from "../src/utils/translate";

interface VoiceNarrationProps {
  sections: { title: string; content: string }[];
  language: string;
  title: string;
  slug?: string; // for session persistence per article
  explanationMode?: "beginner" | "advanced";
  onProgress?: (section: number, chunk: number) => void;
  onWordProgress?: (charIndex: number) => void;
  onTogglePlay?: (playing: boolean) => void;
}

const langTagMap: Record<string, string> = {
  en: "en-US", hi: "hi-IN", te: "te-IN", es: "es-ES", fr: "fr-FR",
  zh: "zh-CN", "zh-CN": "zh-CN", "zh-TW": "zh-TW", pt: "pt-BR",
  de: "de-DE", it: "it-IT", ja: "ja-JP", ko: "ko-KR", ru: "ru-RU",
  ar: "ar-SA", tr: "tr-TR", nl: "nl-NL", pl: "pl-PL", vi: "vi-VN",
  th: "th-TH", id: "id-ID", sv: "sv-SE", no: "no-NO", da: "da-DK",
  fi: "fi-FI", cs: "cs-CZ", el: "el-GR", hu: "hu-HU", ro: "ro-RO",
  sk: "sk-SK", uk: "uk-UA", ms: "ms-MY",
  bn: "bn-IN", ta: "ta-IN", kn: "kn-IN", ml: "ml-IN", gu: "gu-IN",
  mr: "mr-IN", pa: "pa-IN", ur: "ur-PK", he: "he-IL", fa: "fa-IR",
  bg: "bg-BG", hr: "hr-HR", sr: "sr-RS", sl: "sl-SI", et: "et-EE",
  lv: "lv-LV", lt: "lt-LT", af: "af-ZA", am: "am-ET", az: "az-AZ",
  be: "be-BY", bs: "bs-BA", ca: "ca-ES", cy: "cy-GB", eu: "eu-ES",
  ga: "ga-IE", gl: "gl-ES", hy: "hy-AM", is: "is-IS", jv: "jv-ID",
  ka: "ka-GE", kk: "kk-KZ", km: "km-KH", ky: "ky-KG", lo: "lo-LA",
  mk: "mk-MK", mn: "mn-MN", mt: "mt-MT", my: "my-MM", ne: "ne-NP",
  si: "si-LK", sq: "sq-AL", sw: "sw-KE", tg: "tg-TJ", tk: "tk-TM",
  tl: "tl-PH", uz: "uz-UZ", yo: "yo-NG", zu: "zu-ZA",
  pt_PT: "pt-PT", en_AU: "en-AU", en_GB: "en-GB", es_MX: "es-MX",
};

// ─── Conversational Templates (Human-like, not AI-sounding) ─────────────────
const CONVERSATIONAL_TEMPLATES: Record<string, any> = {
  en: {
    beginner: {
      modeIntro: "Okay so, I'm going to keep this super simple. No jargon, no complicated stuff — just plain English.",
      summaryOpeners: ["Alright, so here's the deal —", "Let me just quickly explain what this is about.", "Okay listen, this is actually pretty straightforward once you get it."],
      explanationOpeners: ["So think of it this way —", "Imagine this scenario, right?", "Here's a real-world way to look at this.", "Honestly, the easiest way to understand this is —"],
      attackOpeners: ["So here's what actually happens when someone tries to exploit this —", "Picture this — an attacker is sitting at their laptop, and here's what they do step by step.", "Let me walk you through the attack in plain terms."],
      impactOpeners: ["Now here's why this actually matters to real people —", "Okay so imagine if this happened to you personally —", "Think about what could go wrong here. Like really think about it."],
      preventionOpeners: ["Good news — the fix is actually not that complicated.", "Here's how developers can protect against this.", "So what do you do to stop this from happening?"],
      conclusionOpeners: ["Alright, let's wrap this up. Here's what you should take away from this.", "So to summarize everything we just covered —", "Quick recap before we finish —"],
      fillers: ["right?", "you know?", "basically", "honestly", "so yeah,", "and look —", "here's the thing —"],
      transitions: { beginner: "First, let me give you a real-world analogy so this clicks immediately.", attack: "Now let me show you exactly how this gets exploited, step by step.", tech: "Okay, now let's get into the actual technical stuff — but I'll keep it clear." }
    },
    advanced: {
      modeIntro: "Alright, buckle up. We're going deep on this one — full technical breakdown, architecture analysis, the works.",
      summaryOpeners: ["From a security research standpoint, here's what we're dealing with —", "Let's establish the threat model first.", "Right, so technically speaking, the core issue is this —"],
      explanationOpeners: ["At its root, this vulnerability exists because —", "From an attacker's perspective, the interesting thing here is —", "Let's break down the underlying mechanism."],
      attackOpeners: ["Alright, from a penetration tester's perspective, the attack surface looks like this —", "Here's how the exploitation chain actually unfolds in a real engagement —", "Let's walk through the attack methodology step by step."],
      impactOpeners: ["From a CIA Triad analysis — Confidentiality, Integrity, and Availability — here's the breakdown.", "The business risk here is significant, and here's why —", "Let's map this to the CVSS scoring model to quantify the risk."],
      preventionOpeners: ["The remediation strategy here follows a defense-in-depth model.", "From a secure-by-design perspective, here's what needs to change at the code level.", "This is where server-side authorization checks become non-negotiable."],
      conclusionOpeners: ["To synthesize everything we've covered from a threat modeling perspective —", "Here are the key technical takeaways for your security architecture decisions —", "Strategic conclusion — here's what this means for your security posture."],
      fillers: ["right?", "technically speaking,", "from an attacker's POV,", "architecturally,", "and this is where it gets interesting —", "look —"],
      transitions: { beginner: "Let's establish the conceptual foundation before getting into the technical weeds.", attack: "Analyzing the attack surface — here's the exploitation flow.", tech: "Time for the technical deep dive. Let's look at exactly what's happening under the hood." }
    },
    mentor: "So here's what I want you to understand —",
    student: "That makes sense. And then what happens?",
  },
  hi: {
    beginner: {
      modeIntro: "Ek minute, main ye simple rakhunga. Koi complicated words nahi, bas normal baat.",
      summaryOpeners: ["Sunte hain, baat ye hai —", "Seedha point pe aate hain.", "Yaar, ye samajhna actually easy hai —"],
      explanationOpeners: ["Sochiye ek real situation —", "Imagine karo ek scenario —", "Simple example se samjhte hain —"],
      attackOpeners: ["Toh attack kaise hota hai, ekdam seedha —", "Dekho, ek hacker kya karta hai —", "Step by step chalte hain attack mein."],
      impactOpeners: ["Ab sochiye iska asar kya hoga —", "Agar ye aapke saath hua toh —", "Ye kyun dangerous hai, simple terms mein —"],
      preventionOpeners: ["Sab theek ho sakta hai, fix simple hai —", "Developer kya kare is se bachne ke liye —"],
      conclusionOpeners: ["Chaliye wrap up karte hain —", "Ek baar summary karte hain —"],
      fillers: ["samjhe?", "na?", "basically", "sach mein", "toh yaar —", "dekho —"],
      transitions: { beginner: "Pehle ek chhoti si story se samajhte hain.", attack: "Ab attack dekhte hain.", tech: "Chalo ab technical mein jaate hain." }
    },
    advanced: {
      modeIntro: "Theek hai, poora technical breakdown karte hain. Full depth mein jaenge.",
      summaryOpeners: ["Security research ke hisab se —", "Technical roop se, ye issue ye hai —"],
      explanationOpeners: ["Root cause analysis karte hain —", "Attacker ke nazariye se dekhe toh —"],
      attackOpeners: ["Penetration testing mein, attack surface ye dikh raha hai —", "Exploitation chain ye hai —"],
      impactOpeners: ["CIA Triad ke through impact dekhe toh —", "Business risk significant hai —"],
      preventionOpeners: ["Remediation strategy ye hai —", "Secure-by-design approach mein —"],
      conclusionOpeners: ["Technical takeaways summarize karte hain —", "Security architecture ke liye conclusions —"],
      fillers: ["technically,", "architecture mein,", "attacker ke POV se,", "dekho —"],
      transitions: { beginner: "Pehle concept samajhte hain.", attack: "Attack surface analyze karte hain.", tech: "Technical depth mein jaate hain." }
    },
    mentor: "Ye samjho —",
    student: "Achha, phir kya hota hai?",
  },
  te: {
    beginner: {
      modeIntro: "Idi nenu chala simple ga cheppabotunna. Complicated English lekunda, basic levels lo matladukundam.",
      summaryOpeners: ["Meeku idhi ardam kavalante —", "Idhi chudandi, main vishayam enti ante —", "Idhi actually chala easy vishayam andi —"],
      explanationOpeners: ["Oka real example teskuni oohinchukundam —", "Oka sari idhi chudandi —", "Simple ga cheppalante —"],
      attackOpeners: ["Oka hacker enthi chesthado chudandi —", "Vallu system loki ela enter avutharu ante —", "Step by step attack ela untadho vinandi —"],
      impactOpeners: ["Idi mana meeda ela impact chupistundo telusa —", "Idhi nijanga entha dangerous oh chudandi —", "Idi happen ayithe em avuthundo oohinchukondi —"],
      preventionOpeners: ["E problem ki solution chala simple andi —", "Code rasethappudu developer em marchukovali ante —", "Manalni manam ela protect chesukovalante —"],
      conclusionOpeners: ["Sare muginchedham —", "Mothaniki manam em nerchukinnam ante —", "Short ga recap cheddam —"],
      fillers: ["andi", "kadha?", "chudandi,", "okay na?", "basically", "oka sari aalochinchandi —"],
      transitions: { beginner: "Mundhu oka easy example chuddam andi.", attack: "Ippudu asalainadhi, attack ela jarugutuundo chuddam.", tech: "Konchem technical ga veldam vinandi." }
    },
    advanced: {
      modeIntro: "Sare, poortiga technical ga veldam. Architecture, code deep dive cheddam.",
      summaryOpeners: ["Security research lo idhi main ga —", "Technical ga cheyyali ante —"],
      explanationOpeners: ["Root cause enti ante —", "Attacker perspective lo chusthe —"],
      attackOpeners: ["Pentest lo attack surface ila untundi —", "Exploitation chain ila veltundi —"],
      impactOpeners: ["CIA Triad analysis lo chudandi —", "Risk chala darunanga undi —"],
      preventionOpeners: ["Remediation strategy chudandi —", "Secure design approach lo idhi mukhyam —"],
      conclusionOpeners: ["Technical takeaways ivvi andi —", "Security posture ki idi chala important —"],
      fillers: ["technically andi,", "architecture lo chudandi,", "attacker POV lo,", "vinandi —"],
      transitions: { beginner: "Concept establish cheskundam andi.", attack: "Attack surface analyze chesdham.", tech: "Technical depth lo veldam." }
    },
    mentor: "Idhi kachithanga artham chesukondi —",
    student: "Okay andi, tarvata enthi?",
  },
};

const FEMALE_VOICE_KEYWORDS = ["female", "woman", "zira", "samantha", "hazel", "victoria", "aria", "jenny", "emma", "michelle", "lisa", "sarah", "natasha", "moira", "tessa", "fiona", "neerja", "aditi", "heera", "kalpana", "swara", "shruti", "puja", "madhur"];
const MALE_VOICE_KEYWORDS = ["male", "man", "david", "mark", "alex", "george", "ryan", "guy", "james", "tom", "daniel", "eric", "ravi", "mohan", "luca", "diego", "thomas", "arthur", "amit", "madhur", "hemant"];

// ─── Session Persistence helpers ─────────────────────────────────────────────
function getSessionKey(slug: string, mode: string, lang: string) {
  return `narration_pos_${slug}_${mode}_${lang}`;
}

function saveNarrationPosition(slug: string, mode: string, lang: string, sectionIdx: number, chunkIdx: number) {
  try {
    localStorage.setItem(getSessionKey(slug, mode, lang), JSON.stringify({ s: sectionIdx, c: chunkIdx, ts: Date.now() }));
  } catch {}
}

function loadNarrationPosition(slug: string, mode: string, lang: string): { s: number; c: number } | null {
  try {
    const raw = localStorage.getItem(getSessionKey(slug, mode, lang));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Only restore positions from within the last 7 days
    if (Date.now() - (parsed.ts || 0) > 7 * 24 * 60 * 60 * 1000) return null;
    return { s: parsed.s ?? 0, c: parsed.c ?? 0 };
  } catch {}
  return null;
}

export const VoiceNarration: React.FC<VoiceNarrationProps> = ({
  sections,
  language,
  title,
  slug = "article",
  explanationMode = "advanced",
  onProgress,
  onTogglePlay,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [hasResumableSession, setHasResumableSession] = useState(false);
  const [missingVoiceLang, setMissingVoiceLang] = useState<string | null>(null);

  // Track total chunks across all sections for progress bar
  const [totalChunksCount, setTotalChunksCount] = useState(0);
  const [completedChunksCount, setCompletedChunksCount] = useState(0);

  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const narrationSessionId = useRef(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Check for resumable session on mount / mode change
  useEffect(() => {
    const saved = loadNarrationPosition(slug, explanationMode, language);
    setHasResumableSession(!!(saved && (saved.s > 0 || saved.c > 0)));
  }, [slug, explanationMode, language]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeechSupported(false);
      return;
    }
    synthRef.current = window.speechSynthesis;
    const loadVoices = () => {
      try { setVoices(synthRef.current!.getVoices()); } catch {}
    };
    loadVoices();
    if (synthRef.current) synthRef.current.onvoiceschanged = loadVoices;

    return () => {
      try { narrationSessionId.current = 0; synthRef.current?.cancel(); } catch {}
    };
  }, []);

  const getChunks = (text: string): string[] => {
    if (!text) return [];
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (!sentences) return [text];
    const chunks: string[] = [];
    let current = "";
    sentences.forEach((s, i) => {
      current += s.trim() + " ";
      if ((i + 1) % 2 === 0 || i === sentences.length - 1) {
        if (current.trim()) chunks.push(current.trim());
        current = "";
      }
    });
    return chunks.length ? chunks : [text];
  };

  const [dynamicTemplates, setDynamicTemplates] = useState<any>(null);

  useEffect(() => {
    const prepareTemplates = async () => {
      if (CONVERSATIONAL_TEMPLATES[language]) { setDynamicTemplates(CONVERSATIONAL_TEMPLATES[language]); return; }
      const base = CONVERSATIONAL_TEMPLATES.en;
      try {
        // Translate all template strings in parallel — massive speedup over sequential awaits
        const [
          beginnerIntro, advancedIntro,
          bTransBeginner, bTransAttack, bTransTech,
          aTransBeginner, aTransAttack, aTransTech,
          ...openers
        ] = await Promise.all([
          translateText(base.beginner.modeIntro, language),
          translateText(base.advanced.modeIntro, language),
          translateText(base.beginner.transitions.beginner, language),
          translateText(base.beginner.transitions.attack, language),
          translateText(base.beginner.transitions.tech, language),
          translateText(base.advanced.transitions.beginner, language),
          translateText(base.advanced.transitions.attack, language),
          translateText(base.advanced.transitions.tech, language),
          // All openers and fillers in one batch
          ...base.beginner.summaryOpeners.map((s: string) => translateText(s, language)),
          ...base.beginner.explanationOpeners.map((s: string) => translateText(s, language)),
          ...base.beginner.attackOpeners.map((s: string) => translateText(s, language)),
          ...base.beginner.impactOpeners.map((s: string) => translateText(s, language)),
          ...base.beginner.preventionOpeners.map((s: string) => translateText(s, language)),
          ...base.beginner.conclusionOpeners.map((s: string) => translateText(s, language)),
          ...base.beginner.fillers.map((s: string) => translateText(s, language)),
        ]);

        // Reconstruct openers from flat array
        let idx = 0;
        const pick = (arr: string[]) => openers.slice(idx, idx += arr.length);
        const translated = {
          beginner: {
            ...base.beginner,
            modeIntro: beginnerIntro,
            transitions: { beginner: bTransBeginner, attack: bTransAttack, tech: bTransTech },
            summaryOpeners: pick(base.beginner.summaryOpeners),
            explanationOpeners: pick(base.beginner.explanationOpeners),
            attackOpeners: pick(base.beginner.attackOpeners),
            impactOpeners: pick(base.beginner.impactOpeners),
            preventionOpeners: pick(base.beginner.preventionOpeners),
            conclusionOpeners: pick(base.beginner.conclusionOpeners),
            fillers: pick(base.beginner.fillers),
          },
          advanced: {
            ...base.advanced,
            modeIntro: advancedIntro,
            transitions: { beginner: aTransBeginner, attack: aTransAttack, tech: aTransTech },
          },
          mentor: base.mentor,
          student: base.student,
        };
        setDynamicTemplates(translated);
      } catch { setDynamicTemplates(base); }
    };
    prepareTemplates();
  }, [language]);

  const transformToConversational = (sectionTitle: string, content: string, mode: "beginner" | "advanced", isFirstSection: boolean): string => {
    const t = dynamicTemplates || CONVERSATIONAL_TEMPLATES.en;
    const modeT = t[mode] || t.advanced;
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const filler = () => pick(modeT.fillers || ["right?"]);
    const lower = sectionTitle.toLowerCase();
    let opener = "";
    const modeIntroPrefix = isFirstSection ? `${modeT.modeIntro || ""} ` : "";

    if (lower.includes("summary") || lower.includes("executive")) opener = `${modeIntroPrefix}${pick(modeT.summaryOpeners)}`;
    else if (lower.includes("beginner") || lower.includes("simple") || lower.includes("explanation") || lower.includes("intro")) opener = mode === 'beginner' ? pick(modeT.explanationOpeners) : pick(modeT.explanationOpeners);
    else if (lower.includes("attack") || lower.includes("workflow") || lower.includes("exploit") || lower.includes("test")) opener = pick(modeT.attackOpeners);
    else if (lower.includes("impact") || lower.includes("risk") || lower.includes("cia") || lower.includes("cvss")) opener = pick(modeT.impactOpeners);
    else if (lower.includes("prevention") || lower.includes("fix") || lower.includes("strategy") || lower.includes("remediat") || lower.includes("mistake")) opener = pick(modeT.preventionOpeners);
    else if (lower.includes("takeaway") || lower.includes("conclusion") || lower.includes("strategic") || lower.includes("key")) opener = pick(modeT.conclusionOpeners);
    else if (lower.includes("technical") || lower.includes("advanced") || lower.includes("cause") || lower.includes("architecture") || lower.includes("root")) opener = modeT.transitions?.tech || "Let's look at the technical internals.";
    else opener = `${filler()} ${t.mentor || "Here's what matters here —"}`;

    const cleaned = content.replace(/[#*`_]/g, "").replace(/\n/g, " ").trim();
    return `${opener} ${cleaned}`.trim();
  };

  const allSectionsChunks = useMemo(() => {
    const result = sections.map((s, idx) => ({
      title: s.title,
      chunks: getChunks(transformToConversational(s.title, s.content, explanationMode, idx === 0)),
    }));
    // Calculate total chunks for progress bar
    const total = result.reduce((acc, s) => acc + s.chunks.length, 0);
    setTotalChunksCount(total);
    return result;
  }, [sections, language, dynamicTemplates, explanationMode]);

  // Calculate completed chunks count whenever position changes
  useEffect(() => {
    let count = 0;
    for (let i = 0; i < currentSectionIndex && i < allSectionsChunks.length; i++) {
      count += allSectionsChunks[i].chunks.length;
    }
    count += currentChunkIndex;
    setCompletedChunksCount(count);

    // Persist position to localStorage
    if (isPlaying) {
      saveNarrationPosition(slug, explanationMode, language, currentSectionIndex, currentChunkIndex);
    }
  }, [currentSectionIndex, currentChunkIndex, allSectionsChunks, slug, explanationMode, language, isPlaying]);

  const progressPercent = totalChunksCount > 0 ? Math.round((completedChunksCount / totalChunksCount) * 100) : 0;
  const progressSectionLabel = allSectionsChunks[currentSectionIndex]?.title || "";

  const queueChunk = useCallback((sIdx: number, cIdx: number) => {
    const synth = synthRef.current;
    if (!synth || narrationSessionId.current === 0) return;
    const currentSessionId = narrationSessionId.current;

    if (sIdx >= allSectionsChunks.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      onTogglePlay?.(false);
      // Clear saved position when finished
      try { localStorage.removeItem(getSessionKey(slug, explanationMode, language)); } catch {}
      setHasResumableSession(false);
      return;
    }

    const section = allSectionsChunks[sIdx];
    if (cIdx >= section.chunks.length) {
      setTimeout(() => { if (currentSessionId === narrationSessionId.current) queueChunk(sIdx + 1, 0); }, 400);
      return;
    }

    setCurrentSectionIndex(sIdx);
    setCurrentChunkIndex(cIdx);
    onProgress?.(sIdx, cIdx);

    const text = section.chunks[cIdx];

    try {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langTag = langTagMap[language] || language;
      const langCode = langTag.substring(0, 2);
      
      // 1. Try exact match (e.g. te-IN)
      let langVoices = voices.filter(v => v.lang === langTag);
      // 2. Try partial match (e.g. te-*)
      if (langVoices.length === 0) langVoices = voices.filter(v => v.lang.startsWith(langCode));
      
      if (langVoices.length === 0 && language !== 'en') {
        setMissingVoiceLang(language);
      } else {
        setMissingVoiceLang(null);
      }

      // We DO NOT fallback to English if the user selected a different language.
      // If no voices exist for their language, it's better to stay silent or let the browser try
      // than to speak Telugu/Hindi text using an English voice.

      // Remove the "premium" AI voice bias to get a more casual/standard voice
      const genderKeywords = voiceGender === 'female' ? FEMALE_VOICE_KEYWORDS : MALE_VOICE_KEYWORDS;
      
      // Try to find a voice matching the requested gender within the language
      let genderFiltered = langVoices.filter(v => genderKeywords.some(keyword => v.name.toLowerCase().includes(keyword)));
      if (genderFiltered.length === 0) genderFiltered = langVoices;

      // Prefer local/native voices over cloud ones if possible for a more 'casual' feel
      const sortedVoices = [...genderFiltered].sort((a, b) => {
        const aLocal = a.localService ? 1 : 0;
        const bLocal = b.localService ? 1 : 0;
        return bLocal - aLocal; // Local first
      });

      const voice = sortedVoices[0] || langVoices[0];
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang; 
      } else {
        utterance.lang = langTag;
      }
      utterance.rate = speed;

      utterance.onend = () => {
        if (currentSessionId === narrationSessionId.current && isPlayingRef.current && !isPausedRef.current) {
          setTimeout(() => queueChunk(sIdx, cIdx + 1), 120);
        }
      };
      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        if (currentSessionId === narrationSessionId.current && isPlayingRef.current) {
          setTimeout(() => queueChunk(sIdx, cIdx + 1), 200);
        }
      };
      synth.speak(utterance);
    } catch (e) {
      console.warn("SpeechSynthesis unavailable:", e);
      setIsSpeechSupported(false);
    }
  }, [allSectionsChunks, voices, language, speed, voiceGender, slug, explanationMode, onProgress, onTogglePlay]);

  const startFrom = useCallback((sIdx: number, cIdx: number) => {
    const synth = synthRef.current;
    if (!synth) return;
    synth.cancel();
    narrationSessionId.current += 1;
    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsPaused(false);
    isPausedRef.current = false;
    setCurrentSectionIndex(sIdx);
    setCurrentChunkIndex(cIdx);
    onTogglePlay?.(true);
    setTimeout(() => queueChunk(sIdx, cIdx), 80);
  }, [queueChunk, onTogglePlay]);

  const handlePlayPause = () => {
    const synth = synthRef.current;
    if (!synth || !isSpeechSupported) return;
    try {
      if (isPausedRef.current) {
        synth.resume(); setIsPaused(false); isPausedRef.current = false;
      } else if (isPlayingRef.current) {
        synth.pause(); setIsPaused(true); isPausedRef.current = true;
      } else {
        startFrom(0, 0);
      }
    } catch (e) { console.warn("Voice control error:", e); }
  };

  const handleStop = () => {
    narrationSessionId.current = 0;
    isPlayingRef.current = false;
    isPausedRef.current = false;
    try { synthRef.current?.cancel(); } catch {}
    setIsPlaying(false);
    setIsPaused(false);
    onTogglePlay?.(false);
    setCurrentSectionIndex(0);
    setCurrentChunkIndex(0);
  };

  // ─── Skip forward: next section ──────────────────────────────────────────
  const handleSkipForward = () => {
    const nextSection = currentSectionIndex + 1;
    if (nextSection < allSectionsChunks.length) {
      if (isPlaying) { startFrom(nextSection, 0); }
      else { setCurrentSectionIndex(nextSection); setCurrentChunkIndex(0); }
    }
  };

  // ─── Skip backward: prev section or restart current ──────────────────────
  const handleSkipBack = () => {
    const prevSection = currentChunkIndex > 1 || currentSectionIndex === 0
      ? currentSectionIndex
      : currentSectionIndex - 1;
    const targetSection = Math.max(0, prevSection);
    if (isPlaying) { startFrom(targetSection, 0); }
    else { setCurrentSectionIndex(targetSection); setCurrentChunkIndex(0); }
  };

  // ─── Seek via progress bar click ─────────────────────────────────────────
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetChunk = Math.floor(pct * totalChunksCount);
    // Find which section+chunk this corresponds to
    let remaining = targetChunk;
    let sIdx = 0; let cIdx = 0;
    for (let i = 0; i < allSectionsChunks.length; i++) {
      const len = allSectionsChunks[i].chunks.length;
      if (remaining < len) { sIdx = i; cIdx = remaining; break; }
      remaining -= len;
      sIdx = i; cIdx = allSectionsChunks[i].chunks.length - 1;
    }
    if (isPlaying) { startFrom(sIdx, cIdx); }
    else { setCurrentSectionIndex(sIdx); setCurrentChunkIndex(cIdx); }
  };

  // ─── Resume from last session ─────────────────────────────────────────────
  const handleResume = () => {
    const saved = loadNarrationPosition(slug, explanationMode, language);
    if (saved) startFrom(saved.s, saved.c);
  };

  if (!isSpeechSupported) {
    return (
      <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <Speaker size={14} className="text-text-muted" />
        <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Voice narration not available in this browser</span>
      </div>
    );
  }

  const modeIcon = explanationMode === 'beginner' ? <BookOpen size={12} /> : <FlaskConical size={12} />;
  const modeLabel = explanationMode === 'beginner' ? "Beginner" : "Advanced";

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">

      {/* ── Header Row: icon + title + controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-2 rounded-xl flex-shrink-0 ${isPlaying ? "bg-accent-primary/20 text-accent-primary" : "bg-white/5 text-text-muted"}`}>
            {isPlaying ? <Volume2 size={14} /> : <Speaker size={14} />}
          </div>
          <div className="min-w-0">
            <h4 className="font-orbitron font-black text-[10px] uppercase tracking-widest text-text-primary truncate">Voice Narration</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider ${explanationMode === 'beginner' ? 'text-green-400' : 'text-accent-primary'}`}>
                {modeIcon} {modeLabel}
              </span>
              {isPlaying && (
                <>
                  <span className="text-text-muted/30 text-[8px]">·</span>
                  <span className="font-mono text-[8px] text-text-muted uppercase truncate max-w-[120px]" title={progressSectionLabel}>
                    §{currentSectionIndex + 1}: {progressSectionLabel}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Gender */}
          <button
            onClick={() => setVoiceGender(g => g === 'female' ? 'male' : 'female')}
            className="px-2 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black font-mono text-text-muted transition-colors uppercase border border-white/5"
            title="Toggle Voice Gender"
          >{voiceGender === 'female' ? '♀ F' : '♂ M'}</button>

          {/* Speed */}
          <button
            onClick={() => setSpeed(s => s >= 2 ? 0.5 : Math.round((s + 0.25) * 100) / 100)}
            className="px-2 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black font-mono text-text-muted transition-colors border border-white/5"
            title="Playback Speed"
          >{speed}x</button>

          {/* Skip Back */}
          <button onClick={handleSkipBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-muted transition-colors" title="Previous Section">
            <SkipBack size={12} />
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="p-2.5 bg-accent-primary text-bg rounded-xl shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)] hover:scale-105 active:scale-95 transition-transform"
            title={isPlaying && !isPaused ? "Pause" : "Play"}
          >
            {isPlaying && !isPaused ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>

          {/* Skip Forward */}
          <button onClick={handleSkipForward} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-muted transition-colors" title="Next Section">
            <SkipForward size={12} />
          </button>

          {/* Stop */}
          {isPlaying && (
            <button onClick={handleStop} className="p-2 bg-white/5 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors" title="Stop">
              <Square size={12} fill="currentColor" />
            </button>
          )}
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="space-y-1">
        <div
          className="relative w-full h-2 bg-white/5 rounded-full cursor-pointer group overflow-hidden border border-white/5"
          onClick={handleSeek}
          title="Click to seek"
        >
          {/* Track fill */}
          <div
            className={`h-full rounded-full transition-all duration-300 ${isPlaying ? 'bg-accent-primary shadow-[0_0_8px_rgba(var(--accent-primary-rgb),0.5)]' : 'bg-white/20'}`}
            style={{ width: `${progressPercent}%` }}
          />
          {/* Thumb indicator */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-accent-primary bg-bg shadow-md transition-all duration-300 -ml-1.5 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            style={{ left: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-[8px] text-text-muted/50">{completedChunksCount}/{totalChunksCount} chunks</span>
          <span className="font-mono text-[8px] text-text-muted/50">{progressPercent}%</span>
        </div>
      </div>

      {/* ── Waveform when playing ── */}
      {isPlaying && !isPaused && (
        <div className="flex items-end gap-[3px] px-1 h-4 justify-start opacity-70" aria-hidden="true">
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map((i) => (
            <span key={i} className="voice-bar w-[2px] rounded-full bg-accent-primary" style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      )}

      {/* ── Resume banner ── */}
      {hasResumableSession && !isPlaying && (
        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-accent-primary/[0.06] border border-accent-primary/20 rounded-xl">
          <span className="font-mono text-[8px] text-accent-primary/80">📍 You have a saved position. Resume where you left off?</span>
          <button
            onClick={handleResume}
            className="flex-shrink-0 px-2.5 py-1 bg-accent-primary/15 hover:bg-accent-primary/25 border border-accent-primary/30 text-accent-primary rounded-lg font-mono text-[8px] font-black uppercase transition-colors"
          >Resume</button>
        </div>
      )}

      {/* ── Missing Voice Warning ── */}
      {missingVoiceLang && (
        <div className="flex bg-yellow-500/10 text-yellow-500 p-2 px-3 text-[9px] font-mono leading-tight rounded-xl border border-yellow-500/20">
          ⚠️ Your device does not have a {missingVoiceLang.toUpperCase()} TTS voice installed. Audio may default to English or remain silent. Try using Chrome or installing the OS language pack.
        </div>
      )}

      {/* ── Language + mode info strip ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
          <Globe size={9} className="text-accent-primary" />
          <span className="font-mono text-[8px] text-text-muted uppercase tracking-tighter">{language.toUpperCase()} · {langTagMap[language] || "Native"}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[8px] font-mono uppercase tracking-tighter ${
          explanationMode === 'beginner' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-accent-primary/10 border-accent-primary/20 text-accent-primary'
        }`}>
          {modeIcon}
          <span>{explanationMode === 'beginner' ? 'Beginner narration' : 'Advanced narration'}</span>
        </div>
      </div>
    </div>
  );
};
