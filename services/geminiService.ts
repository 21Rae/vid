import { GoogleGenAI, Type } from "@google/genai";
import { Clip } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVideoForClips = async (videoContext: string, durationSeconds: number): Promise<Clip[]> => {
  try {
    const prompt = `
      You are an expert video editor and marketing strategist.
      I have a video about: "${videoContext}".
      The video is approximately ${durationSeconds} seconds long.
      
      Please generate 4 to 6 engaging "viral clips" metadata from this video context. 
      For each clip, invent a plausible start and end time within the 0 to ${durationSeconds} range.
      The clips should be between 15 and 60 seconds long.
      
      Return the response in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              startTime: { type: Type.INTEGER },
              endTime: { type: Type.INTEGER },
              summary: { type: Type.STRING },
              viralScore: { type: Type.INTEGER },
              tags: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "startTime", "endTime", "summary", "viralScore", "tags"]
          }
        }
      }
    });

    const rawClips = JSON.parse(response.text || '[]');
    
    // Add IDs to the clips
    return rawClips.map((clip: any, index: number) => ({
      ...clip,
      id: `generated-clip-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return [];
  }
};

export const repurposeContent = async (clip: Clip, platform: string): Promise<string> => {
  try {
    const prompt = `
      I have a short video clip titled "${clip.title}".
      Summary: "${clip.summary}".
      Tags: ${clip.tags.join(', ')}.
      
      Please write a high-converting, engaging social media post for ${platform} to promote this clip.
      Include emojis and hashtags. Keep it professional yet catchy.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini Repurposing Error:", error);
    return "Error generating content. Please check your API key.";
  }
};

export const chatWithVideo = async (history: {role: string, parts: {text: string}[]}[], message: string, context: string) => {
    try {
        const systemInstruction = `You are a helpful assistant for a video editing platform. 
        The user is asking questions about a video with the following context: "${context}".
        Answer their questions about the content, or help them write scripts, titles, or summaries.`;

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
            history: history as any,
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (e) {
        console.error("Chat Error", e);
        return "Sorry, I encountered an error responding to that.";
    }
}
