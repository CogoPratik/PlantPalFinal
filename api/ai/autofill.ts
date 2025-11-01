import { GoogleGenAI, Type } from "@google/genai";
import { Plant } from "../../components/Dashboard";

export const config = {
  runtime: 'nodejs',
};

// IMPORTANT: Set the API_KEY in your Vercel project settings
const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});

async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req: Request) {
  if (req.method === 'POST') {
    try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return new Response(JSON.stringify({ error: 'Image file is required' }), { status: 400 });
        }

        const buffer = await streamToBuffer(imageFile.stream());
        const base64Image = buffer.toString('base64');
        const mimeType = imageFile.type;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType } },
                    { text: "Based on this image of a plant, provide care details. Give a common name and scientific name." }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scientificName: { type: Type.STRING },
                        wateringFrequency: { type: Type.INTEGER, description: "Average number of days between watering." },
                        fertilizingFrequency: { type: Type.INTEGER, description: "Average number of days between fertilizing." },
                        sunlight: { type: Type.STRING, enum: ["Low Light", "Medium Light", "Bright Light"] },
                        humidity: { type: Type.STRING, enum: ["Low Humidity", "Medium Humidity", "High Humidity"] },
                        notes: { type: Type.STRING, description: "A brief, helpful care tip for this plant." }
                    },
                    required: ["scientificName", "wateringFrequency", "sunlight", "notes"]
                },
            },
        });
        
        const text = response.text.trim();
        const details: Partial<Plant> = JSON.parse(text);

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