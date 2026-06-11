'use client';

import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  History, 
  Lightbulb, 
  PlusCircle, 
  LogOut,
  Dumbbell
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Activity Log', href: '/logs', icon: History },
    { name: 'Recommendations', href: '/recommendations', icon: Lightbulb },
    { name: 'Log Activity', href: '/add', icon: PlusCircle },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 glass-nav h-screen sticky top-0 flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-3 mb-12 px-2">
          <Dumbbell className="text-primary w-8 h-8" />
          <span className="text-xl font-bold">Fitness AI</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="px-4 py-3 mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">User</p>
            <p className="font-medium truncate">{user ? `${user.firstname} ${user.lastName}` : 'Profile'}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden glass-nav p-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-primary w-6 h-6" />
            <span className="font-bold">Fitness AI</span>
          </div>
          <button onClick={logout} className="text-muted-foreground shadow-none"><LogOut size={20} /></button>
        </div>
        
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
