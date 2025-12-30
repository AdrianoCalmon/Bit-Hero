
import { GoogleGenAI, Type } from "@google/genai";
import { Note, SongMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSongPattern = async (theme: string): Promise<SongMetadata> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a rhythm game song pattern for a 16-bit game. 
               Theme: ${theme}. 
               The song should last about 30 seconds.
               Notes must be distributed across 4 lanes (0, 1, 2, 3).
               Notes timings should be in milliseconds, starting from 2000ms.
               Each note is a single tap hit.
               Include a cool title and genre based on the theme.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          genre: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ['EASY', 'MEDIUM', 'HARD'] },
          notes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                lane: { type: Type.INTEGER, description: "Lane index 0-3" },
                time: { type: Type.INTEGER, description: "Time in ms when hit occurs" }
              },
              required: ["lane", "time"]
            }
          }
        },
        required: ["title", "genre", "difficulty", "notes"]
      }
    }
  });

  const data = JSON.parse(response.text);
  
  // Transform to our internal Note format
  const notes: Note[] = data.notes.map((n: any, idx: number) => ({
    id: `note-${idx}`,
    lane: Math.min(3, Math.max(0, n.lane)),
    time: n.time,
    hit: false,
    missed: false
  })).sort((a: Note, b: Note) => a.time - b.time);

  return {
    ...data,
    notes
  };
};
