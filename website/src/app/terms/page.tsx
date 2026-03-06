import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Terms of Service — ClyCites",
  description: "ClyCites Terms of Service — your rights and responsibilities when using our platform.",
};

export default function TermsPage() {
  return (
    <div className="pt-16">
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border/40 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Reveal>
            <Badge variant="outline" className="mb-4">Terms of Service</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: February 19, 2026</p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Reveal>
            <div className="space-y-10 text-foreground/80 leading-relaxed">

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using ClyCites services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the service.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">2. Description of Service</h2>
                <p>ClyCites provides a digital agriculture platform including farm management tools, AI crop diagnostics, weather intelligence, an e-marketplace for agricultural produce, expert advisory services, and related features. Services are subject to change.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">3. User Accounts</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>You must provide accurate and complete information when creating an account.</li>
                  <li>You are responsible for maintaining the security of your account credentials.</li>
                  <li>You must be at least 16 years old to create an account.</li>
                  <li>One person may not maintain multiple accounts without express written permission.</li>
                  <li>You must notify us immediately of any unauthorised access to your account.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">4. Marketplace Terms</h2>
                <p>ClyCites operates as an intermediary platform for agricultural produce transactions. By participating in the marketplace:</p>
                <ul className="list-disc ml-6 mt-3 space-y-2">
                  <li>Sellers represent that their produce matches the quality grade and quantity they list.</li>
                  <li>Buyers confirm they have the legal authority and means to complete their orders.</li>
                  <li>ClyCites escrow payments are released upon mutual confirmation of satisfactory delivery.</li>
                  <li>Disputes must be raised within 48 hours of delivery confirmation.</li>
                  <li>ClyCites is not a party to, and assumes no liability for, transactions between buyers and sellers.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">5. AI and Advisory Disclaimers</h2>
                <p>AI-generated crop diagnoses and expert advisories are provided for informational purposes only. They do not constitute professional agronomic, veterinary, or legal advice. ClyCites is not liable for crop losses, agricultural decisions, or outcomes based on AI-generated or expert-provided content.</p>
                <p className="mt-3">Always use your own judgement and consult licensed professionals for high-stakes decisions.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">6. Prohibited Uses</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Listing produce that you do not own or have no right to sell</li>
                  <li>Misrepresenting the quality or quantity of agricultural produce</li>
                  <li>Creating fake reviews, accounts, or testimonials</li>
                  <li>Attempting to circumvent payment systems or escrow protection</li>
                  <li>Using the platform for any purpose that violates applicable law</li>
                  <li>Scraping, reverse engineering, or copying our platform or data</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">7. Intellectual Property</h2>
                <p>All ClyCites software, AI models, designs, brand assets, and content are the exclusive property of ClyCites Ltd. You may not copy, reproduce, distribute, or create derivative works without written permission. Your farm data belongs to you.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">8. Termination</h2>
                <p>We reserve the right to suspend or terminate your account for violations of these terms, fraudulent activity, or when required by law. You may close your account at any time via account settings or by contacting support.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">9. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, ClyCites is not liable for indirect, incidental, consequential, or punitive damages arising from your use of the Service. Our total liability for any claim shall not exceed the amount paid by you to ClyCites in the 3 months preceding the claim.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">10. Governing Law</h2>
                <p>These Terms are governed by the laws of the Republic of Uganda. Any disputes shall be resolved through binding arbitration in Kampala, Uganda, unless otherwise agreed in writing.</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">11. Contact</h2>
                <p>Legal enquiries: <a href="mailto:legal@clycites.com" className="text-primary hover:underline">legal@clycites.com</a></p>
                <p className="mt-2">ClyCites Ltd · P.O. Box 1234, Kampala, Uganda</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
