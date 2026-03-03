import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will connect to backend later
    console.log("Sign up:", formData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 clay-blob blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 clay-blob blur-3xl" />

      <div className="clay-card p-8 md:p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><Logo size="lg" showText={false} /></div>
          <h1 className="text-3xl font-black mb-2">Create Account</h1>
          <p className="text-muted-foreground font-medium text-sm">Join SynergySphere and start collaborating</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold mb-1.5 block">Full Name</label>
            <input
              type="text"
              className="clay-input w-full px-4 py-3 text-sm font-medium outline-none"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Email</label>
            <input
              type="email"
              className="clay-input w-full px-4 py-3 text-sm font-medium outline-none"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="clay-input w-full px-4 py-3 text-sm font-medium outline-none pr-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Confirm Password</label>
            <input
              type="password"
              className="clay-input w-full px-4 py-3 text-sm font-medium outline-none"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="clay-button bg-primary text-primary-foreground w-full py-3 flex items-center justify-center gap-2 mt-2">
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-medium mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
