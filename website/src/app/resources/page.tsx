import type { Metadata } from "next";
import { ArrowRight, BookOpen, TrendingUp, Leaf, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, StaggerWrapper, StaggerItem } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Resources & Insights — ClyCites",
  description:
    "Blog posts, guides, reports, and case studies on digital agriculture, agritech trends, and farming best practices from the ClyCites team.",
};

const categories = ["All", "Crop Management", "Market Insights", "Technology", "Case Studies", "Guides"];

const articles = [
  {
    category: "Technology",
    title: "How AI is Transforming Crop Disease Detection in Sub-Saharan Africa",
    excerpt: "A deep dive into how machine learning models trained on African crop datasets are helping smallholder farmers detect diseases before they spread.",
    date: "Feb 12, 2026",
    readTime: "7 min read",
    icon: BarChart3,
    featured: true,
  },
  {
    category: "Case Studies",
    title: "How Nakitto Farmers Cooperative Grew Revenue 42% with ClyCites",
    excerpt: "In 18 months, the Luwero-based cooperative of 340 maize and bean farmers digitised their produce aggregation and market access — here's what changed.",
    date: "Feb 5, 2026",
    readTime: "5 min read",
    icon: TrendingUp,
    featured: true,
  },
  {
    category: "Market Insights",
    title: "East African Tomato Market: Price Trends and Seasonal Patterns for 2026",
    excerpt: "An analysis of tomato price movements across Kampala, Nairobi, and Dar es Salaam markets — and what farmers should know heading into the long rains.",
    date: "Jan 28, 2026",
    readTime: "6 min read",
    icon: TrendingUp,
    featured: false,
  },
  {
    category: "Guides",
    title: "The Complete Guide to Using Weather Alerts for Planting Decisions",
    excerpt: "A practical guide for farmers on how to read ClyCites weather forecasts and translate them into planting, irrigation, and harvesting decisions.",
    date: "Jan 20, 2026",
    readTime: "10 min read",
    icon: BookOpen,
    featured: false,
  },
  {
    category: "Crop Management",
    title: "Fall Armyworm in East Africa: Identification, Spread, and Treatment",
    excerpt: "Fall armyworm remains one of the most destructive maize pests in Africa. Here's everything a farmer needs to know to identify and combat it.",
    date: "Jan 15, 2026",
    readTime: "8 min read",
    icon: Leaf,
    featured: false,
  },
  {
    category: "Technology",
    title: "Offline-First Design: How We Built ClyCites for Low-Connectivity Farmers",
    excerpt: "Most of Africa's farmers operate in areas with unreliable mobile data. Here's the engineering and design decisions we made to serve them.",
    date: "Jan 8, 2026",
    readTime: "9 min read",
    icon: BarChart3,
    featured: false,
  },
];

export default function ResourcesPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background border-b border-border/40 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Reveal>
            <Badge variant="outline" className="mb-4">Resources & Insights</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
              Knowledge to grow{" "}
              <span className="text-primary">every season</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Guides, case studies, market insights, and technical articles from the ClyCites team and our network of agronomists.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border/40 bg-background sticky top-16 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  cat === "All"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/40 hover:bg-muted text-muted-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Featured */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {articles.filter((a) => a.featured).map((a) => {
              return (
                <Reveal key={a.title}>
                  <Card className="h-full hover:border-primary/30 transition-colors cursor-pointer group">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">{a.category}</Badge>
                        <Badge variant="success" className="text-xs">Featured</Badge>
                      </div>
                      <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                        {a.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-5">{a.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{a.date} · {a.readTime}</span>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>

          {/* Rest */}
          <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.filter((a) => !a.featured).map((a) => {
              return (
                <StaggerItem key={a.title}>
                  <Card className="h-full hover:border-primary/30 transition-colors cursor-pointer group">
                    <CardContent className="p-6">
                      <Badge variant="outline" className="text-xs mb-3">{a.category}</Badge>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">
                        {a.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {a.excerpt}
                      </p>
                      <p className="text-xs text-muted-foreground">{a.date} · {a.readTime}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerWrapper>
        </div>
      </section>
    </div>
  );
}
