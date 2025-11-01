
export const config = {
  runtime: 'nodejs',
};

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export default async function handler(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenRouter API key is not configured. Please set the OPENROUTER_API_KEY environment variable in your Vercel project settings.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    try {
      const { history } = await req.json();

      if (!history) {
        return new Response(JSON.stringify({ error: 'History is required' }), { status: 400 });
      }

      const messages = history.map((msg: { role: 'user' | 'model', text: string }) => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text,
      }));

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://plantpal.vercel.app", 
          "X-Title": "Plant Pal",
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-exp:free",
          "messages": messages,
        })
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`OpenRouter API error: ${res.statusText}`, errorBody);
        throw new Error(`OpenRouter API error: ${res.statusText}`);
      }
      
      const data = await res.json();
      const response = data.choices[0].message.content;
      
      return new Response(JSON.stringify({ response }), {
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
