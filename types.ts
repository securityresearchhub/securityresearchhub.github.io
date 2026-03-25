
export enum SkillLevel {
  HANDS_ON = 'Hands-on experience',
  PRACTICAL = 'Practical exposure',
  WORKING = 'Working knowledge',
  BASIC = 'Basic understanding',
  FAMILIAR = 'Familiar with'
}

export interface Skill {
  name: string;
  level: SkillLevel;
  category: string;
}

export interface Experience {
  company: string;
  location: string;
  title: string;
  period: string;
  details: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
  details: string[];
}

export interface Project {
  title: string;
  description: string;
}

export interface Feedback {
  rating: number;
  comment: string;
  timestamp: string;
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Professional' | 'Advanced';
export type ResearchTrack = 'AppSec' | 'InfraSec' | 'CloudSec' | 'BugBounty';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  publishDate: string;
  author: string;
  authorRole?: string;
  authorBio?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  readingTime: string;
  image: string;
  coverImage?: string;
  updatedDate?: string;
  difficulty: Difficulty;
  track: ResearchTrack;
  isPremium?: boolean;
  intel?: {
    owasp: 'A01' | 'A02' | 'A03' | 'A04' | 'A05' | 'A06' | 'A07' | 'A08' | 'A09' | 'A10' | 'API1' | 'API2' | 'API3' | 'API4' | 'API5' | 'API6' | 'API7' | 'API8' | 'API9' | 'API10';
    family: string; // e.g., 'IDOR', 'BOLA', 'SQLi'
    cwe: string; 
    cvss: number;
    mitre: string; 
    cve?: string;
    related: string[];
    affected_tech?: string[]; // For OpenCVE mapping
  };
}

export type CulturalTheme = 'neutral' | 'warm-light' | 'spring-growth' | 'national-india' | 'solstice-cool';

export interface CulturalState {
  mode: 'auto' | 'india' | 'global';
  detectedCountry: string | null;
  detectedRegion: string | null;
  activeTheme: CulturalTheme;
  label: string | null;
}
export interface DossierSection {
  id: string;
  title: string;
  content: string;
  type: 'markdown' | 'diagram' | 'table' | 'visual' | 'lab' | 'intel';
  metadata?: any;
}

export interface LabScenario {
  id: string;
  vulnerabilityType: string;
  difficulty: Difficulty;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  initialRequest: string;
  targetId?: string; // e.g. "101" for a specific target user
  hints: string[];
  solution: {
    payload: string;
    explanation: string;
  };
  autoAttackSteps: {
    label: string;
    description: string;
    payload?: string;
  }[];
  skillsLearned: string[];
  // Simulation logic parameters
  vulnerableBody: any;
  secureBody: any;
}

export interface SignatureResearch {
  executive_summary: string;
  introduction: string;
  simple_explanation: string;
  technical_deep_dive: string;
  where_to_test?: {
    explanation: string;
    mapping_table: { type: string; surface: string }[];
    practical_example: { explanation: string; request: string; observation: string };
    mindset_diagram: string[];
  };
  attack_workflow: string; 
  application_architecture: string; 
  root_cause_analysis: string;
  code_examples: {
    explanation?: string;
    vulnerability?: string;
    insecureCode: string;
    secureCode: string;
    explanation_detail?: string;
  };
  lab_scenario?: LabScenario;
  impact_analysis: {
    confidentiality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    integrity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    availability: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
  };
  cvss_analysis: {
    score: string | number;
    vector: string;
    severity?: string;
    metrics: { [key: string]: string };
  };
  cvss_educational?: {
    represents: string;
    exists: string;
    year: string;
    relation: string;
  };
  cwe_mapping: string;
  cwe_educational?: {
    represents: string;
    exists: string;
    year: string;
    relation: string;
  };
  cve_references: string[];
  cve_educational?: {
    represents: string;
    exists: string;
    year: string;
    relation: string;
  };
  mitre_mapping: string;
  mitre_educational?: {
    represents: string;
    exists: string;
    year: string;
    relation: string;
  };
  industry_impact?: string;
  detection_methodologies: string[];
  ptes_mapping?: {
    phase: string;
    simple: string;
    technical: string;
  }[];
  osstmm_analysis?: {
    principle: string;
    simple: string;
    technical: string;
  }[];
  manual_checklist: string[];
  automated_tools: { name: string; description: string }[];
  prevention_strategy: string[];
  developer_mistakes: string[];
  bug_bounty_example: {
    title: string;
    summary: string;
    steps: string[];
    impact?: string;
    cvss?: number;
    recommendation: string;
  };
  comparison_table: {
    feature: string;
    target: string;
    difference?: string;
    related?: string[];
  }[];
  osi_layer: number;
  protocols?: string[];
  key_takeaways: string[];
  strategic_conclusion: string;
}

export interface ResearchDossier extends BlogPost {
  signature?: SignatureResearch;
}
