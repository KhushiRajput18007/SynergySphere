import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Card } from "../components/ui/card";
import Login from "../components/auth/Login";
import CreateAccount from "../components/auth/CreateAccount";
import ForgotPassword from "../components/auth/ForgotPassword";
import { useAuth } from "../lib/store";

export default function Auth() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>(mode === 'signup' ? 'register' : 'login');

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Update auth view based on URL params
  useEffect(() => {
    if (mode === 'signup') {
      setAuthView('register');
    } else if (mode === 'forgot') {
      setAuthView('forgot');
    } else {
      setAuthView('login');
    }
  }, [mode]);

  if (user) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Card className="backdrop-blur">
              {authView === 'login' ? (
                <Login 
                  onSwitchToRegister={() => setAuthView('register')} 
                  onForgotPassword={() => setAuthView('forgot')}
                />
              ) : authView === 'register' ? (
                <CreateAccount
                  onRegister={register}
                  onSwitchToLogin={() => setAuthView('login')}
                />
              ) : (
                <ForgotPassword
                  onBackToLogin={() => setAuthView('login')}
                />
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
