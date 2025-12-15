import { useState } from "react";
import { Button } from "./ui/button";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Define the types for the component's props
interface CreateAccountProps {
  onRegister: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
}

export default function CreateAccount({ onRegister, onSwitchToLogin }: CreateAccountProps) {
  // This component now manages its own form state
  const [values, setValues] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the email's user part as a fallback for the name
    const name = values.name || values.email.split("@")[0];
    onRegister(name, values.email, values.password);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="Taylor Jenkins"
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
            />
          </div>
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
        <div className="mt-3 flex items-center justify-between text-sm">
          <button className="text-primary underline underline-offset-4" onClick={onSwitchToLogin}>
            Already have an account? Sign in
          </button>
          <button className="text-muted-foreground hover:text-foreground">Forgot password?</button>
        </div>
      </CardContent>
    </>
  );
}