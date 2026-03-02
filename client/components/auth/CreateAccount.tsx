import { useState } from "react";
import { Button } from "../ui/button";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

interface CreateAccountProps {
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
}

export default function CreateAccount({ onRegister, onSwitchToLogin }: CreateAccountProps) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!values.email || !values.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (values.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const name = values.name || values.email.split("@")[0];
      await onRegister(name, values.email, values.password);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Enter Your Name"
              disabled={isLoading}
            />
          </div>
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
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <div className="mt-3 flex items-center justify-between text-sm">
          <button
            className="text-primary underline underline-offset-4"
            onClick={onSwitchToLogin}
            type="button"
          >
            Already have an account? Sign in
          </button>
        </div>
      </CardContent>
    </>
  );
}
