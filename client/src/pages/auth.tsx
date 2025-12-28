import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useState } from "react";
import { Shield } from "lucide-react";

export default function Auth() {
  const [name, setName] = useState("");
  const { login } = useStore();
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    login(name);
    setLocation("/niche");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary/30">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-card border">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            E
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Enter your name to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input 
              placeholder="e.g. Alex Creator" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full h-12 text-lg rounded-xl">
              Continue
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield size={12} />
          <span>Secure login • No password needed for demo</span>
        </div>
      </div>
    </div>
  );
}
