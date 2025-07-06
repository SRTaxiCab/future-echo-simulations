
import React, { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Clock, 
  Globe,
  Layers, 
  Database, 
  Settings,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [status, setStatus] = useState<'stable' | 'simulating' | 'anomaly'>('stable');

  // Navigation items
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Timeline Viewer', 
      path: '/timeline', 
      icon: <Clock className="h-5 w-5" /> 
    },
    { 
      name: 'Global Map', 
      path: '/map', 
      icon: <Globe className="h-5 w-5" /> 
    },
    { 
      name: 'Scenario Builder', 
      path: '/scenario', 
      icon: <Layers className="h-5 w-5" /> 
    },
    { 
      name: 'Data Feeds', 
      path: '/feeds', 
      icon: <Database className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  // Simulate status change
  React.useEffect(() => {
    const interval = setInterval(() => {
      const statuses: Array<'stable' | 'simulating' | 'anomaly'> = ['stable', 'simulating', 'anomaly'];
      const randomIndex = Math.floor(Math.random() * 10);
      
      // 70% chance to be stable, 20% simulating, 10% anomaly
      if (randomIndex < 7) {
        setStatus('stable');
      } else if (randomIndex < 9) {
        setStatus('simulating');
      } else {
        setStatus('anomaly');
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-sidebar-accent text-sidebar-foreground"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar bg-opacity-95 backdrop-blur-sm transition-transform lg:translate-x-0 lg:relative", 
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and Project Name */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-cyber flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-sidebar animate-pulse-glow"></div>
              </div>
              <h1 className="text-xl font-mono font-semibold text-cyber">PROJECT <span className="text-white">LOOKING GLASS</span></h1>
            </div>
          </div>
          
          {/* User Info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium">{user?.username}</div>
                <div className="text-xs text-sidebar-foreground/70">{user?.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div 
                className={cn(
                  "h-2.5 w-2.5 rounded-full status-dot animate-status-pulse",
                  status === 'simulating' && "simulating",
                  status === 'anomaly' && "anomaly"
                )}
              ></div>
              <div className="text-xs text-sidebar-foreground/70">
                {status === 'stable' && "Stable Timeline"}
                {status === 'simulating' && "Simulating"}
                {status === 'anomaly' && "Anomaly Detected"}
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "sidebar-item",
                  location.pathname === item.path && "active"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <button 
              className="sidebar-item w-full justify-between" 
              onClick={logout}
            >
              <span>Logout</span>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
