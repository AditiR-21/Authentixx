import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface AnalysisHistoryItem {
  id: string;
  content: string;
  analysis_type: string;
  analysis_result: string;
  created_at: string;
}

const History = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error",
        description: "Failed to load analysis history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(history.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "History item deleted",
      });
    } catch (error) {
      console.error('Error deleting history:', error);
      toast({
        title: "Error",
        description: "Failed to delete history item",
        variant: "destructive",
      });
    }
  };

  // Refresh history when new analyses are added
  useEffect(() => {
    fetchHistory();

    // Set up realtime subscription for new history items
    const channel = supabase
      .channel('analysis_history_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analysis_history'
        },
        () => {
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getAnalysisTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fakenews: "Fake News Detection",
      legal: "Legal Risk Analysis",
      bias: "Bias Check",
      privacy: "Privacy Scan"
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="history" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="glow-text-blue">Analysis History</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            View your past content analyses
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {history.length === 0 ? (
            <Card className="card-glass p-12 text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground">
                No analysis history yet. Start by analyzing some content!
              </p>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {history.map((item) => (
                  <Card key={item.id} className="card-glass p-6 glow-border-violet">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                            {getAnalysisTypeLabel(item.analysis_type)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(item.created_at), 'PPpp')}
                          </span>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Original Content:
                          </h4>
                          <p className="text-sm bg-background/50 p-3 rounded border border-border/50 line-clamp-3">
                            {item.content}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-secondary mb-2">
                            Analysis Result:
                          </h4>
                          <pre className="whitespace-pre-wrap text-xs text-muted-foreground bg-background/50 p-3 rounded border border-border/50 max-h-40 overflow-y-auto">
                            {item.analysis_result}
                          </pre>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteHistoryItem(item.id)}
                        className="ml-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </section>
  );
};

export default History;
