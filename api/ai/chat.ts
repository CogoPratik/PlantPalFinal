
export const config = {
  runtime: 'edge',
};

// WARNING: Hardcoding API keys is not secure.
// This key is provided for demonstration purposes based on the user's request.
// For production, it's highly recommended to use environment variables.
const OPENROUTER_API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export default async function handler(req: Request) {
  if (req.method === 'POST') {
    try {
      const { prompt, history } = await req.json();

      if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
      }

      // Convert Plant Pal history to OpenAI format
      const messages = (history as ChatMessage[]).map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.text
      }));
      // Add the current user prompt
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://plantpal.ai', // Example site URL
          'X-Title': 'Plant Pal', // Example site title
        },
        body: JSON.stringify({
          model: 'google/gemini-flash-1.5', // Using a standard, reliable Gemini model from OpenRouter
          messages: messages,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter API Error:", errorBody);
        throw new Error(`OpenRouter API responded with status ${response.status}: ${errorBody}`);
      }

      const completion = await response.json();
      const aiResponse = completion.choices[0].message.content;
      
      return new Response(JSON.stringify({ response: aiResponse }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error: any) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Failed to fetch response from OpenRouter API', details: error.message }), { status: 500 });
    }
  }
  return new Response('Method Not Allowed', { status: 405 });
}
