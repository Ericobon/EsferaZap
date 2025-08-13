import { useEffect } from 'react';
import { useNavigate } from 'wouter';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AuthCallback() {
  const [, navigate] = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const email = params.get('email');

      if (token && auth) {
        try {
          // Sign in with the token from the main site
          await signInWithCustomToken(auth, token);
          console.log('✅ Authenticated via InsightEsfera SSO');
          
          // Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('❌ SSO Authentication failed:', error);
          // Fallback to regular login
          navigate('/');
        }
      } else {
        // No token, redirect to home
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">
          Autenticando via InsightEsfera...
        </h2>
        <p className="mt-2 text-gray-500">
          Você será redirecionado em instantes
        </p>
      </div>
    </div>
  );
}