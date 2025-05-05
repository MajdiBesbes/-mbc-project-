import { useState, useEffect } from 'react';

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  blocked: boolean;
}

const LIMIT = 5; // Nombre maximum de tentatives
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes en millisecondes

export const useRateLimit = () => {
  const [state, setState] = useState<RateLimitState>(() => {
    const stored = localStorage.getItem('loginRateLimit');
    return stored ? JSON.parse(stored) : { attempts: 0, lastAttempt: 0, blocked: false };
  });

  useEffect(() => {
    localStorage.setItem('loginRateLimit', JSON.stringify(state));
  }, [state]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    
    // Réinitialiser si le blocage est terminé
    if (state.blocked && now - state.lastAttempt >= BLOCK_DURATION) {
      setState({ attempts: 0, lastAttempt: now, blocked: false });
      return true;
    }

    // Vérifier si bloqué
    if (state.blocked) {
      return false;
    }

    // Incrémenter les tentatives
    const newAttempts = state.attempts + 1;
    const shouldBlock = newAttempts >= LIMIT;

    setState({
      attempts: shouldBlock ? 0 : newAttempts,
      lastAttempt: now,
      blocked: shouldBlock
    });

    return !shouldBlock;
  };

  const getRemainingTime = (): number => {
    if (!state.blocked) return 0;
    const remaining = BLOCK_DURATION - (Date.now() - state.lastAttempt);
    return Math.max(0, remaining);
  };

  const reset = () => {
    setState({ attempts: 0, lastAttempt: 0, blocked: false });
  };

  return {
    checkRateLimit,
    getRemainingTime,
    reset,
    attempts: state.attempts,
    blocked: state.blocked
  };
};