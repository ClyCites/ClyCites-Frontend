import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us & Request Demo — ClyCites",
  description:
    "Get in touch with the ClyCites team. Request a platform demo, ask about pricing, explore partnerships, or get technical support.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
