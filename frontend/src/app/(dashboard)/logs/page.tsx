'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  History, 
  Search,
  Filter,
  MoreVertical
} from "lucide-react";

interface Activity {
  id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  startTime: string;
}

export default function LogsPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <div className="text-center py-12">Loading logs...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">Historical record of all your fitness sessions.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="bg-white/5 border border-white/10 p-2 rounded-lg text-muted-foreground hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 font-semibold">Activity</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold text-center">Duration</th>
                <th className="px-6 py-4 font-semibold text-center">Calories</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="capitalize font-medium">{activity.type.toLowerCase()}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {new Date(activity.startTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {activity.duration} <span className="text-xs text-muted-foreground">min</span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-orange-500">
                    {activity.caloriesBurned} <span className="text-xs font-normal">kcal</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No activities found. Log your first session to see it here!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
