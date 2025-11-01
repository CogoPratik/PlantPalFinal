
export const config = {
  runtime: 'edge',
};

// WARNING: Hardcoding API keys is not secure.
// This key is provided for demonstration purposes based on the user's request.
// For production, it's highly recommended to use environment variables.
const OPENROUTER_API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export default async function handler(req: Request) {
  if (req.method === 'POST') {
    try {
        const { name, scientificName } = await req.json();
        
        const prompt = `Give a concise fertilizer suggestion for a ${name} (${scientificName}). Recommend a suitable NPK ratio and a feeding schedule for its growing season. Keep the response under 50 words.`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://plantpal.ai',
                'X-Title': 'Plant Pal',
            },
            body: JSON.stringify({
                model: 'google/gemini-flash-1.5',
                messages: [{ role: 'user', content: prompt }],
            }),
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`OpenRouter API responded with status ${response.status}: ${errorBody}`);
        }

        const completion = await response.json();
        const suggestion = completion.choices[0].message.content;
        
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
