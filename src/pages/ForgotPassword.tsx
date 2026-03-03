import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowRight, ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-accent/10 clay-blob blur-3xl" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/10 clay-blob blur-3xl" />

      <div className="clay-card p-8 md:p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><Logo size="lg" showText={false} /></div>
          {!sent ? (
            <>
              <h1 className="text-3xl font-black mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground font-medium text-sm">Enter your email and we'll send a reset link</p>
            </>
          ) : (
            <>
              <div className="clay-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-black mb-2">Check Your Email</h1>
              <p className="text-muted-foreground font-medium text-sm">We've sent a password reset link to <strong>{email}</strong></p>
            </>
          )}
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold mb-1.5 block">Email</label>
              <input
                type="email"
                className="clay-input w-full px-4 py-3 text-sm font-medium outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="clay-button bg-primary text-primary-foreground w-full py-3 flex items-center justify-center gap-2">
              Send Reset Link <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <button onClick={() => setSent(false)} className="clay-button bg-muted text-foreground w-full py-3 font-bold">
            Resend Email
          </button>
        )}

        <Link to="/signin" className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-bold mt-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
