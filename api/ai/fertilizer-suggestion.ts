
export const config = {
  runtime: 'nodejs',
};

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export default async function handler(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    try {
        const { name, scientificName } = await req.json();
        
        const prompt = `Give a concise fertilizer suggestion for a ${name} (${scientificName}). Recommend a suitable NPK ratio and a feeding schedule for its growing season. Keep the response under 50 words.`;

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
              "messages": [{ "role": "user", "content": prompt }],
            })
        });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`OpenRouter API error: ${res.statusText}`, errorBody);
            throw new Error(`OpenRouter API error: ${res.statusText}`);
        }
        
        const data = await res.json();
        const suggestion = data.choices[0].message.content;
        
        return new Response(JSON.stringify({ suggestion }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch(error: any) {
        console.error("Error getting fertilizer suggestion:", error);
        return new Response(JSON.stringify({ error: 'Failed to get suggestion', details: error.message }), { status: 500 });
    }
  }
  return new Response('Method Not Allowed', { status: 405 });
}
