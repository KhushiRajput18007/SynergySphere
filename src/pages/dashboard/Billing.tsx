import { CheckCircle2, Zap, Crown, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free", icon: Zap, price: "$0", period: "/forever",
    features: ["Up to 5 Projects", "Basic Task Board", "Team Invitations", "Email Notifications"],
    current: true
  },
  {
    name: "Pro", icon: Crown, price: "$12", period: "/month",
    features: ["Unlimited Projects", "AI Task Planning", "Advanced Analytics", "Priority Support", "Real-time Chat", "Custom Templates"],
    highlight: true
  },
  {
    name: "Enterprise", icon: Building2, price: "$49", period: "/month",
    features: ["Everything in Pro", "Custom Integrations", "Admin Controls", "Dedicated Support", "SLA Guarantee", "SSO Login"],
  },
];

const Billing = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black">Billing & Subscription</h1>
        <p className="text-muted-foreground font-medium">Manage your subscription plan</p>
      </div>

      {/* Current Plan */}
      <div className="clay-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="clay-badge bg-accent/10 text-accent px-3 py-1 text-xs mb-2 inline-block">Current Plan</span>
            <h2 className="text-2xl font-black">Free Plan</h2>
            <p className="text-sm text-muted-foreground font-medium">3 of 5 projects used</p>
          </div>
          <div className="clay-card-inset p-4 rounded-xl">
            <div className="text-3xl font-black gradient-text">3/5</div>
            <div className="text-xs text-muted-foreground font-bold text-center">Projects</div>
          </div>
        </div>
        <div className="clay-card-inset h-3 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: "60%" }} />
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className={cn("clay-card p-6 relative", plan.highlight && "ring-2 ring-primary")}>
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 clay-badge bg-primary text-primary-foreground px-4 py-1 text-xs">
                RECOMMENDED
              </span>
            )}
            <plan.icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-black">{plan.price}</span>
              <span className="text-muted-foreground text-sm font-medium">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button className={cn(
              "clay-button w-full py-2.5 font-bold text-sm",
              plan.current ? "bg-muted text-muted-foreground cursor-default" :
              plan.highlight ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            )}>
              {plan.current ? "Current Plan" : plan.highlight ? "Upgrade to Pro" : "Contact Sales"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Billing;
