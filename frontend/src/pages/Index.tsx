import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Brain,
  Eye,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  prefix = "", 
  suffix = "",
  decimals = 0,
  className = ""
}: { 
  end: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string;
  decimals?: number;
  className?: string;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(end * easeOutQuart);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return (
    <div ref={ref} className={className}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </div>
  );
};

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Fraud Detection",
      description: "Advanced machine learning detects anomalies and suspicious patterns in real-time",
    },
    {
      icon: Eye,
      title: "Transparency Dashboard",
      description: "Complete visibility into fund allocation and utilization across all projects",
    },
    {
      icon: FileText,
      title: "OCR Invoice Extraction",
      description: "Automatically extract and validate invoice data with intelligent OCR technology",
    },
    {
      icon: Users,
      title: "Citizen Portal",
      description: "Public access to project information promotes accountability and trust",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Real-time insights and predictive analysis for better fund management",
    },
    {
      icon: CheckCircle,
      title: "Automated Auditing",
      description: "Continuous monitoring and automated compliance checks reduce manual oversight",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-heading font-bold">
              Panchayat Fund Tracker
            </span>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="ghost">
              <Link to="/citizen">Citizen Portal</Link>
            </Button>
            <Button asChild variant="default">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container relative mx-auto px-6 py-24">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <h1 className="mb-6 text-5xl font-heading font-bold leading-tight md:text-6xl">
              AI-Based Panchayat Fund Utilization Tracker
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Ensuring transparency and accountability in rural development through
              intelligent automation, real-time monitoring, and AI-powered fraud detection
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="shadow-primary">
                <Link to="/login">
                  <Shield className="mr-2 h-5 w-5" />
                  Login as Admin
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Login as Contractor</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/citizen">
                  <Users className="mr-2 h-5 w-5" />
                  Open Citizen Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <AnimatedCounter 
                end={2.4} 
                decimals={1}
                prefix="₹"
                suffix="Cr"
                className="mb-2 text-4xl font-heading font-bold text-primary"
              />
              <div className="text-sm text-muted-foreground">Total Funds Tracked</div>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                end={156}
                className="mb-2 text-4xl font-heading font-bold text-secondary"
              />
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                end={98.5}
                decimals={1}
                suffix="%"
                className="mb-2 text-4xl font-heading font-bold text-accent"
              />
              <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                end={24}
                className="mb-2 text-4xl font-heading font-bold text-warning"
              />
              <div className="text-sm text-muted-foreground">Frauds Prevented</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-heading font-bold">
              Powerful Features for Complete Oversight
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools to ensure every rupee is accounted for
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 inline-block rounded-xl bg-primary/10 p-3">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-heading font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-primary py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <AlertTriangle className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-4 text-3xl font-heading font-bold">
            Ready to Transform Fund Management?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Join the digital governance revolution. Start tracking funds with transparency today.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/login">Get Started Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2024 Panchayat Fund Utilization Tracker. Built for transparency and accountability.
        </div>
      </footer>
    </div>
  );
};

export default Index;
