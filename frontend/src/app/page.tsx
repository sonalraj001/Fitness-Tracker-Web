'use client';

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 text-center">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Fitness Tracker AI
        </h1>
      </div>
      
      <p className="max-w-2xl text-xl text-muted-foreground mb-12">
        Track your activities, monitor your progress, and get AI-powered recommendations to reach your fitness goals faster.
      </p>

      <div className="flex gap-4">
        <Link href="/login" className="btn-primary text-lg px-8 py-3">
          Get Started
        </Link>
        <Link href="/register" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-all">
          Register
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-2">Track Activities</h3>
          <p className="text-muted-foreground">Log your workouts, runs, and more with detailed metrics.</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-2">AI Insights</h3>
          <p className="text-muted-foreground">Get personalized recommendations based on your activity history.</p>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-2">Progress Stats</h3>
          <p className="text-muted-foreground">Visualize your calories burned and activity duration over time.</p>
        </div>
      </div>
    </main>
  );
}
