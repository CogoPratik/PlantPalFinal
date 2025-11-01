import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key is not configured. Please set the API_KEY environment variable.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { prompt, history } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }
    if (!history) {
        return new Response(JSON.stringify({ error: 'History is required' }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Format history for the chat model
    const chatHistoryPayload = history.map((msg: { role: 'user' | 'model', text: string }) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
    }));

    // The history must start with a user turn. If the first message is from the model, remove it.
    if (chatHistoryPayload.length > 0 && chatHistoryPayload[0].role === 'model') {
        chatHistoryPayload.shift();
    }

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: chatHistoryPayload,
    });
    
    const result = await chat.sendMessage({ message: prompt });

    return new Response(JSON.stringify({ response: result.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error with Google GenAI:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch response from Google GenAI', details: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
}