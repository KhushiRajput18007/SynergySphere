import { useState } from "react";
import { Button } from "../ui/button";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            We've sent a password reset link to {email}
          </p>
          <Button variant="outline" className="w-full" onClick={onBackToLogin}>
            Back to login
          </Button>
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
        <div className="mt-3 text-center">
          <button className="text-primary underline underline-offset-4 text-sm" onClick={onBackToLogin}>
            Back to login
          </button>
        </div>
      </CardContent>
    </>
  );
}
