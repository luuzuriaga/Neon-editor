import { GoogleGenAI } from "@google/genai";

export const MODEL_NAME = "gemini-3.1-flash-image-preview";

export async function editImage(base64Image: string, prompt: string, mimeType: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image was generated in the response.");
}

export const EDIT_PROMPTS = {
  REMOVE_BG: "Remove the background of this image and replace it with a clean, solid dark grey background.",
  RANDOM_BG: "Change the background of this image to a vibrant, futuristic neon cyberpunk city at night.",
  CHANGE_CLOTHES: "Change the clothes of the person in the image to a high-tech, futuristic neon-accented cyberpunk outfit.",
  MAKE_NIGHT: "Transform the lighting and atmosphere of this image to look like a dark night scene illuminated by glowing neon lights.",
  MAKE_DAY: "Transform the lighting and atmosphere of this image to look like a bright, clear sunny day with natural daylight."
};
