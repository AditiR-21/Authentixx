import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Mail, Github, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="glow-text-violet">Join the Fight</span>
              <br />
              <span className="text-foreground/90">for Digital Integrity</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Be part of the solution. Contact us to learn more or get started.
            </p>
          </div>

          <Card className="card-glass p-8 md:p-12 glow-border-blue">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    placeholder="Your name" 
                    className="bg-background/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="bg-background/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Tell us about your needs..." 
                  className="min-h-[150px] bg-background/50 border-border/50 resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-secondary/90 glow-border-blue text-lg"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-xl py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Authentixx</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 Authentixx. Protecting Digital Truth.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Contact, Footer };
