import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Home, Compass, Upload, User, Zap } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated } = useStore();

  if (!isAuthenticated && location !== "/auth" && location !== "/") {
    // Let the protected route handling do its job, or just render children if it's a public page
    // For this layout, we mostly care about showing the nav or not
  }

  const showNav = isAuthenticated && location !== "/auth" && location !== "/";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      {showNav && (
        <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r bg-sidebar p-4 z-50">
          <div className="flex items-center gap-2 px-2 py-4 mb-6">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              E
            </div>
            <span className="text-xl font-bold tracking-tight">EngageFlow</span>
          </div>

          <nav className="space-y-1 flex-1">
            <NavItem href="/feed" icon={Home} label="Feed" active={location === "/feed"} />
            <NavItem href="/niche" icon={Compass} label="Niches" active={location === "/niche"} />
            <NavItem href="/import" icon={Upload} label="Import" active={location === "/import"} />
            <NavItem href="/profile" icon={User} label="Profile" active={location === "/profile"} />
            <NavItem href="/wallet" icon={Zap} label="Wallet" active={location === "/wallet"} />
          </nav>

          <div className="mt-auto p-4 bg-sidebar-accent rounded-xl">
            <p className="text-xs font-medium text-sidebar-foreground mb-1">Compliance Status</p>
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Safe Mode Active
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Bottom Nav */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex items-center justify-around z-50 px-4 pb-safe">
          <MobileNavItem href="/feed" icon={Home} active={location === "/feed"} />
          <MobileNavItem href="/niche" icon={Compass} active={location === "/niche"} />
          <div className="relative -top-5">
             <Link href="/import">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                  <Upload size={20} />
                </div>
             </Link>
          </div>
          <MobileNavItem href="/wallet" icon={Zap} active={location === "/wallet"} />
          <MobileNavItem href="/profile" icon={User} active={location === "/profile"} />
        </nav>
      )}

      <main className="container mx-auto max-w-2xl min-h-screen pt-4 px-4 md:px-8 md:pt-8">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active }: any) {
  return (
    <Link href={href}>
      <button className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}>
        <Icon size={18} />
        {label}
      </button>
    </Link>
  );
}

function MobileNavItem({ href, icon: Icon, active }: any) {
  return (
    <Link href={href}>
      <button className={cn(
        "p-2 rounded-full transition-colors",
        active ? "text-primary bg-primary/10" : "text-muted-foreground"
      )}>
        <Icon size={24} />
      </button>
    </Link>
  );
}
