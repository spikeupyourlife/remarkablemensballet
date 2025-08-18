import { Link, useLocation } from "wouter";
import { Crown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Performers", href: "/performers" },
    { name: "Videos", href: "/videos" },
    { name: "Performances", href: "/performances" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-pearl">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-magenta to-midnight rounded-full flex items-center justify-center">
              <Crown className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-midnight">Remarkable</h1>
              <p className="font-dancing text-magenta text-sm">Mens Ballet</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-midnight hover:text-magenta transition-colors duration-300 font-medium",
                  location === item.href && "text-magenta"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/cms" className="hidden md:block">
              <Button className="bg-midnight text-white hover:bg-magenta transition-colors duration-300">
                CMS Login
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-midnight hover:text-magenta"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-pearl">
            <div className="flex flex-col space-y-3 mt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-midnight hover:text-magenta transition-colors duration-300 font-medium py-2",
                    location === item.href && "text-magenta"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/cms" onClick={() => setMobileMenuOpen(false)}>
                <Button className="bg-midnight text-white hover:bg-magenta transition-colors duration-300 w-full mt-2">
                  CMS Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
