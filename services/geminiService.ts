import { GoogleGenAI } from "@google/genai";
import { TileData } from "../types";

const SYSTEM_INSTRUCTION = `You are a world-class Riichi Mahjong professional and teacher. 
Your goal is to analyze the user's hand and provide concise, strategic advice.
- Analyze the Shanten (moves to win).
- Identify the best discard.
- Identify yaku (scoring elements) to aim for (e.g., Tanyao, Pinfu, Sanshoku).
- Mention defensive value if the hand is bad.
- Keep the tone encouraging but professional.
- Format the output in Markdown with bullet points.
- Be brief.
`;

export const getHandAnalysis = async (hand: TileData[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert hand to string representation
  const handStr = hand.map(t => t.symbol).join(', ');
  
  const prompt = `Analyze this Mahjong hand: [${handStr}].
  The hand contains ${hand.length} tiles.
  If there are 14 tiles, tell me what to discard and why.
  If there are 13 tiles, tell me what tiles I am waiting for (if tenpai) or what is the most efficient tile to draw.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for analytical accuracy
      }
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to consult the AI expert.");
  }
};
