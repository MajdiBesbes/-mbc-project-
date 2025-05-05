import { useEffect } from 'react';
import { analytics } from '../services/analytics';

export const useMetrics = () => {
  useEffect(() => {
    const calculateMetrics = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const score = await analytics.calculateEngagementScore(user.id);
        
        const { error } = await supabase
          .from('user_scores')
          .upsert({ 
            user_id: user.id,
            engagement_score: score,
            last_calculated: new Date().toISOString()
          });

        if (error) console.error('Error updating user score:', error);
      }
    };

    calculateMetrics();
  }, []);
};