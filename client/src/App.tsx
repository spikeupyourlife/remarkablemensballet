import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Performers from "@/pages/performers";
import Videos from "@/pages/videos";
import Performances from "@/pages/performances";
import Contact from "@/pages/contact";
import CMS from "@/pages/cms";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/performers" component={Performers} />
      <Route path="/videos" component={Videos} />
      <Route path="/performances" component={Performances} />
      <Route path="/contact" component={Contact} />
      {isAuthenticated ? (
        <Route path="/cms" component={CMS} />
      ) : (
        <Route path="/cms">
          {() => (
            <div className="min-h-screen bg-pearl flex items-center justify-center">
              <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl text-center">
                <h1 className="font-playfair text-3xl font-bold text-midnight mb-4">Authentication Required</h1>
                <p className="text-gray-600 mb-6">
                  Please log in to access the content management system.
                </p>
                <Button 
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-magenta text-white hover:bg-midnight transition-colors duration-300"
                >
                  Log In
                </Button>
              </div>
            </div>
          )}
        </Route>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <AuthenticatedRouter />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
