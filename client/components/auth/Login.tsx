import { useState } from "react";
import { Button } from "../ui/button";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAuth } from "../../lib/store";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
}

export default function Login({ onSwitchToRegister, onForgotPassword }: LoginProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!values.email || !values.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
              placeholder="you@company.com"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-3 flex items-center justify-between text-sm">
          <button
            className="text-primary underline underline-offset-4"
            onClick={onSwitchToRegister}
            type="button"
          >
            Need an account? Sign up
          </button>
          {onForgotPassword && (
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={onForgotPassword}
              type="button"
            >
              Forgot password?
            </button>
          )}
        </div>
      </CardContent>
    </>
  );
}
