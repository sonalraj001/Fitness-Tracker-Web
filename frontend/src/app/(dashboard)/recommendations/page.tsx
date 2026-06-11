'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { 
  Sparkles, 
  Lightbulb,
  ChevronRight,
  RefreshCw
} from "lucide-react";

interface Recommendation {
  id: string;
  recommendation_text: string;
  category: string;
  createdAt: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const fetchRecommendations = async () => {
    if (!user) return;
    try {
      const data = await api(`/recommendation/user/${user.id}`);
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const generateNew = async () => {
    setIsGenerating(true);
    try {
      // Fetch some statistics or metrics to pass to generator if required by backend
      // Assuming simple call for now as per controller analysis
      await api('/recommendation/generate', {
        method: 'POST',
        body: JSON.stringify({ userId: user?.id }),
      });
      await fetchRecommendations();
    } catch (err) {
      console.error('Failed to generate', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading recommendations...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            AI Recommendations <Sparkles className="text-yellow-500" size={28} />
          </h1>
          <p className="text-muted-foreground">Personalized insights based on your recent activity trends.</p>
        </div>
        
        <button 
          onClick={generateNew}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2"
        >
          {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Lightbulb size={20} />}
          {isGenerating ? 'Analyzing...' : 'Generate New'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="glass-card p-6 flex flex-col justify-between hover:border-primary/30 transition-all cursor-default group">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-widest px-2 py-1 rounded">
                  {rec.category || 'General'}
                </span>
                <span className="text-[10px] text-muted-foreground">{new Date(rec.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-lg leading-relaxed mb-6 italic text-white/90">
                "{rec.recommendation_text}"
              </p>
            </div>
            
            <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Learn more <ChevronRight size={16} />
            </div>
          </div>
        ))}

        {recommendations.length === 0 && (
          <div className="md:col-span-2 glass-card p-12 text-center">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Click the generate button above to get your first AI-powered fitness insight.
            </p>
            <button 
              onClick={generateNew}
              className="btn-primary"
            >
              Get My First Insight
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
