import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDuaSuggestion = async (emotion: string, context: string): Promise<string> => {
  if (!apiKey) return "Please configure your API Key.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Iman, a Muslim AI companion. 
      User Context: Feeling "${emotion}". Situation: "${context}".
      Provide ONE authentic Dua (Arabic, Transliteration, English) and a brief comforting source. No fatwas.`,
    });
    return response.text || "I'm having trouble connecting.";
  } catch (error) {
    return "Unavailable. Check connection.";
  }
};

export const getSearchGroundedResponse = async (prompt: string): Promise<{ text: string, sources: { title: string, uri: string }[] }> => {
    if (!apiKey) return { text: "Please configure your API Key.", sources: [] };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        // Extract sources from grounding metadata
        const sources: { title: string, uri: string }[] = [];
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        chunks.forEach((chunk: any) => {
            if (chunk.web) {
                sources.push({
                    title: chunk.web.title || "Source",
                    uri: chunk.web.uri
                });
            }
        });

        return { 
            text: response.text || "No response generated.",
            sources: sources
        };
    } catch (error) {
        console.error("Search Error", error);
        return { text: "I'm having trouble searching right now.", sources: [] };
    }
};

export const generateIslamicImage = async (prompt: string): Promise<string | null> => {
    if (!apiKey) return null;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [
                    { text: `Create a beautiful, respectful Islamic art style image. No human faces or animal figures. Style: abstract, geometric, calligraphy, mosque architecture, nature. Prompt: ${prompt}` }
                ]
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1",
                    imageSize: "1K"
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Gen Error", error);
        return null;
    }
}