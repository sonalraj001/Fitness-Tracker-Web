'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { 
  Flame, 
  Clock, 
  TrendingUp, 
  Activity as ActivityIcon 
} from "lucide-react";

interface Activity {
  id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  startTime: string;
}

export default function DashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await api('/activities');
        setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activities', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const totalCalories = activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
  const totalDuration = activities.reduce((sum, a) => sum + (a.duration || 0), 0);

  const stats = [
    { name: 'Total Calories', value: totalCalories, unit: 'kcal', icon: Flame, color: 'text-orange-500' },
    { name: 'Total Duration', value: totalDuration, unit: 'min', icon: Clock, color: 'text-blue-500' },
    { name: 'Activities', value: activities.length, unit: 'sessions', icon: ActivityIcon, color: 'text-green-500' },
    { name: 'Goal Progress', value: '75', unit: '%', icon: TrendingUp, color: 'text-purple-500' },
  ];

  if (isLoading) return <div className="text-center py-12">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Hello, {user?.firstname || 'User'}!</h1>
        <p className="text-muted-foreground">Track your progress and stay healthy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-medium text-green-500">+12%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold flex items-baseline gap-1">
                {stat.value}
                <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
              </h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Activities</h3>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <ActivityIcon size={20} />
                  </div>
                  <div>
                    <p className="font-medium capitalize">{activity.type.toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(activity.startTime).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-500">{activity.caloriesBurned} kcal</p>
                  <p className="text-xs text-muted-foreground">{activity.duration} min</p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No activities logged yet.</p>
            )}
          </div>
        </div>

        {/* Quick Add / Daily Target */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-32 h-32 rounded-full border-8 border-primary/20 border-t-primary flex items-center justify-center mb-6">
            <div>
              <p className="text-2xl font-bold">1,240</p>
              <p className="text-xs text-muted-foreground">/ 2,000</p>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Daily Calorie Goal</h3>
          <p className="text-sm text-muted-foreground mb-6">You've reached 62% of your daily goal. Keep going!</p>
          <button className="btn-primary w-full shadow-lg shadow-primary/30">
            Log New Activity
          </button>
        </div>
      </div>
    </div>
  );
}
