import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "contractor">("admin");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Login Successful",
      description: `Welcome back, ${role}!`,
    });

    // Navigate based on role
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/contractor");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gov-blue-light via-background to-gov-teal-light p-6">
      <Card className="w-full max-w-md p-8 animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-heading font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to access the Panchayat Fund Tracker
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@panchayat.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Login As</Label>
            <Select value={role} onValueChange={(value: "admin" | "contractor") => setRole(value)}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">District Admin</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Not registered?{" "}
            <a href="#" className="text-primary hover:underline">
              Contact your district office
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
