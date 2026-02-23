"use client";

import { Sprout, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FarmsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            My Farms
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your farms and track agricultural activities
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Farm
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Coming Soon</CardTitle>
            <CardDescription>
              Farmers Hub module is under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sprout className="h-4 w-4" />
                <span>Farm profile management</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Crop season tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Input & harvest records</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
