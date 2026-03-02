import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ArrowRight, CheckCircle, Users, Zap, Shield, BarChart3, MessageSquare, Calendar, Target, Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Button hover effects
  useEffect(() => {
    const buttons = document.querySelectorAll('.hero-cta button, .cta-button');
    
    buttons.forEach(button => {
      const handleMouseEnter = () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out"
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
      };
      
      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  // Enhanced hover effects for cards
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card, .testimonial-card');
    const cardAnimations: gsap.core.Tween[] = [];
    
    cards.forEach(card => {
      const handleMouseEnter = () => {
        const tween = gsap.to(card, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
        cardAnimations.push(tween);
      };
      
      const handleMouseLeave = () => {
        const tween = gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
        cardAnimations.push(tween);
      };
      
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    return () => {
      cardAnimations.forEach(tween => tween.kill());
    };
  }, []);

  useEffect(() => {
    // Set up GSAP context for better cleanup
    const ctx = gsap.context(() => {
      // Hero animations with better timing
      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out" }
      });
      
      heroTl
        .fromTo(".hero-title", 
          { opacity: 0, y: 60, rotationX: 15 }, 
          { opacity: 1, y: 0, rotationX: 0, duration: 1.2 }
        )
        .fromTo(".hero-subtitle", 
          { opacity: 0, y: 40 }, 
          { opacity: 1, y: 0, duration: 0.9 }, 
          "-=0.6"
        )
        .fromTo(".hero-cta", 
          { opacity: 0, scale: 0.8, y: 20 }, 
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" }, 
          "-=0.4"
        )
        .fromTo(".hero-image", 
          { opacity: 0, scale: 0.7, rotationY: -10 }, 
          { opacity: 1, scale: 1, rotationY: 0, duration: 1.2, ease: "power2.out" }, 
          "-=0.5"
        );

      // Enhanced floating animations with different patterns
      gsap.to(".floating-1", {
        y: -30,
        rotation: 5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0
      });

      gsap.to(".floating-2", {
        y: -20,
        x: 10,
        rotation: -3,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.8
      });

      gsap.to(".floating-3", {
        y: -25,
        x: -8,
        rotation: 2,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5
      });

      // Parallax effect on scroll for hero image
      gsap.to(".hero-image", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      // Scroll-triggered animations with better performance
      ScrollTrigger.batch(".feature-card", {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { 
              opacity: 0, 
              y: 80,
              scale: 0.9,
              transformPerspective: 1000
            }, 
            { 
              opacity: 1, 
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out"
            }
          );
        },
        once: true
      });

      ScrollTrigger.batch(".stat-item", {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { 
              opacity: 0, 
              scale: 0.5,
              rotationY: 90
            }, 
            { 
              opacity: 1, 
              scale: 1,
              rotationY: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "back.out(1.6)"
            }
          );
        },
        once: true
      });

      ScrollTrigger.batch(".testimonial-card", {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { 
              opacity: 0, 
              x: -60,
              rotationY: -15
            }, 
            { 
              opacity: 1, 
              x: 0,
              rotationY: 0,
              duration: 1,
              stagger: 0.2,
              ease: "power3.out"
            }
          );
        },
        once: true
      });

      // Counter animation for stats
      const statNumbers = document.querySelectorAll(".stat-number");
      statNumbers.forEach(stat => {
        const finalValue = stat.getAttribute("data-value");
        if (finalValue) {
          ScrollTrigger.create({
            trigger: stat,
            start: "top 80%",
            onEnter: () => {
              const obj = { value: 0 };
              gsap.to(obj, {
                value: parseInt(finalValue),
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                  stat.textContent = Math.floor(obj.value).toLocaleString() + "+";
                }
              });
            },
            once: true
          });
        }
      });

    }, heroRef.current);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Real-time collaboration with your team members, share files, and communicate seamlessly."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Project Management",
      description: "Organize projects, assign tasks, set deadlines, and track progress effortlessly."
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Team Communication",
      description: "Built-in chat, video calls, and discussion threads keep everyone on the same page."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics & Insights",
      description: "Get detailed analytics and AI-powered insights to optimize team performance."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Task Scheduling",
      description: "Smart scheduling and calendar integration to manage deadlines efficiently."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and compliance certifications."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Teams" },
    { number: "50K+", label: "Projects Completed" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO at TechStart",
      content: "SynergySphere transformed how our team collaborates. We've seen a 40% increase in productivity since switching.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager at InnovateCo",
      content: "The best project management platform we've ever used. The AI insights are game-changing for our workflow.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "CTO at DigitalFlow",
      content: "Intuitive, powerful, and reliable. SynergySphere has become essential to our daily operations.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
                  <Zap className="mr-2 h-4 w-4" />
                  New: AI-Powered Insights
                </div>
                <h1 className="hero-title text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
                  Where Teams
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">
                    Work Better Together
                  </span>
                </h1>
                <p className="hero-subtitle text-xl text-gray-600 max-w-lg">
                  Transform your team's productivity with SynergySphere - the all-in-one platform for project management, team collaboration, and AI-powered insights.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 hero-cta">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 cta-button"
                  onClick={() => navigate("/auth?mode=signup")}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  14-day free trial
                </div>
              </div>
            </div>
            <div className="relative hero-image">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop&crop=entropy&auto=format" 
                  alt="Team Collaboration" 
                  className="rounded-2xl shadow-2xl floating-1"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 floating-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">12 Active Projects</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 floating-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-violet-600" />
                  <span className="text-sm font-medium">48 Team Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help your team collaborate more effectively and achieve better results.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-lg flex items-center justify-center text-violet-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-violet-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-white">
                <div className="stat-number text-4xl lg:text-5xl font-bold mb-2" data-value={stat.number.replace(/\D/g, '')}>
                  {stat.number}
                </div>
                <div className="text-violet-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience with SynergySphere.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="testimonial-card border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Team's Productivity?
          </h2>
          <p className="text-xl text-violet-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using SynergySphere to achieve more together.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate("/auth?mode=signup")}
            className="bg-white text-violet-600 hover:bg-gray-100 cta-button"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
