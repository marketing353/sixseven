import { GoogleGenAI, Type } from "@google/genai";
import { GameStats, AICommentary } from "../types";

// Check for API key safely
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateGameFeedback = async (stats: GameStats): Promise<AICommentary> => {
  if (!apiKey) {
    return {
      title: "Tap Master",
      message: "Great job! Add an API Key to get AI-powered roasts or praise next time!"
    };
  }

  const prompt = `
    The player just finished a round of "6-7 Tap!", a hyper-casual game where they must tap 6 or 7 and avoid other numbers.
    Here are their stats:
    Score: ${stats.score}
    Max Combo: ${stats.maxCombo}
    Accuracy: ${Math.round(stats.accuracy * 100)}%
    Hits: ${stats.hits}
    Misses: ${stats.misses}

    You are a high-energy, Gen-Z / Meme-culture inspired game announcer.
    If they did well (high score/accuracy), hype them up with slang (e.g., "Goated", "W", "Cracked").
    If they did poorly, lightly roast them or give funny "skill issue" feedback.
    
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A short, punchy, 2-5 word title for their rank (e.g., 'Absolute Legend' or 'Thumb Sprain')."
            },
            message: {
              type: Type.STRING,
              description: "A 1-2 sentence commentary on their performance."
            }
          },
          required: ["title", "message"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    
    return JSON.parse(text) as AICommentary;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      title: "Connection Glitch",
      message: "The AI is napping, but you still crushed it (probably)."
    };
  }
};