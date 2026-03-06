import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Security — ClyCites",
  description:
    "How ClyCites protects your farm data, financial transactions, and personal information with enterprise-grade security.",
};

const sections = [
  {
    title: "Infrastructure Security",
    content: `ClyCites is hosted on AWS infrastructure across multiple availability zones in Africa (Lagos, Cape Town). All infrastructure is managed using infrastructure-as-code with automated security scanning and compliance checks.

Our servers are protected by cloud-native firewalls, intrusion detection systems, and automated vulnerability scanning. We perform regular patching cycles and respond to critical CVEs within 24 hours.`,
  },
  {
    title: "Data Encryption",
    content: `All data in transit is protected using TLS 1.3 with strong cipher suites. All data at rest is encrypted using AES-256 encryption. Database backups are encrypted with separate key management.

Cryptographic keys are managed using AWS KMS with automatic rotation. We never store sensitive credentials in plain text — all passwords are hashed using bcrypt with appropriate cost factors.`,
  },
  {
    title: "Authentication & Access Control",
    content: `ClyCites uses multi-factor authentication (MFA) for all staff access and supports MFA for user accounts. We implement role-based access control (RBAC) with the principle of least privilege.

Session tokens use short expiry times with secure refresh mechanisms. All administrative actions are logged and require explicit user consent. API keys are scoped and can be revoked at any time.`,
  },
  {
    title: "Payment Security",
    content: `All payment processing is PCI-DSS compliant. We do not store full card numbers or CVV codes. Payment data is handled by certified payment processors (Stripe, Pesapal, Flutterwave).

Our escrow system uses multi-party authorization — payments require confirmation from both buyer and seller before release.`,
  },
  {
    title: "Audit Logs & Monitoring",
    content: `Every user action, API call, and data modification is logged in immutable audit logs with user, timestamp, IP address, and action type. Logs are retained for a minimum of 2 years.

We operate a 24/7 security monitoring system with automated alerting for anomalous behaviour patterns. Security events are triaged by our security team within 1 hour.`,
  },
  {
    title: "Data Privacy & Sovereignty",
    content: `Your farm data belongs to you. ClyCites will never sell or share your personal data with third parties for advertising or commercial purposes. Data sharing for research or programme delivery requires explicit, revocable consent.

We comply with the Uganda Data Protection and Privacy Act (2019), Kenya Data Protection Act (2019), and the EU General Data Protection Regulation (GDPR). Data is stored within Africa-region data centers.`,
  },
  {
    title: "Vulnerability Disclosure",
    content: `ClyCites operates a responsible disclosure programme. If you discover a security vulnerability, please contact us at security@clycites.com. We will acknowledge your report within 48 hours and work with you to address the issue.

We do not pursue legal action against security researchers who follow our responsible disclosure guidelines.`,
  },
];

export default function SecurityPage() {
  return (
    <div className="pt-16">
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border/40 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Reveal>
            <Badge variant="outline" className="mb-4">Security</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Your data is safe with ClyCites
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              We treat security as a core feature, not an afterthought. Here is how we protect your farm data and transactions.
            </p>
            <p className="text-sm text-muted-foreground">
              Security questions? Email{" "}
              <a href="mailto:security@clycites.com" className="text-primary hover:underline">
                security@clycites.com
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="space-y-12">
            {sections.map((section) => (
              <Reveal key={section.title}>
                <div>
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <div className="text-muted-foreground leading-relaxed space-y-3">
                    {section.content.split("\n\n").map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center">
            <h3 className="font-bold text-xl mb-2">Found a vulnerability?</h3>
            <p className="text-muted-foreground mb-4">
              We appreciate responsible disclosure. Contact our security team directly.
            </p>
            <Button asChild>
              <a href="mailto:security@clycites.com">Report a Security Issue</a>
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
