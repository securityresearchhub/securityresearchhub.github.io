import { blogPosts } from './blogPosts';

export interface TaxonomyNode {
  id: string;
  title: string;
  type: 'owasp' | 'family' | 'vulnerability';
  children?: TaxonomyNode[];
  slug?: string; // Only for leaf nodes (vulnerabilities)
  isComingSoon?: boolean;
}

export const researchTaxonomy: TaxonomyNode[] = [
  {
    id: 'A01',
    title: 'A01 Broken Access Control',
    type: 'owasp',
    children: [
      {
        id: 'A01-CORE',
        title: 'Core Access Control',
        type: 'family',
        children: [
          { id: 'IDOR', title: 'IDOR', type: 'vulnerability', slug: 'idor-vulnerability' },
          { id: 'MFLAC', title: 'Missing Function Level Access Control', type: 'vulnerability', slug: 'missing-function-level-access-control-owasp-a01' },
          { id: 'FORCED_BROWSING', title: 'Forced Browsing', type: 'vulnerability' }
        ]
      },
      {
        id: 'A01-API',
        title: 'API Authorization',
        type: 'family',
        children: [
          { id: 'BOLA', title: 'BOLA', type: 'vulnerability' },
          { id: 'BFLA', title: 'BFLA', type: 'vulnerability' }
        ]
      },
      {
        id: 'A01-PRIV',
        title: 'Privilege Manipulation',
        type: 'family',
        children: [
          { id: 'HPE', title: 'Horizontal Privilege Escalation', type: 'vulnerability' },
          { id: 'VPE', title: 'Vertical Privilege Escalation', type: 'vulnerability', slug: 'vertical-privilege-escalation-security-analysis' }
        ]
      },
      { id: 'A01-REQ', title: 'Request Manipulation', type: 'family' },
      { id: 'A01-RES', title: 'Resource Access Control', type: 'family' },
      { id: 'A01-END', title: 'Endpoint Exposure', type: 'family' },
      { id: 'A01-POL', title: 'Policy Misconfiguration', type: 'family' },
      { id: 'A01-PATH', title: 'Path Based Access Control', type: 'family' },
      { id: 'A01-LOGIC', title: 'Application Logic Authorization', type: 'family' },
      { id: 'A01-ENF', title: 'Authorization Enforcement', type: 'family' },
      { id: 'A01-ADV', title: 'Advanced Cases', type: 'family' }
    ]
  },
  {
    id: 'A02',
    title: 'A02 Cryptographic Failures',
    type: 'owasp',
    children: [
      { id: 'A02-CRYPTO', title: 'Broken Cryptography', type: 'family' },
      { id: 'A02-DATA', title: 'Sensitive Data Exposure', type: 'family' }
    ]
  },
  {
    id: 'A03',
    title: 'A03 Injection',
    type: 'owasp',
    children: [
      { id: 'SQLI', title: 'SQL Injection', type: 'vulnerability', slug: 'sql-injection-analysis' },
      { id: 'NOSQLI', title: 'NoSQL Injection', type: 'vulnerability' },
      { id: 'OSCI', title: 'OS Command Injection', type: 'vulnerability' }
    ]
  },
  { id: 'A04', title: 'A04 Insecure Design', type: 'owasp' },
  { id: 'A05', title: 'A05 Security Misconfiguration', type: 'owasp' },
  { id: 'A06', title: 'A06 Vulnerable Components', type: 'owasp' },
  { id: 'A07', title: 'A07 Identification Failures', type: 'owasp' },
  { id: 'A08', title: 'A08 Software Integrity Failures', type: 'owasp' },
  { id: 'A09', title: 'A09 Security Logging Failures', type: 'owasp' },
  { id: 'A10', title: 'A10 SSRF', type: 'owasp' }
];

/**
 * Returns the full taxonomy to ensure all nodes are visible in the navigation tree.
 * Nodes without matching slugs in blogPosts will be handled by the UI.
 */
export const getActiveTaxonomy = (): TaxonomyNode[] => {
  return researchTaxonomy;
};
