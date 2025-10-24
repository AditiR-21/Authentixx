import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Demo = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("fakenews");
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setResult("");
    setIsSaved(false);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: { 
          content: input,
          analysisType: activeTab
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Analysis Failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setResult(data.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze content",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Not logged in",
          description: "You need to be logged in to save to history",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('analysis_history').insert({
        user_id: user.id,
        content: input,
        analysis_type: activeTab,
        analysis_result: result
      });

      if (error) throw error;

      setIsSaved(true);
      toast({
        title: "Saved to History",
        description: "Your analysis has been saved successfully",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save to history",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="demo" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="glow-text-blue">Try AI Demo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of Authentixx AI in real-time
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="card-glass p-8 glow-border-violet">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/20">
                <TabsTrigger value="fakenews">Fake News</TabsTrigger>
                <TabsTrigger value="legal">Legal Risk</TabsTrigger>
                <TabsTrigger value="bias">Bias Check</TabsTrigger>
                <TabsTrigger value="privacy">Privacy Scan</TabsTrigger>
              </TabsList>

              <TabsContent value="fakenews" className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground">
                    Paste article text or URL
                  </label>
                  <Textarea
                    placeholder="Enter the content you want to verify..."
                    className="min-h-[200px] bg-background/50 border-border/50 resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !input.trim()}
                  className="w-full bg-primary hover:bg-primary/90 glow-border-violet"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Analyze Content
                    </>
                  )}
                </Button>

                {result && (
                  <Card className="p-6 bg-background/50 border-secondary/30 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-secondary">
                        Analysis Results
                      </h4>
                      <Button
                        onClick={handleSaveToHistory}
                        disabled={isSaved}
                        variant="outline"
                        size="sm"
                      >
                        {isSaved ? "Saved ✓" : "Save to History"}
                      </Button>
                    </div>
                    <pre className="whitespace-pre-wrap text-muted-foreground text-sm">
                      {result}
                    </pre>
                  </Card>
                )}
              </TabsContent>

              {["legal", "bias", "privacy"].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">
                      {tabValue === "legal" && "Paste contract or legal document"}
                      {tabValue === "bias" && "Paste article or content to check"}
                      {tabValue === "privacy" && "Paste privacy policy or terms of service"}
                    </label>
                    <Textarea
                      placeholder="Enter the content you want to analyze..."
                      className="min-h-[200px] bg-background/50 border-border/50 resize-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !input.trim()}
                    className="w-full bg-primary hover:bg-primary/90 glow-border-violet"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Analyze Content
                      </>
                    )}
                  </Button>

                  {result && (
                    <Card className="p-6 bg-background/50 border-secondary/30 animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-secondary">
                          Analysis Results
                        </h4>
                        <Button
                          onClick={handleSaveToHistory}
                          disabled={isSaved}
                          variant="outline"
                          size="sm"
                        >
                          {isSaved ? "Saved ✓" : "Save to History"}
                        </Button>
                      </div>
                      <pre className="whitespace-pre-wrap text-muted-foreground text-sm">
                        {result}
                      </pre>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Demo;
