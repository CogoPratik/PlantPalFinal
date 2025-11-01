import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

export const config = {
  runtime: 'nodejs',
};

// IMPORTANT: Set the API_KEY in your Vercel project settings
const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});

// Helper to convert stream to buffer
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

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType,
            },
        };

        const textPart = {
            text: "Identify the plant in this image. Provide its common name and scientific name. Also provide a confidence score from 0 to 100 for your identification. Respond with only a JSON object in the format: {\"name\": \"Common Name (Scientific Name)\", \"match\": 95}",
        };
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        
        const text = response.text.replace(/```json|```/g, '').trim();
        const result = JSON.parse(text);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Error identifying plant with Gemini:", error);
        return new Response(JSON.stringify({ error: 'Failed to identify plant', details: error.message }), { status: 500 });
    }
  }
  return new Response('Method Not Allowed', { status: 405 });
}