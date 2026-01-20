
import { GoogleGenAI } from "@google/genai";

export const fetchDailyHalakha = async (): Promise<string> => {
  try {
    // Fix: Initialize GoogleGenAI directly with process.env.API_KEY using named parameter as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
    
    // Fix: Use ai.models.generateContent to query GenAI with model name and prompt directly
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `היום ${today}. תן לי הלכה יומית אחת קצרה מאוד (עד 15 מילים) לבית כנסת. תכתוב בעברית יפה.`,
      config: {
        systemInstruction: "אתה מספק הלכות קצרות ומחזקות ללוח בית כנסת. רק הטקסט של ההלכה ללא כותרת.",
      },
    });

    // Fix: Access response.text as a property, not a method, as per guidelines
    return response.text?.trim() || "נא לשמור על קדושת המקום.";
  } catch (error) {
    console.error("Gemini Error:", error);
    const fallbacks = [
      "נא לשמור על קדושת המקום והשקט.",
      "סוף זמן קריאת שמע של שחרית הוא זמן קדוש.",
      "הווי רץ למצווה קלה כבחמורה.",
      "שמור על ניקיון בית הכנסת - זהו מקדש מעט."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};
