
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EyeIcon, EyeOffIcon, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, signup, isLoading, isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    await login(email, password);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    await signup(email, password, username);
  };

  // Reset form when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setEmail('');
    setPassword('');
    setUsername('');
    setShowPassword(false);
  };

  // Creates random "data stream" animation in background
  const renderDataStreams = () => {
    return Array.from({ length: 15 }).map((_, i) => {
      const length = Math.random() * 10 + 3;
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

        {/* Information Alert */}
        <Alert className="border-cyber/50 bg-cyber/5">
          <AlertCircle className="h-4 w-4 text-cyber" />
          <AlertDescription className="text-sm">
            Use any email and password to create an account. Email confirmation may be required.
          </AlertDescription>
        </Alert>
        
        {/* Auth Forms */}
        <Card className="cyber-border bg-card/80 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="font-mono text-xl flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-cyber" />
                  Authorization Required
                </CardTitle>
                <CardDescription>Enter your credentials to access the system</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="analyst@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-border/50"
                      required
                      disabled={isLoading}
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
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground disabled:pointer-events-none"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
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
                    disabled={isLoading || !email || !password}
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
            </TabsContent>
            
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="font-mono text-xl flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-cyber" />
                  Request Access
                </CardTitle>
                <CardDescription>Create a new account to join the system</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username (Optional)</Label>
                    <Input 
                      id="signup-username" 
                      placeholder="analyst_01"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-background/50 border-border/50"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email"
                      placeholder="analyst@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-border/50"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="signup-password" 
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a secure password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background/50 border-border/50 pr-10"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground disabled:pointer-events-none"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
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
                    disabled={isLoading || !email || !password || password.length < 6}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
                        Creating Account...
                      </div>
                    ) : 'Request Access'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="text-center text-xs text-muted-foreground">
          <span className="secret-stamp">Top Secret</span>
          <p className="mt-2">Authorized personnel only. All access is logged and monitored.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
