import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary animate-glow-pulse" />
            <span className="text-2xl font-bold glow-text-violet">Authentixx</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground/80 hover:text-primary transition-colors">
              Home
            </a>
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">
              Use Cases
            </a>
            <a href="#demo" className="text-foreground/80 hover:text-primary transition-colors">
              AI Demo
            </a>
            <a href="#history" className="text-foreground/80 hover:text-primary transition-colors">
              History
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          <Button 
            onClick={handleSignOut}
            variant="default" 
            className="bg-primary hover:bg-primary/90 glow-border-violet"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
