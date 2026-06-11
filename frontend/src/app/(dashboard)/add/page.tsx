'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

const ACTIVITY_TYPES = [
  'RUNNING', 'WALKING', 'CYCLING', 'SWIMMING', 'YOGA', 
  'HIIT', 'CARDIO', 'STRETCHING', 'WEIGHT_TRAINING', 'OTHER'
];

export default function AddActivityPage() {
  const [formData, setFormData] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
    startTime: new Date().toISOString().slice(0, 16),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api('/activities/activity', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          user_id: user?.id,
          startTime: formData.startTime + ':00',
          duration: parseInt(formData.duration),
          caloriesBurned: parseInt(formData.caloriesBurned),
        }),
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log activity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Log Activity</h1>
        <p className="text-muted-foreground">Keep track of your latest workout.</p>
      </div>

      <div className="glass-card p-8">
        {error && <div className="bg-destructive/20 border border-destructive text-destructive-foreground p-3 rounded-lg mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Activity Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field w-full appearance-none bg-background"
              >
                {ACTIVITY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Time</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field w-full"
                placeholder="45"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Calories Burned</label>
              <input
                type="number"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                className="input-field w-full"
                placeholder="300"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 py-3"
            >
              {isLoading ? 'Processing...' : 'Save Activity'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
