import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Privacy Policy — ClyCites",
  description:
    "ClyCites Privacy Policy — how we collect, use, store, and protect your personal and farm data.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-16">
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border/40 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Reveal>
            <Badge variant="outline" className="mb-4">Privacy Policy</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: February 19, 2026</p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-gray max-w-none">
          <Reveal>
            <div className="space-y-10 text-foreground/80 leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">1. Introduction</h2>
                <p>ClyCites is committed to protecting the privacy and security of user personal and farm data. This Privacy Policy explains how we collect, use, store, share, and protect information in connection with our services.</p>
                <p className="mt-3">By using ClyCites, you agree to the practices described in this policy. If you do not agree, please do not use our services.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">2. Information We Collect</h2>
                <p>We collect information you provide directly, information generated through your use of our services, and information from third parties where you grant us permission.</p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>Account information (name, email, phone number, national ID for verification)</li>
                  <li>Farm data (location, field sizes, crops, yields, input records)</li>
                  <li>Transaction data (marketplace orders, payment records)</li>
                  <li>Device and usage data (app version, device type, usage patterns)</li>
                  <li>Location data (GPS coordinates for weather and market features, with your permission)</li>
                  <li>Communication data (advisory consultations, support requests)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>To provide and improve our services to you</li>
                  <li>To personalise weather alerts, advisory recommendations, and market suggestions</li>
                  <li>To facilitate transactions on the marketplace</li>
                  <li>To verify your identity and prevent fraud</li>
                  <li>To communicate with you about your account and our services</li>
                  <li>To generate anonymised and aggregated agricultural research and insights</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">4. Data Sharing</h2>
                <p>We do not sell your personal data. We may share information only in the following circumstances:</p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>With buyers or sellers to facilitate marketplace transactions (limited to what is necessary)</li>
                  <li>With expert advisors you choose to consult (limited to relevant farm context)</li>
                  <li>With service providers who support our operations (under strict data processing agreements)</li>
                  <li>With regulators, law enforcement, or courts when legally required</li>
                  <li>With research partners — only anonymised and aggregated data, never personally identifiable information</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">5. Data Retention</h2>
                <p>We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time. Some data may be retained for legal compliance purposes for up to 7 years after account closure.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">6. Your Rights</h2>
                <p>Depending on your country of residence, you may have the right to:</p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>Access a copy of your personal data</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to or restrict certain processing</li>
                  <li>Data portability (receive your data in a structured format)</li>
                  <li>Withdraw consent at any time for consent-based processing</li>
                </ul>
                <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:privacy@clycites.com" className="text-primary hover:underline">privacy@clycites.com</a>.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">7. Cookies & Tracking</h2>
                <p>We use essential cookies for authentication and session management. We use analytics cookies to understand how our services are used. You can control cookie preferences through your browser settings. We do not use third-party advertising cookies.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">8. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification at least 30 days before the change takes effect.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">9. Contact</h2>
                <p>For privacy-related questions or requests: <a href="mailto:privacy@clycites.com" className="text-primary hover:underline">privacy@clycites.com</a></p>
                <p className="mt-2">ClyCites Ltd · P.O. Box 1234, Kampala, Uganda</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
