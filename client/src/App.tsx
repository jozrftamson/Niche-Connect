import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { ComplianceBanner } from "@/components/compliance-banner";
import { useStore } from "@/lib/store";

import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import NicheSelect from "@/pages/niche-select";
import Feed from "@/pages/feed";
import Import from "@/pages/import";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated } = useStore();
  const [location] = useLocation();

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/auth" component={Auth} />
        
        {/* Protected Routes (Mock) */}
        {isAuthenticated ? (
          <>
            <Route path="/niche" component={NicheSelect} />
            <Route path="/feed" component={Feed} />
            <Route path="/import" component={Import} />
            <Route path="/profile" component={Profile} />
            <Route path="/wallet" component={Profile} /> {/* Reuse profile for wallet for now */}
          </>
        ) : (
          <Route>
            {/* Redirect unauth users to auth if they try to access protected pages */}
            {() => {
               if (location !== "/" && location !== "/auth") {
                 window.location.href = "/auth";
                 return null;
               }
               return <NotFound />;
            }}
          </Route>
        )}
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ComplianceBanner />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
