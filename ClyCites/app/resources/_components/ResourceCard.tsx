import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Clock } from "lucide-react";
import Link from "next/link";

type Resource = {
  id: number;
  title: string;
  description: string;
  category: 'guide' | 'article' | 'video' | 'technical';
  image: string;
  type: 'PDF' | 'Article' | 'Video' | 'Documentation';
  size?: string;
  duration?: string;
  date: string;
  url: string;
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const { title, description, type, date, url, size, duration } = resource;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline" className="capitalize">
            {type}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>{date}</span>
          </div>
          {size && (
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>{size}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{duration}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={url}>
            Download <Download className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="h-full rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted mt-2" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted mt-1" />
      </div>
      <div className="p-6 pt-0 space-y-2">
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex items-center p-6 pt-0">
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}
