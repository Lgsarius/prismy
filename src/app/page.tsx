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
import { motion } from "framer-motion";

const features = [
  {
    title: "Top Tracks Analysis",
    description: "Discover your most played tracks across different time periods",
    icon: Music2,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Artist Insights",
    description: "Explore your favorite artists and their impact on your music taste",
    icon: BarChart2,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Listening History",
    description: "Track your recent listening patterns and history",
    icon: History,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Smart Playlists",
    description: "Generate personalized playlists based on your music preferences",
    icon: PlayCircle,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Playlist Management",
    description: "Organize and sort your Spotify playlists efficiently",
    icon: ListMusic,
    color: "from-indigo-500 to-violet-500",
  },
  {
    title: "Music Discovery",
    description: "Find new music based on your listening habits",
    icon: Sparkles,
    color: "from-yellow-500 to-amber-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const iconHover = {
  rest: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <motion.section 
        className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container px-4 md:px-6">
          <div className="space-y-4 mb-8">
            <motion.h1 
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              <motion.span 
                className="bg-gradient-to-r from-primary via-violet-500 to-indigo-500 bg-clip-text text-transparent inline-block"
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% auto" }}
              >
                Your Spotify Experience,
              </motion.span>
              <br />
              <motion.span 
                className="bg-gradient-to-r from-violet-500 via-primary to-indigo-500 bg-clip-text text-transparent inline-block"
                animate={{ 
                  backgroundPosition: ["100%", "0%", "100%"],
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% auto" }}
              >
                Enhanced
              </motion.span>
            </motion.h1>
            <motion.p 
              className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Dive deep into your music taste, discover new tracks, and manage your playlists
              with powerful tools and beautiful visualizations.
            </motion.p>
          </div>
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {status === "authenticated" ? (
              <div className="space-y-2">
                <motion.p 
                  className="text-lg text-primary font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Welcome back, {session.user?.name}!
                </motion.p>
                <motion.div
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90" asChild>
                    <a href="/top-tracks">Explore Your Stats</a>
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => signIn("spotify")}
                  className="rounded-full px-8 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90"
                >
                  Connect with Spotify
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Powerful features to enhance your Spotify experience
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={item}>
                  <motion.div
                    variants={cardHover}
                    initial="rest"
                    whileHover="hover"
                    className="h-full"
                  >
                    <Card className="bg-background/60 backdrop-blur-sm hover:bg-accent/50 transition-colors h-[200px] flex flex-col">
                      <CardHeader className="flex-1 flex flex-col h-full space-y-4">
                        <motion.div 
                          className={`bg-gradient-to-br ${feature.color} p-3 rounded-lg w-fit shrink-0`}
                          variants={iconHover}
                          initial="rest"
                          whileHover="hover"
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <div className="space-y-2 flex-1 flex flex-col">
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">{feature.description}</CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Get started in three simple steps
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                step: 1,
                title: "Connect",
                description: "Sign in with your Spotify account securely",
              },
              {
                step: 2,
                title: "Analyze",
                description: "Get insights about your music taste and habits",
              },
              {
                step: 3,
                title: "Discover",
                description: "Create playlists and find new music you'll love",
              },
            ].map((step) => (
              <motion.div key={step.step} variants={item}>
                <motion.div
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  className="h-full"
                >
                  <Card className="bg-background/60 backdrop-blur-sm hover:bg-accent/50 transition-colors h-[180px] flex flex-col">
                    <CardContent className="pt-6 flex-1 flex flex-col">
                      <motion.div 
                        className="rounded-full bg-gradient-to-br from-primary to-indigo-500 w-12 h-12 flex items-center justify-center mb-4 shrink-0"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      >
                        <span className="text-2xl font-bold text-white">{step.step}</span>
                      </motion.div>
                      <div className="space-y-2 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="w-full py-12 md:py-24 bg-muted/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Enhance Your Music Experience?
            </motion.h2>
            <motion.p 
              className="mx-auto max-w-[600px] text-muted-foreground md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join thousands of users who have already discovered their unique music taste
            </motion.p>
            {status !== "authenticated" && (
              <motion.div
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => signIn("spotify")}
                  className="rounded-full px-8 mt-4 bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90"
                >
                  Get Started Now
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
