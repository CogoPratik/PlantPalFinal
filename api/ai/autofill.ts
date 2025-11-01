
import { Plant } from "../../components/Dashboard";

export const config = {
  runtime: 'nodejs',
};

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function streamToUint8Array(stream: ReadableStream): Promise<Uint8Array> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }
    
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }
    return result;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export default async function handler(req: Request) {
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'POST') {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return new Response(JSON.stringify({ error: 'Image file is required' }), { status: 400 });
        }

        const imageBytes = await streamToUint8Array(imageFile.stream());
        const base64Image = uint8ArrayToBase64(imageBytes);
        const mimeType = imageFile.type;
        const dataUrl = `data:${mimeType};base64,${base64Image}`;

        const prompt = `Based on this image of a plant, provide care details as a JSON object. The JSON object must have the following keys: "scientificName" (string), "wateringFrequency" (integer, in days), "fertilizingFrequency" (integer, in days), "sunlight" (string, one of "Low Light", "Medium Light", "Bright Light"), "humidity" (string, one of "Low Humidity", "Medium Humidity", "High Humidity"), and "notes" (string, a brief care tip).`;

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
              "response_format": { "type": "json_object" },
              "messages": [
                {
                  "role": "user",
                  "content": [
                    { "type": "text", "text": prompt },
                    { "type": "image_url", "image_url": { "url": dataUrl } }
                  ]
                }
              ]
            })
        });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`OpenRouter API error: ${res.statusText}`, errorBody);
            throw new Error(`OpenRouter API error: ${res.statusText}`);
        }
        
        const data = await res.json();
        const details: Partial<Plant> = JSON.parse(data.choices[0].message.content);

        return new Response(JSON.stringify(details), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Error with AI auto-fill:", error);
        return new Response(JSON.stringify({ error: 'Failed to auto-fill details', details: error.message }), { status: 500 });
    }
  }
  return new Response('Method Not Allowed', { status: 405 });
}
