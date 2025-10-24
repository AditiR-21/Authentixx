import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, FileText, Brain, Shield } from "lucide-react";

const features = [
  {
    icon: Newspaper,
    title: "Fake News & Deepfake Detection",
    description: "Upload articles or media to verify authenticity. Our AI analyzes content patterns, cross-references sources, and detects manipulation.",
    gradient: "from-primary/20 to-primary/5",
    glowColor: "glow-border-violet",
  },
  {
    icon: FileText,
    title: "Legal Risk Analysis",
    description: "Scan contracts for suspicious or risky clauses. Identify hidden terms, unfair conditions, and legal vulnerabilities instantly.",
    gradient: "from-secondary/20 to-secondary/5",
    glowColor: "glow-border-blue",
  },
  {
    icon: Brain,
    title: "Bias & Emotion Detection",
    description: "Identify emotionally manipulative or one-sided text. Detect bias, propaganda techniques, and psychological manipulation.",
    gradient: "from-primary/20 to-primary/5",
    glowColor: "glow-border-violet",
  },
  {
    icon: Shield,
    title: "Privacy Risk Scan",
    description: "Find hidden trackers or vague consent issues in terms & conditions. Protect your data with comprehensive privacy analysis.",
    gradient: "from-secondary/20 to-secondary/5",
    glowColor: "glow-border-blue",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="glow-text-violet">Powerful AI Tools</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four specialized AI engines working together to protect your digital integrity
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`card-glass p-8 hover:scale-[1.02] transition-all duration-300 ${feature.glowColor} group cursor-pointer animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                {feature.description}
              </p>

              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary/80 hover:bg-primary/10 px-0"
              >
                Try Now →
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
