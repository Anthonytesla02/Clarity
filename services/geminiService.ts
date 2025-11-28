import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the structured decision analysis
const decisionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    winner: { type: Type.STRING, description: "The name of the best option." },
    confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100." },
    summary: { type: Type.STRING, description: "A concise summary of why this option wins." },
    factors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          weight: { type: Type.NUMBER, description: "Importance weight 1-10" },
          description: { type: Type.STRING }
        },
        required: ["name", "weight", "description"]
      }
    },
    scores: {
      type: Type.ARRAY,
      description: "Scores for each factor per option. Flattened list to be reconstructed.",
      items: {
        type: Type.OBJECT,
        properties: {
          factorName: { type: Type.STRING },
          optionName: { type: Type.STRING },
          score: { type: Type.NUMBER, description: "Score 0-100" },
          reasoning: { type: Type.STRING }
        },
        required: ["factorName", "optionName", "score", "reasoning"]
      }
    }
  },
  required: ["winner", "confidence", "summary", "factors", "scores"]
};

export const suggestOptions = async (dilemma: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user has a dilemma: "${dilemma}". Suggest 2-4 distinct, viable options they could take. Return only the options as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Error suggesting options:", error);
    return [];
  }
};

export const analyzeDecision = async (dilemma: string, options: string[]): Promise<AnalysisResult | null> => {
  try {
    const prompt = `
      Act as a super-intelligent decision scientist.
      The user is facing this dilemma: "${dilemma}".
      The available options are: ${options.join(', ')}.

      1. Break this decision down into 3-5 critical decision factors (e.g., Cost, Happiness, Risk, Long-term value).
      2. Assign a weight (1-10) to each factor based on the context of the dilemma.
      3. Evaluate EACH option against EACH factor with a score (0-100).
      4. Provide a reasoning for each score.
      5. Calculate a weighted winner.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Flash is fast enough for this structured task, Pro is overkill for structure but good for reasoning. 2.5 Flash is excellent.
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: decisionSchema,
        // Using a moderate thinking budget to ensure quality reasoning without waiting too long
        thinkingConfig: { thinkingBudget: 1024 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const rawData = JSON.parse(text);

    // Transform raw schema output to our internal App type
    // The schema returns a flat list of scores, we need to group them by factor for easier UI rendering
    const structuredScores: Record<string, any[]> = {};
    
    // Initialize structure
    rawData.factors.forEach((f: any) => {
        structuredScores[f.name] = [];
    });

    // Populate scores
    rawData.scores.forEach((s: any) => {
        if (structuredScores[s.factorName]) {
            structuredScores[s.factorName].push({
                optionName: s.optionName,
                score: s.score,
                reasoning: s.reasoning
            });
        }
    });

    // Calculate totals for the chart
    const overallScores = options.map(opt => {
        let total = 0;
        let maxPossible = 0;
        
        rawData.factors.forEach((f: any) => {
             const scoreObj = rawData.scores.find((s: any) => s.factorName === f.name && s.optionName === opt);
             if (scoreObj) {
                 total += scoreObj.score * f.weight;
                 maxPossible += 100 * f.weight;
             }
        });
        
        // Normalize to 0-100
        const normalized = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;
        
        return {
            optionName: opt,
            totalScore: normalized
        };
    }).sort((a, b) => b.totalScore - a.totalScore);

    return {
        winner: rawData.winner,
        confidence: rawData.confidence,
        summary: rawData.summary,
        factors: rawData.factors,
        scores: structuredScores,
        overallScores
    };

  } catch (error) {
    console.error("Error analyzing decision:", error);
    return null;
  }
};
