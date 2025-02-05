"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music2, BarChart2, History, PlayCircle, ListMusic, Sparkles } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Top Tracks Analysis",
    description: "Discover your most played tracks across different time periods",
    icon: Music2,
  },
  {
    title: "Artist Insights",
    description: "Explore your favorite artists and their impact on your music taste",
    icon: BarChart2,
  },
  {
    title: "Listening History",
    description: "Track your recent listening patterns and history",
    icon: History,
  },
  {
    title: "Smart Playlists",
    description: "Generate personalized playlists based on your music preferences",
    icon: PlayCircle,
  },
  {
    title: "Playlist Management",
    description: "Organize and sort your Spotify playlists efficiently",
    icon: ListMusic,
  },
  {
    title: "Music Discovery",
    description: "Find new music based on your listening habits",
    icon: Sparkles,
  },
];

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="container px-4 md:px-6">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Spotify Experience,
              <br />
              Enhanced
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Dive deep into your music taste, discover new tracks, and manage your playlists
              with powerful tools and beautiful visualizations.
            </p>
          </div>
          <div className="space-y-4">
            {status === "authenticated" ? (
              <div className="space-y-2">
                <p className="text-lg text-primary font-medium">Welcome back, {session.user?.name}!</p>
                <Button size="lg" className="rounded-full px-8" asChild>
                  <a href="/top-tracks">Explore Your Stats</a>
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={() => signIn("spotify")}
                className="rounded-full px-8"
              >
                Connect with Spotify
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Powerful features to enhance your Spotify experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-background">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Connect</h3>
                <p className="text-muted-foreground">
                  Sign in with your Spotify account securely
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Analyze</h3>
                <p className="text-muted-foreground">
                  Get insights about your music taste and habits
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Discover</h3>
                <p className="text-muted-foreground">
                  Create playlists and find new music you'll love
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Enhance Your Music Experience?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Join thousands of users who have already discovered their unique music taste
            </p>
            {status !== "authenticated" && (
              <Button
                size="lg"
                onClick={() => signIn("spotify")}
                className="rounded-full px-8 mt-4"
              >
                Get Started Now
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
