import { Shield, Globe, Target, Zap, BookOpen, Activity } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface LearningPathModule {
  id: string;
  title: string;
  slug: string; // References blogPosts slug
  type: 'Dossier' | 'Lab' | 'Exam';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string; // Name of icon for rendering
  difficulty: 'Beginner' | 'Intermediate' | 'Professional' | 'Extreme';
  estimatedTime: string;
  modules: LearningPathModule[];
}

export const learningPaths: LearningPath[] = [
  {
    id: 'beginner-path',
    title: 'Beginner Path',
    description: 'Foundational security concepts for aspiring cyber operatives. Learn the basics of threat landscapes and risk assessment.',
    icon: 'Shield',
    difficulty: 'Beginner',
    estimatedTime: '12 Hours',
    modules: [
      { id: 'm1', title: 'Operational Security Fundamentals', slug: 'broken-access-control-owasp-a01-analysis', type: 'Dossier' },
      { id: 'm2', title: 'The Modern Threat Landscape', slug: 'idor-security-analysis', type: 'Dossier' }
    ]
  },
  {
    id: 'web-security-path',
    title: 'Web Security Path',
    description: 'Master the OWASP Top 10. Deep dive into authorization failures, injection, and insecure design patterns.',
    icon: 'Globe',
    difficulty: 'Intermediate',
    estimatedTime: '24 Hours',
    modules: [
      { id: 'w1', title: 'Broken Access Control Deep Dive', slug: 'broken-access-control-owasp-a01-analysis', type: 'Dossier' },
      { id: 'w2', title: 'IDOR Manipulation & Defense', slug: 'idor-security-analysis', type: 'Dossier' },
      { id: 'w3', title: 'Missing Function Level Access Control', slug: 'missing-function-level-access-control-analysis', type: 'Dossier' }
    ]
  },
  {
    id: 'bug-bounty-path',
    title: 'Bug Bounty Path',
    description: 'Advanced reconnaissance and vulnerability hunting. Learn how to turn curiosities into critical bug reports.',
    icon: 'Target',
    difficulty: 'Professional',
    estimatedTime: '40 Hours',
    modules: [
      { id: 'b1', title: 'Horizontal Privilege Escalation', slug: 'horizontal-privilege-escalation-technical-brief', type: 'Dossier' },
      { id: 'b2', title: 'Vertical Privilege Escalation', slug: 'vertical-privilege-escalation-technical-analysis', type: 'Dossier' },
      { id: 'b3', title: 'Forced Browsing Tactics', slug: 'forced-browsing-security-research-dossier', type: 'Dossier' }
    ]
  },
  {
    id: 'advanced-exploitation-path',
    title: 'Advanced Exploitation',
    description: 'Deep technical exploitation of logic failures. Focuses on chaining vulnerabilities for maximum situational impact.',
    icon: 'Zap',
    difficulty: 'Extreme',
    estimatedTime: '60 Hours',
    modules: [
      { id: 'a1', title: 'Chain: BAC to Full Account Takeover', slug: 'broken-access-control-owasp-a01-analysis', type: 'Dossier' },
      { id: 'a2', title: 'Strategic Vertical Escalation', slug: 'vertical-privilege-escalation-technical-analysis', type: 'Dossier' }
    ]
  }
];
