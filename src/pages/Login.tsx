
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOffIcon, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  // Creates random "data stream" animation in background
  const renderDataStreams = () => {
    return Array.from({ length: 15 }).map((_, i) => {
      const length = Math.random() * 10 + 3; // 3-13 characters
      const text = Array.from({ length }, () => 
        Math.random() > 0.7 ? 
          Math.random().toString(36).substring(2, 3) : 
          Math.floor(Math.random() * 10).toString()
      ).join('');
      
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 5}s`;
      const duration = `${Math.random() * 5 + 5}s`;
      const opacity = Math.random() * 0.3 + 0.1;
      
      return (
        <div 
          key={i}
          className="absolute font-mono text-cyber text-xs sm:text-sm"
          style={{
            left,
            top: '-20px',
            opacity,
            animation: `data-stream ${duration} linear infinite`,
            animationDelay: delay,
          }}
        >
          {text}
        </div>
      );
    });
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background data streams */}
      <div className="fixed inset-0 pointer-events-none">
        {renderDataStreams()}
      </div>
      
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
      
      <div className="w-full max-w-md space-y-6 z-10">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-block h-16 w-16 rounded-full bg-sidebar relative mb-4">
            <div className="absolute inset-2 rounded-full border-2 border-cyber"></div>
            <div className="absolute inset-4 rounded-full bg-cyber animate-pulse-glow"></div>
          </div>
          <h1 className="text-4xl font-mono font-semibold mb-2">
            <span className="text-cyber">PROJECT</span>{' '}
            <span className="text-white">LOOKING GLASS</span>
          </h1>
          <p className="text-muted-foreground text-sm">Predictive Intelligence & Timeline Simulation</p>
        </div>
        
        {/* Login Form */}
        <Card className="cyber-border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-mono text-xl flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-cyber" />
              Authorization Required
            </CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="analyst"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/50 border-border/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-border/50 pr-10"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-cyber hover:bg-cyber-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </div>
                ) : 'Access System'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center text-xs text-muted-foreground">
          <span className="secret-stamp">Top Secret</span>
          <p className="mt-2">Authorized personnel only. All access is logged and monitored.</p>
          <p>Use "analyst / password" to login</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
