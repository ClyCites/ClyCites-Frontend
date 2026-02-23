"use client";

import { HelpCircle, Search, MessageSquare, BookOpen, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <HelpCircle className="h-8 w-8 text-orange-600" />
          Help & Support Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Find answers, get support, and learn how to use ClyCites
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search help articles..."
            className="pl-10 h-12"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Knowledge Base
            </CardTitle>
            <CardDescription>Browse articles and guides</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">• Getting started guide</li>
              <li className="text-muted-foreground">• How to create a listing</li>
              <li className="text-muted-foreground">• Managing your farm</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Support Tickets
            </CardTitle>
            <CardDescription>Get personalized assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Create Support Ticket
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-purple-600" />
              FAQs
            </CardTitle>
            <CardDescription>Common questions answered</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Quick answers to frequently asked questions
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>More support features</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Live chat, video tutorials, community forums
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
