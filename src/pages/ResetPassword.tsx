import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 clay-blob blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 clay-blob blur-3xl" />

      <div className="clay-card p-8 md:p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><Logo size="lg" showText={false} /></div>
          {!success ? (
            <>
              <h1 className="text-3xl font-black mb-2">Reset Password</h1>
              <p className="text-muted-foreground font-medium text-sm">Enter your new password</p>
            </>
          ) : (
            <>
              <div className="clay-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-black mb-2">Password Reset!</h1>
              <p className="text-muted-foreground font-medium text-sm">Your password has been successfully changed</p>
            </>
          )}
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold mb-1.5 block">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="clay-input w-full px-4 py-3 text-sm font-medium outline-none pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold mb-1.5 block">Confirm New Password</label>
              <input
                type="password"
                className="clay-input w-full px-4 py-3 text-sm font-medium outline-none"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="clay-button bg-primary text-primary-foreground w-full py-3 flex items-center justify-center gap-2">
              Reset Password <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <Link to="/signin" className="clay-button bg-primary text-primary-foreground w-full py-3 flex items-center justify-center gap-2 font-bold">
            Go to Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
