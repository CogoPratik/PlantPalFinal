
export const config = {
  runtime: 'edge',
};

// WARNING: Hardcoding API keys is not secure.
// This key is provided for demonstration purposes based on the user's request.
// For production, it's highly recommended to use environment variables.
const OPENROUTER_API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Helper to convert stream to Uint8Array
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

// Helper to convert Uint8Array to Base64
function uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export default async function handler(req: Request) {
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
        const dataUri = `data:${mimeType};base64,${base64Image}`;

        const promptText = "Identify the plant in this image. Provide its common name and scientific name. Also provide a confidence score from 0 to 100 for your identification. Respond with only a JSON object in the format: {\"name\": \"Common Name (Scientific Name)\", \"match\": 95}";

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
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: promptText },
                        { type: 'image_url', image_url: { url: dataUri } }
                    ]
                }],
                response_format: { "type": "json_object" }
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`OpenRouter API responded with status ${response.status}: ${errorBody}`);
        }
        
        const completion = await response.json();
        const resultText = completion.choices[0].message.content;
        const result = JSON.parse(resultText);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Error identifying plant with OpenRouter:", error);
        return new Response(JSON.stringify({ error: 'Failed to identify plant', details: error.message }), { status: 500 });
    }
  }
  return new Response('Method Not Allowed', { status: 405 });
}
