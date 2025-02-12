import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CheckSquare } from "lucide-react";

function Navigation() {
  return (
    <nav className="border-b mb-4">
      <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4">
        <Link href="/">
          <Button variant="ghost" className="flex gap-2">
            <CheckSquare className="h-4 w-4" />
            Tasks
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" className="flex gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;