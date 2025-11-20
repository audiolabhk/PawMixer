import { GoogleGenAI } from "@google/genai";

// Initialize the client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCrossBreedImage = async (breed1Name: string, breed2Name: string): Promise<string> => {
  try {
    const prompt = `A cute, photorealistic studio portrait of a cross-breed dog, a mix between a ${breed1Name} and a ${breed2Name}. The dog has physical characteristics of both breeds. High quality, 4k, detailed fur textures, soft studio lighting, neutral background.`;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
