import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, analysisType } = await req.json();
    
    if (!content || !analysisType) {
      return new Response(
        JSON.stringify({ error: 'Content and analysis type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = '';
    
    switch (analysisType) {
      case 'fakenews':
        systemPrompt = `You are an expert fact-checker and misinformation analyst. Analyze the following content for:
1. Factual accuracy (score 0-100)
2. Source credibility
3. Presence of misleading claims
4. Emotional manipulation tactics
5. Overall authenticity rating

Provide a structured analysis with specific findings and an overall risk level (Low/Medium/High).`;
        break;
        
      case 'legal':
        systemPrompt = `You are a legal risk assessment expert. Analyze the following contract or legal text for:
1. Potentially risky clauses
2. Unfair terms
3. Hidden obligations
4. Liability concerns
5. Compliance issues

Provide a structured analysis highlighting specific problematic sections with risk level (Low/Medium/High).`;
        break;
        
      case 'bias':
        systemPrompt = `You are an expert in detecting bias and emotional manipulation in text. Analyze the following content for:
1. Political or ideological bias
2. Emotional language and manipulation
3. One-sided perspectives
4. Cherry-picking of facts
5. Loaded language

Provide a structured analysis with specific examples and overall bias level (Low/Medium/High).`;
        break;
        
      case 'privacy':
        systemPrompt = `You are a privacy and data protection expert. Analyze the following privacy policy or terms of service for:
1. Hidden data collection practices
2. Unclear consent mechanisms
3. Third-party data sharing
4. User rights and control
5. GDPR/privacy law compliance issues

Provide a structured analysis highlighting specific privacy risks with risk level (Low/Medium/High).`;
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid analysis type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Analyzing content with type: ${analysisType}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: content }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      console.error('No analysis content in response');
      return new Response(
        JSON.stringify({ error: 'No analysis generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
