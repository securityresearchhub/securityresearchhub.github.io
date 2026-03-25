import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Tag,
  Share2,
  ThumbsUp,
  Check,
  Terminal,
  Database,
  Shield,
  Target,
  Activity,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Code2,
  AlertTriangle,
  CheckCircle,
  Layers,
  Bug,
  Wrench,
  FileText,
  Globe,
  BookOpen,
  FlaskConical,
  Play,
  X,
  Info,
  List,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Zap,
  Search,
  Square,
  Pause,
} from "lucide-react";
import { blogPosts } from "../data/blogPosts";
import { PageTransition } from "../components/PageTransition";
import { db } from "../src/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ExploitationLab } from "../components/ExploitationLab";
import {
  AnimatedWorkflowDiagram,
  AnimatedArchDiagram,
  AnimatedRootCauseDiagram,
} from "../components/AnimatedDiagrams";
import { translateDossier, translateText, batchTranslate, translateObject, preloadTranslationCache, getCachedTranslation } from "../src/utils/translate";
import { VoiceNarration } from "../components/VoiceNarration";
import { AdSlot } from "../components/AdSlot";
import { useLanguage } from "../src/context/LanguageContext";
import { InlineLanguageSelector } from "../components/InlineLanguageSelector";
import { BurpSimulation } from "../components/BurpSimulation";
import { TerminalSimulation } from "../components/TerminalSimulation";
import { BrowserDevToolsSimulation } from "../components/BrowserDevToolsSimulation";
import { SEO } from "../components/SEO";
import { trackEvent, pingEngagement } from "../src/utils/analytics";
import { ResearchFeedbackChatbot } from "../components/ResearchFeedbackChatbot";
import { IssueReportSystem } from "../components/IssueReportSystem";
import { LabScenario } from "../types";

const SECURITY_STANDARDS_INFO = {
  CWE: {
    represents: "CWE (Common Weakness Enumeration) is a community-developed list of software and hardware weakness types.",
    exists: "It provides a common language for describing and identifying software security flaws at their root cause level.",
    introduced: "2006",
    realWorld: "Developers and security tools use CWE to categorize vulnerabilities, allowing teams to identify systemic coding errors and prevent future flaws during the design phase."
  },
  CVE: {
    represents: "CVE (Common Vulnerabilities and Exposures) is a list of publicly disclosed cybersecurity vulnerabilities.",
    exists: "It serves as a unique identifier for specific vulnerabilities in software products, ensuring standardized tracking.",
    introduced: "1999",
    realWorld: "Security scanners, vulnerability management platforms, and patch management systems rely on CVE identifiers to track known weaknesses across global infrastructures."
  },
  CVSS: {
    represents: "CVSS (Common Vulnerability Scoring System) is an open framework for communicating the characteristics and severity of software vulnerabilities.",
    exists: "It translates technical vulnerability details into a numerical score (0-10) to help organizations prioritize remediation.",
    introduced: "2005",
    realWorld: "Incident response teams use CVSS scores to decide which vulnerabilities to patch first during an emergency, focusing on those with the highest risk of exploitation."
  },
  MITRE: {
    represents: "MITRE ATT&CK® is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations.",
    exists: "It provides a structured 'playbook' of how attackers operate, helping defenders build more effective detection and response strategies.",
    introduced: "2013",
    realWorld: "Security Operations Centers (SOC) map their detection alerts to MITRE ATT&CK techniques to visualize gaps in their defenses and simulate realistic cyber-attacks."
  }
};

// ─── Collapsible Research Section ───────────────────────────────────────────
const Section = React.memo<{
  id?: string;
  num: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  accent?: boolean;
  isHighlighted?: boolean;
  hidden?: boolean;
}>(({ id, num, title, icon, children, accent, isHighlighted, hidden }) => {
  if (hidden) return null;

  const [open, setOpen] = useState(true);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasScrolledIntoView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative rounded-2xl border transition-all duration-700 ${
        isHighlighted 
          ? "border-accent-primary/40 bg-accent-primary/[0.04] shadow-[0_0_30px_rgba(var(--accent-primary-rgb),0.2)] scale-[1.01]" 
          : accent 
            ? "border-accent-primary/20 bg-accent-primary/[0.02]" 
            : "border-white/5 bg-white/[0.01]"
      }`}
    >
      <AnimatePresence>
        {isHighlighted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-transparent pointer-events-none rounded-2xl"
          />
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left group"
      >
        <div className="flex items-center gap-4">
          <span className={`font-mono text-[10px] font-black tracking-widest shrink-0 w-6 transition-colors duration-500 ${isHighlighted ? "text-accent-primary" : "text-accent-primary/40 group-hover:text-accent-primary"}`}>
            {num}
          </span>
          {icon && (
            <span className={`shrink-0 transition-all duration-500 ${isHighlighted ? "text-accent-primary scale-110 shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.3)]" : "text-accent-primary group-hover:scale-110"}`}>
              {icon}
            </span>
          )}
          <h2 className={`font-orbitron font-black text-[12.5px] uppercase italic tracking-wide transition-colors duration-500 ${isHighlighted ? "text-accent-primary" : "text-text-primary group-hover:text-accent-primary"}`}>
            {title}
          </h2>
        </div>
        {open ? (
          <ChevronUp
            size={15}
            className="text-text-muted/30 shrink-0 group-hover:text-text-muted transition-colors"
          />
        ) : (
          <ChevronDown
            size={15}
            className="text-text-muted/30 shrink-0 group-hover:text-text-muted transition-colors"
          />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/5 pt-5 relative">
              {hasScrolledIntoView ? (
                children
              ) : (
                <div className="animate-pulse h-20 bg-white/5 rounded-xl"></div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

// ─── Educational Breakdown Block ────────────────────────────────────────────
const EduBlock = React.memo<{
  type?: 'CWE' | 'CVE' | 'CVSS' | 'MITRE';
  data?: { represents?: string; exists?: string; year?: string; relation: string; realWorld?: string };
}>(({ type, data }) => {
  const standard = type ? SECURITY_STANDARDS_INFO[type] : null;
  const represents = standard?.represents || data?.represents;
  const exists = standard?.exists || data?.exists;
  const year = standard?.introduced || data?.year;
  const relation = data?.relation;
  const realWorld = standard?.realWorld || data?.realWorld;

  if (!represents && !exists && !relation) return null;

  return (
    <div className="mt-4 p-5 rounded-xl bg-white/5 border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] space-y-3 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Shield size={40} className="text-accent-primary" />
      </div>

      <div className="flex flex-col md:flex-row gap-1 md:gap-4 items-start">
        <div className="md:min-w-[150px] text-accent-primary font-black text-[10px] uppercase tracking-widest md:pt-1">
          REPRESENTS
        </div>
        <div className="text-[14px] sm:text-[15px] text-text-muted/90 leading-relaxed">
          {represents}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-4 items-start">
        <div className="md:min-w-[150px] text-accent-primary font-black text-[10px] uppercase tracking-widest md:pt-1">
          WHY IT EXISTS
        </div>
        <div className="text-[14px] sm:text-[15px] text-text-muted/90 leading-relaxed">
          {exists}
        </div>
      </div>
      {year && (
        <div className="flex flex-col md:flex-row gap-1 md:gap-4 items-start">
          <div className="md:min-w-[150px] text-accent-primary font-black text-[10px] uppercase tracking-widest md:pt-1">
            INTRODUCED
          </div>
          <div className="text-sm font-mono text-text-muted/90">{year}</div>
        </div>
      )}
      {relation && (
        <div className="flex flex-col md:flex-row gap-1 md:gap-4 items-start">
          <div className="md:min-w-[150px] text-white font-black text-[10px] uppercase tracking-widest md:pt-1">
            CORE RELATION
          </div>
          <div className="text-[14px] sm:text-[15px] text-text-primary italic leading-relaxed border-l-2 border-accent-primary/30 pl-4 py-1">
            {relation}
          </div>
        </div>
      )}
      {realWorld && (
        <div className="flex flex-col md:flex-row gap-1 md:gap-4 items-start">
          <div className="md:min-w-[150px] text-accent-primary font-black text-[10px] uppercase tracking-widest md:pt-1">
            REAL WORLD CONTEXT
          </div>
          <div className="text-[14px] sm:text-[15px] text-text-muted/90 leading-relaxed transition-colors duration-300 group-hover:text-text-primary">
            {realWorld}
          </div>
        </div>
      )}
    </div>
  );
});

const MethodologyCallout = React.memo<{
  type: "PTES" | "OSSTMM";
  stage: string;
  description: string;
}>(({ type, stage, description }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="mt-4 p-4 rounded-xl border border-accent-primary/20 bg-accent-primary/[0.02] relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-1 h-full bg-accent-primary/40 group-hover:bg-accent-primary transition-colors" />
    <div className="flex items-center gap-2 mb-2">
      <span className="font-orbitron font-black text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
        {type}: {stage}
      </span>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-accent-primary/20 to-transparent" />
    </div>
    <p className="text-[13px] text-gray-700 dark:text-text-muted leading-relaxed font-mono italic">
      {description}
    </p>
  </motion.div>
));

const Prose = React.memo<{ text?: string; fallback?: string; isHighlighted?: boolean; activeCharIndex?: number }>(({
  text,
  fallback,
  isHighlighted,
  activeCharIndex = -1
}) => {
  const highlightClass = isHighlighted ? "text-text-primary font-medium" : "text-text-muted";
  const content = text || fallback;
  
  if (!content) return null;

  if (!isHighlighted) {
    return <div className={`relative text-sm sm:text-base leading-relaxed transition-all duration-700 ${highlightClass}`}>{content}</div>;
  }

  const tokens = content.split(/(\s+)/);
  let currentCharOffset = 0;

  return (
    <div className={`relative text-sm sm:text-base leading-relaxed transition-all duration-700 ${highlightClass}`}>
      <motion.span 
        layoutId="highlight-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute -inset-x-4 -inset-y-2 bg-accent-primary/5 rounded-xl border border-accent-primary/20 pointer-events-none -z-10 shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.1)]"
      />
      {tokens.map((token, i) => {
        const start = currentCharOffset;
        const end = start + token.length;
        currentCharOffset = end;

        if (/^\s+$/.test(token)) return <span key={i}>{token}</span>;

        const isWordActive = activeCharIndex >= start && activeCharIndex < end;

        return (
          <motion.span
            key={i}
            animate={isWordActive ? {
              color: 'var(--accent-primary)',
              textShadow: '0 0 8px var(--accent-glow)',
            } : {
              color: 'inherit',
              textShadow: 'none',
            }}
            transition={{ duration: 0.15 }}
            className={`transition-colors duration-300 ${isWordActive ? 'font-black inline-block scale-105' : ''}`}
          >
            {token}
          </motion.span>
        );
      })}
    </div>
  );
});

const NumberedList = React.memo<{
  items?: string[];
  fallbackItems?: string[];
}>(({ items, fallbackItems }) => {
  const listToRender = items?.length ? items : fallbackItems;
  if (!listToRender?.length) return null;
  return (
    <ul className="space-y-3">
      {listToRender.map((item, i) => (
        <li key={i} className="flex gap-3 items-start text-sm text-text-muted">
          <span className="shrink-0 w-5 h-5 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary font-mono text-[8px] mt-0.5 shadow-[0_0_10px_var(--accent-glow-subtle)]">
            {i + 1}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
});

const CodeBlock = React.memo<{
  code?: string;
  label?: string;
  isSecure?: boolean;
}>(({ code, label, isSecure }) => {
  if (!code) return null;
  return (
    <div className="rounded-xl overflow-hidden border border-border-color bg-bg-card">
      {label && (
        <div
          className={`px-4 py-2 border-b border-border-color font-mono text-[9px] uppercase tracking-widest font-black flex items-center gap-2 ${isSecure ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}
        >
          {isSecure ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
          {label}
        </div>
      )}
      <pre className="p-5 text-[11px] text-text-primary leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap bg-bg-secondary border-t border-border-color">
        {code}
      </pre>
    </div>
  );
});

// ─── Intelligence Tag Chip with Popover ─────────────────────────────────────
const IntelTag = React.memo<{
  label: string;
  value: string;
  description: string;
}>(({ label, value, description }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 hover:bg-accent-primary/10 hover:border-accent-primary/40 border-accent-primary/20 bg-accent-primary/5 text-accent-primary shadow-[0_0_15px_var(--accent-glow-subtle)]"
      >
        <span className="opacity-50">{label}</span>
        <span>{value}</span>
        <Info size={9} className="opacity-40" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 z-50 w-64 p-4 rounded-xl border border-border-color shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            style={{
              background: "var(--bg-nav)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="font-mono text-[9px] text-accent-primary font-black uppercase tracking-widest mb-2">
              {label}: {value}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ─── Table of Contents ───────────────────────────────────────────────────────
const TableOfContents = React.memo<{
  sections: { id: string; label: string }[];
}>(({ sections }) => {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);
  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
      <div className="flex items-center gap-2 mb-4">
        <List size={13} className="text-accent-primary" />
        <span className="font-orbitron font-black text-[10px] text-accent-primary uppercase italic tracking-widest">
          On This Page
        </span>
      </div>
      <ul className="space-y-1.5">
        {sections.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => scrollTo(s.id)}
              className={`w-full text-left font-mono text-[10px] uppercase tracking-widest py-1 px-2 rounded-lg transition-all ${active === s.id ? "text-accent-primary bg-accent-primary/10 shadow-[inner_0_0_10px_var(--accent-glow-subtle)]" : "text-text-muted/50 hover:text-text-muted hover:bg-white/5"}`}
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

// ─── Launch Lab Modal ─────────────────────────────────────────────────────────
const LaunchLabModal = React.memo<{
  open: boolean;
  onClose: () => void;
  title: string;
  scenario?: LabScenario;
}>(({ open, onClose, title, scenario }) => {
  const defaultScenario: LabScenario = scenario || {
    id: "default-lab",
    vulnerabilityType: title,
    difficulty: "Intermediate",
    endpoint: "/api/user?id=101",
    method: "GET",
    initialRequest: `GET /api/user?id=102 HTTP/1.1\nHost: target.example.com\nAuthorization: Bearer <your_token>`,
    hints: ["Try changing the id parameter.", "Look for administrative IDs."],
    solution: {
      payload: `GET /api/user?id=101 HTTP/1.1\nHost: target.example.com\nAuthorization: Bearer <your_token>`,
      explanation: "Exploiting IDOR by changing the resource identifier."
    },
    autoAttackSteps: [
      { label: "Intercept", description: "Capturing baseline request." },
      { label: "Modify", description: "Changing ID from 102 to 101.", payload: `GET /api/user?id=101 HTTP/1.1\nHost: target.example.com\nAuthorization: Bearer <your_token>` }
    ],
    skillsLearned: ["Parameter Tampering", "Authorization Analysis"],
    vulnerableBody: { id: 101, name: "Admin", email: "admin@system.local", role: "SUPER_ADMIN" },
    secureBody: { error: "Forbidden", message: "You are not authorized to access this resource." }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-bg/95 backdrop-blur-xl"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            className="w-full max-w-5xl rounded-2xl border border-accent-primary/20 bg-bg shadow-[0_0_60px_var(--accent-glow-subtle)] overflow-hidden max-h-[95vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.01] sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <FlaskConical size={16} className="text-accent-primary" />
                <span className="font-orbitron font-black text-xs text-text-primary uppercase italic tracking-widest">
                  Exploitation Lab Simulator
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-all"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <ExploitationLab scenario={defaultScenario} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─── Secure vs Insecure Toggle ────────────────────────────────────────────────
const SecureComparison = React.memo<{
  insecureCode?: string;
  secureCode?: string;
  explanation?: string;
}>(({ insecureCode, secureCode, explanation }) => {
  const [showing, setShowing] = useState<"insecure" | "secure">("insecure");
  const defaultInsecure = `// ❌ Insecure — No authorization check\nGET /api/user?id=101\nAuthorization: Bearer <token>\n\n// Backend returns data for ANY user ID\nfunction getUserData(req, res) {\n  const data = db.lookupUserId(req.params.id);\n  res.json(data);\n}`;
  const defaultSecure = `// ✓ Secure — Object-level authorization check\nfunction getUserData(req, res) {\n  if (req.params.id !== req.user.id) {\n    return res.status(403).json({\n      error: 'Access denied - Authorization failed'\n    });\n  }\n  const data = db.lookupUserId(req.user.id);\n  res.json(data);\n}`;
  return (
    <div className="space-y-4 relative">
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
        <button
          onClick={() => setShowing("insecure")}
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-orbitron font-black text-[9px] uppercase tracking-widest transition-all z-10 ${showing === "insecure" ? "text-red-400" : "text-text-muted/40 hover:text-text-muted"}`}
        >
          {showing === "insecure" && (
            <motion.div
              layoutId="secure-toggle"
              className="absolute inset-0 bg-red-500/20 border border-red-500/30 rounded-lg -z-10 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            />
          )}
          <AlertTriangle size={11} /> Insecure Design
        </button>
        <button
          onClick={() => setShowing("secure")}
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-orbitron font-black text-[9px] uppercase tracking-widest transition-all z-10 ${showing === "secure" ? "text-green-400" : "text-text-muted/40 hover:text-text-muted"}`}
        >
          {showing === "secure" && (
            <motion.div
              layoutId="secure-toggle"
              className="absolute inset-0 bg-green-500/20 border border-green-500/30 rounded-lg -z-10 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
            />
          )}
          <CheckCircle size={11} /> Secure Design
        </button>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-border-color bg-gray-900 min-h-[160px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={showing}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
            transition={{ duration: 0.3, type: "spring", bounce: 0 }}
            className="w-full"
          >
            <CodeBlock
              code={
                showing === "insecure"
                  ? insecureCode || defaultInsecure
                  : secureCode || defaultSecure
              }
              label={
                showing === "insecure" ? "❌ Vulnerable Code" : "✓ Secure Code"
              }
              isSecure={showing === "secure"}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {explanation && <Prose text={explanation} />}
    </div>
  );
});

const MindsetDiagram = React.memo<{ steps: string[] }>(({ steps }) => {
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`px-6 py-3 rounded-xl border font-orbitron font-black text-[10px] uppercase tracking-widest text-center min-w-[200px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all hover:scale-105 ${
              i === steps.length - 1 
                ? "bg-red-50 dark:bg-red-900/20 border-red-500/50 text-red-600 dark:text-red-400 animate-pulse" 
                : "bg-bg-card border-border-color text-text-primary"
            }`}
          >
            {step}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: 24 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.05 }}
              className="w-px bg-gradient-to-b from-accent-primary/50 to-transparent"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

const MappingTable = React.memo<{ data: { type: string; surface: string }[] }>(({ data }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border-color bg-bg-card">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-bg-secondary border-b border-border-color">
            <th className="px-5 py-3 font-orbitron font-black text-[9px] uppercase tracking-widest text-accent-primary">Website Type</th>
            <th className="px-5 py-3 font-orbitron font-black text-[9px] uppercase tracking-widest text-accent-primary">Possible Attack Surface</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-bg-secondary transition-colors">
              <td className="px-5 py-4 font-mono text-[10px] text-text-primary font-bold">{item.type}</td>
              <td className="px-5 py-4 text-xs text-text-muted leading-relaxed">{item.surface}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const methodologyStrings = {
  ptesIntel: "Intelligence Gathering & Threat Modeling",
  ptesIntelDesc: "During the Intelligence Gathering stage of PTES, attackers attempt to identify exposed endpoints and accessible application functionality. If hidden administrative routes or API endpoints are discovered during this phase, they may later become targets for authorization testing during Threat Modeling.",
  osstmmTrust: "Trust Boundary Analysis",
  osstmmTrustDesc: "According to OSSTMM security verification principles, trust boundaries must be clearly enforced between authenticated users and privileged system functions. In this scenario, the application fails to enforce a security control at the backend authorization layer, causing the trust boundary to break.",
  osstmmOps: "Operational Security Testing",
  osstmmOpsDesc: "Any successful execution of unauthorized requests indicates a failure in operational security verification within the application logic. OSSTMM verification ensures that security controls are not just present, but functional under operational stress.",
  ptesVuln: "Vulnerability Analysis",
  ptesVulnDesc: "During the Vulnerability Analysis stage, the tester evaluates whether authorization checks are properly enforced. This includes verifying if server-side controls correctly handle requests from different trust levels as defined in OSSTMM security control verification.",
  ptesExploit: "Exploitation",
  ptesExploitDesc: "If function-level authorization checks are missing, the vulnerability becomes exploitable during the Exploitation stage. Testers must verify if horizontal or vertical privilege escalation is possible from an authenticated context.",
  ptesReport: "Reporting",
  ptesReportDesc: "The final findings, including reproduction steps, impact analysis, and remediation strategies, are documented in the Reporting stage of the PTES process. This ensures that stakeholders understand the operational risk and the technical steps required for closure.",
  ptesAutoDesc: "Automated testing tools streamline the Exploitation stage by rapidly identifying missing authorization checks across large API surfaces. OSSTMM security control verification principles are applied through automated regression checks to ensure operational security stability.",
  vulnerabilityLabel: "Vulnerability research methodology and research findings from the cyber-security lab.",
  simulationLabel: "Vulnerability Simulation",
  attackWorkflow: "Attack Workflow",
  rootCause: "Root Cause",
  prevention: "Prevention",
  remediation: "Remediation",
  cvss: "CVSS Analysis",
  impact: "Impact Analysis",
  references: "References"
};

const uiStrings = {
  executiveSummary: "Executive Summary",
  introduction: "Introduction",
  simpleExplanation: "Simple Explanation",
  technicalDeepDive: "Technical Deep Dive",
  attackWorkflow: "Attack Workflow",
  applicationArchitecture: "Application Architecture",
  rootCauseAnalysis: "Root Cause Analysis",
  codeExamples: "Code Examples",
  impactAnalysis: "Impact Analysis (CIA Triad)",
  cvssAnalysis: "CVSS Analysis",
  cweMapping: "CWE Mapping",
  cveReferences: "CVE References",
  mitreMapping: "MITRE ATT&CK Mapping",
  industryCompliance: "Industry & Compliance Impact",
  detectionMethodologies: "Detection Methodologies",
  ptesMapping: "PTES Methodology Mapping",
  osstmmAnalysis: "OSSTMM Verification Analysis",
  manualTesting: "Manual Testing Checklist",
  automatedTesting: "Automated Testing Tools",
  preventionStrategy: "Prevention Strategy",
  commonMistakes: "Common Developer Mistakes",
  bugBounty: "Bug Bounty Report Example",
  comparisonTable: "Comparison Table",
  osiMapping: "OSI Model Layer Mapping",
  protocolMapping: "Protocol Mapping",
  keyTakeaways: "Key Takeaways",
  strategicConclusion: "Strategic Conclusion",
  whereToTest: "Where to Test This Vulnerability",
  practiceLab: "Practice Lab",
  secureVsInsecure: "Secure vs Insecure Design",
  relatedResearch: "Related Research",
  onThisPage: "On This Page",
  translateArticle: "Translate Article",
  translating: "Translating Article...",
  realWorldExampleTitle: "Real-World Example",
  realWorldExampleFallback: "Imagine an online library where your membership card lets you borrow books. If the library's system only checks whether you're logged in — but not whether the book belongs to your account — someone else can borrow (or read) your reserved books just by changing a number in the URL. That is exactly how this vulnerability works in web applications.",
  listenResearch: "Listen to this Research",
  backToResearchHub: "Back to Research Hub",
  comparisonIntro: "The comparison table highlights the difference between insecure and secure authorization implementations.",
  vulnerableArch: "Vulnerable Architecture",
  vulnerableDesc: "In the vulnerable architecture, the application attempts to enforce access restrictions only at the user interface level. Sensitive actions are hidden from the interface but remain accessible through direct HTTP requests. Because the backend server does not verify permissions before executing sensitive functions, attackers can directly invoke restricted endpoints.",
  secureArch: "Secure Architecture",
  secureDesc: "In the remediated architecture, authorization checks are implemented at the function execution layer on the server. Before performing any sensitive operation, the server validates whether the authenticated user has the required permission. This ensures that even if an attacker discovers hidden endpoints, unauthorized requests will be rejected.",
  osiExploration: "Most web application vulnerabilities occur at Layer 7 of the OSI model, known as the Application Layer. This layer is responsible for processing HTTP requests, API calls, and application logic. In this vulnerability scenario, the application server incorrectly processes user requests without validating authorization rules. When a malicious user modifies a request parameter or directly calls a hidden endpoint, the request is still processed by the application. Because the vulnerability exists within the application's authorization logic, the issue occurs at the Application Layer rather than lower network layers. The network and transport layers continue to function correctly, but the application itself fails to enforce security rules.",
  protocolHttpTitle: "HTTP / HTTPS",
  protocolHttpDesc: "These protocols are used for communication between the client browser and the web server. If authorization checks are not enforced on HTTP endpoints, attackers can modify request parameters and access restricted resources.",
  protocolRestTitle: "REST API",
  protocolRestDesc: "Many modern applications expose REST APIs that return structured data. If authorization validation is missing in these APIs, attackers can manipulate identifiers or request parameters to retrieve unauthorized information.",
  protocolGraphqlTitle: "GraphQL",
  protocolGraphqlDesc: "GraphQL APIs allow flexible queries that can request multiple data fields in a single request. If access control rules are not applied correctly, attackers may query sensitive data fields that should normally be restricted.",
};

// ─── Main Component ────────────────────────────────────────────────────────────
export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post] = useState(blogPosts.find((p) => p.slug === slug));
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [dossierData, setDossierData] = useState<any>({});

  // Global language state
  const { language: targetLang, setLanguage: setTargetLang, isTranslating, setIsTranslating } = useLanguage();
  
  const [translatedDossier, setTranslatedDossier] = useState<any>(null);
  const [translatedTitle, setTranslatedTitle] = useState(post?.title || "");
  const [translatedExcerpt, setTranslatedExcerpt] = useState(
    post?.excerpt || "",
  );
  const [showVoice, setShowVoice] = useState(false);
  const [translatedUI, setTranslatedUI] = useState(uiStrings);
  const [translatedMethodology, setTranslatedMethodology] = useState(methodologyStrings);

  const [narrationSync, setNarrationSync] = useState({ section: -1, chunk: -1 });
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const [narrationSpeed, setNarrationSpeed] = useState(1);
  const [explanationMode, setExplanationMode] = useState<'beginner' | 'advanced'>('advanced');
  const [translatedSimLabels, setTranslatedSimLabels] = useState({
    burp: {
      t1: "1. Capture Request", d1: "The attacker intercepts a legitimate request to the server.",
      t2: "2. Modify Parameter", d2: "The attacker changes the target object reference ID.",
      t3: "3. Unauthorized Access", d3: "The server returns the victim's sensitive data."
    },
    terminal: {
      t1: "Directory Brute Forcing Simulation",
      c1: "ffuf -w dirb/common.txt -u https://target.com/FUZZ -fc 404",
      o1: "[+] Starting ffuf scanning...\n[*] Trying words from common.txt\n\n/admin       [Status: 200 OK]\n[+] Scan completed.",
      c2: "curl -s https://target.com/config.bak | grep -i password"
    },
    devtools: {
      t1: "1. Inspect Storage", d1: "Attacker opens browser DevTools and reviews local storage values.",
      t2: "2. Modify Value", d2: "Attacker double-clicks the authorization claim and modifies it.",
      t3: "3. Exploit System", d3: "Attacker refreshes the page with the manipulated state."
    }
  });

  const [isLoadingDossier, setIsLoadingDossier] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [labOpen, setLabOpen] = useState(false);

  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrolledSection = useRef<number>(-1);

  // Smooth scroll spring for progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });


  // Handle user interaction detection
  useEffect(() => {
    const handleInteraction = () => {
      setIsUserScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 7000); // 7 second resume window for better reading time
    };

    const interactionEvents = ['wheel', 'touchstart', 'touchmove', 'keydown', 'mousedown', 'scroll', 'click'];
    interactionEvents.forEach(event => {
      window.addEventListener(event, handleInteraction, { passive: true });
    });

    // Detect text selection
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        handleInteraction();
      }
    };
    document.addEventListener('selectionchange', handleSelection);

    return () => {
      interactionEvents.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
      document.removeEventListener('selectionchange', handleSelection);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);


  // Engagement Tracker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (narrationSync.section >= 0) {
      interval = setInterval(() => {
        if (slug) pingEngagement(slug, narrationSync.section);
      }, 10000); // Ping every 10s
    }
    return () => clearInterval(interval);
  }, [narrationSync.section, slug]);

  useEffect(() => {
    if (!slug) return;
    const docRef = doc(db, "blog_stats", slug);
    getDoc(docRef).then((snap) => {
      if (snap.exists()) setLikes(snap.data().likes || 0);
      else
        setDoc(docRef, { likes: 0, shares: 0, createdAt: serverTimestamp() });
    });
    if (localStorage.getItem(`liked_${slug}`)) setHasLiked(true);
  }, [slug]);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setIsLoadingDossier(true);
      try {
        const res = await fetch(`/research/${slug}.json`);
        if (res.ok) {
          const data = await res.json();
          setDossierData(data || {});
        } else {
          setDossierData({});
        }
      } catch {
        setDossierData({});
      } finally {
        setIsLoadingDossier(false);
      }
    };
    load();
  }, [slug]);

  // Handle translation
  // Preload all translation cache from localStorage into memory on mount
  // This ensures all cached translations are available instantly without API calls
  useEffect(() => {
    preloadTranslationCache();
  }, []);

  useEffect(() => {
    const handleTranslation = async () => {
      if (!post) return;

      if (targetLang === 'en') {
        setTranslatedDossier(null);
        setTranslatedTitle(post.title);
        setTranslatedExcerpt(post.excerpt);
        setTranslatedMethodology(methodologyStrings);
        setIsTranslating(false);
        return;
      }
      // ── INSTANT CACHE APPLICATION ────────────────────────────────────────
      // Before the async API calls start, immediately apply any already-cached
      // translations. This eliminates the "translating..." flash on reload.
      
      const cachedTitle = getCachedTranslation(post.title, targetLang);
      const cachedExcerpt = getCachedTranslation(post.excerpt, targetLang);
      
      if (cachedTitle) setTranslatedTitle(cachedTitle);
      if (cachedExcerpt) setTranslatedExcerpt(cachedExcerpt);

      // Check if we have enough cached data to avoid showing the loading spinner entirely
      const uiKeys = Object.keys(uiStrings) as (keyof typeof uiStrings)[];
      const allUICached = uiKeys.every(k => getCachedTranslation(uiStrings[k], targetLang));
      
      if (!cachedTitle || !cachedExcerpt || !allUICached) {
        setIsTranslating(true);
      }
      // ─────────────────────────────────────────────────────────────────────

      try {
        const [
          newDossier, 
          newTitle, 
          newExcerpt, 
          newSimLabels
        ] = await Promise.all([
          translateDossier(dossierData, targetLang),
          translateText(post.title, targetLang),
          translateText(post.excerpt, targetLang),
          translateObject(translatedSimLabels, targetLang)
        ]);

        setTranslatedDossier(newDossier);
        setTranslatedTitle(newTitle);
        setTranslatedExcerpt(newExcerpt);
        if (newSimLabels) setTranslatedSimLabels(newSimLabels);

        // Translate UI and Methodology in batch for 10x performance boost
        const uiKeys = Object.keys(uiStrings) as (keyof typeof uiStrings)[];
        const methKeys = Object.keys(methodologyStrings) as (keyof typeof methodologyStrings)[];
        
        const [uiTranslates, methTranslates] = await Promise.all([
          batchTranslate(uiKeys.map(k => uiStrings[k]), targetLang),
          batchTranslate(methKeys.map(k => methodologyStrings[k]), targetLang)
        ]);
        
        const newUI = { ...uiStrings };
        uiKeys.forEach((key, index) => { 
          if (uiTranslates[index]) newUI[key] = uiTranslates[index]; 
        });

        const newMeth = { ...methodologyStrings };
        methKeys.forEach((key, index) => { 
          if (methTranslates[index]) newMeth[key] = methTranslates[index]; 
        });

        setTranslatedUI(newUI);
        setTranslatedMethodology(newMeth);
      } catch (error) {
        console.error("Translation failed", error);
        setTargetLang("en");
      } finally {
        setIsTranslating(false);
      }
    };

    handleTranslation();
  }, [targetLang, dossierData, post, setTargetLang, uiStrings, methodologyStrings]);

  const handleLike = async () => {
    if (!slug || hasLiked) return;
    setLikes((p) => p + 1);
    setHasLiked(true);
    localStorage.setItem(`liked_${slug}`, "true");
    try {
      await updateDoc(doc(db, "blog_stats", slug), { likes: increment(1) });
    } catch {}
  };

  const handleShare = async () => {
    if (!slug) return;
    try {
      if (navigator.share)
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {}
  };


  if (!post) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6 pt-24">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-text-muted/20 mb-6" />
          <h1 className="font-orbitron text-2xl font-black text-text-primary uppercase italic mb-4">
            Article Not Found
          </h1>
          <Link
            to="/blog"
            className="text-accent-primary font-orbitron font-black text-xs uppercase tracking-widest hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Sections to show in simple mode (beginner-friendly)
  const SIMPLE_SECTION_IDS = [
    "executive-summary",
    "simple-explanation",
    "attack-workflow",
    "impact-analysis",
    "prevention-strategy",
    "key-takeaways",
    "practice-lab",
    "secure-compare",
    "related",
  ];

  // Helper: returns sequential number for simple mode, or original for deep mode
  const sectionNum = (simpleOrder: number, deepNum: string) =>
    explanationMode === 'beginner' ? String(simpleOrder).padStart(2, '0') : deepNum;

  const tocSections = useMemo(() => {
    const simpleLabels: { id: string; label: string }[] = [
      { id: "executive-summary",  label: `01 ${translatedUI.executiveSummary}` },
      { id: "simple-explanation", label: `02 ${translatedUI.simpleExplanation}` },
      { id: "attack-workflow",    label: `03 ${translatedUI.attackWorkflow}` },
      { id: "impact-analysis",   label: `04 ${translatedUI.impactAnalysis}` },
      { id: "prevention-strategy", label: `05 ${translatedUI.preventionStrategy}` },
      { id: "key-takeaways",     label: `06 ${translatedUI.keyTakeaways}` },
      { id: "practice-lab",      label: translatedUI.practiceLab },
      { id: "secure-compare",    label: translatedUI.secureVsInsecure },
      { id: "related",           label: translatedUI.relatedResearch },
    ];
    if (explanationMode === 'beginner') return simpleLabels;
    return [
      { id: "executive-summary", label: `01 ${translatedUI.executiveSummary}` },
      { id: "introduction", label: `02 ${translatedUI.introduction}` },
      { id: "simple-explanation", label: `03 ${translatedUI.simpleExplanation}` },
      { id: "technical-deep-dive", label: `04 ${translatedUI.technicalDeepDive}` },
      { id: "attack-workflow", label: `05 ${translatedUI.attackWorkflow}` },
      { id: "application-architecture", label: `06 ${translatedUI.applicationArchitecture}` },
      { id: "root-cause-analysis", label: `07 ${translatedUI.rootCauseAnalysis}` },
      { id: "code-examples", label: `08 ${translatedUI.codeExamples}` },
      { id: "impact-analysis", label: `09 ${translatedUI.impactAnalysis}` },
      { id: "cvss-analysis", label: `10 ${translatedUI.cvssAnalysis}` },
      { id: "cwe-mapping", label: `11 ${translatedUI.cweMapping}` },
      { id: "cve-references", label: `12 ${translatedUI.cveReferences}` },
      { id: "mitre-attack-mapping", label: `13 ${translatedUI.mitreMapping}` },
      { id: "industry-compliance-impact", label: `14 ${translatedUI.industryCompliance}` },
      { id: "detection-methodologies", label: `15 ${translatedUI.detectionMethodologies}` },
      { id: "ptes-mapping", label: `15.1 ${translatedUI.ptesMapping}` },
      { id: "osstmm-analysis", label: `15.2 ${translatedUI.osstmmAnalysis}` },
      { id: "manual-testing-checklist", label: `16 ${translatedUI.manualTesting}` },
      { id: "automated-testing-tools", label: `17 ${translatedUI.automatedTesting}` },
      { id: "prevention-strategy", label: `18 ${translatedUI.preventionStrategy}` },
      { id: "common-developer-mistakes", label: `19 ${translatedUI.commonMistakes}` },
      { id: "bug-bounty-report-example", label: `20 ${translatedUI.bugBounty}` },
      { id: "comparison-table", label: `21 ${translatedUI.comparisonTable}` },
      { id: "osi-model-layer-mapping", label: `22 ${translatedUI.osiMapping}` },
      { id: "protocol-mapping", label: `23 ${translatedUI.protocolMapping}` },
      { id: "key-takeaways", label: `24 ${translatedUI.keyTakeaways}` },
      { id: "strategic-conclusion", label: `25 ${translatedUI.strategicConclusion}` },
      { id: "practice-lab", label: translatedUI.practiceLab },
      { id: "secure-compare", label: translatedUI.secureVsInsecure },
      { id: "related", label: translatedUI.relatedResearch },
    ];
  }, [translatedUI, explanationMode]);

  const relatedPosts = useMemo(() => 
    post.intel?.related
      ?.map((s) => blogPosts.find((p) => p.slug === s))
      .filter(Boolean) || []
  , [post.intel?.related]);

  // Sync scroll with narration - Improved logic
  useEffect(() => {
    // Only scroll if narration is active, user is NOT interacting, and we are moving to a NEW section
    // Added check to ensure section > 0 or that it's been active for a bit to avoid jump on initial load
    if (isNarrationPlaying && narrationSync.section >= 0 && !isUserScrolling) {
      if (narrationSync.section !== lastScrolledSection.current) {
        const sectionId = tocSections[narrationSync.section]?.id;
        if (sectionId) {
          const element = document.getElementById(sectionId);
          if (element) {
            // Slow and smooth scroll
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            lastScrolledSection.current = narrationSync.section;
          }
        }
      }
    }
  }, [narrationSync.section, isUserScrolling, isNarrationPlaying, tocSections]);

  // Ensure scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Reset narration last scrolled state on mount
    lastScrolledSection.current = -1;
  }, [slug]);
  const displayDossier = translatedDossier || dossierData;

  const narrationSections = useMemo(() => {
    // Helper to join arrays into a single narrative sentence
    const joinArr = (val: any) => Array.isArray(val) ? val.join(" ") : val || "";

    // ─── Simple Mode: Casual, human-written, beginner-friendly ───────────────
    // Sounds like one friend explaining to another — no jargon, real examples,
    // short punchy sentences, natural conversational rhythm.
    const simple = [
      {
        title: translatedUI.executiveSummary,
        content: (() => {
          const base = displayDossier?.executive_summary;
          if (base) return base;
          return "So here's what this whole thing is about — there's a security flaw that lets people see or do things they're not supposed to. Developers accidentally left a door open, and attackers know exactly how to walk through it. In this article I'll walk you through everything you need to know, from what it actually is to how it gets exploited and how to fix it. Simple and clear, no complicated stuff.";
        })(),
      },
      {
        title: translatedUI.simpleExplanation,
        content: (() => {
          const base = displayDossier?.simple_explanation;
          const realWorldEx = displayDossier?.real_world_example;
          if (base) return `${base}${realWorldEx ? " " + realWorldEx : ""}`;
          return "Imagine you're at a bank and you have your own locker. Now what if someone just changed the locker number on your key — and it opened someone else's locker too? That's basically this vulnerability. The application assumes if you're logged in, whatever number you send it is yours. But it never actually checks. So anyone can just change that number and access someone else's stuff. Pretty wild, right?";
        })(),
      },
      {
        title: translatedUI.attackWorkflow,
        content: (() => {
          const steps = Array.isArray(displayDossier?.attack_workflow) ? displayDossier.attack_workflow : [];
          if (steps.length > 0) {
            return `Okay so here is exactly what happens during an actual attack — step by step. ${steps.slice(0, 4).join(". Then, ")}. And that's it. That's the whole attack. Pretty straightforward once you see it laid out like this.`;
          }
          return "So picture this — an attacker logs into an app with their own account, totally normal. They look at the browser address bar and notice a number in the URL, like user ID 42. They think, what happens if I change that to 41? So they do it. And the server just... hands them that user's data. No questions asked. No check. Nothing. That is the attack in a nutshell — finding those little numbers and changing them.";
        })(),
      },
      {
        title: translatedUI.impactAnalysis,
        content: (() => {
          const desc = displayDossier?.impact_analysis?.description;
          if (desc) return `So here is why this actually matters in the real world. ${desc} That's the kind of damage this vulnerability can cause — and it's happened to real companies, real users, real data.`;
          return "Okay let me put this in perspective. Imagine waking up and finding out someone read all your private messages. Or accessed your medical records. Or changed your email without your permission. That's the kind of impact this vulnerability can have. When something like this gets exploited at scale, it can affect thousands or even millions of people. Your private data, your financial info, your identity — all exposed because of one missing check in the code. That's why it's taken so seriously in the security world.";
        })(),
      },
      {
        title: translatedUI.preventionStrategy,
        content: (() => {
          const steps = Array.isArray(displayDossier?.prevention_strategy) ? displayDossier.prevention_strategy : [];
          if (steps.length > 0) {
            return `Alright, good news — fixing this is actually not that complicated once you know what to do. Here's what developers need to do. ${steps.slice(0, 4).join(". ")}. Basically the rule is simple: never trust what the user sends you. Always verify on the server side that the logged-in person actually has permission to access what they are requesting.`;
          }
          return "The fix honestly is not complicated — it just needs to be done consistently. Before your app shows any user any piece of data, it needs to check: does this logged-in person actually own this data? Not based on what they sent in the URL — based on who they actually are according to the server session. That one check, done properly on the backend, makes this entire class of attack impossible. Simple idea, but it saves you from massive breaches.";
        })(),
      },
      {
        title: translatedUI.keyTakeaways,
        content: (() => {
          const items = Array.isArray(displayDossier?.key_takeaways) ? displayDossier.key_takeaways : [];
          if (items.length > 0) return `Quick recap — here are the main things to remember. ${items.slice(0, 4).join(". ")}. Those are your key takeaways. If you remember nothing else from this article, remember those.`;
          return "Alright let me wrap this up for you. One — never trust IDs or numbers that come from user input without verifying ownership. Two — always do authorization checks on the server, not just in the frontend. Three — test your own apps with a second account and try accessing things you shouldn't be able to. If it works, you have a problem. And four — when you're bug hunting, always look at those object identifiers in URLs and API requests. That's where the gold is.";
        })(),
      },
    ];

    // ─── Deep Mode: Technical, professional, but still human-sounding ────────
    // Sounds like a senior security researcher walking a junior analyst through
    // the research — detailed, precise, uses proper terminology naturally.
    const full = [
      {
        title: translatedUI.executiveSummary,
        content: (() => {
          const base = displayDossier?.executive_summary;
          if (base) return base;
          return "This intelligence dossier provides a comprehensive threat analysis — covering root cause mapping, exploitation methodology, attack surface enumeration, and enterprise-grade remediation strategy. The findings are based on real-world vulnerability research and cross-referenced with OWASP, MITRE ATT&CK, CWE, and CVE databases. Let's break this down from the ground up.";
        })(),
      },
      {
        title: translatedUI.introduction,
        content: displayDossier?.introduction || "This vulnerability class has been consistently ranked in the OWASP Top 10 due to its prevalence and high impact potential. Understanding its history, discovery patterns, and exploitation vectors is essential context before diving into technical analysis.",
      },
      {
        title: translatedUI.simpleExplanation,
        content: displayDossier?.simple_explanation || "Before we get into the technical depth, here's the conceptual anchor — the vulnerability fundamentally exists because the application trusts user-supplied input without validating authorization at the server level. That's the core.",
      },
      {
        title: translatedUI.technicalDeepDive,
        content: (() => {
          const base = displayDossier?.technical_deep_dive;
          if (base) return base;
          return "At the code level, the vulnerability manifests when object identifiers — such as user IDs, document IDs, or resource references — are passed directly from client-controlled input into database queries or business logic functions without server-side validation of the requesting principal's authorization scope. The backend makes the assumption that any authenticated user sending a valid-looking request is authorized — but authorization and authentication are two completely separate security controls.";
        })(),
      },
      {
        title: translatedUI.whereToTest,
        content: displayDossier?.where_to_test?.explanation || "When testing for this vulnerability class, the primary attack surface includes any parameter in URL paths, query strings, or request bodies that reference object identifiers. API endpoints are particularly high-value targets. Tools like Burp Suite's Repeater and Intruder are well-suited for systematic enumeration.",
      },
      {
        title: translatedUI.attackWorkflow,
        content: Array.isArray(displayDossier?.attack_workflow)
          ? `Here's the full exploitation chain as it would unfold during an authorized penetration test. ${displayDossier.attack_workflow.join(" ")}`
          : displayDossier?.attack_workflow || "The attack methodology follows a standard PTES exploitation workflow — beginning with recon and surface mapping, moving into parameter enumeration, then validating the authorization bypass through controlled payload modification.",
      },
      {
        title: translatedUI.applicationArchitecture,
        content: displayDossier?.application_architecture || "In the vulnerable architecture, authorization enforcement exists only at the presentation layer — which is completely bypassable through direct API calls. The secure architecture enforces authorization at the business logic and data access layers, ensuring that direct object references are always validated against the authenticated principal's permission scope.",
      },
      {
        title: translatedUI.rootCauseAnalysis,
        content: (() => {
          const base = displayDossier?.root_cause_analysis;
          if (base) return base;
          return "The root cause here is a missing server-side authorization check at the function execution layer. This is a CWE-862 — Missing Authorization — which occurs when software does not perform an authorization check when an actor attempts to access a resource or perform an action. The MITRE ATT&CK framework maps this to the Exploitation for Privilege Escalation technique, specifically targeting object-level access control gaps.";
        })(),
      },
      {
        title: translatedUI.codeExamples,
        content: displayDossier?.code_examples?.explanation || "The code comparison illustrates the critical difference between the vulnerable pattern — which trusts the ID parameter directly from the request — versus the secure pattern, which validates the authenticated user's ownership of the resource before returning any data. The fix is a single conditional authorization check at the service layer.",
      },
      {
        title: translatedUI.impactAnalysis,
        content: (() => {
          const desc = displayDossier?.impact_analysis?.description;
          if (desc) return `CIA Triad impact analysis. ${desc}`;
          return "From a CIA Triad perspective — Confidentiality is breached because unauthorized parties can read sensitive data. Integrity is at risk because depending on the HTTP method, data modification may also be possible. Availability is less directly impacted, though mass enumeration could lead to denial-of-service conditions. The overall risk rating is High to Critical depending on what resources are exposed.";
        })(),
      },
      {
        title: translatedUI.cvssAnalysis,
        content: `The CVSS base score for this vulnerability is ${displayDossier?.cvss_analysis?.score || post.intel?.cvss || "7.5"}, placing it in the High severity category. The key scoring factors are: high exploitability due to no special skills required, network-accessible attack vector, and significant impact on confidentiality and integrity. This score directly informs prioritization in vulnerability management workflows.`,
      },
      {
        title: translatedUI.detectionMethodologies,
        content: joinArr(displayDossier?.detection_methodologies) || "Detection of this vulnerability class relies on a combination of static code analysis — specifically checking for missing authorization decorators or guards — and dynamic scanning using authenticated sessions with parameter fuzzing. Runtime anomaly detection in SIEM solutions can identify unusual object ID enumeration patterns in access logs.",
      },
      {
        title: translatedUI.manualTesting,
        content: joinArr(displayDossier?.manual_checklist) || "Manual testing checklist — first, identify all endpoints that accept object identifiers. Second, authenticate as User A and capture a request referencing User A's resource. Third, replace the identifier with one belonging to User B. Fourth, validate if the response returns User B's data without re-authentication or authorization errors. Document every positive finding with full request/response pairs.",
      },
      { title: translatedUI.preventionStrategy, content: joinArr(displayDossier?.prevention_strategy) || "Implement server-side authorization checks at every function that accesses user-controlled object references. Use indirect reference maps where possible. Never trust client-supplied identifiers as proof of ownership. Apply principle of least privilege to all API endpoints and database queries." },
      { title: translatedUI.commonMistakes, content: joinArr(displayDossier?.developer_mistakes) || "The most common developer mistake is implementing authorization only in the frontend UI layer — hiding buttons, filtering menu items — while leaving backend APIs completely unprotected. Another frequent pattern is trusting JWTs for identity but not validating that the claimed identity matches the requested resource ownership." },
      { title: translatedUI.bugBounty, content: displayDossier?.bug_bounty_example?.summary || "A well-structured IDOR bug bounty report includes: complete reproduction steps using two distinct accounts, evidence of data cross-account exposure, impact severity assessment, affected endpoint enumeration, and a recommended code-level fix. Reports with proof-of-concept curl commands or Burp Suite captures are rated higher by triagers." },
      { title: translatedUI.keyTakeaways, content: joinArr(displayDossier?.key_takeaways) || "Key technical takeaways — authorization and authentication are separate security layers and must both be implemented server-side. Object-level access control must be verified at every data access point, not just at login. Automated testing cannot fully replace manual authorization logic review during code audits." },
      { title: translatedUI.strategicConclusion, content: displayDossier?.strategic_conclusion || "From a strategic security posture perspective — this vulnerability class should be formally included in your company's secure development lifecycle checklist, threat model review, and SAST/DAST pipeline. Organizations with mature security programs treat missing authorization checks as blocker-severity defects, equivalent to SQL injection or hardcoded credentials, because the exploitation barrier is low and the business impact is high." },
    ];

    return explanationMode === 'beginner' ? simple : full;
  }, [displayDossier, translatedUI, post.intel?.cvss, explanationMode]);


  const getIsHighlighted = (sectionId: string) => {
    if (narrationSync.section < 0) return false;
    const deepIds = ["executive-summary","introduction","simple-explanation","technical-deep-dive",
      "where-to-test","attack-workflow","application-architecture","root-cause-analysis",
      "code-examples","impact-analysis","cvss-analysis","detection-methodologies",
      "manual-testing-checklist","prevention-strategy","common-developer-mistakes",
      "bug-bounty-report-example","key-takeaways","strategic-conclusion"];
    const simpleIds = ["executive-summary","simple-explanation","attack-workflow","impact-analysis","prevention-strategy","key-takeaways"];
    const ids = explanationMode === 'beginner' ? simpleIds : deepIds;
    return ids[narrationSync.section] === sectionId;
  };

  const getSimulationStage = (sectionId: string) => {
    const deepIds = ["executive-summary","introduction","simple-explanation","technical-deep-dive",
      "where-to-test","attack-workflow","application-architecture","root-cause-analysis",
      "code-examples","impact-analysis","cvss-analysis","detection-methodologies",
      "manual-testing-checklist","prevention-strategy","common-developer-mistakes",
      "bug-bounty-report-example","key-takeaways","strategic-conclusion"];
    const simpleIds = ["executive-summary","simple-explanation","attack-workflow","impact-analysis","prevention-strategy","key-takeaways"];
    const ids = explanationMode === 'beginner' ? simpleIds : deepIds;
    const activeSectionId = ids[narrationSync.section];
    if (activeSectionId !== sectionId) return undefined;

    const chunkIndex = narrationSync.chunk;
    if (chunkIndex <= 1) return 1;
    if (chunkIndex === 2) return 2;
    return 3;
  };

  return (
    <PageTransition>
      <SEO
        title={post.seoTitle || translatedTitle}
        description={post.seoDescription || translatedExcerpt}
        article
      />
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-accent-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      <div className="min-h-screen bg-bg pt-20">
        {/* ── Centered article container ── */}
        <div
          style={{
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "20px",
          }}
          className="blog-container"
        >
          {/* Navigation Back Link */}
          <Link
            to="/research-hub"
            className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors mb-6 group w-fit"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span className="font-orbitron font-black text-[10px] uppercase tracking-widest">
              {translatedUI.backToResearchHub}
            </span>
          </Link>

          {/* 1. COVER IMAGE */}
          <div className="relative w-full overflow-hidden mb-8 bg-[#0a0a0a] rounded-2xl flex items-center justify-center" 
               style={{ minHeight: "300px", maxHeight: "500px" }}>
            <img
              src={post.coverImage || post.image}
              alt={`${post.title} vulnerability research cover image`}
              className="w-full h-auto max-h-[500px] object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/20 to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-accent-primary text-black rounded-full font-orbitron font-black text-[9px] tracking-widest uppercase shadow-[0_0_10px_var(--accent-glow-subtle)]">
                {post.track}
              </span>
              {post.intel?.owasp && (
                <span className="px-3 py-1 bg-black/60 border border-white/10 backdrop-blur-sm rounded-full font-mono text-[9px] text-white font-black uppercase tracking-widest">
                  {post.intel.owasp}
                </span>
              )}
            </div>

            {/* NO DROPDOWN HERE ANYMORE -> Moved to top controls */}
          </div>

          {/* Translation and Voice Controls Bar */}
          <div className="blog-narration-bar flex flex-col md:flex-row gap-4 mb-8 z-[100] relative">
            <div className="blog-controls-col flex flex-col gap-2 z-[100]">
              <div className="relative group z-[100]">
                 <InlineLanguageSelector 
                   label={translatedUI.translateArticle}
                 />
              </div>
              
              {/* Simple/Deep Mode Toggle */}
              <div className="space-y-1.5">
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 w-full">
                  <button
                    onClick={() => setExplanationMode('beginner')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-orbitron font-black text-[9px] uppercase tracking-widest transition-all z-10 ${
                      explanationMode === 'beginner'
                        ? "text-green-400 bg-green-500/10 shadow-[0_0_10px_rgba(34,197,94,0.15)] border border-green-500/20"
                        : "text-text-muted/40 hover:text-text-muted"
                    }`}
                    title="Beginner Mode — beginner-friendly, plain language, key sections only"
                  >
                    <span>📖</span> Beginner
                  </button>
                  <button
                    onClick={() => setExplanationMode('advanced')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-orbitron font-black text-[9px] uppercase tracking-widest transition-all z-10 ${
                      explanationMode === 'advanced'
                        ? "text-accent-primary bg-accent-primary/10 shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.2)] border border-accent-primary/20"
                        : "text-text-muted/40 hover:text-text-muted"
                    }`}
                    title="Advanced Mode — full technical breakdown, all 25+ sections"
                  >
                    <span>🔬</span> Advanced
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsLowPerformance(!isLowPerformance)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all font-mono text-[8px] font-black uppercase ${isLowPerformance ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-white/5 border-white/5 text-text-muted hover:text-accent-primary hover:border-accent-primary/20"}`}
                title="Performance Mode"
              >
                <Activity size={10} className={isLowPerformance ? "" : "animate-pulse"} />
                {isLowPerformance ? "PERF: LOW" : "PERF: HIGH"}
              </button>

              <button
                onClick={() => setBackgroundMode(!backgroundMode)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all font-mono text-[8px] font-black uppercase ${backgroundMode ? "bg-accent-primary/10 border-accent-primary/20 text-accent-primary" : "bg-white/5 border-white/5 text-text-muted hover:text-accent-primary hover:border-accent-primary/20"}`}
                title="Toggle Background Narration Control"
              >
                <Zap size={10} className={backgroundMode ? "animate-pulse" : ""} />
                {backgroundMode ? "BG PLAY: ON" : "BG PLAY: OFF"}
              </button>
            </div>
            <div className="flex-grow z-10">
              <VoiceNarration
                sections={narrationSections}
                language={targetLang}
                title={translatedTitle}
                slug={slug}
                explanationMode={explanationMode}
                onProgress={useCallback((s: number, c: number) => {
                  setNarrationSync({ section: s, chunk: c });
                  if (s >= 0 && c === 0) {
                    trackEvent('section_read', {
                      section: narrationSections[s]?.title,
                      article: post?.title
                    });
                  }
                }, [narrationSections, post?.title])}
                onWordProgress={useCallback((charIdx: number) => setActiveCharIndex(charIdx), [])}
                onTogglePlay={useCallback((playing: boolean) => setIsNarrationPlaying(playing), [])}
              />
            </div>
          </div>

          <div className="relative min-h-[500px]">
            {isTranslating && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-[#050506]/95 p-3 px-6 rounded-full border border-accent-primary/30 backdrop-blur-md shadow-[0_0_30px_var(--accent-glow-subtle)]">
                <Activity className="text-accent-primary animate-pulse w-4 h-4" />
                <span className="font-orbitron font-black text-[10px] uppercase tracking-widest text-accent-primary">
                  {translatedUI?.translating || 'Translating...'}
                </span>
              </div>
            )}

            {/* 2. TITLE */}
            <h1 className="font-orbitron !text-lg md:!text-xl font-bold text-text-primary uppercase italic leading-tight mb-4 tracking-tight">
              {translatedTitle}
            </h1>

            {/* Meta row */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="flex flex-wrap items-center gap-5 text-text-muted">
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-accent-primary" />
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-text-primary uppercase font-black">
                        {post.author}
                      </span>
                      {post.authorRole && (
                        <span className="font-mono text-[8px] text-text-muted/60 uppercase tracking-tighter">
                          {post.authorRole}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} />
                    <span className="font-mono text-[10px] uppercase">
                      {post.publishDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={13} />
                    <span className="font-mono text-[10px] uppercase">
                      {post.readingTime}
                    </span>
                  </div>
                </div>

                <a 
                  href="https://manivarmacyber.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-accent-primary/20 bg-accent-primary/5 hover:bg-accent-primary/15 transition-all text-accent-primary group shadow-[0_0_10px_rgba(var(--accent-primary-rgb),0.1)]"
                  title="Visit Mani Varma's Portfolio"
                >
                  <User size={12} className="group-hover:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(var(--accent-primary-rgb),0.5)]" />
                  <span className="font-mono text-[9px] font-black tracking-widest uppercase">
                    Author: Mani Varma
                  </span>
                </a>
              </div>

              {post.authorBio && (
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-xs text-text-muted leading-relaxed italic border-l-2 border-l-accent-primary/40">
                  {post.authorBio}
                </div>
              )}
            </div>

            {/* 2.5 VOICE NARRATION - Moved up */}

            {/* 3. INTELLIGENCE TAGS */}
            {post.intel && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.intel.cwe && (
                  <IntelTag
                    label="CWE"
                    value={post.intel.cwe.split(":")[0]}
                    description="Common Weakness Enumeration — a category system for software security weaknesses. CWE identifies the root cause of this vulnerability class."
                  />
                )}
                {post.intel.cve && (
                  <IntelTag
                    label="CVE"
                    value={post.intel.cve}
                    description="Common Vulnerabilities and Exposures — a specific, identified vulnerability instance in real software. Click the CVE ID to view the full NVD entry."
                  />
                )}
                {post.intel.cvss && (
                  <IntelTag
                    label="CVSS"
                    value={`${post.intel.cvss} (${post.intel.cvss >= 9 ? "Critical" : post.intel.cvss >= 7 ? "High" : post.intel.cvss >= 4 ? "Medium" : "Low"})`}
                    description="Common Vulnerability Scoring System — a numeric score from 0 to 10 measuring vulnerability severity. This score considers impact, exploitability, and scope."
                  />
                )}
                {post.intel.mitre && (
                  <IntelTag
                    label="MITRE"
                    value={post.intel.mitre.split(":")[0]}
                    description="MITRE ATT&CK technique identifier — describes the attack technique used in the exploit. Part of a global adversary behavior framework used by security teams."
                  />
                )}
              </div>
            )}

            {/* 4. LAUNCH LAB BUTTON */}
            <div className="mb-8 relative group inline-block">
              <div className="absolute inset-0 bg-accent-primary/50 blur-xl group-hover:blur-2xl transition-all opacity-50 group-hover:opacity-100 rounded-xl" />
              <button
                onClick={() => setLabOpen(true)}
                className="relative flex items-center gap-3 px-6 py-3.5 rounded-xl font-orbitron font-black text-xs uppercase tracking-widest text-black transition-all hover:scale-[1.02] active:scale-95 z-10"
                style={{ background: "var(--accent-primary)" }}
              >
                <FlaskConical size={16} /> Launch Interactive Lab
              </button>
            </div>

            {/* Excerpt / Intro */}
            <p className="text-base text-text-muted leading-relaxed mb-8 border-l-2 border-accent-primary/30 pl-5 italic">
              {translatedExcerpt}
            </p>

            {/* 5. TABLE OF CONTENTS */}
            <div className="mb-6">
              <TableOfContents sections={tocSections} />
            </div>

            {/* Mode awareness banner */}
            <div className={`mb-8 flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border ${
              explanationMode === 'beginner'
                ? 'bg-green-500/[0.04] border-green-500/20'
                : 'bg-accent-primary/[0.04] border-accent-primary/20'
            }`}>
              <span className="text-lg">{explanationMode === 'beginner' ? '📖' : '🔬'}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-orbitron font-black text-[9px] uppercase tracking-widest ${
                  explanationMode === 'beginner' ? 'text-green-400' : 'text-accent-primary'
                }`}>
                  {explanationMode === 'beginner' ? 'Beginner Mode Active' : 'Advanced Mode Active'}
                </p>
                <p className="font-mono text-[8px] text-text-muted/60 mt-0.5">
                  {explanationMode === 'beginner'
                    ? 'Plain language. Real-world analogies. Essential sections only — perfect for beginners and newcomers to cybersecurity.'
                    : 'Full technical breakdown. All 25+ research sections. Architecture analysis, CVSS scoring, MITRE mapping — for intermediate to advanced practitioners.'}
                </p>
              </div>
              <button
                onClick={() => setExplanationMode(explanationMode === 'beginner' ? 'advanced' : 'beginner')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg border font-mono text-[8px] font-black uppercase tracking-wider transition-all hover:scale-105 ${
                  explanationMode === 'beginner'
                    ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'
                    : 'bg-accent-primary/10 border-accent-primary/20 text-accent-primary hover:bg-accent-primary/20'
                }`}
              >
                Switch to {explanationMode === 'beginner' ? '🔬 Advanced' : '📖 Beginner'}
              </button>
            </div>

            {/* Engagement bar */}
            <div className="flex items-center gap-3 mb-10 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-mono text-[10px] font-black uppercase hover:shadow-[0_0_15px_var(--accent-glow-subtle)] ${hasLiked ? "bg-accent-primary/10 border-accent-primary/20 text-accent-primary" : "bg-white/5 border-white/5 text-text-muted hover:text-accent-primary hover:border-accent-primary/20"}`}
              >
                <ThumbsUp size={14} /> {likes} Helpful
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-text-muted hover:border-white/15 transition-all font-mono text-[10px] font-black uppercase hover:text-white"
              >
                {isCopied ? (
                  <Check size={14} className="text-green-500" />
                ) : (
                  <Share2 size={14} />
                )}
                {isCopied ? "Copied!" : "Share"}
              </button>
              <div className="ml-auto flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md bg-white/5 border border-white/5 font-mono text-[8px] text-text-muted/50 uppercase tracking-widest flex items-center gap-1"
                  >
                    <Tag size={8} /> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. RESEARCH SECTIONS */}
            <div className="space-y-3">
              <Section
                id="executive-summary"
                num={sectionNum(1, "01")}
                title={translatedUI.executiveSummary}
                icon={<FileText size={13} />}
                accent
                isHighlighted={getIsHighlighted("executive-summary")}
              >
                <Prose
                  text={displayDossier?.executive_summary}
                  fallback={
                    translatedExcerpt ||
                    "This intelligence dossier provides a comprehensive technical overview, exploitation analysis, and enterprise risk evaluation for the selected vulnerability class. Strategic guidelines are formulated based on real-world incident response data."
                  }
                  isHighlighted={getIsHighlighted("executive-summary")}
                  activeCharIndex={activeCharIndex}
                />
              </Section>

              <AdSlot />


              <Section
                id="introduction"
                num="02"
                title={translatedUI.introduction}
                icon={<BookOpen size={13} />}
                isHighlighted={getIsHighlighted("introduction")}
                hidden={explanationMode === 'beginner'}
              >
                <Prose
                  text={displayDossier?.introduction}
                  fallback="Technical introduction to the vulnerability class, its history, and initial discovery vectors."
                  isHighlighted={getIsHighlighted("introduction")}
                  activeCharIndex={activeCharIndex}
                />
              </Section>

              <AdSlot />


              <Section
                id="simple-explanation"
                num={sectionNum(2, "03")}
                title={translatedUI.simpleExplanation}
                icon={<Globe size={13} />}
                isHighlighted={getIsHighlighted("simple-explanation")}
              >
                <Prose
                  text={displayDossier?.simple_explanation}
                  fallback="A non-technical, high-level overview designed for rapid conceptual understanding."
                  isHighlighted={getIsHighlighted("simple-explanation")}
                  activeCharIndex={activeCharIndex}
                />

                {/* Real-World Example card – only in simple mode */}
                {explanationMode === 'beginner' && (
                  <div className="mt-5 p-4 rounded-2xl bg-yellow-400/[0.04] border border-yellow-400/20 shadow-[inset_0_0_20px_rgba(250,204,21,0.03)]">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-400 text-base">💡</span>
                      <span className="font-orbitron font-black text-[10px] uppercase tracking-widest text-yellow-400">
                        {translatedUI.realWorldExampleTitle}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {displayDossier?.real_world_example || translatedUI.realWorldExampleFallback}
                    </p>
                  </div>
                )}
              </Section>


              <Section
                id="technical-deep-dive"
                num="04"
                title={translatedUI.technicalDeepDive}
                icon={<Code2 size={13} />}
                accent
                isHighlighted={getIsHighlighted("technical-deep-dive")}
                hidden={explanationMode === 'beginner'}
              >
                <Prose
                  text={displayDossier?.technical_deep_dive}
                  fallback="The underlying vulnerability arises from a lack of secure boundary checks at the code level. When HTTP request input is processed, the execution context fails to properly sanitize or authorize the parameter, leading to direct memory or database manipulation."
                  isHighlighted={getIsHighlighted("technical-deep-dive")}
                  activeCharIndex={activeCharIndex}
                />
              </Section>

              <AdSlot />


              <Section 
                id="where-to-test"
                num="04.1"
                title={translatedUI.whereToTest}
                icon={<Search size={13} />}
                isHighlighted={getIsHighlighted("where-to-test")}
                hidden={explanationMode === 'beginner'}
              >
                <div className="space-y-6">
                  {displayDossier?.where_to_test?.explanation && (
                    <Prose 
                      text={displayDossier.where_to_test.explanation} 
                      isHighlighted={getIsHighlighted("where-to-test")}
                      activeCharIndex={activeCharIndex}
                    />
                  )}
                  
                  {displayDossier?.where_to_test?.mapping_table && (
                     <MappingTable data={displayDossier.where_to_test.mapping_table} />
                  )}

                  {displayDossier?.where_to_test?.mindset_diagram && (
                    <div className="bg-bg-primary border border-border-color rounded-2xl p-4 overflow-hidden">
                      <h4 className="font-orbitron font-black text-[9px] uppercase tracking-[0.2em] text-accent-primary mb-4 text-center">Pentester Mindset Workflow</h4>
                      <MindsetDiagram steps={displayDossier.where_to_test.mindset_diagram} />
                    </div>
                  )}

                  {displayDossier?.where_to_test?.practical_example && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Terminal size={14} className="text-accent-primary" />
                          <h4 className="font-orbitron font-black text-[10px] uppercase tracking-widest text-text-primary">Practical Discovery Example</h4>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed mb-4">
                          {displayDossier.where_to_test.practical_example.explanation}
                        </p>
                        <div className="space-y-3">
                          <CodeBlock 
                            code={displayDossier.where_to_test.practical_example.request} 
                            label="Discovery Request"
                          />
                          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <span className="font-mono text-[8px] uppercase font-black text-red-400 block mb-1">Key Observation</span>
                            <p className="text-[10px] text-red-500 italic font-mono leading-relaxed">
                              {displayDossier.where_to_test.practical_example.observation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              <Section
                id="attack-workflow"
                num={sectionNum(3, "05")}
                title="Attack Workflow"
                icon={<Activity size={13} />}
                isHighlighted={getIsHighlighted("attack-workflow")}
              >
                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <Prose
                      text={Array.isArray(displayDossier?.attack_workflow) ? displayDossier.attack_workflow.join(" ") : displayDossier?.attack_workflow}
                      fallback="The standard exploitation progression follows four operational phases as the malicious payload transits through the architectural layers."
                      isHighlighted={getIsHighlighted("attack-workflow")}
                      activeCharIndex={activeCharIndex}
                    />
                    
                    <MethodologyCallout 
                      type="PTES"
                      stage={translatedMethodology.ptesIntel}
                      description={translatedMethodology.ptesIntelDesc}
                    />
                  </motion.div>
                  <motion.div
                    initial={isLowPerformance ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                    whileInView={isLowPerformance ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    {!isLowPerformance ? (
                      <AnimatedWorkflowDiagram 
                        externalStep={narrationSections[narrationSync.section]?.title === translatedUI.attackWorkflow ? narrationSync.chunk : undefined} 
                        speed={narrationSpeed}
                      />
                    ) : (
                      <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center text-[10px] font-mono text-text-muted/40 uppercase tracking-widest italic">
                        Animations disabled in Performance Mode
                      </div>
                    )}
                  </motion.div>
                </div>
              </Section>

              <Section
                id="attack-simulation"
                num="05.1"
                title="Interactive Attack Simulation"
                icon={<Terminal size={13} />}
                accent
              >
                <Prose text="Watch a live simulation of how this attack is executed in the real world." />
                
                {post.intel?.owasp === 'A01' && post.intel?.family?.includes('Access Control') && (
                  <BurpSimulation 
                    title="IDOR / BAC Proxy Interception"
                    activeStage={getSimulationStage("attack-workflow")}
                    speed={narrationSpeed}
                    steps={[
                      {
                        title: translatedSimLabels.burp.t1,
                        description: translatedSimLabels.burp.d1,
                        request: "GET /api/v1/users/account?id=1042 HTTP/1.1\nHost: target.com\nAuthorization: Bearer eyJhbGciOiJIUzI1...\n\n"
                      },
                      {
                        title: translatedSimLabels.burp.t2,
                        description: translatedSimLabels.burp.d2,
                        request: "GET /api/v1/users/account?id=1042 HTTP/1.1\nHost: target.com\nAuthorization: Bearer eyJhbGciOiJIUzI1...\n\n",
                        newRequest: "GET /api/v1/users/account?id=1043 HTTP/1.1\nHost: target.com\nAuthorization: Bearer eyJhbGciOiJIUzI1...\n\n"
                      },
                      {
                        title: translatedSimLabels.burp.t3,
                        description: translatedSimLabels.burp.d3,
                        request: "GET /api/v1/users/account?id=1043 HTTP/1.1\nHost: target.com\nAuthorization: Bearer eyJhbGciOiJIUzI1...\n\n",
                        response: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"id\": 1043,\n  \"name\": \"Alice Admin\",\n  \"email\": \"alice@target.com\",\n  \"role\": \"administrator\"\n}"
                      }
                    ]} 
                  />
                )}
                
                {post.intel?.owasp === 'A01' && post.intel?.family?.includes('Forced') && (
                   <TerminalSimulation 
                     title={translatedSimLabels.terminal.t1}
                     activeStage={getSimulationStage("attack-workflow")}
                     speed={narrationSpeed}
                     commands={[
                       {
                         command: translatedSimLabels.terminal.c1,
                         output: translatedSimLabels.terminal.o1,
                         typingSpeed: 20
                       },
                       {
                         command: translatedSimLabels.terminal.c2,
                         output: "DB_PASSWORD=\"SuperSecretP@ssw0rd123!\"",
                         delayBeforeExecution: 3000
                       }
                     ]}
                   />
                )}

                {!post.intel?.family?.includes('Access Control') && !post.intel?.family?.includes('Forced') && (
                  <BrowserDevToolsSimulation 
                    title="Client-Side Manipulation"
                    type="localStorage"
                    activeStage={getSimulationStage("attack-workflow")}
                    speed={narrationSpeed}
                    steps={[
                      {
                        title: translatedSimLabels.devtools.t1,
                        description: translatedSimLabels.devtools.d1,
                        items: [
                          { key: "theme", value: "dark" },
                          { key: "user_session", value: "eyJ0eXAi... (JWT Token)" },
                          { key: "isAdmin", value: "false" }
                        ]
                      },
                      {
                        title: translatedSimLabels.devtools.t2,
                        description: translatedSimLabels.devtools.d2,
                        highlightKey: "isAdmin",
                        action: "edit",
                        items: [
                          { key: "theme", value: "dark" },
                          { key: "user_session", value: "eyJ0eXAi... (JWT Token)" },
                          { key: "isAdmin", value: "true", isModified: true }
                        ]
                      },
                      {
                        title: translatedSimLabels.devtools.t3,
                        description: translatedSimLabels.devtools.d3,
                        items: [
                          { key: "theme", value: "dark" },
                          { key: "user_session", value: "eyJ0eXAi... (JWT Token)" },
                          { key: "isAdmin", value: "true" }
                        ]
                      }
                    ]}
                  />
                )}
              </Section>

              <Section
                id="application-architecture"
                num="06"
                title="Application Architecture"
                icon={<Layers size={13} />}
                isHighlighted={getIsHighlighted("application-architecture")}
                hidden={explanationMode === 'beginner'}
              >
                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <Prose
                      text={displayDossier?.application_architecture}
                      fallback="The architectural flaw typically resides between the API Gateway and the Application Server, where dynamic routing occurs without enforcement of strict object-level authorization checks."
                      isHighlighted={getIsHighlighted("application-architecture")}
                      activeCharIndex={activeCharIndex}
                    />
                  </motion.div>
                  <motion.div
                    initial={isLowPerformance ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    whileInView={isLowPerformance ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    {!isLowPerformance ? (
                      <AnimatedArchDiagram />
                    ) : (
                      <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center text-[10px] font-mono text-text-muted/40 uppercase tracking-widest italic">
                        Architecture visualization simplified
                      </div>
                    )}
                  </motion.div>
                </div>
              </Section>

              <Section
                id="root-cause-analysis"
                num="07"
                title="Root Cause Analysis"
                icon={<Bug size={13} />}
                isHighlighted={getIsHighlighted("root-cause-analysis")}
                hidden={explanationMode === 'beginner'}
              >
                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <Prose
                      text={displayDossier?.root_cause_analysis}
                      fallback="The root cause directly stems from insecure parameter assignment and missing object-level authorization across the data execution flow."
                      isHighlighted={getIsHighlighted("root-cause-analysis")}
                      activeCharIndex={activeCharIndex}
                    />

                    <MethodologyCallout 
                      type="OSSTMM"
                      stage={translatedMethodology.osstmmTrust}
                      description={translatedMethodology.osstmmTrustDesc}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <AnimatedRootCauseDiagram 
                      externalStep={narrationSections[narrationSync.section]?.title === translatedUI.rootCauseAnalysis ? narrationSync.chunk : undefined} 
                    />
                  </motion.div>
                </div>
              </Section>

              <Section
                id="code-examples"
                num="08"
                title={translatedUI.codeExamples}
                icon={<Code2 size={13} />}
                accent
                isHighlighted={getIsHighlighted("code-examples")}
                hidden={explanationMode === 'beginner'}
              >
                <div className="space-y-6">
                  {displayDossier?.code_examples?.explanation && (
                    <p className="text-sm text-text-muted">
                      {displayDossier.code_examples.explanation}
                    </p>
                  )}
                  {!displayDossier?.code_examples?.explanation && (
                    <p className="text-sm text-text-muted opacity-80">
                      Review the vulnerable implementation alongside its secure
                      counterpart to understand the exact required secure coding
                      practices and authorization logic.
                    </p>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <CodeBlock
                      code={
                        displayDossier?.code_examples?.insecureCode ||
                        "// ❌ Insecure Implementation\nfunction getUserData(req, res) {\n  const userData = db.query(`SELECT * FROM users WHERE id = ${req.body.id}`);\n  return res.json(userData);\n}"
                      }
                      label="❌ Vulnerable Code"
                      isSecure={false}
                    />
                    <CodeBlock
                      code={
                        displayDossier?.code_examples?.secureCode ||
                        "// ✓ Secure Implementation\nfunction getUserData(req, res) {\n  const userData = db.query(`SELECT * FROM users WHERE id = ? AND owner_id = ?`, [req.body.id, req.user.id]);\n  if (!userData) return res.status(403).json({\n    error: 'Access Denied'\n  });\n  return res.json(userData);\n}"
                      }
                      label="✓ Secure Code"
                      isSecure
                    />
                  </div>

                  <div className="bg-bg-secondary border border-border-color rounded-xl p-5">
                     <h4 className="font-orbitron font-black text-[11px] uppercase tracking-widest text-accent-primary mb-3">Mitigation Logic</h4>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-text-muted">
                           <span className="shrink-0 mt-0.5 text-green-500"><CheckCircle size={14} /></span>
                           <span><strong className="text-text-primary">Object-Level Ownership:</strong> The secure code validates that the requested object explicitly belongs to the currently authenticated user (`req.user.id`).</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-text-muted">
                           <span className="shrink-0 mt-0.5 text-green-500"><CheckCircle size={14} /></span>
                           <span><strong className="text-text-primary">Prepared Statements:</strong> Replaces string concatenation with parameterized queries (`?`), neutralizing SQL Injection vectors alongside BAC.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-text-muted">
                           <span className="shrink-0 mt-0.5 text-green-500"><CheckCircle size={14} /></span>
                           <span><strong className="text-text-primary">Fail Securely:</strong> Implements explicit denial (`403 Forbidden`) if the authorization boundary check fails, avoiding silent failures.</span>
                        </li>
                     </ul>
                  </div>
                </div>
              </Section>

              <Section
                id="impact-analysis"
                num={sectionNum(4, "09")}
                title={translatedUI.impactAnalysis}
                icon={<AlertTriangle size={13} />}
                isHighlighted={getIsHighlighted("impact-analysis")}
              >
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          k: "Confidentiality",
                          v:
                            dossierData?.impact_analysis?.confidentiality ||
                            "HIGH",
                        },
                        {
                          k: "Integrity",
                          v:
                            dossierData?.impact_analysis?.integrity || "MEDIUM",
                        },
                        {
                          k: "Availability",
                          v:
                            dossierData?.impact_analysis?.availability || "LOW",
                        },
                      ].map((c) => (
                        <div
                          key={c.k}
                          className="p-4 rounded-xl border border-white/5 bg-white/5 text-center shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]"
                        >
                          <div className="font-mono text-[8px] text-text-muted/40 uppercase tracking-widest mb-2">
                            {c.k}
                          </div>
                          <div
                            className={`font-orbitron font-black text-xs uppercase ${c.v === "CRITICAL" ? "text-red-400" : c.v === "HIGH" ? "text-orange-400" : c.v === "MEDIUM" ? "text-yellow-400" : "text-green-400"}`}
                          >
                            {c.v || "N/A"}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Prose
                      text={displayDossier?.impact_analysis?.description}
                      fallback="Successful exploitation fundamentally compromises operational security, leading to unauthorized data disclosure and potential downstream system compromise."
                    />

                    <MethodologyCallout 
                      type="OSSTMM"
                      stage={translatedMethodology.osstmmOps}
                      description={translatedMethodology.osstmmOpsDesc}
                    />
                  </div>
              </Section>

              <Section
                id="cvss-analysis"
                num="10"
                title={translatedUI.cvssAnalysis}
                icon={<Activity size={13} />}
                isHighlighted={getIsHighlighted("cvss-analysis")}
                hidden={explanationMode === 'beginner'}
              >
                <div>
                  <div className="flex items-center gap-5 p-4 rounded-xl bg-white/5 border border-white/5 mb-4 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
                    <div className="font-orbitron font-black text-4xl text-accent-primary drop-shadow-[0_0_10px_var(--accent-glow-subtle)]">
                      {displayDossier?.cvss_analysis?.score ||
                        post.intel?.cvss ||
                        "7.5"}
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-text-muted/40 uppercase tracking-widest mb-1">
                        CVSS Vector
                      </div>
                      <div className="font-mono text-xs text-text-primary break-all">
                        {displayDossier?.cvss_analysis?.vector ||
                          "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N"}
                      </div>
                    </div>
                  </div>
                  {displayDossier?.cvss_analysis?.metrics && (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(displayDossier.cvss_analysis.metrics).map(
                        ([k, v]) => (
                          <div
                            key={k}
                            className="flex justify-between px-3 py-2 rounded-lg border border-white/5 bg-white/5"
                          >
                            <span className="font-mono text-[9px] text-text-muted/40 uppercase">
                              {k}
                            </span>
                            <span className="font-mono text-[9px] text-text-primary font-black">
                              {String(v)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                  <EduBlock 
                    type="CVSS" 
                    data={{ 
                      relation: displayDossier?.cvss_educational?.relation || 
                        `This score reflects the inherent danger of ${translatedTitle || post.title}, calculated based on its ease of exploitation and the magnitude of its impact on system confidentiality and integrity.`
                    }} 
                  />
                </div>
              </Section>

              <Section
                id="osi-mapping"
                num="11"
                title="OSI Layer Translation"
                icon={<Layers size={13} />}
                accent
                hidden={explanationMode === 'beginner'}
              >
                 <div className="bg-bg-secondary p-4 rounded-xl border border-border-color shadow-inner space-y-4">
                   <Prose text="This vulnerability executes fundamentally at the topmost layer of the OSI model, compromising the business logic built into the application." />
                   
                    <div className="flex flex-col gap-2 max-w-lg mx-auto">
                      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center text-red-500 font-mono font-black text-xs flex items-center justify-center relative overflow-hidden min-h-[50px] shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                         <motion.div 
                           className="absolute inset-0 bg-red-400/20"
                           animate={{ opacity: [0, 0.5, 0] }}
                           transition={{ duration: 2, repeat: Infinity }}
                         />
                         <span className="relative z-10 whitespace-nowrap drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">L7 Application<br/><span className="text-[9px] font-normal opacity-90 uppercase mt-1">Vulnerability Core Layer</span></span>
                      </div>

                      {['L6 Presentation', 'L5 Session', 'L4 Transport', 'L3 Network', 'L2 Data Link', 'L1 Physical'].map((layer) => (
                         <div key={layer} className="bg-bg-primary border border-border-color rounded-lg p-3 text-center text-text-muted/80 font-bold font-mono text-[10px] flex items-center justify-center min-h-[44px] transition-colors hover:border-accent-primary/30">
                           <span className="whitespace-nowrap">{layer}</span>
                         </div>
                      ))}
                    </div>
                 </div>
              </Section>
              
              <Section
                id="protocol-breakdown"
                num="12"
                title="Protocol Dissection"
                icon={<Globe size={13} />}
                hidden={explanationMode === 'beginner'}
              >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="bg-bg-primary border border-border-color rounded-xl p-4 flex flex-col items-center justify-center text-center group hover:border-accent-primary/50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-bg-secondary border border-border-color flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                           <span className="font-orbitron font-black text-xs text-text-primary">HTTP/S</span>
                        </div>
                        <h4 className="font-mono text-[10px] uppercase font-bold text-accent-primary mb-2 tracking-widest">Transport</h4>
                        <p className="text-[10px] sm:text-xs text-text-muted leading-relaxed">The attack payload transverses the network encrypted via TLS over standard HTTP verbs (GET, POST).</p>
                     </div>
                     <div className="bg-bg-primary border border-border-color rounded-xl p-4 flex flex-col items-center justify-center text-center group hover:border-red-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                           <span className="font-orbitron font-black text-xs text-red-500">REST/GQL</span>
                        </div>
                        <h4 className="font-mono text-[10px] uppercase font-bold text-red-500 mb-2 tracking-widest">Interpretation</h4>
                        <p className="text-[10px] sm:text-xs text-text-muted leading-relaxed">APIs parse the manipulated request payload, trusting the structural format but executing it insecurely.</p>
                     </div>
                     <div className="bg-bg-primary border border-border-color rounded-xl p-4 flex flex-col items-center justify-center text-center group hover:border-green-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-bg-secondary border border-border-color flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                           <Database size={16} className="text-text-primary" />
                        </div>
                        <h4 className="font-mono text-[10px] uppercase font-bold text-green-500 mb-2 tracking-widest">Persistence</h4>
                        <p className="text-[10px] sm:text-xs text-text-muted leading-relaxed">The database or executing script processes the malicious instruction due to missing authorization boundaries.</p>
                     </div>
                  </div>
              </Section>

              <Section
                id="cwe-mapping"
                num="13"
                title={translatedUI.cweMapping}
                icon={<Shield size={13} />}
                hidden={explanationMode === 'beginner'}
              >
                <Prose
                  text={displayDossier?.cwe_mapping || post.intel?.cwe}
                  fallback="Mapped exclusively to structural weakness paradigms associated with authorization bypass and parameter tampering classifications."
                  isHighlighted={getIsHighlighted("cwe-mapping")}
                  activeCharIndex={activeCharIndex}
                />
                <EduBlock 
                  type="CWE" 
                  data={{ 
                    relation: displayDossier?.cwe_educational?.relation || 
                      `This vulnerability is a classic manifestation of this weakness, where an application fails to properly enforce authorization checks at the critical functional entry points.`
                  }} 
                />
              </Section>

              <Section
                id="cve-references"
                num="12"
                title={translatedUI.cveReferences}
                hidden={explanationMode === 'beginner'}
              >
                <div className="flex flex-wrap gap-3">
                  {(
                    displayDossier?.cve_references || [
                      post.intel?.cve,
                      "CVE-2023-EXAMPLE",
                    ]
                  )
                    .filter(Boolean)
                    .map((cve: string) => (
                      <span
                        key={cve}
                        className="px-4 py-2 rounded-xl bg-accent-primary/5 border border-accent-primary/20 font-mono text-xs text-accent-primary cursor-default shadow-[0_0_10px_var(--accent-glow-subtle)]"
                      >
                        {cve}
                      </span>
                    ))}
                </div>
                <EduBlock 
                  type="CVE" 
                  data={{ 
                    relation: displayDossier?.cve_educational?.relation || 
                      `Historical CVEs like these prove that even mature enterprise systems frequently suffer from this exact logic failure, often leading to full administrative compromise.`
                  }} 
                />
              </Section>

              <Section
                id="mitre-attack-mapping"
                num="13"
                title={translatedUI.mitreMapping}
                icon={<Target size={13} />}
                hidden={explanationMode === 'beginner'}
              >
                <Prose
                  text={displayDossier?.mitre_mapping || post.intel?.mitre}
                  fallback="T1548.002: Bypass User Access Control - Adversaries exploit software vulnerabilities or configuration missteps to manipulate administrative privileges."
                  isHighlighted={getIsHighlighted("mitre-attack-mapping")}
                  activeCharIndex={activeCharIndex}
                />
                <EduBlock 
                  type="MITRE" 
                  data={{ 
                    relation: displayDossier?.mitre_educational?.relation || 
                      `Adversaries utilize this specific technique to bypass standard access controls, leveraging functional gaps to escalate their privileges within the target infrastructure.`
                  }} 
                />
              </Section>

              <Section
                id="industry-compliance-impact"
                num="14"
                title={translatedUI.industryCompliance}
                icon={<Globe size={13} />}
                hidden={explanationMode === 'beginner'}
              >
                <Prose
                  text={displayDossier?.industry_impact}
                  fallback="Exploitation of this vulnerability directly violating compliance matrix frameworks including SOC2, PCI-DSS (Requirement 6), and HIPAA privacy rules regarding PHI segregation."
                  isHighlighted={getIsHighlighted("industry-compliance-impact")}
                  activeCharIndex={activeCharIndex}
                />
              </Section>

              <Section
                id="detection-methodologies"
                num="15"
                title={translatedUI.detectionMethodologies}
                icon={<Activity size={13} />}
                isHighlighted={getIsHighlighted("detection-methodologies")}
                hidden={explanationMode === 'beginner'}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="space-y-4"
                >
                  <NumberedList
                    items={displayDossier?.detection_methodologies}
                    fallbackItems={[
                      "Monitor web application firewall (WAF) logs for abnormal parameter enumeration.",
                      "Deploy SIEM correlation rules to flag rapid iteration through sequential object IDs.",
                      "Utilize dynamic application security testing (DAST) in the CI/CD pipeline.",
                    ]}
                  />

                  <MethodologyCallout 
                    type="PTES"
                    stage={translatedMethodology.ptesVuln}
                    description={translatedMethodology.ptesVulnDesc}
                  />
                </motion.div>
              </Section>
              <Section
                id="ptes-mapping"
                num="15.1"
                title={translatedUI.ptesMapping}
                icon={<Target size={13} />}
                hidden={explanationMode === 'beginner'}
              >
                <div className="space-y-5">
                  <Prose 
                    text="This vulnerability's lifecycle is mapped through the Penetration Testing Execution Standard (PTES) phases to demonstrate professional assessment workflows." 
                    isHighlighted={getIsHighlighted("ptes-mapping")}
                    activeCharIndex={activeCharIndex}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayDossier?.ptes_mapping?.map((item: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-bg-secondary border border-border-color hover:border-accent-primary/30 transition-colors group">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="shrink-0 w-6 h-6 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary font-mono text-[9px] font-black">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h4 className="font-orbitron font-black text-[10px] uppercase text-text-primary tracking-widest group-hover:text-accent-primary transition-colors">{item.phase}</h4>
                        </div>
                        <div className="space-y-3 pl-9">
                          <div>
                            <span className="font-mono text-[8px] text-gray-500 dark:text-text-muted/50 font-bold uppercase tracking-widest block mb-1">Simple Explanation</span>
                            <p className="text-xs text-text-muted leading-relaxed">{item.simple}</p>
                          </div>
                          <div>
                            <span className="font-mono text-[8px] text-accent-primary/80 dark:text-accent-primary/50 font-bold uppercase tracking-widest block mb-1">Technical Phase Detail</span>
                            <p className="text-xs text-text-primary italic font-mono border-l-2 border-accent-primary/20 pl-3 py-1 bg-accent-primary/[0.02]">{item.technical}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              <Section
                id="osstmm-analysis"
                num="15.2"
                title={translatedUI.osstmmAnalysis}
                icon={<Shield size={13} />}
                hidden={explanationMode === 'beginner'}
              >
                <div className="space-y-5">
                  <Prose text="Security verification according to OSSTMM identifies the specific failure points in the operational security logic and trust boundary enforcement." />
                  <div className="space-y-4">
                    {displayDossier?.osstmm_analysis?.map((item: any, i: number) => (
                      <div key={i} className="p-5 rounded-xl bg-bg-primary border border-border-color relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent-primary/10 transition-colors" />
                        <h4 className="font-orbitron font-black text-[11px] uppercase tracking-[0.2em] text-accent-primary mb-3 relative z-10">{item.principle}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                           <div className="p-3 rounded-lg bg-bg-secondary border border-border-color">
                              <span className="font-mono text-[8px] text-gray-500 dark:text-text-muted/50 uppercase tracking-widest block mb-2 font-black">Verification Focus</span>
                              <p className="text-xs text-text-muted leading-relaxed">{item.simple}</p>
                           </div>
                           <div className="p-3 rounded-lg bg-accent-primary/[0.02] border border-accent-primary/10">
                              <span className="font-mono text-[8px] text-accent-primary/80 dark:text-accent-primary/50 uppercase tracking-widest block mb-2 font-black">Strategic Remediation Logic</span>
                              <p className="text-xs text-text-primary italic font-mono leading-relaxed">{item.technical}</p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              <Section
                id="manual-testing-checklist"
                num="16"
                title={translatedUI.manualTesting}
                icon={<CheckCircle size={13} />}
                accent
                isHighlighted={getIsHighlighted("manual-testing-checklist")}
                hidden={explanationMode === 'beginner'}
              >
                <div className="space-y-4">
                  <NumberedList
                    items={displayDossier?.manual_checklist}
                    fallbackItems={[
                      "Intercept all HTTP traffic utilizing an attack proxy like Burp Suite Professional.",
                      "Map the application footprint and systematically identify all parameter inputs.",
                      "Replay requests modifying numeric IDs and GUIDs across different privilege boundaries.",
                      "Verify server response differences between legitimate and manipulated object IDs.",
                    ]}
                  />

                  <MethodologyCallout 
                    type="PTES"
                    stage={translatedMethodology.ptesExploit}
                    description={translatedMethodology.ptesExploitDesc}
                  />
                </div>
              </Section>

              <Section
                id="automated-testing-tools"
                num="17"
                title={translatedUI.automatedTesting}
                icon={<Wrench size={13} />}
                hidden={explanationMode === 'beginner'}
              >
                <div className="space-y-4">
                  {displayDossier?.automated_tools?.length ? (
                    <div className="space-y-3">
                      {displayDossier.automated_tools.map(
                        (
                          tool: { name: string; description: string },
                          i: number,
                        ) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl bg-white/5 border border-white/5"
                          >
                            <div className="font-orbitron font-black text-xs text-accent-primary uppercase italic mb-1">
                              {tool.name}
                            </div>
                            <p className="text-sm text-text-muted">
                              {tool.description}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-primary/30 transition-colors">
                        <div className="font-orbitron font-black text-xs text-accent-primary uppercase italic mb-1">
                          Burp Suite Professional (Autorize)
                        </div>
                        <p className="text-sm text-text-muted">
                          Automated extension used to simulate requests across
                          varying permission configurations.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-primary/30 transition-colors">
                        <div className="font-orbitron font-black text-xs text-accent-primary uppercase italic mb-1">
                          Nuclei Templates
                        </div>
                        <p className="text-sm text-text-muted">
                          Fast and customizable vulnerability scanner capable of
                          running targeted YAML-based exploits.
                        </p>
                      </div>
                    </div>
                  )}

                  <MethodologyCallout 
                    type="PTES"
                    stage={translatedMethodology.ptesExploit}
                    description={translatedMethodology.ptesAutoDesc}
                  />
                </div>
              </Section>

              <Section
                id="prevention-strategy"
                num={sectionNum(5, "18")}
                title={translatedUI.preventionStrategy}
                icon={<Shield size={13} />}
                accent
                isHighlighted={getIsHighlighted("prevention-strategy")}
              >
                <NumberedList
                  items={displayDossier?.prevention_strategy}
                  fallbackItems={[
                    "Implement strong, centralized Object-Level Authorization mapping routines.",
                    "Never rely exclusively on client-provided object IDs without explicit database ownership verification.",
                    "Enforce continuous access-control regression testing across the API layer.",
                    "Utilize cryptographically strong UUIDs rather than sequential databases integers.",
                  ]}
                />
              </Section>

              <Section
                id="common-developer-mistakes"
                num="19"
                title={translatedUI.commonMistakes}
                icon={<AlertTriangle size={13} />}
                isHighlighted={getIsHighlighted("common-developer-mistakes")}
                hidden={explanationMode === 'beginner'}
              >
                <NumberedList
                  items={displayDossier?.developer_mistakes}
                  fallbackItems={[
                    "Assuming client-side UI hiding equates to secure API exposure.",
                    "Implementing authentication but wholly neglecting authorization scope checks.",
                    "Writing database queries that blindly trust input parameters from the HTTP body.",
                  ]}
                />
              </Section>

              <Section
                id="bug-bounty-report-example"
                num="20"
                title={translatedUI.bugBounty}
                icon={<FileText size={13} />}
                isHighlighted={getIsHighlighted("bug-bounty-report-example")}
                hidden={explanationMode === 'beginner'}
              >
                <div className="space-y-4">
                  <h3 className="font-orbitron font-black text-sm text-text-primary uppercase italic">
                    {displayDossier?.bug_bounty_example?.title ||
                      `Critical Authorization Bypass leading to PII disclosure`}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {displayDossier?.bug_bounty_example?.summary ||
                      `I have identified a severe flaw in the API endpoint allowing any authenticated user to view personal identification information of arbitrary users.`}
                  </p>
                  <div>
                    <div className="font-mono text-[9px] text-text-muted/40 uppercase tracking-widest mb-3 font-black">
                      Reproduction Steps
                    </div>
                    <NumberedList
                      items={displayDossier?.bug_bounty_example?.steps}
                      fallbackItems={[
                        "Authenticate to the application with an attacker account.",
                        "Forward intercepted request to Burp Repeater.",
                        "Change the 'user_id' JSON payload to 'target_user_id'.",
                        "Observe the server returning the victim's social security data with a 200 OK.",
                      ]}
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/10 shadow-[inner_0_0_15px_var(--accent-glow-subtle)]">
                    <div className="font-mono text-[9px] text-accent-primary/50 uppercase tracking-widest mb-2 font-black">
                      Recommendation
                    </div>
                    <p className="text-sm text-text-muted">
                      {displayDossier?.bug_bounty_example?.recommendation ||
                        `Enforce strict ownership validation using the session JWT token against the requested database row.`}
                    </p>
                  </div>

                  <MethodologyCallout 
                    type="PTES"
                    stage={translatedMethodology.ptesReport}
                    description={translatedMethodology.ptesReportDesc}
                  />
                </div>
              </Section>

              <Section
                id="comparison-table"
                num="21"
                title={translatedUI.comparisonTable}
                icon={<Layers size={13} />}
                hidden={explanationMode === 'beginner'}
              >
                <div className="overflow-x-auto rounded-xl border border-white/5 shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]">
                  <table className="w-full text-xs text-text-muted font-mono">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/5">
                        <th className="px-4 py-3 text-left text-[9px] uppercase text-text-muted/40">
                          Feature
                        </th>
                        <th className="px-4 py-3 text-left text-[9px] uppercase text-accent-primary/60">
                          Target Architecture
                        </th>
                        <th className="px-4 py-3 text-left text-[9px] uppercase text-text-muted/40">
                          Remediated Architecture
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayDossier?.comparison_table?.length
                        ? displayDossier.comparison_table.map(
                            (row: any, i: number) => (
                              <tr
                                key={i}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                              >
                                <td className="px-4 py-3 text-[9px] text-text-muted/50">
                                  {row.feature}
                                </td>
                                <td className="px-4 py-3 text-[9px] text-text-primary font-black">
                                  {row.target}
                                </td>
                                {row.related?.map((r: string, j: number) => (
                                  <td
                                    key={j}
                                    className="px-4 py-3 text-[9px] text-text-muted"
                                  >
                                    {r}
                                  </td>
                                ))}
                              </tr>
                            ),
                          )
                        : [
                            {
                              f: "Parameter Type",
                              t: "Sequential Int String",
                              r: "Cryptographic UUIDv4",
                            },
                            {
                              f: "Boundary Verification",
                              t: "None (Bypass)",
                              r: "Object-Level Scoping",
                            },
                            {
                              f: "Database Access",
                              t: "Direct Execution Map",
                              r: "Prepared Parameterized Auth",
                            },
                          ].map((row, i) => (
                            <tr
                              key={i}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                              <td className="px-4 py-3 text-[9px] text-text-muted/50">
                                {row.f}
                              </td>
                              <td className="px-4 py-3 text-[9px] text-red-400 font-black">
                                {row.t}
                              </td>
                              <td className="px-4 py-3 text-[9px] text-green-400 opacity-80">
                                {row.r}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 space-y-6 border-t border-white/5 pt-8">
                  <Prose 
                    text={translatedUI.comparisonIntro} 
                    isHighlighted={getIsHighlighted("comparison-table")}
                    activeCharIndex={activeCharIndex}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-red-400/[0.02] border border-red-400/10 shadow-[inset_0_0_20px_rgba(248,113,113,0.02)]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                        <span className="font-orbitron font-black text-[10px] text-red-400 uppercase tracking-widest">
                          {translatedUI.vulnerableArch}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed font-mono">
                        {translatedUI.vulnerableDesc}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-green-400/[0.02] border border-green-400/10 shadow-[inset_0_0_20px_rgba(74,222,128,0.02)]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                        <span className="font-orbitron font-black text-[10px] text-green-400 uppercase tracking-widest">
                          {translatedUI.secureArch}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed font-mono">
                        {translatedUI.secureDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              <AdSlot />


              <Section
                id="osi-model-layer-mapping"
                num="22"
                title={translatedUI.osiMapping}
                icon={<Layers size={13} />}
                hidden={explanationMode === 'beginner'}
              >
                <div className="flex gap-1.5 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7].map((layer) => {
                    const lnames = [
                      "Physical",
                      "DataLink",
                      "Network",
                      "Transport",
                      "Session",
                      "Presentation",
                      "Application",
                    ];
                    const activeLayer = displayDossier?.osi_layer || 7;
                    return (
                      <div
                        key={layer}
                        className={`flex-1 min-w-[56px] px-2 py-4 rounded-xl text-center border font-mono text-[8px] font-black uppercase transition-all ${layer === activeLayer ? "bg-accent-primary text-black border-accent-primary shadow-[0_0_16px_var(--accent-glow-subtle)] scale-105" : "bg-white/5 border-white/5 text-text-muted/20"}`}
                      >
                        <div className="text-[10px] font-black">L{layer}</div>
                        <div className="mt-1 opacity-60 leading-tight">
                          {lnames[layer - 1]}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-accent-primary/[0.02] border border-accent-primary/10 shadow-[inset_0_0_20px_rgba(var(--accent-primary-rgb),0.02)]">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={14} className="text-accent-primary" />
                    <span className="font-orbitron font-black text-[10px] text-accent-primary uppercase tracking-widest">
                      Layer 7: Application Security Analysis
                    </span>
                  </div>
                  <Prose 
                    text={translatedUI.osiExploration} 
                    isHighlighted={getIsHighlighted("osi-model-layer-mapping")}
                    activeCharIndex={activeCharIndex}
                  />
                </div>
              </Section>

              <Section
                id="protocol-mapping"
                num="23"
                title={translatedUI.protocolMapping}
                icon={<Globe size={13} />}
                isHighlighted={getIsHighlighted("protocol-mapping")}
                hidden={explanationMode === 'beginner'}
              >
                <div className="flex flex-wrap gap-3">
                  {(
                    displayDossier?.protocols || [
                      "HTTP",
                      "HTTPS",
                      "WSS",
                      "REST API",
                      "GRAPHQL",
                    ]
                  ).map((p: string) => (
                    <span
                      key={p}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-text-muted uppercase tracking-widest hover:border-text-muted/30 transition-all font-black"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4">
                  {[
                    { title: translatedUI.protocolHttpTitle, desc: translatedUI.protocolHttpDesc, icon: <Globe size={12} /> },
                    { title: translatedUI.protocolRestTitle, desc: translatedUI.protocolRestDesc, icon: <Layers size={12} /> },
                    { title: translatedUI.protocolGraphqlTitle, desc: translatedUI.protocolGraphqlDesc, icon: <Shield size={12} /> }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-white/5 text-text-muted group-hover:text-accent-primary transition-colors">
                          {item.icon}
                        </div>
                        <h4 className="font-orbitron font-black text-[9px] uppercase tracking-widest text-text-primary">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-text-muted leading-relaxed pl-8 border-l border-white/5">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section
                id="key-takeaways"
                num={sectionNum(6, "24")}
                title={translatedUI.keyTakeaways}
                icon={<CheckCircle size={13} />}
                isHighlighted={getIsHighlighted("key-takeaways")}
                accent
              >
                <NumberedList
                  items={displayDossier?.key_takeaways}
                  fallbackItems={[
                    "Trust boundaries must be strictly enforced at the data layer.",
                    "Authentication is entirely distinct from true authorization.",
                    "Implementing random, unpredictable object identifiers significantly reduces surface risk.",
                  ]}
                />
              </Section>
              
              <AdSlot />

              <Section
                id="strategic-conclusion"
                num="25"
                title={translatedUI.strategicConclusion}
                icon={<Shield size={13} />}
                isHighlighted={getIsHighlighted("strategic-conclusion")}
                accent
                hidden={explanationMode === 'beginner'}
              >
                <Prose
                  text={displayDossier?.strategic_conclusion}
                  fallback="This concludes the technical evaluation. Remediating such flaws requires holistic architectural modification rather than disparate patchwork. Enterprise development teams must integrate secure authorization frameworks deeply within the object routing paradigm to guarantee data confidentiality."
                  isHighlighted={getIsHighlighted("strategic-conclusion")}
                  activeCharIndex={activeCharIndex}
                />
              </Section>
            </div>
          </div>

          {/* 7. PRACTICE LAB */}
          <section
            id="practice-lab"
            className="mt-10 p-6 rounded-2xl border border-accent-primary/20 bg-accent-primary/[0.02]"
          >
            <div className="flex items-center gap-3 mb-5">
              <FlaskConical size={18} className="text-accent-primary" />
              <h2 className="font-orbitron font-black text-base text-text-primary uppercase italic tracking-wide">
                Practice Lab
              </h2>
            </div>
            <p className="text-sm text-text-muted mb-4">
              <strong className="text-text-primary">Goal:</strong> Identify and
              exploit this vulnerability using our interactive simulator
              environment.
            </p>
            <div className="mb-6">
              <div className="font-mono text-[9px] text-text-muted/40 uppercase tracking-widest font-black mb-3">
                Recommended Steps
              </div>
              <ol className="space-y-2.5">
                {[
                  "Open the interactive exploitation simulation environment.",
                  "Analyze the baseline HTTP request for user-controlled parameters.",
                  "Modify the targeted parameter value within the request payload.",
                  "Execute the attack and monitor the server console for unauthorized data leakage.",
                ].map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 items-start text-sm text-text-muted"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary font-mono text-[8px] mt-0.5 shadow-[0_0_10px_var(--accent-glow-subtle)]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative group inline-block">
              <div className="absolute inset-0 bg-accent-primary/50 blur-xl group-hover:blur-2xl transition-all opacity-50 group-hover:opacity-100 rounded-xl" />
              <button
                onClick={() => setLabOpen(true)}
                className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl font-orbitron font-black text-[10px] uppercase tracking-widest text-black transition-all hover:scale-[1.02] active:scale-95 z-10"
                style={{ background: "var(--accent-primary)" }}
              >
                <Play size={14} className="fill-current" /> Practice Exploit
              </button>
            </div>
          </section>

          {/* 8. SECURE vs INSECURE */}
          <section
            id="secure-compare"
            className="mt-6 p-6 rounded-2xl border border-white/5 bg-white/[0.01]"
          >
            <div className="flex items-center gap-3 mb-5">
              <Code2 size={16} className="text-accent-primary" />
              <h2 className="font-orbitron font-black text-base text-text-primary uppercase italic tracking-wide">
                Secure vs Insecure Design
              </h2>
            </div>
            <SecureComparison
              insecureCode={dossierData?.code_examples?.insecureCode}
              secureCode={dossierData?.code_examples?.secureCode}
              explanation={dossierData?.code_examples?.explanation}
            />
          </section>

          {/* 9. RELATED VULNERABILITIES */}
          {relatedPosts.length > 0 && (
            <section id="related" className="mt-6 mb-12">
              <div className="flex items-center gap-3 mb-5">
                <ArrowRight size={16} className="text-accent-primary" />
                <h2 className="font-orbitron font-black text-base text-text-primary uppercase italic tracking-wide">
                  Related Research
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPosts.map((rel: any) => (
                  <Link
                    key={rel.slug}
                    to={`/blog/${rel.slug}`}
                    className="group p-5 rounded-xl border border-border-color bg-white/[0.01] hover:border-accent-primary/40 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-[8px] text-accent-primary/50 uppercase tracking-widest block mb-1">
                        {rel.intel?.cve || rel.intel?.owasp || "Research"}
                      </span>
                      <h3 className="font-orbitron font-black text-sm text-text-primary uppercase italic group-hover:text-accent-primary transition-colors truncate">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-text-muted/60 mt-0.5 line-clamp-1">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-text-muted group-hover:bg-accent-primary group-hover:text-black group-hover:border-accent-primary transition-all shrink-0 hover:shadow-[0_0_15px_var(--accent-glow)]">
                      <ArrowRight size={13} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          
          <AdSlot />

          {/* 11. RESEARCH FEEDBACK (INLINE) */}
          <ResearchFeedbackChatbot 
            articleTitle={translatedTitle}
            mode="inline"
          />
        </div>
        {/* end article container */}
      </div>

      {/* 12. ISSUE REPORT SYSTEM */}
      <IssueReportSystem currentUrl={window.location.href} language={targetLang} />


      {/* Launch Lab Modal */}
      <LaunchLabModal
        open={labOpen}
        onClose={() => setLabOpen(false)}
        title={post.title}
        scenario={displayDossier?.lab_scenario}
      />

      {/* Floating Background Play Option */}
      <AnimatePresence>
        {isNarrationPlaying && backgroundMode && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-4 py-3 bg-bg/80 border border-accent-primary/30 rounded-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.3)] min-w-[200px]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-accent-primary/20 text-accent-primary rounded-lg animate-pulse">
                <Volume2 size={12} />
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-black text-[8px] uppercase tracking-widest text-accent-primary">
                  Listening Mode
                </span>
                <span className="font-mono text-[7px] text-text-muted uppercase truncate max-w-[120px]">
                  {tocSections[narrationSync.section]?.label || translatedTitle}
                </span>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-white/10 mx-1" />
            <button
              onClick={() => setIsNarrationPlaying(false)}
              className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:scale-105 transition-all"
              title="Stop Narration"
            >
              <Square size={12} fill="currentColor" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};
