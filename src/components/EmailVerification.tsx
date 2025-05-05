import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const EmailVerification: React.FC = () => {
  const { user, resendVerificationEmail } = useAuth();
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (cooldown > 0) return;
    
    setResendStatus('loading');
    try {
      await resendVerificationEmail();
      setResendStatus('success');
      setCooldown(60);
      
      const interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setResendStatus('error');
    }
  };

  if (!user || user.email_confirmed_at) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
      <div className="flex items-start">
        <AlertCircle className="h-6 w-6 text-yellow-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Vérification de l'email requise
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Un email de vérification a été envoyé à {user.email}. 
              Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation.
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={handleResend}
              disabled={resendStatus === 'loading' || cooldown > 0}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {resendStatus === 'loading' ? (
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
              ) : resendStatus === 'success' ? (
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {cooldown > 0 
                ? `Réessayer dans ${cooldown}s` 
                : 'Renvoyer l\'email de vérification'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;