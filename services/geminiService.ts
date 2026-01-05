import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

// Initialize Gemini Client
// IMPORTANT: process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image of a hardware product to suggest details.
 */
export const analyzeProductImage = async (base64Image: string): Promise<Partial<Product>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Good for image analysis
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analyze this hardware shop item. Return a JSON object with:
            - name (short, professional product name)
            - category (e.g., Power Tools, Plumbing, Electrical, Fasteners, Hand Tools)
            - description (technical description suitable for a shop catalog, max 20 words)
            - suggestedPrice (estimated retail price in USD as a number)
            `
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
          },
          required: ['name', 'category', 'description', 'suggestedPrice']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw error;
  }
};

/**
 * Generates a business insight report based on sales data.
 */
export const generateBusinessReport = async (salesData: any[], inventoryStatus: any[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a senior business analyst for a hardware store called "Kashish Hardware".
      
      Here is the recent sales data (last 7 days):
      ${JSON.stringify(salesData.slice(0, 20))}
      
      Here is the current low stock inventory:
      ${JSON.stringify(inventoryStatus)}

      Provide a "Weekly Strategic Brief" (max 200 words). 
      Focus on:
      1. What is selling well?
      2. What needs immediate restocking?
      3. A marketing tip based on the trends.
      
      Format with Markdown headers.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      }
    });

    return response.text || "Unable to generate report.";
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "Error generating AI report. Please check API configuration.";
  }
};
